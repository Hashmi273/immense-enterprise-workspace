import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AlertTriangle, ArrowLeft, ShieldAlert, Building2, User } from "lucide-react";

export const AccessDenied: React.FC = () => {
  const { user, profile, organization, role } = useAuth();
  const location = useLocation();
  const reason = (location.state as any)?.reason;
  const attemptedPath = (location.state as any)?.path;

  return (
    <div className="max-w-xl mx-auto py-12 px-4 text-center">
      <div className="bg-white rounded-3xl border border-rose-100 p-8 sm:p-12 shadow-glass relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-6 border border-rose-200 shadow-sm">
          <ShieldAlert className="w-9 h-9" strokeWidth={2.2} />
        </div>

        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider mb-4">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Access Restricted &middot; HTTP 403</span>
        </div>

        <h1 className="text-3xl font-extrabold text-brand-navy tracking-tight mb-3">
          ACCESS DENIED
        </h1>

        <p className="text-sm font-semibold text-slate-700 mb-2">
          You do not have permission to access this application.
        </p>

        <p className="text-xs text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
          {reason || "Your authenticated organization and role assignment do not hold authorization for this resource."}
        </p>

        {/* Current Identity Context Badge */}
        {user && profile && (
          <div className="mb-6 p-3 bg-slate-50 border border-slate-200 rounded-2xl text-left max-w-sm mx-auto text-xs space-y-1">
            <div className="flex items-center justify-between text-slate-600">
              <span className="font-semibold text-slate-500">Account:</span>
              <span className="font-medium text-brand-navy truncate max-w-[180px]">{profile.email}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span className="font-semibold text-slate-500">Organization:</span>
              <span className="font-bold text-brand-blue">{organization?.name || "Unassigned"}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span className="font-semibold text-slate-500">Role:</span>
              <span className="font-semibold text-slate-700">{role?.name || "Member"}</span>
            </div>
            {attemptedPath && (
              <div className="pt-1.5 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
                <span>Requested:</span>
                <code className="bg-slate-200/60 px-1 py-0.5 rounded text-slate-600">{attemptedPath}</code>
              </div>
            )}
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/workspace"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-blue text-white text-xs font-semibold transition-all shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Workspace</span>
          </Link>
          <a
            href="mailto:support@immenseair.in"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
          >
            <span>Contact Administrator</span>
          </a>
        </div>
      </div>
    </div>
  );
};
