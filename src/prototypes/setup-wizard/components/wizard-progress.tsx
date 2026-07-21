"use client";

/**
 * setup-wizard / components / wizard-progress — animated progress bar.
 *
 * Shows a thin bar at the top of the device screen that fills as the user
 * advances through the wizard steps. The fill color matches the selected
 * palette's primary color.
 */
import type { ThemePalette } from "../lib/themes";
import styles from "./wizard-progress.module.css";

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
  palette: ThemePalette;
}

export function WizardProgress({ currentStep, totalSteps, palette }: WizardProgressProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressTrack}>
        <div
          className={styles.progressFill}
          style={{
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${palette.primary}, ${palette.primary}cc)`,
          }}
        />
      </div>
      <div className={styles.stepDots}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`${styles.dot} ${i <= currentStep ? styles.dotActive : ""}`}
            style={i <= currentStep ? { background: palette.primary } : undefined}
          />
        ))}
      </div>
    </div>
  );
}
