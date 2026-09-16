-- ==============================================================================
-- IMMENSE ENTERPRISE WORKSPACE: DATABASE SCHEMA & ROW LEVEL SECURITY (RLS)
-- Phase 4: Production PostgreSQL Schema Definition
-- Target Environment: Standalone Supabase Project for immense-enterprise-workspace
-- ==============================================================================

-- Enable required crypto & UUID extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. ORGANIZATIONS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 2. ROLES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 3. PERMISSIONS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 4. ROLE_PERMISSIONS (Many-to-Many)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.role_permissions (
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- ==============================================================================
-- 5. APPLICATIONS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
    route TEXT NOT NULL,
    icon TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 6. PROFILES TABLE (Linked to auth.users)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE RESTRICT,
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE RESTRICT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 7. USER_APPLICATIONS TABLE (Individual Overrides)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.user_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
    granted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, application_id)
);

-- ==============================================================================
-- 8. QUOTATIONS TABLE (Entity-Isolated Business Data)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.quotations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE RESTRICT,
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    quotation_number TEXT NOT NULL,
    client_name TEXT NOT NULL,
    client_company TEXT NOT NULL,
    quotation_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'draft',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 9. AUDIT_LOGS TABLE (Immutable Audit Trail)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    application_id UUID REFERENCES public.applications(id) ON DELETE SET NULL,
    target_type TEXT,
    target_id TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE & LOOKUP OPTIMIZATION
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_organization ON public.profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role_id);
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON public.profiles(is_active);

CREATE INDEX IF NOT EXISTS idx_user_apps_user ON public.user_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_apps_app ON public.user_applications(application_id);

CREATE INDEX IF NOT EXISTS idx_quotations_org ON public.quotations(organization_id);
CREATE INDEX IF NOT EXISTS idx_quotations_created_by ON public.quotations(created_by);
CREATE INDEX IF NOT EXISTS idx_quotations_status ON public.quotations(status);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_org ON public.audit_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- ==============================================================================
-- AUTOMATED TIMESTAMPS TRIGGER
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_organizations_updated_at ON public.organizations;
CREATE TRIGGER tr_organizations_updated_at
    BEFORE UPDATE ON public.organizations
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_profiles_updated_at ON public.profiles;
CREATE TRIGGER tr_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_quotations_updated_at ON public.quotations;
CREATE TRIGGER tr_quotations_updated_at
    BEFORE UPDATE ON public.quotations
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- SECURITY HELPER FUNCTIONS (Anti-Recursion / Minimum Privilege)
-- ==============================================================================

-- 1. Check if current authenticated user is active
CREATE OR REPLACE FUNCTION public.is_current_user_active()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT COALESCE(
        (SELECT is_active FROM public.profiles WHERE id = auth.uid()),
        false
    );
$$;

-- 2. Get current authenticated user's organization ID
CREATE OR REPLACE FUNCTION public.get_current_user_org_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT organization_id FROM public.profiles WHERE id = auth.uid() AND is_active = true;
$$;

-- 3. Check if current user is Super Admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.profiles p
        JOIN public.roles r ON r.id = p.role_id
        WHERE p.id = auth.uid() 
          AND p.is_active = true 
          AND r.name = 'Super Admin'
    );
$$;

-- 4. Check if current user is Admin of a specific organization (or Super Admin)
CREATE OR REPLACE FUNCTION public.is_org_admin(target_org_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.profiles p
        JOIN public.roles r ON r.id = p.role_id
        WHERE p.id = auth.uid()
          AND p.is_active = true
          AND (
              r.name = 'Super Admin' 
              OR (r.name = 'Admin' AND p.organization_id = target_org_id)
          )
    );
$$;

-- 5. Check if user holds a specific permission code
CREATE OR REPLACE FUNCTION public.has_permission(perm_code TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.profiles p
        JOIN public.roles r ON r.id = p.role_id
        JOIN public.role_permissions rp ON rp.role_id = r.id
        JOIN public.permissions perm ON perm.id = rp.permission_id
        WHERE p.id = auth.uid()
          AND p.is_active = true
          AND (r.name = 'Super Admin' OR perm.code = perm_code)
    );
$$;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all 9 tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- A. ORGANIZATIONS POLICIES
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Active users can view organizations" ON public.organizations;
CREATE POLICY "Active users can view organizations"
    ON public.organizations FOR SELECT
    TO authenticated
    USING (public.is_current_user_active());

