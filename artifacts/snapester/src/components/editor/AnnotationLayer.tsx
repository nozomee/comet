import React, { useRef, useCallback, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AnnotationType = "text" | "label" | "arrow";
export type ArrowDir = "right" | "left" | "up" | "down";

export interface Annotation {
  id: string;
  type: AnnotationType;
  x: number;        // 0–100 % within the export canvas
  y: number;        // 0–100 %
  text: string;
  color: string;
  fontSize: number;
  arrowDir: ArrowDir;
}

// ─── Arrow SVG paths ──────────────────────────────────────────────────────────

const ARROW: Record<ArrowDir, string> = {
  right: "M4 12h16M14 6l6 6-6 6",
  left:  "M20 12H4M10 6L4 12l6 6",
  up:    "M12 20V4M6 10l6-6 6 6",
  down:  "M12 4v16M6 14l6 6 6-6",
};

// ─── Single annotation item ───────────────────────────────────────────────────

interface ItemProps {
  ann: Annotation;
  selected: boolean;
  isExporting: boolean;
  onPointerDown: (e: React.PointerEvent) => void;
  onUpdate: (patch: Partial<Annotation>) => void;
  onDelete: () => void;
}

function AnnotationItem({ ann, selected, isExporting, onPointerDown, onUpdate, onDelete }: ItemProps) {
  const [editing, setEditing] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);

  const enterEdit = (e: React.MouseEvent) => {
    if (isExporting) return;
    e.stopPropagation();
    setEditing(true);
    setTimeout(() => {
      const el = textRef.current;
      if (!el) return;
      el.focus();
      const range = document.createRange();
      range.selectNodeContents(el);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }, 0);
  };

  const exitEdit = () => {
    setEditing(false);
    if (textRef.current) onUpdate({ text: textRef.current.textContent ?? ann.text });
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" || e.key === "Enter") { e.preventDefault(); (e.target as HTMLElement).blur(); }
  };

  const wrap: React.CSSProperties = {
    position: "absolute",
    left: `${ann.x}%`,
    top: `${ann.y}%`,
    transform: "translate(-50%,-50%)",
    pointerEvents: isExporting ? "none" : "auto",
    cursor: isExporting ? "default" : editing ? "text" : "grab",
    userSelect: "none",
    zIndex: selected ? 20 : 10,
  };

  const deleteBtn = selected && !isExporting && (
    <button
      className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full flex items-center justify-center text-white font-black"
      style={{ background: "#ef4444", fontSize: 11, zIndex: 30, pointerEvents: "auto" }}
      onPointerDown={(e) => { e.stopPropagation(); onDelete(); }}
    >×</button>
  );

  // ── Text ──
  if (ann.type === "text") {
    return (
      <div style={wrap} onPointerDown={onPointerDown} onDoubleClick={enterEdit}>
        <span
          ref={textRef}
          contentEditable={editing}
          suppressContentEditableWarning
          onBlur={exitEdit}
          onKeyDown={onKey}
          className="block font-bold whitespace-nowrap rounded px-0.5"
          style={{
            color: ann.color,
            fontSize: ann.fontSize,
            textShadow: "0 1px 6px rgba(0,0,0,0.7)",
            outline: selected && !isExporting ? "1.5px dashed rgba(245,197,24,0.5)" : "none",
            outlineOffset: 4,
          }}
        >{ann.text}</span>
        {deleteBtn}
      </div>
    );
  }

  // ── Label ──
  if (ann.type === "label") {
    return (
      <div style={wrap} onPointerDown={onPointerDown} onDoubleClick={enterEdit}>
        <span
          ref={textRef}
          contentEditable={editing}
          suppressContentEditableWarning
          onBlur={exitEdit}
          onKeyDown={onKey}
          className="block font-bold whitespace-nowrap px-3 py-1 rounded-full"
          style={{
            background: ann.color,
            color: isLight(ann.color) ? "#000" : "#fff",
            fontSize: ann.fontSize,
            boxShadow: "0 2px 10px rgba(0,0,0,0.4)",
            outline: selected && !isExporting ? "1.5px dashed rgba(245,197,24,0.6)" : "none",
            outlineOffset: 3,
          }}
        >{ann.text}</span>
        {deleteBtn}
      </div>
    );
  }

  // ── Arrow ──
  const isVertical = ann.arrowDir === "up" || ann.arrowDir === "down";
  const textBefore = (ann.arrowDir === "up" || ann.arrowDir === "left") && ann.text;
  const textAfter  = (ann.arrowDir === "down" || ann.arrowDir === "right") && ann.text;

  return (
    <div
      style={{ ...wrap, display: "flex", flexDirection: isVertical ? "column" : "row", alignItems: "center", gap: 4 }}
      onPointerDown={onPointerDown}
      onDoubleClick={enterEdit}
    >
      {textBefore && (
        <span ref={textRef} contentEditable={editing} suppressContentEditableWarning
          onBlur={exitEdit} onKeyDown={onKey}
          className="font-bold whitespace-nowrap"
          style={{ color: ann.color, fontSize: ann.fontSize, textShadow: "0 1px 6px rgba(0,0,0,0.7)" }}
        >{ann.text}</span>
      )}
      <svg
        width={isVertical ? 28 : 48}
        height={isVertical ? 48 : 28}
        viewBox="0 0 24 24"
        fill="none"
        style={{ filter: "drop-shadow(0 1px 4px rgba(0,0,0,0.5))", flexShrink: 0, outline: selected && !isExporting ? "1.5px dashed rgba(245,197,24,0.5)" : "none" }}
      >
        <path d={ARROW[ann.arrowDir]} stroke={ann.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {textAfter && (
        <span ref={textRef} contentEditable={editing} suppressContentEditableWarning
          onBlur={exitEdit} onKeyDown={onKey}
          className="font-bold whitespace-nowrap"
          style={{ color: ann.color, fontSize: ann.fontSize, textShadow: "0 1px 6px rgba(0,0,0,0.7)" }}
        >{ann.text}</span>
      )}
      {deleteBtn}
    </div>
  );
}

// ─── Layer (goes inside exportRef) ───────────────────────────────────────────

interface LayerProps {
  annotations: Annotation[];
  onChange: (next: Annotation[]) => void;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  isExporting?: boolean;
}

export default function AnnotationLayer({
  annotations, onChange, selectedId, onSelect, isExporting = false,
}: LayerProps) {
  const layerRef = useRef<HTMLDivElement>(null);
  // Mirror ref so drag closure always has the latest array
  const annRef = useRef(annotations);
  annRef.current = annotations;

  const startDrag = useCallback((e: React.PointerEvent, id: string) => {
    if (isExporting) return;
    e.stopPropagation();
    e.preventDefault();
    onSelect(id);

    const layer = layerRef.current;
    if (!layer) return;

    const rect = layer.getBoundingClientRect();
    const ann = annRef.current.find(a => a.id === id);
    if (!ann) return;

    const startX = e.clientX, startY = e.clientY;
    const origX = ann.x,      origY = ann.y;

    const onMove = (ev: PointerEvent) => {
      const dx = ((ev.clientX - startX) / rect.width)  * 100;
      const dy = ((ev.clientY - startY) / rect.height) * 100;
      onChange(annRef.current.map(a => a.id === id
        ? { ...a, x: clamp(origX + dx, 2, 98), y: clamp(origY + dy, 2, 98) }
        : a
      ));
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup",   onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup",   onUp);
  }, [isExporting, onChange, onSelect]);

  return (
    <div
      ref={layerRef}
      className="absolute inset-0"
      style={{ pointerEvents: isExporting ? "none" : "auto", zIndex: 10 }}
      onPointerDown={(e) => { if (e.target === layerRef.current) onSelect(null); }}
    >
      {annotations.map(ann => (
        <AnnotationItem
          key={ann.id}
          ann={ann}
          selected={selectedId === ann.id}
          isExporting={isExporting}
          onPointerDown={(e) => startDrag(e, ann.id)}
          onUpdate={(patch) => onChange(annRef.current.map(a => a.id === ann.id ? { ...a, ...patch } : a))}
          onDelete={() => { onChange(annRef.current.filter(a => a.id !== ann.id)); onSelect(null); }}
        />
      ))}
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function clamp(v: number, min: number, max: number) { return Math.max(min, Math.min(max, v)); }

/** Very rough lightness check to decide text colour on label backgrounds */
function isLight(hex: string): boolean {
  const c = hex.replace("#", "");
  if (c.length !== 6) return false;
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 128;
}
