import { motion, AnimatePresence } from "framer-motion";

interface Props {
  open: boolean;
  onClose: () => void;
}

const Y = "#f5c518";

const STEPS = [
  { n: "1", label: "Download zip" },
  { n: "2", label: "Go to chrome://extensions" },
  { n: "3", label: "Enable Developer Mode" },
  { n: "4", label: "Click Load unpacked" },
  { n: "5", label: "Select the folder" },
];

export default function AddToChromeModal({ open, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            className="fixed z-50 inset-x-4 bottom-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[660px]"
            style={{ background: "#111", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20 }}
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center transition-colors"
              style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.4)" }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="p-8">
              {/* Title */}
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: Y }}>Chrome Extension</p>
              <h2 className="text-xl font-bold text-white mb-6">Install in 2 minutes</h2>

              {/* Steps */}
              <div className="flex items-start gap-0 mb-8">
                {STEPS.map((step, i) => (
                  <div key={step.n} className="flex items-start flex-shrink-0">
                    <motion.div
                      className="flex flex-col items-center text-center"
                      style={{ width: 88 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 + i * 0.06 }}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-2 flex-shrink-0"
                        style={{ background: "rgba(245,197,24,0.12)", color: Y, border: "1px solid rgba(245,197,24,0.25)" }}
                      >
                        {step.n}
                      </div>
                      <span className="text-[11px] leading-snug" style={{ color: "rgba(255,255,255,0.5)" }}>
                        {step.label}
                      </span>
                    </motion.div>

                    {i < STEPS.length - 1 && (
                      <div className="mt-[14px] flex-shrink-0 mx-1">
                        <svg width="16" height="8" viewBox="0 0 16 8" fill="none">
                          <path d="M0 4h13M10 1l3 3-3 3" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Download CTA */}
              <a
                href="/extension.zip"
                download="comet-extension.zip"
                className="flex items-center justify-center gap-2.5 w-full py-3 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5"
                style={{ background: Y, color: "#000" }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download Extension
              </a>

              <p className="text-center text-xs mt-3" style={{ color: "rgba(255,255,255,0.25)" }}>
                Free · Open source · No account needed
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
