/**
 * Ecosphere Frontend — Economy API Client
 *
 * Communicates with the backend /api/economy/{iso3} endpoint.
 * The backend in turn delegates to the AI Service and World Bank.
 */

import type { EconomicData } from "@/types/economic";
import type { HistoricalEconomicData } from "@/types/historical";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";

/**
 * Fetch economic data for a country from the backend.
 *
 * @param iso3 - ISO 3166-1 alpha-3 country code (e.g. "IND")
 * @returns EconomicData on success
 * @throws Error with descriptive message on failure
 */
export async function fetchEconomicData(iso3: string): Promise<EconomicData> {
  const url = `${BACKEND_URL}/api/economy/${iso3.toUpperCase()}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    let detail = `HTTP ${response.status}`;
    try {
      const body = await response.json();
      detail = body?.detail ?? detail;
    } catch {
      // ignore JSON parse error for non-JSON error bodies
    }
    throw new Error(detail);
  }

  const data: EconomicData = await response.json();
  return data;
}

/**
 * Fetch 10-year historical economic time-series data for a country.
 *
 * @param iso3 - ISO 3166-1 alpha-3 country code (e.g. "IND")
 * @returns HistoricalEconomicData on success
 * @throws Error on failure
 */
export async function fetchHistoricalEconomicData(
  iso3: string
): Promise<HistoricalEconomicData> {
  const url = `${BACKEND_URL}/api/economy/${iso3.toUpperCase()}/historical`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    let detail = `HTTP ${response.status}`;
    try {
      const body = await response.json();
      detail = body?.detail ?? detail;
    } catch {
      // ignore
    }
    throw new Error(detail);
  }

  const data: HistoricalEconomicData = await response.json();
  return data;
}

