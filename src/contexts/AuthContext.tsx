import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { UserProfile, Organization, Role } from "@/types";
import { logAuditEvent } from "@/lib/audit";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  organization: Organization | null;
  role: Role | null;
  loading: boolean;
  accountDisabledError: string | null;
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
  const [loading, setLoading] = useState<boolean>(true);
  const [accountDisabledError, setAccountDisabledError] = useState<string | null>(null);

  /**
   * Fetches user profile, organization, and role strictly from the PostgreSQL database.
   * Frontend state is derived exclusively from the authoritative database record.
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
          organizations:organization_id (id, name, slug, created_at),
          roles:role_id (id, name, description, created_at)
        `)
        .eq("id", authUser.id)
        .single();

      if (error || !data) {
        console.warn("[Auth] Could not load profile for authenticated user:", error?.message);
        setProfile(null);
        setOrganization(null);
        setRole(null);
        return false;
      }

      // Check Inactive Account Status: Enforce strict database-driven access blocking
      if (!data.is_active) {
        console.warn("[Auth] Inactive user detected. Blocking workspace access.");
        setAccountDisabledError(
          "Your account has been deactivated by an enterprise administrator. Contact support@immenseair.in."
        );
        await logAuditEvent({
          action: "USER_BLOCKED_INACTIVE",
          userId: authUser.id,
          organizationId: data.organization_id,
          metadata: { email: authUser.email, reason: "Account is inactive in profiles table" },
        });
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        setOrganization(null);
        setRole(null);
        return false;
      }

      // Clear any prior disabled error
      setAccountDisabledError(null);

      const orgData = Array.isArray(data.organizations) ? data.organizations[0] : data.organizations;
      const roleData = Array.isArray(data.roles) ? data.roles[0] : data.roles;

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
      return true;
    } catch (err) {
      console.error("[Auth] Unexpected error loading profile:", err);
      return false;
    }
  }, []);

  // Initialize session and attach persistent auth listener
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

    // Listen for auth state changes (login, logout, token refresh, password recovery)
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

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        organization,
        role,
        loading,
        accountDisabledError,
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
