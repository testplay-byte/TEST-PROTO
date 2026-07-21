"use client";

/**
 * anime-app / components / continue-watching — horizontal scrollable row.
 *
 * Shows recently-viewed anime as wide cards with a banner image, title,
 * episode number, and a progress bar. Clicking a card opens the detail
 * screen. This appears at the top of the History screen (and optionally
 * the Home screen).
 *
 * Only renders if there are items with progress > 0.
 */
import type { HistoryItem } from "../lib/types";
import styles from "./continue-watching.module.css";

interface ContinueWatchingProps {
  items: HistoryItem[];
  onOpenAnime: (id: number) => void;
}

export function ContinueWatching({ items, onOpenAnime }: ContinueWatchingProps) {
  // Only show items that have progress (i.e. were "watched")
  const watching = items.filter((x) => x.progress > 0);
  if (watching.length === 0) return null;

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <span className={styles.title}>Continue Watching</span>
      </div>
      <div className={styles.scrollRow}>
        {watching.map((item, i) => (
          <button
            key={item.id}
            type="button"
            className={styles.card}
            style={{ animationDelay: `${Math.min(i, 6) * 50}ms` }}
            onClick={() => onOpenAnime(item.id)}
          >
            <div className={styles.bannerWrap}>
              {item.banner ? (
                <img
                  src={item.banner}
                  alt=""
                  className={styles.banner}
                  loading="lazy"
                />
              ) : (
                <div className={styles.bannerPlaceholder} />
              )}
              {/* Gradient overlay for text readability */}
              <div className={styles.overlay} />
              {/* Play icon */}
              <div className={styles.playIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              {/* Episode label (top-right) */}
              <span className={styles.epLabel}>
                EP {item.episode}
                {item.totalEpisodes ? ` / ${item.totalEpisodes}` : ""}
              </span>
              {/* Title (bottom, overlaid) */}
              <span className={styles.cardTitle}>{item.title}</span>
              {/* Progress bar (bottom edge) */}
              <div className={styles.progressTrack}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
