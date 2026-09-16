import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { logAuditEvent } from "@/lib/audit";
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus, 
  ShieldCheck, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  Layers, 
  Building2, 
  AlertCircle,
  X,
  Lock,
  Sparkles
} from "lucide-react";

interface MockUser {
  id: string;
  fullName: string;
  email: string;
  orgSlug: string;
  orgName: string;
  roleName: string;
  isActive: boolean;
  apps: string[];
}

export const UsersPage: React.FC = () => {
  const { user, profile, organization, role, isSuperAdmin } = useAuth();

  // Baseline directory of users (in production, hydrated via Supabase profiles table)
  const [users, setUsers] = useState<MockUser[]>([
    {
      id: "u-1",
      fullName: "Parvez Hashmi",
      email: "parvez@immenseair.in",
      orgSlug: "immense-air",
      orgName: "Immense Air Pvt Ltd",
      roleName: "Admin",
      isActive: true,
      apps: ["error-hub", "immense-quotes"],
    },
    {
      id: "u-2",
      fullName: "Rahul Sharma",
      email: "rahul@immenseair.in",
      orgSlug: "immense-air",
      orgName: "Immense Air Pvt Ltd",
      roleName: "Support",
      isActive: true,
      apps: ["error-hub"],
    },
    {
      id: "u-3",
      fullName: "Rushikesh Limje",
      email: "rushikesh@immenseair.in",
      orgSlug: "immense-air",
      orgName: "Immense Air Pvt Ltd",
      roleName: "Sales",
      isActive: true,
      apps: ["immense-quotes"],
    },
    {
      id: "u-4",
      fullName: "Syed Muzammil",
      email: "muzammil@zion.in",
      orgSlug: "zion",
      orgName: "Zion",
      roleName: "Sales",
      isActive: true,
      apps: ["zion-quotes"],
    },
    {
      id: "u-5",
      fullName: "Zion Operations Admin",
      email: "admin@zion.in",
      orgSlug: "zion",
      orgName: "Zion",
      roleName: "Admin",
      isActive: true,
      apps: ["zion-quotes"],
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("ALL");

  // Modal states
  const [appModalUser, setAppModalUser] = useState<MockUser | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New User Form State
  const [newFullName, setNewFullName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("Sales");
  const [newOrg, setNewOrg] = useState(organization?.slug || "immense-air");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Enforce Organization Scope at the UI query level (database RLS enforces at kernel level)
  const scopedUsers = users.filter((u) => {
    if (!isSuperAdmin) {
      // Organization Admin can only view users of their own company
      if (u.orgSlug !== organization?.slug) return false;
    }
    if (selectedRoleFilter !== "ALL" && u.roleName !== selectedRoleFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    }
    return true;
  });

  // Toggle user activation / deactivation
  const handleToggleActive = async (targetUser: MockUser) => {
    // Security check: Org Admin cannot edit another company's user
    if (!isSuperAdmin && targetUser.orgSlug !== organization?.slug) {
      showToast("Unauthorized: Cannot modify user outside your organization scope.");
      return;
    }

    const nextState = !targetUser.isActive;
    setUsers((prev) =>
      prev.map((u) => (u.id === targetUser.id ? { ...u, isActive: nextState } : u))
    );

    const actionName = nextState ? "USER_REACTIVATED" : "USER_DEACTIVATED";
    await logAuditEvent({
      action: actionName,
      userId: user?.id,
      organizationId: targetUser.orgSlug,
      targetType: "USER",
      targetId: targetUser.id,
      metadata: { targetEmail: targetUser.email, newActiveStatus: nextState },
    });

    showToast(`User ${targetUser.fullName} ${nextState ? "activated" : "deactivated"}.`);
  };

  // Toggle application assignment override
  const handleToggleApp = async (appId: string) => {
    if (!appModalUser) return;

    // Strict boundary defense: Cannot assign Zion app to Immense, or vice versa
    if (appId === "zion-quotes" && appModalUser.orgSlug !== "zion") {
      showToast("Security Violation: Cannot assign Zion application to Immense Air account.");
      return;
    }
    if ((appId === "error-hub" || appId === "immense-quotes") && appModalUser.orgSlug === "zion") {
      showToast("Security Violation: Cannot assign Immense Air application to Zion account.");
      return;
    }

    const hasApp = appModalUser.apps.includes(appId);
    const updatedApps = hasApp
      ? appModalUser.apps.filter((a) => a !== appId)
      : [...appModalUser.apps, appId];

    setUsers((prev) =>
      prev.map((u) => (u.id === appModalUser.id ? { ...u, apps: updatedApps } : u))
    );
    setAppModalUser((prev) => (prev ? { ...prev, apps: updatedApps } : null));

    await logAuditEvent({
      action: hasApp ? "APPLICATION_ACCESS_REVOKED" : "APPLICATION_ACCESS_GRANTED",
      userId: user?.id,
      organizationId: appModalUser.orgSlug,
      targetType: "USER_APPLICATION",
      targetId: appModalUser.id,
      metadata: { targetEmail: appModalUser.email, application: appId },
    });

    showToast(`Application access updated for ${appModalUser.fullName}.`);
  };

  // Handle user creation
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newFullName || !newEmail) {
      showToast("Please provide full name and valid email.");
      return;
    }

    // Security Check: Non-super admins cannot create Super Admins or cross-tenant accounts
    if (!isSuperAdmin) {
      if (newRole === "Super Admin") {
        showToast("Access Denied: Only Super Admin can provision Super Admin role.");
        return;
      }
      if (newOrg !== organization?.slug) {
        showToast("Access Denied: Cannot provision user for a different organization.");
        return;
      }
    }

    const defaultApps = newRole === "Support" || newRole === "Operations" 
      ? ["error-hub"] 
      : newOrg === "zion" 
        ? ["zion-quotes"] 
        : ["immense-quotes"];

    const createdUser: MockUser = {
      id: `u-${Date.now()}`,
      fullName: newFullName,
      email: newEmail.trim(),
      orgSlug: newOrg,
      orgName: newOrg === "zion" ? "Zion" : "Immense Air Pvt Ltd",
      roleName: newRole,
      isActive: true,
      apps: defaultApps,
    };

    setUsers((prev) => [createdUser, ...prev]);
    setCreateModalOpen(false);
    setNewFullName("");
    setNewEmail("");

    await logAuditEvent({
      action: "USER_CREATED",
      userId: user?.id,
      organizationId: newOrg,
      targetType: "USER",
      targetId: createdUser.id,
      metadata: { createdEmail: createdUser.email, assignedRole: newRole },
    });

    showToast(`User ${createdUser.fullName} provisioned successfully.`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-brand-navy text-white text-xs font-semibold rounded-2xl shadow-glow border border-brand-cyan/30 flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-brand-cyan" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Action Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-card flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email address..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue text-brand-navy placeholder:text-slate-400 transition-all"
            />
          </div>

          {/* Role Filter */}
          <div className="flex items-center space-x-1.5 text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
              className="py-2 px-3 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30 text-brand-navy font-medium"
            >
              <option value="ALL">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Sales">Sales</option>
              <option value="Support">Support</option>
              <option value="Operations">Operations</option>
            </select>
          </div>
        </div>

        {/* Create User Button */}
        <button
          type="button"
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-brand-navy hover:bg-brand-blue text-white text-xs font-semibold transition-all shadow-sm active:scale-[0.99]"
        >
          <UserPlus className="w-3.5 h-3.5 text-brand-cyan" />
          <span>Provision New User</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                <th className="py-3.5 px-6">User / Identity</th>
                <th className="py-3.5 px-4">Organization</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Application Access</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {scopedUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Name & Email */}
                  <td className="py-4 px-6">
                    <div className="font-bold text-brand-navy text-sm">{u.fullName}</div>
                    <div className="text-slate-400 text-[11px]">{u.email}</div>
                  </td>

                  {/* Organization */}
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                      u.orgSlug === "immense-air" 
                        ? "bg-blue-50 text-brand-blue border border-blue-200" 
                        : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                    }`}>
                      {u.orgName}
                    </span>
                  </td>

                  {/* Role */}
                  <td className="py-4 px-4">
                    <span className="font-semibold text-slate-700">{u.roleName}</span>
                  </td>

                  {/* Active Status Badge */}
                  <td className="py-4 px-4">
                    {u.isActive ? (
                      <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Active</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                        <XCircle className="w-3 h-3" />
                        <span>Disabled</span>
                      </span>
                    )}
                  </td>

                  {/* App Access Pills */}
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1">
                      {u.apps.map((app) => (
                        <span key={app} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200/60">
                          {app === "error-hub" ? "Error Hub" : app === "immense-quotes" ? "Immense Quotes" : "Zion Quotes"}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => setAppModalUser(u)}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-brand-navy hover:text-brand-blue bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                      <Layers className="w-3 h-3" />
                      <span>Apps</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleActive(u)}
                      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                        u.isActive 
                          ? "text-rose-600 hover:bg-rose-50" 
                          : "text-emerald-700 hover:bg-emerald-50"
                      }`}
                    >
                      {u.isActive ? "Deactivate" : "Reactivate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Application Access Override */}
      {appModalUser && (
        <div className="fixed inset-0 z-50 bg-brand-navy/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-glow border border-slate-200 space-y-5 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-brand-navy">Assign Applications</h3>
                <p className="text-xs text-slate-500">for {appModalUser.fullName} ({appModalUser.orgName})</p>
              </div>
              <button
                type="button"
                onClick={() => setAppModalUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Error Hub Toggle */}
              <label className={`flex items-start space-x-3 p-3 rounded-2xl border transition-all ${
                appModalUser.orgSlug === "zion" 
                  ? "bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed"
                  : "bg-white border-slate-200 hover:border-brand-blue/30 cursor-pointer"
              }`}>
                <input
                  type="checkbox"
                  checked={appModalUser.apps.includes("error-hub")}
                  onChange={() => handleToggleApp("error-hub")}
                  disabled={appModalUser.orgSlug === "zion"}
                  className="mt-0.5 rounded text-brand-blue focus:ring-brand-blue"
                />
                <div>
                  <span className="font-bold text-brand-navy block">Error Code Intelligence Hub</span>
                  <span className="text-[11px] text-slate-500">Immense Air Support & Technical operations</span>
                  {appModalUser.orgSlug === "zion" && (
                    <span className="text-[10px] text-rose-600 font-semibold block mt-0.5">
                      Restricted: Belongs to Immense Air Pvt Ltd
                    </span>
                  )}
                </div>
              </label>

              {/* Immense Quotes Toggle */}
              <label className={`flex items-start space-x-3 p-3 rounded-2xl border transition-all ${
                appModalUser.orgSlug === "zion" 
                  ? "bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed"
                  : "bg-white border-slate-200 hover:border-brand-blue/30 cursor-pointer"
              }`}>
                <input
                  type="checkbox"
                  checked={appModalUser.apps.includes("immense-quotes")}
                  onChange={() => handleToggleApp("immense-quotes")}
                  disabled={appModalUser.orgSlug === "zion"}
                  className="mt-0.5 rounded text-brand-blue focus:ring-brand-blue"
                />
                <div>
                  <span className="font-bold text-brand-navy block">Immense Air Quotation Manager</span>
                  <span className="text-[11px] text-slate-500">Proposals for Immense Air sales executives</span>
                  {appModalUser.orgSlug === "zion" && (
                    <span className="text-[10px] text-rose-600 font-semibold block mt-0.5">
                      Restricted: Belongs to Immense Air Pvt Ltd
                    </span>
                  )}
                </div>
              </label>

              {/* Zion Quotes Toggle */}
              <label className={`flex items-start space-x-3 p-3 rounded-2xl border transition-all ${
                appModalUser.orgSlug === "immense-air" 
                  ? "bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed"
                  : "bg-white border-slate-200 hover:border-brand-blue/30 cursor-pointer"
              }`}>
                <input
                  type="checkbox"
                  checked={appModalUser.apps.includes("zion-quotes")}
                  onChange={() => handleToggleApp("zion-quotes")}
                  disabled={appModalUser.orgSlug === "immense-air"}
                  className="mt-0.5 rounded text-brand-blue focus:ring-brand-blue"
                />
                <div>
                  <span className="font-bold text-brand-navy block">Zion Quotation Manager</span>
                  <span className="text-[11px] text-slate-500">Proposals for Zion sales executives</span>
                  {appModalUser.orgSlug === "immense-air" && (
                    <span className="text-[10px] text-rose-600 font-semibold block mt-0.5">
                      Restricted: Belongs to Zion entity
                    </span>
                  )}
                </div>
              </label>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setAppModalUser(null)}
                className="px-4 py-2 rounded-xl bg-brand-navy text-white text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Provision New User */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-brand-navy/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-glow border border-slate-200 space-y-5 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-brand-navy">Provision Enterprise User</h3>
                <p className="text-xs text-slate-500">Register employee profile and assign credentials</p>
              </div>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-brand-navy uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-navy uppercase tracking-wider mb-1">
                  Enterprise Work Email
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. rahul@immenseair.in"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-brand-navy uppercase tracking-wider mb-1">
                    Organization
                  </label>
                  <select
                    value={newOrg}
                    onChange={(e) => setNewOrg(e.target.value as any)}
                    disabled={!isSuperAdmin}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white disabled:bg-slate-100"
                  >
                    <option value="immense-air">Immense Air Pvt Ltd</option>
                    <option value="zion">Zion</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-brand-navy uppercase tracking-wider mb-1">
                    Role
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Sales">Sales</option>
                    <option value="Support">Support</option>
                    <option value="Operations">Operations</option>
                    <option value="Admin">Admin</option>
                    {isSuperAdmin && <option value="Super Admin">Super Admin</option>}
                  </select>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200/80 rounded-xl text-[11px] text-blue-900 leading-relaxed">
                <span className="font-semibold block mb-0.5">Secure Provisioning Architecture:</span>
                Password is never collected in the browser. In production, Supabase Auth dispatches an enterprise setup invitation (`inviteUserByEmail`), keeping service-role keys off client devices.
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-navy hover:bg-brand-blue text-white font-semibold shadow-sm"
                >
                  Provision User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
