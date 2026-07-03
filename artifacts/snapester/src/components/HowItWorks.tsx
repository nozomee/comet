import React, { useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { Upload, Wand2, Move, Download } from "lucide-react";

const Y = "#f5c518";

const STEPS = [
  {
    n: "01",
    icon: <Upload size={24} />,
    title: "Upload",
    desc: "Drag & drop or paste your screenshot directly into the editor.",
    tags: ["PNG", "JPG", "WebP", "Clipboard"],
  },
  {
    n: "02",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
      </svg>
    ),
    title: "Background",
    desc: "Pick from 12 gradient presets or solid colors to set the scene.",
    tags: ["Gradients", "Solids", "Custom"],
  },
  {
    n: "03",
    icon: <Wand2 size={24} />,
    title: "Style",
    desc: "Add a window frame, dial in shadow depth, and tweak corner radius.",
    tags: ["macOS", "Browser", "Arc", "Terminal", "iPhone"],
  },
  {
    n: "04",
    icon: <Move size={24} />,
    title: "Dimension",
    desc: "Lock to a canvas size — Instagram, Twitter, 16:9, square, and more.",
    tags: ["Instagram", "Twitter", "16:9", "Square"],
  },
  {
    n: "05",
    icon: <Download size={24} />,
    title: "Export",
    desc: "Download at 1x, 2x, or 3x resolution, or copy straight to clipboard.",
    tags: ["PNG", "2x / 3x", "Clipboard"],
  },
];

/* ── animated dashed connector line ── */
function ConnectorLine({ inView }: { inView: boolean }) {
  return (
    <div className="hidden md:block absolute top-[52px] left-[calc(10%+44px)] right-[calc(10%+44px)] h-px overflow-hidden">
      <motion.div
        className="absolute inset-0"
        style={{
          background: `repeating-linear-gradient(90deg, ${Y} 0, ${Y} 8px, transparent 8px, transparent 20px)`,
          opacity: 0.35,
        }}
        initial={{ scaleX: 0, originX: 0 }}
        animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
      />
    </div>
  );
}

/* ── single step card ── */
function StepCard({
  step,
  index,
  inView,
}: {
  step: (typeof STEPS)[number];
  index: number;
  inView: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="relative flex flex-col items-center text-center group cursor-default"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.25 + index * 0.12,
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      {/* Glow behind circle */}
      <motion.div
        className="absolute top-0 w-[88px] h-[88px] rounded-full"
        animate={
          hovered
            ? { opacity: 0.18, scale: 1.3 }
            : { opacity: 0, scale: 1 }
        }
        transition={{ duration: 0.35 }}
        style={{ background: Y, filter: "blur(18px)" }}
      />

      {/* Icon circle */}
      <motion.div
        className="w-[76px] h-[76px] rounded-full flex items-center justify-center mb-5 relative z-10"
        animate={
          hovered
            ? { borderColor: Y, scale: 1.08 }
            : { borderColor: "rgba(245,197,24,0.3)", scale: 1 }
        }
        transition={{ duration: 0.3 }}
        style={{
          background: "#0a0a0a",
          border: "2px solid rgba(245,197,24,0.3)",
          color: Y,
        }}
      >
        <motion.div
          animate={hovered ? { rotate: [0, -8, 8, 0], scale: 1.15 } : { rotate: 0, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          {step.icon}
        </motion.div>

        {/* Number badge */}
        <motion.span
          className="absolute -top-1.5 -right-1.5 w-[22px] h-[22px] rounded-full text-[10px] font-bold flex items-center justify-center z-20"
          style={{ background: Y, color: "#000" }}
          initial={{ scale: 0, rotate: -45 }}
          animate={inView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -45 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 18,
            delay: 0.5 + index * 0.12,
          }}
        >
          {index + 1}
        </motion.span>
      </motion.div>

      {/* Title */}
      <motion.h3
        className="text-base font-bold mb-2 text-white"
        animate={hovered ? { color: Y } : { color: "#ffffff" }}
        transition={{ duration: 0.25 }}
      >
        {step.title}
      </motion.h3>

      {/* Description */}
      <p
        className="text-xs leading-relaxed mb-3 max-w-[160px]"
        style={{ color: "rgba(255,255,255,0.5)" }}
      >
        {step.desc}
      </p>

      {/* Tags */}
      <motion.div
        className="flex flex-wrap justify-center gap-1"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
      >
        {step.tags.map((tag) => (
          <motion.span
            key={tag}
            className="text-[10px] px-2 py-0.5 rounded-full font-medium"
            style={{
              background: "rgba(245,197,24,0.07)",
              color: "rgba(245,197,24,0.65)",
              border: "1px solid rgba(245,197,24,0.15)",
            }}
            whileHover={{
              background: "rgba(245,197,24,0.18)",
              color: Y,
              scale: 1.06,
            }}
            transition={{ duration: 0.18 }}
          >
            {tag}
          </motion.span>
        ))}
      </motion.div>

      {/* Mobile vertical connector (below, not above) */}
    </motion.div>
  );
}

/* ── section ── */
export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px 0px" });

  return (
    <section
      id="workflow"
      ref={sectionRef}
      className="py-28 px-6 overflow-hidden"
      style={{ background: "#050505" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.span
            className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-5 border"
            style={{ borderColor: "rgba(245,197,24,0.3)", color: Y }}
            initial={{ opacity: 0, y: -12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            How it works
          </motion.span>

          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            From raw screenshot to{" "}
            <motion.span
              className="font-serif italic font-normal"
              style={{ color: Y }}
              initial={{ opacity: 0, x: -10 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
              transition={{ duration: 0.55, delay: 0.3 }}
            >
              polished visual
            </motion.span>
          </motion.h2>

          {/* Subtitle underline accent */}
          <motion.div
            className="mx-auto mt-4 h-px w-20 rounded-full"
            style={{ background: `linear-gradient(90deg, transparent, ${Y}, transparent)` }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={inView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
          />
        </div>

        {/* Flow diagram */}
        <div className="relative">
          <ConnectorLine inView={inView} />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-y-10 gap-x-4 items-start">
            {STEPS.map((step, i) => (
              <React.Fragment key={step.n}>
                <StepCard step={step} index={i} inView={inView} />
                {/* Mobile dashed vertical connector */}
                {i < STEPS.length - 1 && (
                  <motion.div
                    className="md:hidden w-px h-8 self-center mx-auto"
                    style={{
                      background: `repeating-linear-gradient(180deg, ${Y} 0, ${Y} 4px, transparent 4px, transparent 10px)`,
                      opacity: 0.35,
                    }}
                    initial={{ scaleY: 0 }}
                    animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 + i * 0.12 }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
