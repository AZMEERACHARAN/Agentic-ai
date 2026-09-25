"use client";

import React from "react";
import type { GlobeControlsProps } from "./types";

export const GlobeControls: React.FC<GlobeControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onResetView,
  autoRotate,
  onToggleAutoRotate,
}) => {
  return (
    <div
      id="globe-controls"
      className="pointer-events-auto flex flex-col gap-1.5 p-1.5 rounded-2xl transition-all"
      style={{
        background: "rgba(13, 17, 23, 0.8)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
      }}
    >
      {/* Zoom In */}
      <button
        type="button"
        id="globe-zoom-in"
        onClick={onZoomIn}
        className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
        title="Zoom In"
        aria-label="Zoom In"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>

      {/* Zoom Out */}
      <button
        type="button"
        id="globe-zoom-out"
        onClick={onZoomOut}
        className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
        title="Zoom Out"
        aria-label="Zoom Out"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 12H4"
          />
        </svg>
      </button>

      <div className="w-full h-px bg-white/10 my-0.5" />

      {/* Reset View */}
      <button
        type="button"
        id="globe-reset-view"
        onClick={onResetView}
        className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
        title="Reset Globe View"
        aria-label="Reset Globe View"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </button>

      {/* Toggle Auto-Rotation */}
      <button
        type="button"
        id="globe-toggle-rotate"
        onClick={onToggleAutoRotate}
        className={`w-9 h-9 rounded-xl flex items-center justify-center active:scale-95 transition-all ${
          autoRotate
            ? "text-emerald-400 bg-emerald-500/20"
            : "text-gray-400 hover:text-white hover:bg-white/10"
        }`}
        title={autoRotate ? "Pause Auto-Rotation" : "Start Auto-Rotation"}
        aria-label={autoRotate ? "Pause Auto-Rotation" : "Start Auto-Rotation"}
      >
        <svg
          className={`w-4 h-4 ${autoRotate ? "animate-spin" : ""}`}
          style={{ animationDuration: "8s" }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
          />
        </svg>
      </button>
    </div>
  );
};
