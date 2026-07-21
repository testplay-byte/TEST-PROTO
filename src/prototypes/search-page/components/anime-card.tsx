"use client";

/**
 * AnimeCard — a single result tile (cover + score badge + title + meta).
 *
 * Staggered fade-in is driven by the `index` prop via inline
 * `animationDelay` — matches the original 40ms-per-card stagger.
 */
import type { Anime } from "../lib/types";
import { fmtScore } from "../lib/anilist";
import styles from "./anime-card.module.css";

interface AnimeCardProps {
  anime: Anime;
  index: number;
}

export function AnimeCard({ anime, index }: AnimeCardProps) {
  const title = anime.title.romaji || anime.title.english || "Unknown";
  const cover = anime.coverImage.large || anime.coverImage.extraLarge || "";

  const metaParts: string[] = [];
  if (anime.format) metaParts.push(anime.format);
  if (anime.episodes) metaParts.push(`${anime.episodes} ep`);
  else if (anime.seasonYear) metaParts.push(String(anime.seasonYear));
  const meta = metaParts.join(" · ");

  return (
    <div
      className={styles.card}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className={styles.cover}>
        {cover && (
          <img src={cover} alt={title} loading="lazy" />
        )}
        {anime.averageScore ? (
          <span className={styles.score}>
            <span className={styles.star}>★</span>
            {fmtScore(anime.averageScore)}
          </span>
        ) : null}
      </div>
      <h3 className={styles.title}>{title}</h3>
      {meta && <span className={styles.meta}>{meta}</span>}
    </div>
  );
}
