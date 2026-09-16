import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { isSupabaseConfigured } from "@/lib/supabase";
import { sanitizeInternalRedirect } from "@/lib/security";
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Loader2,
  CheckCircle2,
  Info
} from "lucide-react";

export const Login: React.FC = () => {
  const { signIn, accountDisabledError, user, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    (location.state as any)?.error || accountDisabledError || null
  );

  // If user and profile are already authenticated and loaded, redirect to workspace
  React.useEffect(() => {
    if (user && profile && profile.isActive) {
      const destination = sanitizeInternalRedirect((location.state as any)?.from?.pathname);
      navigate(destination, { replace: true });
    }
  }, [user, profile, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage("Please enter both your work email and password.");
      return;
    }

    if (!isSupabaseConfigured) {
      setErrorMessage(
        "Supabase credentials are not yet configured in .env. Please provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
      );
      return;
    }

    setSubmitting(true);
    const { error } = await signIn(email, password);

    if (error) {
      setErrorMessage(error.message || "Failed to sign in. Please check your credentials.");
      setSubmitting(false);
    } else {
      const destination = sanitizeInternalRedirect((location.state as any)?.from?.pathname);
      navigate(destination, { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-gradient-to-br from-brand-canvas via-white to-sky-50">
      <div className="w-full max-w-md">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-white shadow-card mb-4 border border-slate-200/80 transition-transform hover:scale-105">
            <img 
              src="/immense-air-logo.jpg" 
              alt="Immense Air Pvt Ltd" 
              className="w-20 h-20 object-contain rounded-xl"
            />
          </div>
          <h1 className="text-2xl font-extrabold text-brand-navy tracking-tight">
            Immense Enterprise Workspace
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Sign in with your enterprise credentials to access authorized applications
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-slate-200/80 shadow-glass p-8">
          {/* Supabase Status Banner */}
          {!isSupabaseConfigured ? (
            <div className="mb-6 p-3.5 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-start space-x-2.5 text-xs text-amber-800">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">Supabase Connection Required</span>
                Paste your project URL & anon key into <code className="bg-amber-100/70 px-1 py-0.5 rounded text-[11px]">.env</code> to enable live authentication.
              </div>
            </div>
          ) : (
            <div className="mb-6 flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Enterprise SSO Gate
              </span>
              <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3 h-3" />
                <span>Supabase Auth Live</span>
              </span>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200/80 rounded-2xl flex items-start space-x-2.5 text-xs text-rose-700 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{errorMessage}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@immenseair.in or name@zion.in"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue text-brand-navy placeholder:text-slate-400 transition-all"
                  required
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
                  className="text-xs font-semibold text-brand-blue hover:text-brand-blueHover transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue text-brand-navy placeholder:text-slate-400 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-brand-navy hover:bg-brand-blue transition-all shadow-md active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-brand-cyan" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400">
              Access is protected by Supabase Auth & PostgreSQL Row Level Security.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
