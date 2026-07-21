"use client";
/**
 * setup-wizard / screens / folder-screen — step 2 (MERGED with confirm).
 *
 * Combines folder selection + confirmation into ONE screen.
 *
 * Flow:
 *   1. Initially: FolderVisual + compact "Select Folder" button.
 *   2. On click → setFolderSelected(true), setScanning(true).
 *   3. While scanning: FolderVisual shows the folder with a "Scanning..."
 *      badge. After ~1.5s → scanning stops, success checkmark appears
 *      on the folder (FolderVisual `selected` prop). The screen STAYS —
 *      the user clicks Continue to advance.
 *   4. If the user navigates back to this screen after selecting, they
 *      see the selected card with a Continue button (no re-trigger of
 *      scanning unless they click Select Folder again).
 *
 * NOTE: Auto-advance was REMOVED per user request — the screen now stays
 * after selection and shows a success animation, requiring an explicit
 * Continue click.
 */
import { useEffect, useState } from "react";
import type { ThemePalette } from "../lib/themes";
import { FolderVisual } from "../components/visuals";

interface FolderScreenProps {
  active: boolean;
  onNext: () => void;
  onBack: () => void;
  folderSelected: boolean;
  setFolderSelected: (selected: boolean) => void;
  palette: ThemePalette;
}

export function FolderScreen({
  active,
  onNext,
  onBack,
  folderSelected,
  setFolderSelected,
  palette,
}: FolderScreenProps) {
  const [scanning, setScanning] = useState(false);

  // When user clicks "Select Folder", show scanning animation for ~1.5s,
  // then stop scanning and reveal the success checkmark on the folder.
  // The screen STAYS — no auto-advance.
  useEffect(() => {
    if (!scanning) return;
    const t = setTimeout(() => {
      setScanning(false);
    }, 1500);
    return () => clearTimeout(t);
  }, [scanning]);

  const handleSelectFolder = () => {
    setFolderSelected(true);
    setScanning(true);
  };

  return (
    <div className={`wizard-step ${active ? "wizard-step--active" : ""}`}>
      <div className="wizard-content">
        {/* Illustration — folder with floating files; shows success badge when selected */}
        <div className="illustration" key={`${active ? "on" : "off"}-${folderSelected ? "sel" : "empty"}`}>
          <FolderVisual selected={folderSelected && !scanning} />
        </div>

        <h1 className="wizard-title" style={{ fontWeight: 800 }}>
          {folderSelected ? "Folder connected!" : "Select your anime folder"}
        </h1>
        <p className="wizard-subtitle">
          {folderSelected
            ? scanning
              ? "Scanning your library…"
              : "Your library is ready to go. Continue when you are."
            : "Pick the folder where your anime library lives. We\u2019ll scan it and organize everything for you."}
        </p>

        {/* Select-folder CTA (compact, outlined, with icon) OR selected card */}
        {!folderSelected ? (
          <button
            type="button"
            className="wizard-btn wizard-btn--select"
            style={{
              color: palette.primary,
              borderColor: palette.primary,
            }}
            onClick={handleSelectFolder}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M12 11v5M9.5 13.5L12 16l2.5-2.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Select Folder
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
              {/* Folder SVG icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div className="mock-info">
              <p className="mock-title">/storage/anime-library</p>
              <p className="mock-desc">
                {scanning ? "Scanning…" : "247 items · ready"}
              </p>
            </div>
            {/* Success checkmark OR scanning indicator */}
            {scanning ? (
              <span
                className="scanning-pill"
                style={{ background: `${palette.primary}22`, color: palette.primary }}
              >
                <span className="scanning-dots" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
                Scanning
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
        {/* While scanning, show a disabled "Scanning…" state.
            Once scanning is done (folderSelected && !scanning), show an
            active Continue button so the user can advance explicitly. */}
        {scanning ? (
          <span
            className="wizard-btn wizard-btn--ghost"
            style={{
              cursor: "default",
              color: "var(--color-text-muted)",
              fontWeight: 800,
            }}
          >
            Scanning…
          </span>
        ) : (
          <button
            type="button"
            className="wizard-btn wizard-btn--primary"
            onClick={onNext}
            disabled={!folderSelected}
            style={{
              background: palette.primary,
              color: palette.onPrimary,
              fontWeight: 800,
              opacity: folderSelected ? 1 : 0.4,
              cursor: folderSelected ? "pointer" : "not-allowed",
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
        )}
      </div>
    </div>
  );
}
