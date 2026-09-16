import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
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
  AlertOctagon,
  User,
  LogIn,
  ChevronDown
} from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, organization, role, isAdmin, canAccessApp, signOut } = useAuth();

  const isAuthPage = location.pathname === "/login" || location.pathname === "/reset-password";

  if (isAuthPage) {
    return <div className="min-h-screen bg-brand-canvas flex flex-col">{children}</div>;
  }

  const handleLogout = async () => {
    setUserDropdownOpen(false);
    await signOut();
    navigate("/login");
  };

  // Dynamically assemble navigation items based strictly on user's authorized access
  const navItems: Array<{ name: string; path: string; icon: any }> = [
    { name: "Workspace", path: "/workspace", icon: LayoutGrid },
  ];

  if (user && profile) {
    if (canAccessApp("error-hub")) {
      navItems.push({ name: "Error Hub", path: "/apps/error-hub", icon: Terminal });
    }
    if (canAccessApp("immense-quotes")) {
      navItems.push({ name: "Immense Quotes", path: "/apps/immense-quotes", icon: FileText });
    }
    if (canAccessApp("zion-quotes")) {
      navItems.push({ name: "Zion Quotes", path: "/apps/zion-quotes", icon: Building2 });
    }
    if (isAdmin) {
      navItems.push({ name: "Admin Console", path: "/admin", icon: Settings });
    }
  }

  return (
    <div className="min-h-screen bg-brand-canvas flex flex-col selection:bg-brand-blue selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-brand-navy/95 backdrop-blur-md border-b border-white/10 text-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo */}
            <div className="flex items-center space-x-3">
              <Link to="/workspace" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-md transition-transform duration-200 group-hover:scale-105 border border-white/20">
                  <img 
                    src="/immense-air-logo.jpg" 
                    alt="Immense Air" 
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-extrabold text-lg tracking-tight text-white">IMMENSE AIR</span>
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
                const isActive = location.pathname === item.path || (item.path === "/admin" && location.pathname.startsWith("/admin"));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
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

            {/* Right User Controls & Profile */}
            <div className="hidden md:flex items-center space-x-3">
              <Link
                to="/access-denied"
                title="Test Access Denied Screen"
                className="text-xs text-slate-400 hover:text-rose-300 flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 transition-colors"
              >
                <AlertOctagon className="w-3.5 h-3.5" />
                <span>Test 403</span>
              </Link>

              {user && profile ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2.5 pl-2.5 pr-2 py-1.5 rounded-xl hover:bg-white/10 transition-colors border border-transparent hover:border-white/10 text-left"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-blue to-brand-cyan flex items-center justify-center text-brand-navy font-bold text-xs">
                      {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div className="leading-tight">
                      <div className="text-xs font-bold text-white truncate max-w-[130px]">
                        {profile.fullName || user.email}
                      </div>
                      <div className="text-[10px] text-brand-cyan font-medium">
                        {organization?.name || "Immense"} &middot; {role?.name}
                      </div>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${userDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-glow border border-slate-200 py-2 text-xs text-brand-navy z-50 animate-fade-in">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <div className="font-bold text-sm text-brand-navy truncate">{profile.fullName}</div>
                        <div className="text-[11px] text-slate-400 truncate">{profile.email}</div>
                        <div className="mt-1.5 inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-blue-50 text-brand-blue text-[10px] font-semibold border border-blue-200/60">
                          <span>{organization?.name}</span>
                          <span>&bull;</span>
                          <span>{role?.name}</span>
                        </div>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/workspace"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 hover:bg-slate-50 text-slate-700"
                        >
                          <LayoutGrid className="w-3.5 h-3.5 text-slate-400" />
                          <span>My Workspace</span>
                        </Link>
                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center space-x-2 px-4 py-2 hover:bg-slate-50 text-slate-700"
                          >
                            <Settings className="w-3.5 h-3.5 text-slate-400" />
                            <span>Admin Console</span>
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-slate-100 pt-1">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-2 px-4 py-2 text-rose-600 hover:bg-rose-50 text-left font-medium"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-brand-blue hover:bg-brand-blueHover rounded-lg transition-colors shadow-sm"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
              )}
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

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pt-2 pb-4 space-y-2 bg-brand-navy border-t border-white/10">
            {user && profile && (
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10 flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-brand-blue flex items-center justify-center text-white font-bold">
                  {profile.fullName ? profile.fullName.charAt(0) : "U"}
                </div>
                <div className="text-xs">
                  <div className="font-bold text-white">{profile.fullName}</div>
                  <div className="text-slate-300">{organization?.name} &middot; {role?.name}</div>
                </div>
              </div>
            )}

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
              {user ? (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-rose-300 hover:text-rose-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-slate-300 hover:text-white"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
              )}
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
            <span className="text-brand-blue font-medium">Phase 8: Direct URL Protected & Polished Launcher</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
