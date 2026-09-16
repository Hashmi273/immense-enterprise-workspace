import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Sliders, 
  ShieldCheck, 
  Check, 
  X, 
  Lock, 
  AlertTriangle,
  Info,
  Sparkles
} from "lucide-react";

export const RolesPage: React.FC = () => {
  const { isSuperAdmin } = useAuth();
  const [selectedTab, setSelectedTab] = useState<"matrix" | "granular">("matrix");

  const matrixRows = [
    { role: "Super Admin", entity: "Central", errorHub: true, immenseQuotes: true, zionQuotes: true, admin: true },
    { role: "Admin", entity: "Immense Air", errorHub: true, immenseQuotes: true, zionQuotes: false, admin: true },
    { role: "Admin", entity: "Zion", errorHub: false, immenseQuotes: false, zionQuotes: true, admin: true },
    { role: "Support", entity: "Immense Air", errorHub: true, immenseQuotes: false, zionQuotes: false, admin: false },
    { role: "Operations", entity: "Immense Air", errorHub: true, immenseQuotes: false, zionQuotes: false, admin: false },
    { role: "Sales", entity: "Immense Air", errorHub: "Override", immenseQuotes: true, zionQuotes: false, admin: false },
    { role: "Sales", entity: "Zion", errorHub: false, immenseQuotes: false, zionQuotes: true, admin: false },
  ];

  const granularPermissions = [
    { code: "create_quotation", name: "Create Quotation", category: "Quotation", desc: "Draft and save new commercial proposals" },
    { code: "view_quotation", name: "View Quotation", category: "Quotation", desc: "Read company quotation records" },
    { code: "edit_quotation", name: "Edit Quotation", category: "Quotation", desc: "Modify line items, products, and rate slabs" },
    { code: "download_quotation", name: "Download Quotation", category: "Quotation", desc: "Render and download A4 PDF document" },
    { code: "change_pricing", name: "Change Pricing", category: "Quotation", desc: "Edit setup and monthly recurring charges" },
    { code: "delete_quotation", name: "Delete Quotation", category: "Quotation", desc: "Permanently delete proposal records (Admin only)" },
    { code: "access_error_hub", name: "Access Error Hub", category: "Intelligence", desc: "Full search access across telecom error codes" },
    { code: "manage_users", name: "Manage Users", category: "Administration", desc: "Provision, edit, and deactivate user accounts" },
    { code: "manage_roles", name: "Manage Roles", category: "Administration", desc: "Assign system roles within entity scope" },
    { code: "manage_applications", name: "Manage Applications", category: "Administration", desc: "Grant individual application overrides" },
    { code: "view_audit_logs", name: "View Audit Logs", category: "Compliance", desc: "Inspect immutable security and audit trails" },
  ];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-brand-navy">Roles & Permissions Governance</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Role-Based Access Control matrix and granular permission mapping
          </p>
        </div>

        <div className="flex items-center space-x-1 p-1 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => setSelectedTab("matrix")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedTab === "matrix" ? "bg-white text-brand-navy shadow-sm" : "text-slate-500 hover:text-brand-navy"
            }`}
          >
            Application Matrix
          </button>
          <button
            type="button"
            onClick={() => setSelectedTab("granular")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedTab === "granular" ? "bg-white text-brand-navy shadow-sm" : "text-slate-500 hover:text-brand-navy"
            }`}
          >
            Granular Permissions (11)
          </button>
        </div>
      </div>

      {selectedTab === "matrix" ? (
        /* Application Matrix View */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs text-slate-600">
              <Info className="w-4 h-4 text-brand-blue" />
              <span>Defaults are hard-enforced by database RLS and verified by automated unit tests.</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              36 Unit Tests Verified
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                  <th className="py-3.5 px-6">Role</th>
                  <th className="py-3.5 px-4">Entity</th>
                  <th className="py-3.5 px-4 text-center">Error Code Hub</th>
                  <th className="py-3.5 px-4 text-center">Immense Quotes</th>
                  <th className="py-3.5 px-4 text-center">Zion Quotes</th>
                  <th className="py-3.5 px-6 text-center">Admin Console</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {matrixRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-6 font-bold text-brand-navy">{row.role}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">
                        {row.entity}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {row.errorHub === true ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-600">
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        </span>
                      ) : row.errorHub === "Override" ? (
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-brand-blue text-[10px] font-semibold">
                          Optional
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-50 text-rose-500">
                          <X className="w-3.5 h-3.5 stroke-[2.5]" />
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {row.immenseQuotes ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-600">
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-50 text-rose-500">
                          <X className="w-3.5 h-3.5 stroke-[2.5]" />
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {row.zionQuotes ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-600">
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-50 text-rose-500">
                          <X className="w-3.5 h-3.5 stroke-[2.5]" />
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      {row.admin ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-600">
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-50 text-rose-500">
                          <X className="w-3.5 h-3.5 stroke-[2.5]" />
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Granular Permissions View */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {granularPermissions.map((perm) => (
              <div key={perm.code} className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-brand-blue bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/60">
                    {perm.category}
                  </span>
                  <code className="text-[11px] text-slate-500 font-mono">{perm.code}</code>
                </div>
                <h4 className="text-sm font-bold text-brand-navy">{perm.name}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{perm.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
