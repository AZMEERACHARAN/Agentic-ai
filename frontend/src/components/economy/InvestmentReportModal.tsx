"use client";

import React, { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import type { MockCountryData } from "@/data/mockCountryData";
import {
  generateExecutiveSummary,
  generateEconomicStrengths,
  generateEconomicRisks,
  generateTradeAnalysis,
  generateOpportunities,
  generateKeySectors,
  generateGrowthOutlook,
  generateMarketOutlook,
} from "@/lib/reportGenerator";

interface InvestmentReportModalProps {
  countryData: MockCountryData;
  onClose: () => void;
}

const emptySubscribe = () => () => {};

export const InvestmentReportModal: React.FC<InvestmentReportModalProps> = ({
  countryData,
  onClose,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Prevent body scrolling while modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handlePdfClick = () => {
    setToastMessage("PDF export will be connected in a later implementation phase.");
    setTimeout(() => setToastMessage(null), 4000);
  };

  const executiveSummary = generateExecutiveSummary(countryData);
  const strengths = generateEconomicStrengths(countryData);
  const risks = generateEconomicRisks(countryData);
  const trade = generateTradeAnalysis(countryData);
  const opportunities = generateOpportunities(countryData);
  const sectors = generateKeySectors(countryData);
  const growthOutlook = generateGrowthOutlook(countryData);
  const marketOutlook = generateMarketOutlook(countryData);

  if (!isClient) return null;

  return createPortal(
    <div
      id="investment-report-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      {/* Toast Notice */}
      {toastMessage && (
        <div
          id="report-pdf-toast"
          className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-semibold shadow-2xl animate-in fade-in slide-in-from-top-4"
          style={{
            background: "rgba(17, 24, 39, 0.95)",
            border: "1px solid rgba(245, 158, 11, 0.5)",
            color: "#fbbf24",
            boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
          }}
        >
          <span>ℹ️</span>
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Modal Container */}
      <div
        id="investment-report-modal-content"
        className="w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl flex flex-col text-gray-100 shadow-2xl animate-in zoom-in-95 duration-200"
        style={{
          background: "linear-gradient(180deg, rgba(13, 17, 23, 0.98) 0%, rgba(10, 14, 20, 0.98) 100%)",
          border: "1px solid rgba(245, 158, 11, 0.3)",
          boxShadow: "0 0 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(245, 158, 11, 0.12)",
        }}
      >
        {/* ==================================================
            7. REPORT HEADER
            ================================================== */}
        <div
          className="sticky top-0 z-20 px-6 py-4 flex items-center justify-between border-b"
          style={{
            background: "rgba(13, 17, 23, 0.96)",
            borderColor: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="flex items-center gap-3">
            <span
              className="px-2.5 py-1 rounded-md text-sm font-mono font-bold"
              style={{
                background: "rgba(59, 130, 246, 0.15)",
                color: "#60a5fa",
                border: "1px solid rgba(59, 130, 246, 0.3)",
              }}
            >
              {countryData.country.iso2}
            </span>
            <div>
              <div className="flex items-baseline gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {countryData.country.name}
                </h1>
                <span className="text-xs font-mono text-gray-400">
                  {countryData.country.iso3}
                </span>
              </div>
              <p className="text-xs text-amber-400/90 font-medium mt-0.5">
                Investment Research Report • <span className="text-gray-400">Prototype Economic Dataset • 2025</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* PDF export button */}
            <button
              type="button"
              id="report-pdf-btn"
              onClick={handlePdfClick}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer hover:scale-105"
              style={{
                background: "rgba(245, 158, 11, 0.15)",
                border: "1px solid rgba(245, 158, 11, 0.35)",
                color: "#fbbf24",
              }}
            >
              <span>📄</span>
              <span>Export PDF</span>
            </button>

            {/* Close / Collapse button */}
            <button
              type="button"
              id="collapse-report-header-btn"
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-200 bg-white/10 hover:bg-white/20 border border-white/10 transition-all cursor-pointer"
            >
              <span>✕</span>
              <span>Collapse</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* ==================================================
              8. EXECUTIVE SUMMARY
              ================================================== */}
          <section
            className="p-5 rounded-xl"
            style={{
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.07)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-4 rounded-full bg-amber-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                EXECUTIVE SUMMARY
              </h2>
            </div>
            <p className="text-sm text-gray-200 leading-relaxed text-justify">
              {executiveSummary}
            </p>
          </section>

          {/* ==================================================
              9 & 10. ECONOMIC STRENGTHS & ECONOMIC RISKS
              ================================================== */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strengths */}
            <div
              className="p-5 rounded-xl space-y-3"
              style={{
                background: "rgba(16, 185, 129, 0.04)",
                border: "1px solid rgba(16, 185, 129, 0.2)",
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">▲</span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  ECONOMIC STRENGTHS
                </h3>
              </div>
              <ul className="space-y-3">
                {strengths.map((item, idx) => (
                  <li key={idx} className="space-y-0.5">
                    <p className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span className="text-emerald-400">•</span>
                      <span>{item.title}</span>
                    </p>
                    <p className="text-xs text-gray-300 pl-3 leading-relaxed">
                      {item.description}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Risks */}
            <div
              className="p-5 rounded-xl space-y-3"
              style={{
                background: "rgba(244, 63, 94, 0.04)",
                border: "1px solid rgba(244, 63, 94, 0.2)",
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-rose-400">▼</span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400">
                  ECONOMIC RISKS
                </h3>
              </div>
              <ul className="space-y-3">
                {risks.map((item, idx) => (
                  <li key={idx} className="space-y-0.5">
                    <p className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span className="text-rose-400">•</span>
                      <span>{item.title}</span>
                    </p>
                    <p className="text-xs text-gray-300 pl-3 leading-relaxed">
                      {item.description}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* ==================================================
              11. TRADE ANALYSIS
              ================================================== */}
          <section
            className="p-5 rounded-xl space-y-3"
            style={{
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.07)",
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 rounded-full bg-cyan-400" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  TRADE ANALYSIS
                </h2>
              </div>
              <span className="text-[10px] font-mono text-gray-500 bg-white/5 px-2 py-0.5 rounded">
                Prototype Trade Data
              </span>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed text-justify">
              {trade.narrative}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Exports
                </span>
                <p className="text-base font-bold text-emerald-400 mt-0.5">
                  {trade.exports}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Imports
                </span>
                <p className="text-base font-bold text-sky-400 mt-0.5">
                  {trade.imports}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Trade Balance
                </span>
                <p className="text-base font-bold text-amber-400 mt-0.5">
                  {trade.tradeBalance}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Top Trade Partner
                </span>
                <p className="text-xs font-bold text-white mt-1 truncate">
                  {trade.topPartner}
                </p>
              </div>
            </div>
          </section>

          {/* ==================================================
              12. TOP OPPORTUNITIES
              ================================================== */}
          <section
            className="p-5 rounded-xl space-y-3"
            style={{
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.07)",
            }}
          >
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-emerald-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                TOP OPPORTUNITIES
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {opportunities.map((opp) => (
                <div
                  key={opp.id}
                  className="p-4 rounded-xl space-y-1.5"
                  style={{
                    background: "rgba(16, 185, 129, 0.05)",
                    border: "1px solid rgba(16, 185, 129, 0.2)",
                  }}
                >
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black flex items-center justify-center">
                    {opp.id}
                  </span>
                  <h4 className="text-xs font-bold text-white pt-1">
                    {opp.title}
                  </h4>
                  <p className="text-[11px] text-gray-300 leading-relaxed">
                    {opp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ==================================================
              13. KEY SECTORS
              ================================================== */}
          <section
            className="p-5 rounded-xl space-y-3"
            style={{
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.07)",
            }}
          >
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-amber-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                KEY SECTORS
              </h2>
            </div>

            <div className="space-y-2">
              {sectors.map((sec, idx) => {
                const isPos = sec.status === "positive";
                const isNeg = sec.status === "negative";
                const badgeColor = isPos
                  ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
                  : isNeg
                  ? "text-rose-400 bg-rose-500/10 border-rose-500/30"
                  : "text-amber-400 bg-amber-500/10 border-amber-500/30";
                const dotColor = isPos
                  ? "#34d399"
                  : isNeg
                  ? "#f87171"
                  : "#fbbf24";

                return (
                  <div
                    key={idx}
                    className="p-3 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    style={{
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                    }}
                  >
                    <div className="flex items-start sm:items-center gap-2.5 min-w-0">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5 sm:mt-0"
                        style={{ background: dotColor }}
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-white block sm:inline">
                          {sec.name}
                        </span>
                        <p className="text-[11px] text-gray-400 sm:mt-0.5">
                          {sec.description}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border self-start sm:self-center flex-shrink-0 ${badgeColor}`}
                    >
                      {sec.status.toUpperCase()}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ==================================================
              14. GROWTH OUTLOOK • 12–18 MONTHS
              ================================================== */}
          <section
            className="p-5 rounded-xl space-y-2"
            style={{
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.07)",
            }}
          >
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-sky-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-sky-400">
                GROWTH OUTLOOK • 12–18 MONTHS
              </h2>
            </div>
            <p className="text-xs text-gray-200 leading-relaxed text-justify">
              {growthOutlook}
            </p>
          </section>

          {/* ==================================================
              15. MARKET OUTLOOK
              ================================================== */}
          <section
            className="p-5 rounded-xl space-y-2.5"
            style={{
              background: "linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(17, 24, 39, 0.6) 100%)",
              border: "1px solid rgba(245, 158, 11, 0.3)",
            }}
          >
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                MARKET OUTLOOK
              </h2>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {marketOutlook.badge}
              </span>
            </div>
            <p className="text-xs text-gray-200 leading-relaxed text-justify">
              {marketOutlook.narrative}
            </p>
          </section>

          {/* ==================================================
              16. DATA PROVENANCE
              ================================================== */}
          <section
            className="p-4 rounded-xl text-center space-y-1"
            style={{
              background: "rgba(255, 255, 255, 0.015)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
            }}
          >
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
              DATA PROVENANCE
            </h3>
            <p className="text-[10px] text-gray-500 leading-relaxed max-w-xl mx-auto">
              Prototype economic intelligence generated from mock country data for demonstration purposes.
              The values shown in this prototype are not live market or investment data.
            </p>
          </section>

          {/* Collapse Footer Action */}
          <div className="pt-2 pb-2 flex justify-center border-t border-white/10">
            <button
              type="button"
              id="collapse-report-bottom-btn"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 transition-all cursor-pointer flex items-center gap-2 shadow-lg hover:scale-105"
            >
              <span>▲</span>
              <span>Collapse Report & Return to Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
