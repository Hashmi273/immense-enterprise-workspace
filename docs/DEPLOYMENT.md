# Immense Enterprise Workspace — Production Deployment Guide

**Target Portal**: `portal.immense.in`  
**Application**: `immense-enterprise-workspace`  
**Architecture**: React 18 + Vite + Tailwind CSS + Supabase (PostgreSQL 15+ RLS)

---

## 1. Prerequisites & Environment Setup

### Required Tooling
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- **Supabase Project**: Dedicated, standalone Supabase PostgreSQL instance

### Local Development
```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Access local instance
# Default: http://localhost:5173
```

### Production Build
```bash
# Compile TypeScript & bundle production assets
npm run build

# Output directory: dist/
```

### Local Production Preview
```bash
# Preview the production build locally
npm run preview
```

---

## 2. Environment Variables Configuration

Create `.env.production` (or inject via CI/CD / hosting provider environment settings):

```ini
# ==============================================================================
# IMMENSE ENTERPRISE WORKSPACE ENVIRONMENT CONFIGURATION
# ==============================================================================

# Supabase Project URL
VITE_SUPABASE_URL=https://your-project-id.supabase.co

# Supabase Public Anonymous API Key (Anon Key)
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...public_anon_key_only
```

> [!CAUTION]
> **CRITICAL SECURITY REQUIREMENT**:
> - **NEVER** expose `SUPABASE_SERVICE_ROLE_KEY` or `service_role` in frontend environment variables.
> - Any variable prefixed with `VITE_` is compiled into the client-side JavaScript bundle and publicly visible.

---

## 3. Dedicated Supabase Project Setup

### Step 1: Create Dedicated Project
1. Create a brand new, dedicated project on [Supabase](https://supabase.com) named `immense-enterprise-workspace`.
2. Do **not** reuse existing production database instances (`immensesolutions-quotes`, `zion-qutiotion-`, or `SMS-ERROR-CODE`).

### Step 2: Apply Database Schema & RLS Migration
1. In the Supabase Dashboard, navigate to the **SQL Editor**.
2. Open and execute the approved migration file:
   `supabase/migrations/001_initial_schema_and_rls.sql`
3. Verify creation of all **9 Core Tables**:
   - `organizations`
   - `roles`
   - `permissions`
   - `role_permissions`
   - `applications`
   - `profiles`
   - `user_applications`
   - `quotations`
   - `audit_logs`

### Step 3: Verify Row Level Security (RLS)
Execute the verification script in SQL Editor:
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```
*All 9 tables must return `rowsecurity = true`.*

### Step 4: Configure Supabase Authentication
1. Navigate to **Authentication -> URL Configuration**.
2. Set **Site URL** to: `https://portal.immense.in`
3. Set **Redirect URLs** to:
   - `https://portal.immense.in/reset-password`
   - `https://portal.immense.in/login`
   - `http://localhost:5173/reset-password` (for staging/testing)

---

## 4. Secure Initial Super Admin Provisioning

Do **NOT** use hardcoded admin passwords or script default passwords into the database.

### Recommended Secure Provisioning Process:
1. In Supabase Dashboard -> **Authentication -> Users**, click **Add User** -> **Create User**.
2. Enter the Super Admin's enterprise email and generate a strong 20+ character random password.
3. Retrieve the generated user UUID (`auth.uid()`).
4. Execute the following SQL snippet in the Supabase SQL Editor to bind the identity to the Central Organization and Super Admin role:

```sql
DO $$
DECLARE
    target_user_id UUID := 'REPLACE_WITH_SUPABASE_AUTH_USER_UUID';
    central_org_id UUID;
    super_admin_role_id UUID;
BEGIN
    SELECT id INTO central_org_id FROM public.organizations WHERE slug = 'central';
    SELECT id INTO super_admin_role_id FROM public.roles WHERE name = 'Super Admin';

    INSERT INTO public.profiles (id, full_name, email, organization_id, role_id, is_active)
    VALUES (
        target_user_id,
        'Enterprise Super Admin',
        'admin@immense.in',
        central_org_id,
        super_admin_role_id,
        true
    )
    ON CONFLICT (id) DO UPDATE SET
        organization_id = EXCLUDED.organization_id,
        role_id = EXCLUDED.role_id,
        is_active = true;
END $$;
```

---

## 5. Domain & SPA Routing Configuration

### Domain & DNS Setup: `portal.immense.in`
1. Configure DNS records with your DNS registrar / Cloudflare:
   - **Type**: `CNAME`
   - **Name**: `portal`
   - **Target**: Hosting provider endpoint (e.g. `cname.vercel-dns.com`, Cloudflare Pages, AWS CloudFront, etc.)
2. Ensure **SSL/TLS** is set to **Full / Strict HTTPS**.

### Single Page Application (SPA) Fallback Rewrite
Because React Router handles routing on the client side, direct requests to `/workspace`, `/admin`, `/apps/immense-quotes`, etc., must be rewritten to `/index.html` to avoid 404 errors.

#### Nginx Configuration:
```nginx
server {
    listen 443 ssl http2;
    server_name portal.immense.in;
    root /var/www/immense-enterprise-workspace/dist;
    index index.html;

    # Security Headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header X-Frame-Options "DENY" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
```

#### Netlify Configuration (`public/_redirects`):
```text
/*    /index.html   200
```

#### Vercel Configuration (`vercel.json`):
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 6. Security Headers & Host Hardening

| Header | Recommended Production Value | Purpose |
| :--- | :--- | :--- |
| **Strict-Transport-Security** | `max-age=31536000; includeSubDomains; preload` | Enforce HTTPS exclusively |
| **X-Content-Type-Options** | `nosniff` | Prevent MIME confusion attacks |
| **X-Frame-Options** | `DENY` | Prevent clickjacking |
| **Referrer-Policy** | `strict-origin-when-cross-origin` | Protect token leakage across origins |
| **Permissions-Policy** | `camera=(), microphone=(), geolocation=()` | Restrict unneeded browser hardware APIs |
| **Content-Security-Policy** | `default-src 'self'; script-src 'self'; connect-src 'self' https://*.supabase.co; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:;` | Restrict code execution and network destinations |

---

## 7. Rollback Protocol

If an unexpected issue occurs during deployment:
```bash
# 1. Identify previous stable commit
git log -n 5 --oneline

# 2. Reset or revert cleanly
git checkout <PREVIOUS_COMMIT_HASH>

# 3. Rebuild and redeploy
npm run build
```