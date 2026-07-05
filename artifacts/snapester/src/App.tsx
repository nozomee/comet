import React, { useState, useRef, useCallback, useEffect } from "react";
import HowItWorks from "@/components/HowItWorks";
import Marquee from "@/components/Marquee";
import AddToChromeModal from "@/components/AddToChromeModal";
import AnnotationLayer, { Annotation } from "@/components/editor/AnnotationLayer";
import NavMarquee from "@/components/NavMarquee";
import { FloatingSparkles, CometStreak, OrbitRings, CornerAccents, WaveDivider, FloatingGeoShapes, ScanLine } from "@/components/LandingSVGs";
import { Switch, Route, Router as WouterRouter, Link } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import {
  Camera, Wand2, Upload, Download, Copy, Trash2, Check,
  ChevronDown, RotateCcw, ZoomIn, ZoomOut, Move, X, Maximize2,
} from "lucide-react";

const queryClient = new QueryClient();
const Y = "#f5c518";
const BG = "#0a0a0a";

// --- GRADIENTS ---
const GRADIENTS = [
  { name: "Gold Rush",     value: "linear-gradient(135deg, #f5c518 0%, #ff8c00 100%)" },
  { name: "Midnight Gold", value: "linear-gradient(135deg, #1a1a00 0%, #f5c518 100%)" },
  { name: "Neon Lemon",    value: "linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)" },
  { name: "Solar Flare",   value: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)" },
  { name: "Purple Haze",   value: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)" },
  { name: "Ocean",         value: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)" },
  { name: "Obsidian",      value: "linear-gradient(135deg, #232526 0%, #414345 100%)" },
  { name: "Deep Space",    value: "linear-gradient(135deg, #09203f 0%, #537895 100%)" },
  { name: "Toxic",         value: "linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)" },
  { name: "Crimson",       value: "linear-gradient(135deg, #ff0844 0%, #ffb199 100%)" },
  { name: "Violet Night",  value: "linear-gradient(135deg, #4a00e0 0%, #8e2de2 100%)" },
  { name: "Steel",         value: "linear-gradient(135deg, #8E9EAB 0%, #eef2f3 100%)" },
];

const SOLIDS = [
  { name: "Black",  value: "#000000" },
  { name: "Yellow", value: "#f5c518" },
  { name: "White",  value: "#ffffff" },
  { name: "Slate",  value: "#1e293b" },
];

// --- FRAMES ---
const FRAMES = [
  { id: "none",     name: "None" },
  { id: "macos",    name: "macOS" },
  { id: "browser",  name: "Browser" },
  { id: "arc",      name: "Arc" },
  { id: "terminal", name: "Terminal" },
  { id: "iphone",   name: "iPhone" },
  { id: "android",  name: "Android" },
  { id: "ipad",     name: "iPad" },
];

// --- DIMENSIONS ---
const DIMENSIONS = [
  { id: "free",           name: "Free",               w: 0,    h: 0    },
  { id: "square",         name: "Square  1:1",        w: 1,    h: 1    },
  { id: "instagram-post", name: "Instagram Post",     w: 1080, h: 1080 },
  { id: "instagram-story",name: "Instagram Story",    w: 1080, h: 1920 },
  { id: "instagram-port", name: "Instagram Portrait", w: 1080, h: 1350 },
  { id: "facebook",       name: "Facebook Post",      w: 1200, h: 630  },
  { id: "twitter",        name: "Twitter / X",        w: 1200, h: 675  },
  { id: "linkedin",       name: "LinkedIn Post",      w: 1200, h: 627  },
  { id: "16:9",           name: "Widescreen  16:9",   w: 16,   h: 9    },
  { id: "4:5",            name: "Portrait  4:5",      w: 4,    h: 5    },
  { id: "4:3",            name: "Standard  4:3",      w: 4,    h: 3    },
  { id: "21:9",           name: "Ultrawide  21:9",    w: 21,   h: 9    },
];

// --- COMET LOGO SVG ---
function CometIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="2" y1="19" x2="11" y2="10" stroke="#f5c518" strokeWidth="1.8" strokeLinecap="round" opacity="0.45" />
      <line x1="3.5" y1="23" x2="10" y2="14.5" stroke="#f5c518" strokeWidth="1.2" strokeLinecap="round" opacity="0.28" />
      <line x1="0.5" y1="14.5" x2="8" y2="11" stroke="#f5c518" strokeWidth="1.2" strokeLinecap="round" opacity="0.28" />
      <circle cx="15" cy="8" r="5" fill="#f5c518" />
      <circle cx="13.5" cy="6.5" r="1.8" fill="white" opacity="0.55" />
    </svg>
  );
}

const GITHUB_REPO = "nozomee/comet";
const GITHUB_URL = `https://github.com/${GITHUB_REPO}`;