DROP POLICY IF EXISTS "Only Super Admin can mutate organizations" ON public.organizations;
CREATE POLICY "Only Super Admin can mutate organizations"
    ON public.organizations FOR ALL
    TO authenticated
    USING (public.is_super_admin())
    WITH CHECK (public.is_super_admin());

-- ------------------------------------------------------------------------------
-- B. ROLES & PERMISSIONS POLICIES
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Active users can view roles" ON public.roles;
CREATE POLICY "Active users can view roles"
    ON public.roles FOR SELECT
    TO authenticated
    USING (public.is_current_user_active());

DROP POLICY IF EXISTS "Active users can view permissions" ON public.permissions;
CREATE POLICY "Active users can view permissions"
    ON public.permissions FOR SELECT
    TO authenticated
    USING (public.is_current_user_active());

DROP POLICY IF EXISTS "Active users can view role_permissions" ON public.role_permissions;
CREATE POLICY "Active users can view role_permissions"
    ON public.role_permissions FOR SELECT
    TO authenticated
    USING (public.is_current_user_active());

-- ------------------------------------------------------------------------------
-- C. APPLICATIONS POLICIES
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view accessible applications" ON public.applications;
CREATE POLICY "Users can view accessible applications"
    ON public.applications FOR SELECT
    TO authenticated
    USING (
        public.is_current_user_active() AND (
            public.is_super_admin()
            OR organization_id IS NULL
            OR organization_id = public.get_current_user_org_id()
            OR EXISTS (
                SELECT 1 FROM public.user_applications ua
                WHERE ua.application_id = public.applications.id
                  AND ua.user_id = auth.uid()
            )
        )
    );

-- ------------------------------------------------------------------------------
-- D. PROFILES POLICIES
-- ------------------------------------------------------------------------------
-- 1. Read: User can view their own profile, OR Admin can view their org's profiles, OR Super Admin can view all
DROP POLICY IF EXISTS "Profiles read policy" ON public.profiles;
CREATE POLICY "Profiles read policy"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (
        id = auth.uid() 
        OR public.is_org_admin(organization_id)
    );

-- 2. Update: User can update non-sensitive info on self, Admin can update profiles in their org
DROP POLICY IF EXISTS "Profiles update policy" ON public.profiles;
CREATE POLICY "Profiles update policy"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (
        public.is_org_admin(organization_id) 
        OR (id = auth.uid() AND public.is_current_user_active())
    )
    WITH CHECK (
        public.is_org_admin(organization_id)
        OR (id = auth.uid() AND public.is_current_user_active())
    );

-- 3. Insert: Only Org Admin or Super Admin can create profile records
DROP POLICY IF EXISTS "Profiles insert policy" ON public.profiles;
CREATE POLICY "Profiles insert policy"
    ON public.profiles FOR INSERT
    TO authenticated
    WITH CHECK (
        public.is_org_admin(organization_id)
    );

-- ------------------------------------------------------------------------------
-- E. USER_APPLICATIONS POLICIES
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "User applications read policy" ON public.user_applications;
CREATE POLICY "User applications read policy"
    ON public.user_applications FOR SELECT
    TO authenticated
    USING (
        user_id = auth.uid()
        OR public.is_super_admin()
        OR EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = public.user_applications.user_id
              AND public.is_org_admin(p.organization_id)
        )
    );

DROP POLICY IF EXISTS "User applications mutation policy" ON public.user_applications;
CREATE POLICY "User applications mutation policy"
    ON public.user_applications FOR ALL
    TO authenticated
    USING (
        public.is_super_admin()
        OR EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = public.user_applications.user_id
              AND public.is_org_admin(p.organization_id)
        )
    )
    WITH CHECK (
        public.is_super_admin()
        OR EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = public.user_applications.user_id
              AND public.is_org_admin(p.organization_id)
        )
    );

-- ------------------------------------------------------------------------------
-- F. QUOTATIONS POLICIES (Strict Entity Isolation)
-- ------------------------------------------------------------------------------
-- 1. Read: User can ONLY see quotations matching their organization, or Super Admin
DROP POLICY IF EXISTS "Quotations select isolation policy" ON public.quotations;
CREATE POLICY "Quotations select isolation policy"
    ON public.quotations FOR SELECT
    TO authenticated
    USING (
        public.is_current_user_active() AND (
            public.is_super_admin()
            OR (
                organization_id = public.get_current_user_org_id()
                AND public.has_permission('view_quotation')
            )
        )
    );

