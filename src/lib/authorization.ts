import { UserProfile, Organization, Role, AppSlug, UserApplication } from "@/types";

/**
 * AUTHORIZATION PRIORITY HIERARCHY:
 * 1. Supabase Auth Identity (User must be authenticated)
 * 2. Database Profile (Profile record must exist)
 * 3. Active Status (profiles.is_active must be true)
 * 4. Application Active Status (applications.is_active must be true, unless Super Admin)
 * 5. Organization Boundary (Strict Entity Isolation: Zion != Immense Air)
 * 6. Role Defaults (Super Admin, Admin, Sales, Support, Operations)
 * 7. Individual Application Overrides (user_applications within entity boundary)
 * 8. Granular Permissions (role_permissions)
 * 9. PostgreSQL Row Level Security (Ultimate database-level enforcement)
 */

export interface AppRegistryItem {
  slug: AppSlug;
  name: string;
  organizationSlug: string;
  category: string;
  route: string;
  isActive: boolean;
}

export const REGISTERED_APPLICATIONS: Record<AppSlug, AppRegistryItem> = {
  "error-hub": {
    slug: "error-hub",
    name: "Error Code Intelligence Hub",
    organizationSlug: "immense-air",
    category: "Technical / Support",
    route: "/apps/error-hub",
    isActive: true,
  },
  "immense-quotes": {
    slug: "immense-quotes",
    name: "Immense Air Quotation Manager",
    organizationSlug: "immense-air",
    category: "Sales / Quotations",
    route: "/apps/immense-quotes",
    isActive: true,
  },
  "zion-quotes": {
    slug: "zion-quotes",
    name: "Zion Quotation Manager",
    organizationSlug: "zion",
    category: "Sales / Quotations",
    route: "/apps/zion-quotes",
    isActive: true,
  },
};

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
 * Inactive applications are blocked for all non-Super Admin users.
 */
export function canAccessApplication(
  profile: UserProfile | null | undefined,
  organization: Organization | null | undefined,
  role: Role | null | undefined,
  appSlug: AppSlug,
  userApplications: UserApplication[] = [],
  permissions: string[] = [],
  appRegistry = REGISTERED_APPLICATIONS
): boolean {
  // 1, 2, 3: Must be active and hold profile
  if (!profile || !profile.isActive || !organization || !role) {
    return false;
  }

  // Check Application Active Status
  const appItem = appRegistry[appSlug];
  if (!appItem) return false;
  
  // If application is inactive, only Super Admin can inspect it
  if (!appItem.isActive && role.name !== "Super Admin") {
    return false;
  }

  // Super Admin has universal access
  if (role.name === "Super Admin") {
    return true;
  }

  const appOrgSlug = appItem.organizationSlug;

  // 4. Strict Organization Boundary Check
  // Zion users cannot access Immense Air apps; Immense Air users cannot access Zion apps
  if (organization.slug !== appOrgSlug) {
    return false;
  }

  // 5. Check individual user application overrides (within the permitted organization)
  const hasUserOverride = userApplications.some((ua) => {
    return ua.applicationId === appSlug || (ua as any).appSlug === appSlug;
  });
  if (hasUserOverride) {
    return true;
  }

  // 6. Role Defaults Evaluation:
  if (organization.slug === "immense-air") {
    if (role.name === "Admin") {
      return appSlug === "error-hub" || appSlug === "immense-quotes";
    }
    if (role.name === "Support" || role.name === "Operations") {
      return appSlug === "error-hub";
    }
    if (role.name === "Sales") {
      return appSlug === "immense-quotes";
    }
  }

  if (organization.slug === "zion") {
    if (role.name === "Admin" || role.name === "Sales") {
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
  permissions: string[] = [],
  appRegistry = REGISTERED_APPLICATIONS
): boolean {
  if (!profile || !profile.isActive || !role) return false;

  // Public/always allowed if active
  if (routePath === "/" || routePath === "/workspace" || routePath === "/access-denied") {
    return true;
  }

  // Admin Console routes
  if (routePath === "/admin" || routePath.startsWith("/admin/")) {
    return isAdmin(role);
  }

  // Application routes
  if (routePath === "/apps/error-hub") {
    return canAccessApplication(profile, organization, role, "error-hub", userApplications, permissions, appRegistry);
  }
  if (routePath === "/apps/immense-quotes") {
    return canAccessApplication(profile, organization, role, "immense-quotes", userApplications, permissions, appRegistry);
  }
  if (routePath === "/apps/zion-quotes") {
    return canAccessApplication(profile, organization, role, "zion-quotes", userApplications, permissions, appRegistry);
  }

  return false;
}
