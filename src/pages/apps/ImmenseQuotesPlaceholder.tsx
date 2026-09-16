import React from "react";
import { Link } from "react-router-dom";
import { FileText, ShieldCheck, ArrowLeft } from "lucide-react";

export const ImmenseQuotesPlaceholder: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <Link
          to="/workspace"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-brand-navy"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Workspace</span>
        </Link>
        <span className="text-xs bg-blue-50 text-brand-blue px-3 py-1 rounded-full font-semibold border border-blue-200">
          Entity: Immense Air Pvt Ltd &middot; Sales
        </span>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-card text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center mx-auto shadow-glow">
          <FileText className="w-8 h-8" />
        </div>

        <div className="max-w-md mx-auto space-y-2">
          <h1 className="text-2xl font-extrabold text-brand-navy">
            Immense Air Quotation Manager
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Enterprise proposal generator for Bulk SMS, RCS, WhatsApp API, CPaaS, OBD, and IVR with pixel-perfect A4 export.
          </p>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl max-w-lg mx-auto text-left text-xs text-slate-600 space-y-2">
          <div className="flex items-center justify-between font-semibold text-brand-navy">
            <span>Integration Status</span>
            <span className="text-emerald-600 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Inspected in Phase 1
            </span>
          </div>
          <p>
            The proposal editor, rate tables, live preview, and A4 PDF export will be mounted here in <strong>Phase 10</strong>, backed by PostgreSQL RLS for persistence.
          </p>
          <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
            <span>Production Repo: immensesolutions-quotes</span>
            <span className="text-brand-blue font-medium">No Code Overwritten</span>
          </div>
        </div>
      </div>
    </div>
  );
};
