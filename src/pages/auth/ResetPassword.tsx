import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Mail, ArrowLeft, Send } from "lucide-react";

export const ResetPassword: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-gradient-to-br from-brand-canvas via-white to-sky-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-navy shadow-glow mb-4">
            <ShieldCheck className="w-9 h-9 text-brand-cyan" strokeWidth={2.2} />
          </div>
          <h1 className="text-2xl font-extrabold text-brand-navy tracking-tight">
            Reset Password
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Enter your company email to receive a secure recovery link
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200 shadow-glass p-8">
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
                  placeholder="name@immenseair.in"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue text-brand-navy placeholder:text-slate-400 transition-all"
                  disabled
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-brand-navy hover:bg-brand-blue transition-all shadow-md"
                disabled
              >
                <Send className="w-4 h-4" />
                <span>Send Reset Link (Phase 5)</span>
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-brand-blue hover:text-brand-blueHover"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
