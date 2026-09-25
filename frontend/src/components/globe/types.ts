/**
 * Ecosphere Globe Component Types
 */

import type {
  Country,
  CountryCoordinates,
  GeoJsonCountryFeature,
  CountryGeoJsonCollection,
} from "@/types/country";

export type { Country, CountryCoordinates, GeoJsonCountryFeature, CountryGeoJsonCollection };

export interface WorldGlobeProps {
  countriesData: CountryGeoJsonCollection | null;
  selectedCountry: Country | null;
  hoveredCountry: Country | null;
  onSelectCountry: (country: Country) => void;
  onHoverCountry: (country: Country | null) => void;
  autoRotate?: boolean;
}

export interface CountrySearchProps {
  countries: Country[];
  selectedCountry: Country | null;
  onSelectCountry: (country: Country) => void;
}

export interface SelectedCountryProps {
  selectedCountry: Country | null;
  onClearSelection: () => void;
}

export interface GlobeControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
}
