"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Users,
  Search,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  Key,
} from "lucide-react";
import { ROLES } from "@/lib/constants/roles";
import { ROLE_PERMISSIONS, PERMISSIONS } from "@/lib/constants/permissions";

interface UserItem {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  role: string;
  status: string;
}

export default function AdminRbacClient() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function showToast(type: "success" | "error", text: string) {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  }

  async function loadUsers() {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (roleFilter !== "ALL") params.set("role", roleFilter);

      const res = await fetch(`/api/admin/users?${params.toString()}`);
      const json = await res.json();
      if (json.success && json.data) {
        setUsers(json.data.users);
      }
    } catch {
      showToast("error", "Failed to load user directory.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      loadUsers();
    }, 300);
    return () => clearTimeout(handler);
  }, [search, roleFilter]);

  async function handleRoleChange(user: UserItem, newRole: string) {
    if (user.role === newRole) return;

    try {
      setActionLoadingId(user.id);
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          role: newRole,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        showToast("error", json.error || "Failed to update role.");
        return;
      }

      showToast("success", `Updated ${user.name}'s role to ${newRole}.`);
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
      );
    } catch {
      showToast("error", "Network error changing role.");
    } finally {
      setActionLoadingId(null);
    }
  }

  const PERMISSION_COLUMNS = [
    { key: PERMISSIONS.CMS_READ, label: "View CMS Content" },
    { key: PERMISSIONS.CMS_WRITE, label: "Create / Edit CMS" },
    { key: PERMISSIONS.CMS_PUBLISH, label: "Publish Slides & Links" },
    { key: PERMISSIONS.CMS_DELETE, label: "Delete Content" },
    { key: PERMISSIONS.USERS_MANAGE, label: "Manage User Roles" },
    { key: PERMISSIONS.SETTINGS_MANAGE, label: "Modify System Settings" },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 text-sm shadow-sm ${
            toast.type === "success"
              ? "bg-emerald-100/90 border-emerald-200 text-emerald-800"
              : "bg-rose-100/90 border-rose-200 text-rose-800"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          )}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-purple-600" />
            <span>Role-Based Access Control (RBAC)</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review the granular permission matrix, inspect capability policies, and assign administrative roles.
          </p>
        </div>

        <button
          onClick={loadUsers}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-xs transition self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-purple-600" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* RBAC Permission Matrix Card */}
      <div className="bg-white rounded-2xl border border-slate-300/80 shadow-sm overflow-hidden p-6 space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
            <Key className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">System Capability Matrix</h3>
            <p className="text-xs text-slate-500">
              Decoupled permissions granted per authenticated role in the system.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Role</th>
                {PERMISSION_COLUMNS.map((col) => (
                  <th key={col.key} className="py-3 px-3 text-center">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {Object.keys(ROLES).map((roleKey) => {
                const rolePermissions = ROLE_PERMISSIONS[roleKey] || [];
                const isSuper = roleKey === ROLES.SUPER_ADMIN;

                return (
                  <tr key={roleKey} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isSuper
                            ? "bg-purple-100 text-purple-800 border border-purple-200"
                            : roleKey === ROLES.ADMIN
                            ? "bg-indigo-100 text-indigo-800 border border-indigo-200"
                            : roleKey === ROLES.EDITOR
                            ? "bg-sky-100 text-sky-800 border border-sky-200"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        {roleKey}
                      </span>
                    </td>
                    {PERMISSION_COLUMNS.map((col) => {
                      const hasPerm = isSuper || rolePermissions.includes(col.key as any);
                      return (
                        <td key={col.key} className="py-3 px-3 text-center">
                          {hasPerm ? (
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-700">
                              ✓
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-400">
                              –
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Assignment Section */}
      <div className="bg-white rounded-2xl border border-slate-300/80 shadow-sm overflow-hidden p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">User Role Management</h3>
              <p className="text-xs text-slate-500">
                Grant or revoke administrative permissions for any registered user.
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search user..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            >
              <option value="ALL">All Roles</option>
              <option value={ROLES.SUPER_ADMIN}>SUPER_ADMIN</option>
              <option value={ROLES.ADMIN}>ADMIN</option>
              <option value={ROLES.EDITOR}>EDITOR</option>
              <option value={ROLES.USER}>USER</option>
            </select>
          </div>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Phone Number</th>
                <th className="py-3 px-4">Current Role</th>
                <th className="py-3 px-4">Change Privilege</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-slate-400">
                    No users matching criteria.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const isLoadingAction = actionLoadingId === u.id;

                  return (
                    <tr key={u.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{u.name}</div>
                        <div className="text-[11px] text-slate-400">{u.email || "No email"}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700">{u.phone}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.role === ROLES.SUPER_ADMIN
                              ? "bg-purple-100 text-purple-800 border border-purple-200"
                              : u.role === ROLES.ADMIN
                              ? "bg-indigo-100 text-indigo-800 border border-indigo-200"
                              : u.role === ROLES.EDITOR
                              ? "bg-sky-100 text-sky-800 border border-sky-200"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={u.role}
                            disabled={isLoadingAction}
                            onChange={(e) => handleRoleChange(u, e.target.value)}
                            className="px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                          >
                            <option value={ROLES.USER}>USER</option>
                            <option value={ROLES.EDITOR}>EDITOR</option>
                            <option value={ROLES.ADMIN}>ADMIN</option>
                            <option value={ROLES.SUPER_ADMIN}>SUPER_ADMIN</option>
                          </select>
                          {isLoadingAction && (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-600" />
                          )}
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
