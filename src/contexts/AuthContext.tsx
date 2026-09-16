import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { UserProfile, Organization, Role, AppSlug, UserApplication } from "@/types";
import { logAuditEvent } from "@/lib/audit";
import { 
  canAccessApplication, 
  hasPermission as checkPermission, 
  canAccessRoute as checkRoute,
  isAdmin as checkIsAdmin,
  isSuperAdmin as checkIsSuperAdmin
} from "@/lib/authorization";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  organization: Organization | null;
  role: Role | null;
  permissions: string[];
  userApplications: UserApplication[];
  loading: boolean;
  accountDisabledError: string | null;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  hasPermission: (code: string) => boolean;
  canAccessApp: (slug: AppSlug) => boolean;
  canAccessRoute: (route: string) => boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [userApplications, setUserApplications] = useState<UserApplication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [accountDisabledError, setAccountDisabledError] = useState<string | null>(null);

  /**
   * Fetches user profile, organization, role, permissions, and application overrides
   * strictly from the authoritative Supabase PostgreSQL database.
   */
  const fetchUserProfile = useCallback(async (authUser: User): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          id,
          full_name,
          email,
          organization_id,
          role_id,
          is_active,
          created_at,
          updated_at,
          organizations (id, name, slug, created_at),
          roles (id, name, description, created_at)
        `)
        .eq("id", authUser.id)
        .single();

      if (error || !data) {
        console.warn("[Auth] Could not load profile for authenticated user:", error?.message);
        setProfile(null);
        setOrganization(null);
        setRole(null);
        setPermissions([]);
        setUserApplications([]);
        return false;
      }

      // Inactive user quarantine check
      if (!data.is_active) {
        console.warn("[Auth] Inactive account detected in database.");
        setAccountDisabledError(
          "Your account has been deactivated by an enterprise administrator. Contact support@immenseair.in."
        );
        await logAuditEvent({
          action: "USER_BLOCKED_INACTIVE",
          userId: authUser.id,
          organizationId: data.organization_id,
          metadata: { email: authUser.email, reason: "Account is marked inactive in profiles" },
        });
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        setOrganization(null);
        setRole(null);
        setPermissions([]);
        setUserApplications([]);
        return false;
      }

      setAccountDisabledError(null);

      let orgData: any = Array.isArray(data.organizations) ? data.organizations[0] : data.organizations;
      if (!orgData && data.organization_id) {
        const { data: directOrg } = await supabase
          .from("organizations")
          .select("id, name, slug, created_at")
          .eq("id", data.organization_id)
          .single();
        orgData = directOrg;
      }

      let roleData: any = Array.isArray(data.roles) ? data.roles[0] : data.roles;
      if (!roleData && data.role_id) {
        const { data: directRole } = await supabase
          .from("roles")
          .select("id, name, description, created_at")
          .eq("id", data.role_id)
          .single();
        roleData = directRole;
      }

      const loadedOrg: Organization | null = orgData
        ? {
            id: orgData.id,
            name: orgData.name,
            slug: orgData.slug,
            createdAt: orgData.created_at,
          }
        : null;

      const loadedRole: Role | null = roleData
        ? {
            id: roleData.id,
            name: roleData.name,
            description: roleData.description,
            isSystem: true,
          }
        : null;

      // Fetch granular permissions mapped to this role
      let loadedPerms: string[] = [];
      try {
        const { data: permData } = await supabase
          .from("role_permissions")
          .select("permissions (code)")
          .eq("role_id", data.role_id);

        if (permData) {
          loadedPerms = permData
            .map((item: any) => item.permissions?.code)
            .filter(Boolean);
        }
      } catch (pErr) {
        console.warn("[Auth] Non-fatal: could not query role_permissions:", pErr);
      }

      // Fetch individual user application overrides
      let loadedUserApps: UserApplication[] = [];
      try {
        const { data: userAppsData } = await supabase
          .from("user_applications")
          .select("id, user_id, application_id, granted_by, created_at, applications (slug)")
          .eq("user_id", authUser.id);

        if (userAppsData) {
          loadedUserApps = userAppsData.map((ua: any) => ({
            id: ua.id,
            userId: ua.user_id,
            applicationId: ua.applications?.slug || ua.application_id,
            grantedBy: ua.granted_by,
            createdAt: ua.created_at,
          }));
        }
      } catch (uaErr) {
        console.warn("[Auth] Non-fatal: could not query user_applications:", uaErr);
      }

      const userProfile: UserProfile = {
        id: data.id,
        fullName: data.full_name,
        email: data.email,
        organizationId: data.organization_id,
        organization: loadedOrg ?? undefined,
        roleId: data.role_id,
        role: loadedRole ?? undefined,
        isActive: data.is_active,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      setProfile(userProfile);
      setOrganization(loadedOrg);
      setRole(loadedRole);
      setPermissions(loadedPerms);
      setUserApplications(loadedUserApps);
      return true;
    } catch (err) {
      console.error("[Auth] Unexpected error loading profile:", err);
      return false;
    }
  }, []);

  // Initialize session and auth listener
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && mounted) {
          setUser(session.user);
          await fetchUserProfile(session.user);
        }
      } catch (err) {
        console.error("[Auth] Error checking initial session:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session: Session | null) => {
        if (!mounted) return;

        if (event === "SIGNED_IN" && session?.user) {
          setUser(session.user);
          setLoading(true);
          await fetchUserProfile(session.user);
          setLoading(false);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setProfile(null);
          setOrganization(null);
          setRole(null);
          setPermissions([]);
          setUserApplications([]);
          setLoading(false);
        } else if (event === "USER_UPDATED" && session?.user) {
          setUser(session.user);
          await fetchUserProfile(session.user);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUserProfile]);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setAccountDisabledError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        await logAuditEvent({
          action: "LOGIN_FAILED",
          metadata: { email: email.trim(), error: error.message },
        });
        setLoading(false);
        return { error };
      }

      if (data.user) {
        setUser(data.user);
        const active = await fetchUserProfile(data.user);
        if (!active) {
          setLoading(false);
          return { error: new Error("Account is inactive or profile could not be loaded.") };
        }

        await logAuditEvent({
          action: "LOGIN_SUCCESS",
          userId: data.user.id,
          organizationId: data.user.user_metadata?.organization_id,
          metadata: { email: data.user.email },
        });
      }

      setLoading(false);
      return { error: null };
    } catch (err: any) {
      setLoading(false);
      return { error: err };
    }
  };

  const signOut = async () => {
    try {
      if (user) {
        await logAuditEvent({
          action: "LOGOUT",
          userId: user.id,
          organizationId: organization?.id,
          metadata: { email: user.email },
        });
      }
      await supabase.auth.signOut();
    } finally {
      setUser(null);
      setProfile(null);
      setOrganization(null);
      setRole(null);
      setPermissions([]);
      setUserApplications([]);
      setAccountDisabledError(null);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const redirectUrl = `${window.location.origin}/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectUrl,
      });

      await logAuditEvent({
        action: "PASSWORD_RESET_REQUESTED",
        metadata: { email: email.trim(), successful: !error },
      });

      return { error };
    } catch (err: any) {
      return { error: err };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (!error && user) {
        await logAuditEvent({
          action: "PASSWORD_CHANGED",
          userId: user.id,
          organizationId: organization?.id,
          metadata: { email: user.email },
        });
      }

      return { error };
    } catch (err: any) {
      return { error: err };
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchUserProfile(user);
    }
  };

  // Helper bindings to centralized authorization engine
  const hasPerm = (code: string) => checkPermission(profile, role, permissions, code);
  const canApp = (slug: AppSlug) => canAccessApplication(profile, organization, role, slug, userApplications, permissions);
  const canRoute = (route: string) => checkRoute(profile, organization, role, route, userApplications, permissions);
  const isAdmin = checkIsAdmin(role);
  const isSuperAdmin = checkIsSuperAdmin(role);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        organization,
        role,
        permissions,
        userApplications,
        loading,
        accountDisabledError,
        isAdmin,
        isSuperAdmin,
        hasPermission: hasPerm,
        canAccessApp: canApp,
        canAccessRoute: canRoute,
        signIn,
        signOut,
        resetPassword,
        updatePassword,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
