"use client";

import React, { useState } from "react";
import { CmsFeatureItem } from "@prisma/client";
import {
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  XCircle,
  Loader2,
  Award,
  Sparkles,
  X,
  ListFilter,
} from "lucide-react";
import { AVAILABLE_ICONS, renderCmsIcon } from "./CmsIconHelper";
import CmsImageUploader from "./CmsImageUploader";

interface CmsFeaturesTabProps {
  initialFeatures: CmsFeatureItem[];
  onShowToast: (type: "success" | "error", message: string) => void;
}

export default function CmsFeaturesTab({ initialFeatures, onShowToast }: CmsFeaturesTabProps) {
  const [features, setFeatures] = useState<CmsFeatureItem[]>(initialFeatures);
  const [selectedSection, setSelectedSection] = useState<string>("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CmsFeatureItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    section: "BENEFIT",
    title: "",
    description: "",
    iconName: "CheckCircle",
    imageUrl: "",
    displayOrder: 1,
    isActive: true,
  });

  const filteredFeatures =
    selectedSection === "ALL"
      ? features
      : features.filter((f) => f.section === selectedSection);

  function openCreateModal(defaultSection = "BENEFIT") {
    setEditingItem(null);
    setFormData({
      section: selectedSection === "ALL" ? defaultSection : selectedSection,
      title: "",
      description: "",
      iconName: "CheckCircle",
      imageUrl: "",
      displayOrder: features.filter((f) => f.section === (selectedSection === "ALL" ? defaultSection : selectedSection)).length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  }

  function openEditModal(item: CmsFeatureItem) {
    setEditingItem(item);
    setFormData({
      section: item.section,
      title: item.title,
      description: item.description,
      iconName: item.iconName || "CheckCircle",
      imageUrl: item.imageUrl || "",
      displayOrder: item.displayOrder,
      isActive: item.isActive,
    });
    setIsModalOpen(true);
  }

  async function handleToggleActive(item: CmsFeatureItem) {
    try {
      setActionId(item.id);
      const nextActive = !item.isActive;
      const res = await fetch("/api/admin/cms/features", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, isActive: nextActive }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        onShowToast("error", json.error || "Failed to update item status.");
        return;
      }

      setFeatures((prev) =>
        prev.map((f) => (f.id === item.id ? { ...f, isActive: nextActive } : f))
      );
      onShowToast("success", `Feature "${item.title.slice(0, 20)}..." status updated.`);
    } catch {
      onShowToast("error", "Network error updating status.");
    } finally {
      setActionId(null);
    }
  }

  async function handleMove(filteredIndex: number, direction: "up" | "down") {
    const targetItem = filteredFeatures[filteredIndex];
    if (!targetItem) return;

    // Get all items in the same section
    const sectionItems = features.filter((f) => f.section === targetItem.section);
    const itemIndexInSection = sectionItems.findIndex((f) => f.id === targetItem.id);
    const targetIndexInSection = direction === "up" ? itemIndexInSection - 1 : itemIndexInSection + 1;

    if (targetIndexInSection < 0 || targetIndexInSection >= sectionItems.length) return;

    const newSectionItems = [...sectionItems];
    const [moved] = newSectionItems.splice(itemIndexInSection, 1);
    newSectionItems.splice(targetIndexInSection, 0, moved);

    const updatedWithOrder = newSectionItems.map((item, idx) => ({
      ...item,
      displayOrder: idx + 1,
    }));

    // Merge back into main features array
    setFeatures((prev) =>
      prev.map((f) => {
        const found = updatedWithOrder.find((u) => u.id === f.id);
        return found ? found : f;
      })
    );

    try {
      const payload = {
        reorder: updatedWithOrder.map((f) => ({ id: f.id, displayOrder: f.displayOrder })),
      };

      const res = await fetch("/api/admin/cms/features", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        onShowToast("error", json.error || "Failed to sync order.");
      } else {
        onShowToast("success", "Features reordered successfully.");
      }
    } catch {
      onShowToast("error", "Error syncing order.");
    }
  }

  async function handleDelete(item: CmsFeatureItem) {
    if (!window.confirm(`Are you sure you want to delete "${item.title}"?`)) return;

    try {
      setActionId(item.id);
      const res = await fetch(`/api/admin/cms/features?id=${item.id}`, {
        method: "DELETE",
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        onShowToast("error", json.error || "Failed to delete item.");
        return;
      }

      setFeatures((prev) => prev.filter((f) => f.id !== item.id));
      onShowToast("success", "Item deleted successfully.");
    } catch {
      onShowToast("error", "Network error deleting item.");
    } finally {
      setActionId(null);
    }
  }

  async function handleModalSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingItem) {
        const res = await fetch("/api/admin/cms/features", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingItem.id, ...formData }),
        });

        const json = await res.json();
        if (!res.ok || !json.success) {
          onShowToast("error", json.error || "Failed to update item.");
          return;
        }

        setFeatures((prev) =>
          prev.map((f) => (f.id === editingItem.id ? json.data : f))
        );
        onShowToast("success", "Feature item updated successfully!");
      } else {
        const res = await fetch("/api/admin/cms/features", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const json = await res.json();
        if (!res.ok || !json.success) {
          onShowToast("error", json.error || "Failed to create item.");
          return;
        }

        setFeatures((prev) => [...prev, json.data]);
        onShowToast("success", "New feature item added successfully!");
      }

      setIsModalOpen(false);
    } catch {
      onShowToast("error", "Error saving feature.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. FILTER BAR & CREATE ACTION                                             */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ListFilter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-500 mr-2">Filter Section:</span>
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setSelectedSection("ALL")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                selectedSection === "ALL"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Items ({features.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedSection("BENEFIT")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                selectedSection === "BENEFIT"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Accordion Benefits ({features.filter((f) => f.section === "BENEFIT").length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedSection("WHY_CHOOSE_US")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                selectedSection === "WHY_CHOOSE_US"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Why Choose Us ({features.filter((f) => f.section === "WHY_CHOOSE_US").length})
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => openCreateModal()}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-2 transition shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#F5B83D]" />
          <span>Add Feature Item</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 2. FEATURES LIST                                                          */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Configured Feature Items ({filteredFeatures.length})
            </h4>
            <p className="text-xs text-slate-500">
              Manage benefits accordion items and Why Choose Us value proposition cards
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {filteredFeatures.map((item, index) => {
            const isActionPending = actionId === item.id;

            return (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left: Icon, Section Badge, Title, Description */}
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  {/* Icon Badge */}
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center justify-center shrink-0">
                    {renderCmsIcon(item.iconName, "w-5 h-5")}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-900">{item.title}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.section === "BENEFIT"
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : "bg-sky-50 text-sky-700 border border-sky-200"
                        }`}
                      >
                        {item.section === "BENEFIT" ? "Accordion Benefit" : "Why Choose Us"}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Order #{item.displayOrder} &bull; Icon: {item.iconName || "Default"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                  {/* Status Toggle */}
                  <button
                    type="button"
                    disabled={isActionPending}
                    onClick={() => handleToggleActive(item)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border flex items-center gap-1.5 transition ${
                      item.isActive
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                        : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                    }`}
                  >
                    {item.isActive ? (
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
                      disabled={index === filteredFeatures.length - 1}
                      onClick={() => handleMove(index, "down")}
                      className="p-1.5 text-slate-600 hover:bg-slate-200 disabled:opacity-30 transition"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() => openEditModal(item)}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition"
                    title="Edit Item"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    disabled={isActionPending}
                    onClick={() => handleDelete(item)}
                    className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 transition"
                    title="Delete Item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MODAL: ADD / EDIT FEATURE                                              */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
              <h3 className="text-sm font-bold text-slate-900">
                {editingItem ? "Edit Feature Item" : "Add New Feature Item"}
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
                  Target Surface Section <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.section}
                  onChange={(e) => setFormData((prev) => ({ ...prev, section: e.target.value }))}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
                >
                  <option value="BENEFIT">Accordion Benefits (High Delivery, API Support...)</option>
                  <option value="WHY_CHOOSE_US">Why Choose Us (Value Proposition Cards)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Title / Headline <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
                  placeholder="e.g. 99.98% Carrier Delivery Guarantee"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description / Body <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
                  placeholder="Explanation of this benefit or value proposition..."
                />
              </div>

              {/* Lucide Icon Picker with Instant Preview */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Visual Icon Badge
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center justify-center shrink-0">
                    {renderCmsIcon(formData.iconName, "w-5 h-5")}
                  </div>
                  <select
                    value={formData.iconName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, iconName: e.target.value }))}
                    className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
                  >
                    {AVAILABLE_ICONS.map((icon) => (
                      <option key={icon.name} value={icon.name}>
                        {icon.label} ({icon.name})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="feat-is-active"
                    checked={formData.isActive}
                    onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                    className="rounded text-sky-600 focus:ring-sky-500 h-4 w-4"
                  />
                  <label htmlFor="feat-is-active" className="text-xs font-medium text-slate-700">
                    Active & Published
                  </label>
                </div>
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
                    <span>{editingItem ? "Update Item" : "Create Item"}</span>
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
