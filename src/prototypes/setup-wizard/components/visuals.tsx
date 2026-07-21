/* eslint-disable react/no-unknown-property */
/**
 * setup-wizard / components / visuals — abstract animated illustrations.
 *
 * 7 self-contained SVG visuals, one per wizard step. Each is a clean,
 * abstract, geometric motion graphic — NO characters, NO animals. All
 * colors come from CSS custom properties (var(--color-primary), etc.) so
 * they adapt to the active palette + theme mode automatically.
 *
 * Design language shared across all 7:
 *   - 200×200 viewBox (240×240 for finish), overflow visible for glows
 *   - Soft blurred "glow" layer behind the main shape for depth
 *   - Primary-colored accent + tertiary/warn/secondary accents
 *   - Smooth, looped CSS animations (transform + opacity only — cheap)
 *   - prefers-reduced-motion aware
 *   - Per-instance useId() namespacing so multiple can coexist
 *
 * The visuals:
 *   1. WelcomeVisual      — moving background only: concentric pulsing
 *                            rings + orbiting dots + ambient sparkles
 *                            (central logo removed per user request)
 *   2. ThemeVisual        — two counter-rotating orbits of color dots
 *                            around a central palette swatch
 *   3. FolderVisual       — a tall folder with floating file cards;
 *                            supports a `selected` prop that overlays a
 *                            success checkmark badge
 *   4. PermissionsVisual  — shield with rich animated background: rotating
 *                            dashed rings + floating particles + ripple
 *                            waves + animated checkmark
 *   5. RestoreVisual      — larger cloud with flowing data stream into a
 *                            tray, with animated background rings
 *   6. SummaryVisual      — growing bar chart with trend arrow + sparkles
 *   7. FinishVisual       — elegant celebration: rotating light rays +
 *                            multi-layer expanding rings + glowing star
 *                            badge + drifting sparkle particles
 */
import { useId } from "react";

/* ------------------------------------------------------------------ */
/* Shared helper: soft blurred glow blob                              */
/* ------------------------------------------------------------------ */
function Glow({ cx, cy, r, color, opacity = 0.35 }: {
  cx: number;
  cy: number;
  r: number;
  color: string;
  opacity?: number;
}) {
  return (
    <circle cx={cx} cy={cy} r={r} fill={color} opacity={opacity} style={{ filter: "blur(8px)" }} />
  );
}

