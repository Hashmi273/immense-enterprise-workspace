# Immense Enterprise Workspace — Architecture Documentation

This document describes the security model, system boundaries, and architectural patterns implemented in **Immense Enterprise Workspace**.

---

## 1. High-Level System Architecture

```text
                                User
                                  │
                                  ▼
                         Supabase Auth (JWT)
                                  │
                                  ▼
                     Database Profile Lookup
                 (profiles: org_id, role_id, is_active)
                                  │
                                  ▼
                   Central Authorization Engine
                     (src/lib/authorization.ts)
                                  │
                                  ▼
                      Application Route Guards
                   (/workspace, /apps/*, /admin/*)
                                  │
                                  ▼
                 Authoritative PostgreSQL RLS Boundary
                  (USING (organization_id = user_org_id))
                                  │
                                  ▼
                  Entity-Isolated PostgreSQL Tables
                  (quotations, audit_logs, profiles)
```

---

## 2. Core Security Layers

### Layer 1: Supabase Authentication
- Handles cryptographic identity validation via JWT tokens.
- Secure email/password verification and recovery workflows.
- Session persistence and auto-restoration across page reloads.

### Layer 2: Central Authorization Engine (`src/lib/authorization.ts`)
- Client-side gatekeeper enforcing zero-flicker UX and intuitive access denial.
- Authorization priority hierarchy:
  1. Supabase Auth Identity (User must be authenticated).
  2. Database Profile (Profile record must exist).
  3. Active Status (`profiles.is_active` must be `true`).
  4. Application Active Status (`applications.is_active` must be `true`).
  5. Organization Boundary (Strict Entity Isolation: `zion` != `immense-air`).
  6. Role Defaults (`Super Admin`, `Admin`, `Sales`, `Support`, `Operations`).
  7. Individual Application Overrides (`user_applications` within tenant).
  8. Granular Permissions (`role_permissions`).
  9. PostgreSQL Row Level Security (Ultimate authoritative enforcement).

### Layer 3: Authoritative PostgreSQL Row Level Security (RLS)
- The database is the **uncompromising final security boundary**.
- Even if a client modifies JavaScript state, localStorage, or crafts manual HTTP requests, PostgreSQL RLS evaluates:
  - `auth.uid()` from the verified Supabase Auth JWT.
  - `public.get_current_user_org_id()` directly from PostgreSQL relations.
  - `public.is_org_admin()` and `public.is_super_admin()`.
- Cross-tenant queries return `0 rows` or fail with access denied.

---

## 3. Entity & Tenant Isolation Model

The workspace operates as a multi-tenant enterprise system with 3 recognized organizations:

| Organization | Slug | Purpose | Permitted Applications |
| :--- | :--- | :--- | :--- |
| **Central Enterprise** | `central` | Corporate governance & security | Admin Console (Super Admin) |
| **Immense Air Pvt Ltd** | `immense-air` | CPaaS, SMS, Voice, Telephony | Immense Quotes, Error Code Hub |
| **Zion** | `zion` | Marketing & bespoke messaging | Zion Quotation Manager |

### Cross-Tenant Isolation Rules:
- **No Cross-Entity Application Access**: A Zion user can **never** launch Immense Quotes or Error Hub.
- **No Cross-Entity Data Visibility**: A Zion user can **never** view or query Immense Air quotations.
- **No Cross-Entity Administration**: An Immense Admin can **never** manage Zion users or view Zion audit logs.

---

## 4. Centralized Audit Logging Architecture

```text
   Client Action (Login, App Launch, Quotation, User Admin)
                             │
                             ▼
                 Sanitizer (src/lib/audit.ts)
   (Recursively strips passwords, tokens, API keys, cookies)
                             │
                             ▼
            PostgreSQL Table: public.audit_logs
       (RLS Enforced: Append-Only, No UPDATE, No DELETE)
```

### Tamper-Proof Audit Properties:
- **Append-Only**: No UPDATE or DELETE policies exist in PostgreSQL schema.
- **Secret Stripping**: Recursive key scrub ensures zero secrets or credentials reach database logs.
- **Tenant-Scoped Audit Visibility**: Entity admins can only query audit logs where `organization_id` matches their own entity.

---

## 5. Absolute Production Isolation

The Central Workspace is completely independent of the original production applications:

```text
[Existing Production Systems - UNTOUCHED]
├── immensesolutions-quotes (Standalone production repo)
├── zion-qutiotion-         (Standalone production repo)
└── SMS-ERROR-CODE          (Standalone production repo)

[New Standalone System]
└── immense-enterprise-workspace
    ├── src/apps/error-hub/        (Self-contained integration)
    ├── src/apps/immense-quotes/   (Self-contained integration)
    └── src/apps/zion-quotes/      (Self-contained integration)
```

No production code, repository, deployment, or database was modified or connected during this project.