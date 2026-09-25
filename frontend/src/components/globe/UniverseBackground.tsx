"use client";

import React, { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  alpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
  hasSpikes?: boolean;
  vx: number;
  vy: number;
}

interface Meteor {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  alpha: number;
  active: boolean;
}

export const UniverseBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Star collection
    let stars: Star[] = [];
    const starColors = [
      "255, 255, 255", // pure white
      "224, 242, 254", // ice blue
      "186, 230, 253", // celestial cyan
      "254, 240, 138", // warm starlight
      "233, 213, 255", // faint lavender
      "167, 243, 208", // aurora mint
    ];

    // Meteor state
    let meteor: Meteor = {
      x: 0,
      y: 0,
      length: 0,
      speed: 0,
      angle: 0,
      alpha: 0,
      active: false,
    };
    let lastMeteorTime = Date.now();
    let nextMeteorDelay = 7000 + Math.random() * 8000;

    const initStars = (w: number, h: number) => {
      // Scale star count with screen area
      const count = Math.min(1000, Math.max(450, Math.floor((w * h) / 2200)));
      stars = [];

      for (let i = 0; i < count; i++) {
        const radius = Math.random() < 0.85 ? Math.random() * 1.1 + 0.3 : Math.random() * 1.6 + 1.2;
        const color = starColors[Math.floor(Math.random() * starColors.length)];
        const hasSpikes = radius > 2.0 && Math.random() < 0.4;

        // Slow, cool cosmic drift (parallax: larger stars drift slightly faster)
        const speed = 0.04 + radius * 0.025;
        const driftAngle = -0.4; // gentle upward-left galactic drift
        const vx = Math.cos(driftAngle) * speed;
        const vy = Math.sin(driftAngle) * speed;

        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          radius,
          baseAlpha: Math.random() * 0.6 + 0.3,
          alpha: 0.5,
          twinkleSpeed: Math.random() * 0.02 + 0.008,
          twinklePhase: Math.random() * Math.PI * 2,
          color,
          hasSpikes,
          vx,
          vy,
        });
      }
    };

    const handleResize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      initStars(width, height);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const spawnMeteor = () => {
      meteor = {
        x: Math.random() * width * 0.75,
        y: Math.random() * (height * 0.4),
        length: 80 + Math.random() * 100,
        speed: 12 + Math.random() * 8,
        angle: Math.PI / 4 + (Math.random() * 0.2 - 0.1), // ~45 degrees downward
        alpha: 0.9,
        active: true,
      };
      lastMeteorTime = Date.now();
      nextMeteorDelay = 9000 + Math.random() * 10000;
    };

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const now = Date.now();

      // Draw and move each star
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Slow cool drift motion
        star.x += star.vx;
        star.y += star.vy;

        // Seamless wrap around edges
        if (star.x < -20) star.x = width + 20;
        if (star.x > width + 20) star.x = -20;
        if (star.y < -20) star.y = height + 20;
        if (star.y > height + 20) star.y = -20;

        // Twinkle modulation
        star.twinklePhase += star.twinkleSpeed;
        const currentAlpha =
          star.baseAlpha + Math.sin(star.twinklePhase) * 0.35;
        const clampedAlpha = Math.max(0.1, Math.min(1.0, currentAlpha));

        ctx.fillStyle = `rgba(${star.color}, ${clampedAlpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();

        // Prominent stars get soft halo & 4-point cross flare
        if (star.hasSpikes && clampedAlpha > 0.6) {
          ctx.strokeStyle = `rgba(${star.color}, ${clampedAlpha * 0.4})`;
          ctx.lineWidth = 0.7;

          // Horizontal spike
          ctx.beginPath();
          ctx.moveTo(star.x - star.radius * 5, star.y);
          ctx.lineTo(star.x + star.radius * 5, star.y);
          ctx.stroke();

          // Vertical spike
          ctx.beginPath();
          ctx.moveTo(star.x, star.y - star.radius * 5);
          ctx.lineTo(star.x, star.y + star.radius * 5);
          ctx.stroke();
        }
      }

      // Check meteor spawn
      if (!meteor.active && now - lastMeteorTime > nextMeteorDelay) {
        spawnMeteor();
      }

      // Draw meteor streak if active
      if (meteor.active) {
        const dx = Math.cos(meteor.angle) * meteor.speed;
        const dy = Math.sin(meteor.angle) * meteor.speed;

        meteor.x += dx;
        meteor.y += dy;
        meteor.alpha -= 0.016;

        if (meteor.alpha <= 0 || meteor.x > width || meteor.y > height) {
          meteor.active = false;
        } else {
          const tailX = meteor.x - Math.cos(meteor.angle) * meteor.length;
          const tailY = meteor.y - Math.sin(meteor.angle) * meteor.length;

          const grad = ctx.createLinearGradient(
            tailX,
            tailY,
            meteor.x,
            meteor.y
          );
          grad.addColorStop(0, "rgba(255, 255, 255, 0)");
          grad.addColorStop(0.7, `rgba(186, 230, 253, ${meteor.alpha * 0.4})`);
          grad.addColorStop(1, `rgba(255, 255, 255, ${meteor.alpha})`);

          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(meteor.x, meteor.y);
          ctx.stroke();

          // Glowing meteor head
          ctx.fillStyle = `rgba(255, 255, 255, ${meteor.alpha})`;
          ctx.beginPath();
          ctx.arc(meteor.x, meteor.y, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none overflow-hidden select-none"
      style={{
        backgroundColor: "#02040a",
      }}
    >
      <style>{`
        @keyframes cosmicNebulaDrift1 {
          0% {
            transform: translate(0px, 0px) scale(1) rotate(0deg);
            opacity: 0.78;
          }
          50% {
            transform: translate(-35px, 25px) scale(1.12) rotate(2.5deg);
            opacity: 1;
          }
          100% {
            transform: translate(30px, -30px) scale(0.96) rotate(-2deg);
            opacity: 0.82;
          }
        }
        @keyframes cosmicNebulaDrift2 {
          0% {
            transform: translate(0px, 0px) scale(1) rotate(0deg);
            opacity: 0.82;
          }
          50% {
            transform: translate(35px, -30px) scale(1.1) rotate(-3deg);
            opacity: 1;
          }
          100% {
            transform: translate(-25px, 20px) scale(1.04) rotate(2deg);
            opacity: 0.88;
          }
        }
        @keyframes cosmicNebulaDrift3 {
          0% {
            transform: translate(0px, 0px) scale(1);
            opacity: 0.68;
          }
          50% {
            transform: translate(-30px, -20px) scale(1.18);
            opacity: 0.95;
          }
          100% {
            transform: translate(20px, 25px) scale(0.94);
            opacity: 0.74;
          }
        }
        @keyframes planetaryBackglowPulse {
          0% {
            opacity: 0.82;
            transform: scale(0.98);
          }
          50% {
            opacity: 1;
            transform: scale(1.06);
          }
          100% {
            opacity: 0.86;
            transform: scale(1);
          }
        }
      `}</style>

      {/* ── Deep Space Nebula Layer 1: Cosmic Violet Gas (Slow Fluid Motion) ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 85% 20%, rgba(91, 33, 182, 0.24) 0%, rgba(67, 56, 202, 0.12) 45%, transparent 75%)",
          filter: "blur(24px)",
          animation: "cosmicNebulaDrift1 50s ease-in-out infinite alternate",
          willChange: "transform, opacity",
        }}
      />

      {/* ── Deep Space Nebula Layer 2: Electric Cyan / Sapphire Dust (Slow Fluid Motion) ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 65% 50% at 15% 75%, rgba(14, 116, 144, 0.22) 0%, rgba(30, 58, 138, 0.14) 45%, transparent 75%)",
          filter: "blur(28px)",
          animation: "cosmicNebulaDrift2 60s ease-in-out infinite alternate",
          willChange: "transform, opacity",
        }}
      />

      {/* ── Deep Space Nebula Layer 3: Emerald Stardust Aurora (Slow Fluid Motion) ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 35% at 75% 80%, rgba(16, 185, 129, 0.12) 0%, transparent 60%)",
          filter: "blur(32px)",
          animation: "cosmicNebulaDrift3 45s ease-in-out infinite alternate",
          willChange: "transform, opacity",
        }}
      />

      {/* ── Planetary Backglow: Soft ambient aura behind sphere position (Slow Breathing Motion) ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.09) 0%, rgba(16, 185, 129, 0.05) 25%, transparent 65%)",
          animation: "planetaryBackglowPulse 14s ease-in-out infinite alternate",
          willChange: "transform, opacity",
        }}
      />

      {/* ── Dynamic High-DPI Twinkling & Drifting Starfield Canvas ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ width: "100%", height: "100%" }}
      />

      {/* ── Subtle Vignette to darken corners and accentuate sphere floating depth ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, transparent 40%, rgba(1, 3, 8, 0.6) 80%, rgba(1, 2, 6, 0.92) 100%)",
        }}
      />
    </div>
  );
};

export default UniverseBackground;
