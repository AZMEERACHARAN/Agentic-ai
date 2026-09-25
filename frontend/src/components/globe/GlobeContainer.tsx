"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import type { Country, CountryGeoJsonCollection } from "@/types/country";
import { loadCountryDataset } from "@/lib/countries/country-data";
import { WorldGlobe } from "./WorldGlobe";
import type { WorldGlobeInnerHandle } from "./WorldGlobeInner";
import { CountrySearch } from "./CountrySearch";
import { GlobeControls } from "./GlobeControls";
import { EconomicOverview } from "@/components/economy/EconomicOverview";

export const GlobeContainer: React.FC = () => {
  const [countriesData, setCountriesData] =
    useState<CountryGeoJsonCollection | null>(null);
  const [countriesList, setCountriesList] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<Country | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);

  // Reference to globe camera handle for zoom & reset
  const globeHandleRef = useRef<WorldGlobeInnerHandle | null>(null);

  // Fetch and cache GeoJSON on mount
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);
        const { collection, countries } = await loadCountryDataset();

        if (isMounted) {
          setCountriesData(collection);
          setCountriesList(countries);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to load country boundaries:", err);
          setError("Unable to load country boundaries. Please refresh the page.");
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleHandleReady = useCallback((handle: WorldGlobeInnerHandle) => {
    globeHandleRef.current = handle;
  }, []);

  const handleSelectCountry = useCallback((country: Country) => {
    setSelectedCountry(country);
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedCountry(null);
  }, []);

  const handleHoverCountry = useCallback((country: Country | null) => {
    setHoveredCountry(country);
  }, []);

  const handleZoomIn = useCallback(() => {
    globeHandleRef.current?.zoomIn();
  }, []);

  const handleZoomOut = useCallback(() => {
    globeHandleRef.current?.zoomOut();
  }, []);

  const handleResetView = useCallback(() => {
    globeHandleRef.current?.resetView();
  }, []);

  const handleToggleAutoRotate = useCallback(() => {
    setAutoRotate((prev) => !prev);
  }, []);

  return (
    <div
      id="globe-container"
      className="relative w-full h-screen overflow-hidden flex flex-col bg-gray-950 text-gray-100 select-none"
    >
      {/* ── Top Header / Brand Bar ── */}
      <header
        id="ecosphere-topbar"
        className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3.5 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(3, 7, 18, 0.85) 0%, rgba(3, 7, 18, 0.4) 70%, transparent 100%)",
        }}
      >
        {/* Brand identity */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shadow-lg flex-shrink-0"
            style={{
              background:
                "linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)",
              boxShadow: "0 0 16px rgba(16, 185, 129, 0.3)",
            }}
          >
            🌍
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white leading-tight">
                Ecosphere
              </h1>
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider"
                style={{
                  background: "rgba(16, 185, 129, 0.15)",
                  color: "#34d399",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                }}
              >
                Step 4 · Historical Economic Data
              </span>
            </div>
            <p className="text-xs text-gray-400 hidden sm:block">
              Global Economic Intelligence
            </p>
          </div>
        </div>

        {/* Center/Right Search Bar on medium+ screens */}
        <div className="hidden md:flex flex-1 justify-center max-w-md mx-4 pointer-events-auto">
          <CountrySearch
            countries={countriesList}
            selectedCountry={selectedCountry}
            onSelectCountry={handleSelectCountry}
          />
        </div>

        {/* Status indicator badge */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{
              background: "rgba(17, 24, 39, 0.8)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                selectedCountry ? "bg-emerald-400 animate-pulse" : "bg-blue-400"
              }`}
            />
            <span className="text-gray-300">
              {selectedCountry
                ? `${selectedCountry.name} (${selectedCountry.iso3})`
                : "Select a Country"}
            </span>
          </div>
        </div>
      </header>

      {/* ── Mobile Search Bar (Top under header) ── */}
      <div className="md:hidden absolute top-16 left-4 right-4 z-30 pointer-events-auto">
        <CountrySearch
          countries={countriesList}
          selectedCountry={selectedCountry}
          onSelectCountry={handleSelectCountry}
        />
      </div>

      {/* ── Main 3D Globe Viewport ── */}
      <main className="w-full h-full relative flex-1">
        {isLoading ? (
          <div
            id="globe-loading-state"
            className="w-full h-full flex flex-col items-center justify-center gap-4 bg-gray-950"
          >
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center text-xl">
                🌍
              </div>
            </div>
            <div className="text-center">
              <p className="text-base font-semibold text-gray-200 tracking-wide">
                Loading world map...
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Parsing country boundary coordinates & metadata
              </p>
            </div>
          </div>
        ) : error ? (
          <div
            id="globe-error-state"
            className="w-full h-full flex flex-col items-center justify-center gap-4 p-6 bg-gray-950"
          >
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-2xl text-red-400">
              ⚠️
            </div>
            <div className="text-center max-w-sm">
              <p className="text-base font-semibold text-red-400">{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/15 text-sm font-medium rounded-xl text-gray-200 transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        ) : (
          <WorldGlobe
            countriesData={countriesData}
            selectedCountry={selectedCountry}
            hoveredCountry={hoveredCountry}
            onSelectCountry={handleSelectCountry}
            onHoverCountry={handleHoverCountry}
            autoRotate={autoRotate}
            onHandleReady={handleHandleReady}
          />
        )}
      </main>

      {/* ── Overlay: Economic Overview Panel ── */}
      <div
        className="absolute bottom-6 left-4 sm:left-6 z-20 pointer-events-none max-w-[calc(100vw-2rem)]"
        style={{ maxWidth: "780px", width: "100%" }}
      >
        <EconomicOverview
          selectedCountry={selectedCountry}
          onClearSelection={handleClearSelection}
        />
      </div>

      {/* ── Overlay: Globe Controls (Zoom, Reset, Auto-rotate) ── */}
      <div className="absolute bottom-6 right-4 sm:right-6 z-20 pointer-events-none">
        <GlobeControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetView={handleResetView}
          autoRotate={autoRotate}
          onToggleAutoRotate={handleToggleAutoRotate}
        />
      </div>

      {/* ── Overlay: Hover Hint Bar (Bottom Center) ── */}
      {hoveredCountry && !selectedCountry && (
        <div
          id="country-hover-indicator"
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-medium animate-in fade-in"
          style={{
            background: "rgba(13, 17, 23, 0.85)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(56, 189, 248, 0.4)",
            color: "#7dd3fc",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.4)",
          }}
        >
          <span>Hovering:</span>
          <span className="font-bold text-white">{hoveredCountry.name}</span>
          <span className="text-gray-400">({hoveredCountry.iso3})</span>
          <span className="text-[10px] text-gray-500 font-sans ml-1">
            · Click to select
          </span>
        </div>
      )}
    </div>
  );
};

export default GlobeContainer;
