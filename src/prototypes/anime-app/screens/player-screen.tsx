"use client";

import { useAnimeDetail } from "../hooks/use-anilist";
import styles from "./player-screen.module.css";

interface PlayerScreenProps {
  active: boolean;
  animeId: number | null;
  episode: number | null;
  onBack: () => void;
  onSelectEpisode: (epNum: number) => void;
}

export function PlayerScreen({
  active,
  animeId,
  episode,
  onBack,
  onSelectEpisode,
}: PlayerScreenProps) {
  const { anime } = useAnimeDetail(animeId);

  const epCount = anime?.episodes ?? 0;
  const currentEp = episode ?? 1;

  if (!animeId) {
    return (
      <div
        className={`${styles.view} ${active ? styles.viewActive : ""}`}
        data-view="player"
      >
        <div className={styles.empty}>
          <span className={styles.emptyText}>No anime selected</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${styles.view} ${active ? styles.viewActive : ""}`}
      data-view="player"
    >
      {/* Top nav bar */}
      <header className={styles.topbar}>
        <button
          type="button"
          className={styles.backBtn}
          onClick={onBack}
          aria-label="Go back"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <span className={styles.episodeLabel}>
          Episode {currentEp}
        </span>
        <button
          type="button"
          className={styles.nextBtn}
          onClick={() => {
            if (epCount > 0 && currentEp < epCount) {
              onSelectEpisode(currentEp + 1);
            }
          }}
          disabled={epCount === 0 || currentEp >= epCount}
          aria-label="Next episode"
        >
          Next
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
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </header>

      {/* Video player area */}
      <div className={styles.playerArea}>
        <div className={styles.player}>
          <button
            type="button"
            className={styles.playBtn}
            aria-label="Play"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <polygon points="6,2 20,12 6,22" />
            </svg>
          </button>
          <div className={styles.playerOverlay}>
            <span className={styles.playerTimestamp}>00:00 / 24:00</span>
            <span className={styles.playerEpisodeBadge}>
              EP {currentEp}
            </span>
          </div>
          <div className={styles.playerThumb}>
            {anime ? (
              <span className={styles.playerTitle}>
                {anime.title?.romaji || anime.title?.english || "Anime"}
              </span>
            ) : (
              <div className={styles.playerShimmer} />
            )}
          </div>
        </div>
      </div>

      {/* Action row */}
      <div className={styles.actionRow}>
        <button type="button" className={styles.actionBtn}>
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
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          <span>Download</span>
        </button>
        <button type="button" className={styles.actionBtn}>
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
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          <span>Share</span>
        </button>
        <button type="button" className={styles.actionBtn}>
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
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span>Rate</span>
        </button>
        <button type="button" className={styles.actionBtn}>
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
            <polygon points="19 20 9 12 19 4 19 20" />
            <line x1="5" y1="19" x2="5" y2="5" />
          </svg>
          <span>Prev</span>
        </button>
      </div>

      {/* Episode list */}
      <div className={styles.episodeSection}>
        <h3 className={styles.episodeSectionTitle}>Episodes</h3>
        <div className={styles.episodeList}>
          {Array.from({ length: epCount > 0 ? epCount : 0 }).map(
            (_, i) => {
              const epNum = i + 1;
              const isActive = epNum === currentEp;
              return (
                <button
                  key={i}
                  type="button"
                  className={`${styles.episodeRow} ${isActive ? styles.episodeRowActive : ""}`}
                  onClick={() => onSelectEpisode(epNum)}
                >
                  <span className={styles.episodeNum}>{epNum}</span>
                  <div className={styles.episodeInfo}>
                    <span className={styles.episodeTitle}>
                      Episode {epNum}
                    </span>
                    <span className={styles.episodeMeta}>
                      {anime?.format ? formatLabel(anime.format) : "TV"}
                    </span>
                  </div>
                  {isActive && (
                    <span className={styles.playingBadge}>
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <polygon points="4,2 20,12 4,22" />
                      </svg>
                      Now
                    </span>
                  )}
                  {!isActive && (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className={styles.episodePlayIcon}
                    >
                      <polygon points="5,3 19,12 5,21" />
                    </svg>
                  )}
                </button>
              );
            },
          )}
        </div>
      </div>
    </div>
  );
}

function formatLabel(f: string): string {
  const map: Record<string, string> = {
    TV: "TV",
    MOVIE: "Movie",
    OVA: "OVA",
    ONA: "ONA",
    SPECIAL: "Special",
    MUSIC: "Music",
  };
  return map[f] ?? "TV";
}