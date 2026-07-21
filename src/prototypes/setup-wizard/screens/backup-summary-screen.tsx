"use client";
/**
 * setup-wizard / screens / backup-summary-screen — step 5.
 *
 * After the user picks a backup file, this screen shows a stats grid with
 * what was found: 247 anime, 12 categories, 1,432 episodes tracked, 89
 * completed. An abstract growing bar chart with a trend arrow sits at the
 * top. Each stat card has a polished card style and the values animate in
 * with a scale + count-up-style entrance.
 *
 * NOTE: This screen is now ONLY reached when the user actually selected a
 * backup. Skipping the backup (via the Skip button on the restore screen)
 * jumps directly to the Finish screen, bypassing this summary entirely.
 */
import type { ThemePalette } from "../lib/themes";
import { SummaryVisual } from "../components/visuals";

interface BackupSummaryScreenProps {
  active: boolean;
  onNext: () => void;
  onBack: () => void;
  palette: ThemePalette;
}

interface StatDef {
  value: string;
  label: string;
}

const STATS: StatDef[] = [
  { value: "247", label: "Anime detected" },
  { value: "12", label: "Categories" },
  { value: "1,432", label: "Episodes tracked" },
  { value: "89", label: "Completed" },
];

export function BackupSummaryScreen({ active, onNext, onBack, palette }: BackupSummaryScreenProps) {
  return (
    <div className={`wizard-step ${active ? "wizard-step--active" : ""}`}>
      <div className="wizard-content">
        {/* Illustration — growing bar chart with trend arrow */}
        <div className="illustration" key={active ? "on" : "off"}>
          <SummaryVisual />
        </div>

        <h1 className="wizard-title" style={{ fontWeight: 800 }}>Backup summary</h1>
        <p className="wizard-subtitle">Here&apos;s what we found in your backup</p>

        {/* Stats grid — polished cards, animated value entrance */}
        <div className="stats-grid">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className="stat-card"
              style={{
                animation: `cardEntry 0.5s var(--ease-emphasized-decel) ${0.08 * i + 0.15}s backwards`,
                borderColor: `${palette.primary}44`,
              }}
            >
              <span
                className="stat-value stat-value--anim"
                style={{
                  color: palette.primary,
                  animationDelay: `${0.08 * i + 0.35}s`,
                }}
              >
                {stat.value}
              </span>
              <span className="stat-label">{stat.label}</span>
            </div>
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
          Looks good!
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
