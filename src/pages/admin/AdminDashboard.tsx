import React from "react";
import { 
  Users, 
  Layers, 
  ShieldAlert, 
  Activity, 
  Building, 
  Sliders, 
  Sparkles,
  ArrowRight
} from "lucide-react";

export const AdminDashboard: React.FC = () => {
  const adminSections = [
    { title: "Users Management", desc: "Manage employee profiles, activation status, and entity roles", icon: Users, count: "5 Test Users Prepared" },
    { title: "Application Registry", desc: "Configure live routes, assign access policies, and manage slugs", icon: Layers, count: "3 Core Apps" },
    { title: "Roles & Permissions Matrix", desc: "Fine-tune granular permissions across Support, Sales, and Ops", icon: Sliders, count: "5 System Roles" },
    { title: "Entity Organizations", desc: "Manage Immense Air Pvt Ltd and Zion isolation rules", icon: Building, count: "2 Organizations" },
    { title: "Audit Trail", desc: "Real-time tamper-evident logs for logins, launches, and actions", icon: Activity, count: "Logging Engine Ready" },
    { title: "Security Policies", desc: "Row Level Security (RLS) enforcement and session parameters", icon: ShieldAlert, count: "PostgreSQL RLS" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-extrabold text-brand-navy tracking-tight">Admin Console</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-blue/10 text-brand-blue border border-brand-blue/20">
              Executive
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Centralized control plane for identity, access governance, entity segregation, and security audits
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200">
          <Sparkles className="w-3.5 h-3.5 text-brand-blue" />
          <span>Phase 3 Shell &middot; Supabase Admin API in Phase 7</span>
        </div>
      </div>

      {/* Admin Modules Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminSections.map((sec, idx) => {
          const Icon = sec.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card hover:shadow-cardHover transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-brand-navy text-brand-cyan flex items-center justify-center shadow-sm">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-brand-navy">{sec.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{sec.desc}</p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600">{sec.count}</span>
                <span className="text-brand-blue font-medium inline-flex items-center gap-1 hover:underline cursor-pointer">
                  Configure <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
