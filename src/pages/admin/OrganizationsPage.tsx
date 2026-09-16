import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Building2, 
  Users, 
  Layers, 
  CheckCircle2, 
  ShieldCheck, 
  Lock,
  AlertCircle
} from "lucide-react";

export const OrganizationsPage: React.FC = () => {
  const { organization, isSuperAdmin } = useAuth();

  const orgs = [
    {
      id: "org-1",
      name: "Immense Air Pvt Ltd",
      slug: "immense-air",
      usersCount: 3,
      appsCount: 2,
      isActive: true,
      description: "Primary enterprise entity housing Error Code Intelligence Hub and Immense Quotation Manager.",
    },
    {
      id: "org-2",
      name: "Zion",
      slug: "zion",
      usersCount: 2,
      appsCount: 1,
      isActive: true,
      description: "Autonomous commercial entity strictly isolated from Immense Air quotation business records.",
    },
    {
      id: "org-3",
      name: "Central Enterprise",
      slug: "central",
      usersCount: 1,
      appsCount: 3,
      isActive: true,
      description: "Universal administrative workspace governing cross-tenant infrastructure and compliance.",
    },
  ];

  // Filter based on Organization Scope
  const scopedOrgs = orgs.filter((o) => {
    if (!isSuperAdmin) {
      return o.slug === organization?.slug;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-card flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-brand-navy">Enterprise Organizations</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Multi-tenant entities isolated at the PostgreSQL kernel layer via Row Level Security
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs bg-slate-50 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-blue" />
          <span>RLS Entity Isolation Active</span>
        </div>
      </div>

      {/* Organizations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {scopedOrgs.map((org) => (
          <div
            key={org.id}
            className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-card hover:shadow-cardHover transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-brand-navy text-brand-cyan flex items-center justify-center shadow-sm">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Active Entity</span>
                </span>
              </div>

              <div>
                <span className="text-[11px] font-mono text-slate-400 block">slug: {org.slug}</span>
                <h3 className="text-lg font-bold text-brand-navy mt-0.5">{org.name}</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{org.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center space-x-2">
                  <Users className="w-4 h-4 text-brand-blue" />
                  <div>
                    <div className="text-[10px] text-slate-400 font-medium uppercase">Users</div>
                    <div className="font-bold text-brand-navy">{org.usersCount}</div>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-brand-cyan" />
                  <div>
                    <div className="text-[10px] text-slate-400 font-medium uppercase">Apps</div>
                    <div className="font-bold text-brand-navy">{org.appsCount}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>ON DELETE RESTRICT</span>
              </span>
              <span className="text-brand-blue font-semibold">PostgreSQL Isolated</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
