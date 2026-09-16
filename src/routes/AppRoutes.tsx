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

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Authentication Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/access-denied" element={<AccessDenied />} />

      {/* Main Workspace Routes */}
      <Route path="/" element={<Navigate to="/workspace" replace />} />
      <Route path="/workspace" element={<Launcher />} />

      {/* Admin Console Route */}
      <Route path="/admin" element={<AdminDashboard />} />

      {/* Authorized Application Routes */}
      <Route path="/apps/error-hub" element={<ErrorHubPlaceholder />} />
      <Route path="/apps/immense-quotes" element={<ImmenseQuotesPlaceholder />} />
      <Route path="/apps/zion-quotes" element={<ZionQuotesPlaceholder />} />

      {/* Fallback Catch-All */}
      <Route path="*" element={<Navigate to="/workspace" replace />} />
    </Routes>
  );
};