/* ------------------------------------------------------------------ */
/* 1. WelcomeVisual — moving background only (no central logo)        */
/* ------------------------------------------------------------------ */
export function WelcomeVisual() {
  const uid = useId().replace(/[:]/g, "");
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label="Animated welcome background" style={{ overflow: "visible" }}>
      <style>{`
        .wv-ring-${uid} {
          transform-box: fill-box;
          transform-origin: center;
        }
        .wv-ring-1-${uid} { animation: wv-pulse-${uid} 3s ease-in-out infinite; }
        .wv-ring-2-${uid} { animation: wv-pulse-${uid} 3s ease-in-out infinite 0.4s; }
        .wv-ring-3-${uid} { animation: wv-pulse-${uid} 3s ease-in-out infinite 0.8s; }
        .wv-ring-4-${uid} { animation: wv-pulse-${uid} 3s ease-in-out infinite 1.2s; }
        @keyframes wv-pulse-${uid} {
          0%, 100% { transform: scale(0.9); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.7; }
        }
        .wv-orbit-${uid} {
          transform-box: fill-box;
          transform-origin: 100px 100px;
        }
        .wv-orbit-1-${uid} { animation: wv-spin-${uid} 8s linear infinite; }
        .wv-orbit-2-${uid} { animation: wv-spin-${uid} 12s linear infinite reverse; }
        @keyframes wv-spin-${uid} {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .wv-spark-${uid} {
          transform-box: fill-box;
          transform-origin: center;
          animation: wv-twinkle-${uid} 1.8s ease-in-out infinite;
        }
        @keyframes wv-twinkle-${uid} {
          0%, 100% { opacity: 0.15; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @media (prefers-reduced-motion: reduce) {
          .wv-ring-${uid}, .wv-orbit-${uid}, .wv-spark-${uid} {
            animation: none !important;
          }
        }
      `}</style>

      {/* Soft glow behind everything */}
      <Glow cx={100} cy={100} r={60} color="var(--color-primary)" opacity={0.25} />

      {/* Concentric pulsing rings (4 layers for richer depth) */}
      <circle className={`wv-ring wv-ring-1-${uid}`} cx={100} cy={100} r={80} fill="none" stroke="var(--color-primary)" strokeWidth={1.5} opacity={0.3} />
      <circle className={`wv-ring wv-ring-2-${uid}`} cx={100} cy={100} r={62} fill="none" stroke="var(--color-primary)" strokeWidth={2} opacity={0.45} />
      <circle className={`wv-ring wv-ring-3-${uid}`} cx={100} cy={100} r={44} fill="none" stroke="var(--color-primary)" strokeWidth={2} opacity={0.6} />
      <circle className={`wv-ring wv-ring-4-${uid}`} cx={100} cy={100} r={26} fill="none" stroke="var(--color-primary)" strokeWidth={2.5} opacity={0.75} />

      {/* Inner orbit (3 dots, faster) */}
      <g className={`wv-orbit wv-orbit-1-${uid}`}>
        <circle cx={100} cy={44} r={5} fill="var(--color-primary)" />
        <circle cx={148.5} cy={128} r={4} fill="var(--color-tertiary)" />
        <circle cx={51.5} cy={128} r={4} fill="var(--color-warn)" />
      </g>

      {/* Outer orbit (4 dots, slower, reverse) */}
      <g className={`wv-orbit wv-orbit-2-${uid}`}>
        <circle cx={100} cy={24} r={3} fill="var(--color-secondary)" />
        <circle cx={176} cy={100} r={3} fill="var(--color-primary)" opacity={0.7} />
        <circle cx={100} cy={176} r={3} fill="var(--color-tertiary)" opacity={0.7} />
        <circle cx={24} cy={100} r={3} fill="var(--color-warn)" opacity={0.7} />
      </g>

      {/* Ambient sparkles (6, scattered) */}
      <circle className={`wv-spark-${uid}`} cx={36} cy={50} r={2.5} fill="var(--color-primary)" />
      <circle className={`wv-spark-${uid}`} cx={168} cy={60} r={2} fill="var(--color-tertiary)" style={{ animationDelay: "0.6s" }} />
      <circle className={`wv-spark-${uid}`} cx={40} cy={158} r={2} fill="var(--color-warn)" style={{ animationDelay: "1.1s" }} />
      <circle className={`wv-spark-${uid}`} cx={164} cy={150} r={2.5} fill="var(--color-primary)" style={{ animationDelay: "0.3s" }} />
      <circle className={`wv-spark-${uid}`} cx={100} cy={20} r={1.8} fill="var(--color-secondary)" style={{ animationDelay: "0.9s" }} />
      <circle className={`wv-spark-${uid}`} cx={100} cy={180} r={1.8} fill="var(--color-primary)" style={{ animationDelay: "1.4s" }} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 2. ThemeVisual — orbiting color orbs around a central swatch       */
/* ------------------------------------------------------------------ */
export function ThemeVisual() {
  const uid = useId().replace(/[:]/g, "");
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label="Theme palette preview" style={{ overflow: "visible" }}>
      <style>{`
        .tv-orbit-${uid} {
          transform-box: fill-box;
          transform-origin: 100px 100px;
        }
        .tv-orbit-1-${uid} { animation: tv-spin-${uid} 9s linear infinite; }
        .tv-orbit-2-${uid} { animation: tv-spin-${uid} 12s linear infinite reverse; }
        @keyframes tv-spin-${uid} {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .tv-swatch-${uid} {
          transform-box: fill-box;
          transform-origin: center;
          animation: tv-breathe-${uid} 3.4s ease-in-out infinite;
        }
        @keyframes tv-breathe-${uid} {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
        @media (prefers-reduced-motion: reduce) {
          .tv-orbit-${uid}, .tv-swatch-${uid} { animation: none !important; }
        }
      `}</style>

      <Glow cx={100} cy={100} r={48} color="var(--color-primary)" opacity={0.25} />

      {/* Inner orbit (smaller radius, faster) */}
      <g className={`tv-orbit tv-orbit-1-${uid}`}>
        <circle cx={100} cy={56} r={7} fill="var(--color-primary)" />
        <circle cx={138} cy={122} r={6} fill="var(--color-tertiary)" />
        <circle cx={62} cy={122} r={6} fill="var(--color-warn)" />
      </g>

      {/* Outer orbit (larger radius, slower, reverse) */}
      <g className={`tv-orbit tv-orbit-2-${uid}`}>
        <circle cx={100} cy={32} r={4} fill="var(--color-secondary)" />
        <circle cx={160} cy={100} r={4} fill="var(--color-primary)" opacity={0.7} />
        <circle cx={100} cy={168} r={4} fill="var(--color-tertiary)" opacity={0.7} />
        <circle cx={40} cy={100} r={4} fill="var(--color-warn)" opacity={0.7} />
      </g>

      {/* Central swatch — a rounded color chip */}
      <g className={`tv-swatch-${uid}`}>
        <rect x={76} y={76} width={48} height={48} rx={14} fill="var(--color-primary-container)" stroke="var(--color-primary)" strokeWidth={2} />
        <circle cx={100} cy={100} r={12} fill="var(--color-primary)" />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 3. FolderVisual — tall folder with floating file cards              */
/*    `selected` prop overlays a success checkmark badge              */
/* ------------------------------------------------------------------ */
export function FolderVisual({ selected = false }: { selected?: boolean }) {
  const uid = useId().replace(/[:]/g, "");
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label="Folder with floating files" style={{ overflow: "visible" }}>
      <style>{`
        .fv-folder-${uid} {
          transform-box: fill-box;
          transform-origin: 100px 140px;
          animation: fv-bob-${uid} 3.6s ease-in-out infinite;
        }
        @keyframes fv-bob-${uid} {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-4px) rotate(-1deg); }
        }
        .fv-card-${uid} {
          transform-box: fill-box;
          transform-origin: center;
        }
        .fv-card-1-${uid} { animation: fv-float-1-${uid} 4s ease-in-out infinite; }
        .fv-card-2-${uid} { animation: fv-float-2-${uid} 4.5s ease-in-out infinite 0.5s; }
        .fv-card-3-${uid} { animation: fv-float-3-${uid} 5s ease-in-out infinite 1s; }
        @keyframes fv-float-1-${uid} {
          0%, 100% { transform: translate(0, 0) rotate(-6deg); opacity: 0.85; }
          50% { transform: translate(-2px, -8px) rotate(-8deg); opacity: 1; }
        }
        @keyframes fv-float-2-${uid} {
          0%, 100% { transform: translate(0, 0) rotate(4deg); opacity: 0.85; }
          50% { transform: translate(3px, -10px) rotate(6deg); opacity: 1; }
        }
        @keyframes fv-float-3-${uid} {
          0%, 100% { transform: translate(0, 0) rotate(-2deg); opacity: 0.85; }
          50% { transform: translate(-1px, -12px) rotate(0deg); opacity: 1; }
        }
        .fv-spark-${uid} {
          transform-box: fill-box;
          transform-origin: center;
          animation: fv-twinkle-${uid} 2s ease-in-out infinite;
        }
        @keyframes fv-twinkle-${uid} {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.9; }
        }
        .fv-badge-${uid} {
          transform-box: fill-box;
          transform-origin: center;
          animation: fv-pop-${uid} 0.5s var(--ease-emphasized-decel) both;
        }
        @keyframes fv-pop-${uid} {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .fv-folder-${uid}, .fv-card-${uid}, .fv-spark-${uid}, .fv-badge-${uid} { animation: none !important; }
        }
      `}</style>

      <Glow cx={100} cy={140} r={60} color="var(--color-primary)" opacity={0.22} />

      {/* Floating file cards (behind folder) */}
      <g className={`fv-card fv-card-3-${uid}`}>
        <rect x={56} y={44} width={36} height={46} rx={4} fill="var(--color-surface-3)" stroke="var(--color-primary)" strokeWidth={1.2} />
        <rect x={62} y={52} width={24} height={3} rx={1.5} fill="var(--color-primary)" opacity={0.6} />
        <rect x={62} y={58} width={20} height={3} rx={1.5} fill="var(--color-primary)" opacity={0.4} />
        <rect x={62} y={64} width={22} height={3} rx={1.5} fill="var(--color-primary)" opacity={0.4} />
      </g>
      <g className={`fv-card fv-card-2-${uid}`}>
        <rect x={108} y={36} width={36} height={46} rx={4} fill="var(--color-surface-4)" stroke="var(--color-tertiary)" strokeWidth={1.2} />
        <rect x={114} y={44} width={24} height={3} rx={1.5} fill="var(--color-tertiary)" opacity={0.7} />
        <rect x={114} y={50} width={20} height={3} rx={1.5} fill="var(--color-tertiary)" opacity={0.5} />
        <rect x={114} y={56} width={22} height={3} rx={1.5} fill="var(--color-tertiary)" opacity={0.5} />
      </g>

      {/* Folder body — TALLER (extends from y=100 to y=172) */}
      <g className={`fv-folder-${uid}`}>
        {/* Folder back (tab) */}
        <path
          d="M 40 108 L 40 166 Q 40 172 46 172 L 154 172 Q 160 172 160 166 L 160 114 L 90 114 L 82 108 Z"
          fill="var(--color-primary-container)"
          stroke="var(--color-primary)"
          strokeWidth={2}
          strokeLinejoin="round"
        />
        {/* Folder front flap */}
        <path
          d="M 40 124 L 82 124 L 90 130 L 160 130 L 160 166 Q 160 172 154 172 L 46 172 Q 40 172 40 166 Z"
          fill="var(--color-primary)"
          opacity={0.92}
          stroke="var(--color-primary)"
          strokeWidth={2}
          strokeLinejoin="round"
        />
        {/* Folder highlight */}
        <path d="M 48 128 L 78 128" stroke="var(--color-on-primary)" strokeWidth={2} strokeLinecap="round" opacity={0.35} />
        {/* Folder seam line */}
        <path d="M 40 124 L 82 124 L 90 130 L 160 130" fill="none" stroke="var(--color-on-primary)" strokeWidth={1} opacity={0.15} />
      </g>

      {/* Front floating card (in front of folder) */}
      <g className={`fv-card fv-card-1-${uid}`}>
        <rect x={82} y={58} width={36} height={46} rx={4} fill="var(--color-surface-5)" stroke="var(--color-primary)" strokeWidth={1.4} />
        <circle cx={100} cy={70} r={5} fill="var(--color-warn)" opacity={0.8} />
        <rect x={88} y={80} width={24} height={3} rx={1.5} fill="var(--color-primary)" opacity={0.7} />
        <rect x={88} y={86} width={18} height={3} rx={1.5} fill="var(--color-primary)" opacity={0.5} />
        <rect x={88} y={92} width={22} height={3} rx={1.5} fill="var(--color-primary)" opacity={0.5} />
      </g>

      {/* Success checkmark badge — only shown when selected */}
      {selected && (
        <g className={`fv-badge-${uid}`}>
          <circle cx={150} cy={110} r={18} fill="var(--color-primary)" stroke="var(--color-bg)" strokeWidth={3} />
          <path d="M 142 110 L 148 116 L 158 106" stroke="var(--color-on-primary)" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>
      )}

      {/* Sparkles */}
      <circle className={`fv-spark-${uid}`} cx={28} cy={80} r={2.5} fill="var(--color-primary)" />
      <circle className={`fv-spark-${uid}`} cx={176} cy={90} r={2} fill="var(--color-tertiary)" style={{ animationDelay: "0.7s" }} />
      <circle className={`fv-spark-${uid}`} cx={174} cy={36} r={1.8} fill="var(--color-warn)" style={{ animationDelay: "1.2s" }} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 4. PermissionsVisual — shield with rich animated background         */
/* ------------------------------------------------------------------ */
export function PermissionsVisual() {
  const uid = useId().replace(/[:]/g, "");
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label="Security shield" style={{ overflow: "visible" }}>
      <style>{`
        .pm-ring-${uid} {
          transform-box: fill-box;
          transform-origin: center;
        }
        .pm-ring-1-${uid} { animation: pm-ripple-${uid} 2.8s ease-out infinite; }
        .pm-ring-2-${uid} { animation: pm-ripple-${uid} 2.8s ease-out infinite 0.9s; }
        .pm-ring-3-${uid} { animation: pm-ripple-${uid} 2.8s ease-out infinite 1.8s; }
        @keyframes pm-ripple-${uid} {
          0% { transform: scale(0.5); opacity: 0.7; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        .pm-dash-${uid} {
          transform-box: fill-box;
          transform-origin: 100px 100px;
        }
        .pm-dash-1-${uid} { animation: pm-spin-${uid} 14s linear infinite; }
        .pm-dash-2-${uid} { animation: pm-spin-${uid} 20s linear infinite reverse; }
        @keyframes pm-spin-${uid} {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .pm-particle-${uid} {
          transform-box: fill-box;
          transform-origin: center;
          animation: pm-drift-${uid} 6s ease-in-out infinite;
        }
        @keyframes pm-drift-${uid} {
          0%, 100% { transform: translate(0, 0); opacity: 0.3; }
          25% { transform: translate(6px, -8px); opacity: 0.8; }
          50% { transform: translate(-4px, -12px); opacity: 0.5; }
          75% { transform: translate(-8px, -4px); opacity: 0.7; }
        }
        .pm-shield-${uid} {
          transform-box: fill-box;
          transform-origin: center;
          animation: pm-float-${uid} 3.4s ease-in-out infinite;
        }
        @keyframes pm-float-${uid} {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .pm-check-${uid} {
          stroke-dasharray: 60;
          stroke-dashoffset: 60;
          animation: pm-draw-${uid} 2.4s ease-in-out infinite;
        }
        @keyframes pm-draw-${uid} {
          0%, 20% { stroke-dashoffset: 60; }
          50%, 80% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 60; }
        }
        @media (prefers-reduced-motion: reduce) {
          .pm-ring-${uid}, .pm-dash-${uid}, .pm-particle-${uid}, .pm-shield-${uid}, .pm-check-${uid} { animation: none !important; }
          .pm-check-${uid} { stroke-dashoffset: 0; }
        }
      `}</style>

      {/* Soft glow */}
      <Glow cx={100} cy={100} r={60} color="var(--color-primary)" opacity={0.22} />

      {/* Rotating dashed rings (background layer) */}
      <circle className={`pm-dash pm-dash-1-${uid}`} cx={100} cy={100} r={78} fill="none" stroke="var(--color-primary)" strokeWidth={1.5} strokeDasharray="4 8" opacity={0.25} />
      <circle className={`pm-dash pm-dash-2-${uid}`} cx={100} cy={100} r={68} fill="none" stroke="var(--color-tertiary)" strokeWidth={1} strokeDasharray="2 6" opacity={0.3} />

      {/* Floating background particles */}
      <circle className={`pm-particle-${uid}`} cx={40} cy={60} r={2} fill="var(--color-primary)" />
      <circle className={`pm-particle-${uid}`} cx={160} cy={50} r={1.8} fill="var(--color-tertiary)" style={{ animationDelay: "1.5s" }} />
      <circle className={`pm-particle-${uid}`} cx={170} cy={140} r={2} fill="var(--color-warn)" style={{ animationDelay: "3s" }} />
      <circle className={`pm-particle-${uid}`} cx={34} cy={150} r={1.8} fill="var(--color-primary)" style={{ animationDelay: "4.5s" }} />
      <circle className={`pm-particle-${uid}`} cx={100} cy={28} r={1.5} fill="var(--color-secondary)" style={{ animationDelay: "2s" }} />
      <circle className={`pm-particle-${uid}`} cx={100} cy={172} r={1.5} fill="var(--color-primary)" style={{ animationDelay: "3.5s" }} />

      {/* Ripple rings (expanding outward) */}
      <circle className={`pm-ring pm-ring-1-${uid}`} cx={100} cy={100} r={48} fill="none" stroke="var(--color-primary)" strokeWidth={2} opacity={0.5} />
      <circle className={`pm-ring pm-ring-2-${uid}`} cx={100} cy={100} r={48} fill="none" stroke="var(--color-primary)" strokeWidth={2} opacity={0.5} />
      <circle className={`pm-ring pm-ring-3-${uid}`} cx={100} cy={100} r={48} fill="none" stroke="var(--color-primary)" strokeWidth={2} opacity={0.5} />

      {/* Shield */}
      <g className={`pm-shield-${uid}`}>
        <path
          d="M 100 56 L 138 70 L 138 104 Q 138 134 100 150 Q 62 134 62 104 L 62 70 Z"
          fill="var(--color-primary-container)"
          stroke="var(--color-primary)"
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
        {/* Shield inner highlight */}
        <path
          d="M 100 62 L 132 74 L 132 104 Q 132 129 100 143 Q 68 129 68 104 L 68 74 Z"
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth={1}
          opacity={0.3}
        />
        {/* Checkmark (animated draw) */}
        <path
          className={`pm-check-${uid}`}
          d="M 84 100 L 95 112 L 118 88"
          stroke="var(--color-primary)"
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 5. RestoreVisual — larger cloud + animated background               */
/* ------------------------------------------------------------------ */
export function RestoreVisual() {
  const uid = useId().replace(/[:]/g, "");
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label="Cloud backup restore" style={{ overflow: "visible" }}>
      <style>{`
        .rv-bg-ring-${uid} {
          transform-box: fill-box;
          transform-origin: center;
          animation: rv-bg-pulse-${uid} 4s ease-in-out infinite;
        }
        @keyframes rv-bg-pulse-${uid} {
          0%, 100% { transform: scale(0.85); opacity: 0.15; }
          50% { transform: scale(1.1); opacity: 0.35; }
        }
        .rv-bg-dash-${uid} {
          transform-box: fill-box;
          transform-origin: 100px 80px;
          animation: rv-bg-spin-${uid} 18s linear infinite;
        }
        @keyframes rv-bg-spin-${uid} {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .rv-cloud-${uid} {
          transform-box: fill-box;
          transform-origin: center;
          animation: rv-float-${uid} 3.6s ease-in-out infinite;
        }
        @keyframes rv-float-${uid} {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .rv-drop-${uid} {
          transform-box: fill-box;
          transform-origin: center;
          animation: rv-fall-${uid} 2.4s ease-in infinite;
        }
        @keyframes rv-fall-${uid} {
          0% { transform: translateY(-6px); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(54px); opacity: 0; }
        }
        .rv-tray-${uid} {
          transform-box: fill-box;
          transform-origin: center;
          animation: rv-pulse-${uid} 2.4s ease-in-out infinite;
        }
        @keyframes rv-pulse-${uid} {
          0%, 100% { transform: scaleY(1); opacity: 0.85; }
          50% { transform: scaleY(1.08); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .rv-bg-ring-${uid}, .rv-bg-dash-${uid}, .rv-cloud-${uid}, .rv-drop-${uid}, .rv-tray-${uid} { animation: none !important; }
        }
      `}</style>

      {/* Animated background rings (behind cloud) */}
      <circle className={`rv-bg-ring rv-bg-ring-${uid}`} cx={100} cy={80} r={72} fill="none" stroke="var(--color-primary)" strokeWidth={1.5} opacity={0.2} />
      <circle className={`rv-bg-dash rv-bg-dash-${uid}`} cx={100} cy={80} r={62} fill="none" stroke="var(--color-tertiary)" strokeWidth={1} strokeDasharray="3 7" opacity={0.25} />

      {/* Glow */}
      <Glow cx={100} cy={70} r={50} color="var(--color-primary)" opacity={0.22} />

      {/* Cloud — LARGER (scaled up ~15%) */}
      <g className={`rv-cloud-${uid}`} transform="translate(-4 0) scale(1.15)" style={{ transformOrigin: "100px 70px" }}>
        <ellipse cx={74} cy={70} rx={20} ry={18} fill="var(--color-surface-3)" stroke="var(--color-primary)" strokeWidth={1.5} />
        <ellipse cx={100} cy={58} rx={28} ry={24} fill="var(--color-surface-3)" stroke="var(--color-primary)" strokeWidth={1.5} />
        <ellipse cx={126} cy={70} rx={20} ry={18} fill="var(--color-surface-3)" stroke="var(--color-primary)" strokeWidth={1.5} />
        <rect x={62} y={70} width={76} height={18} rx={9} fill="var(--color-surface-3)" stroke="var(--color-primary)" strokeWidth={1.5} />
        {/* Cloud highlight */}
        <ellipse cx={90} cy={52} rx={9} ry={4} fill="var(--color-bg)" opacity={0.2} />
      </g>

      {/* Falling data drops (staggered) */}
      <g className={`rv-drop-${uid}`} style={{ animationDelay: "0s" }}>
        <rect x={72} y={92} width={6} height={9} rx={1.5} fill="var(--color-primary)" transform="rotate(12 75 96)" />
      </g>
      <g className={`rv-drop-${uid}`} style={{ animationDelay: "0.6s" }}>
        <circle cx={96} cy={94} r={3.5} fill="var(--color-tertiary)" />
      </g>
      <g className={`rv-drop-${uid}`} style={{ animationDelay: "1.2s" }}>
        <rect x={120} y={92} width={6} height={9} rx={1.5} fill="var(--color-warn)" transform="rotate(-12 123 96)" />
      </g>
      <g className={`rv-drop-${uid}`} style={{ animationDelay: "1.8s" }}>
        <circle cx={108} cy={94} r={3} fill="var(--color-primary)" opacity={0.85} />
      </g>

      {/* Tray / collection basin at bottom */}
      <g className={`rv-tray-${uid}`}>
        <path
          d="M 56 150 L 64 170 L 136 170 L 144 150 Z"
          fill="var(--color-primary-container)"
          stroke="var(--color-primary)"
          strokeWidth={2}
          strokeLinejoin="round"
        />
        {/* Tray fill line (data collecting) */}
        <path d="M 66 158 L 134 158" stroke="var(--color-primary)" strokeWidth={2} strokeLinecap="round" opacity={0.6} />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 6. SummaryVisual — growing bar chart with trend arrow + sparkles    */
/* ------------------------------------------------------------------ */
export function SummaryVisual() {
  const uid = useId().replace(/[:]/g, "");
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label="Stats summary chart" style={{ overflow: "visible" }}>
      <style>{`
        .sv-bar-${uid} {
          transform-box: fill-box;
          transform-origin: bottom;
        }
        .sv-bar-1-${uid} { animation: sv-grow-${uid} 1.4s var(--ease-emphasized-decel) 0.1s both; }
        .sv-bar-2-${uid} { animation: sv-grow-${uid} 1.4s var(--ease-emphasized-decel) 0.25s both; }
        .sv-bar-3-${uid} { animation: sv-grow-${uid} 1.4s var(--ease-emphasized-decel) 0.4s both; }
        .sv-bar-4-${uid} { animation: sv-grow-${uid} 1.4s var(--ease-emphasized-decel) 0.55s both; }
        @keyframes sv-grow-${uid} {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
        .sv-trend-${uid} {
          transform-box: fill-box;
          transform-origin: bottom;
          animation: sv-bob-${uid} 2.6s ease-in-out infinite;
        }
        @keyframes sv-bob-${uid} {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .sv-spark-${uid} {
          transform-box: fill-box;
          transform-origin: center;
          animation: sv-twinkle-${uid} 2s ease-in-out infinite;
        }
        @keyframes sv-twinkle-${uid} {
          0%, 100% { opacity: 0.2; transform: scale(0.6); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .sv-bar-${uid}, .sv-trend-${uid}, .sv-spark-${uid} { animation: none !important; }
        }
      `}</style>

      <Glow cx={100} cy={120} r={52} color="var(--color-primary)" opacity={0.2} />

      {/* Baseline */}
      <path d="M 40 160 L 160 160" stroke="var(--color-outline-variant)" strokeWidth={1.5} strokeLinecap="round" />

      {/* Bars (staggered grow-in, then static) */}
      <rect className={`sv-bar sv-bar-1-${uid}`} x={48} y={130} width={18} height={30} rx={3} fill="var(--color-primary)" opacity={0.7} />
      <rect className={`sv-bar sv-bar-2-${uid}`} x={76} y={112} width={18} height={48} rx={3} fill="var(--color-primary)" opacity={0.85} />
      <rect className={`sv-bar sv-bar-3-${uid}`} x={104} y={92} width={18} height={68} rx={3} fill="var(--color-tertiary)" />
      <rect className={`sv-bar sv-bar-4-${uid}`} x={132} y={74} width={18} height={86} rx={3} fill="var(--color-primary)" />

      {/* Trend arrow line over the bars */}
      <g className={`sv-trend-${uid}`}>
        <path d="M 52 122 L 82 104 L 112 84 L 140 64" stroke="var(--color-warn)" strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 130 64 L 142 64 L 142 76" stroke="var(--color-warn)" strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {/* Trend dot */}
        <circle cx={140} cy={64} r={4} fill="var(--color-warn)" />
      </g>

      {/* Sparkles */}
      <circle className={`sv-spark-${uid}`} cx={36} cy={60} r={2.5} fill="var(--color-primary)" />
      <circle className={`sv-spark-${uid}`} cx={170} cy={92} r={2} fill="var(--color-tertiary)" style={{ animationDelay: "0.6s" }} />
      <circle className={`sv-spark-${uid}`} cx={160} cy={40} r={2} fill="var(--color-warn)" style={{ animationDelay: "1.1s" }} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 7. FinishVisual — elegant celebration (completely reworked)         */
/*    Rotating light rays + multi-layer expanding rings + glowing      */
/*    star badge + drifting sparkle particles                          */
/* ------------------------------------------------------------------ */
export function FinishVisual() {
  const uid = useId().replace(/[:]/g, "");
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label="Setup complete celebration" style={{ overflow: "visible" }}>
      <style>{`
        .fn-rays-${uid} {
          transform-box: fill-box;
          transform-origin: 100px 100px;
          animation: fn-rotate-${uid} 20s linear infinite;
        }
        @keyframes fn-rotate-${uid} {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .fn-ring-${uid} {
          transform-box: fill-box;
          transform-origin: center;
        }
        .fn-ring-1-${uid} { animation: fn-expand-${uid} 3s ease-out infinite; }
        .fn-ring-2-${uid} { animation: fn-expand-${uid} 3s ease-out infinite 0.5s; }
        .fn-ring-3-${uid} { animation: fn-expand-${uid} 3s ease-out infinite 1s; }
        .fn-ring-4-${uid} { animation: fn-expand-${uid} 3s ease-out infinite 1.5s; }
        .fn-ring-5-${uid} { animation: fn-expand-${uid} 3s ease-out infinite 2s; }
        @keyframes fn-expand-${uid} {
          0% { transform: scale(0.2); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
        .fn-core-${uid} {
          transform-box: fill-box;
          transform-origin: center;
          animation: fn-breathe-${uid} 2.4s ease-in-out infinite;
        }
        @keyframes fn-breathe-${uid} {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        .fn-check-${uid} {
          stroke-dasharray: 70;
          stroke-dashoffset: 70;
          animation: fn-draw-${uid} 2.4s ease-in-out infinite;
        }
        @keyframes fn-draw-${uid} {
          0%, 15% { stroke-dashoffset: 70; }
          50%, 85% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -70; }
        }
        .fn-spark-${uid} {
          transform-box: fill-box;
          transform-origin: center;
          animation: fn-drift-${uid} 3s ease-in-out infinite;
        }
        @keyframes fn-drift-${uid} {
          0% { transform: translate(0, 0) scale(0.5); opacity: 0.2; }
          50% { transform: translate(0, -12px) scale(1.2); opacity: 1; }
          100% { transform: translate(0, -24px) scale(0.6); opacity: 0; }
        }
        .fn-glow-${uid} {
          transform-box: fill-box;
          transform-origin: center;
          animation: fn-glow-pulse-${uid} 2.4s ease-in-out infinite;
        }
        @keyframes fn-glow-pulse-${uid} {
          0%, 100% { opacity: 0.25; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(1.15); }
        }
        @media (prefers-reduced-motion: reduce) {
          .fn-rays-${uid}, .fn-ring-${uid}, .fn-core-${uid}, .fn-check-${uid}, .fn-spark-${uid}, .fn-glow-${uid} { animation: none !important; }
          .fn-check-${uid} { stroke-dashoffset: 0; }
        }
      `}</style>

      {/* Layer 1: Big pulsing glow behind everything */}
      <Glow cx={100} cy={100} r={70} color="var(--color-primary)" opacity={0.3} />
      <circle className={`fn-glow-${uid}`} cx={100} cy={100} r={60} fill="var(--color-primary)" opacity={0.15} style={{ filter: "blur(16px)" }} />

      {/* Layer 2: Rotating light rays (12 rays radiating from center) */}
      <g className={`fn-rays-${uid}`}>
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30) * Math.PI / 180;
          const x1 = 100 + Math.cos(angle) * 36;
          const y1 = 100 + Math.sin(angle) * 36;
          const x2 = 100 + Math.cos(angle) * 80;
          const y2 = 100 + Math.sin(angle) * 80;
          return (
            <line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="var(--color-primary)"
              strokeWidth={i % 2 === 0 ? 2.5 : 1.5}
              strokeLinecap="round"
              opacity={i % 2 === 0 ? 0.5 : 0.25}
            />
          );
        })}
      </g>

      {/* Layer 3: Multi-layer expanding celebration rings (5 rings, staggered, multi-color) */}
      <circle className={`fn-ring fn-ring-1-${uid}`} cx={100} cy={100} r={36} fill="none" stroke="var(--color-primary)" strokeWidth={3} />
      <circle className={`fn-ring fn-ring-2-${uid}`} cx={100} cy={100} r={36} fill="none" stroke="var(--color-tertiary)" strokeWidth={2.5} />
      <circle className={`fn-ring fn-ring-3-${uid}`} cx={100} cy={100} r={36} fill="none" stroke="var(--color-warn)" strokeWidth={2} />
      <circle className={`fn-ring fn-ring-4-${uid}`} cx={100} cy={100} r={36} fill="none" stroke="var(--color-primary)" strokeWidth={2.5} />
      <circle className={`fn-ring fn-ring-5-${uid}`} cx={100} cy={100} r={36} fill="none" stroke="var(--color-tertiary)" strokeWidth={1.5} />

      {/* Layer 4: Central glowing star badge */}
      <g className={`fn-core-${uid}`}>
        {/* Outer badge ring */}
        <circle cx={100} cy={100} r={38} fill="var(--color-primary)" />
        {/* Inner gradient highlight */}
        <circle cx={100} cy={100} r={38} fill="none" stroke="var(--color-bg)" strokeWidth={2} opacity={0.2} />
        <circle cx={100} cy={92} r={20} fill="var(--color-bg)" opacity={0.08} />
        {/* Checkmark (animated draw) */}
        <path
          className={`fn-check-${uid}`}
          d="M 82 100 L 94 113 L 120 87"
          stroke="var(--color-on-primary)"
          strokeWidth={6}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>

      {/* Layer 5: Drifting sparkle particles (8, around the badge) */}
      <circle className={`fn-spark-${uid}`} cx={40} cy={70} r={3} fill="var(--color-primary)" />
      <circle className={`fn-spark-${uid}`} cx={160} cy={60} r={2.5} fill="var(--color-tertiary)" style={{ animationDelay: "0.4s" }} />
      <circle className={`fn-spark-${uid}`} cx={170} cy={120} r={3} fill="var(--color-warn)" style={{ animationDelay: "0.8s" }} />
      <circle className={`fn-spark-${uid}`} cx={30} cy={130} r={2.5} fill="var(--color-primary)" style={{ animationDelay: "1.2s" }} />
      <circle className={`fn-spark-${uid}`} cx={100} cy={30} r={2.5} fill="var(--color-tertiary)" style={{ animationDelay: "0.6s" }} />
      <circle className={`fn-spark-${uid}`} cx={100} cy={170} r={2.5} fill="var(--color-warn)" style={{ animationDelay: "1s" }} />
      <circle className={`fn-spark-${uid}`} cx={50} cy={40} r={2} fill="var(--color-secondary)" style={{ animationDelay: "1.5s" }} />
      <circle className={`fn-spark-${uid}`} cx={150} cy={160} r={2} fill="var(--color-primary)" style={{ animationDelay: "1.8s" }} />
    </svg>
  );
}

export default { WelcomeVisual, ThemeVisual, FolderVisual, PermissionsVisual, RestoreVisual, SummaryVisual, FinishVisual };
