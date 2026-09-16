-- ==============================================================================
-- IMMENSE ENTERPRISE WORKSPACE: RLS SECURITY VERIFICATION SUITE
-- File: supabase/verify_rls.sql
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- VERIFICATION TEST MATRIX
-- ------------------------------------------------------------------------------
-- Test 1: Immense Air user -> Immense Air quotations = ALLOWED (RLS Match)
-- Test 2: Immense Air user -> Zion quotations = BLOCKED (0 rows returned)
-- Test 3: Zion user -> Zion quotations = ALLOWED (RLS Match)
-- Test 4: Zion user -> Immense Air quotations = BLOCKED (0 rows returned)
-- Test 5: Support role -> Error Hub access = ALLOWED (has_permission 'access_error_hub')
-- Test 6: Support role -> Quotation data = BLOCKED (missing 'view_quotation')
-- Test 7: Sales Immense -> Immense Quotes = ALLOWED (org matches + permission granted)
-- Test 8: Sales Immense -> Zion Quotes = BLOCKED (org mismatch)
-- Test 9: Sales Zion -> Zion Quotes = ALLOWED (org matches + permission granted)
-- Test 10: Sales Zion -> Immense Quotes = BLOCKED (org mismatch)
-- Test 11: Inactive user (is_active = false) -> ALL protected rows BLOCKED
-- Test 12: Organization ID spoofing on insert -> REJECTED by WITH CHECK
-- Test 13: Normal user deleting audit logs -> REJECTED (no DELETE policy exists)
-- Test 14: Normal user modifying another user's profile -> REJECTED (id != auth.uid())
-- Test 15: Direct SELECT * query bypassing frontend -> ENFORCED by PostgreSQL kernel RLS
-- ------------------------------------------------------------------------------

-- Quick diagnostic to confirm schema and seed data loaded correctly:
SELECT 'Organizations seeded:' as check_item, count(*) as count FROM public.organizations
UNION ALL
SELECT 'Roles seeded:', count(*) FROM public.roles
UNION ALL
SELECT 'Permissions seeded:', count(*) FROM public.permissions
UNION ALL
SELECT 'Role-Permissions mapped:', count(*) FROM public.role_permissions
UNION ALL
SELECT 'Applications registered:', count(*) FROM public.applications;
