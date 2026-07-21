"use client";

/**
 * search-page / hooks / use-anilist — debounced AniList search + recents.
 *
 * `useAniListSearch` debounces 500ms (matching the original script.js),
 * cancels stale requests, and exposes `{ media, loading, error }`.
 *
 * `useRecentSearches` reads/writes `localStorage["search-recent"]` and
 * exposes `{ recents, add, remove, clear }`.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { fetchMedia } from "../lib/anilist";
import type { Anime, FilterState, SortOption, Source } from "../lib/types";

export interface UseAniListSearchArgs extends FilterState {
  query: string;
  sort: SortOption;
  /** Source affects only the result label, not the API call — but we include
   *  it as a dep so source changes (which reset the sort) re-trigger search. */
  source: Source;
}

export interface AniListSearchResult {
  media: Anime[];
  loading: boolean;
  error: string | null;
}

export function useAniListSearch(args: UseAniListSearchArgs): AniListSearchResult {
  const [media, setMedia] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Stringify the deps that are objects/arrays so the dep array can be primitive.
  const genresKey = args.genres.join(",");

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setLoading(true);
      setError(null);
      fetchMedia({
        search: args.query,
        genres: args.genres,
        year: args.year,
        season: args.season,
        format: args.format,
        status: args.status,
        minScore: args.minScore,
        sort: args.sort,
      })
        .then((d) => {
          if (cancelled) return;
          setMedia(d.data?.Page?.media ?? []);
          setLoading(false);
        })
        .catch(() => {
          if (cancelled) return;
          setError("Could not fetch results. Check your connection.");
          setMedia([]);
          setLoading(false);
        });
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [
    args.query,
    args.sort,
    args.source,
    args.year,
    args.season,
    args.format,
    args.status,
    args.minScore,
    genresKey,
  ]);

  return { media, loading, error };
}

// ---------------------------------------------------------------------------
// Recent searches — localStorage-backed list.
// ---------------------------------------------------------------------------

const RECENT_KEY = "search-recent";
const RECENT_LIMIT = 12;

export interface UseRecentSearchesResult {
  recents: string[];
  add: (query: string) => void;
  remove: (query: string) => void;
  clear: () => void;
}

export function useRecentSearches(): UseRecentSearchesResult {
  const [recents, setRecents] = useState<string[]>([]);
  const ready = useRef(false);

  // Read once on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      if (raw) setRecents(JSON.parse(raw));
    } catch {
      /* localStorage unavailable; start empty. */
    }
    ready.current = true;
  }, []);

  const add = useCallback((query: string) => {
    const q = query.trim();
    if (!q) return;
    setRecents((prev) => {
      const next = [q, ...prev.filter((x) => x !== q)].slice(0, RECENT_LIMIT);
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch {
        /* best-effort */
      }
      return next;
    });
  }, []);

  const remove = useCallback((query: string) => {
    setRecents((prev) => {
      const next = prev.filter((x) => x !== query);
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch {
        /* best-effort */
      }
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setRecents([]);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify([]));
    } catch {
      /* best-effort */
    }
  }, []);

  return { recents, add, remove, clear };
}
