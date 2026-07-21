"use client";

/**
 * SettingsScreen — theme toggle + about card.
 *
 * Theme state lives in the DeviceThemeProvider (scoped to `.device`),
 * accessed via `useDeviceTheme()`. Persisting to localStorage is handled
 * by the provider.
 */
import { useDeviceTheme } from "../../../proto-kit";
import type { AppTheme } from "../../../proto-kit";
import styles from "./settings-screen.module.css";

export function SettingsScreen() {
  const { theme, setTheme } = useDeviceTheme();

  return (
    <section className={styles.view} aria-label="Settings">
      <div className={styles.topbar}>
        <h1 className={styles.topbarTitle}>Settings</h1>
      </div>

      <div className={styles.content}>
        <div className={styles.group}>
          <div className={styles.groupLabel}>Appearance</div>
          <div className={styles.card}>
            <div className={styles.row}>
              <div className={styles.rowInfo}>
                <span className={styles.rowTitle}>Theme</span>
                <span className={styles.rowDesc}>
                  Switch between dark and light mode
                </span>
              </div>
              <ThemeToggle theme={theme} onChange={setTheme} />
            </div>
          </div>
        </div>

        <div className={styles.group}>
          <div className={styles.groupLabel}>About</div>
          <div className={styles.card}>
            <div className={`${styles.row} ${styles.rowStatic}`}>
              <div className={styles.rowInfo}>
                <span className={styles.rowTitle}>Search Page</span>
                <span className={styles.rowDesc}>
                  Prototype v3 · Material 3 Expressive · AniList API
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface ThemeToggleProps {
  theme: AppTheme;
  onChange: (t: AppTheme) => void;
}

function ThemeToggle({ theme, onChange }: ThemeToggleProps) {
  return (
    <div className={styles.themeToggle}>
      <button
        type="button"
        className={`${styles.themeToggleBtn} ${theme === "dark" ? styles.themeToggleBtnIsActive : ""}`}
        onClick={() => onChange("dark")}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
        <span>Dark</span>
      </button>
      <button
        type="button"
        className={`${styles.themeToggleBtn} ${theme === "light" ? styles.themeToggleBtnIsActive : ""}`}
        onClick={() => onChange("light")}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
        <span>Light</span>
      </button>
    </div>
  );
}
