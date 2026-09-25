"use client";

import React from "react";
import dynamic from "next/dynamic";
import type { WorldGlobeProps } from "./types";
import type { WorldGlobeInnerHandle } from "./WorldGlobeInner";

// Dynamic import with SSR disabled to prevent Three.js window/canvas errors on server
const DynamicGlobe = dynamic(() => import("./WorldGlobeInner"), {
  ssr: false,
  loading: () => (
    <div
      id="globe-loading-placeholder"
      className="w-full h-full flex flex-col items-center justify-center gap-4"
      style={{
        background: "radial-gradient(circle at 50% 50%, #0a1128 0%, #030712 85%)",
      }}
    >
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-xl">
          🌍
        </div>
      </div>
      <p className="text-sm font-medium text-gray-400 tracking-wide animate-pulse">
        Initializing 3D Globe Engine...
      </p>
    </div>
  ),
});

interface WorldGlobeWrapperProps extends WorldGlobeProps {
  onHandleReady?: (handle: WorldGlobeInnerHandle) => void;
}

export const WorldGlobe: React.FC<WorldGlobeWrapperProps> = (props) => {
  return <DynamicGlobe {...props} />;
};

export default WorldGlobe;
