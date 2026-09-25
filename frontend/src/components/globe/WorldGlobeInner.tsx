"use client";

import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import Globe, { type GlobeMethods } from "react-globe.gl";
import * as THREE from "three";
import type { WorldGlobeProps, GeoJsonCountryFeature, Country } from "./types";
import { UniverseBackground } from "./UniverseBackground";

export interface WorldGlobeInnerHandle {
  zoomIn: () => void;
  zoomOut: () => void;
  resetView: () => void;
}

interface WorldGlobeInnerProps extends WorldGlobeProps {
  onHandleReady?: (handle: WorldGlobeInnerHandle) => void;
}

export const WorldGlobeInner: React.FC<WorldGlobeInnerProps> = ({
  countriesData,
  selectedCountry,
  hoveredCountry,
  onSelectCountry,
  onHoverCountry,
  autoRotate = false,
  onHandleReady,
}) => {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Dynamically track container size for responsive rendering
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setDimensions({
          width: clientWidth || window.innerWidth,
          height: clientHeight || window.innerHeight,
        });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("resize", updateSize);
      resizeObserver.disconnect();
    };
  }, []);

  // Configure OrbitControls and auto-rotation:
  // When none of the countries are selected, rotate the sphere slowly.
  // Pause rotation when a country is selected or hovered.
  useEffect(() => {
    if (!globeRef.current) return;
    const controls = globeRef.current.controls();
    if (controls) {
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.rotateSpeed = 0.8;
      controls.zoomSpeed = 1.0;
      controls.minDistance = 120;
      controls.maxDistance = 600;
      const shouldAutoRotate = !selectedCountry ? (autoRotate && !hoveredCountry) : false;
      controls.autoRotate = shouldAutoRotate;
      controls.autoRotateSpeed = 0.35; // Slow, majestic rotation
    }
  }, [autoRotate, hoveredCountry, selectedCountry]);

  // Continuous slow motion of the 3D celestial starfield in deep space
  useEffect(() => {
    let animId: number;
    const animateStarfield = () => {
      if (globeRef.current) {
        const scene = globeRef.current.scene();
        if (scene) {
          const starField = scene.getObjectByName("celestial-starfield");
          if (starField) {
            starField.rotation.y += 0.00012; // slow horizontal cosmic drift
            starField.rotation.x += 0.00004; // subtle celestial tilt
          }
        }
      }
      animId = requestAnimationFrame(animateStarfield);
    };
    animId = requestAnimationFrame(animateStarfield);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Initialize 3D celestial starfield in Three.js scene for genuine 3D perspective & rotation parallax
  const initCelestialStarfield = useCallback(() => {
    if (!globeRef.current) return;
    const scene = globeRef.current.scene();
    if (!scene) return;

    if (scene.getObjectByName("celestial-starfield")) return;

    const starCount = 2800;
    const starGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    const palette = [
      new THREE.Color("#ffffff"),
      new THREE.Color("#e0f2fe"),
      new THREE.Color("#bae6fd"),
      new THREE.Color("#fef08a"),
      new THREE.Color("#f5d0fe"),
      new THREE.Color("#a7f3d0"),
    ];

    for (let i = 0; i < starCount; i++) {
      // Celestial sphere shell well outside globe radius (100) and max distance (600)
      const r = 700 + Math.random() * 800;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Glowing circular star sprite texture
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, "rgba(255, 255, 255, 1)");
      grad.addColorStop(0.25, "rgba(255, 255, 255, 0.85)");
      grad.addColorStop(0.55, "rgba(255, 255, 255, 0.25)");
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 32, 32);
    }
    const texture = new THREE.CanvasTexture(canvas);

    const starMaterial = new THREE.PointsMaterial({
      size: 4.0,
      vertexColors: true,
      map: texture,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const starField = new THREE.Points(starGeometry, starMaterial);
    starField.name = "celestial-starfield";
    scene.add(starField);
  }, []);

  // Ensure starfield initializes whenever globe becomes available
  useEffect(() => {
    initCelestialStarfield();
  }, [initCelestialStarfield]);

  // Smooth camera focus when a country is selected
  useEffect(() => {
    if (!globeRef.current || !selectedCountry?.coordinates) return;

    const { latitude, longitude } = selectedCountry.coordinates;
    globeRef.current.pointOfView(
      {
        lat: latitude,
        lng: longitude,
        altitude: 1.6,
      },
      1400 // smooth transition duration in ms
    );
  }, [selectedCountry]);

  // Expose camera control actions to parent
  useEffect(() => {
    if (!onHandleReady) return;

    onHandleReady({
      zoomIn: () => {
        if (!globeRef.current) return;
        const currentPov = globeRef.current.pointOfView();
        globeRef.current.pointOfView(
          {
            altitude: Math.max(0.4, currentPov.altitude * 0.72),
          },
          400
        );
      },
      zoomOut: () => {
        if (!globeRef.current) return;
        const currentPov = globeRef.current.pointOfView();
        globeRef.current.pointOfView(
          {
            altitude: Math.min(3.8, currentPov.altitude * 1.35),
          },
          400
        );
      },
      resetView: () => {
        if (!globeRef.current) return;
        globeRef.current.pointOfView(
          {
            lat: 20,
            lng: 0,
            altitude: 2.2,
          },
          1000
        );
      },
    });
  }, [onHandleReady]);

  // Visual state styling resolvers
  const getCountryFromFeature = useCallback((feat: object): Country | null => {
    const f = feat as GeoJsonCountryFeature;
    return f.__country || null;
  }, []);

  const isFeatureSelected = useCallback(
    (feat: object): boolean => {
      if (!selectedCountry) return false;
      const c = getCountryFromFeature(feat);
      return Boolean(c && c.iso3 === selectedCountry.iso3);
    },
    [selectedCountry, getCountryFromFeature]
  );

  const isFeatureHovered = useCallback(
    (feat: object): boolean => {
      if (!hoveredCountry) return false;
      const c = getCountryFromFeature(feat);
      return Boolean(c && c.iso3 === hoveredCountry.iso3);
    },
    [hoveredCountry, getCountryFromFeature]
  );

  // Polygon colors based on state priority: SELECTED > HOVERED > NORMAL
  const getPolygonCapColor = useCallback(
    (feat: object) => {
      if (isFeatureSelected(feat)) {
        return "rgba(16, 185, 129, 0.85)"; // Luminous Emerald
      }
      if (isFeatureHovered(feat)) {
        return "rgba(56, 189, 248, 0.7)"; // Radiant Cyan
      }
      return "rgba(30, 41, 59, 0.7)"; // Subtle Slate
    },
    [isFeatureSelected, isFeatureHovered]
  );

  const getPolygonSideColor = useCallback(
    (feat: object) => {
      if (isFeatureSelected(feat)) {
        return "rgba(5, 150, 105, 0.6)";
      }
      if (isFeatureHovered(feat)) {
        return "rgba(14, 165, 233, 0.4)";
      }
      return "rgba(15, 23, 42, 0.3)";
    },
    [isFeatureSelected, isFeatureHovered]
  );

  const getPolygonStrokeColor = useCallback(
    (feat: object) => {
      if (isFeatureSelected(feat)) {
        return "#6ee7b7"; // Bright emerald border
      }
      if (isFeatureHovered(feat)) {
        return "#7dd3fc"; // Bright cyan border
      }
      return "rgba(148, 163, 184, 0.28)"; // Subtle boundary
    },
    [isFeatureSelected, isFeatureHovered]
  );

  const getPolygonAltitude = useCallback(
    (feat: object) => {
      if (isFeatureSelected(feat)) return 0.055;
      if (isFeatureHovered(feat)) return 0.03;
      return 0.008;
    },
    [isFeatureSelected, isFeatureHovered]
  );

  // Rich HTML tooltip for hover
  const getPolygonLabel = useCallback(
    (feat: object) => {
      const c = getCountryFromFeature(feat);
      if (!c) return "";

      const isSelected = selectedCountry?.iso3 === c.iso3;

      return `
        <div style="
          background: rgba(13, 17, 23, 0.94);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid ${isSelected ? "#10b981" : "rgba(255, 255, 255, 0.15)"};
          color: #f9fafb;
          padding: 8px 14px;
          border-radius: 10px;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 13px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
          pointer-events: none;
          display: flex;
          align-items: center;
          gap: 8px;
        ">
          <span style="font-size: 16px;">🌐</span>
          <div>
            <div style="font-weight: 600; color: ${isSelected ? "#34d399" : "#ffffff"};">
              ${c.name}
            </div>
            <div style="font-size: 11px; color: #9ca3af; font-family: monospace;">
              ISO: <strong style="color: #60a5fa;">${c.iso3}</strong> ${c.iso2 ? `· ${c.iso2}` : ""}
            </div>
          </div>
        </div>
      `;
    },
    [getCountryFromFeature, selectedCountry]
  );

  // Hover and click handlers
  const handlePolygonHover = useCallback(
    (feat: object | null) => {
      if (!feat) {
        onHoverCountry(null);
        return;
      }
      const c = getCountryFromFeature(feat);
      onHoverCountry(c);
    },
    [getCountryFromFeature, onHoverCountry]
  );

  const handlePolygonClick = useCallback(
    (feat: object) => {
      const c = getCountryFromFeature(feat);
      if (c) {
        onSelectCountry(c);
      }
    },
    [getCountryFromFeature, onSelectCountry]
  );

  const polygonsList = useMemo(() => {
    return countriesData?.features || [];
  }, [countriesData]);

  return (
    <div
      ref={containerRef}
      id="globe-canvas-wrapper"
      className="w-full h-full relative cursor-grab active:cursor-grabbing select-none overflow-hidden"
    >
      {/* ── Dynamic Deep Space Universe Background ── */}
      <UniverseBackground />

      <Globe
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="rgba(0, 0, 0, 0)"
        showAtmosphere={true}
        atmosphereColor="#10b981"
        atmosphereAltitude={0.18}
        onGlobeReady={initCelestialStarfield}
        polygonsData={polygonsList}
        polygonCapColor={getPolygonCapColor}
        polygonSideColor={getPolygonSideColor}
        polygonStrokeColor={getPolygonStrokeColor}
        polygonAltitude={getPolygonAltitude}
        polygonLabel={getPolygonLabel}
        onPolygonHover={handlePolygonHover}
        onPolygonClick={handlePolygonClick}
        polygonsTransitionDuration={300}
      />
    </div>
  );
};

export default WorldGlobeInner;
