/**
 * Ecosphere Country Data & Utilities
 * Handles loading, normalization, centroid calculation, and search.
 */

import type {
  Country,
  CountryCoordinates,
  GeoJsonCountryFeature,
  CountryGeoJsonCollection,
} from "@/types/country";

/**
 * Natural Earth 110m specific overrides for edge-case territories
 * where ISO_A3 or ISO_A2 was encoded as -99 in the raw dataset.
 */
const KNOWN_CODE_OVERRIDES: Record<string, { iso3: string; iso2: string; displayName?: string }> = {
  France: { iso3: "FRA", iso2: "FR" },
  Norway: { iso3: "NOR", iso2: "NO" },
  Kosovo: { iso3: "XKX", iso2: "XK" },
  "Northern Cyprus": { iso3: "CYN", iso2: "CY" },
  Somaliland: { iso3: "SOM", iso2: "SO" },
  "United States of America": { iso3: "USA", iso2: "US", displayName: "United States" },
};

/**
 * Common search aliases to map abbreviations/short names to countries.
 */
const COUNTRY_SEARCH_ALIASES: Record<string, string[]> = {
  USA: ["United States", "USA", "America", "US"],
  GBR: ["United Kingdom", "UK", "Britain", "Great Britain"],
  ARE: ["UAE", "United Arab Emirates", "Emirates"],
  RUS: ["Russia", "Russian Federation"],
  KOR: ["South Korea", "Korea"],
  PRK: ["North Korea"],
  COD: ["DR Congo", "Congo DR"],
};

/**
 * Computes the centroid coordinates (lat, lng) of the largest polygon ring
 * (focusing on the continental mainland for multi-polygon nations like US, FR, JP, AU).
 */
export function calculateFeatureCentroid(
  feature: GeoJsonCountryFeature
): CountryCoordinates | undefined {
  const geom = feature.geometry;
  if (!geom || !geom.coordinates) return undefined;

  let bestRing: number[][] | null = null;

  if (geom.type === "Polygon") {
    const coords = geom.coordinates as number[][][];
    if (coords && coords.length > 0 && Array.isArray(coords[0])) {
      bestRing = coords[0];
    }
  } else if (geom.type === "MultiPolygon") {
    const coords = geom.coordinates as number[][][][];
    if (coords && coords.length > 0) {
      let maxPoints = 0;
      for (const poly of coords) {
        if (poly && poly.length > 0 && Array.isArray(poly[0])) {
          const ring = poly[0];
          if (ring.length > maxPoints) {
            maxPoints = ring.length;
            bestRing = ring;
          }
        }
      }
    }
  }

  if (!bestRing || bestRing.length === 0) return undefined;

  let sumLat = 0;
  let sumLng = 0;
  let count = 0;

  for (const pt of bestRing) {
    if (Array.isArray(pt) && pt.length >= 2) {
      sumLng += pt[0];
      sumLat += pt[1];
      count++;
    }
  }

  if (count === 0) return undefined;

  return {
    latitude: +(sumLat / count).toFixed(4),
    longitude: +(sumLng / count).toFixed(4),
  };
}

/**
 * Normalizes raw GeoJSON properties into a clean Country object.
 */
