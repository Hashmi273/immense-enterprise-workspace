import { UserProfile, Organization, Role, AppSlug, UserApplication } from "@/types";

/**
 * AUTHORIZATION PRIORITY HIERARCHY:
 * 1. Supabase Auth Identity (User must be authenticated)
 * 2. Database Profile (Profile record must exist)
 * 3. Active Status (profiles.is_active must be true)
 * 4. Organization Boundary (Entity isolation: Zion != Immense Air)
 * 5. Role Defaults (Super Admin, Admin, Sales, Support, Operations)
 * 6. Individual Application Overrides (user_applications within entity boundary)
 * 7. Granular Permissions (role_permissions)
 * 8. PostgreSQL Row Level Security (Ultimate database-level enforcement)
 */

export const APPLICATION_ORGANIZATIONS: Record<AppSlug, string> = {
  "error-hub": "immense-air",
  "immense-quotes": "immense-air",
  "zion-quotes": "zion",
};

/**
 * Checks if the current role is Super Admin
 */
export function isSuperAdmin(role: Role | null | undefined): boolean {
  if (!role) return false;
  return role.name === "Super Admin";
}

/**
 * Checks if the current role is Admin or Super Admin
 */
export function isAdmin(role: Role | null | undefined): boolean {
  if (!role) return false;
  return role.name === "Super Admin" || role.name === "Admin";
}

/**
 * Checks if user is Admin of a specific organization (or Super Admin)
 */
export function isOrgAdmin(
  profile: UserProfile | null | undefined,
  role: Role | null | undefined,
  targetOrgId: string
): boolean {
  if (!profile || !profile.isActive || !role) return false;
  if (role.name === "Super Admin") return true;
  return role.name === "Admin" && profile.organizationId === targetOrgId;
}

/**
 * Evaluates whether a user can access a specific application.
 * Enforces organization boundaries strictly:
 * A Zion user can NEVER access Immense Air applications, even if an override is erroneously assigned.
 */
export function canAccessApplication(
  profile: UserProfile | null | undefined,
  organization: Organization | null | undefined,
  role: Role | null | undefined,
  appSlug: AppSlug,
  userApplications: UserApplication[] = [],
  permissions: string[] = []
): boolean {
  // 1, 2, 3: Must be active and hold profile
  if (!profile || !profile.isActive || !organization || !role) {
    return false;
  }

  // Super Admin has universal access
  if (role.name === "Super Admin") {
    return true;
  }

  const appOrgSlug = APPLICATION_ORGANIZATIONS[appSlug];
  if (!appOrgSlug) return false;

  // 4. Strict Organization Boundary Check
  // Zion users cannot access Immense Air apps; Immense Air users cannot access Zion apps
  if (organization.slug !== appOrgSlug) {
    return false;
  }

  // 5. Check individual user application overrides (within the permitted organization)
  const hasUserOverride = userApplications.some((ua) => {
    // Overrides can only apply if the application matches the organization
    return ua.applicationId === appSlug || (ua as any).appSlug === appSlug;
  });
  if (hasUserOverride) {
    return true;
  }

  // 6. Role Defaults Evaluation:
  if (organization.slug === "immense-air") {
    if (role.name === "Admin") {
      // Immense Admin gets both Immense apps
      return appSlug === "error-hub" || appSlug === "immense-quotes";
    }
    if (role.name === "Support" || role.name === "Operations") {
      // Support and Ops get Error Hub
      return appSlug === "error-hub";
    }
    if (role.name === "Sales") {
      // Immense Sales gets Immense Quotations
      return appSlug === "immense-quotes";
    }
  }

  if (organization.slug === "zion") {
    if (role.name === "Admin" || role.name === "Sales") {
      // Zion Admin and Zion Sales get Zion Quotations
      return appSlug === "zion-quotes";
    }
  }

  // 7. Granular Permission fallback
  if (appSlug === "error-hub" && permissions.includes("access_error_hub")) {
    return true;
  }
  if (appSlug === "immense-quotes" && permissions.includes("view_quotation") && organization.slug === "immense-air") {
    return true;
  }
  if (appSlug === "zion-quotes" && permissions.includes("view_quotation") && organization.slug === "zion") {
    return true;
  }

  return false;
}

/**
 * Checks if a user has a specific granular permission code
 */
export function hasPermission(
  profile: UserProfile | null | undefined,
  role: Role | null | undefined,
  permissions: string[],
  permissionCode: string
): boolean {
  if (!profile || !profile.isActive || !role) return false;
  if (role.name === "Super Admin") return true;
  return permissions.includes(permissionCode);
}

/**
 * Evaluates route-level access based on destination path
 */
export function canAccessRoute(
  profile: UserProfile | null | undefined,
  organization: Organization | null | undefined,
  role: Role | null | undefined,
  routePath: string,
  userApplications: UserApplication[] = [],
  permissions: string[] = []
): boolean {
  if (!profile || !profile.isActive || !role) return false;

  // Public/always allowed if active
  if (routePath === "/" || routePath === "/workspace" || routePath === "/access-denied") {
    return true;
  }

  // Admin Console routes
  if (routePath.startsWith("/admin")) {
    return isAdmin(role);
  }

  // Application routes
  if (routePath === "/apps/error-hub") {
    return canAccessApplication(profile, organization, role, "error-hub", userApplications, permissions);
  }
  if (routePath === "/apps/immense-quotes") {
    return canAccessApplication(profile, organization, role, "immense-quotes", userApplications, permissions);
  }
  if (routePath === "/apps/zion-quotes") {
    return canAccessApplication(profile, organization, role, "zion-quotes", userApplications, permissions);
  }

  return false;
}
