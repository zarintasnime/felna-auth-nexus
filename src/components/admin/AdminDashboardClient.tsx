"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Search,
  RefreshCw,
  Loader2,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  ShieldAlert,
} from "lucide-react";
import { ROLES, USER_STATUS } from "@/lib/constants/roles";

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
          className={`p-4 rounded-xl border flex items-center gap-3 text-sm shadow-sm ${
            toastMessage.type === "success"
              ? "bg-emerald-100/90 border-emerald-200 text-emerald-800"
              : "bg-rose-100/90 border-rose-200 text-rose-800"
          }`}
        >
          {toastMessage.type === "success" ? (
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">User Management</h1>
          <p className="text-sm text-slate-500 mt-1">
            Oversee registered accounts, monitor verification status, and manage administrative privileges.
          </p>
        </div>

        <button
          onClick={() => fetchUsers()}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200/90 shadow-xs transition self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-sky-600" : ""}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* Top Statistical Cards with Vibrant Smooth Gradients                   */}
      {/* (Purple: Total, Cyan: Confirmed/Active, Pink: Pending, Green: System) */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Users (Vibrant Purple Gradient) */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-700 text-white shadow-md relative overflow-hidden flex flex-col justify-between group hover:scale-[1.01] transition-transform">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold uppercase tracking-wider text-purple-100">
              Total Accounts
            </div>
            <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-xs text-white flex items-center justify-center border border-white/25 shadow-xs">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-white tracking-tight">{metrics.total}</div>
            <div className="text-[11px] text-purple-100/90 mt-1.5 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5 text-purple-200" />
              <span>Registered User Base</span>
            </div>
          </div>
        </div>

        {/* 2. Active Accounts (Vibrant Cyan Gradient) */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-500 via-sky-500 to-blue-600 text-white shadow-md relative overflow-hidden flex flex-col justify-between group hover:scale-[1.01] transition-transform">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold uppercase tracking-wider text-cyan-100">
              Confirmed & Active
            </div>
            <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-xs text-white flex items-center justify-center border border-white/25 shadow-xs">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-white tracking-tight">{metrics.active}</div>
            <div className="text-[11px] text-cyan-100/90 mt-1.5 flex items-center gap-1 font-medium">
              <CheckCircle className="w-3.5 h-3.5 text-cyan-200" />
              <span>Full Portal Access</span>
            </div>
          </div>
        </div>

        {/* 3. Pending Verification (Vibrant Pink Gradient) */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-rose-600 text-white shadow-md relative overflow-hidden flex flex-col justify-between group hover:scale-[1.01] transition-transform">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold uppercase tracking-wider text-pink-100">
              Pending OTP
            </div>
            <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-xs text-white flex items-center justify-center border border-white/25 shadow-xs">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-white tracking-tight">{metrics.pending}</div>
            <div className="text-[11px] text-pink-100/90 mt-1.5 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 text-pink-200" />
              <span>Awaiting Mobile OTP</span>
            </div>
          </div>
        </div>

        {/* 4. Suspended / Status Alert (Vibrant Green/Teal Gradient) */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-teal-700 text-white shadow-md relative overflow-hidden flex flex-col justify-between group hover:scale-[1.01] transition-transform">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-100">
              Account Security
            </div>
            <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-xs text-white flex items-center justify-center border border-white/25 shadow-xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-white tracking-tight">{metrics.suspended}</div>
            <div className="text-[11px] text-emerald-100/90 mt-1.5 flex items-center gap-1 font-medium">
              <UserX className="w-3.5 h-3.5 text-emerald-200" />
              <span>Suspended Accounts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar - Clean White Card */}
      <div className="p-4 bg-white rounded-2xl border border-slate-300/80 shadow-sm flex flex-col md:flex-row items-center gap-3">
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
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:bg-white transition"
          />
        </div>

        {/* Role Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-slate-500 whitespace-nowrap">Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:bg-white w-full md:w-auto"
          >
            <option value="ALL">All Roles</option>
            <option value={ROLES.ADMIN}>ADMIN</option>
            <option value={ROLES.USER}>USER</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-slate-500 whitespace-nowrap">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:bg-white w-full md:w-auto"
          >
            <option value="ALL">All Statuses</option>
            <option value={USER_STATUS.ACTIVE}>ACTIVE</option>
            <option value={USER_STATUS.PENDING_VERIFICATION}>PENDING_VERIFICATION</option>
            <option value={USER_STATUS.SUSPENDED}>SUSPENDED</option>
          </select>
        </div>
      </div>

      {/* User Management Table - Clean White Card */}
      <div className="bg-white rounded-2xl border border-slate-300/80 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/90 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200/80">
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
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    No matching user accounts found.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const isSelf = u.id === currentAdminId;
                  const isActionLoading = actionLoadingId === u.id;

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition">
                      {/* User Identity */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center font-bold text-xs uppercase flex-shrink-0">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                              <span>{u.name}</span>
                              {isSelf && (
                                <span className="text-[10px] text-sky-700 bg-sky-100 px-1.5 py-0.5 rounded border border-sky-200 font-medium">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-slate-500 text-[11px]">
                              {u.email || "No email"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-4 font-mono text-slate-800">{u.phone}</td>

                      {/* Location */}
                      <td className="py-3.5 px-4 text-slate-600">
                        {u.division?.name ? (
                          <div>
                            <span className="font-medium text-slate-700">{u.division.name}</span>
                            {u.district?.name && (
                              <span className="text-slate-500"> / {u.district.name}</span>
                            )}
                            {u.upazila?.name && (
                              <span className="text-slate-400"> / {u.upazila.name}</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400">Unspecified</span>
                        )}
                      </td>

                      {/* Role Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            u.role === ROLES.ADMIN
                              ? "bg-purple-100 text-purple-700 border border-purple-200"
                              : "bg-sky-100 text-sky-700 border border-sky-200"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      {/* Status Badge - Soft green (emerald-100) & warm amber (amber-100) for alerts */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            u.status === USER_STATUS.ACTIVE
                              ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                              : u.status === USER_STATUS.PENDING_VERIFICATION
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : "bg-rose-100 text-rose-700 border border-rose-200"
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        {new Date(u.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center justify-end gap-1.5">
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
                                ? "opacity-30 cursor-not-allowed text-slate-400 bg-slate-100 border border-slate-200"
                                : u.status === USER_STATUS.ACTIVE
                                ? "text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200"
                                : "text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200"
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
                                ? "opacity-30 cursor-not-allowed text-slate-400 bg-slate-100 border border-slate-200"
                                : u.role === ROLES.ADMIN
                                ? "text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200"
                                : "text-sky-700 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200"
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
