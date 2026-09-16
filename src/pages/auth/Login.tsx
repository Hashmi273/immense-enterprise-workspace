import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Lock, Mail, ArrowRight, Sparkles } from "lucide-react";

export const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-gradient-to-br from-brand-canvas via-white to-sky-50">
      <div className="w-full max-w-md">
        {/* Logo Card Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-navy shadow-glow mb-4">
            <ShieldCheck className="w-9 h-9 text-brand-cyan" strokeWidth={2.2} />
          </div>
          <h1 className="text-2xl font-extrabold text-brand-navy tracking-tight">
            Immense Enterprise Workspace
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Sign in with your enterprise credentials to access authorized applications
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200 shadow-glass p-8">
          <div className="mb-6 pb-4 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-blue flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Phase 3 Shell
            </span>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
              Supabase Auth Ready
            </span>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-brand-navy uppercase tracking-wider mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  placeholder="name@immenseair.in or name@zion.in"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue text-brand-navy placeholder:text-slate-400 transition-all"
                  disabled
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-brand-navy uppercase tracking-wider">
                  Password
                </label>
                <Link
                  to="/reset-password"
                  className="text-xs font-medium text-brand-blue hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue text-brand-navy placeholder:text-slate-400 transition-all"
                  disabled
                />
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/workspace"
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-brand-navy hover:bg-brand-blue transition-all shadow-md active:scale-[0.99]"
              >
                <span>Enter Workspace (Preview Shell)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </form>

          <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 leading-relaxed">
            <span className="font-semibold block mb-0.5">Phase 3 Project Shell Note:</span>
            Real Supabase authentication connection and credentials validation will be wired in Phase 5. No fake passwords or mock credentials are used.
          </div>
        </div>
      </div>
    </div>
  );
};