function GitHubButton() {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    fetch(`https://api.github.com/repos/${GITHUB_REPO}`)
      .then((r) => r.json())
      .then((d) => { if (typeof d.stargazers_count === "number") setStars(d.stargazers_count); })
      .catch(() => {});
  }, []);

  const formatted = stars === null ? "—" : stars >= 1000 ? `${(stars / 1000).toFixed(1)}k` : String(stars);

  return (
    <a
      href={GITHUB_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-0 rounded-lg overflow-hidden border text-xs font-semibold transition-all hover:brightness-110"
      style={{ borderColor: "rgba(255,255,255,0.14)", background: "rgba(255,255,255,0.05)" }}
    >
      {/* GitHub icon + label */}
      <span className="flex items-center gap-1.5 px-3 py-1.5 border-r" style={{ borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.85)" }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
        </svg>
        GitHub
      </span>
      {/* Star count */}
      <span className="flex items-center gap-1 px-2.5 py-1.5" style={{ color: Y }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
        </svg>
        {formatted}
      </span>
    </a>
  );
}

// --- NAV ---
function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md border-b" style={{ background: "rgba(10,10,10,0.88)", borderColor: "rgba(245,197,24,0.12)" }}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-lg" style={{ background: "#111", border: "1.5px solid rgba(245,197,24,0.3)" }}>
            <CometIcon size={22} />
          </div>
          <span className="text-xl font-bold tracking-tight text-white" style={{ letterSpacing: "-0.02em" }}>comet</span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>
          <a href="#editor-preview" className="hover:text-white transition-colors">Editor</a>
          <a href="#workflow" className="hover:text-white transition-colors">How it works</a>
          <a href="#open-source" className="hover:text-white transition-colors">Open Source</a>
          <GitHubButton />
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="text-white py-16 border-t" style={{ background: "#050505", borderColor: "rgba(245,197,24,0.1)" }}>
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#111", border: "1.5px solid rgba(245,197,24,0.3)" }}>
              <CometIcon size={18} />
            </div>
            <span className="text-xl font-bold tracking-tight" style={{ letterSpacing: "-0.02em" }}>comet</span>
          </div>
          <p className="text-base max-w-sm font-light" style={{ color: "rgba(255,255,255,0.5)" }}>
            Turn boring screenshots into beautiful visuals. The tool for creators who care about presentation.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-5 uppercase tracking-wider text-xs" style={{ color: Y }}>Product</h4>
          <ul className="space-y-3 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
            <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
            <li><a href="#showcase" className="hover:text-white transition-colors">Showcase</a></li>
            <li><a href="#open-source" className="hover:text-white transition-colors">Open Source</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-5 uppercase tracking-wider text-xs" style={{ color: Y }}>Company</h4>
          <ul className="space-y-3 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
            <li><a href="#" className="hover:text-white transition-colors">About</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-6 border-t flex flex-col md:flex-row items-center justify-between text-xs" style={{ borderColor: "rgba(245,197,24,0.08)", color: "rgba(255,255,255,0.3)" }}>
        <p>© 2025 comet. All rights reserved.</p>
        <div className="flex gap-6 mt-3 md:mt-0">
          <a href="#" className="hover:text-white transition-colors">Twitter</a>
          <a href="#" className="hover:text-white transition-colors">Instagram</a>
          <a href="#" className="hover:text-white transition-colors">Dribbble</a>
        </div>
      </div>
    </footer>
  );
}

