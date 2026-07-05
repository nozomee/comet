/**
 * LandingSVGs — all decorative animated SVG elements for the landing page.
 * Every component is pointer-events-none and purely visual.
 */

const Y = "#f5c518";

// ─── Floating Sparkles ────────────────────────────────────────────────────────
// 14 gold ✦ shapes drifting upward at random positions in the hero.

const SPARKLES = [
  { x: 8,  delay: 0,    dur: 7,   size: 10, opacity: 0.55 },
  { x: 18, delay: 1.2,  dur: 9,   size: 7,  opacity: 0.35 },
  { x: 30, delay: 2.4,  dur: 8,   size: 12, opacity: 0.6  },
  { x: 45, delay: 0.7,  dur: 11,  size: 8,  opacity: 0.4  },
  { x: 57, delay: 3.1,  dur: 7.5, size: 14, opacity: 0.5  },
  { x: 68, delay: 1.8,  dur: 10,  size: 6,  opacity: 0.3  },
  { x: 78, delay: 0.3,  dur: 8.5, size: 11, opacity: 0.55 },
  { x: 88, delay: 2.0,  dur: 9.5, size: 9,  opacity: 0.45 },
  { x: 12, delay: 4.0,  dur: 6.5, size: 7,  opacity: 0.3  },
  { x: 38, delay: 1.5,  dur: 10,  size: 10, opacity: 0.4  },
  { x: 62, delay: 3.6,  dur: 7,   size: 8,  opacity: 0.35 },
  { x: 92, delay: 0.9,  dur: 9,   size: 13, opacity: 0.5  },
  { x: 24, delay: 5.0,  dur: 8,   size: 6,  opacity: 0.3  },
  { x: 74, delay: 2.7,  dur: 11,  size: 10, opacity: 0.45 },
];

