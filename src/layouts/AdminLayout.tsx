import React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LayoutDashboard, 
  Users, 
  Layers, 
  Sliders, 
  Building2, 
  Activity, 
  ShieldCheck, 
  ArrowLeft,
  Sparkles,
  Lock
} from "lucide-react";

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const { organization, role, isSuperAdmin } = useAuth();

  const adminTabs = [
    { name: "Overview", path: "/admin", icon: LayoutDashboard },
    { name: "Users", path: "/admin/users", icon: Users },
    { name: "Applications", path: "/admin/apps", icon: Layers },
    { name: "Roles & Permissions", path: "/admin/roles", icon: Sliders },
    { name: "Organizations", path: "/admin/organizations", icon: Building2 },
    { name: "Audit Logs", path: "/admin/audit-logs", icon: Activity },
  ];

  const currentScope = isSuperAdmin
    ? "Universal Cross-Tenant Scope (All Entities)"
    : `Organization Scope: ${organization?.name || "Single Entity"}`;

  return (
    <div className="space-y-6">
      {/* Admin Subheader & Navigation */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-card">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <Link
                to="/workspace"
                className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-brand-navy mr-2 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                Workspace
              </Link>
              <span className="text-slate-300">/</span>
              <h1 className="text-2xl font-extrabold text-brand-navy tracking-tight">Admin Console</h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-navy text-brand-cyan border border-brand-cyan/20">
                {role?.name || "Admin"}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Centralized security governance, user lifecycle management, and audit tracking
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 text-xs font-medium">
              <Lock className="w-3.5 h-3.5 text-brand-blue" />
              <span>{currentScope}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1 pt-4 overflow-x-auto scrollbar-none">
          {adminTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = location.pathname === tab.path;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-brand-navy text-white shadow-sm"
                    : "text-slate-600 hover:text-brand-navy hover:bg-slate-100"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-brand-cyan" : "text-slate-400"}`} />
                <span>{tab.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Admin Child View */}
      <Outlet />
    </div>
  );
};
