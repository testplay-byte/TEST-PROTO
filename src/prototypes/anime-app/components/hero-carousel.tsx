"use client";

/**
 * anime-app / components / hero-carousel — auto-rotating hero on home.
 *
 * Renders up to N slides over a banner image with a gradient scrim,
 * a title + score in the bottom-left, and dot indicators in the
 * bottom-right. Auto-rotates every 5s; clicking a dot pauses + jumps.
 * Clicking the slide opens the detail page (via onClick(id)).
 */
import { useEffect, useRef, useState } from "react";
import type { Anime } from "../lib/types";
import { fmtScore } from "../lib/anilist";
import styles from "./hero-carousel.module.css";

interface HeroCarouselProps {
  slides: Anime[];
  onClick: (id: number) => void;
}

export function HeroCarousel({ slides, onClick }: HeroCarouselProps) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset to the first slide whenever the slide set changes.
  useEffect(() => {
    setIndex(0);
  }, [slides]);

  // Auto-rotate every 5s (only when there's more than one slide).
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (slides.length < 2) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [slides.length]);

  if (slides.length === 0) {
    // Skeleton placeholder while loading.
    return <div className={styles.carousel} aria-hidden="true" />;
  }

  return (
    <div className={styles.carousel}>
      {slides.map((a, i) => {
        const title = a.title.romaji || a.title.english || "Unknown";
        const bg = a.bannerImage || a.coverImage.extraLarge || a.coverImage.large || "";
        return (
          <div
            key={a.id}
            className={`${styles.slide} ${i === index ? styles.slideIsActive : ""}`}
            onClick={() => onClick(a.id)}
            role="button"
            tabIndex={0}
            aria-hidden={i !== index}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick(a.id);
              }
            }}
          >
            {bg && <img className={styles.bg} src={bg} alt={title} loading="lazy" />}
            <div className={styles.content}>
              <h3 className={styles.title}>{title}</h3>
              {a.averageScore ? (
                <span className={styles.score}>
                  <span className={styles.star}>★</span>
                  {fmtScore(a.averageScore)}
                </span>
              ) : null}
            </div>
          </div>
        );
      })}

      {slides.length > 1 && (
        <div className={styles.dots}>
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`${styles.dot} ${i === index ? styles.dotIsActive : ""}`}
              aria-label={`Slide ${i + 1}`}
              onClick={(e) => {
                e.stopPropagation();
                setIndex(i);
                // Restart the auto-rotate timer.
                if (timerRef.current) clearInterval(timerRef.current);
                timerRef.current = setInterval(() => {
                  setIndex((n) => (n + 1) % slides.length);
                }, 5000);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
