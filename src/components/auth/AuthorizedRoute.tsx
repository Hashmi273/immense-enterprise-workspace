import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AppSlug } from "@/types";
import { ShieldCheck, Loader2 } from "lucide-react";

interface AuthorizedRouteProps {
  children: React.ReactNode;
  requiredAppSlug?: AppSlug;
  requiredPermission?: string;
  adminOnly?: boolean;
  superAdminOnly?: boolean;
}

export const AuthorizedRoute: React.FC<AuthorizedRouteProps> = ({
  children,
  requiredAppSlug,
  requiredPermission,
  adminOnly = false,
  superAdminOnly = false,
}) => {
  const { 
    user, 
    profile, 
    loading, 
    accountDisabledError, 
    isAdmin, 
    isSuperAdmin, 
    canAccessApp, 
    hasPermission 
  } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-brand-navy shadow-glow flex items-center justify-center">
          <ShieldCheck className="w-7 h-7 text-brand-cyan animate-pulse" strokeWidth={2.2} />
        </div>
        <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-blue" />
          <span>Verifying Authorization...</span>
        </div>
      </div>
    );
  }

  // 1. Account disabled
  if (accountDisabledError) {
    return <Navigate to="/login" state={{ error: accountDisabledError }} replace />;
  }

  // 2. Unauthenticated -> Redirect to /login
  if (!user || !profile) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Authenticated but Unauthorized -> Redirect to /access-denied
  if (superAdminOnly && !isSuperAdmin) {
    return (
      <Navigate 
        to="/access-denied" 
        state={{ reason: "Super Administrator privileges required", path: location.pathname }} 
        replace 
      />
    );
  }

  if (adminOnly && !isAdmin) {
    return (
      <Navigate 
        to="/access-denied" 
        state={{ reason: "Enterprise Administrator privileges required", path: location.pathname }} 
        replace 
      />
    );
  }

  if (requiredAppSlug && !canAccessApp(requiredAppSlug)) {
    return (
      <Navigate 
        to="/access-denied" 
        state={{ 
          reason: `Access to application '${requiredAppSlug}' is restricted for your organization or role`,
          appSlug: requiredAppSlug,
          path: location.pathname 
        }} 
        replace 
      />
    );
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <Navigate 
        to="/access-denied" 
        state={{ 
          reason: `Missing required permission: ${requiredPermission}`,
          path: location.pathname 
        }} 
        replace 
      />
    );
  }

  // Authorized
  return <>{children}</>;
};
