"use client";

import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { HistoricalEconomicData, HistoricalIndicatorPoint } from "@/types/historical";

// ─────────────────────────────────────────────────────────────────────────────
// Indicator Configuration
// ─────────────────────────────────────────────────────────────────────────────

interface IndicatorConfig {
  key: string;
  label: string;
  shortLabel: string;
  icon: string;
  color: string;
  fillGradient: string;
  formatYAxis: (val: number) => string;
  formatTooltip: (val: number | null, unit: string) => string;
}

const INDICATOR_CONFIGS: Record<string, IndicatorConfig> = {
  gdp: {
    key: "gdp",
    label: "GDP",
    shortLabel: "GDP",
    icon: "📈",
    color: "#10b981", // Emerald
    fillGradient: "rgba(16, 185, 129, 0.25)",
    formatYAxis: (v) => {
      if (Math.abs(v) >= 1e12) return `$${(v / 1e12).toFixed(1)}T`;
      if (Math.abs(v) >= 1e9) return `$${(v / 1e9).toFixed(0)}B`;
      if (Math.abs(v) >= 1e6) return `$${(v / 1e6).toFixed(0)}M`;
      return `$${v}`;
    },
    formatTooltip: (v, unit) => {
      if (v === null || v === undefined) return "Unavailable";
      if (Math.abs(v) >= 1e12) return `$${(v / 1e12).toFixed(2)} Trillion (${unit})`;
      if (Math.abs(v) >= 1e9) return `$${(v / 1e9).toFixed(2)} Billion (${unit})`;
      return `$${v.toLocaleString()} (${unit})`;
    },
  },
  gdp_growth: {
    key: "gdp_growth",
    label: "GDP Growth",
    shortLabel: "Growth",
    icon: "⚡",
    color: "#38bdf8", // Sky blue
    fillGradient: "rgba(56, 189, 248, 0.25)",
    formatYAxis: (v) => `${v.toFixed(1)}%`,
    formatTooltip: (v, unit) => {
      if (v === null || v === undefined) return "Unavailable";
      const sign = v > 0 ? "+" : "";
      return `${sign}${v.toFixed(2)}% (${unit})`;
    },
  },
  gdp_per_capita: {
    key: "gdp_per_capita",
    label: "GDP per Capita",
    shortLabel: "Per Capita",
    icon: "👤",
    color: "#a855f7", // Purple
    fillGradient: "rgba(168, 85, 247, 0.25)",
    formatYAxis: (v) => `$${v >= 1e3 ? `${(v / 1e3).toFixed(0)}k` : v.toFixed(0)}`,
    formatTooltip: (v, unit) => {
      if (v === null || v === undefined) return "Unavailable";
      return `$${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${unit})`;
    },
  },
  inflation: {
    key: "inflation",
    label: "Inflation",
    shortLabel: "Inflation",
    icon: "🏷️",
    color: "#f59e0b", // Amber
    fillGradient: "rgba(245, 158, 11, 0.25)",
    formatYAxis: (v) => `${v.toFixed(1)}%`,
    formatTooltip: (v, unit) => {
      if (v === null || v === undefined) return "Unavailable";
      return `${v.toFixed(2)}% (${unit})`;
    },
  },
  unemployment: {
    key: "unemployment",
    label: "Unemployment",
    shortLabel: "Unemployment",
    icon: "👥",
    color: "#f43f5e", // Rose
    fillGradient: "rgba(244, 63, 94, 0.25)",
    formatYAxis: (v) => `${v.toFixed(1)}%`,
    formatTooltip: (v, unit) => {
      if (v === null || v === undefined) return "Unavailable";
      return `${v.toFixed(2)}% (${unit})`;
    },
  },
  population: {
    key: "population",
    label: "Population",
    shortLabel: "Population",
    icon: "🌍",
    color: "#6366f1", // Indigo
    fillGradient: "rgba(99, 102, 241, 0.25)",
    formatYAxis: (v) => {
      if (v >= 1e9) return `${(v / 1e9).toFixed(1)}B`;
      if (v >= 1e6) return `${(v / 1e6).toFixed(0)}M`;
      if (v >= 1e3) return `${(v / 1e3).toFixed(0)}K`;
      return `${v}`;
    },
    formatTooltip: (v, unit) => {
      if (v === null || v === undefined) return "Unavailable";
      if (v >= 1e9) return `${(v / 1e9).toFixed(3)} Billion (${unit})`;
      if (v >= 1e6) return `${(v / 1e6).toFixed(2)} Million (${unit})`;
      return `${v.toLocaleString()} (${unit})`;
    },
  },
  fdi: {
    key: "fdi",
    label: "FDI Inflows",
    shortLabel: "FDI",
    icon: "🏦",
    color: "#ec4899", // Pink
    fillGradient: "rgba(236, 72, 153, 0.25)",
    formatYAxis: (v) => {
      if (Math.abs(v) >= 1e9) return `$${(v / 1e9).toFixed(1)}B`;
      if (Math.abs(v) >= 1e6) return `$${(v / 1e6).toFixed(0)}M`;
      return `$${v}`;
    },
    formatTooltip: (v, unit) => {
      if (v === null || v === undefined) return "Unavailable";
      if (Math.abs(v) >= 1e9) return `$${(v / 1e9).toFixed(2)} Billion (${unit})`;
      return `$${v.toLocaleString()} (${unit})`;
    },
  },
};

