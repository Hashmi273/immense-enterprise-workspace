import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowLeft, ShieldAlert } from "lucide-react";

export const AccessDenied: React.FC = () => {
  return (
    <div className="max-w-xl mx-auto py-12 px-4 text-center">
      <div className="bg-white rounded-3xl border border-rose-100 p-8 sm:p-12 shadow-glass relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-6 border border-rose-200">
          <ShieldAlert className="w-9 h-9" strokeWidth={2.2} />
        </div>

        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider mb-4">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>HTTP 403 Forbidden</span>
        </div>

        <h1 className="text-3xl font-extrabold text-brand-navy tracking-tight mb-3">
          ACCESS DENIED
        </h1>

        <p className="text-sm font-medium text-slate-700 mb-2">
          You do not have permission to access this application.
        </p>

        <p className="text-xs text-slate-500 max-w-sm mx-auto mb-8 leading-relaxed">
          Your organization or role does not hold authorization for this resource. If you believe this is an error, contact your enterprise administrator.
        </p>

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
