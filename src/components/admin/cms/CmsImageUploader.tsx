"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2, Image as ImageIcon, ExternalLink, Check } from "lucide-react";

interface CmsImageUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
}

export default function CmsImageUploader({
  label,
  value,
  onChange,
  placeholder = "https://... or upload below",
  helperText,
  required = false,
}: CmsImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so the user can re-select the same file if desired
    e.target.value = "";
    setUploadError(null);
    setUploadSuccess(false);

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File exceeds the maximum limit of 5MB.");
      return;
    }

    // Validate MIME type
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
    if (!allowed.includes(file.type)) {
      setUploadError("Only JPG, PNG, WEBP, or SVG images are supported.");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/cms/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setUploadError(json.error || "Failed to upload image.");
        return;
      }

      const uploadedUrl = json.url || json.data?.url;
      if (!uploadedUrl) {
        setUploadError("Server returned an invalid image URL.");
        return;
      }

      onChange(uploadedUrl);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err) {
      console.error("Upload error:", err);
      setUploadError("Network error occurred while uploading.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        {value && (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-sky-600 hover:text-sky-700 flex items-center gap-1 hover:underline"
          >
            <span>View full size</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => {
              setUploadError(null);
              onChange(e.target.value);
            }}
            placeholder={placeholder}
            className="w-full pl-8 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
          />
          <ImageIcon className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 p-0.5 rounded transition"
              title="Clear URL"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Upload Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 transition shrink-0 disabled:opacity-50"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Uploading...</span>
            </>
          ) : uploadSuccess ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Uploaded!</span>
            </>
          ) : (
            <>
              <Upload className="w-3.5 h-3.5" />
              <span>Upload File</span>
            </>
          )}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/svg+xml"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Helper text or Error message */}
      {uploadError ? (
        <p className="text-[11px] text-rose-500 font-medium">{uploadError}</p>
      ) : helperText ? (
        <p className="text-[11px] text-slate-500">{helperText}</p>
      ) : null}

      {/* Instant Visual Thumbnail Preview */}
      {value && (
        <div className="mt-2 p-2 bg-slate-100 rounded-xl border border-slate-200/80 flex items-center gap-3">
          <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-slate-900/10 border border-slate-200 shrink-0 flex items-center justify-center">
            {/* If SVG or remote image */}
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Handle broken image URL gracefully
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-800 truncate">{value}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Image active and ready to publish</p>
          </div>
        </div>
      )}
    </div>
  );
}