export function extractCountryFromFeature(
  feature: GeoJsonCountryFeature
): Country {
  const props = feature.properties || {};
  const rawName = (props.ADMIN || props.NAME || props.NAME_LONG || "Unknown").trim();

  const override = KNOWN_CODE_OVERRIDES[rawName];

  // Derive ISO-3 code (prefer override -> ISO_A3 -> ADM0_A3 -> SOV_A3)
  let iso3 = override?.iso3;
  if (!iso3) {
    if (props.ISO_A3 && props.ISO_A3 !== "-99") {
      iso3 = String(props.ISO_A3).trim().toUpperCase();
    } else if (props.ADM0_A3 && props.ADM0_A3 !== "-99") {
      iso3 = String(props.ADM0_A3).trim().toUpperCase();
    } else if (props.SOV_A3 && props.SOV_A3 !== "-99") {
      iso3 = String(props.SOV_A3).trim().toUpperCase();
    } else {
      iso3 = "UNK";
    }
  }

  // Derive ISO-2 code
  let iso2 = override?.iso2;
  if (!iso2) {
    if (props.ISO_A2 && props.ISO_A2 !== "-99") {
      iso2 = String(props.ISO_A2).trim().toUpperCase();
    } else if (props.WB_A2 && props.WB_A2 !== "-99") {
      iso2 = String(props.WB_A2).trim().toUpperCase();
    } else {
      iso2 = "";
    }
  }

  const name = override?.displayName || (rawName === "United States of America" ? "United States" : rawName);
  const coordinates = calculateFeatureCentroid(feature);

  return {
    name,
    iso2,
    iso3,
    coordinates,
  };
}

/**
 * In-memory cache for parsed GeoJSON collection and country list.
 */
let cachedCollection: CountryGeoJsonCollection | null = null;
let cachedCountriesList: Country[] | null = null;

/**
 * Fetches and processes the country GeoJSON dataset.
 * Attaches normalized `__country` directly to each feature for O(1) hover & click lookups.
 */
export async function loadCountryDataset(): Promise<{
  collection: CountryGeoJsonCollection;
  countries: Country[];
}> {
  if (cachedCollection && cachedCountriesList) {
    return {
      collection: cachedCollection,
      countries: cachedCountriesList,
    };
  }

  const response = await fetch("/data/countries.geojson", {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load countries GeoJSON: HTTP ${response.status}`);
  }

  const rawData = (await response.json()) as CountryGeoJsonCollection;

  if (!rawData || !Array.isArray(rawData.features)) {
    throw new Error("Invalid GeoJSON dataset format");
  }

  const countryMap = new Map<string, Country>();

  // Attach normalized Country object to each feature
  for (const feature of rawData.features) {
    const country = extractCountryFromFeature(feature);
    feature.__country = country;

    // Index by iso3 (or fallback name) to eliminate duplicates
    const key = country.iso3 !== "UNK" ? country.iso3 : country.name;
    if (!countryMap.has(key)) {
      countryMap.set(key, country);
    }
  }

  // Alphabetically sort countries for search & dropdowns
  const countries = Array.from(countryMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  cachedCollection = rawData;
  cachedCountriesList = countries;

  return {
    collection: cachedCollection,
    countries: cachedCountriesList,
  };
}

/**
 * Filters the country list based on search term with relevance ranking.
 * Matches on name, ISO-3 code, ISO-2 code, and common aliases.
 */
export function searchCountries(
  query: string,
  countries: Country[],
  limit = 10
): Country[] {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return [];

  const exactMatches: Country[] = [];
  const startsWithMatches: Country[] = [];
  const containsMatches: Country[] = [];

  for (const country of countries) {
    const lowerName = country.name.toLowerCase();
    const lowerIso3 = country.iso3.toLowerCase();
    const lowerIso2 = country.iso2.toLowerCase();

    // Check aliases
    const aliases = COUNTRY_SEARCH_ALIASES[country.iso3] || [];
    const aliasMatches = aliases.some((a) => a.toLowerCase().includes(cleanQuery));

    // 1. Exact match on ISO or Name
    if (lowerIso3 === cleanQuery || lowerIso2 === cleanQuery || lowerName === cleanQuery) {
      exactMatches.push(country);
    }
    // 2. Starts with query
    else if (
      lowerName.startsWith(cleanQuery) ||
      lowerIso3.startsWith(cleanQuery) ||
      aliases.some((a) => a.toLowerCase().startsWith(cleanQuery))
    ) {
      startsWithMatches.push(country);
    }
    // 3. Substring match
    else if (lowerName.includes(cleanQuery) || aliasMatches) {
      containsMatches.push(country);
    }
  }

  const results = [...exactMatches, ...startsWithMatches, ...containsMatches];
  return results.slice(0, limit);
}
