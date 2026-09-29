"use client";

import React, { useState } from "react";
import { CmsPartner } from "@prisma/client";
import {
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  CheckCircle2,
  XCircle,
  Loader2,
  ExternalLink,
  Handshake,
  X,
  Building2,
} from "lucide-react";
import CmsImageUploader from "./CmsImageUploader";

interface CmsPartnersTabProps {
  initialPartners: CmsPartner[];
  onShowToast: (type: "success" | "error", message: string) => void;
}

export default function CmsPartnersTab({ initialPartners, onShowToast }: CmsPartnersTabProps) {
  const [partners, setPartners] = useState<CmsPartner[]>(initialPartners);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<CmsPartner | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    logoUrl: "",
    websiteUrl: "",
    displayOrder: 1,
    isActive: true,
  });

  function openCreateModal() {
    setEditingPartner(null);
    setFormData({
      name: "",
      logoUrl: "",
      websiteUrl: "https://",
      displayOrder: partners.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  }

  function openEditModal(partner: CmsPartner) {
    setEditingPartner(partner);
    setFormData({
      name: partner.name,
      logoUrl: partner.logoUrl || "",
      websiteUrl: partner.websiteUrl || "",
      displayOrder: partner.displayOrder,
      isActive: partner.isActive,
    });
    setIsModalOpen(true);
  }

  async function handleToggleActive(partner: CmsPartner) {
    try {
      setActionId(partner.id);
      const nextActive = !partner.isActive;
      const res = await fetch("/api/admin/cms/partners", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: partner.id, isActive: nextActive }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        onShowToast("error", json.error || "Failed to update partner status.");
        return;
      }

      setPartners((prev) =>
        prev.map((p) => (p.id === partner.id ? { ...p, isActive: nextActive } : p))
      );
      onShowToast("success", `Partner "${partner.name}" status updated.`);
    } catch {
      onShowToast("error", "Network error updating status.");
    } finally {
      setActionId(null);
    }
  }

  async function handleMove(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= partners.length) return;

    const newPartners = [...partners];
    const [moved] = newPartners.splice(index, 1);
    newPartners.splice(targetIndex, 0, moved);

    const updatedWithOrder = newPartners.map((item, idx) => ({
      ...item,
      displayOrder: idx + 1,
    }));

    setPartners(updatedWithOrder);

    try {
      const payload = {
        reorder: updatedWithOrder.map((p) => ({ id: p.id, displayOrder: p.displayOrder })),
      };

      const res = await fetch("/api/admin/cms/partners", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        onShowToast("error", json.error || "Failed to update order.");
      } else {
        onShowToast("success", "Partners reordered successfully.");
      }
    } catch {
      onShowToast("error", "Error syncing order.");
    }
  }

  async function handleDelete(partner: CmsPartner) {
    if (!window.confirm(`Are you sure you want to remove "${partner.name}"?`)) return;

    try {
      setActionId(partner.id);
      const res = await fetch(`/api/admin/cms/partners?id=${partner.id}`, {
        method: "DELETE",
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        onShowToast("error", json.error || "Failed to delete partner.");
        return;
      }

      setPartners((prev) => prev.filter((p) => p.id !== partner.id));
      onShowToast("success", "Partner removed successfully.");
    } catch {
      onShowToast("error", "Network error deleting partner.");
    } finally {
      setActionId(null);
    }
  }

  async function handleModalSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingPartner) {
        const res = await fetch("/api/admin/cms/partners", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingPartner.id, ...formData }),
        });

        const json = await res.json();
        if (!res.ok || !json.success) {
          onShowToast("error", json.error || "Failed to update partner.");
          return;
        }

        setPartners((prev) =>
          prev.map((p) => (p.id === editingPartner.id ? json.data : p))
        );
        onShowToast("success", "Partner updated successfully!");
      } else {
        const res = await fetch("/api/admin/cms/partners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const json = await res.json();
        if (!res.ok || !json.success) {
          onShowToast("error", json.error || "Failed to create partner.");
          return;
        }

        setPartners((prev) => [...prev, json.data]);
        onShowToast("success", "New partner added successfully!");
      }

      setIsModalOpen(false);
    } catch {
      onShowToast("error", "Error saving partner.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const activePartners = partners.filter((p) => p.isActive);

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. LIVE MARQUEE PREVIEW                                                   */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#F5B83D]" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Live Preview: Companies & Sister Concerns Marquee
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            {activePartners.length} Active in rotation
          </span>
        </div>

        {/* Marquee Container */}
        <div className="bg-[#12100E] py-6 px-4 overflow-hidden relative border-b border-white/5">
          <div className="flex items-center gap-8 overflow-x-auto no-scrollbar py-2">
            {activePartners.map((partner) => (
              <div
                key={partner.id}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#F5B83D]/40 transition shrink-0"
              >
                {partner.logoUrl ? (
                  <img
                    src={partner.logoUrl}
                    alt={partner.name}
                    className="w-8 h-8 object-contain rounded"
                  />
                ) : (
                  <div className="w-8 h-8 rounded bg-[#F5B83D]/20 text-[#F5B83D] flex items-center justify-center font-bold text-xs">
                    {partner.name.charAt(0)}
                  </div>
                )}
                <span className="text-xs font-bold text-white tracking-wide whitespace-nowrap">
                  {partner.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. PARTNERS MANAGEMENT TABLE / GRID                                       */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Handshake className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Partner Companies & Sister Concerns ({partners.length})
              </h4>
              <p className="text-xs text-slate-500">
                Add corporate logos, websites, and reorder company positions
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-2 transition shadow-xs cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-[#F5B83D]" />
            <span>Add Partner</span>
          </button>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {partners.map((partner, index) => {
            const isActionPending = actionId === partner.id;

            return (
              <div
                key={partner.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all flex flex-col justify-between gap-3 shadow-2xs"
              >
                {/* Header: Logo, Name, Website */}
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 p-1.5 flex items-center justify-center shrink-0 overflow-hidden">
                    {partner.logoUrl ? (
                      <img
                        src={partner.logoUrl}
                        alt={partner.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Building2 className="w-6 h-6 text-slate-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-slate-900 truncate">
                      {partner.name}
                    </h5>
                    {partner.websiteUrl && (
                      <a
                        href={partner.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-sky-600 hover:underline flex items-center gap-1 mt-0.5 truncate"
                      >
                        <span className="truncate">{partner.websiteUrl}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    )}
                    <span className="inline-block mt-1 text-[10px] text-slate-400">
                      Order: #{partner.displayOrder}
                    </span>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  {/* Status Toggle */}
                  <button
                    type="button"
                    disabled={isActionPending}
                    onClick={() => handleToggleActive(partner)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold border flex items-center gap-1 transition ${
                      partner.isActive
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-slate-100 text-slate-500 border-slate-200"
                    }`}
                  >
                    {partner.isActive ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Active</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 text-slate-400" />
                        <span>Hidden</span>
                      </>
                    )}
                  </button>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMove(index, "up")}
                      className="p-1 rounded text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                      title="Move Left/Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === partners.length - 1}
                      onClick={() => handleMove(index, "down")}
                      className="p-1 rounded text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                      title="Move Right/Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditModal(partner)}
                      className="p-1 rounded text-slate-600 hover:bg-slate-100"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={isActionPending}
                      onClick={() => handleDelete(partner)}
                      className="p-1 rounded text-rose-600 hover:bg-rose-50"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MODAL: ADD / EDIT PARTNER                                              */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                {editingPartner ? "Edit Partner Company" : "Add Partner Company"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Company / Partner Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
                  placeholder="e.g. Grameenphone or IGL Web"
                />
              </div>

              <CmsImageUploader
                label="Partner Logo URL / Upload"
                value={formData.logoUrl}
                onChange={(url) => setFormData((prev) => ({ ...prev, logoUrl: url }))}
                placeholder="https://... or upload PNG/SVG logo"
                helperText="Transparent PNG or SVG with aspect ratio ~ 1:1 or 2:1 works best."
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Website URL (Optional)
                </label>
                <input
                  type="text"
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData((prev) => ({ ...prev, websiteUrl: e.target.value }))}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
                  placeholder="https://company.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, displayOrder: parseInt(e.target.value) || 1 }))
                  }
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="partner-is-active"
                  checked={formData.isActive}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                  className="rounded text-sky-600 focus:ring-sky-500 h-4 w-4"
                />
                <label htmlFor="partner-is-active" className="text-xs font-medium text-slate-700">
                  Visible in public ticker / partner section
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#F5B83D] hover:bg-[#e0a42e] text-slate-950 flex items-center gap-2 transition disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingPartner ? "Update Partner" : "Add Partner"}</span>
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