// --- LANDING ---
function Landing() {
  const editorSrc = `${import.meta.env.BASE_URL}editor`.replace(/\/\//g, "/");
  const [fsPhase, setFsPhase] = useState<"closed" | "entering" | "visible" | "leaving">("closed");
  const [chromeModalOpen, setChromeModalOpen] = useState(false);

  const openFullscreen = () => {
    setFsPhase("entering");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setFsPhase("visible"));
    });
  };

  const closeFullscreen = () => {
    setFsPhase("leaving");
    setTimeout(() => setFsPhase("closed"), 350);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: BG, color: "#fff" }}>
      <Navbar />
      <NavMarquee />

      {/* Hero */}
      <style>{`
        .beautiful-word {
          color: #f5c518;
          background: linear-gradient(90deg, #f5c518 0%, #ffe066 40%, #ffb300 60%, #f5c518 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: beautiful-shimmer 3s linear infinite, beautiful-glow 2.5s ease-in-out infinite;
          display: inline-block;
        }
        @keyframes beautiful-shimmer {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        @keyframes beautiful-glow {
          0%, 100% {
            filter: drop-shadow(0 0 8px rgba(245,197,24,0.5)) drop-shadow(0 0 20px rgba(245,197,24,0.25));
            transform: scale(1);
          }
          50% {
            filter: drop-shadow(0 0 16px rgba(245,197,24,0.85)) drop-shadow(0 0 40px rgba(245,197,24,0.45)) drop-shadow(0 0 60px rgba(255,180,0,0.2));
            transform: scale(1.04);
          }
        }
      `}</style>
      <section className="pt-20 pb-14 px-6 overflow-hidden relative">
        {/* Radial glow */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(245,197,24,0.18), transparent)" }} />
        <FloatingSparkles />
        <CometStreak />
        <OrbitRings />
        <CornerAccents />
        <ScanLine />
        {/* SVG decorative lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <defs>
            <pattern id="hero-grid" width="72" height="72" patternUnits="userSpaceOnUse">
              <path d="M 72 0 L 0 0 0 72" fill="none" stroke="rgba(245,197,24,0.045)" strokeWidth="0.6"/>
            </pattern>
            <linearGradient id="line-fade-h" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(245,197,24,0)" />
              <stop offset="30%" stopColor="rgba(245,197,24,0.18)" />
              <stop offset="70%" stopColor="rgba(245,197,24,0.18)" />
              <stop offset="100%" stopColor="rgba(245,197,24,0)" />
            </linearGradient>
            <linearGradient id="line-fade-v" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(245,197,24,0.12)" />
              <stop offset="100%" stopColor="rgba(245,197,24,0)" />
            </linearGradient>
          </defs>
          {/* Subtle grid */}
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
          {/* Horizontal accent line */}
          <line x1="0" y1="55%" x2="100%" y2="55%" stroke="url(#line-fade-h)" strokeWidth="0.8" />
          {/* Vertical center line */}
          <line x1="50%" y1="0" x2="50%" y2="100%" stroke="url(#line-fade-v)" strokeWidth="0.8" />
          {/* Diagonal corner accents */}
          <line x1="0" y1="100%" x2="35%" y2="0" stroke="rgba(245,197,24,0.04)" strokeWidth="1" />
          <line x1="100%" y1="100%" x2="65%" y2="0" stroke="rgba(245,197,24,0.04)" strokeWidth="1" />
          {/* Small dot markers at intersections */}
          <circle cx="50%" cy="55%" r="2.5" fill="rgba(245,197,24,0.25)" />
          <circle cx="35%" cy="0" r="1.8" fill="rgba(245,197,24,0.15)" />
          <circle cx="65%" cy="0" r="1.8" fill="rgba(245,197,24,0.15)" />
        </svg>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border" style={{ background: "rgba(245,197,24,0.07)", borderColor: "rgba(245,197,24,0.2)", color: "rgba(255,255,255,0.8)" }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><polygon points="6,1 7.5,4.5 11,4.8 8.5,7.2 9.2,11 6,9.2 2.8,11 3.5,7.2 1,4.8 4.5,4.5" fill="#f5c518"/></svg>
              4.9 rating · 2,400+ reviews
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border" style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
              50k+ screenshots exported
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border" style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Free forever · No signup
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl leading-[1.06] font-bold tracking-tight mb-5 text-white">
            Turn boring screenshots <br />
            into{" "}
            <span className="relative inline-block font-serif italic font-normal px-1 beautiful-word">
              beautiful
            </span>{" "}
            visuals
          </h1>
          <p className="text-base md:text-lg max-w-2xl mx-auto mb-3 font-light leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
            Upload any screenshot and transform it into a polished, share-worthy visual in seconds. No design skills needed.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <button
              onClick={() => setChromeModalOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-bold text-base transition-all shadow-xl hover:-translate-y-1"
              style={{ background: Y, color: "#000", boxShadow: "0 8px 30px rgba(245,197,24,0.35)" }}
            >
              {/* Chrome logo — monochrome black */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="4" />
                <line x1="21.17" y1="8" x2="12" y2="8" />
                <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
                <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
              </svg>
              Add to Chrome
            </button>
            <a href="#editor-preview" className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-bold text-base transition-all hover:-translate-y-1 border" style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.15)", color: "#fff" }}>
              <Wand2 size={20} style={{ color: Y }} /> Try it now ↓
            </a>
          </div>
        </div>
      </section>

      {/* Live Editor Embed */}
      <section id="editor-preview" className="px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          {/* Browser chrome wrapper */}
          <div className="rounded-2xl overflow-hidden border shadow-2xl" style={{ borderColor: "rgba(245,197,24,0.2)", boxShadow: "0 0 80px rgba(245,197,24,0.08), 0 40px 80px rgba(0,0,0,0.6)" }}>
            {/* Fake browser bar */}
            <div className="flex items-center gap-3 px-4 h-10 border-b shrink-0" style={{ background: "#141414", borderColor: "rgba(255,255,255,0.07)" }}>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ background: "#ff5f56" }} />
                <div className="w-3 h-3 rounded-full" style={{ background: "#ffbd2e" }} />
                <div className="w-3 h-3 rounded-full" style={{ background: "#27c93f" }} />
              </div>
              <div className="flex-1 h-6 rounded-md flex items-center px-3 border" style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.08)" }}>
                <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.35)" }}>comet.app/editor</span>
              </div>
              <button onClick={openFullscreen} className="flex items-center gap-1.5 text-xs px-3 py-1 rounded font-medium transition-all hover:brightness-110 active:scale-95" style={{ background: Y, color: "#000" }}>
                <Maximize2 size={11} /> Open fullscreen
              </button>
            </div>
            {/* The actual editor iframe */}
            <iframe
              src={editorSrc}
              className="w-full border-0 block"
              style={{ height: "680px" }}
              title="comet Editor"
            />
          </div>
          <p className="text-center text-xs mt-3" style={{ color: "rgba(255,255,255,0.3)" }}>
            Fully interactive — drag a screenshot in, style it, and export. Or{" "}
            <button onClick={openFullscreen} className="underline hover:text-white transition-colors bg-transparent border-0 p-0 cursor-pointer" style={{ color: "rgba(245,197,24,0.7)" }}>open in fullscreen</button> for the best experience.
          </p>
        </div>
      </section>

      <WaveDivider />
      <Marquee />
      <HowItWorks />
      <AddToChromeModal open={chromeModalOpen} onClose={() => setChromeModalOpen(false)} />
            {/* Open Source */}
      <WaveDivider flip />
      <section id="open-source" className="py-24 rounded-t-[2.5rem] -mt-6 relative overflow-hidden" style={{ background: BG }}>
        <FloatingGeoShapes />
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-5 border" style={{ borderColor: "rgba(245,197,24,0.3)", color: Y }}>Open Source</span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-white">
            Free for everyone, <span className="font-serif italic font-normal" style={{ color: Y }}>forever</span>
          </h2>
          <p className="text-base md:text-lg max-w-xl mx-auto mb-8 font-light leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
            comet is 100% open source and completely free — no paywalls, no subscriptions, no limits.
            We believe great tools should be accessible to everyone. If you'd like to help make it even
            better, contributions are always welcome!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-bold text-base transition-all shadow-xl hover:-translate-y-1"
              style={{ background: Y, color: "#000", boxShadow: "0 8px 30px rgba(245,197,24,0.35)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              Star on GitHub
            </a>
            <a
              href={`${GITHUB_URL}/blob/main/CONTRIBUTING.md`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-bold text-base transition-all hover:-translate-y-1 border"
              style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.15)", color: "#fff" }}
            >
              <Wand2 size={20} style={{ color: Y }} /> Contribute
            </a>
          </div>
        </div>
      </section>
      <Footer />

      {/* Fullscreen editor overlay */}
      {fsPhase !== "closed" && (
        <div
          className={`editor-fullscreen-overlay ${fsPhase === "visible" ? "visible" : "entering"}`}
          style={fsPhase === "leaving" ? { opacity: 0, transform: "scale(0.96)" } : undefined}
        >
          {/* Overlay top bar */}
          <div className="flex items-center gap-3 px-4 h-12 shrink-0 border-b" style={{ background: "#0e0e0e", borderColor: "rgba(245,197,24,0.12)" }}>
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: "#ff5f56" }} />
              <div className="w-3 h-3 rounded-full" style={{ background: "#ffbd2e" }} />
              <div className="w-3 h-3 rounded-full" style={{ background: "#27c93f" }} />
            </div>
            <div className="flex-1 h-6 rounded-md flex items-center px-3 border mx-2" style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}>
              <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.35)" }}>comet.app/editor</span>
            </div>
            <button
              onClick={closeFullscreen}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded font-medium border transition-all hover:bg-white/10"
              style={{ borderColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)" }}
            >
              <X size={13} /> Close
            </button>
          </div>
          {/* Full editor */}
          <iframe
            src={editorSrc}
            className="flex-1 w-full border-0 block"
            title="comet Editor Fullscreen"
          />
        </div>
      )}
    </div>
  );
}

