/**
 * Ecosphere — Country Data Models & Types
 * Step 2: 3D Globe + Country Selection
 */

export interface CountryCoordinates {
  latitude: number;
  longitude: number;
}

export interface Country {
  name: string;
  iso2: string;
  iso3: string;
  region?: string;
  coordinates?: CountryCoordinates;
}

export interface RawGeoJsonProperties {
  ADMIN?: string;
  NAME?: string;
  NAME_LONG?: string;
  SOVEREIGNT?: string;
  ISO_A2?: string;
  ISO_A3?: string;
  ISO_A3_EH?: string;
  ADM0_A3?: string;
  SOV_A3?: string;
  GU_A3?: string;
  [key: string]: unknown;
}

export interface GeoJsonCountryFeature {
  type: "Feature";
  properties: RawGeoJsonProperties;
  geometry: {
    type: "Polygon" | "MultiPolygon" | string;
    coordinates: number[][][] | number[][][][];
  };
  // Parsed country attached for fast runtime access
  __country?: Country;
}

export interface CountryGeoJsonCollection {
  type: "FeatureCollection";
  features: GeoJsonCountryFeature[];
}

export type CountryVisualState = "NORMAL" | "HOVERED" | "SELECTED";
