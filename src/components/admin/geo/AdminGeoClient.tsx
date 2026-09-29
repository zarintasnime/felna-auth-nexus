"use client";

import React, { useState, useEffect } from "react";
import {
  MapPin,
  ChevronDown,
  ChevronRight,
  Users,
  Building2,
  RefreshCw,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface DistrictItem {
  id: string;
  name: string;
  bnName: string | null;
  _count: {
    upazilas: number;
    users: number;
  };
}

interface DivisionItem {
  id: string;
  name: string;
  bnName: string | null;
  _count: {
    districts: number;
    users: number;
  };
  districts: DistrictItem[];
}

export default function AdminGeoClient() {
  const [divisions, setDivisions] = useState<DivisionItem[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [expandedDivisionId, setExpandedDivisionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function showToast(type: "success" | "error", text: string) {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  }

  async function loadGeoData() {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/geo");
      const json = await res.json();
      if (json.success && json.data) {
        setDivisions(json.data.divisions);
        setStats(json.data.stats);
        if (json.data.divisions.length > 0 && !expandedDivisionId) {
          setExpandedDivisionId(json.data.divisions[0].id);
        }
      }
    } catch {
      showToast("error", "Failed to load geographic structure.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadGeoData();
  }, []);

  function toggleDivision(id: string) {
    setExpandedDivisionId((prev) => (prev === id ? null : id));
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
            <MapPin className="w-6 h-6 text-emerald-600" />
            <span>Bangladesh Geographic Hierarchy</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Explore 8 administrative divisions, 64 districts, and local thana/upazila structures across Bangladesh.
          </p>
        </div>

        <button
          onClick={loadGeoData}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-xs transition self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-emerald-600" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-teal-700 text-white shadow-md flex items-center justify-between">
          <div>
            <div className="text-xs uppercase font-semibold text-emerald-100">Divisions</div>
            <div className="text-3xl font-extrabold tracking-tight mt-1">
              {stats?.totalDivisions ?? 8}
            </div>
            <div className="text-[11px] text-emerald-100/90 mt-1 font-medium">All 8 Zones Active</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-500 via-sky-600 to-blue-700 text-white shadow-md flex items-center justify-between">
          <div>
            <div className="text-xs uppercase font-semibold text-cyan-100">Districts</div>
            <div className="text-3xl font-extrabold tracking-tight mt-1">
              {stats?.totalDistricts ?? 64}
            </div>
            <div className="text-[11px] text-cyan-100/90 mt-1 font-medium">Full National Coverage</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
            <MapPin className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-700 text-white shadow-md flex items-center justify-between">
          <div>
            <div className="text-xs uppercase font-semibold text-purple-100">Upazilas &amp; Thanas</div>
            <div className="text-3xl font-extrabold tracking-tight mt-1">
              {stats?.totalUpazilas ?? 495}
            </div>
            <div className="text-[11px] text-purple-100/90 mt-1 font-medium">Local Sub-Districts</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Division Explorer Accordions */}
      <div className="bg-white rounded-2xl border border-slate-300/80 shadow-sm p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
          Division &amp; District Directory
        </h3>

        {isLoading ? (
          <div className="py-12 text-center text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
            <span className="text-xs">Loading geographic hierarchy...</span>
          </div>
        ) : (
          <div className="space-y-3">
            {divisions.map((div) => {
              const isExpanded = expandedDivisionId === div.id;

              return (
                <div
                  key={div.id}
                  className="rounded-xl border border-slate-200 overflow-hidden transition"
                >
                  <button
                    type="button"
                    onClick={() => toggleDivision(div.id)}
                    className="w-full px-5 py-3.5 bg-slate-50 hover:bg-slate-100/80 flex items-center justify-between text-left transition"
                  >
                    <div className="flex items-center gap-3">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                      <div>
                        <span className="font-bold text-slate-900 text-sm">{div.name}</span>
                        {div.bnName && (
                          <span className="text-slate-500 text-xs ml-2 font-medium">
                            ({div.bnName})
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                        {div._count.districts} Districts
                      </span>
                      <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-semibold text-[10px]">
                        {div._count.users} Users
                      </span>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-5 bg-white border-t border-slate-200">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {div.districts.map((dist) => (
                          <div
                            key={dist.id}
                            className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1 hover:border-emerald-300 transition"
                          >
                            <div className="font-bold text-slate-800 flex items-center justify-between">
                              <span>{dist.name}</span>
                              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-mono">
                                {dist._count.upazilas} thanas
                              </span>
                            </div>
                            {dist.bnName && (
                              <div className="text-slate-500 text-[11px]">{dist.bnName}</div>
                            )}
                            <div className="text-[10px] text-slate-400 pt-1 flex items-center gap-1">
                              <Users className="w-3 h-3 text-slate-400" />
                              <span>{dist._count.users} registered users</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