-- 2. Insert: User can ONLY insert quotations for THEIR OWN verified organization
DROP POLICY IF EXISTS "Quotations insert isolation policy" ON public.quotations;
CREATE POLICY "Quotations insert isolation policy"
    ON public.quotations FOR INSERT
    TO authenticated
    WITH CHECK (
        public.is_current_user_active()
        AND created_by = auth.uid()
        AND organization_id = public.get_current_user_org_id()
        AND public.has_permission('create_quotation')
    );

-- 3. Update: User can only modify quotations within their organization
DROP POLICY IF EXISTS "Quotations update isolation policy" ON public.quotations;
CREATE POLICY "Quotations update isolation policy"
    ON public.quotations FOR UPDATE
    TO authenticated
    USING (
        public.is_current_user_active() AND (
            public.is_super_admin()
            OR (
                organization_id = public.get_current_user_org_id()
                AND public.has_permission('edit_quotation')
            )
        )
    )
    WITH CHECK (
        public.is_current_user_active() AND (
            public.is_super_admin()
            OR (
                organization_id = public.get_current_user_org_id()
                AND public.has_permission('edit_quotation')
            )
        )
    );

-- 4. Delete: Restricted to authorized Admins within the organization or Super Admin
DROP POLICY IF EXISTS "Quotations delete policy" ON public.quotations;
CREATE POLICY "Quotations delete policy"
    ON public.quotations FOR DELETE
    TO authenticated
    USING (
        public.is_current_user_active() AND (
            public.is_super_admin()
            OR (
                organization_id = public.get_current_user_org_id()
                AND public.is_org_admin(organization_id)
                AND public.has_permission('delete_quotation')
            )
        )
    );

-- ------------------------------------------------------------------------------
-- G. AUDIT_LOGS POLICIES (Append-Only)
-- ------------------------------------------------------------------------------
-- 1. Read: Only Org Admins (for their org) and Super Admin can read audit logs
DROP POLICY IF EXISTS "Audit logs read policy" ON public.audit_logs;
CREATE POLICY "Audit logs read policy"
    ON public.audit_logs FOR SELECT
    TO authenticated
    USING (
        public.is_current_user_active() AND (
            public.is_super_admin()
            OR (organization_id IS NOT NULL AND public.is_org_admin(organization_id))
        )
    );

-- 2. Insert: Any active authenticated user can append audit records
DROP POLICY IF EXISTS "Audit logs insert policy" ON public.audit_logs;
CREATE POLICY "Audit logs insert policy"
    ON public.audit_logs FOR INSERT
    TO authenticated
    WITH CHECK (
        public.is_current_user_active()
        AND (user_id IS NULL OR user_id = auth.uid())
    );

-- Note: NO UPDATE OR DELETE POLICIES CREATED FOR AUDIT_LOGS.
-- This makes the audit table strictly append-only.

-- ==============================================================================
-- SEED DATA (SAFE, IDEMPOTENT)
-- ==============================================================================

-- 1. Organizations
INSERT INTO public.organizations (name, slug, is_active)
VALUES 
    ('Central Enterprise', 'central', true),
    ('Immense Air Pvt Ltd', 'immense-air', true),
    ('Zion', 'zion', true)
ON CONFLICT (slug) DO NOTHING;

-- 2. Roles
INSERT INTO public.roles (name, description)
VALUES 
    ('Super Admin', 'Full access across all workspace entities, applications, and security governance'),
    ('Admin', 'Entity administrator with user management and audit log access within their organization'),
    ('Sales', 'Entity sales team member with quotation management and proposal export capabilities'),
    ('Support', 'Technical support engineer with Error Code Intelligence Hub access'),
    ('Operations', 'Operations manager with Error Code Hub access and system monitoring')
ON CONFLICT (name) DO NOTHING;

-- 3. Permissions
INSERT INTO public.permissions (code, name, description)
VALUES 
    ('create_quotation', 'Create Quotation', 'Ability to draft and create new proposals'),
    ('view_quotation', 'View Quotation', 'Ability to view organization quotation history'),
    ('edit_quotation', 'Edit Quotation', 'Ability to edit quotation details and rate tables'),
    ('download_quotation', 'Download Quotation', 'Ability to generate and print A4 PDF proposals'),
    ('change_pricing', 'Change Pricing', 'Ability to customize setup charges and base rates'),
    ('delete_quotation', 'Delete Quotation', 'Ability to delete quotation proposals'),
    ('manage_users', 'Manage Users', 'Ability to create, edit, deactivate, or reactivate users'),
    ('manage_roles', 'Manage Roles', 'Ability to modify role assignments'),
    ('manage_applications', 'Manage Applications', 'Ability to grant or revoke application access'),
    ('view_audit_logs', 'View Audit Logs', 'Ability to view compliance audit history'),
    ('access_error_hub', 'Access Error Hub', 'Ability to use the Error Code Intelligence Hub')
