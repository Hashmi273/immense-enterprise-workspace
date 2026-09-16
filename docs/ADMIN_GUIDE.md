# Immense Enterprise Workspace — Administrator Guide

This guide is intended for **System Administrators** and **Super Administrators** managing security, users, and audit compliance across the Central Workspace.

---

## 1. Admin Console Overview (`/admin`)

The Admin Console provides unified governance across all organizations and applications:

- **Dashboard (`/admin`)**: Real-time KPI summary of provisioned users, active accounts, application assignments, and security audit volume.
- **Users (`/admin/users`)**: User lifecycle management (creation, deactivation, role assignment).
- **Applications (`/admin/apps`)**: Catalog of registered enterprise applications and status toggles.
- **Roles & Permissions (`/admin/roles`)**: Granular role-to-permission mapping and permission codes.
- **Organizations (`/admin/organizations`)**: Entity hierarchy management (`central`, `immense-air`, `zion`).
- **Audit Logs (`/admin/audit-logs`)**: Centralized, tamper-proof security and operation audit trail.

---

## 2. User Lifecycle Management

### Provisioning New Users
1. Go to **Admin Console -> Users**.
2. Click **Add New User**.
3. Provide:
   - **Full Name**: Legal name of staff member.
   - **Work Email**: Official enterprise email (e.g. `user@immenseair.in` or `user@zionmarketing.in`).
   - **Organization**: Assign strictly to `Immense Air Pvt Ltd` or `Zion`.
   - **Role**: Select `Admin`, `Sales`, `Support`, or `Operations`.
4. Click **Create User**.
5. The creation event is immediately logged to the audit log (`USER_CREATED`).

### Deactivating Accounts (Quarantine / Offboarding)
- When an employee departs or an account is compromised, click **Deactivate** next to the user.
- Setting `is_active = false` **immediately revokes all access** across the frontend and PostgreSQL RLS.
- Inactive users are rejected by all route guards and database policies regardless of their assigned role.

### Reactivating Accounts
- Click **Reactivate** on an inactive user record to restore their access.
- An audit event (`USER_REACTIVATED`) is recorded.

---

## 3. Application Overrides (`user_applications`)

While roles define baseline application permissions, administrators can grant individual application overrides within an organization's boundaries:

- **Permitted Override Example**: An Immense Air Sales user can be granted access to the `Error Code Intelligence Hub` via a user application override.
- **Strict Tenant Enforcement**: A Zion user **cannot** be granted access to an Immense Air application even if an override is attempted. The authorization engine and PostgreSQL RLS will reject cross-tenant overrides.

---

## 4. Centralized Audit Log Console (`/admin/audit-logs`)

The Audit Console provides an immutable record of all security-sensitive operations.

### Audit Features:
1. **Category Filtering**:
   - *All Categories*
   - *Quotation Lifecycle* (`QUOTATION_CREATED`, `QUOTATION_EDITED`, `QUOTATION_DOWNLOADED`, `QUOTATION_DELETED`)
   - *Authentication* (`LOGIN_SUCCESS`, `LOGIN_FAILED`, `LOGOUT`, `PASSWORD_CHANGED`)
   - *Access & Authorization* (`APP_LAUNCH`, `ACCESS_DENIED`)
   - *User Administration* (`USER_CREATED`, `USER_DEACTIVATED`, `USER_REACTIVATED`)
2. **Outcome Filtering**:
   - Filter by `SUCCESS`, `DENIED`, or `FAILED`.
3. **Keyword Search**:
   - Search across user email, action name, or target ID.
4. **Sanitized Metadata Modal**:
   - Click **View Metadata** on any event to inspect clean JSON details.
   - All passwords, tokens, API keys, and session secrets are scrubbed prior to writing.

### Audit Immutability:
- The `audit_logs` table in PostgreSQL has **NO UPDATE** and **NO DELETE** policies.
- Audit records cannot be altered or removed by any user or administrator.

---

## 5. Security Responsibilities

- **Principle of Least Privilege**: Grant users the minimum role required for their daily duties.
- **Tenant Integrity**: Do not attempt to assign users to foreign organizations.
- **Credential Hygiene**: Encourage strong passwords (14+ characters) and regular credential rotation.
- **Never Expose Service Keys**: Never deploy or use Supabase service-role keys in frontend code.