/**
 * Ecosphere Frontend — Economic Data Types
 *
 * TypeScript interfaces mirroring the backend Pydantic schemas.
 * These are consumed by the economic data API client and display components.
 */

export interface EconomicIndicator {
  value: number | null;
  year: number | null;
  unit: string;
  source: string;
  source_url: string;
}

export interface EconomicIndicators {
  gdp: EconomicIndicator;
  gdp_growth: EconomicIndicator;
  gdp_per_capita: EconomicIndicator;
  inflation: EconomicIndicator;
  unemployment: EconomicIndicator;
  population: EconomicIndicator;
  fdi: EconomicIndicator;
}

export interface EconomicData {
  country_name: string;
  iso3: string;
  last_updated: string;
  indicators: EconomicIndicators;
  missing_indicators: string[];
  data_errors: string[];
}

export type EconomicLoadState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: EconomicData }
  | { status: "error"; message: string };