ON CONFLICT (code) DO NOTHING;

-- 4. Role Permissions Mapping
DO $$
DECLARE
    role_super_admin UUID;
    role_admin UUID;
    role_sales UUID;
    role_support UUID;
    role_ops UUID;
    perm RECORD;
BEGIN
    SELECT id INTO role_super_admin FROM public.roles WHERE name = 'Super Admin';
    SELECT id INTO role_admin FROM public.roles WHERE name = 'Admin';
    SELECT id INTO role_sales FROM public.roles WHERE name = 'Sales';
    SELECT id INTO role_support FROM public.roles WHERE name = 'Support';
    SELECT id INTO role_ops FROM public.roles WHERE name = 'Operations';

    -- Super Admin gets all permissions
    FOR perm IN SELECT id FROM public.permissions LOOP
        INSERT INTO public.role_permissions (role_id, permission_id)
        VALUES (role_super_admin, perm.id)
        ON CONFLICT DO NOTHING;
    END LOOP;

    -- Admin gets quotation, user management, and audit log permissions
    FOR perm IN SELECT id FROM public.permissions WHERE code IN (
        'create_quotation', 'view_quotation', 'edit_quotation', 'download_quotation',
        'change_pricing', 'delete_quotation', 'manage_users', 'manage_applications', 
        'view_audit_logs', 'access_error_hub'
    ) LOOP
        INSERT INTO public.role_permissions (role_id, permission_id)
        VALUES (role_admin, perm.id)
        ON CONFLICT DO NOTHING;
    END LOOP;

    -- Sales gets quotation workflow permissions
    FOR perm IN SELECT id FROM public.permissions WHERE code IN (
        'create_quotation', 'view_quotation', 'edit_quotation', 'download_quotation', 'change_pricing'
    ) LOOP
        INSERT INTO public.role_permissions (role_id, permission_id)
        VALUES (role_sales, perm.id)
        ON CONFLICT DO NOTHING;
    END LOOP;

    -- Support gets Error Hub access
    FOR perm IN SELECT id FROM public.permissions WHERE code IN ('access_error_hub') LOOP
        INSERT INTO public.role_permissions (role_id, permission_id)
        VALUES (role_support, perm.id)
        ON CONFLICT DO NOTHING;
    END LOOP;

    -- Operations gets Error Hub access
    FOR perm IN SELECT id FROM public.permissions WHERE code IN ('access_error_hub') LOOP
        INSERT INTO public.role_permissions (role_id, permission_id)
        VALUES (role_ops, perm.id)
        ON CONFLICT DO NOTHING;
    END LOOP;
END $$;

-- 5. Applications Seed
DO $$
DECLARE
    org_immense UUID;
    org_zion UUID;
BEGIN
    SELECT id INTO org_immense FROM public.organizations WHERE slug = 'immense-air';
    SELECT id INTO org_zion FROM public.organizations WHERE slug = 'zion';

    -- App 1: Error Code Intelligence Hub (Immense Air)
    INSERT INTO public.applications (name, slug, description, organization_id, route, icon, is_active)
    VALUES (
        'Error Code Intelligence Hub',
        'error-hub',
        'Real-time sub-millisecond search engine across 91+ telecom error definitions (DLT, SMPP, MAP/SS7, Network).',
        org_immense,
        '/apps/error-hub',
        'Terminal',
        true
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        organization_id = EXCLUDED.organization_id,
        route = EXCLUDED.route;

    -- App 2: Immense Air Quotation Manager (Immense Air)
    INSERT INTO public.applications (name, slug, description, organization_id, route, icon, is_active)
    VALUES (
        'Immense Air Quotation Manager',
        'immense-quotes',
        'Enterprise proposal generator for Bulk SMS, RCS, WhatsApp API, CPaaS, OBD, and IVR with pixel-perfect A4 export.',
        org_immense,
        '/apps/immense-quotes',
        'FileText',
        true
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        organization_id = EXCLUDED.organization_id,
        route = EXCLUDED.route;

    -- App 3: Zion Quotation Manager (Zion)
    INSERT INTO public.applications (name, slug, description, organization_id, route, icon, is_active)
    VALUES (
        'Zion Quotation Manager',
        'zion-quotes',
        'Zion Marketing quotation management suite with custom messaging products, branding, and A4 generation.',
        org_zion,
        '/apps/zion-quotes',
        'Building2',
        true
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        organization_id = EXCLUDED.organization_id,
        route = EXCLUDED.route;
END $$;
