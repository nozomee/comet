const ITEMS = [
  { icon: "⭐", text: "Star us on GitHub", href: "https://github.com" },
  { icon: "🤝", text: "Contribute to comet", href: "https://github.com" },
  { icon: "🆕", text: "Chrome Extension now available" },
  { icon: "🎉", text: "50,000+ screenshots exported" },
  { icon: "💛", text: "100% free & open source" },
  { icon: "🚀", text: "v1.0 just shipped" },
  { icon: "📣", text: "Share comet with your team" },
  { icon: "🛠", text: "Built in public — follow along" },
];

const TRACK = [...ITEMS, ...ITEMS, ...ITEMS];

const SEP = (
  <span aria-hidden style={{ opacity: 0.25, fontSize: 10, flexShrink: 0 }}>●</span>
);

export default function NavMarquee() {
  return (
    <div
      className="relative overflow-hidden border-b"
      style={{
        background: "rgba(245,197,24,0.04)",
        borderColor: "rgba(245,197,24,0.1)",
      }}
    >
      {/* Edge fades */}
      <div className="absolute left-0 top-0 h-full w-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, #0a0a0a, transparent)" }} />
      <div className="absolute right-0 top-0 h-full w-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, #0a0a0a, transparent)" }} />

      <div
        className="flex items-center gap-5 py-2"
        style={{
          width: "max-content",
          animation: "nav-marquee 48s linear infinite",
        }}
      >
        {TRACK.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-5 flex-shrink-0">
            {SEP}
            {item.href ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-white"
                style={{ color: "rgba(255,255,255,0.55)", textDecoration: "none", whiteSpace: "nowrap" }}
              >
                <span>{item.icon}</span>
                <span>{item.text}</span>
                <span style={{ fontSize: 9, opacity: 0.5 }}>↗</span>
              </a>
            ) : (
              <span
                className="inline-flex items-center gap-1.5 text-xs font-medium"
                style={{ color: "rgba(255,255,255,0.45)", whiteSpace: "nowrap" }}
              >
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </span>
            )}
          </span>
        ))}
      </div>

      <style>{`
        @keyframes nav-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="nav-marquee"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
