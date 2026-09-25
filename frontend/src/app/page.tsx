import type { Metadata } from "next";
import { GlobeContainer } from "@/components/globe/GlobeContainer";

export const metadata: Metadata = {
  title: "Ecosphere — Economic Intelligence Platform",
  description:
    "Interactive 3D world globe with real-time economic data. Select a country to view GDP, inflation, unemployment, FDI, and more from World Bank Open Data.",
};

/**
 * Ecosphere Home Page — Step 2: 3D Globe & Country Selection
 *
 * Renders an interactive Three.js 3D world globe with real country boundaries,
 * country search, hover inspection, click-to-select, and persistent selection state.
 */
export default function HomePage() {
  return <GlobeContainer />;
}