const INDICATOR_KEYS = [
  "gdp",
  "gdp_growth",
  "gdp_per_capita",
  "inflation",
  "unemployment",
  "population",
  "fdi",
];

// ─────────────────────────────────────────────────────────────────────────────
// Custom Recharts Tooltip Component
// ─────────────────────────────────────────────────────────────────────────────

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number | null;
    payload: HistoricalIndicatorPoint & { year: number };
  }>;
  label?: number;
  config: IndicatorConfig;
  unit: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
  config,
  unit,
}) => {
  if (!active || !payload || !payload.length) return null;

  const dataPoint = payload[0].payload;
  const rawValue = payload[0].value;
  const isAvailable = rawValue !== null && rawValue !== undefined;

  return (
    <div
      className="p-3 rounded-xl shadow-2xl border text-xs"
      style={{
        background: "rgba(10, 15, 26, 0.95)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderColor: "rgba(255, 255, 255, 0.12)",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.7), 0 0 15px rgba(0, 0, 0, 0.5)",
      }}
    >
      <div className="flex items-center justify-between gap-3 mb-1.5 pb-1.5 border-b border-white/10">
        <span className="font-semibold text-gray-200 flex items-center gap-1.5">
          <span>{config.icon}</span>
          <span>{config.label}</span>
        </span>
        <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded text-[11px]">
          {label}
        </span>
      </div>

      <div className="mb-1">
        <span className="text-gray-400 text-[10px] block uppercase tracking-wider">Observed Value</span>
        <span
          className="text-base font-bold tracking-tight"
          style={{ color: isAvailable ? config.color : "#9ca3af" }}
        >
          {config.formatTooltip(rawValue, unit)}
        </span>
      </div>

      <div className="flex items-center justify-between text-[10px] text-gray-500 pt-1 border-t border-white/5 mt-1.5">
        <span>Source: {dataPoint.source || "World Bank"}</span>
        <span className="text-gray-600">Verified</span>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main HistoricalChart Component
// ─────────────────────────────────────────────────────────────────────────────

interface HistoricalChartProps {
  historicalData: HistoricalEconomicData | null;
  isLoading: boolean;
  error: string | null;
  countryName: string;
}

export const HistoricalChart: React.FC<HistoricalChartProps> = ({
  historicalData,
  isLoading,
  error,
  countryName,
}) => {
  const [selectedKey, setSelectedKey] = useState<string>("gdp");

  const activeConfig = INDICATOR_CONFIGS[selectedKey] || INDICATOR_CONFIGS.gdp;

  // Extract points for active indicator
  const chartPoints = useMemo(() => {
    if (!historicalData?.indicators) return [];
    const indData = historicalData.indicators[selectedKey];
    if (!indData?.points) return [];
    return indData.points;
  }, [historicalData, selectedKey]);

  const activeUnit = useMemo(() => {
    if (!historicalData?.indicators) return "";
    return historicalData.indicators[selectedKey]?.unit || "";
  }, [historicalData, selectedKey]);

  // Determine year range for subtitle
  const yearRangeText = useMemo(() => {
    if (!chartPoints.length) return "";
    const years = chartPoints.map((p) => p.year);
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    return `${minYear} – ${maxYear}`;
  }, [chartPoints]);

  return (
    <div
      id="historical-economic-section"
      className="w-full flex flex-col rounded-2xl overflow-hidden select-none border transition-all"
      style={{
        background: "rgba(10, 15, 26, 0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderColor: "rgba(255, 255, 255, 0.08)",
        boxShadow: "0 12px 36px rgba(0, 0, 0, 0.5)",
      }}
    >
      {/* ── Top Bar: Title & Year Span ── */}
      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm">📊</span>
          <div>
            <h3 className="text-xs font-bold text-gray-200 tracking-wide uppercase">
              Historical Economic Data
            </h3>
            <p className="text-[10px] text-gray-400">
              {countryName} · 10-Year Official Trend {yearRangeText && `(${yearRangeText})`}
            </p>
          </div>
        </div>

        {historicalData?.data_source && (
          <span
            className="text-[9px] font-mono px-2 py-0.5 rounded-full font-medium tracking-wide uppercase"
            style={{
              background:
                historicalData.data_source === "cache"
                  ? "rgba(16, 185, 129, 0.12)"
                  : "rgba(56, 189, 248, 0.12)",
              color:
                historicalData.data_source === "cache" ? "#34d399" : "#38bdf8",
              border: `1px solid ${
                historicalData.data_source === "cache"
                  ? "rgba(16, 185, 129, 0.25)"
                  : "rgba(56, 189, 248, 0.25)"
              }`,
            }}
          >
            {historicalData.data_source === "cache" ? "⚡ Cached" : "🌐 World Bank"}
          </span>
        )}
      </div>

      {/* ── Indicator Selector Pills ── */}
      <div className="px-3 pt-2.5 pb-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {INDICATOR_KEYS.map((key) => {
          const cfg = INDICATOR_CONFIGS[key];
          const isSelected = selectedKey === key;
          return (
            <button
              key={key}
              type="button"
              id={`historical-indicator-btn-${key}`}
              onClick={() => setSelectedKey(key)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all whitespace-nowrap active:scale-95 cursor-pointer"
              style={{
                background: isSelected
                  ? "rgba(255, 255, 255, 0.12)"
                  : "rgba(255, 255, 255, 0.03)",
                color: isSelected ? "#ffffff" : "rgba(156, 163, 175, 0.8)",
                border: isSelected
                  ? `1px solid ${cfg.color}`
                  : "1px solid rgba(255, 255, 255, 0.05)",
                boxShadow: isSelected ? `0 0 12px ${cfg.color}33` : "none",
              }}
            >
              <span className="text-xs">{cfg.icon}</span>
              <span>{cfg.shortLabel}</span>
            </button>
          );
        })}
      </div>

      {/* ── Main Chart Body / States ── */}
      <div className="p-3">
        {isLoading ? (
          <div
            id="historical-loading-state"
            className="h-44 flex flex-col items-center justify-center gap-2.5"
          >
            <div className="w-8 h-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
            <p className="text-xs text-gray-400 font-medium tracking-wide">
              Loading historical data...
            </p>
          </div>
        ) : error ? (
          <div
            id="historical-error-state"
            className="h-44 flex flex-col items-center justify-center gap-2 text-center p-4"
          >
            <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-sm text-red-400">
              ⚠️
            </div>
            <p className="text-xs font-semibold text-red-400">
              Unable to load historical economic data.
            </p>
            <p className="text-[10px] text-gray-500 max-w-xs">{error}</p>
          </div>
        ) : chartPoints.length === 0 ? (
          <div className="h-44 flex flex-col items-center justify-center text-gray-500 text-xs">
            No historical data available for {activeConfig.label}.
          </div>
        ) : (
          <div className="w-full h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartPoints}
                margin={{ top: 10, right: 10, left: -16, bottom: 0 }}
              >
                <defs>
                  <linearGradient id={`gradient-${selectedKey}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={activeConfig.color} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={activeConfig.color} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255, 255, 255, 0.05)"
                  vertical={false}
                />
                <XAxis
                  dataKey="year"
                  stroke="rgba(156, 163, 175, 0.5)"
                  tick={{ fontSize: 10, fill: "rgba(156, 163, 175, 0.7)" }}
                  tickLine={false}
                  axisLine={{ stroke: "rgba(255, 255, 255, 0.08)" }}
                />
                <YAxis
                  stroke="rgba(156, 163, 175, 0.5)"
                  tick={{ fontSize: 9, fill: "rgba(156, 163, 175, 0.7)" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={activeConfig.formatYAxis}
                  domain={["auto", "auto"]}
                />
                <Tooltip
                  content={
                    <CustomTooltip
                      config={activeConfig}
                      unit={activeUnit}
                    />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={activeConfig.color}
                  strokeWidth={2.2}
                  fillOpacity={1}
                  fill={`url(#gradient-${selectedKey})`}
                  dot={{
                    r: 3,
                    fill: "#0a0f1a",
                    stroke: activeConfig.color,
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 5,
                    fill: activeConfig.color,
                    stroke: "#ffffff",
                    strokeWidth: 2,
                  }}
                  connectNulls={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoricalChart;
