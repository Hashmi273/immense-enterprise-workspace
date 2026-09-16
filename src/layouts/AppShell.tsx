import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  ShieldCheck, 
  LayoutGrid, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Building2, 
  Terminal, 
  FileText,
  AlertOctagon
} from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isAuthPage = location.pathname === "/login" || location.pathname === "/reset-password";

  if (isAuthPage) {
    return <div className="min-h-screen bg-brand-canvas flex flex-col">{children}</div>;
  }

  const navItems = [
    { name: "Workspace", path: "/workspace", icon: LayoutGrid },
    { name: "Error Hub", path: "/apps/error-hub", icon: Terminal },
    { name: "Immense Quotes", path: "/apps/immense-quotes", icon: FileText },
    { name: "Zion Quotes", path: "/apps/zion-quotes", icon: Building2 },
    { name: "Admin Console", path: "/admin", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-brand-canvas flex flex-col selection:bg-brand-blue selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-brand-navy/95 backdrop-blur-md border-b border-white/10 text-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo */}
            <div className="flex items-center space-x-3">
              <Link to="/workspace" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-blue to-brand-cyan flex items-center justify-center shadow-glow transition-transform duration-200 group-hover:scale-105">
                  <ShieldCheck className="w-6 h-6 text-brand-navy" strokeWidth={2.2} />
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-extrabold text-lg tracking-tight text-white">IMMENSE</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-blue/30 text-brand-cyan border border-brand-cyan/30">
                      WORKSPACE
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-300 tracking-wider uppercase font-medium">Enterprise Portal</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-brand-blue text-white shadow-sm"
                        : "text-slate-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Quick Controls */}
            <div className="hidden md:flex items-center space-x-3">
              <Link
                to="/access-denied"
                title="Test Access Denied Screen"
                className="text-xs text-slate-400 hover:text-rose-300 flex items-center space-x-1 px-2 py-1 rounded bg-white/5 border border-white/10"
              >
                <AlertOctagon className="w-3.5 h-3.5" />
                <span>Test 403</span>
              </Link>
              <Link
                to="/login"
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-white/10 hover:bg-white/15 rounded-lg transition-colors border border-white/10"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign In / Out</span>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pt-2 pb-4 space-y-1 bg-brand-navy border-t border-white/10">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive ? "bg-brand-blue text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <div className="pt-2 border-t border-white/10">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-slate-300 hover:text-white"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign In / Out</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-semibold text-brand-navy">Immense Enterprise Workspace</span> &copy; 2026. All rights reserved.
          </div>
          <div className="flex items-center space-x-4 text-slate-400">
            <span>Immense Air Pvt Ltd &middot; Zion</span>
            <span>&bull;</span>
            <span className="text-brand-blue font-medium">Phase 3: Central Workspace Shell</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
