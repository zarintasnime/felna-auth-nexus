"use client";

import React, { useState } from "react";
import { CmsHeroSlide } from "@prisma/client";
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
  Layers,
  Sparkles,
  X,
} from "lucide-react";
import CmsImageUploader from "./CmsImageUploader";

interface CmsHeroTabProps {
  initialSlides: CmsHeroSlide[];
  onShowToast: (type: "success" | "error", message: string) => void;
}

export default function CmsHeroTab({ initialSlides, onShowToast }: CmsHeroTabProps) {
  const [slides, setSlides] = useState<CmsHeroSlide[]>(initialSlides);
  const [selectedSlideId, setSelectedSlideId] = useState<string | null>(
    initialSlides[0]?.id || null
  );

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<CmsHeroSlide | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Action Loading
  const [actionId, setActionId] = useState<string | null>(null);

  // Form State for Create/Edit
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    badge: "",
    imageUrl: "",
    linkUrl: "/register",
    ctaText: "Get Started",
    displayOrder: 1,
    isActive: true,
  });

  const activeSlideForPreview =
    slides.find((s) => s.id === selectedSlideId) || slides[0] || null;

  function openCreateModal() {
    setEditingSlide(null);
    setFormData({
      title: "",
      subtitle: "",
      badge: "BTRC Approved Route",
      imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&q=80",
      linkUrl: "/register",
      ctaText: "Get Started",
      displayOrder: slides.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  }

  function openEditModal(slide: CmsHeroSlide) {
    setEditingSlide(slide);
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle || "",
      badge: slide.badge || "",
      imageUrl: slide.imageUrl,
      linkUrl: slide.linkUrl || "/register",
      ctaText: slide.ctaText || "Get Started",
      displayOrder: slide.displayOrder,
      isActive: slide.isActive,
    });
    setIsModalOpen(true);
  }

  async function handleToggleActive(slide: CmsHeroSlide) {
    try {
      setActionId(slide.id);
      const nextActive = !slide.isActive;
      const res = await fetch("/api/admin/cms/hero-slides", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: slide.id, isActive: nextActive }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        onShowToast("error", json.error || "Failed to update slide status.");
        return;
      }

      setSlides((prev) =>
        prev.map((s) => (s.id === slide.id ? { ...s, isActive: nextActive } : s))
      );
      onShowToast("success", `Slide "${slide.title.slice(0, 20)}..." is now ${nextActive ? "Active" : "Inactive"}.`);
    } catch {
      onShowToast("error", "Failed to communicate with server.");
    } finally {
      setActionId(null);
    }
  }

  async function handleMove(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const newSlides = [...slides];
    const [moved] = newSlides.splice(index, 1);
    newSlides.splice(targetIndex, 0, moved);

    // Update display orders
    const updatedWithOrder = newSlides.map((item, idx) => ({
      ...item,
      displayOrder: idx + 1,
    }));

    setSlides(updatedWithOrder);

    try {
      const payload = {
        reorder: updatedWithOrder.map((s) => ({ id: s.id, displayOrder: s.displayOrder })),
      };

      const res = await fetch("/api/admin/cms/hero-slides", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        onShowToast("error", json.error || "Failed to update slide order.");
      } else {
        onShowToast("success", "Hero slides reordered successfully.");
      }
    } catch {
      onShowToast("error", "Error syncing slide order to database.");
    }
  }

  async function handleDelete(slide: CmsHeroSlide) {
    if (!window.confirm(`Are you sure you want to delete the slide "${slide.title}"?`)) return;

    try {
      setActionId(slide.id);
      const res = await fetch(`/api/admin/cms/hero-slides?id=${slide.id}`, {
        method: "DELETE",
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        onShowToast("error", json.error || "Failed to delete slide.");
        return;
      }

      setSlides((prev) => prev.filter((s) => s.id !== slide.id));
      if (selectedSlideId === slide.id) {
        setSelectedSlideId(slides.find((s) => s.id !== slide.id)?.id || null);
      }
      onShowToast("success", "Hero slide deleted successfully.");
    } catch {
      onShowToast("error", "Network error deleting slide.");
    } finally {
      setActionId(null);
    }
  }

  async function handleModalSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingSlide) {
        // Update existing slide
        const res = await fetch("/api/admin/cms/hero-slides", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingSlide.id, ...formData }),
        });

        const json = await res.json();
        if (!res.ok || !json.success) {
          onShowToast("error", json.error || "Failed to update slide.");
          return;
        }

        setSlides((prev) =>
          prev.map((s) => (s.id === editingSlide.id ? json.data : s))
        );
        onShowToast("success", "Hero slide updated successfully!");
      } else {
        // Create new slide
        const res = await fetch("/api/admin/cms/hero-slides", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const json = await res.json();
        if (!res.ok || !json.success) {
          onShowToast("error", json.error || "Failed to create slide.");
          return;
        }

        setSlides((prev) => [...prev, json.data]);
        setSelectedSlideId(json.data.id);
        onShowToast("success", "New hero slide created successfully!");
      }

      setIsModalOpen(false);
    } catch {
      onShowToast("error", "Error saving slide.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. LIVE 16:9 HERO BANNER PREVIEW                                          */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#F5B83D]" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Live Preview: 16:9 Hero Banner ({activeSlideForPreview ? activeSlideForPreview.title.slice(0, 35) + "..." : "No Slide Selected"})
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">Click any slide below to preview</span>
        </div>

        {activeSlideForPreview ? (
          <div className="relative aspect-video max-h-[380px] w-full overflow-hidden bg-slate-950 flex items-center justify-center">
            {/* Background Image */}
            <img
              src={activeSlideForPreview.imageUrl}
              alt="Hero Preview"
              className="absolute inset-0 w-full h-full object-cover opacity-35"
            />
            {/* Dark Gradient Overlay matching frontend */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#12100E]/95 via-[#12100E]/80 to-transparent" />

            {/* Banner Content Mockup */}
            <div className="relative z-10 p-6 sm:p-10 max-w-2xl text-left w-full">
              {activeSlideForPreview.badge && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5B83D]/15 border border-[#F5B83D]/30 text-[#F5B83D] text-[11px] font-bold tracking-wide uppercase mb-3">
                  <Sparkles className="w-3 h-3" />
                  <span>{activeSlideForPreview.badge}</span>
                </div>
              )}
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-tight mb-2">
                {activeSlideForPreview.title}
              </h2>
              {activeSlideForPreview.subtitle && (
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-5 line-clamp-2">
                  {activeSlideForPreview.subtitle}
                </p>
              )}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="px-5 py-2.5 rounded-xl bg-[#F5B83D] text-slate-950 font-bold text-xs shadow-lg flex items-center gap-2"
                >
                  <span>{activeSlideForPreview.ctaText || "Get Started"}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] text-neutral-400">
                  Target: {activeSlideForPreview.linkUrl || "/register"}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 text-xs">
            No slides available. Click "Create Slide" below to add your first banner.
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. SLIDE LIST & REORDER CONTROLS                                          */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Hero Slider Slides ({slides.length})</h4>
              <p className="text-xs text-slate-500">Reorder, enable/disable, or update banner texts and photos</p>
            </div>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-2 transition shadow-xs self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#F5B83D]" />
            <span>Create New Slide</span>
          </button>
        </div>

        {/* Slide Items List */}
        <div className="space-y-3">
          {slides.map((slide, index) => {
            const isSelected = selectedSlideId === slide.id;
            const isActionPending = actionId === slide.id;

            return (
              <div
                key={slide.id}
                onClick={() => setSelectedSlideId(slide.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isSelected
                    ? "border-sky-500/60 bg-sky-50/40 ring-1 ring-sky-500/20"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                {/* Left: Thumbnail & Content */}
                <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                  {/* Order Chip */}
                  <div className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0">
                    {index + 1}
                  </div>

                  {/* Image Thumbnail */}
                  <div className="w-20 h-12 rounded-lg bg-slate-900 overflow-hidden relative shrink-0 border border-slate-200">
                    <img
                      src={slide.imageUrl}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  </div>

                  {/* Title & Badge */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-900 line-clamp-1">
                        {slide.title}
                      </span>
                      {slide.badge && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-semibold shrink-0">
                          {slide.badge}
                        </span>
                      )}
                    </div>
                    {slide.subtitle && (
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {slide.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Actions, Reorder, Status */}
                <div
                  className="flex items-center gap-2 shrink-0 self-end md:self-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Active Toggle */}
                  <button
                    type="button"
                    disabled={isActionPending}
                    onClick={() => handleToggleActive(slide)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border flex items-center gap-1.5 transition ${
                      slide.isActive
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                        : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                    }`}
                  >
                    {slide.isActive ? (
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

                  {/* Reorder Up / Down */}
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMove(index, "up")}
                      className="p-1.5 text-slate-600 hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent transition"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === slides.length - 1}
                      onClick={() => handleMove(index, "down")}
                      className="p-1.5 text-slate-600 hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent transition"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() => openEditModal(slide)}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition"
                    title="Edit Slide"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    disabled={isActionPending}
                    onClick={() => handleDelete(slide)}
                    className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 transition"
                    title="Delete Slide"
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
      {/* 3. MODAL: CREATE OR EDIT SLIDE                                            */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
              <h3 className="text-sm font-bold text-slate-900">
                {editingSlide ? "Edit Hero Slide" : "Create New Hero Slide"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleModalSubmit} className="p-6 space-y-4">
              <CmsImageUploader
                label="Banner Background Image"
                value={formData.imageUrl}
                onChange={(url) => setFormData((prev) => ({ ...prev, imageUrl: url }))}
                placeholder="https://... or upload high-res 16:9 banner"
                helperText="Recommended size: 1920x1080 (16:9 aspect ratio, max 5MB)."
                required
              />

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Main Banner Title <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400">{formData.title.length} chars</span>
                </div>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
                  placeholder="e.g. Carrier-Grade Bulk SMS & OTP Gateway in Bangladesh"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Subtitle / Paragraph
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {formData.subtitle.length} chars
                  </span>
                </div>
                <textarea
                  rows={2}
                  value={formData.subtitle}
                  onChange={(e) => setFormData((prev) => ({ ...prev, subtitle: e.target.value }))}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
                  placeholder="Direct operator routing across GP, Banglalink, Robi & Teletalk..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Badge Pill Text
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData((prev) => ({ ...prev, badge: e.target.value }))}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
                    placeholder="e.g. BTRC Approved Route"
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

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    CTA Button Label
                  </label>
                  <input
                    type="text"
                    value={formData.ctaText}
                    onChange={(e) => setFormData((prev) => ({ ...prev, ctaText: e.target.value }))}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
                    placeholder="Get Started"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    CTA Button Destination (URL)
                  </label>
                  <input
                    type="text"
                    value={formData.linkUrl}
                    onChange={(e) => setFormData((prev) => ({ ...prev, linkUrl: e.target.value }))}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
                    placeholder="/register or #pricing"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="slide-is-active"
                  checked={formData.isActive}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                  className="rounded text-sky-600 focus:ring-sky-500 h-4 w-4"
                />
                <label htmlFor="slide-is-active" className="text-xs font-medium text-slate-700">
                  Slide is Active and visible on the public website
                </label>
              </div>

              {/* Modal Buttons */}
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
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#F5B83D] hover:bg-[#e0a42e] text-slate-950 flex items-center gap-2 transition disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingSlide ? "Update Slide" : "Create Slide"}</span>
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
