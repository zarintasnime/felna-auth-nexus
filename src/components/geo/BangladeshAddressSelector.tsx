"use client";

import React, { useState, useEffect, useMemo } from "react";
import { MapPin, Building2, Landmark, Home, Info } from "lucide-react";
import {
  getAllDivisions,
  getDistrictsByDivision,
  getLocationsByDistrict,
  isMetropolitanDistrict,
  GeoDivision,
  GeoDistrict,
  GeoLocationOption,
} from "@/lib/geo/bangladesh-address";

export interface BangladeshAddressSelectorProps {
  divisionId: string;
  onDivisionChange: (divisionId: string, divisionName?: string) => void;
  districtId: string;
  onDistrictChange: (districtId: string, districtName?: string) => void;
  upazilaId: string;
  onUpazilaChange: (upazilaId: string, locationOption?: GeoLocationOption) => void;
  address?: string;
  onAddressChange?: (address: string) => void;
  error?: string | null;
  disabled?: boolean;
  required?: boolean;
}

export default function BangladeshAddressSelector({
  divisionId,
  onDivisionChange,
  districtId,
  onDistrictChange,
  upazilaId,
  onUpazilaChange,
  address = "",
  onAddressChange,
  error,
  disabled = false,
  required = true,
}: BangladeshAddressSelectorProps) {
  // Static instant data from all-bangladeshi-addresses service
  const divisions: GeoDivision[] = useMemo(() => getAllDivisions(), []);

  // Compute districts instantly upon division selection
  const districts: GeoDistrict[] = useMemo(() => {
    if (!divisionId) return [];
    return getDistrictsByDivision(divisionId);
  }, [divisionId]);

  // Compute locations (thanas & upazilas) instantly upon district selection
  const locations: GeoLocationOption[] = useMemo(() => {
    if (!districtId) return [];
    return getLocationsByDistrict(districtId);
  }, [districtId]);

  // Check if district is metropolitan
  const isMetro = useMemo(() => {
    if (!districtId) return false;
    return isMetropolitanDistrict(districtId);
  }, [districtId]);

  // Selected item info for badges
  const selectedLocation = locations.find((l) => l.id === upazilaId);

  // Group thanas and upazilas
  const thanas = useMemo(() => locations.filter((l) => l.type === "thana"), [locations]);
  const upazilas = useMemo(() => locations.filter((l) => l.type === "upazila"), [locations]);

  // Event handlers with cascading resets
  function handleDivisionSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const newDivId = e.target.value;
    const selectedDiv = divisions.find((d) => d.id === newDivId);
    onDivisionChange(newDivId, selectedDiv?.name);
    // Immediately reset downstream district & thana selections
    onDistrictChange("", undefined);
    onUpazilaChange("", undefined);
  }

  function handleDistrictSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const newDistId = e.target.value;
    const selectedDist = districts.find((d) => d.id === newDistId);
    onDistrictChange(newDistId, selectedDist?.name);
    // Immediately reset downstream thana/upazila selection
    onUpazilaChange("", undefined);
  }

  function handleLocationSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const newLocId = e.target.value;
    const selectedLoc = locations.find((l) => l.id === newLocId);
    onUpazilaChange(newLocId, selectedLoc);
  }

  return (
    <div className="bg-[#f5efe6] p-5 sm:p-6 rounded-2xl border border-[#d4ccc0] space-y-5 transition-all">
      {/* Header with Icon and Context Help */}
      <div className="flex items-center justify-between border-b border-[#e5ded4] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#ebe5da] border border-[#d4ccc0] flex items-center justify-center text-[#4a3b32]">
            <MapPin className="w-4 h-4 text-[#4a3b32]" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-stone-800 tracking-wide uppercase">
              Location in Bangladesh
            </h3>
            <p className="text-[11px] sm:text-xs text-stone-600">
              Select Division, District, then your Metropolitan Thana or Upazila
            </p>
          </div>
        </div>

        {isMetro && (
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 bg-[#ede8dc] border border-[#cfc6b6] rounded-full text-[11px] font-medium text-[#4a3b32]">
            <Building2 className="w-3 h-3 text-[#4a3b32]" />
            Metropolitan Hub
          </span>
        )}
      </div>

      {/* Row 1: Division & District (Relaxed 2-column Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Step 1: Division Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
            Division {required && <span className="text-[#991b1b]">*</span>}
          </label>
          <div className="relative">
            <select
              required={required}
              disabled={disabled}
              value={divisionId}
              onChange={handleDivisionSelect}
              className="w-full px-3.5 py-2.5 sm:py-3 bg-[#ebe5da] border border-[#d4ccc0] rounded-xl text-xs sm:text-sm text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#4a3b32]/15 focus:border-[#4a3b32] focus:bg-[#fcfbf9] transition disabled:opacity-50 disabled:bg-[#e4ddd2] cursor-pointer"
            >
              <option value="">-- Select Division --</option>
              {divisions.map((div) => (
                <option key={div.id} value={div.id}>
                  {div.name} {div.bnName ? `(${div.bnName})` : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Step 2: District Dropdown (Instantly activates once Division is selected) */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span>District {required && <span className="text-[#991b1b]">*</span>}</span>
            {!divisionId && (
              <span className="text-[10px] text-stone-600 font-normal uppercase tracking-normal">
                (Select division first)
              </span>
            )}
          </label>
          <div className="relative">
            <select
              required={required}
              disabled={disabled || !divisionId}
              value={districtId}
              onChange={handleDistrictSelect}
              className={`w-full px-3.5 py-2.5 sm:py-3 bg-[#ebe5da] border border-[#d4ccc0] rounded-xl text-xs sm:text-sm text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#4a3b32]/15 focus:border-[#4a3b32] focus:bg-[#fcfbf9] transition cursor-pointer ${
                !divisionId
                  ? "opacity-60 bg-[#e4ddd2] cursor-not-allowed text-stone-600"
                  : "hover:border-[#b8ad9e]"
              }`}
            >
              <option value="">
                {!divisionId ? "Select Division First" : "-- Select District --"}
              </option>
              {districts.map((dist) => (
                <option key={dist.id} value={dist.id}>
                  {dist.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Row 2: Thana / Upazila Selection (Instantly activates once District is selected) */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
            Thana / Upazila {required && <span className="text-[#991b1b]">*</span>}
          </label>
          {selectedLocation && (
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border transition-all ${
                selectedLocation.type === "thana"
                  ? "bg-[#ede8dc] text-[#4a3b32] border-[#cfc6b6]"
                  : "bg-[#e8ece4] text-[#2b442b] border-[#c4d1be]"
              }`}
            >
              {selectedLocation.type === "thana" ? (
                <>
                  <Building2 className="w-3 h-3 text-[#4a3b32]" />
                  <span>Metropolitan Thana</span>
                </>
              ) : (
                <>
                  <Landmark className="w-3 h-3 text-[#2b442b]" />
                  <span>Upazila</span>
                </>
              )}
            </span>
          )}
        </div>

        <div className="relative">
          <select
            required={required}
            disabled={disabled || !districtId}
            value={upazilaId}
            onChange={handleLocationSelect}
            className={`w-full px-3.5 py-2.5 sm:py-3 bg-[#ebe5da] border border-[#d4ccc0] rounded-xl text-xs sm:text-sm text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#4a3b32]/15 focus:border-[#4a3b32] focus:bg-[#fcfbf9] transition cursor-pointer ${
              !districtId
                ? "opacity-60 bg-[#e4ddd2] cursor-not-allowed text-stone-600"
                : "hover:border-[#b8ad9e]"
            }`}
          >
            <option value="">
              {!districtId
                ? "Select District First"
                : thanas.length > 0 && upazilas.length > 0
                ? "-- Select Metropolitan Thana or Upazila --"
                : "-- Select Thana / Upazila --"}
            </option>

            {/* If Metropolitan District with both Thanas and Upazilas, organize into clear optgroups */}
            {thanas.length > 0 && isMetro && (
              <optgroup label="🏙️ Metropolitan Thanas (Police Stations)">
                {thanas.map((thn) => (
                  <option key={thn.id} value={thn.id}>
                    {thn.name} (Thana)
                  </option>
                ))}
              </optgroup>
            )}

            {upazilas.length > 0 && isMetro ? (
              <optgroup label="🌾 Upazilas (Sub-districts)">
                {upazilas.map((upz) => (
                  <option key={upz.id} value={upz.id}>
                    {upz.name} (Upazila)
                  </option>
                ))}
              </optgroup>
            ) : (
              locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} {loc.type === "thana" ? "(Thana)" : ""}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Helpful context helper for metropolitan areas */}
        {districtId && isMetro && (
          <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-stone-600">
            <Info className="w-3.5 h-3.5 flex-shrink-0 text-stone-500" />
            <span>
              City residents can pick their <strong>Metropolitan Thana</strong> (e.g., Gulshan,
              Dhanmondi, Banani, Panchlaish); sub-district residents can pick their{" "}
              <strong>Upazila</strong> (e.g., Savar, Keraniganj, Hathazari).
            </span>
          </p>
        )}
      </div>

      {/* Row 3: Permanent / Street Address (Generous padding & placeholder) */}
      {onAddressChange && (
        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5 text-stone-500" />
            <span>Permanent / Street Address</span>
            <span className="text-[10px] text-stone-500 font-normal uppercase tracking-normal">
              (Optional)
            </span>
          </label>
          <input
            type="text"
            disabled={disabled}
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
            placeholder="House/Holding #, Road #, Sector/Block, Village/Ward"
            className="w-full px-3.5 py-2.5 sm:py-3 bg-[#ebe5da] border border-[#d4ccc0] rounded-xl text-xs sm:text-sm text-stone-800 placeholder:text-stone-500/70 focus:outline-none focus:ring-2 focus:ring-[#4a3b32]/15 focus:border-[#4a3b32] focus:bg-[#fcfbf9] transition"
          />
        </div>
      )}

      {error && <p className="text-xs text-[#991b1b] font-medium">{error}</p>}
    </div>
  );
}
