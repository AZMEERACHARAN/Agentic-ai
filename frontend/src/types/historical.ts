/**
 * Ecosphere Frontend — Historical Economic Data Types
 *
 * TypeScript interfaces mirroring the backend HistoricalEconomicData schemas.
 */

export interface HistoricalIndicatorPoint {
  year: number;
  value: number | null;
  unit: string;
  source: string;
  source_url?: string;
}

export interface HistoricalIndicator {
  indicator: string;
  label: string;
  unit: string;
  points: HistoricalIndicatorPoint[];
}

export interface HistoricalEconomicData {
  country_name: string;
  iso3: string;
  indicators: {
    gdp: HistoricalIndicator;
    gdp_growth: HistoricalIndicator;
    gdp_per_capita: HistoricalIndicator;
    inflation: HistoricalIndicator;
    unemployment: HistoricalIndicator;
    population: HistoricalIndicator;
    fdi: HistoricalIndicator;
    [key: string]: HistoricalIndicator;
  };
  source: string;
  retrieved_at: string;
  data_source?: string;
}

export type HistoricalLoadState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: HistoricalEconomicData }
  | { status: "error"; message: string };
