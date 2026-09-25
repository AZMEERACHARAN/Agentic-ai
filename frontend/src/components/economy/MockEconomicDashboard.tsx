"use client";

import React, { useState } from "react";
import type { MockCountryData } from "@/data/mockCountryData";
import { InvestmentReportModal } from "./InvestmentReportModal";

interface MockEconomicDashboardProps {
  countryData: MockCountryData;
  onSwitchToHistory?: () => void;
}

export const MockEconomicDashboard: React.FC<MockEconomicDashboardProps> = ({
  countryData,
  onSwitchToHistory,
}) => {
  const [briefOpen, setBriefOpen] = useState<boolean>(false);
  const [reportOpen, setReportOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [compareSelected, setCompareSelected] = useState<string>("");

  const getRiskBadgeClass = (score: number) => {
    if (score <= 25) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
    if (score <= 50) return "text-amber-400 bg-amber-500/10 border-amber-500/30";
    return "text-rose-400 bg-rose-500/10 border-rose-500/30";
  };

  const getRiskProgressBarColor = (score: number) => {
    if (score <= 25) return "linear-gradient(90deg, #10b981 0%, #34d399 100%)";
    if (score <= 50) return "linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)";
    return "linear-gradient(90deg, #ef4444 0%, #f87171 100%)";
  };

  return (
    <div className="space-y-4 text-gray-100">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          id="report-notification-toast"
          className="p-3 rounded-xl flex items-center justify-between text-xs animate-in fade-in slide-in-from-top-2 duration-200"
          style={{
            background: "rgba(16, 185, 129, 0.15)",
            border: "1px solid rgba(16, 185, 129, 0.35)",
            color: "#6ee7b7",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
          }}
        >
          <div className="flex items-center gap-2">
            <span>ℹ️</span>
            <span className="font-medium">{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-gray-400 hover:text-white ml-2 text-sm font-bold"
            aria-label="Dismiss notification"
          >
            ✕
          </button>
        </div>
      )}

      {/* ==================================================
          SECTION A: COUNTRY HEADER
          ================================================== */}
      <div
        className="rounded-2xl p-4 transition-all"
        style={{
          background:
            "linear-gradient(135deg, rgba(17, 24, 39, 0.85) 0%, rgba(13, 17, 23, 0.95) 100%)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="px-2 py-0.5 rounded-md text-xs font-mono font-bold tracking-wider"
                style={{
                  background: "rgba(59, 130, 246, 0.15)",
                  color: "#60a5fa",
                  border: "1px solid rgba(59, 130, 246, 0.3)",
                }}
              >
                {countryData.country.iso2}
              </span>
              <h2 className="text-xl font-bold tracking-tight text-white truncate">
                {countryData.country.name}
              </h2>
            </div>
            {/* Meta subline: ISO2 | REGION | CAPITAL | CURRENCY */}
            <p className="text-[11px] font-mono tracking-wider text-gray-400 uppercase leading-snug">
              {countryData.country.iso2} | {countryData.country.region} | {countryData.country.capital} | {countryData.country.currency}
            </p>
          </div>

          {/* Prototype Data Badge */}
          <div className="flex-shrink-0">
            <span
              id="prototype-data-badge"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase shadow-sm"
              style={{
                background: "rgba(245, 158, 11, 0.12)",
                color: "#fbbf24",
                border: "1px solid rgba(245, 158, 11, 0.28)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Prototype Data • 2025
            </span>
          </div>
        </div>
      </div>

      {/* ==================================================
          SECTION B: INVESTMENT SIGNAL
          ================================================== */}
      <div
        className="rounded-2xl p-4"
        style={{
          background:
            "linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                INVESTMENT SIGNAL
              </p>
            </div>
            <p className="text-3xl font-extrabold tracking-tight text-white leading-none">
              {countryData.investmentSignal.score}
              <span className="text-sm font-semibold text-gray-500">/100</span>
            </p>
          </div>
          <div className="text-right">
            <span
              className={`inline-block px-3 py-1 rounded-xl text-xs font-bold border tracking-wide shadow-sm ${getRiskBadgeClass(
                countryData.investmentSignal.score
              )}`}
            >
              {countryData.investmentSignal.label}
            </span>
            <p className="text-[10px] text-gray-500 mt-1">Prototype Composite</p>
          </div>
        </div>
      </div>

      {/* ==================================================
          SECTION C: BRIEF ME (Collapsible Card)
          ================================================== */}
      <div
        id="brief-me-card"
        className="rounded-2xl overflow-hidden transition-all duration-300"
        style={{
          background: "rgba(17, 24, 39, 0.75)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <button
          type="button"
          id="brief-me-toggle-btn"
          onClick={() => setBriefOpen((prev) => !prev)}
          className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-white/[0.03] transition-colors"
          aria-expanded={briefOpen}
        >
          <div className="flex items-center gap-2.5">
            <span
              className={`text-xs text-emerald-400 font-bold inline-block transition-transform duration-300 ${
                briefOpen ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Brief Me
            </span>
          </div>
          <span className="text-[10px] font-mono text-gray-400 bg-white/5 px-2 py-0.5 rounded">
            Text summary
          </span>
        </button>

        {briefOpen && (
          <div
            id="brief-me-content"
            className="px-4 pb-4 pt-1 space-y-1.5 border-t border-white/5 animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <h3 className="text-xs font-bold uppercase tracking-wide text-white">
              {countryData.economicUpdate.title}
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed text-justify">
              {countryData.economicUpdate.summary}
            </p>
          </div>
        )}
      </div>

      {/* ==================================================
          SECTION D: GENERATE INVESTMENT REPORT CARD
          ================================================== */}
      <div
        id="generate-report-card"
        onClick={() => setReportOpen(true)}
        className="rounded-2xl p-4 transition-all duration-200 cursor-pointer hover:scale-[1.01] hover:border-amber-400/50 group"
        style={{
          background:
            "linear-gradient(135deg, rgba(30, 24, 15, 0.7) 0%, rgba(17, 24, 39, 0.85) 100%)",
          border: "1px solid rgba(245, 158, 11, 0.35)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3), 0 0 15px rgba(245, 158, 11, 0.08)",
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
              style={{
                background: "rgba(245, 158, 11, 0.15)",
                border: "1px solid rgba(245, 158, 11, 0.3)",
              }}
            >
              📄
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-amber-300 group-hover:text-amber-200 transition-colors truncate">
                Generate Investment Report
              </h3>
              <p className="text-xs text-gray-400 mt-0.5 truncate">
                Macroeconomic • Market • Investment Intelligence
              </p>
            </div>
          </div>

          <div className="flex-shrink-0 flex items-center gap-2">
            <span
              className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider"
              style={{
                background: "rgba(245, 158, 11, 0.15)",
                color: "#fbbf24",
                border: "1px solid rgba(245, 158, 11, 0.3)",
              }}
            >
              PDF
            </span>
            <span className="text-amber-400 text-sm group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </div>
        </div>
      </div>

      {/* ==================================================
          SECTION E: COMPARE WITH ANOTHER COUNTRY
          ================================================== */}
      <div className="relative">
        <select
          id="compare-country-select"
          value={compareSelected}
          onChange={(e) => {
            setCompareSelected(e.target.value);
            if (e.target.value) {
              setToastMessage(`Comparison with ${e.target.value} is a prototype control.`);
              setTimeout(() => setToastMessage(null), 4000);
            }
          }}
          className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-gray-300 bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer appearance-none outline-none focus:border-emerald-500/50"
        >
          <option value="" className="bg-gray-900 text-gray-400">
            ⇄ Compare with Another Country
          </option>
          <option value="United States" className="bg-gray-900 text-white">
            vs United States (USA)
          </option>
          <option value="China" className="bg-gray-900 text-white">
            vs China (CHN)
          </option>
          <option value="Germany" className="bg-gray-900 text-white">
            vs Germany (DEU)
          </option>
          <option value="Japan" className="bg-gray-900 text-white">
            vs Japan (JPN)
          </option>
          <option value="United Kingdom" className="bg-gray-900 text-white">
            vs United Kingdom (GBR)
          </option>
          <option value="Singapore" className="bg-gray-900 text-white">
            vs Singapore (SGP)
          </option>
          <option value="UAE" className="bg-gray-900 text-white">
            vs UAE (ARE)
          </option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-400">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* ==================================================
          SECTION F: ECONOMIC METRIC CARDS (7 cards)
          ================================================== */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            CORE ECONOMIC INDICATORS
          </span>
          <span className="text-[9px] font-mono text-gray-500">PROTOTYPE • 2025</span>
        </div>

        {/* 2 Featured Headline Cards: Population & GDP */}
        <div className="grid grid-cols-2 gap-2">
          {/* 1. Population */}
          <div
            className="rounded-xl p-3"
            style={{
              background: "rgba(17, 24, 39, 0.75)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs">👥</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Population
                </span>
              </div>
              <span className="text-[8px] font-mono text-amber-400/90 bg-amber-400/10 px-1 py-0.5 rounded">
                Prototype • 2025
              </span>
            </div>
            <p className="text-lg font-extrabold text-white tracking-tight">
              {countryData.metrics.population.displayValue}
            </p>
            <p className="text-[10px] text-gray-500 mt-0.5">
              {countryData.metrics.population.unit}
            </p>
          </div>

          {/* 2. GDP */}
          <div
            className="rounded-xl p-3"
            style={{
              background:
                "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(17, 24, 39, 0.75) 100%)",
              border: "1px solid rgba(16, 185, 129, 0.25)",
            }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs">🌐</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  GDP
                </span>
              </div>
              <span className="text-[8px] font-mono text-amber-400/90 bg-amber-400/10 px-1 py-0.5 rounded">
                Prototype • 2025
              </span>
            </div>
            <p className="text-lg font-extrabold text-emerald-300 tracking-tight">
              {countryData.metrics.gdp.displayValue}
            </p>
            <p className="text-[10px] text-gray-500 mt-0.5">{countryData.metrics.gdp.unit}</p>
          </div>
        </div>

        {/* 5 Indicator Cards Grid: Roomy 5-column layout on medium+ screens */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {/* 3. GDP / Capita */}
          <div
            className="rounded-xl p-3"
            style={{
              background: "rgba(17, 24, 39, 0.7)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
            }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-xs">👤</span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                GDP / CAPITA
              </span>
            </div>
            <p className="text-base font-bold text-white tracking-tight">
              {countryData.metrics.gdpPerCapita.displayValue}
            </p>
            <p className="text-[9px] text-gray-500 mt-0.5">Annual / person</p>
          </div>

          {/* 4. GDP Growth */}
          <div
            className="rounded-xl p-3"
            style={{
              background: "rgba(17, 24, 39, 0.7)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
            }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-xs">📈</span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                GDP GROWTH
              </span>
            </div>
            <p
              className={`text-base font-bold tracking-tight ${
                countryData.metrics.gdpGrowth.value >= 0 ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {countryData.metrics.gdpGrowth.displayValue}
            </p>
            <p className="text-[9px] text-gray-500 mt-0.5">Real expansion</p>
          </div>

          {/* 5. Inflation */}
          <div
            className="rounded-xl p-3"
            style={{
              background: "rgba(17, 24, 39, 0.7)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
            }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-xs">💹</span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                INFLATION (CPI)
              </span>
            </div>
            <p
              className={`text-base font-bold tracking-tight ${
                countryData.metrics.inflation.value > 4.5 ? "text-amber-400" : "text-white"
              }`}
            >
              {countryData.metrics.inflation.displayValue}
            </p>
            <p className="text-[9px] text-gray-500 mt-0.5">Annual CPI</p>
          </div>

          {/* 6. Unemployment */}
          <div
            className="rounded-xl p-3"
            style={{
              background: "rgba(17, 24, 39, 0.7)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
            }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-xs">👷</span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                UNEMPLOYMENT
              </span>
            </div>
            <p
              className={`text-base font-bold tracking-tight ${
                countryData.metrics.unemployment.value > 7 ? "text-rose-400" : "text-white"
              }`}
            >
              {countryData.metrics.unemployment.displayValue}
            </p>
            <p className="text-[9px] text-gray-500 mt-0.5">Labour force</p>
          </div>

          {/* 7. Life Expectancy */}
          <div
            className="rounded-xl p-3 col-span-2 sm:col-span-1"
            style={{
              background: "rgba(17, 24, 39, 0.7)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
            }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-xs">🩺</span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                LIFE EXPECTANCY
              </span>
            </div>
            <p className="text-base font-bold text-sky-300 tracking-tight">
              {countryData.metrics.lifeExpectancy.displayValue}
            </p>
            <p className="text-[9px] text-gray-500 mt-0.5">Demographic health</p>
          </div>
        </div>

        {/* Explore 10-Yr History link if available */}
        {onSwitchToHistory && (
          <button
            type="button"
            onClick={onSwitchToHistory}
            className="w-full py-2 px-3 rounded-xl flex items-center justify-between text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/20 transition-all cursor-pointer"
          >
            <span>📈 View 10-Year Verified World Bank History</span>
            <span>→</span>
          </button>
        )}
      </div>

      {/* ==================================================
          SECTION G: RISK SCORE & SECTION H: INNOVATION INDEX
          Side-by-side on sm+ screens for optimal horizontal space
          ================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* SECTION G: RISK SCORE */}
        <div
          className="rounded-2xl p-4 flex flex-col justify-between"
          style={{
            background: "rgba(17, 24, 39, 0.7)",
            border: "1px solid rgba(255, 255, 255, 0.07)",
          }}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  RISK SCORE
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-black text-white">
                    {countryData.riskScore.score}
                    <span className="text-xs text-gray-500">/100</span>
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-md border ${getRiskBadgeClass(
                      countryData.riskScore.score
                    )}`}
                  >
                    {countryData.riskScore.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden mb-2.5">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(Math.max(countryData.riskScore.score, 5), 100)}%`,
                  background: getRiskProgressBarColor(countryData.riskScore.score),
                  boxShadow: "0 0 10px rgba(245, 158, 11, 0.4)",
                }}
              />
            </div>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            {countryData.riskScore.description}
          </p>
        </div>

        {/* SECTION H: INNOVATION INDEX */}
        <div
          className="rounded-2xl p-4 flex flex-col justify-between"
          style={{
            background: "rgba(17, 24, 39, 0.7)",
            border: "1px solid rgba(255, 255, 255, 0.07)",
          }}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                  INNOVATION INDEX
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-black text-white">
                    {countryData.innovationIndex.score}
                    <span className="text-xs text-gray-500">/100</span>
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    Composite Rank
                  </span>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden mb-2.5">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(Math.max(countryData.innovationIndex.score, 5), 100)}%`,
                  background: "linear-gradient(90deg, #06b6d4 0%, #3b82f6 100%)",
                  boxShadow: "0 0 10px rgba(6, 182, 212, 0.4)",
                }}
              />
            </div>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            {countryData.innovationIndex.description}
          </p>
        </div>
      </div>

      {/* ==================================================
          SECTION I: WHO SHOULD CARE?
          ================================================== */}
      <div
        className="rounded-2xl p-4"
        style={{
          background: "rgba(17, 24, 39, 0.7)",
          border: "1px solid rgba(255, 255, 255, 0.07)",
        }}
      >
        <div className="mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">🎯</span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              WHO SHOULD CARE?
            </h3>
          </div>
          <p className="text-[10px] text-gray-400 mt-0.5">Derived from prototype economic metrics</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {countryData.whoShouldCare.map((item, index) => (
            <div
              key={index}
              className={`p-3 rounded-xl transition-colors hover:bg-white/[0.04] ${
                index === 4 ? "sm:col-span-2" : ""
              }`}
              style={{
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              <div className="flex items-start gap-2.5">
                <span className="text-base flex-shrink-0 mt-0.5">{item.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2 mb-0.5">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-white leading-tight mb-1">
                    {item.headline}
                  </p>
                  <p className="text-[11px] text-gray-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ==================================================
          SECTION J: INVESTMENT INTELLIGENCE
          ================================================== */}
      <div
        className="rounded-2xl p-4"
        style={{
          background: "rgba(17, 24, 39, 0.7)",
          border: "1px solid rgba(255, 255, 255, 0.07)",
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">💡</span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              INVESTMENT INTELLIGENCE
            </h3>
          </div>
          <span className="text-[9px] font-mono text-gray-500">Automated Signal</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {countryData.investmentIntelligence.map((item, idx) => {
            const isPositive = item.status === "positive";
            const isNegative = item.status === "negative";
            const statusColor = isPositive
              ? "text-emerald-400"
              : isNegative
              ? "text-rose-400"
              : "text-amber-400";
            const statusBg = isPositive
              ? "rgba(16, 185, 129, 0.08)"
              : isNegative
              ? "rgba(244, 63, 94, 0.08)"
              : "rgba(245, 158, 11, 0.08)";
            const statusBorder = isPositive
              ? "rgba(16, 185, 129, 0.25)"
              : isNegative
              ? "rgba(244, 63, 94, 0.25)"
              : "rgba(245, 158, 11, 0.25)";
            const statusIcon = isPositive ? "▲" : isNegative ? "▼" : "●";

            return (
              <div
                key={idx}
                className="p-3 rounded-xl transition-all"
                style={{
                  background: statusBg,
                  border: `1px solid ${statusBorder}`,
                }}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-bold ${statusColor}`}>{statusIcon}</span>
                    <span className="text-xs font-bold text-white tracking-wide truncate">{item.title}</span>
                  </div>
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded flex-shrink-0 ${statusColor}`}
                    style={{ background: "rgba(0,0,0,0.3)" }}
                  >
                    {item.value}
                  </span>
                </div>
                <p className="text-[11px] text-gray-300 leading-relaxed pl-4">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ==================================================
          INVESTMENT REPORT FULL MODAL VIEW
          ================================================== */}
      {reportOpen && (
        <InvestmentReportModal
          countryData={countryData}
          onClose={() => setReportOpen(false)}
        />
      )}
    </div>
  );
};
