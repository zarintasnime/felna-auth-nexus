"use client";

import React, { useState } from "react";
import { CmsAuditLog } from "@prisma/client";
import {
  History,
  Shield,
  Clock,
  User,
  ChevronDown,
  ChevronRight,
  Database,
  RefreshCw,
} from "lucide-react";

interface CmsAuditTabProps {
  initialAuditLogs: CmsAuditLog[];
}

export default function CmsAuditTab({ initialAuditLogs }: CmsAuditTabProps) {
  const [logs, setLogs] = useState<CmsAuditLog[]>(initialAuditLogs);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  async function handleRefresh() {
    setIsRefreshing(true);
    try {
      // Re-fetch via settings endpoint or page refresh
      window.location.reload();
    } finally {
      setIsRefreshing(false);
    }
  }

  function getActionBadge(action: string) {
    switch (action) {
      case "CREATE":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "UPDATE":
        return "bg-sky-50 text-sky-700 border-sky-200";
      case "DELETE":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "TOGGLE_STATUS":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "REORDER":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 p-5 sm:p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center">
            <History className="w-4 h-4 text-[#F5B83D]" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">CMS Enterprise Audit Trail</h4>
            <p className="text-xs text-slate-500">
              Immutable record of all content modifications, editor identities, and change snapshots
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="px-3 py-1.5 rounded-xl text-xs font-medium border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>Refresh Trail</span>
        </button>
      </div>

      {logs.length === 0 ? (
        <div className="p-8 text-center text-slate-400 text-xs">
          No audit log entries recorded yet. Modifications will be logged automatically.
        </div>
      ) : (
        <div className="space-y-2.5">
          {logs.map((log) => {
            const isExpanded = expandedLogId === log.id;
            let parsedChanges: any = null;
            if (log.changes) {
              try {
                parsedChanges = JSON.parse(log.changes);
              } catch {
                parsedChanges = log.changes;
              }
            }

            return (
              <div
                key={log.id}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all text-xs"
              >
                <div
                  onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase shrink-0 ${getActionBadge(
                        log.action
                      )}`}
                    >
                      {log.action}
                    </span>
                    <span className="font-bold text-slate-900">{log.entity}</span>
                    <span className="text-[11px] text-slate-400 truncate">
                      ID: {log.entityId}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-500 text-[11px] shrink-0">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" />
                      {log.userId}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                    {log.changes && (
                      <span className="text-slate-400">
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                      </span>
                    )}
                  </div>
                </div>

                {/* Expandable JSON Snapshot */}
                {isExpanded && log.changes && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Payload Snapshot:
                    </div>
                    <pre className="p-3 rounded-lg bg-slate-950 text-slate-200 text-[11px] font-mono overflow-x-auto max-h-48">
                      {typeof parsedChanges === "object"
                        ? JSON.stringify(parsedChanges, null, 2)
                        : parsedChanges}
                    </pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
