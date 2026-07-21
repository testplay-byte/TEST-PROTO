"use client";

import type { AppTheme } from "../../../proto-kit";
import { useDeviceTheme } from "../../../proto-kit";
import type { TemperatureUnit, WindUnit } from "../lib/types";
import styles from "./settings-screen.module.css";

interface SettingsScreenProps {
  tempUnit: TemperatureUnit;
  windUnit: WindUnit;
  onTempUnitChange: (u: TemperatureUnit) => void;
  onWindUnitChange: (u: WindUnit) => void;
  onChangeLocation: () => void;
  locationName: string;
}

export function SettingsScreen({
  tempUnit,
  windUnit,
  onTempUnitChange,
  onWindUnitChange,
  onChangeLocation,
  locationName,
}: SettingsScreenProps) {
  const { theme, setTheme } = useDeviceTheme();

  return (
    <section className={styles.view} aria-label="Settings">
      <div className={styles.topbar}>
        <h1 className={styles.topbarTitle}>Settings</h1>
      </div>

      <div className={styles.content}>
        <div className={styles.group}>
          <div className={styles.groupLabel}>Units</div>
          <div className={styles.card}>
            <div className={styles.row}>
              <div className={styles.rowInfo}>
                <span className={styles.rowTitle}>Temperature</span>
                <span className={styles.rowDesc}>
                  Celsius or Fahrenheit
                </span>
              </div>
              <div className={styles.segment}>
                <button
                  type="button"
                  className={`${styles.segmentBtn} ${tempUnit === "celsius" ? styles.segmentActive : ""}`}
                  onClick={() => onTempUnitChange("celsius")}
                >
                  °C
                </button>
                <button
                  type="button"
                  className={`${styles.segmentBtn} ${tempUnit === "fahrenheit" ? styles.segmentActive : ""}`}
                  onClick={() => onTempUnitChange("fahrenheit")}
                >
                  °F
                </button>
              </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.row}>
              <div className={styles.rowInfo}>
                <span className={styles.rowTitle}>Wind speed</span>
                <span className={styles.rowDesc}>
                  km/h or mph
                </span>
              </div>
              <div className={styles.segment}>
                <button
                  type="button"
                  className={`${styles.segmentBtn} ${windUnit === "kmh" ? styles.segmentActive : ""}`}
                  onClick={() => onWindUnitChange("kmh")}
                >
                  km/h
                </button>
                <button
                  type="button"
                  className={`${styles.segmentBtn} ${windUnit === "mph" ? styles.segmentActive : ""}`}
                  onClick={() => onWindUnitChange("mph")}
                >
                  mph
                </button>
              </div>
            </div>
          </div>
        </div>

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
          <div className={styles.groupLabel}>Location</div>
          <div className={styles.card}>
            <button
              type="button"
              className={styles.actionRow}
              onClick={onChangeLocation}
            >
              <div className={styles.rowInfo}>
                <span className={styles.rowTitle}>Current location</span>
                <span className={styles.rowDesc}>{locationName}</span>
              </div>
              <span className={styles.actionLabel}>Change</span>
            </button>
          </div>
        </div>

        <div className={styles.group}>
          <div className={styles.groupLabel}>About</div>
          <div className={styles.card}>
            <div className={styles.rowStatic}>
              <div className={styles.rowInfo}>
                <span className={styles.rowTitle}>Weather App</span>
                <span className={styles.rowDesc}>
                  Prototype v1 · Weather forecasts
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
        className={`${styles.themeToggleBtn} ${theme === "dark" ? styles.themeToggleActive : ""}`}
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
        className={`${styles.themeToggleBtn} ${theme === "light" ? styles.themeToggleActive : ""}`}
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