export function FloatingSparkles() {
  return (
    <>
      <style>{`
        @keyframes sparkle-float {
          0%   { transform: translateY(0px)   scale(0) rotate(0deg);   opacity: 0; }
          10%  { opacity: 1; transform: translateY(-20px)  scale(1) rotate(20deg); }
          80%  { opacity: 0.8; }
          100% { transform: translateY(-180px) scale(0.3) rotate(80deg); opacity: 0; }
        }
        @keyframes sparkle-drift {
          0%,100% { margin-left: 0px; }
          50%     { margin-left: 18px; }
        }
      `}</style>
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
        {SPARKLES.map((s, i) => (
          <div
            key={i}
            className="absolute bottom-0"
            style={{
              left: `${s.x}%`,
              animation: `sparkle-float ${s.dur}s ease-in-out ${s.delay}s infinite, sparkle-drift ${s.dur * 0.7}s ease-in-out ${s.delay}s infinite`,
            }}
          >
            <svg
              width={s.size}
              height={s.size}
              viewBox="0 0 20 20"
              fill={Y}
              style={{ opacity: s.opacity }}
            >
              {/* 4-pointed star / sparkle */}
              <path d="M10 0 L11.5 8.5 L20 10 L11.5 11.5 L10 20 L8.5 11.5 L0 10 L8.5 8.5 Z" />
            </svg>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── Comet Streak ─────────────────────────────────────────────────────────────
// A glowing dot traces a curved arc across the top of the hero every ~12 s.

export function CometStreak() {
  return (
    <>
      <style>{`
        @keyframes comet-move {
          0%   { offset-distance: 0%;   opacity: 0; }
          5%   { opacity: 1; }
          90%  { opacity: 0.8; }
          100% { offset-distance: 100%; opacity: 0; }
        }
        @keyframes comet-trail {
          0%,100% { stroke-dashoffset: 400; opacity: 0; }
          10%     { opacity: 0.5; }
          50%     { stroke-dashoffset: 0; opacity: 0.6; }
          90%     { opacity: 0; }
        }
      `}</style>
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
        <svg
          viewBox="0 0 1200 400"
          className="absolute top-0 left-0 w-full"
          style={{ height: "400px" }}
          preserveAspectRatio="none"
          fill="none"
        >
          <defs>
            <linearGradient id="comet-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={Y} stopOpacity="0" />
              <stop offset="70%" stopColor={Y} stopOpacity="0.6" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0.9" />
            </linearGradient>
            <filter id="comet-glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Trail path */}
          <path
            d="M -50 120 Q 300 20 600 80 Q 900 140 1250 40"
            stroke="url(#comet-grad)"
            strokeWidth="1.5"
            strokeDasharray="400"
            strokeLinecap="round"
            style={{ animation: "comet-trail 12s ease-in-out 2s infinite" }}
          />

          {/* Glowing head — uses CSS offset-path for modern browsers, falls back gracefully */}
          <circle
            r="3"
            fill="#fff"
            filter="url(#comet-glow)"
            style={{
              offsetPath: "path('M -50 120 Q 300 20 600 80 Q 900 140 1250 40')",
              animation: "comet-move 12s ease-in-out 2s infinite",
            } as React.CSSProperties}
          />
        </svg>
      </div>
    </>
  );
}

// ─── Orbit Rings ──────────────────────────────────────────────────────────────
// Two large thin rings on the left and right sides, each with a small dot orbiting.

export function OrbitRings() {
  return (
    <>
      <style>{`
        @keyframes orbit-cw  { from { transform: rotate(0deg);   } to { transform: rotate(360deg);  } }
        @keyframes orbit-ccw { from { transform: rotate(0deg);   } to { transform: rotate(-360deg); } }
        @keyframes ring-pulse {
          0%,100% { opacity: 0.08; }
          50%     { opacity: 0.18; }
        }
      `}</style>
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
        {/* Left ring */}
        <div className="absolute" style={{ left: "-180px", top: "50%", transform: "translateY(-50%)", animation: "ring-pulse 6s ease-in-out infinite" }}>
          <svg width="420" height="420" viewBox="0 0 420 420" fill="none">
            <circle cx="210" cy="210" r="200" stroke={Y} strokeWidth="0.8" strokeDasharray="6 10" opacity="0.6" />
            <circle cx="210" cy="210" r="150" stroke={Y} strokeWidth="0.5" strokeDasharray="3 14" opacity="0.4" />
            {/* Orbiting dot */}
            <g style={{ transformOrigin: "210px 210px", animation: "orbit-cw 14s linear infinite" }}>
              <circle cx="210" cy="10" r="4" fill={Y} opacity="0.8">
                <animate attributeName="opacity" values="0.4;1;0.4" dur="3s" repeatCount="indefinite" />
              </circle>
            </g>
            <g style={{ transformOrigin: "210px 210px", animation: "orbit-ccw 20s linear infinite" }}>
              <circle cx="210" cy="60" r="2.5" fill={Y} opacity="0.5">
                <animate attributeName="opacity" values="0.2;0.7;0.2" dur="4s" repeatCount="indefinite" />
              </circle>
            </g>
          </svg>
        </div>

        {/* Right ring */}
        <div className="absolute" style={{ right: "-180px", top: "40%", transform: "translateY(-50%)", animation: "ring-pulse 8s ease-in-out 1s infinite" }}>
          <svg width="380" height="380" viewBox="0 0 380 380" fill="none">
            <circle cx="190" cy="190" r="180" stroke={Y} strokeWidth="0.7" strokeDasharray="5 12" opacity="0.5" />
            <circle cx="190" cy="190" r="130" stroke={Y} strokeWidth="0.4" strokeDasharray="2 16" opacity="0.3" />
            <g style={{ transformOrigin: "190px 190px", animation: "orbit-ccw 18s linear infinite" }}>
              <circle cx="190" cy="10" r="3.5" fill={Y} opacity="0.7">
                <animate attributeName="opacity" values="0.3;0.9;0.3" dur="3.5s" repeatCount="indefinite" />
              </circle>
            </g>
          </svg>
        </div>
      </div>
    </>
  );
}

// ─── Corner Accents ───────────────────────────────────────────────────────────
// Bracket-style corner decorations that pulse at the hero corners.

export function CornerAccents() {
  return (
    <>
      <style>{`
        @keyframes corner-fade {
          0%,100% { opacity: 0.15; }
          50%     { opacity: 0.45; }
        }
      `}</style>
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 2 }}>
        {/* Top-left */}
        <svg className="absolute top-4 left-4" width="40" height="40" viewBox="0 0 40 40" fill="none"
          style={{ animation: "corner-fade 4s ease-in-out infinite" }}>
          <path d="M40 4 L4 4 L4 40" stroke={Y} strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="4" cy="4" r="2" fill={Y} opacity="0.8" />
        </svg>
        {/* Top-right */}
        <svg className="absolute top-4 right-4" width="40" height="40" viewBox="0 0 40 40" fill="none"
          style={{ animation: "corner-fade 4s ease-in-out 1s infinite" }}>
          <path d="M0 4 L36 4 L36 40" stroke={Y} strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="36" cy="4" r="2" fill={Y} opacity="0.8" />
        </svg>
        {/* Bottom-left */}
        <svg className="absolute bottom-4 left-4" width="40" height="40" viewBox="0 0 40 40" fill="none"
          style={{ animation: "corner-fade 4s ease-in-out 2s infinite" }}>
          <path d="M40 36 L4 36 L4 0" stroke={Y} strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="4" cy="36" r="2" fill={Y} opacity="0.8" />
        </svg>
        {/* Bottom-right */}
        <svg className="absolute bottom-4 right-4" width="40" height="40" viewBox="0 0 40 40" fill="none"
          style={{ animation: "corner-fade 4s ease-in-out 3s infinite" }}>
          <path d="M0 36 L36 36 L36 0" stroke={Y} strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="36" cy="36" r="2" fill={Y} opacity="0.8" />
        </svg>
      </div>
    </>
  );
}

// ─── Section Wave Divider ─────────────────────────────────────────────────────
// Animated SVG wave that divides sections.

export function WaveDivider({ flip = false }: { flip?: boolean }) {
  return (
    <>
      <style>{`
        @keyframes wave-shift {
          0%   { d: path("M0 40 Q 200 0 400 40 Q 600 80 800 40 Q 1000 0 1200 40 L1200 80 L0 80 Z"); }
          50%  { d: path("M0 40 Q 200 80 400 40 Q 600 0 800 40 Q 1000 80 1200 40 L1200 80 L0 80 Z"); }
          100% { d: path("M0 40 Q 200 0 400 40 Q 600 80 800 40 Q 1000 0 1200 40 L1200 80 L0 80 Z"); }
        }
      `}</style>
      <div
        className="w-full overflow-hidden pointer-events-none"
        style={{ height: 60, transform: flip ? "scaleY(-1)" : undefined, marginBottom: flip ? undefined : -2, marginTop: flip ? -2 : undefined }}
      >
        <svg viewBox="0 0 1200 80" preserveAspectRatio="none" className="w-full h-full" fill="none">
          <path
            d="M0 40 Q 200 0 400 40 Q 600 80 800 40 Q 1000 0 1200 40 L1200 80 L0 80 Z"
            fill="rgba(245,197,24,0.04)"
            style={{ animation: "wave-shift 8s ease-in-out infinite" }}
          />
          <path
            d="M0 40 Q 200 0 400 40 Q 600 80 800 40 Q 1000 0 1200 40"
            stroke="rgba(245,197,24,0.12)"
            strokeWidth="1"
            fill="none"
            style={{ animation: "wave-shift 8s ease-in-out infinite" }}
          />
        </svg>
      </div>
    </>
  );
}

// ─── Floating Geo Shapes ──────────────────────────────────────────────────────
// Softly drifting hollow geometric shapes scattered between sections.

const SHAPES = [
  { type: "hex",      x: 7,  y: 30, size: 28, delay: 0,   dur: 9,  opacity: 0.12 },
  { type: "diamond",  x: 93, y: 20, size: 20, delay: 2,   dur: 11, opacity: 0.1  },
  { type: "tri",      x: 15, y: 70, size: 24, delay: 1.5, dur: 8,  opacity: 0.1  },
  { type: "hex",      x: 85, y: 65, size: 32, delay: 3,   dur: 12, opacity: 0.08 },
  { type: "diamond",  x: 50, y: 85, size: 18, delay: 0.5, dur: 10, opacity: 0.09 },
  { type: "tri",      x: 70, y: 10, size: 22, delay: 4,   dur: 7,  opacity: 0.1  },
];

function ShapePath({ type, size }: { type: string; size: number }) {
  const h = size;
  const w = size;
  if (type === "hex") {
    const r = h / 2;
    const cx = w / 2, cy = h / 2;
    const pts = Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 3) * i - Math.PI / 6;
      return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
    }).join(" ");
    return <polygon points={pts} fill="none" stroke={Y} strokeWidth="1" />;
  }
  if (type === "diamond") {
    return <path d={`M${w/2} 0 L${w} ${h/2} L${w/2} ${h} L0 ${h/2} Z`} fill="none" stroke={Y} strokeWidth="1" />;
  }
  // triangle
  return <path d={`M${w/2} 0 L${w} ${h} L0 ${h} Z`} fill="none" stroke={Y} strokeWidth="1" />;
}

