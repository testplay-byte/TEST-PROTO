"use client";

/**
 * anime-app / hooks / use-history — localStorage-backed recently-viewed list.
 *
 *  - Items live at `localStorage["anime-history"]`.
 *  - `add(anime)` dedupes by id and prepends; the list is capped at 20.
 *  - `clear()` wipes the list.
 *
 * Cross-component sync: same custom-event pattern as useLibrary — when one
 * instance mutates the data, it writes to localStorage + dispatches an
 * `anime-history-change` event; all other instances re-read.
 */
import { useCallback, useEffect, useState } from "react";
import type { Anime, HistoryItem } from "../lib/types";

const HIST_KEY = "anime-history";
const HIST_LIMIT = 20;
const EVENT = "anime-history-change";

function read(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(HIST_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Array<Record<string, unknown>>;
      // Migrate old items that lack the new fields (episode, progress, etc.)
      return parsed.map((item) => ({
        id: item.id as number,
        title: item.title as string,
        cover: item.cover as string,
        viewedAt: item.viewedAt as number,
        episode: (item.episode as number) ?? 1,
        totalEpisodes: (item.totalEpisodes as number | null) ?? null,
        progress: (item.progress as number) ?? 0,
        banner: (item.banner as string) ?? (item.cover as string) ?? "",
      }));
    }
  } catch {
    /* ignore */
  }
  return [];
}

function write(items: HistoryItem[]): void {
  try {
    localStorage.setItem(HIST_KEY, JSON.stringify(items));
  } catch {
    /* best-effort */
  }
}

function emitChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(EVENT));
}

export interface UseHistoryResult {
  items: HistoryItem[];
  add: (anime: Anime) => void;
  clear: () => void;
}

export function useHistory(): UseHistoryResult {
  const [items, setItems] = useState<HistoryItem[]>([]);

  // Read once on mount + subscribe to cross-instance changes.
  useEffect(() => {
    setItems(read());
    function onChange() {
      setItems(read());
    }
    window.addEventListener(EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const add = useCallback((anime: Anime) => {
    // Read latest from localStorage (not React state) so the EVENT we
    // dispatch carries the just-written value to other instances.
    const prev = read();
    const title = anime.title.romaji || anime.title.english || "Unknown";
    const cover =
      anime.coverImage.large || anime.coverImage.extraLarge || "";
    const banner = anime.bannerImage || cover || "";

    // Simulate episode + progress. If the anime is already in history,
    // advance the episode slightly; otherwise start at episode 1 with a
    // random progress. This makes Continue Watching feel real without
    // actual playback.
    const existing = prev.find((x) => x.id === anime.id);
    let episode: number;
    let progress: number;
    if (existing) {
      // Advance progress by 15–35%; if it wraps past 100, move to next ep.
      const advance = 15 + Math.floor(Math.random() * 20);
      progress = existing.progress + advance;
      if (progress >= 100) {
        episode = existing.episode + 1;
        progress = Math.min(progress - 100, 80);
      } else {
        episode = existing.episode;
      }
    } else {
      episode = 1;
      progress = 10 + Math.floor(Math.random() * 30);
    }

    const next = [
      {
        id: anime.id,
        title,
        cover,
        viewedAt: Date.now(),
        episode,
        totalEpisodes: anime.episodes ?? null,
        progress: Math.min(progress, 99),
        banner,
      },
      ...prev.filter((x) => x.id !== anime.id),
    ].slice(0, HIST_LIMIT);
    write(next);
    setItems(next);
    emitChange();
  }, []);

  const clear = useCallback(() => {
    write([]);
    setItems([]);
    emitChange();
  }, []);

  return { items, add, clear };
}
