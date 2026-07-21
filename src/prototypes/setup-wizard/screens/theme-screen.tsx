"use client";
/**
 * setup-wizard / screens / theme-screen — step 1.
 *
 * User picks a theme mode (Dark / Light / System) and a color palette
 * (Lime / Teal / Purple / Coral / Forest / Amber). An abstract animated
 * visual of orbiting color orbs around a central swatch sits at the top.
 */
import type { ReactNode } from "react";
import type { ThemeMode, ThemePalette } from "../lib/themes";
import { PALETTES } from "../lib/themes";
import { ThemeVisual } from "../components/visuals";

interface ThemeScreenProps {
  active: boolean;
  onNext: () => void;
  onBack: () => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  palette: ThemePalette;
  setPalette: (palette: ThemePalette) => void;
}

const MODE_OPTIONS: { value: ThemeMode; label: string; icon: ReactNode }[] = [
  {
    value: "dark",
    label: "Dark",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M21 12.8A9 9 0 1111.2 3a7 7 0 109.8 9.8z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    value: "light",
    label: "Light",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
        <path
          d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    value: "system",
    label: "System",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="4" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function ThemeScreen({
  active,
  onNext,
  onBack,
  themeMode,
  setThemeMode,
  palette,
  setPalette,
}: ThemeScreenProps) {
  return (
    <div className={`wizard-step ${active ? "wizard-step--active" : ""}`}>
      <div className="wizard-content">
        {/* Illustration — orbiting color orbs around a central swatch */}
        <div className="illustration illustration--clip" key={active ? "on" : "off"}>
          <ThemeVisual />
        </div>

        <h1 className="wizard-title" style={{ fontWeight: 800 }}>Choose your theme</h1>
        <p className="wizard-subtitle">
          Pick a mode and a color. You can change this anytime in settings.
        </p>

        {/* Theme mode toggle (Dark / Light / System) */}
        <div className="mode-toggle" role="radiogroup" aria-label="Theme mode">
          {MODE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={themeMode === opt.value}
              className={`mode-btn ${themeMode === opt.value ? "mode-btn--active" : ""}`}
              onClick={() => setThemeMode(opt.value)}
              style={
                themeMode === opt.value
                  ? { background: palette.primary, color: palette.onPrimary }
                  : undefined
              }
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>

        {/* Color palette grid */}
        <div className="palette-grid" role="radiogroup" aria-label="Color palette">
          {PALETTES.map((p, i) => (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={palette.id === p.id}
              className={`palette-card ${palette.id === p.id ? "palette-card--active" : ""}`}
              onClick={() => setPalette(p)}
              style={{
                animation: `cardEntry 0.4s var(--ease-emphasized-decel) ${0.05 * i + 0.2}s backwards`,
                ...(palette.id === p.id ? { borderColor: palette.primary } : {}),
              }}
            >
              <span
                className="palette-swatch"
                style={{
                  background: `linear-gradient(135deg, ${p.primary}, ${p.primary}aa)`,
                }}
              />
              <span className="palette-name">{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="wizard-actions">
        <button type="button" className="wizard-btn wizard-btn--secondary" onClick={onBack} style={{ fontWeight: 800 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M19 12H5M11 18l-6-6 6-6"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back
        </button>
        <button
          type="button"
          className="wizard-btn wizard-btn--primary"
          onClick={onNext}
          style={{ background: palette.primary, color: palette.onPrimary, fontWeight: 800 }}
        >
          Next
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M5 12h14M13 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
