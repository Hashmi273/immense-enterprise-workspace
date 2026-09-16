import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AppSlug } from "@/types";
import { 
  Terminal, 
  FileText, 
  Building2, 
  ArrowUpRight, 
  Shield, 
  Sparkles, 
  Lock,
  AlertCircle,
  Building
} from "lucide-react";

export const Launcher: React.FC = () => {
  const { profile, organization, role, canAccessApp } = useAuth();

  const allApps: Array<{
    id: AppSlug;
    title: string;
    entity: string;
    primaryRole: string;
    description: string;
    route: string;
    color: string;
    icon: any;
    tag: string;
  }> = [
    {
      id: "error-hub",
      title: "Error Code Intelligence Hub",
      entity: "Immense Air Pvt Ltd",
      primaryRole: "Support / Technical / Operations",
      description: "Sub-millisecond error code lookup across DLT, SMPP, MAP/SS7, and telecom delivery failures.",
      route: "/apps/error-hub",
      color: "from-cyan-500 to-blue-600",
      icon: Terminal,
      tag: "Technical Support",
    },
    {
      id: "immense-quotes",
      title: "Immense Air Quotation Manager",
      entity: "Immense Air Pvt Ltd",
      primaryRole: "Immense Air Sales",
      description: "Enterprise CPaaS proposals with dynamic rate slabs, product toggles, and A4 print engine.",
      route: "/apps/immense-quotes",
      color: "from-blue-600 to-indigo-700",
      icon: FileText,
      tag: "Immense Sales",
    },
    {
      id: "zion-quotes",
      title: "Zion Quotation Manager",
      entity: "Zion",
      primaryRole: "Zion Sales",
      description: "Zion-branded quotation suite with multi-channel messaging products and customized pricing.",
      route: "/apps/zion-quotes",
      color: "from-indigo-600 to-sky-700",
      icon: Building2,
      tag: "Zion Sales",
    },
  ];

  // Dynamically filter applications based on authoritative authorization engine
  const authorizedApps = allApps.filter((app) => canAccessApp(app.id));

  // Determine time-of-day greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const userName = profile?.fullName ? profile.fullName.split(" ")[0] : "Team Member";

  return (
    <div className="space-y-8">
      {/* Personalized Welcome Banner */}
      <div className="glass-card-navy text-white rounded-3xl p-8 sm:p-10 shadow-glow relative overflow-hidden border border-white/10">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-20 top-0 w-48 h-48 bg-brand-blue/20 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-brand-cyan text-xs font-semibold uppercase tracking-wider mb-4 border border-white/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{organization?.name || "Immense Enterprise"}</span>
            <span className="text-white/40">&bull;</span>
            <span className="text-slate-200">{role?.name || "Member"}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {greeting}, {userName}
          </h1>

          <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
            Welcome to Immense Enterprise Workspace. Only applications authorized for your organization and role appear below.
          </p>
        </div>
      </div>

      {/* Applications Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-brand-navy">Your Authorized Applications</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Filtered in real-time by your organization and RBAC profile
            </p>
          </div>
          <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
            <Shield className="w-3.5 h-3.5 text-brand-blue" />
            <span>RBAC Active</span>
          </div>
        </div>

        {authorizedApps.length === 0 ? (
          /* Empty state if user has no authorized apps */
          <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center max-w-lg mx-auto shadow-card">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-brand-navy">No Applications Provisioned</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              No applications have been provisioned for your account ({profile?.email}). Contact your administrator to grant application access.
            </p>
          </div>
        ) : (
          /* Dynamic Authorized App Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {authorizedApps.map((app) => {
              const Icon = app.icon;
              return (
                <div
                  key={app.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card hover:shadow-cardHover transition-all duration-200 flex flex-col justify-between group relative overflow-hidden"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200/60">
                        {app.tag}
                      </span>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-brand-blue uppercase tracking-wider block">
                        {app.entity} &middot; <span className="text-slate-500">{app.primaryRole}</span>
                      </span>
                      <h3 className="text-lg font-bold text-brand-navy mt-1 group-hover:text-brand-blue transition-colors">
                        {app.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        {app.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400 flex items-center space-x-1">
                      <Lock className="w-3 h-3" />
                      <span>Authorized</span>
                    </span>
                    <Link
                      to={app.route}
                      className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-brand-navy hover:bg-brand-blue text-white text-xs font-semibold transition-all shadow-sm group-hover:shadow"
                    >
                      <span>Launch &rarr;</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
