export type OrganizationSlug = "immense-air" | "zion" | "central";

export interface Organization {
  id: string;
  name: string;
  slug: OrganizationSlug;
  createdAt: string;
}

export type RoleName = "Super Admin" | "Admin" | "Sales" | "Support" | "Operations";

export interface Role {
  id: string;
  name: RoleName;
  description: string;
  isSystem: boolean;
}

export type AppSlug = "error-hub" | "immense-quotes" | "zion-quotes";

export interface Application {
  id: string;
  name: string;
  slug: AppSlug;
  description: string;
  organizationId: string | null; // null if cross-tenant or admin
  route: string;
  icon: string;
  isActive: boolean;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  organizationId: string;
  organization?: Organization;
  roleId: string;
  role?: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserApplication {
  id: string;
  userId: string;
  applicationId: string;
  grantedBy: string;
  createdAt: string;
  expiresAt?: string | null;
}

export interface AuditLog {
  id: string;
  userId: string | null;
  userEmail: string;
  organizationId: string | null;
  applicationId: string | null;
  action: string;
  result: "SUCCESS" | "DENIED" | "FAILED";
  ipAddress?: string;
  details?: Record<string, any>;
  createdAt: string;
}
