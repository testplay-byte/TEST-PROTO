"use client";
/**
 * setup-wizard / screens / restore-screen — step 4.
 *
 * User can restore from a previous backup. The "Select Backup File" button
 * is a mock — clicking it sets `backupSelected = true` and reveals a mock
 * card showing "anime_backup_2025-01-15.json — 2.3 MB". After ~1.5s the
 * screen auto-advances to the Backup Summary screen — the user does NOT
 * have to click Next.
 *
 * If the user navigates back to this screen after auto-advance, they see
 * the selected backup card with a Continue button (no re-trigger of the
 * loading state unless they click Select Backup File again).
 *
 * SKIP BUG FIX: The "Skip" button (shown only when NO backup is selected)
 * now calls `onSkip` instead of `onNext`. `onSkip` jumps directly to the
 * Finish screen (step 6), skipping the Backup Summary screen entirely —
 * because there's nothing to summarize if the user skipped the backup.
 */
import { useEffect, useState } from "react";
import type { ThemePalette } from "../lib/themes";
import { RestoreVisual } from "../components/visuals";

interface RestoreScreenProps {
  active: boolean;
  onNext: () => void;
  onBack: () => void;
  /** Jump directly to the Finish screen, skipping Backup Summary. */
  onSkip: () => void;
  backupSelected: boolean;
  setBackupSelected: (selected: boolean) => void;
  palette: ThemePalette;
}

export function RestoreScreen({
  active,
  onNext,
  onBack,
  onSkip,
  backupSelected,
  setBackupSelected,
  palette,
}: RestoreScreenProps) {
  const [restoring, setRestoring] = useState(false);

  // Trigger auto-advance when user just clicked "Select Backup File".
  // Only fires when restoring=true (set on click), so navigating back to
  // this screen does not re-trigger the auto-advance.
  useEffect(() => {
    if (!restoring) return;
    const t = setTimeout(() => {
      setRestoring(false);
      onNext();
    }, 1500);
    return () => clearTimeout(t);
  }, [restoring, onNext]);

  const handleSelectBackup = () => {
    setBackupSelected(true);
    setRestoring(true);
  };

  return (
    <div className={`wizard-step ${active ? "wizard-step--active" : ""}`}>
      <div className="wizard-content">
        {/* Illustration — cloud with flowing data stream */}
        <div className="illustration" key={active ? "on" : "off"}>
          <RestoreVisual />
        </div>

        <h1 className="wizard-title" style={{ fontWeight: 800 }}>Restore backup</h1>
        <p className="wizard-subtitle">
          {backupSelected
            ? "Reading your backup file…"
            : "Got a backup from a previous install? Restore your library, history, and settings in one tap."}
        </p>

        {/* Compact "Select Backup File" button OR selected card */}
        {!backupSelected ? (
          <button
            type="button"
            className="wizard-btn wizard-btn--select"
            style={{
              color: palette.primary,
              borderColor: palette.primary,
            }}
            onClick={handleSelectBackup}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path d="M14 3v5h5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              <path
                d="M12 12v5M9.5 14.5L12 17l2.5-2.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Select Backup File
          </button>
        ) : (
          <div
            className="mock-card"
            style={{
              animation: "cardEntry 0.4s var(--ease-emphasized-decel) backwards",
              borderColor: palette.primary,
            }}
          >
            <div
              className="mock-icon"
              style={{ background: palette.primaryContainerDark, color: palette.onPrimaryContainer }}
            >
              {/* File/document SVG icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z"
                  fill="currentColor"
                />
                <path d="M14 3v5h5" fill="var(--color-bg)" opacity="0.4" />
              </svg>
            </div>
            <div className="mock-info">
              <p className="mock-title">anime_backup_2025-01-15.json</p>
              <p className="mock-desc">
                {restoring ? "Restoring…" : "2.3 MB · ready"}
              </p>
            </div>
            {/* Restoring indicator OR success checkmark */}
            {restoring ? (
              <span
                className="scanning-pill"
                style={{ background: `${palette.primary}22`, color: palette.primary }}
              >
                <span className="scanning-dots" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
                Restoring
              </span>
            ) : (
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                style={{ color: palette.primary, flex: "0 0 auto" }}
              >
                <circle cx="12" cy="12" r="11" fill={palette.primary} opacity="0.18" />
                <path
                  d="M7 12.5l3.5 3.5L17 9"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        )}
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
        {restoring ? (
          <span
            className="wizard-btn wizard-btn--ghost"
            style={{
              cursor: "default",
              color: "var(--color-text-muted)",
              fontWeight: 800,
            }}
          >
            Auto-advancing…
          </span>
        ) : backupSelected ? (
          <button
            type="button"
            className="wizard-btn wizard-btn--primary"
            onClick={onNext}
            style={{
              background: palette.primary,
              color: palette.onPrimary,
              fontWeight: 800,
            }}
          >
            Continue
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
        ) : (
          <button
            type="button"
            className="wizard-btn wizard-btn--ghost"
            onClick={onSkip}
            style={{ fontWeight: 800 }}
          >
            Skip
          </button>
        )}
      </div>
    </div>
  );
}
