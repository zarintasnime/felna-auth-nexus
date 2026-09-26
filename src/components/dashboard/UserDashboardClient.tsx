"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  User,
  Phone,
  Mail,
  MapPin,
  Edit3,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Calendar,
  Home,
  Shield,
} from "lucide-react";
import LogoutButton from "@/components/common/LogoutButton";
import { GeoDivision, GeoDistrict, GeoUpazila } from "@/lib/data/bangladesh-geo";

interface UserProfileData {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  role: string;
  status: string;
  address: string | null;
  divisionId?: string | null;
  districtId?: string | null;
  upazilaId?: string | null;
  division: { id?: string; name: string } | null;
  district: { id?: string; name: string } | null;
  upazila: { id?: string; name: string } | null;
  createdAt: string | Date;
}

interface UserDashboardClientProps {
  initialUser: UserProfileData;
}

export default function UserDashboardClient({ initialUser }: UserDashboardClientProps) {
  const [user, setUser] = useState<UserProfileData>(initialUser);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Edit Form Fields
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email || "");
  const [editDivisionId, setEditDivisionId] = useState(user.divisionId || "");
  const [editDistrictId, setEditDistrictId] = useState(user.districtId || "");
  const [editUpazilaId, setEditUpazilaId] = useState(user.upazilaId || "");
  const [editAddress, setEditAddress] = useState(user.address || "");

  // Cascading Geo Data for Modal
  const [divisions, setDivisions] = useState<GeoDivision[]>([]);
  const [districts, setDistricts] = useState<GeoDistrict[]>([]);
  const [upazilas, setUpazilas] = useState<GeoUpazila[]>([]);
  const [loadingGeo, setLoadingGeo] = useState(false);

  // Status & Feedback
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 1. Fetch Divisions when modal opens
  useEffect(() => {
    if (isEditModalOpen && divisions.length === 0) {
      async function fetchDivisions() {
        try {
          setLoadingGeo(true);
          const res = await fetch("/api/geo/divisions");
          const json = await res.json();
          if (json.success) setDivisions(json.data);
        } catch (err) {
          console.error("Failed to load divisions", err);
        } finally {
          setLoadingGeo(false);
        }
      }
      fetchDivisions();
    }
  }, [isEditModalOpen, divisions.length]);

  // 2. Fetch Districts when Division changes in modal
  useEffect(() => {
    if (!editDivisionId) {
      setDistricts([]);
      setEditDistrictId("");
      setUpazilas([]);
      setEditUpazilaId("");
      return;
    }

    async function fetchDistricts() {
      try {
        setLoadingGeo(true);
        const res = await fetch(
          `/api/geo/districts?divisionId=${encodeURIComponent(editDivisionId)}`
        );
        const json = await res.json();
        if (json.success) {
          setDistricts(json.data);
        }
      } catch (err) {
        console.error("Failed to load districts", err);
      } finally {
        setLoadingGeo(false);
      }
    }
    fetchDistricts();
  }, [editDivisionId]);

  // 3. Fetch Upazilas when District changes in modal
  useEffect(() => {
    if (!editDistrictId) {
      setUpazilas([]);
      setEditUpazilaId("");
      return;
    }

    async function fetchUpazilas() {
      try {
        setLoadingGeo(true);
        const res = await fetch(
          `/api/geo/upazilas?districtId=${encodeURIComponent(editDistrictId)}`
        );
        const json = await res.json();
        if (json.success) {
          setUpazilas(json.data);
        }
      } catch (err) {
        console.error("Failed to load upazilas", err);
      } finally {
        setLoadingGeo(false);
      }
    }
    fetchUpazilas();
  }, [editDistrictId]);

  function openEditModal() {
    setEditName(user.name);
    setEditEmail(user.email || "");
    setEditDivisionId(user.divisionId || "");
    setEditDistrictId(user.districtId || "");
    setEditUpazilaId(user.upazilaId || "");
    setEditAddress(user.address || "");
    setErrorMessage(null);
    setIsEditModalOpen(true);
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    try {
      setIsSaving(true);
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          email: editEmail || null,
          divisionId: editDivisionId || null,
          districtId: editDistrictId || null,
          upazilaId: editUpazilaId || null,
          address: editAddress || null,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setErrorMessage(json.error || "Failed to update profile.");
        return;
      }

      setUser((prev) => ({
        ...prev,
        ...json.data,
      }));
      setSuccessMessage("Your profile information has been successfully updated.");
      setIsEditModalOpen(false);

      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      console.error(err);
      setErrorMessage("An unexpected network error occurred while updating profile.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-lg text-slate-900 hover:text-blue-600 transition">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span>Felna.com</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition px-2.5 py-1.5 rounded-lg hover:bg-slate-100"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>

            {user.role === "ADMIN" && (
              <Link
                href="/admin/dashboard"
                className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1.5 transition px-2.5 py-1.5 rounded-lg hover:bg-red-50 font-medium"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Console</span>
              </Link>
            )}

            <LogoutButton variant="navbar" label="Sign Out" />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Success Alert */}
        {successMessage && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-800 text-sm shadow-sm">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Dashboard Title & Hero */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                  {user.status}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                  {user.role}
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                Personal Member Dashboard and Profile Information
              </p>
            </div>

            <button
              onClick={openEditModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl shadow-sm transition self-start sm:self-auto"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Card 1: Account Credentials */}
            <div className="p-6 bg-slate-50/70 rounded-2xl border border-slate-200/80 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <User className="w-4 h-4 text-blue-600" />
                <span>Account Credentials</span>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-xs text-slate-400 font-medium">Full Name</span>
                  <div className="font-semibold text-slate-800">{user.name}</div>
                </div>

                <div>
                  <span className="text-xs text-slate-400 font-medium">Verified Phone Number</span>
                  <div className="font-semibold text-slate-800 flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-green-600" />
                    <span>{user.phone}</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-slate-400 font-medium">Email Address</span>
                  <div className="font-semibold text-slate-800 flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{user.email || "No email registered"}</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-slate-400 font-medium">Member Since</span>
                  <div className="font-semibold text-slate-800 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Bangladesh Geographic Location */}
            <div className="p-6 bg-slate-50/70 rounded-2xl border border-slate-200/80 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Registered Location (Bangladesh)</span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-xs text-slate-400 font-medium">Division</span>
                    <div className="font-semibold text-slate-800">
                      {user.division?.name || "Not specified"}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 font-medium">District</span>
                    <div className="font-semibold text-slate-800">
                      {user.district?.name || "Not specified"}
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-slate-400 font-medium">Thana / Upazila</span>
                  <div className="font-semibold text-slate-800">
                    {user.upazila?.name || "Not specified"}
                  </div>
                </div>

                <div>
                  <span className="text-xs text-slate-400 font-medium">Permanent Address</span>
                  <div className="font-semibold text-slate-800">
                    {user.address || "No permanent address provided"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900">Edit Profile Information</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              {/* Geographic Cascading Location */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
                <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>Update Location (Bangladesh)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Division</label>
                    <select
                      value={editDivisionId}
                      onChange={(e) => setEditDivisionId(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="">Select Division</option>
                      {divisions.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-600 mb-1">District</label>
                    <select
                      disabled={!editDivisionId || loadingGeo}
                      value={editDistrictId}
                      onChange={(e) => setEditDistrictId(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50 disabled:bg-slate-100"
                    >
                      <option value="">Select District</option>
                      {districts.map((dist) => (
                        <option key={dist.id} value={dist.id}>
                          {dist.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Thana / Upazila</label>
                    <select
                      disabled={!editDistrictId || loadingGeo}
                      value={editUpazilaId}
                      onChange={(e) => setEditUpazilaId(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50 disabled:bg-slate-100"
                    >
                      <option value="">Select Thana</option>
                      {upazilas.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-600 mb-1">Permanent Address</label>
                  <input
                    type="text"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    placeholder="House/Street, Ward"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl shadow-sm transition flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
