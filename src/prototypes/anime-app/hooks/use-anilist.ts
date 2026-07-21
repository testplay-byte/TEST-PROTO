"use client";

/**
 * anime-app / hooks / use-anilist — debounced search + home loaders + detail.
 *
 *  - `useAniListSearch` debounces 500ms (matching the original script.js),
 *    cancels stale requests, returns `{ media, loading, error }`.
 *  - `useHomeData` fetches trending/seasonal/top-rated in parallel on mount.
 *  - `useAnimeDetail(id)` fetches a single Media by id; refetches on id change.
 *  - `useRecentSearches` reads/writes `localStorage["search-recent"]`.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchAiringSchedule,
  fetchDetail,
  fetchMedia,
  fetchSeasonal,
  fetchTopRated,
  fetchTrending,
} from "../lib/anilist";
import { currentSeason } from "../lib/filters";
import type { AiringEntry } from "../lib/anilist";
import type { Anime, FilterState, SortOption, Source } from "../lib/types";

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

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
// Home — trending / seasonal / top-rated (parallel, on mount).
// ---------------------------------------------------------------------------

export interface HomeData {
  trending: Anime[];
  seasonal: Anime[];
  topRated: Anime[];
  loading: boolean;
}

export function useHomeData(): HomeData {
  const [trending, setTrending] = useState<Anime[]>([]);
  const [seasonal, setSeasonal] = useState<Anime[]>([]);
  const [topRated, setTopRated] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const { season, year } = currentSeason();
    setLoading(true);
    Promise.all([
      fetchTrending(),
      fetchSeasonal(season, year),
      fetchTopRated(),
    ])
      .then(([t, s, r]) => {
        if (cancelled) return;
        setTrending(t);
        setSeasonal(s);
        setTopRated(r);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { trending, seasonal, topRated, loading };
}

// ---------------------------------------------------------------------------
// Detail — single Media by id.
// ---------------------------------------------------------------------------

export interface DetailResult {
  anime: Anime | null;
  loading: boolean;
  error: string | null;
}

export function useAnimeDetail(id: number | null): DetailResult {
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id == null) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    setAnime(null);
    fetchDetail(id)
      .then((a) => {
        if (cancelled) return;
        if (!a) setError("Anime not found.");
        setAnime(a);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError("Could not load anime. Check your connection.");
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { anime, loading, error };
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

// ---------------------------------------------------------------------------
// Schedule — airing schedules for a 7-day window, grouped by day.
// ---------------------------------------------------------------------------

export interface ScheduleDay {
  /** Day index 0–6 (0 = today). */
  index: number;
  /** JS Date at midnight local time. */
  date: Date;
  /** Short label: "Today", "Tomorrow", or weekday name ("Mon", "Tue"). */
  label: string;
  /** Full weekday name for accessibility. */
  fullLabel: string;
  /** Entries airing on this day. */
  entries: AiringEntry[];
}

/** Build a 7-day window starting at today's local midnight. */
function weekWindow(): { start: number; end: number } {
  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const start = Math.floor(midnight.getTime() / 1000);
  const end = start + 7 * 24 * 60 * 60;
  return { start, end };
}

const WEEKDAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAY_FULL = [
  "Sunday", "Monday", "Tuesday", "Wednesday",
  "Thursday", "Friday", "Saturday",
];

/** Group airing entries into 7 days starting from today. */
function groupByDay(entries: AiringEntry[]): ScheduleDay[] {
  const now = new Date();
  const todayMidnight = new Date(
    now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0,
  );

  const days: ScheduleDay[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(todayMidnight);
    date.setDate(date.getDate() + i);
    days.push({
      index: i,
      date,
      label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : WEEKDAY_SHORT[date.getDay()],
      fullLabel: i === 0 ? "Today" : i === 1 ? "Tomorrow" : WEEKDAY_FULL[date.getDay()],
      entries: [],
    });
  }

  for (const e of entries) {
    const airingDate = new Date(e.airingAt * 1000);
    const airingMidnight = new Date(
      airingDate.getFullYear(), airingDate.getMonth(), airingDate.getDate(), 0, 0, 0, 0,
    );
    const dayDiff = Math.floor(
      (airingMidnight.getTime() - todayMidnight.getTime()) / (24 * 60 * 60 * 1000),
    );
    if (dayDiff >= 0 && dayDiff < 7) {
      days[dayDiff].entries.push(e);
    }
  }

  return days;
}

export interface UseScheduleResult {
  days: ScheduleDay[];
  loading: boolean;
  error: string | null;
}

/** Fetch airing schedules for the next 7 days, grouped by day. */
export function useSchedule(): UseScheduleResult {
  const [days, setDays] = useState<ScheduleDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const { start, end } = weekWindow();
    setLoading(true);
    fetchAiringSchedule(start, end)
      .then((entries) => {
        if (cancelled) return;
        setDays(groupByDay(entries));
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError("Could not fetch schedule.");
        setDays([]);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { days, loading, error };
}
