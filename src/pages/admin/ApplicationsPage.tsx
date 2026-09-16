import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Layers, 
  Terminal, 
  FileText, 
  Building2, 
  CheckCircle2, 
  ExternalLink, 
  Lock, 
  Users,
  ShieldAlert
} from "lucide-react";

export const ApplicationsPage: React.FC = () => {
  const { organization, isSuperAdmin } = useAuth();

  const [apps, setApps] = useState([
    {
      id: "error-hub",
      name: "Error Code Intelligence Hub",
      slug: "error-hub",
      orgSlug: "immense-air",
      orgName: "Immense Air Pvt Ltd",
      route: "/apps/error-hub",
      icon: Terminal,
      color: "from-cyan-500 to-blue-600",
      description: "Sub-millisecond lookup engine across 91+ telecom error definitions (DLT, SMPP, MAP/SS7).",
      activeUsersCount: 2,
      isActive: true,
    },
    {
      id: "immense-quotes",
      name: "Immense Air Quotation Manager",
      slug: "immense-quotes",
      orgSlug: "immense-air",
      orgName: "Immense Air Pvt Ltd",
      route: "/apps/immense-quotes",
      icon: FileText,
      color: "from-blue-600 to-indigo-700",
      description: "Enterprise proposal generator with product toggles, rate slabs, and A4 print export.",
      activeUsersCount: 2,
      isActive: true,
    },
    {
      id: "zion-quotes",
      name: "Zion Quotation Manager",
      slug: "zion-quotes",
      orgSlug: "zion",
      orgName: "Zion",
      route: "/apps/zion-quotes",
      icon: Building2,
      color: "from-indigo-600 to-sky-700",
      description: "Zion-branded quotation suite with multi-channel messaging and specialized rates.",
      activeUsersCount: 2,
      isActive: true,
    },
  ]);

  // Filter based on Organization Scope
  const scopedApps = apps.filter((app) => {
    if (!isSuperAdmin) {
      return app.orgSlug === organization?.slug;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-card flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-brand-navy">Registered Applications</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Central registry of live enterprise applications controlled by Row Level Security
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs bg-slate-50 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200">
          <Lock className="w-3.5 h-3.5 text-brand-blue" />
          <span>Entity-Bounded Registry</span>
        </div>
      </div>

      {/* Applications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {scopedApps.map((app) => {
          const Icon = app.icon;
          return (
            <div
              key={app.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-card hover:shadow-cardHover transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${app.color} text-white flex items-center justify-center shadow-sm`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Active In Portal</span>
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-brand-blue uppercase tracking-wider block">
                    {app.orgName}
                  </span>
                  <h3 className="text-lg font-bold text-brand-navy mt-0.5">{app.name}</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">{app.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center space-x-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{app.activeUsersCount} Authorized Users</span>
                  </span>
                  <code className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-mono">
                    {app.route}
                  </code>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" />
                  <span>RLS Protected</span>
                </span>
                <Link
                  to={app.route}
                  className="inline-flex items-center space-x-1 px-3.5 py-1.5 rounded-xl bg-brand-navy hover:bg-brand-blue text-white text-xs font-semibold transition-all shadow-sm"
                >
                  <span>Launch App</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
