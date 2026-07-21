"use client";

/**
 * SourceToggle — AniList / Extension segmented buttons.
 *
 * Lives inside the topbar row; the parent's CSS module owns the
 * collapsed-state animations (opacity/width shrink on scroll), so this
 * component applies a stable global class (`source-toggle`) the parent
 * can target via `:global()`, alongside its own module class.
 */
import type { Source } from "../lib/types";
import styles from "./source-toggle.module.css";

interface SourceToggleProps {
  source: Source;
  onChange: (s: Source) => void;
}

export function SourceToggle({ source, onChange }: SourceToggleProps) {
  return (
    <div className={`${styles.sourceToggle} source-toggle`}>
      <button
        type="button"
        className={`${styles.btn} ${source === "anilist" ? styles.btnIsActive : ""}`}
        onClick={() => onChange("anilist")}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <span>AniList</span>
      </button>
      <button
        type="button"
        className={`${styles.btn} ${source === "extension" ? styles.btnIsActive : ""}`}
        onClick={() => onChange("extension")}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
        <span>Extension</span>
      </button>
    </div>
  );
}
