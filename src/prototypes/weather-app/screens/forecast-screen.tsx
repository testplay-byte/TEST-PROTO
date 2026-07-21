"use client";

import { useState } from "react";
import type { HourlyForecast, DailyForecast, AppSettings } from "../lib/types";
import { WeatherIcon } from "../components/weather-icon";
import styles from "./forecast-screen.module.css";

interface ForecastScreenProps {
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  loading: boolean;
  settings: AppSettings;
}

export function ForecastScreen({
  hourly,
  daily,
  loading,
  settings,
}: ForecastScreenProps) {
  const [tab, setTab] = useState<"hourly" | "daily">("hourly");
  const tempUnit = settings.tempUnit;
  const displayTemp = (c: number) =>
    tempUnit === "celsius" ? `${Math.round(c)}°` : `${Math.round(c * 1.8 + 32)}°`;

  if (loading) {
    return (
      <div className={styles.root}>
        <div className={styles.topbar}>
          <h1 className={styles.topbarTitle}>Forecast</h1>
        </div>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <div className={styles.topbar}>
        <h1 className={styles.topbarTitle}>Forecast</h1>
        <div className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tab} ${tab === "hourly" ? styles.tabActive : ""}`}
            onClick={() => setTab("hourly")}
          >
            Hourly
          </button>
          <button
            type="button"
            className={`${styles.tab} ${tab === "daily" ? styles.tabActive : ""}`}
            onClick={() => setTab("daily")}
          >
            Daily
          </button>
        </div>
      </div>

      <div className={styles.content}>
        {tab === "hourly" ? (
          <div className={styles.list}>
            {hourly.map((h, i) => (
              <div key={i} className={styles.row}>
                <span className={styles.rowTime}>{h.time}</span>
                <WeatherIcon
                  condition={h.condition}
                  size={28}
                  className={styles.rowIcon}
                />
                <span className={styles.rowTemp}>{displayTemp(h.temp)}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.list}>
            {daily.map((d, i) => (
              <div key={i} className={styles.row}>
                <div className={styles.rowDay}>
                  <span className={styles.rowDayName}>{d.day}</span>
                  <span className={styles.rowDate}>{d.date}</span>
                </div>
                <WeatherIcon
                  condition={d.condition}
                  size={28}
                  className={styles.rowIcon}
                />
                <div className={styles.rowRange}>
                  <span className={styles.rowHigh}>
                    {displayTemp(d.high)}
                  </span>
                  <span className={styles.rowLow}>
                    {displayTemp(d.low)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}