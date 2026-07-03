import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ITEMS = [
  { stat: "50k+",   label: "SCREENSHOTS EXPORTED" },
  { stat: "12",     label: "GRADIENT PRESETS" },
  { stat: "100%",   label: "FREE FOREVER" },
  { stat: "3×",     label: "MAX EXPORT RESOLUTION" },
  { stat: "0",      label: "SIGNUPS REQUIRED" },
  { stat: "5",      label: "WINDOW FRAME STYLES" },
  { stat: "2,400+", label: "HAPPY USERS" },
  { stat: "PNG",    label: "JPG · WEBP · CLIPBOARD" },
];

// Triple so the loop is seamless at any viewport width
const TRACK = [...ITEMS, ...ITEMS, ...ITEMS];

const DIAMOND = (
  <span
    aria-hidden
    style={{ fontSize: "1rem", lineHeight: 1, flexShrink: 0 }}
  >
    ✦
  </span>
);

export default function Marquee() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px 0px" });

  return (
    <motion.div
      ref={ref}
      className="relative overflow-hidden"
      style={{ background: "#f5c518" }}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Top shadow from dark bg above */}
      <div
        className="absolute top-0 inset-x-0 h-[3px]"
        style={{ background: "rgba(0,0,0,0.35)" }}
      />
      {/* Bottom shadow */}
      <div
        className="absolute bottom-0 inset-x-0 h-[3px]"
        style={{ background: "rgba(0,0,0,0.35)" }}
      />

      {/* Scrolling track */}
      <div
        className="flex items-center py-7"
        style={{
          animation: "marquee-gold 40s linear infinite",
          width: "max-content",
          gap: "0",
        }}
      >
        {TRACK.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center"
            style={{ color: "#000" }}
          >
            {/* Diamond separator */}
            <span className="inline-flex items-center px-5 text-black opacity-60 text-sm">
              {DIAMOND}
            </span>

            {/* Stat */}
            <span
              className="font-black tracking-tight"
              style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", lineHeight: 1 }}
            >
              {item.stat}
            </span>

            {/* Label */}
            <span
              className="ml-3 font-bold tracking-widest uppercase"
              style={{ fontSize: "clamp(0.6rem, 1vw, 0.75rem)", lineHeight: 1 }}
            >
              {item.label}
            </span>
          </span>
        ))}
      </div>

      <style>{`
        @keyframes marquee-gold {
          0%   { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="marquee-gold"] { animation: none !important; }
        }
      `}</style>
    </motion.div>
  );
}
