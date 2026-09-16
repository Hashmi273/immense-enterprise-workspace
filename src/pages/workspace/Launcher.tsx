import React, { useState } from "react";
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
  Search,
  AlertCircle,
  Mail,
  CheckCircle2,
  Layers,
  ChevronRight
} from "lucide-react";

export const Launcher: React.FC = () => {
  const { profile, organization, role, loading, canAccessApp } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const allApps: Array<{
    id: AppSlug;
    title: string;
    entity: string;
    category: string;
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
      category: "Technical / Support",
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
      category: "Sales / Quotations",
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
      category: "Sales / Quotations",
      description: "Zion-branded quotation suite with multi-channel messaging products and customized pricing.",
      route: "/apps/zion-quotes",
      color: "from-indigo-600 to-sky-700",
      icon: Building2,
      tag: "Zion Sales",
    },
  ];

  // Zero-flicker loading skeleton
  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-44 bg-slate-200/70 rounded-3xl" />
        <div className="space-y-4">
          <div className="h-6 w-48 bg-slate-200 rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-64 bg-slate-200/60 rounded-3xl" />
            <div className="h-64 bg-slate-200/60 rounded-3xl" />
            <div className="h-64 bg-slate-200/60 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  // Authoritative dynamic visibility filter: Only apps permitted for this profile appear
  const authorizedApps = allApps.filter((app) => canAccessApp(app.id));

  // Search/Filter matching
  const filteredApps = authorizedApps.filter((app) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      app.title.toLowerCase().includes(q) ||
      app.category.toLowerCase().includes(q) ||
      app.entity.toLowerCase().includes(q) ||
      app.description.toLowerCase().includes(q)
    );
  });

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const userName = profile?.fullName ? profile.fullName.split(" ")[0] : "Team Member";

  return (
    <div className="space-y-8">
      {/* Personalized Welcome Banner */}
      <div className="glass-card-navy text-white rounded-3xl p-8 sm:p-10 shadow-glow relative overflow-hidden border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
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
            Welcome to Immense Enterprise Workspace. Access to business applications is strictly governed by your authenticated organization and role assignment.
          </p>
        </div>

        <div className="relative z-10 hidden md:flex shrink-0 items-center justify-center">
          <div className="w-24 h-24 rounded-2xl bg-white p-2 shadow-2xl border border-white/30 flex items-center justify-center">
            <img 
              src="/immense-air-logo.jpg" 
              alt="Immense Air Pvt Ltd" 
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Applications Section Header & Filter */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-brand-navy">Your Applications</h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-200/70 text-slate-700">
                {authorizedApps.length}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Available tools for your account &middot; Direct URL access is kernel-protected by database RLS
            </p>
          </div>

          {/* Lightweight Filter Box */}
          {authorizedApps.length > 1 && (
            <div className="relative w-full sm:w-72">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter applications..."
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue text-brand-navy placeholder:text-slate-400 transition-all shadow-sm"
              />
            </div>
          )}
        </div>

        {/* Empty State: No Authorized Applications */}
        {authorizedApps.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-card space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200 shadow-sm">
              <AlertCircle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-brand-navy">No Applications Assigned</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                No applications are currently assigned to your account ({profile?.email || "unassigned"}). Please contact your enterprise administrator to request access.
              </p>
            </div>
            <div className="pt-2">
              <a
                href="mailto:support@immenseair.in"
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-brand-navy hover:bg-brand-blue text-white text-xs font-semibold transition-all shadow-sm"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Contact Administrator</span>
              </a>
            </div>
          </div>
        ) : filteredApps.length === 0 ? (
          /* Empty Search Result */
          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center max-w-md mx-auto shadow-card">
            <p className="text-xs text-slate-500">
              No authorized applications matched &ldquo;<span className="font-semibold text-brand-navy">{searchQuery}</span>&rdquo;.
            </p>
          </div>
        ) : (
          /* Applications Grid */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredApps.map((app) => {
              const Icon = app.icon;
              return (
                <div
                  key={app.id}
                  className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-card hover:shadow-cardHover transition-all duration-200 flex flex-col justify-between group relative overflow-hidden"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${app.color} flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200/60">
                        {app.category}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold text-brand-blue uppercase tracking-wider block">
                        {app.entity}
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
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Authorized</span>
                    </span>
                    <Link
                      to={app.route}
                      className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-brand-navy hover:bg-brand-blue text-white text-xs font-semibold transition-all shadow-sm group-hover:shadow"
                    >
                      <span>Open Application</span>
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
