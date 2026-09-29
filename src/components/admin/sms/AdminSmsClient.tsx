"use client";

import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Send,
  RefreshCw,
  Loader2,
  CheckCircle,
  AlertCircle,
  ShieldAlert,
  Clock,
  Radio,
  Trash2,
  HelpCircle,
  Zap,
} from "lucide-react";

interface GatewayInfo {
  provider: string;
  apiUrl: string;
  senderId: string;
  isMockMode: boolean;
  isConfigured: boolean;
  maskedApiKey: string;
  config: {
    CODE_LENGTH: number;
    COOLDOWN_SECONDS: number;
    MAX_FAILED_ATTEMPTS: number;
    EXPIRATION_SECONDS: number;
    RATE_LIMIT_WINDOW_SECONDS: number;
    MAX_REQUESTS_PER_WINDOW: number;
  };
}

interface SmsStats {
  totalSent: number;
  verified: number;
  pendingOrExpired: number;
  deliveryRate: string;
}

interface OtpLogItem {
  id: string;
  phone: string;
  attempts: number;
  expiresAt: string;
  verifiedAt: string | null;
  createdAt: string;
}

export default function AdminSmsClient() {
  const [gateway, setGateway] = useState<GatewayInfo | null>(null);
  const [stats, setStats] = useState<SmsStats | null>(null);
  const [logs, setLogs] = useState<OtpLogItem[]>([]);
  const [responseCodes, setResponseCodes] = useState<Record<string, any>>({});

  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isPurging, setIsPurging] = useState(false);

  // Form State for Test SMS
  const [testPhone, setTestPhone] = useState("+8801958666999");
  const [testMessage, setTestMessage] = useState(
    "Felna Gateway Test: Your carrier-grade SMS gateway is operational."
  );

  // Feedback Toast
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showCodesGuide, setShowCodesGuide] = useState(false);

  function showToast(type: "success" | "error", text: string) {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4500);
  }

  async function loadData() {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/sms");
      const json = await res.json();

      if (json.success && json.data) {
        setGateway(json.data.gateway);
        setStats(json.data.stats);
        setLogs(json.data.recentLogs);
        setResponseCodes(json.data.responseCodes || {});
      } else {
        showToast("error", json.error || "Failed to load SMS gateway status.");
      }
    } catch {
      showToast("error", "Network error loading SMS gateway information.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleSendTestSms(e: React.FormEvent) {
    e.preventDefault();
    if (!testPhone.trim() || !testMessage.trim()) {
      showToast("error", "Please provide a valid phone number and message.");
      return;
    }

    try {
      setIsSending(true);
      const res = await fetch("/api/admin/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: testPhone,
          message: testMessage,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        showToast("error", json.error || "Failed to dispatch test SMS.");
        return;
      }

      showToast("success", json.message || "Test SMS sent successfully!");
      loadData();
    } catch {
      showToast("error", "Network error dispatching test SMS.");
    } finally {
      setIsSending(false);
    }
  }

  async function handleDeleteLog(id: string) {
    try {
      const res = await fetch(`/api/admin/sms?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        showToast("success", "OTP log record removed.");
        setLogs((prev) => prev.filter((item) => item.id !== id));
      }
    } catch {
      showToast("error", "Failed to delete log entry.");
    }
  }

  async function handlePurgeExpired() {
    try {
      setIsPurging(true);
      const res = await fetch("/api/admin/sms", { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        showToast("success", json.message || "Purged expired OTP records.");
        loadData();
      }
    } catch {
      showToast("error", "Failed to purge expired records.");
    } finally {
      setIsPurging(false);
    }
  }

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
            <MessageSquare className="w-6 h-6 text-sky-600" />
            <span>SMS &amp; Carrier Gateway</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitor real-time telecom gateway dispatches, OTP delivery health, and configure IGL parameters.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={loadData}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-xs transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-sky-600" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handlePurgeExpired}
            disabled={isPurging}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 text-xs font-semibold rounded-xl border border-slate-200 shadow-xs transition disabled:opacity-50"
            title="Clean up historical records older than 24h"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Purge Expired</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total SMS Sent */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-700 text-white shadow-md relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold uppercase tracking-wider text-purple-100">
              Total Dispatches
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center border border-white/25">
              <Send className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold tracking-tight">
              {stats?.totalSent ?? 0}
            </div>
            <div className="text-[11px] text-purple-100/90 mt-1 flex items-center gap-1 font-medium">
              <span>All OTP &amp; Notification Messages</span>
            </div>
          </div>
        </div>

        {/* Verified OTPs */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-teal-700 text-white shadow-md relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-100">
              Verified OTPs
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center border border-white/25">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold tracking-tight">
              {stats?.verified ?? 0}
            </div>
            <div className="text-[11px] text-emerald-100/90 mt-1 flex items-center gap-1 font-medium">
              <span>Successfully Authenticated</span>
            </div>
          </div>
        </div>

        {/* Expired / Pending */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-orange-700 text-white shadow-md relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-100">
              Pending / Expired
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center border border-white/25">
              <Clock className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold tracking-tight">
              {stats?.pendingOrExpired ?? 0}
            </div>
            <div className="text-[11px] text-amber-100/90 mt-1 flex items-center gap-1 font-medium">
              <span>Unused or Expired Within 120s</span>
            </div>
          </div>
        </div>

        {/* Delivery Rate */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 text-white shadow-md relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold uppercase tracking-wider text-sky-100">
              Conversion Rate
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center border border-white/25">
              <Zap className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold tracking-tight">
              {stats?.deliveryRate ?? "100%"}
            </div>
            <div className="text-[11px] text-sky-100/90 mt-1 flex items-center gap-1 font-medium">
              <span>OTP Verification Ratio</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gateway Configuration & Test Sender Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Test SMS Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-300/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Live Gateway Test Dispatcher</h3>
                <p className="text-xs text-slate-500">
                  Send a test SMS to verify routing, approved sender ID, and carrier connectivity.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 border border-emerald-200">
              OPERATIONAL
            </span>
          </div>

          <form onSubmit={handleSendTestSms} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Recipient Mobile Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                placeholder="+88019XXXXXXXX or 019XXXXXXXX"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Accepts Bangladesh mobile numbers in 01..., 8801..., or +8801... formats.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Message Payload <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
                placeholder="Enter SMS content..."
              />
              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                <span>Standard SMS length: 160 GSM-7 chars / 70 Unicode chars</span>
                <span>{testMessage.length} characters</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                <span>Dispatches via {gateway?.provider || "IGL SMS Gateway"}</span>
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition disabled:opacity-50"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Transmitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Test SMS</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Col: Gateway Configuration Parameters */}
        <div className="bg-white rounded-2xl border border-slate-300/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Gateway Config</h3>
              <p className="text-xs text-slate-500">Current carrier credentials &amp; limits</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Provider</span>
              <span className="font-semibold text-slate-900">IGL Web Ltd</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Approved Sender ID</span>
              <span className="font-mono font-semibold text-slate-900">
                {gateway?.senderId || "01844532630"}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Mode</span>
              <span
                className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                  gateway?.isMockMode
                    ? "bg-amber-100 text-amber-800 border border-amber-200"
                    : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                }`}
              >
                {gateway?.isMockMode ? "MOCK SIMULATOR" : "LIVE CARRIER GATEWAY"}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">API Key</span>
              <span className="font-mono text-slate-700">{gateway?.maskedApiKey}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">OTP Code Lifetime</span>
              <span className="font-semibold text-slate-900">120 seconds (2 mins)</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Max Failed Attempts</span>
              <span className="font-semibold text-slate-900">5 attempts max</span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-slate-500">Rate Limiting</span>
              <span className="font-semibold text-slate-900">3 OTPs / 5 minutes</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowCodesGuide(!showCodesGuide)}
              className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showCodesGuide ? "Hide" : "View"} Gateway Response Codes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Gateway Response Codes Drawer */}
      {showCodesGuide && (
        <div className="bg-white rounded-2xl border border-slate-300/80 shadow-sm p-6 space-y-3 animate-in fade-in duration-200">
          <h4 className="text-sm font-bold text-slate-900">IGL Telecom Gateway Error Codes</h4>
          <p className="text-xs text-slate-500">
            Standard status codes returned by the IGL SMS API router:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-2">
            {Object.entries(responseCodes).map(([code, meta]: [string, any]) => (
              <div
                key={code}
                className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-900">{code}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      meta.isError ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {meta.isError ? "ERROR" : "SUCCESS"}
                  </span>
                </div>
                <div className="text-slate-600 font-medium">{meta.description}</div>
                <div className="text-slate-400 text-[11px]">{meta.userMessage}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live OTP Activity Feed & Logs */}
      <div className="bg-white rounded-2xl border border-slate-300/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Live OTP Verification Logs</h3>
            <p className="text-xs text-slate-500">
              Audit log of recent OTP dispatches, security lockout verification, and timestamps.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Showing last {logs.length} dispatches
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Recipient Phone</th>
                <th className="py-3 px-4">Dispatched At</th>
                <th className="py-3 px-4">Expires At</th>
                <th className="py-3 px-4">Attempts</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    No recent OTP dispatches found.
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const isVerified = Boolean(log.verifiedAt);
                  const isExpired = new Date(log.expiresAt) < new Date();

                  return (
                    <tr key={log.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-mono font-medium text-slate-900">
                        {log.phone}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {new Date(log.expiresAt).toLocaleTimeString()}
                      </td>
                      <td className="py-3 px-4 font-mono">
                        <span
                          className={`font-bold ${
                            log.attempts >= 5 ? "text-rose-600" : "text-slate-700"
                          }`}
                        >
                          {log.attempts} / 5
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {isVerified ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            VERIFIED
                          </span>
                        ) : isExpired ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-600" />
                            EXPIRED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200">
                            <Radio className="w-3 h-3 text-sky-600 animate-pulse" />
                            ACTIVE
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteLog(log.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                          title="Delete record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
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
