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
          <div className={styles.loadingBox}>LOADING...</div>
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
          size={64}
          className={styles.headerIcon}
        />
        <span className={styles.headerTemp}>{displayTemp(current.temp)}</span>
        <span className={styles.headerDesc}>{current.description}</span>
        <div className={styles.headerRange}>
          <span className={styles.rangeBadge}>
            H {displayTemp(current.high)}
          </span>
          <span className={styles.rangeBadge}>
            L {displayTemp(current.low)}
          </span>
        </div>
        <span className={styles.headerLocation}>
          {current.location}, {current.country}
        </span>
      </div>

      <div className={styles.detailGrid}>
        <DetailCard
          label="FEELS LIKE"
          value={displayTemp(current.feelsLike)}
          color="var(--color-primary)"
        />
        <DetailCard
          label="HUMIDITY"
          value={`${current.humidity}%`}
          color="var(--color-secondary)"
        />
        <DetailCard
          label="WIND"
          value={`${windSpeed} ${current.windDir}`}
          color="var(--color-tertiary)"
        />
        <DetailCard
          label="UV INDEX"
          value={uvLabel(current.uvIndex)}
          color="var(--color-primary)"
        />
        <DetailCard
          label="PRESSURE"
          value={`${current.pressure} hPa`}
          color="var(--color-secondary)"
        />
        <DetailCard
          label="VISIBILITY"
          value={`${current.visibility} km`}
          color="var(--color-tertiary)"
        />
      </div>
    </div>
  );
}

function DetailCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className={styles.detailCard} style={{ borderColor: color }}>
      <span className={styles.detailLabel}>{label}</span>
      <span className={styles.detailValue} style={{ color }}>
        {value}
      </span>
    </div>
  );
}

function uvLabel(uv: number): string {
  if (uv <= 2) return `${uv} LOW`;
  if (uv <= 5) return `${uv} MOD`;
  if (uv <= 7) return `${uv} HIGH`;
  if (uv <= 10) return `${uv} V.HIGH`;
  return `${uv} EXTREME`;
}