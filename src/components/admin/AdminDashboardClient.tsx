"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Users,
  UserCheck,
  UserX,
  Clock,
  Search,
  RefreshCw,
  LogOut,
  ArrowLeft,
  Loader2,
  CheckCircle,
  AlertCircle,
  ShieldAlert,
  ChevronDown,
  Home,
} from "lucide-react";
import LogoutButton from "@/components/common/LogoutButton";
import { ROLES, USER_STATUS, Role, UserStatus } from "@/lib/constants/roles";

interface AdminUserItem {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  role: string;
  status: string;
  address: string | null;
  division: { name: string } | null;
  district: { name: string } | null;
  upazila: { name: string } | null;
  createdAt: string | Date;
}

interface AdminMetrics {
  total: number;
  active: number;
  pending: number;
  suspended: number;
}

interface AdminDashboardClientProps {
  currentAdminId: string;
  initialUsers: AdminUserItem[];
  initialMetrics: AdminMetrics;
}

export default function AdminDashboardClient({
  currentAdminId,
  initialUsers,
  initialMetrics,
}: AdminDashboardClientProps) {
  const [users, setUsers] = useState<AdminUserItem[]>(initialUsers);
  const [metrics, setMetrics] = useState<AdminMetrics>(initialMetrics);

  // Filters
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Loading & Action State
  const [isLoading, setIsLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  // Trigger automated search/filter fetch
  async function fetchUsers(searchQuery = search, role = roleFilter, status = statusFilter) {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (role !== "ALL") params.set("role", role);
      if (status !== "ALL") params.set("status", status);

      const res = await fetch(`/api/admin/users?${params.toString()}`);
      const json = await res.json();

      if (json.success) {
        setUsers(json.data.users);
        setMetrics(json.data.metrics);
      }
    } catch (err) {
      console.error("Failed to load users", err);
      showToast("error", "Failed to fetch user directory.");
    } finally {
      setIsLoading(false);
    }
  }

  // Handle Search Input Change with debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchUsers(search, roleFilter, statusFilter);
    }, 300);
    return () => clearTimeout(handler);
  }, [search, roleFilter, statusFilter]);

  function showToast(type: "success" | "error", text: string) {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  }

  // Toggle User Status (ACTIVE <-> SUSPENDED)
  async function handleToggleStatus(targetUser: AdminUserItem) {
    if (targetUser.id === currentAdminId) {
      showToast("error", "You cannot suspend your own administrator account.");
      return;
    }

    const nextStatus =
      targetUser.status === USER_STATUS.ACTIVE ? USER_STATUS.SUSPENDED : USER_STATUS.ACTIVE;

    try {
      setActionLoadingId(targetUser.id);
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: targetUser.id,
          status: nextStatus,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        showToast("error", json.error || "Failed to update user status.");
        return;
      }

      showToast("success", `User ${targetUser.name} status updated to ${nextStatus}.`);

      // Update in state directly
      setUsers((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, status: nextStatus } : u))
      );

      // Re-fetch metrics
      fetchUsers();
    } catch (err) {
      console.error(err);
      showToast("error", "Network error updating status.");
    } finally {
      setActionLoadingId(null);
    }
  }

  // Toggle User Role (USER <-> ADMIN)
  async function handleToggleRole(targetUser: AdminUserItem) {
    if (targetUser.id === currentAdminId) {
      showToast("error", "You cannot demote your own administrator privileges.");
      return;
    }

    const nextRole = targetUser.role === ROLES.ADMIN ? ROLES.USER : ROLES.ADMIN;

    try {
      setActionLoadingId(targetUser.id);
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: targetUser.id,
          role: nextRole,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        showToast("error", json.error || "Failed to change user role.");
        return;
      }

      showToast("success", `User ${targetUser.name} role changed to ${nextRole}.`);

      setUsers((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, role: nextRole } : u))
      );
    } catch (err) {
      console.error(err);
      showToast("error", "Network error changing role.");
    } finally {
      setActionLoadingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
          <div
            className={`p-4 rounded-xl border flex items-center gap-3 text-sm shadow-lg ${
              toastMessage.type === "success"
                ? "bg-green-950/80 border-green-700/50 text-green-300"
                : "bg-red-950/80 border-red-700/50 text-red-300"
            }`}
          >
            {toastMessage.type === "success" ? (
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        )}

        {/* Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">User Management</h1>
            <p className="text-sm text-slate-400 mt-1">
              Oversee registered accounts, monitor verification status, and manage administrative privileges.
            </p>
          </div>

          <button
            onClick={() => fetchUsers()}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition self-start sm:self-auto disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh Data</span>
          </button>
        </div>

        {/* Overview Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Users */}
          <div className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700/80 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Total Users
              </div>
              <div className="text-2xl font-bold text-white mt-1.5">{metrics.total}</div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <Users className="w-5 h-5" />
            </div>
          </div>

          {/* Active Users */}
          <div className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700/80 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Active Accounts
              </div>
              <div className="text-2xl font-bold text-green-400 mt-1.5">{metrics.active}</div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center border border-green-500/20">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>

          {/* Pending Verification */}
          <div className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700/80 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Pending OTP
              </div>
              <div className="text-2xl font-bold text-amber-400 mt-1.5">{metrics.pending}</div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          {/* Suspended Accounts */}
          <div className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700/80 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Suspended
              </div>
              <div className="text-2xl font-bold text-red-400 mt-1.5">{metrics.suspended}</div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center border border-red-500/20">
              <UserX className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/80 flex flex-col md:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, phone, or email..."
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs text-slate-400 whitespace-nowrap">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-auto"
            >
              <option value="ALL">All Roles</option>
              <option value={ROLES.ADMIN}>ADMIN</option>
              <option value={ROLES.USER}>USER</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs text-slate-400 whitespace-nowrap">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-auto"
            >
              <option value="ALL">All Statuses</option>
              <option value={USER_STATUS.ACTIVE}>ACTIVE</option>
              <option value={USER_STATUS.PENDING_VERIFICATION}>PENDING_VERIFICATION</option>
              <option value={USER_STATUS.SUSPENDED}>SUSPENDED</option>
            </select>
          </div>
        </div>

        {/* User Management Table */}
        <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-700/80">
                <tr>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Phone</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Joined</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 text-slate-300">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-500">
                      No matching user accounts found.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => {
                    const isSelf = u.id === currentAdminId;
                    const isActionLoading = actionLoadingId === u.id;

                    return (
                      <tr key={u.id} className="hover:bg-slate-750/50 transition">
                        {/* User Identity */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-700 text-slate-200 flex items-center justify-center font-bold text-xs uppercase flex-shrink-0">
                              {u.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-semibold text-white flex items-center gap-1.5">
                                <span>{u.name}</span>
                                {isSelf && (
                                  <span className="text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                                    You
                                  </span>
                                )}
                              </div>
                              <div className="text-slate-400 text-[11px]">
                                {u.email || "No email"}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Phone */}
                        <td className="py-3.5 px-4 font-mono text-slate-300">{u.phone}</td>

                        {/* Location */}
                        <td className="py-3.5 px-4 text-slate-400">
                          {u.division?.name ? (
                            <div>
                              <span>{u.division.name}</span>
                              {u.district?.name && (
                                <span className="text-slate-500"> / {u.district.name}</span>
                              )}
                              {u.upazila?.name && (
                                <span className="text-slate-500"> / {u.upazila.name}</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-600">Unspecified</span>
                          )}
                        </td>

                        {/* Role Badge */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              u.role === ROLES.ADMIN
                                ? "bg-red-500/20 text-red-300 border border-red-500/30"
                                : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>

                        {/* Status Badge */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              u.status === USER_STATUS.ACTIVE
                                ? "bg-green-500/20 text-green-300 border border-green-500/30"
                                : u.status === USER_STATUS.PENDING_VERIFICATION
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                : "bg-red-500/20 text-red-300 border border-red-500/30"
                            }`}
                          >
                            {u.status}
                          </span>
                        </td>

                        {/* Joined Date */}
                        <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                          {new Date(u.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center justify-end gap-2">
                            {/* Toggle Status (Active / Suspend) */}
                            <button
                              disabled={isSelf || isActionLoading}
                              onClick={() => handleToggleStatus(u)}
                              title={
                                isSelf
                                  ? "Cannot modify own status"
                                  : u.status === USER_STATUS.ACTIVE
                                  ? "Suspend account"
                                  : "Activate account"
                              }
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                                isSelf
                                  ? "opacity-30 cursor-not-allowed text-slate-500 bg-slate-800"
                                  : u.status === USER_STATUS.ACTIVE
                                  ? "text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-900/60 border border-red-800/40"
                                  : "text-green-400 hover:text-green-300 bg-green-950/40 hover:bg-green-900/60 border border-green-800/40"
                              }`}
                            >
                              {isActionLoading ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : u.status === USER_STATUS.ACTIVE ? (
                                "Suspend"
                              ) : (
                                "Activate"
                              )}
                            </button>

                            {/* Toggle Role (USER <-> ADMIN) */}
                            <button
                              disabled={isSelf || isActionLoading}
                              onClick={() => handleToggleRole(u)}
                              title={
                                isSelf
                                  ? "Cannot modify own role"
                                  : u.role === ROLES.ADMIN
                                  ? "Demote to User"
                                  : "Promote to Admin"
                              }
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                                isSelf
                                  ? "opacity-30 cursor-not-allowed text-slate-500 bg-slate-800"
                                  : u.role === ROLES.ADMIN
                                  ? "text-amber-400 hover:text-amber-300 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800/40"
                                  : "text-blue-400 hover:text-blue-300 bg-blue-950/40 hover:bg-blue-900/60 border border-blue-800/40"
                              }`}
                            >
                              {isActionLoading ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : u.role === ROLES.ADMIN ? (
                                "Demote"
                              ) : (
                                "Make Admin"
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
    </div>
  );
}