export function FloatingGeoShapes() {
  return (
    <>
      <style>{`
        @keyframes geo-float {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          33%     { transform: translateY(-18px) rotate(8deg); }
          66%     { transform: translateY(-8px) rotate(-5deg); }
        }
      `}</style>
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        {SHAPES.map((s, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              opacity: s.opacity,
              animation: `geo-float ${s.dur}s ease-in-out ${s.delay}s infinite`,
            }}
          >
            <svg width={s.size} height={s.size} viewBox={`0 0 ${s.size} ${s.size}`}>
              <ShapePath type={s.type} size={s.size} />
            </svg>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── Scan Line ────────────────────────────────────────────────────────────────
// A glowing horizontal scan line that sweeps top-to-bottom slowly.

export function ScanLine() {
  return (
    <>
      <style>{`
        @keyframes scan {
          0%   { top: -4%;  opacity: 0; }
          5%   { opacity: 1; }
          95%  { opacity: 0.6; }
          100% { top: 104%; opacity: 0; }
        }
      `}</style>
      <div className="absolute inset-x-0 overflow-hidden pointer-events-none" style={{ top: 0, bottom: 0, zIndex: 0 }}>
        <div
          className="absolute inset-x-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent 0%, rgba(245,197,24,0.0) 10%, rgba(245,197,24,0.3) 30%, rgba(245,197,24,0.5) 50%, rgba(245,197,24,0.3) 70%, rgba(245,197,24,0.0) 90%, transparent 100%)`,
            boxShadow: "0 0 12px 4px rgba(245,197,24,0.15)",
            animation: "scan 10s ease-in-out 1s infinite",
          }}
        />
      </div>
    </>
  );
}
