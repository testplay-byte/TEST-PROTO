"use client";

import type { CurrentWeather, AppSettings } from "../lib/types";
import styles from "./home-screen.module.css";
import { WeatherIcon } from "../components/weather-icon";

interface HomeScreenProps {
  current: CurrentWeather | null;
  loading: boolean;
  settings: AppSettings;
}

export function HomeScreen({ current, loading, settings }: HomeScreenProps) {
  if (loading || !current) {
    return (
      <div className={styles.root}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner} />
          <span className={styles.loadingText}>Loading weather...</span>
        </div>
      </div>
    );
  }

  const tempUnit = settings.tempUnit;
  const displayTemp = (c: number) =>
    tempUnit === "celsius" ? `${Math.round(c)}°` : `${Math.round(c * 1.8 + 32)}°`;

  const windSpeed =
    settings.windUnit === "kmh"
      ? `${current.windSpeed} km/h`
      : `${Math.round(current.windSpeed / 1.609)} mph`;

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <WeatherIcon
          condition={current.condition}
          size={80}
          className={styles.headerIcon}
        />
        <span className={styles.headerTemp}>{displayTemp(current.temp)}</span>
        <span className={styles.headerDesc}>{current.description}</span>
        <span className={styles.headerRange}>
          H:{displayTemp(current.high)} &nbsp; L:{displayTemp(current.low)}
        </span>
        <span className={styles.headerLocation}>
          {current.location}, {current.country}
        </span>
      </div>

      <div className={styles.detailGrid}>
        <DetailCard
          label="Feels like"
          value={displayTemp(current.feelsLike)}
          icon={
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
            </svg>
          }
        />
        <DetailCard
          label="Humidity"
          value={`${current.humidity}%`}
          icon={
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
          }
        />
        <DetailCard
          label="Wind"
          value={`${windSpeed} ${current.windDir}`}
          icon={
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
            </svg>
          }
        />
        <DetailCard
          label="UV Index"
          value={uvLabel(current.uvIndex)}
          icon={
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2m4.93-15.07-1.41 1.41M17.66 17.66l-1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
          }
        />
        <DetailCard
          label="Pressure"
          value={`${current.pressure} hPa`}
          icon={
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 20V10M18 20V4M6 20v-4" />
            </svg>
          }
        />
        <DetailCard
          label="Visibility"
          value={`${current.visibility} km`}
          icon={
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          }
        />
      </div>
    </div>
  );
}

function DetailCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className={styles.detailCard}>
      <div className={styles.detailIcon}>{icon}</div>
      <span className={styles.detailLabel}>{label}</span>
      <span className={styles.detailValue}>{value}</span>
    </div>
  );
}

function uvLabel(uv: number): string {
  if (uv <= 2) return `${uv} Low`;
  if (uv <= 5) return `${uv} Moderate`;
  if (uv <= 7) return `${uv} High`;
  if (uv <= 10) return `${uv} Very High`;
  return `${uv} Extreme`;
}