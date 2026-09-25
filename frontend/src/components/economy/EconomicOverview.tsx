"use client";

import React, { useEffect, useState } from "react";
import type { Country } from "@/types/country";
import type { HistoricalLoadState } from "@/types/historical";
import { fetchHistoricalEconomicData } from "@/lib/api/economy";
import { HistoricalChart } from "./HistoricalChart";
import { getMockCountryData } from "@/data/mockCountryData";
import { MockEconomicDashboard } from "./MockEconomicDashboard";

interface EconomicOverviewProps {
  selectedCountry: Country | null;
  onClearSelection: () => void;
}

export const EconomicOverview: React.FC<EconomicOverviewProps> = ({
  selectedCountry,
  onClearSelection,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "historical">("overview");
  const [prevIso3, setPrevIso3] = useState<string | undefined>(selectedCountry?.iso3);
  const [histState, setHistState] = useState<HistoricalLoadState>({ status: "idle" });

  // Reset tab to overview when selected country changes
  if (selectedCountry && selectedCountry.iso3 !== prevIso3) {
    setPrevIso3(selectedCountry.iso3);
    setActiveTab("overview");
  }

  // Fetch 10-year historical data for the historical tab (Step 4 preserved)
  useEffect(() => {
    if (!selectedCountry) return;

    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) {
        setHistState({ status: "loading" });
      }
    });

    fetchHistoricalEconomicData(selectedCountry.iso3)
      .then((data) => {
        if (!cancelled) {
          setHistState({ status: "success", data });
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const msg =
            err instanceof Error
              ? err.message
              : "Unable to load historical economic data.";
          setHistState({ status: "error", message: msg });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedCountry]);

  // ── No country selected ──
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
              Click any country on the 3D globe or search above to explore economic data.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Retrieve mock data dynamically via helper function
  const countryData = getMockCountryData(selectedCountry.iso3);

  return (
    <div
      id="economic-overview-panel"
      className="pointer-events-auto rounded-2xl overflow-hidden transition-all duration-300 animate-in fade-in zoom-in-95"
      style={{
        background: "rgba(10, 14, 20, 0.94)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(16, 185, 129, 0.25)",
        boxShadow: "0 0 32px rgba(16, 185, 129, 0.12), 0 20px 50px rgba(0, 0, 0, 0.7)",
        width: "100%",
        maxWidth: "780px",
        maxHeight: "calc(100vh - 100px)",
        overflowY: "auto",
      }}
    >
      {/* ── Top Navigation Bar: Country breadcrumb + Tab Switcher + Close ── */}
      <div
        className="px-4 py-2.5 flex items-center justify-between sticky top-0 z-20"
        style={{
          background: "rgba(10, 14, 20, 0.97)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse"
            style={{ background: "#10b981", boxShadow: "0 0 8px #10b981" }}
          />
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate leading-tight">
              {selectedCountry.name}
            </p>
            <p className="text-[10px] font-mono text-emerald-400 leading-none">
              {selectedCountry.iso3}
            </p>
          </div>
        </div>

        {/* Tab switcher: Overview vs 10-Year Historical */}
        <div className="flex items-center gap-1 bg-white/5 p-0.5 rounded-lg border border-white/10 ml-auto mr-2">
          <button
            type="button"
            id="country-tab-overview"
            onClick={() => setActiveTab("overview")}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
              activeTab === "overview"
                ? "bg-emerald-500 text-gray-950 font-bold shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            id="country-tab-historical"
            onClick={() => setActiveTab("historical")}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
              activeTab === "historical"
                ? "bg-emerald-500 text-gray-950 font-bold shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
          >
            10-Yr History
          </button>
        </div>

        <button
          type="button"
          onClick={onClearSelection}
          className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
          aria-label="Close economic panel"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* ── Content ── */}
      <div className="p-4">
        {activeTab === "historical" ? (
          <HistoricalChart
            historicalData={histState.status === "success" ? histState.data : null}
            isLoading={histState.status === "loading"}
            error={histState.status === "error" ? histState.message : null}
            countryName={selectedCountry.name}
          />
        ) : countryData ? (
          /* Supported Country: Render 10 Sections A-J Mock Economic Dashboard */
          <MockEconomicDashboard
            countryData={countryData}
            onSwitchToHistory={() => setActiveTab("historical")}
          />
        ) : (
          /* Unsupported Country: Section 11 Graceful Fallback */
          <div
            id="mock-data-fallback"
            className="rounded-2xl p-5 text-center space-y-4"
            style={{
              background: "rgba(17, 24, 39, 0.75)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <span
                className="px-2 py-0.5 rounded text-xs font-mono font-bold"
                style={{
                  background: "rgba(59, 130, 246, 0.15)",
                  color: "#60a5fa",
                  border: "1px solid rgba(59, 130, 246, 0.3)",
                }}
              >
                {selectedCountry.iso2 || selectedCountry.iso3}
              </span>
              <h3 className="text-base font-bold text-white">{selectedCountry.name}</h3>
            </div>

            <p className="text-xs text-gray-400 font-mono">
              {selectedCountry.iso3} {selectedCountry.region ? `• ${selectedCountry.region}` : ""}
            </p>

            <div
              className="p-3.5 rounded-xl text-left space-y-2"
              style={{
                background: "rgba(245, 158, 11, 0.08)",
                border: "1px solid rgba(245, 158, 11, 0.25)",
              }}
            >
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
                <span>⚠️</span>
                <span>Prototype Data Unavailable</span>
              </div>
              <p className="text-xs text-amber-200/90 leading-relaxed">
                Prototype economic data is not available for this country yet.
              </p>
              <p className="text-[11px] text-gray-400 pt-1">
                Explore supported prototype countries:
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {["IND", "USA", "CHN", "DEU", "JPN", "GBR", "FRA", "BRA", "SGP", "ARE"].map(
                  (code) => (
                    <span
                      key={code}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-gray-200 border border-white/10"
                    >
                      {code}
                    </span>
                  )
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab("historical")}
              className="w-full py-2 px-3 rounded-xl flex items-center justify-between text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <span>📈</span>
                <span>Check Historical Trends</span>
              </span>
              <span>→</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EconomicOverview;
