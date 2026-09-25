"use client";

import React, { useState } from "react";
import type { SelectedCountryProps } from "./types";

export const SelectedCountry: React.FC<SelectedCountryProps> = ({
  selectedCountry,
  onClearSelection,
}) => {
  const [exploreNotice, setExploreNotice] = useState<string | null>(null);

  if (!selectedCountry) {
    return (
      <div
        id="no-country-selected-panel"
        className="pointer-events-auto rounded-2xl p-4 transition-all duration-300"
        style={{
          background: "rgba(13, 17, 23, 0.75)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
          maxWidth: "340px",
          width: "100%",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: "rgba(16, 185, 129, 0.12)",
              border: "1px solid rgba(16, 185, 129, 0.2)",
            }}
          >
            <span className="text-base">👆</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Interactive Selection
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              Click any country on the 3D globe or search above to select.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleExploreClick = () => {
    setExploreNotice(`Country selected: ${selectedCountry.name}`);
    setTimeout(() => {
      setExploreNotice(null);
    }, 4000);
  };

  return (
    <div
      id="selected-country-panel"
      className="pointer-events-auto rounded-2xl p-5 transition-all duration-300 animate-in fade-in zoom-in-95"
      style={{
        background: "rgba(13, 17, 23, 0.88)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(16, 185, 129, 0.3)",
        boxShadow:
          "0 0 24px rgba(16, 185, 129, 0.15), 0 16px 40px rgba(0, 0, 0, 0.6)",
        maxWidth: "360px",
        width: "100%",
      }}
    >
      {/* Top Header: Badge & Close Button */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{
              background: "#10b981",
              boxShadow: "0 0 8px #10b981",
            }}
          />
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
            Selected Country
          </span>
        </div>

        <button
          type="button"
          onClick={onClearSelection}
          className="text-gray-400 hover:text-gray-100 p-1 rounded-lg hover:bg-white/5 transition-colors text-xs flex items-center gap-1"
          aria-label="Clear country selection"
          title="Deselect country"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <span>Deselect</span>
        </button>
      </div>

      {/* Country Name */}
      <div className="mb-4">
        <h2
          id="selected-country-name"
          className="text-2xl font-bold text-gray-100 tracking-tight flex items-center gap-2"
        >
          <span>{selectedCountry.name}</span>
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Identity confirmed for economic intelligence pipeline
        </p>
      </div>

      {/* Metadata Badges */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div
          className="rounded-xl p-2.5"
          style={{
            background: "rgba(17, 24, 39, 0.8)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 block">
            ISO Alpha-3
          </span>
          <span
            id="selected-country-iso3"
            className="text-base font-mono font-bold text-emerald-300 mt-0.5 block"
          >
            {selectedCountry.iso3}
          </span>
        </div>

        <div
          className="rounded-xl p-2.5"
          style={{
            background: "rgba(17, 24, 39, 0.8)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 block">
            ISO Alpha-2
          </span>
          <span
            id="selected-country-iso2"
            className="text-base font-mono font-bold text-blue-300 mt-0.5 block"
          >
            {selectedCountry.iso2 || "—"}
          </span>
        </div>
      </div>

      {/* Coordinates (if available) */}
      {selectedCountry.coordinates && (
        <div
          className="mb-4 rounded-xl px-3 py-2 flex items-center justify-between text-xs font-mono"
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.04)",
            color: "#9ca3af",
          }}
        >
          <span>Coordinates</span>
          <span className="text-gray-300">
            {selectedCountry.coordinates.latitude > 0
              ? `${selectedCountry.coordinates.latitude}°N`
              : `${Math.abs(selectedCountry.coordinates.latitude)}°S`}
            ,{" "}
            {selectedCountry.coordinates.longitude > 0
              ? `${selectedCountry.coordinates.longitude}°E`
              : `${Math.abs(selectedCountry.coordinates.longitude)}°W`}
          </span>
        </div>
      )}

      {/* Notice feedback if explore button clicked */}
      {exploreNotice && (
        <div
          id="explore-country-notice"
          className="mb-3 px-3 py-2 rounded-xl text-xs text-center font-medium transition-all"
          style={{
            background: "rgba(16, 185, 129, 0.15)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            color: "#34d399",
          }}
        >
          {exploreNotice}
        </div>
      )}

      {/* Explore Country Button */}
      <button
        type="button"
        id="explore-country-btn"
        onClick={handleExploreClick}
        className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
        style={{
          background:
            "linear-gradient(135deg, rgba(16, 185, 129, 0.8) 0%, rgba(5, 150, 105, 0.9) 100%)",
          boxShadow: "0 4px 14px rgba(16, 185, 129, 0.3)",
          border: "1px solid rgba(52, 211, 153, 0.3)",
        }}
      >
        <span>Explore Country</span>
        <svg
          className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      <p className="text-[11px] text-gray-500 text-center mt-2.5">
        Economic intelligence dashboard coming in Step 3
      </p>
    </div>
  );
};
