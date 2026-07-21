"use client";
/**
 * setup-wizard / screens / finish-screen — step 6 (last).
 *
 * Celebration screen. Confetti rains down, an abstract celebration visual
 * (expanding rings + a glowing checkmark badge + ambient sparkles) sits
 * center-stage, and a "Start Exploring" button restarts the wizard (so
 * designers can re-watch the flow).
 *
 * The confetti pieces use the global `.confetti` class from setup-wizard.css
 * (2s `confettiFall` with `forwards` fill — they fall once). The confetti
 * container has `key={active}` so the pieces re-mount whenever this screen
 * becomes active, replaying the fall animation every time the user reaches
 * the final step.
 */
import type { ThemePalette } from "../lib/themes";
import { FinishVisual } from "../components/visuals";

interface FinishScreenProps {
  active: boolean;
  onRestart: () => void;
  palette: ThemePalette;
}

interface ConfettiPiece {
  left: number;
  top: number;
  color: string;
  delay: number;
  duration: number;
  size: number;
  rotate: number;
}

// Static layout (positions, delays, sizes) for confetti — kept at module scope
// so SSR and client output match (no Math.random in render). The dynamic
// palette.primary color is merged in inside the component.
const CONFETTI_LAYOUT: Omit<ConfettiPiece, "color">[] = [
  { left: 8, top: -8, delay: 0, duration: 2.0, size: 8, rotate: 20 },
  { left: 18, top: -20, delay: 0.3, duration: 2.2, size: 6, rotate: -15 },
  { left: 28, top: -8, delay: 0.1, duration: 1.8, size: 9, rotate: 45 },
  { left: 38, top: -25, delay: 0.5, duration: 2.4, size: 7, rotate: 60 },
  { left: 48, top: -8, delay: 0.2, duration: 2.0, size: 8, rotate: -30 },
  { left: 58, top: -20, delay: 0.4, duration: 2.2, size: 6, rotate: 15 },
  { left: 68, top: -8, delay: 0.6, duration: 1.9, size: 9, rotate: -45 },
  { left: 78, top: -25, delay: 0.15, duration: 2.3, size: 7, rotate: 30 },
  { left: 88, top: -8, delay: 0.45, duration: 2.1, size: 8, rotate: -20 },
  { left: 14, top: -28, delay: 0.7, duration: 2.0, size: 6, rotate: 90 },
  { left: 44, top: -28, delay: 0.55, duration: 2.4, size: 8, rotate: -60 },
  { left: 74, top: -28, delay: 0.25, duration: 2.2, size: 7, rotate: 75 },
  { left: 24, top: -32, delay: 0.85, duration: 2.6, size: 7, rotate: -25 },
  { left: 64, top: -32, delay: 0.65, duration: 2.3, size: 8, rotate: 50 },
];

// Festive accent colors (rotate through these for the non-primary confetti).
const CONFETTI_ACCENTS = ["#ffcc80", "#efb8c8", "#a5d6a7", "#ccc2dc"];

export function FinishScreen({ active, onRestart, palette }: FinishScreenProps) {
  // Build the final confetti list — primary palette color interleaved with
  // festive accents so the celebration picks up the user's chosen theme.
  const confetti: ConfettiPiece[] = CONFETTI_LAYOUT.map((c, i) => ({
    ...c,
    color: i % 3 === 0 ? palette.primary : CONFETTI_ACCENTS[i % CONFETTI_ACCENTS.length],
  }));

  return (
    <div className={`wizard-step ${active ? "wizard-step--active" : ""}`}>
      {/* Confetti — re-mounts on active so it re-falls each time */}
      <div
        key={active ? "confetti-on" : "confetti-off"}
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 1 }}
      >
        {confetti.map((c, i) => (
          <span
            key={i}
            className="confetti"
            style={{
              left: `${c.left}%`,
              top: `${c.top}px`,
              width: c.size,
              height: c.size,
              background: c.color,
              transform: `rotate(${c.rotate}deg)`,
              animationDelay: `${c.delay}s`,
              animationDuration: `${c.duration}s`,
            }}
          />
        ))}
      </div>

      <div className="wizard-content" style={{ position: "relative", zIndex: 2 }}>
        {/* Badge above the illustration */}
        <span
          className="finish-badge"
          style={{
            background: `${palette.primary}22`,
            color: palette.primary,
            animation: "scaleIn 0.5s var(--ease-emphasized-decel) 0.1s backwards",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 2l2.4 7.4H22l-6 4.6 2.3 7.4-6.3-4.6-6.3 4.6L7.9 14l-6-4.6h7.6z"
              fill="currentColor"
            />
          </svg>
          Setup complete
        </span>

        {/* Illustration — bigger (240×240), expanding celebration rings + glowing check */}
        <div
          className="illustration illustration--lg"
          key={active ? "on" : "off"}
          style={{ animation: "scaleIn 0.6s var(--ease-emphasized-decel) 0.2s backwards, float 4s ease-in-out 0.8s infinite" }}
        >
          <FinishVisual />
        </div>

        <h1
          className="wizard-title wizard-title--xl"
          style={{
            fontWeight: 800,
            background: `linear-gradient(135deg, ${palette.primary}, ${palette.primary}aa)`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
            animation: "titleSlideUp 0.5s var(--ease-emphasized-decel) 0.4s backwards",
          }}
        >
          You&apos;re all set!
        </h1>

        <p
          className="wizard-subtitle"
          style={{ animation: "titleSlideUp 0.5s var(--ease-emphasized-decel) 0.55s backwards" }}
        >
          Your anime journey begins now. Enjoy exploring thousands of titles,
          tracking your progress, and never missing a new episode.
        </p>
      </div>

      <div className="wizard-actions" style={{ position: "relative", zIndex: 2 }}>
        <button
          type="button"
          className="wizard-btn wizard-btn--primary"
          onClick={onRestart}
          style={{
            background: palette.primary,
            color: palette.onPrimary,
            fontWeight: 800,
            boxShadow: `0 6px 24px ${palette.primary}55`,
            animation: "scaleIn 0.5s var(--ease-emphasized-decel) 0.7s backwards",
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M5 12a7 7 0 0112-5l2 2M19 12a7 7 0 01-12 5l-2-2M19 4v5h-5M5 20v-5h5"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Start Exploring
        </button>
      </div>
    </div>
  );
}
