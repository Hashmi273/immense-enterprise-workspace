import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Login } from "@/pages/auth/Login";
import { ResetPassword } from "@/pages/auth/ResetPassword";
import { AccessDenied } from "@/pages/auth/AccessDenied";
import { Launcher } from "@/pages/workspace/Launcher";
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { ErrorHubPlaceholder } from "@/pages/apps/ErrorHubPlaceholder";
import { ImmenseQuotesPlaceholder } from "@/pages/apps/ImmenseQuotesPlaceholder";
import { ZionQuotesPlaceholder } from "@/pages/apps/ZionQuotesPlaceholder";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Authentication Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/access-denied" element={<AccessDenied />} />

      {/* Main Protected Workspace Routes */}
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

      {/* Protected Admin Console Route */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Protected Application Routes */}
      <Route
        path="/apps/error-hub"
        element={
          <ProtectedRoute>
            <ErrorHubPlaceholder />
          </ProtectedRoute>
        }
      />
      <Route
        path="/apps/immense-quotes"
        element={
          <ProtectedRoute>
            <ImmenseQuotesPlaceholder />
          </ProtectedRoute>
        }
      />
      <Route
        path="/apps/zion-quotes"
        element={
          <ProtectedRoute>
            <ZionQuotesPlaceholder />
          </ProtectedRoute>
        }
      />

      {/* Fallback Catch-All */}
      <Route path="*" element={<Navigate to="/workspace" replace />} />
    </Routes>
  );
};