// --- FRAME CHROME COMPONENT ---
function FrameChrome({ frame, radius }: { frame: string; radius: number }) {
  if (frame === "macos") {
    return (
      <div className="h-8 w-full flex items-center px-4 gap-2 border-b shrink-0" style={{ background: "#2d2d2d", borderColor: "rgba(0,0,0,0.3)", borderRadius: `${radius}px ${radius}px 0 0` }}>
        <div className="w-3 h-3 rounded-full" style={{ background: "#ff5f56" }} />
        <div className="w-3 h-3 rounded-full" style={{ background: "#ffbd2e" }} />
        <div className="w-3 h-3 rounded-full" style={{ background: "#27c93f" }} />
        <div className="flex-1 mx-8 h-5 rounded bg-black/20" />
      </div>
    );
  }
  if (frame === "browser") {
    return (
      <div className="h-10 w-full flex items-center px-4 gap-3 border-b shrink-0" style={{ background: "#e8e8e8", borderColor: "rgba(0,0,0,0.1)", borderRadius: `${radius}px ${radius}px 0 0` }}>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 bg-white h-6 rounded-md shadow-sm border border-gray-200 px-3 flex items-center">
          <span className="text-[10px] text-gray-400 truncate">https://anthrax.app</span>
        </div>
      </div>
    );
  }
  if (frame === "arc") {
    return (
      <div className="h-10 w-full flex items-center px-4 gap-3 border-b shrink-0" style={{ background: "linear-gradient(90deg,#1a1a2e,#16213e)", borderColor: "rgba(255,255,255,0.08)", borderRadius: `${radius}px ${radius}px 0 0` }}>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ background: "#ff5f56" }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "#ffbd2e" }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "#27c93f" }} />
        </div>
        <div className="flex-1 h-6 rounded-full px-3 flex items-center border" style={{ background: "rgba(255,255,255,0.07)", borderColor: "rgba(255,255,255,0.1)" }}>
          <span className="text-[10px] text-white/40 truncate">anthrax.app</span>
        </div>
      </div>
    );
  }
  if (frame === "terminal") {
    return (
      <div className="h-9 w-full flex items-center px-4 gap-2 border-b shrink-0" style={{ background: "#1e1e1e", borderColor: "rgba(255,255,255,0.06)", borderRadius: `${radius}px ${radius}px 0 0` }}>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ background: "#ff5f56" }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "#ffbd2e" }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "#27c93f" }} />
        </div>
        <span className="text-xs text-white/40 mx-auto font-mono">bash — 80×24</span>
      </div>
    );
  }
  if (frame === "iphone") {
    return (
      <div className="absolute inset-0 pointer-events-none z-10" style={{ borderRadius: `${Math.max(radius, 24)}px` }}>
        {/* Dynamic island */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 rounded-full bg-black z-20" />
        {/* Side buttons */}
        <div className="absolute -left-1 top-24 w-1 h-10 rounded-l bg-white/20" />
        <div className="absolute -left-1 top-36 w-1 h-10 rounded-l bg-white/20" />
        <div className="absolute -right-1 top-28 w-1 h-14 rounded-r bg-white/20" />
        <div className="absolute inset-0 rounded-[inherit] border-4 border-white/10 shadow-inner" />
      </div>
    );
  }
  if (frame === "android") {
    return (
      <div className="absolute inset-0 pointer-events-none z-10" style={{ borderRadius: `${Math.max(radius, 16)}px` }}>
        {/* Camera punch-hole */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-black z-20" />
        <div className="absolute inset-0 rounded-[inherit] border-4 border-white/10 shadow-inner" />
        {/* Bottom nav indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full bg-white/30" />
      </div>
    );
  }
  if (frame === "ipad") {
    return (
      <div className="absolute inset-0 pointer-events-none z-10" style={{ borderRadius: `${Math.max(radius, 12)}px` }}>
        {/* Home button area */}
        <div className="absolute top-1/2 -translate-y-1/2 -right-2 w-2 h-8 rounded-r bg-white/15" />
        <div className="absolute inset-0 rounded-[inherit] border-4 border-white/10 shadow-inner" />
        {/* Camera */}
        <div className="absolute top-1/2 -translate-y-1/2 left-2 w-2 h-2 rounded-full bg-white/20" />
      </div>
    );
  }
  if (frame === "polaroid") {
    return null; // handled as wrapper padding
  }
  if (frame === "border") {
    return (
      <div className="absolute inset-0 pointer-events-none z-10 border-2 border-white/25" style={{ borderRadius: `${radius}px` }} />
    );
  }
  return null;
}

// --- EDITOR ---
function Editor() {
  const [image, setImage] = useState<string | null>(null);
  const [bg, setBg] = useState(GRADIENTS[0].value);
  const [padding, setPadding] = useState(64);
  const [shadow, setShadow] = useState(true);
  const [shadowIntensity, setShadowIntensity] = useState("medium");
  const [frame, setFrame] = useState("macos");
  const [radius, setRadius] = useState(12);
  const [exportRes, setExportRes] = useState(2);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dimension, setDimension] = useState(DIMENSIONS[0]); // free
  const [dimOpen, setDimOpen] = useState(false);

  // Image position & scale (for fixed-dimension mode)
  const [imgX, setImgX] = useState(0);
  const [imgY, setImgY] = useState(0);
  const [imgScale, setImgScale] = useState(1);

  const [annotations, setAnnotations]           = useState<Annotation[]>([]);
  const [selectedAnnId, setSelectedAnnId]       = useState<string | null>(null);

  const selectedAnn = annotations.find(a => a.id === selectedAnnId) ?? null;

  const addAnnotation = (type: Annotation["type"]) => {
    const id = crypto.randomUUID();
    setAnnotations(prev => [...prev, {
      id, type,
      x: 50, y: 50,
      text: type === "arrow" ? "" : type === "label" ? "Label" : "Caption",
      color: "#f5c518",
      fontSize: 18,
      arrowDir: "right",
    }]);
    setSelectedAnnId(id);
  };

  const ANN_COLORS = ["#f5c518","#ffffff","#000000","#ef4444","#3b82f6","#22c55e","#a855f7","#f97316"];
  const ANN_SIZES  = [12, 16, 20, 28, 36];

  const exportRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{ startX: number; startY: number; ox: number; oy: number } | null>(null);

  // Listen for screenshots injected by the comet Chrome extension content bridge
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "COMET_SCREENSHOT" && typeof e.data.dataUrl === "string") {
        setImage(e.data.dataUrl);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const isFree = dimension.id === "free";

  // Reset position when dimension changes
  const selectDimension = (d: typeof DIMENSIONS[number]) => {
    setDimension(d);
    setImgX(0);
    setImgY(0);
    setImgScale(1);
    setDimOpen(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (ev) => { if (ev.target?.result) setImage(ev.target.result as string); };
    reader.readAsDataURL(file);
  };

  const handleExport = async (type: "download" | "copy") => {
    if (!exportRef.current || isExporting) return;
    setIsExporting(true);
    try {
      const { default: html2canvas } = await import("html2canvas-pro");
      const canvas = await html2canvas(exportRef.current, {
        scale: exportRes,
        backgroundColor: null,
        useCORS: true,
        allowTaint: true,
      });
      if (type === "download") {
        const link = document.createElement("a");
        link.download = `anthrax-${Date.now()}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      } else {
        const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/png"));
        if (blob) {
          try {
            await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
          } catch {
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.download = `anthrax-${Date.now()}.png`;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
          }
        }
      }
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const getShadow = () => {
    if (!shadow) return "none";
    return { soft: "0 8px 24px rgba(0,0,0,0.3)", medium: "0 16px 48px rgba(0,0,0,0.45)", strong: "0 24px 72px rgba(0,0,0,0.65)" }[shadowIntensity] ?? "none";
  };

  // Drag handlers for image inside fixed canvas
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (isFree || !image) return;
    e.preventDefault();
    dragState.current = { startX: e.clientX, startY: e.clientY, ox: imgX, oy: imgY };
    const onMove = (ev: MouseEvent) => {
      if (!dragState.current) return;
      setImgX(dragState.current.ox + ev.clientX - dragState.current.startX);
      setImgY(dragState.current.oy + ev.clientY - dragState.current.startY);
    };
    const onUp = () => {
      dragState.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [isFree, image, imgX, imgY]);

  // Polaroid adds big bottom padding
  const isPolaroid = frame === "polaroid";
  const isPhone = frame === "iphone" || frame === "android" || frame === "ipad";

  const imageShadow = getShadow();
  const imageRadius = `${radius}px`;

  // Canvas aspect ratio
  const aspectRatio = isFree ? undefined : `${dimension.w} / ${dimension.h}`;

  return (
    <div className="h-screen w-full flex overflow-hidden" style={{ background: "#0a0a0a", color: "#fff" }}>

      {/* LEFT — PREVIEW */}
      <div className="flex-1 h-full flex flex-col relative border-r" style={{ borderColor: "rgba(245,197,24,0.1)" }}>
        {/* Top bar */}
        <div className="absolute top-0 left-0 w-full h-14 border-b z-10 flex items-center px-5 justify-between backdrop-blur-sm" style={{ background: "rgba(10,10,10,0.9)", borderColor: "rgba(245,197,24,0.1)" }}>
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#111", border: "1.5px solid rgba(245,197,24,0.3)" }}>
              <CometIcon size={16} />
            </div>
            <span className="font-bold text-base tracking-tight text-white" style={{ letterSpacing: "-0.02em" }}>comet</span>
          </Link>
          <div className="flex items-center gap-3">
            {!isFree && image && (
              <span className="text-xs px-2 py-1 rounded border flex items-center gap-1.5" style={{ borderColor: "rgba(245,197,24,0.3)", color: Y, background: "rgba(245,197,24,0.07)" }}>
                <Move size={11} /> Drag to move · Scroll sidebar to scale
              </span>
            )}
            {image && (
              <button onClick={() => setImage(null)} className="text-xs font-medium flex items-center gap-1 transition-colors" style={{ color: "rgba(255,100,100,0.8)" }}>
                <Trash2 size={13} /> Clear
              </button>
            )}
          </div>
        </div>

        <div
          className="flex-1 w-full h-full flex items-center justify-center p-10 pt-24 overflow-auto"
          style={{ backgroundImage: "radial-gradient(rgba(245,197,24,0.04) 1px, transparent 1px)", backgroundSize: "20px 20px" }}
        >
          {!image ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="relative w-full max-w-2xl aspect-video rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer group transition-all border-2 border-dashed"
              style={{ borderColor: "rgba(245,197,24,0.25)", background: "rgba(245,197,24,0.03)" }}
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center transition-transform group-hover:scale-110" style={{ background: "rgba(245,197,24,0.12)", color: Y }}>
                <Upload size={28} />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold mb-1.5 text-white">Drag & drop your screenshot</h3>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>Or click to browse files (PNG, JPG, WebP)</p>
              </div>
              <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
            </div>
          ) : isFree ? (
            /* FREE MODE — original padding-based layout */
            <div
              ref={exportRef}
              style={{ background: bg, padding: `${padding}px`, position: "relative" }}
              className="flex items-center justify-center transition-all duration-300 min-w-[280px] min-h-[280px]"
            >
              <div className="relative overflow-hidden transition-all duration-300 flex flex-col" style={{ borderRadius: imageRadius, boxShadow: imageShadow }}>
                {!isPhone && <FrameChrome frame={frame} radius={radius} />}
                {isPhone && <div className="relative" style={{ borderRadius: imageRadius }}>
                  <FrameChrome frame={frame} radius={radius} />
                  <img src={image} alt="Preview" className="block max-w-[900px] max-h-[600px] object-contain" style={{ borderRadius: `0 0 ${imageRadius} ${imageRadius}` }} />
                </div>}
                {!isPhone && (
                  <img src={image} alt="Preview" className="block max-w-[900px] max-h-[600px] object-contain bg-white"
                    style={{ borderRadius: ["macos","browser","arc","terminal"].includes(frame) ? `0 0 ${imageRadius} ${imageRadius}` : imageRadius }}
                  />
                )}
                {isPolaroid && <div className="bg-white" style={{ height: "80px" }} />}
              </div>
              <AnnotationLayer
                annotations={annotations}
                onChange={setAnnotations}
                selectedId={selectedAnnId}
                onSelect={setSelectedAnnId}
                isExporting={isExporting}
              />
            </div>
          ) : (
            /* FIXED DIMENSION MODE — draggable image within canvas */
            <div
              className="relative overflow-hidden shadow-2xl"
              style={{ aspectRatio, maxWidth: "100%", maxHeight: "calc(100vh - 130px)", width: dimension.w >= dimension.h ? "min(700px, 100%)" : "auto", height: dimension.w < dimension.h ? "min(700px, calc(100vh - 130px))" : "auto", flexShrink: 0 }}
            >
              <div
                ref={exportRef}
                className="absolute inset-0"
                style={{ background: bg, overflow: "hidden" }}
                onMouseDown={onMouseDown}
              >
                {image && (
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ cursor: dragState.current ? "grabbing" : "grab" }}
                  >
                    <div
                      className="relative flex flex-col transition-none overflow-hidden"
                      style={{
                        transform: `translate(${imgX}px, ${imgY}px) scale(${imgScale})`,
                        borderRadius: imageRadius,
                        boxShadow: imageShadow,
                        willChange: "transform",
                      }}
                    >
                      {!isPhone && <FrameChrome frame={frame} radius={radius} />}
                      {isPhone && (
                        <div className="relative" style={{ borderRadius: imageRadius }}>
                          <FrameChrome frame={frame} radius={radius} />
                          <img src={image} alt="Preview" className="block max-w-[400px] max-h-[500px] object-contain" style={{ borderRadius: `0 0 ${imageRadius} ${imageRadius}` }} />
                        </div>
                      )}
                      {!isPhone && (
                        <img src={image} alt="Preview" className="block max-w-[600px] max-h-[450px] object-contain bg-white"
                          style={{ borderRadius: ["macos","browser","arc","terminal"].includes(frame) ? `0 0 ${imageRadius} ${imageRadius}` : imageRadius }}
                        />
                      )}
                      {isPolaroid && <div className="bg-white" style={{ height: "60px" }} />}
                    </div>
                  </div>
                )}
                <AnnotationLayer
                  annotations={annotations}
                  onChange={setAnnotations}
                  selectedId={selectedAnnId}
                  onSelect={setSelectedAnnId}
                  isExporting={isExporting}
                />
              </div>
              {/* Dimension label overlay */}
              <div className="absolute bottom-2 right-2 text-[10px] px-2 py-0.5 rounded font-mono pointer-events-none" style={{ background: "rgba(0,0,0,0.5)", color: "rgba(255,255,255,0.5)" }}>
                {dimension.w}×{dimension.h}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT — CONTROLS */}
      <div className="w-[380px] h-full flex flex-col overflow-y-auto border-l" style={{ background: "#0e0e0e", borderColor: "rgba(245,197,24,0.1)" }}>
        <div className="p-5 border-b" style={{ borderColor: "rgba(245,197,24,0.1)" }}>
          <h2 className="text-base font-bold flex items-center gap-2 text-white"><Wand2 size={17} style={{ color: Y }} /> Editor Controls</h2>
          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>Make your screenshot beautiful.</p>
        </div>

        <div className="p-5 space-y-7 flex-1">

          {/* Canvas Dimension */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>Canvas Dimension</h3>
            <div className="relative">
              <button
                onClick={() => setDimOpen(!dimOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-sm font-medium text-white transition-colors hover:border-yellow-400/40"
                style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.12)" }}
              >
                <span>{dimension.name}</span>
                <ChevronDown size={15} className={`transition-transform ${dimOpen ? "rotate-180" : ""}`} style={{ color: Y }} />
              </button>
              {dimOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border overflow-hidden z-30 shadow-2xl" style={{ background: "#1a1a1a", borderColor: "rgba(245,197,24,0.2)" }}>
                  {DIMENSIONS.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => selectDimension(d)}
                      className="w-full text-left px-3 py-2 text-sm transition-colors flex items-center justify-between"
                      style={{
                        background: dimension.id === d.id ? "rgba(245,197,24,0.12)" : "transparent",
                        color: dimension.id === d.id ? Y : "rgba(255,255,255,0.75)",
                      }}
                      onMouseEnter={(e) => { if (dimension.id !== d.id) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                      onMouseLeave={(e) => { if (dimension.id !== d.id) e.currentTarget.style.background = "transparent"; }}
                    >
                      <span>{d.name}</span>
                      {d.w > 0 && <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>{d.w}×{d.h}</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Image Scale — only in fixed dimension mode */}
          {!isFree && image && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.35)" }}>Image Scale</h3>
                <div className="flex items-center gap-2">
                  <button onClick={() => setImgScale((s) => Math.max(0.2, +(s - 0.1).toFixed(2)))} className="w-6 h-6 rounded flex items-center justify-center border transition-colors hover:border-yellow-400/40" style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)" }}><ZoomOut size={12} /></button>
                  <span className="text-xs font-mono px-2 py-0.5 rounded min-w-[42px] text-center" style={{ background: "rgba(245,197,24,0.1)", color: Y }}>{Math.round(imgScale * 100)}%</span>
                  <button onClick={() => setImgScale((s) => Math.min(3, +(s + 0.1).toFixed(2)))} className="w-6 h-6 rounded flex items-center justify-center border transition-colors hover:border-yellow-400/40" style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)" }}><ZoomIn size={12} /></button>
                </div>
              </div>
              <input type="range" min="0.2" max="3" step="0.05" value={imgScale} onChange={(e) => setImgScale(Number(e.target.value))} className="w-full" style={{ accentColor: Y }} />
              <div className="mt-2 flex justify-end">
                <button onClick={() => { setImgX(0); setImgY(0); setImgScale(1); }} className="text-xs flex items-center gap-1 transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.4)" }}>
                  <RotateCcw size={11} /> Reset position
                </button>
              </div>
            </div>
          )}

          {/* Background */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>Background</h3>
            <p className="text-xs mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>Gradients</p>
            <div className="grid grid-cols-6 gap-2 mb-3">
              {GRADIENTS.map((g, i) => (
                <button key={i} onClick={() => setBg(g.value)} className="w-9 h-9 rounded-full border-2 hover:scale-110 transition-transform" style={{ background: g.value, borderColor: bg === g.value ? Y : "transparent", transform: bg === g.value ? "scale(1.15)" : undefined }} title={g.name} />
              ))}
            </div>
            <p className="text-xs mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>Solid Colors</p>
            <div className="flex gap-2">
              {SOLIDS.map((s, i) => (
                <button key={i} onClick={() => setBg(s.value)} className="w-9 h-9 rounded-full border hover:scale-110 transition-transform" style={{ background: s.value, borderColor: "rgba(255,255,255,0.15)", outline: bg === s.value ? `2px solid ${Y}` : "none", outlineOffset: "2px" }} title={s.name} />
              ))}
            </div>
          </div>

          {/* Padding — only in free mode */}
          {isFree && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.35)" }}>Padding</h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ background: "rgba(245,197,24,0.1)", color: Y }}>{padding}px</span>
              </div>
              <input type="range" min="0" max="128" step="8" value={padding} onChange={(e) => setPadding(Number(e.target.value))} className="w-full" style={{ accentColor: Y }} />
            </div>
          )}

          {/* Rounded Corners */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.35)" }}>Rounded Corners</h3>
              <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ background: "rgba(245,197,24,0.1)", color: Y }}>{radius}px</span>
            </div>
            <input type="range" min="0" max="32" step="2" value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="w-full" style={{ accentColor: Y }} />
          </div>

          {/* Window Frame */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>Window Frame</h3>
            <div className="grid grid-cols-2 gap-2">
              {FRAMES.map((f) => (
                <button key={f.id} onClick={() => setFrame(f.id)} className="px-3 py-2 rounded-lg text-xs font-medium border transition-colors" style={{ background: frame === f.id ? Y : "rgba(255,255,255,0.04)", borderColor: frame === f.id ? Y : "rgba(255,255,255,0.1)", color: frame === f.id ? "#000" : "rgba(255,255,255,0.7)" }}>
                  {f.name}
                </button>
              ))}
            </div>
          </div>

          {/* Shadow */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.35)" }}>Drop Shadow</h3>
              <button onClick={() => setShadow(!shadow)} className="w-11 h-6 rounded-full p-1 transition-colors" style={{ background: shadow ? Y : "rgba(255,255,255,0.15)" }}>
                <div className="w-4 h-4 rounded-full bg-white transition-transform" style={{ transform: shadow ? "translateX(20px)" : "translateX(0)" }} />
              </button>
            </div>
            {shadow && (
              <div className="flex gap-2">
                {["soft", "medium", "strong"].map((level) => (
                  <button key={level} onClick={() => setShadowIntensity(level)} className="flex-1 py-1.5 rounded-md text-xs font-medium capitalize border transition-colors" style={{ background: shadowIntensity === level ? "rgba(255,255,255,0.1)" : "transparent", borderColor: shadowIntensity === level ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)", color: shadowIntensity === level ? "#fff" : "rgba(255,255,255,0.5)" }}>
                    {level}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Annotations */}
          {image && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>Annotations</h3>

              {/* Add buttons */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                {([
                  { type: "text",  label: "T  Text",  icon: "T" },
                  { type: "label", label: "◉ Label",  icon: "◉" },
                  { type: "arrow", label: "→ Arrow",  icon: "→" },
                ] as const).map(({ type, label }) => (
                  <button
                    key={type}
                    onClick={() => addAnnotation(type)}
                    className="py-2 rounded-lg text-xs font-semibold border transition-colors hover:border-yellow-400/40"
                    style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.75)" }}
                  >{label}</button>
                ))}
              </div>

              {/* Selected annotation controls */}
              {selectedAnn && (
                <div className="rounded-xl p-3 mb-3 space-y-3" style={{ background: "rgba(245,197,24,0.05)", border: "1px solid rgba(245,197,24,0.15)" }}>
                  {/* Color */}
                  <div>
                    <p className="text-[10px] uppercase tracking-wider mb-1.5" style={{ color: "rgba(255,255,255,0.35)" }}>Color</p>
                    <div className="flex gap-1.5 flex-wrap">
                      {ANN_COLORS.map(c => (
                        <button
                          key={c}
                          onClick={() => setAnnotations(a => a.map(x => x.id === selectedAnnId ? { ...x, color: c } : x))}
                          className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110"
                          style={{ background: c, borderColor: selectedAnn.color === c ? Y : "transparent" }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Font size */}
                  {selectedAnn.type !== "arrow" && (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-[10px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.35)" }}>Size</p>
                        <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ background: "rgba(245,197,24,0.1)", color: Y }}>{selectedAnn.fontSize}px</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="72"
                        step="1"
                        value={selectedAnn.fontSize}
                        onChange={(e) => setAnnotations(a => a.map(x => x.id === selectedAnnId ? { ...x, fontSize: Number(e.target.value) } : x))}
                        className="w-full"
                        style={{ accentColor: Y }}
                      />
                    </div>
                  )}

                  {/* Arrow direction */}
                  {selectedAnn.type === "arrow" && (
                    <div>
                      <p className="text-[10px] uppercase tracking-wider mb-1.5" style={{ color: "rgba(255,255,255,0.35)" }}>Direction</p>
                      <div className="grid grid-cols-4 gap-1.5">
                        {(["up","down","left","right"] as const).map(dir => (
                          <button
                            key={dir}
                            onClick={() => setAnnotations(a => a.map(x => x.id === selectedAnnId ? { ...x, arrowDir: dir } : x))}
                            className="py-1.5 rounded text-sm border transition-colors"
                            style={{
                              background: selectedAnn.arrowDir === dir ? "rgba(245,197,24,0.15)" : "transparent",
                              borderColor: selectedAnn.arrowDir === dir ? Y : "rgba(255,255,255,0.1)",
                            }}
                          >{{ up:"↑", down:"↓", left:"←", right:"→" }[dir]}</button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Annotation list */}
              {annotations.length > 0 && (
                <div className="space-y-1">
                  {annotations.map(ann => (
                    <div
                      key={ann.id}
                      onClick={() => setSelectedAnnId(ann.id)}
                      className="flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer transition-colors"
                      style={{
                        background: selectedAnnId === ann.id ? "rgba(245,197,24,0.1)" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${selectedAnnId === ann.id ? "rgba(245,197,24,0.25)" : "rgba(255,255,255,0.07)"}`,
                      }}
                    >
                      <span className="text-sm w-4 text-center flex-shrink-0" style={{ color: ann.color }}>
                        {ann.type === "text" ? "T" : ann.type === "label" ? "◉" : "→"}
                      </span>
                      <span className="text-xs flex-1 truncate" style={{ color: "rgba(255,255,255,0.6)" }}>
                        {ann.text || (ann.type === "arrow" ? `Arrow ${ann.arrowDir}` : "—")}
                      </span>
                      <button
                        className="text-xs opacity-0 hover:opacity-100 transition-opacity px-1"
                        style={{ color: "rgba(255,100,100,0.7)" }}
                        onClick={(e) => { e.stopPropagation(); setAnnotations(a => a.filter(x => x.id !== ann.id)); if (selectedAnnId === ann.id) setSelectedAnnId(null); }}
                      >✕</button>
                    </div>
                  ))}
                </div>
              )}

              {annotations.length === 0 && (
                <p className="text-xs text-center py-3" style={{ color: "rgba(255,255,255,0.2)" }}>
                  Add text, labels or arrows over your screenshot
                </p>
              )}
            </div>
          )}
        </div>

        {/* Export Footer */}
        <div className="p-5 border-t mt-auto" style={{ borderColor: "rgba(245,197,24,0.1)" }}>
          <div className="flex items-center gap-1 mb-3 p-1 rounded-lg" style={{ background: "rgba(255,255,255,0.04)" }}>
            {[1, 2, 3].map((res) => (
              <button key={res} onClick={() => setExportRes(res)} className="flex-1 py-1 text-xs font-medium rounded-md transition-colors" style={{ background: exportRes === res ? Y : "transparent", color: exportRes === res ? "#000" : "rgba(255,255,255,0.5)" }}>{res}x</button>
            ))}
          </div>
          <button onClick={() => handleExport("download")} disabled={!image || isExporting} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all shadow-lg mb-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed" style={{ background: Y, color: "#000" }}>
            <Download size={16} />
            {isExporting ? "Processing..." : "Download PNG"}
          </button>
          <button onClick={() => handleExport("copy")} disabled={!image || isExporting} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all text-sm border disabled:opacity-40 disabled:cursor-not-allowed" style={{ background: copied ? "rgba(245,197,24,0.1)" : "rgba(255,255,255,0.04)", borderColor: copied ? Y : "rgba(255,255,255,0.1)", color: copied ? Y : "rgba(255,255,255,0.8)" }}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Copied!" : "Copy to Clipboard"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/editor" component={Editor} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
