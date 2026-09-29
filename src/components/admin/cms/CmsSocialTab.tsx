"use client";

import React, { useState } from "react";
import { CmsSocialLink } from "@prisma/client";
import {
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  XCircle,
  Loader2,
  ExternalLink,
  Share2,
  X,
  Globe,
} from "lucide-react";

interface CmsSocialTabProps {
  initialLinks: CmsSocialLink[];
  onShowToast: (type: "success" | "error", message: string) => void;
}

const PLATFORM_OPTIONS = [
  { value: "facebook", label: "Facebook" },
  { value: "youtube", label: "YouTube" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "twitter", label: "Twitter / X" },
  { value: "instagram", label: "Instagram" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "github", label: "GitHub" },
  { value: "telegram", label: "Telegram" },
];

export default function CmsSocialTab({ initialLinks, onShowToast }: CmsSocialTabProps) {
  const [links, setLinks] = useState<CmsSocialLink[]>(initialLinks);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<CmsSocialLink | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    platform: "facebook",
    label: "",
    url: "",
    displayOrder: 1,
    isActive: true,
  });

  function openCreateModal() {
    setEditingLink(null);
    setFormData({
      platform: "facebook",
      label: "Facebook Official",
      url: "https://facebook.com/felna",
      displayOrder: links.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  }

  function openEditModal(link: CmsSocialLink) {
    setEditingLink(link);
    setFormData({
      platform: link.platform,
      label: link.label || "",
      url: link.url,
      displayOrder: link.displayOrder,
      isActive: link.isActive,
    });
    setIsModalOpen(true);
  }

  async function handleToggleActive(link: CmsSocialLink) {
    try {
      setActionId(link.id);
      const nextActive = !link.isActive;
      const res = await fetch("/api/admin/cms/social-links", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: link.id, isActive: nextActive }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        onShowToast("error", json.error || "Failed to update link status.");
        return;
      }

      setLinks((prev) =>
        prev.map((l) => (l.id === link.id ? { ...l, isActive: nextActive } : l))
      );
      onShowToast("success", `Social channel "${link.platform}" status updated.`);
    } catch {
      onShowToast("error", "Network error updating status.");
    } finally {
      setActionId(null);
    }
  }

  async function handleMove(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= links.length) return;

    const newLinks = [...links];
    const [moved] = newLinks.splice(index, 1);
    newLinks.splice(targetIndex, 0, moved);

    const updatedWithOrder = newLinks.map((item, idx) => ({
      ...item,
      displayOrder: idx + 1,
    }));

    setLinks(updatedWithOrder);

    try {
      const payload = {
        reorder: updatedWithOrder.map((l) => ({ id: l.id, displayOrder: l.displayOrder })),
      };

      const res = await fetch("/api/admin/cms/social-links", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        onShowToast("error", json.error || "Failed to reorder links.");
      } else {
        onShowToast("success", "Social links reordered successfully.");
      }
    } catch {
      onShowToast("error", "Error syncing order.");
    }
  }

  async function handleDelete(link: CmsSocialLink) {
    if (!window.confirm(`Are you sure you want to delete ${link.platform} link?`)) return;

    try {
      setActionId(link.id);
      const res = await fetch(`/api/admin/cms/social-links?id=${link.id}`, {
        method: "DELETE",
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        onShowToast("error", json.error || "Failed to delete link.");
        return;
      }

      setLinks((prev) => prev.filter((l) => l.id !== link.id));
      onShowToast("success", "Social link deleted successfully.");
    } catch {
      onShowToast("error", "Network error deleting link.");
    } finally {
      setActionId(null);
    }
  }

  async function handleModalSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingLink) {
        const res = await fetch("/api/admin/cms/social-links", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingLink.id, ...formData }),
        });

        const json = await res.json();
        if (!res.ok || !json.success) {
          onShowToast("error", json.error || "Failed to update link.");
          return;
        }

        setLinks((prev) =>
          prev.map((l) => (l.id === editingLink.id ? json.data : l))
        );
        onShowToast("success", "Social link updated successfully!");
      } else {
        const res = await fetch("/api/admin/cms/social-links", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const json = await res.json();
        if (!res.ok || !json.success) {
          onShowToast("error", json.error || "Failed to create link.");
          return;
        }

        setLinks((prev) => [...prev, json.data]);
        onShowToast("success", "New social channel added successfully!");
      }

      setIsModalOpen(false);
    } catch {
      onShowToast("error", "Error saving link.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Social Media Channels ({links.length})
              </h4>
              <p className="text-xs text-slate-500">
                Official handles displayed on footer, contact page, and header bars
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-2 transition shadow-xs cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-[#F5B83D]" />
            <span>Add Social Link</span>
          </button>
        </div>

        {/* Links List */}
        <div className="space-y-3">
          {links.map((link, index) => {
            const isActionPending = actionId === link.id;

            return (
              <div
                key={link.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                {/* Platform Icon & URL */}
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                    {link.platform.slice(0, 2)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 capitalize">
                        {link.platform}
                      </span>
                      {link.label && (
                        <span className="text-[11px] text-slate-500">({link.label})</span>
                      )}
                    </div>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-sky-600 hover:underline flex items-center gap-1 mt-0.5 truncate"
                    >
                      <span className="truncate">{link.url}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  {/* Status */}
                  <button
                    type="button"
                    disabled={isActionPending}
                    onClick={() => handleToggleActive(link)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border flex items-center gap-1.5 transition ${
                      link.isActive
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                        : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                    }`}
                  >
                    {link.isActive ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Active</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5 text-slate-400" />
                        <span>Hidden</span>
                      </>
                    )}
                  </button>

                  {/* Reorder */}
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMove(index, "up")}
                      className="p-1.5 text-slate-600 hover:bg-slate-200 disabled:opacity-30 transition"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === links.length - 1}
                      onClick={() => handleMove(index, "down")}
                      className="p-1.5 text-slate-600 hover:bg-slate-200 disabled:opacity-30 transition"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => openEditModal(link)}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    disabled={isActionPending}
                    onClick={() => handleDelete(link)}
                    className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 transition"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                {editingLink ? "Edit Social Channel" : "Add Social Channel"}
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
                  Social Platform <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.platform}
                  onChange={(e) => setFormData((prev) => ({ ...prev, platform: e.target.value }))}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
                >
                  {PLATFORM_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Custom Label / Name (Optional)
                </label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData((prev) => ({ ...prev, label: e.target.value }))}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
                  placeholder="e.g. Felna Official Facebook"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Destination URL <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.url}
                  onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
                  placeholder="https://facebook.com/..."
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
                  id="link-is-active"
                  checked={formData.isActive}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                  className="rounded text-sky-600 focus:ring-sky-500 h-4 w-4"
                />
                <label htmlFor="link-is-active" className="text-xs font-medium text-slate-700">
                  Visible on public website
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
                    <span>{editingLink ? "Update Link" : "Add Link"}</span>
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
