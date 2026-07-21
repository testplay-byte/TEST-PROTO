"use client";

/**
 * anime-app / screens / home-screen — landing screen.
 *
 * Sections (top to bottom):
 *   1. Trending hero carousel
 *   2. Continue Watching (horizontal row with progress — from history)
 *   3. Popular This Season (3-col grid)
 *   4. Top Rated (3-col grid)
 *
 * All data from AniList via useHomeData(). History items power the
 * Continue Watching section. Cards open the detail screen via onClick(id).
 */
import type { ReactNode } from "react";
import { useHomeData } from "../hooks/use-anilist";
import { useSettings } from "../hooks/use-settings";
import { useCollapsingHeader } from "../hooks/use-collapsing-header";
import { useHistory } from "../hooks/use-history";
import { HeroCarousel } from "../components/hero-carousel";
import { AnimeCard } from "../components/anime-card";
import { ContinueWatching } from "../components/continue-watching";
import styles from "./home-screen.module.css";

interface HomeScreenProps {
  active: boolean;
  onOpenAnime: (id: number) => void;
}

export function HomeScreen({ active, onOpenAnime }: HomeScreenProps) {
  const { settings } = useSettings();
  const { trending, seasonal, topRated, loading } = useHomeData();
  const { items: historyItems } = useHistory();
  const { contentRef, collapsed } = useCollapsingHeader();

  return (
    <section
      className={`view ${active ? "view--active" : ""}`}
      data-view="home"
      aria-label="Home"
      aria-hidden={!active}
    >
      <div className={`${styles.topbar} ${collapsed ? styles.topbarIsCollapsed : ""}`}>
        <h1 className={styles.topbarTitle}>Anime</h1>
      </div>
      <div ref={contentRef} className={styles.content}>
        {/* Hero / Trending */}
        <div className={styles.heroWrap}>
          {loading && trending.length === 0 ? (
            <div className={styles.heroSkeleton} aria-hidden="true" />
          ) : (
            <HeroCarousel slides={trending} onClick={onOpenAnime} />
          )}
        </div>

        {/* Continue Watching — from history */}
        <ContinueWatching items={historyItems} onOpenAnime={onOpenAnime} />

        {/* Popular This Season */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>Popular This Season</span>
          </div>
          <div className={styles.grid}>
            {loading && seasonal.length === 0
              ? renderSkeletons(6)
              : seasonal.map((a, i) => (
                  <AnimeCard
                    key={a.id}
                    anime={a}
                    index={i}
                    onClick={onOpenAnime}
                  />
                ))}
          </div>
        </div>

        {/* Top Rated */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>Top Rated</span>
          </div>
          <div className={styles.grid}>
            {loading && topRated.length === 0
              ? renderSkeletons(9)
              : topRated.map((a, i) => (
                  <AnimeCard
                    key={a.id}
                    anime={a}
                    index={i}
                    onClick={onOpenAnime}
                  />
                ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function renderSkeletons(count: number): ReactNode {
  return Array.from({ length: count }).map((_, i) => (
    <div key={i} className={styles.skeletonCard} aria-hidden="true">
      <div className={styles.skeletonCover} />
      <div className={styles.skeletonLine} />
      <div className={`${styles.skeletonLine} ${styles.skeletonLineShort}`} />
    </div>
  ));
}
