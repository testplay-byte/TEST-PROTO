"use client";

import { useState } from "react";
import { searchLocations } from "../lib/weather-data";
import styles from "./welcome-screen.module.css";

interface WelcomeScreenProps {
  onLocationSelected: (id: string) => void;
}

export function WelcomeScreen({ onLocationSelected }: WelcomeScreenProps) {
  const [query, setQuery] = useState("");
  const results = searchLocations(query);

  return (
    <div className={styles.root}>
      <div className={styles.hero}>
        <div className={styles.iconWrap}>
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="var(--color-primary)"
            stroke="#000"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </svg>
        </div>
        <h1 className={styles.title}>WEATHER</h1>
        <p className={styles.subtitle}>
          Brutal forecasts. Raw data.
          <br />
          Pick a city below.
        </p>
      </div>

      <div className={styles.searchSection}>
        <div className={styles.searchWrap}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#000"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.searchIcon}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Type a city..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>

        {results.length > 0 && (
          <div className={styles.results}>
            {results.map((loc) => (
              <button
                key={loc.id}
                type="button"
                className={styles.resultCard}
                onClick={() => onLocationSelected(loc.id)}
              >
                <div className={styles.resultLeft}>
                  <span className={styles.cityName}>{loc.name}</span>
                  <span className={styles.countryName}>{loc.country}</span>
                </div>
                <span className={styles.resultArrow}>&rarr;</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={styles.popularSection}>
        <span className={styles.popularLabel}>QUICK PICKS</span>
        <div className={styles.popularGrid}>
          {["tokyo", "newyork", "london", "paris", "islamabad"].map((id) => {
            const loc = searchLocations(id)[0];
            if (!loc) return null;
            return (
              <button
                key={id}
                type="button"
                className={styles.popularChip}
                onClick={() => onLocationSelected(id)}
              >
                {loc.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}