import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ShieldCheck, Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, profile, loading, accountDisabledError } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-brand-navy shadow-glow flex items-center justify-center">
          <ShieldCheck className="w-7 h-7 text-brand-cyan animate-pulse" strokeWidth={2.2} />
        </div>
        <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-blue" />
          <span>Verifying Enterprise Session...</span>
        </div>
      </div>
    );
  }

  // Account disabled check
  if (accountDisabledError) {
    return <Navigate to="/login" state={{ error: accountDisabledError }} replace />;
  }

  // Unauthenticated user check: redirect to /login preserving intended destination
  if (!user || !profile) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
