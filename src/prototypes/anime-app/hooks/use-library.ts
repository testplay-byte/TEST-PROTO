"use client";

/**
 * anime-app / hooks / use-library — localStorage-backed saved-anime library.
 *
 *  - Items live at `localStorage["anime-library"]`.
 *  - `add(anime, status)` adds an entry (deduped by id, defaults to "watching").
 *  - `remove(id)` drops an entry.
 *  - `setStatus(id, status)` updates an existing entry's status.
 *  - `has(id)` is a synchronous membership check (also exposed via the items
 *    list for re-render purposes).
 *
 * Cross-component sync: every useLibrary() instance subscribes to a custom
 * `library-change` event (in addition to its own React state). When one
 * instance mutates the data, it writes to localStorage + dispatches the
 * event; all other instances re-read from localStorage and update their
 * state. This mirrors the original script.js behaviour where a single
 * module-level `libraryData` array was mutated in place.
 */
import { useCallback, useEffect, useState } from "react";
import type { Anime, LibraryItem, LibraryStatus } from "../lib/types";

const LIB_KEY = "anime-library";
const EVENT = "anime-library-change";

function read(): LibraryItem[] {
  try {
    const raw = localStorage.getItem(LIB_KEY);
    if (raw) return JSON.parse(raw) as LibraryItem[];
  } catch {
    /* ignore */
  }
  return [];
}

function write(items: LibraryItem[]): void {
  try {
    localStorage.setItem(LIB_KEY, JSON.stringify(items));
  } catch {
    /* best-effort */
  }
}

function emitChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(EVENT));
}

export interface UseLibraryResult {
  items: LibraryItem[];
  has: (id: number) => boolean;
  add: (anime: Anime, status?: LibraryStatus) => void;
  remove: (id: number) => void;
  setStatus: (id: number, status: LibraryStatus) => void;
  clear: () => void;
}

export function useLibrary(): UseLibraryResult {
  const [items, setItems] = useState<LibraryItem[]>([]);

  // Read once on mount + subscribe to cross-instance changes.
  useEffect(() => {
    setItems(read());
    function onChange() {
      setItems(read());
    }
    window.addEventListener(EVENT, onChange);
    // Also listen for the native `storage` event (cross-tab sync).
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const add = useCallback((anime: Anime, status: LibraryStatus = "watching") => {
    // Read latest from localStorage (not React state) so the EVENT we
    // dispatch carries the just-written value to other instances —
    // calling write() inside the setItems updater is unsafe (React may
    // run the updater async / twice in StrictMode), so we do all the
    // side-effecting work here, then commit to React state.
    const prev = read();
    if (prev.some((x) => x.id === anime.id)) return;
    const title = anime.title.romaji || anime.title.english || "Unknown";
    const cover =
      anime.coverImage.large || anime.coverImage.extraLarge || "";
    const next: LibraryItem[] = [
      {
        id: anime.id,
        title,
        cover,
        score: anime.averageScore ?? null,
        format: anime.format ?? null,
        episodes: anime.episodes ?? null,
        status,
        addedAt: Date.now(),
      },
      ...prev,
    ];
    write(next);
    setItems(next);
    // Notify other hook instances in this tab.
    emitChange();
  }, []);

  const remove = useCallback((id: number) => {
    const prev = read();
    const next = prev.filter((x) => x.id !== id);
    write(next);
    setItems(next);
    emitChange();
  }, []);

  const setStatus = useCallback(
    (id: number, status: LibraryStatus) => {
      const prev = read();
      const next = prev.map((x) =>
        x.id === id ? { ...x, status } : x,
      );
      write(next);
      setItems(next);
      emitChange();
    },
    [],
  );

  const clear = useCallback(() => {
    write([]);
    setItems([]);
    emitChange();
  }, []);

  const has = useCallback(
    (id: number) => items.some((x) => x.id === id),
    [items],
  );

  return { items, has, add, remove, setStatus, clear };
}
