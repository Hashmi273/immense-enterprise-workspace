import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Login } from "@/pages/auth/Login";
import { ResetPassword } from "@/pages/auth/ResetPassword";
import { AccessDenied } from "@/pages/auth/AccessDenied";
import { Launcher } from "@/pages/workspace/Launcher";
import { AdminLayout } from "@/layouts/AdminLayout";
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { UsersPage } from "@/pages/admin/UsersPage";
import { ApplicationsPage } from "@/pages/admin/ApplicationsPage";
import { RolesPage } from "@/pages/admin/RolesPage";
import { OrganizationsPage } from "@/pages/admin/OrganizationsPage";
import { AuditLogsPage } from "@/pages/admin/AuditLogsPage";
import { ErrorHubPlaceholder } from "@/pages/apps/ErrorHubPlaceholder";
import { ImmenseQuotesPlaceholder } from "@/pages/apps/ImmenseQuotesPlaceholder";
import { ZionQuotesPlaceholder } from "@/pages/apps/ZionQuotesPlaceholder";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AuthorizedRoute } from "@/components/auth/AuthorizedRoute";

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Authentication Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/access-denied" element={<AccessDenied />} />

      {/* Main Workspace (Any authenticated, active user) */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Navigate to="/workspace" replace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/workspace"
        element={
          <ProtectedRoute>
            <Launcher />
          </ProtectedRoute>
        }
      />

      {/* Admin Console Nested Routes (Admin & Super Admin only) */}
      <Route
        path="/admin"
        element={
          <AuthorizedRoute adminOnly>
            <AdminLayout />
          </AuthorizedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="apps" element={<ApplicationsPage />} />
        <Route path="roles" element={<RolesPage />} />
        <Route path="organizations" element={<OrganizationsPage />} />
        <Route path="audit-logs" element={<AuditLogsPage />} />
      </Route>

      {/* Authorized Application Routes (Enforcing RBAC + Org Boundaries) */}
      <Route
        path="/apps/error-hub"
        element={
          <AuthorizedRoute requiredAppSlug="error-hub">
            <ErrorHubPlaceholder />
          </AuthorizedRoute>
        }
      />
      <Route
        path="/apps/immense-quotes"
        element={
          <AuthorizedRoute requiredAppSlug="immense-quotes">
            <ImmenseQuotesPlaceholder />
          </AuthorizedRoute>
        }
      />
      <Route
        path="/apps/zion-quotes"
        element={
          <AuthorizedRoute requiredAppSlug="zion-quotes">
            <ZionQuotesPlaceholder />
          </AuthorizedRoute>
        }
      />

      {/* Fallback Catch-All */}
      <Route path="*" element={<Navigate to="/workspace" replace />} />
    </Routes>
  );
};
