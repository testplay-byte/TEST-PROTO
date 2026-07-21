"use client";

/**
 * anime-app / hooks / use-settings — app-wide settings (localStorage-backed).
 *
 * Settings live at `localStorage["anime-app-settings"]` and comprise:
 *   - singleLineTitles (bool)  — applied per-card via a class.
 *   - posterStyle (rounded/sharp/circle) — applied to `.device` via
 *     `data-poster-style` so the global `.anime-card__cover` rules in
 *     anime-app.css take effect.
 *   - cardDensity (default/compact/comfortable) — applied per results-grid
 *     via a class.
 *   - animSpeed (fast/normal/slow) — applied to `.device` via
 *     `data-anim-speed` so the global `--dur-*` overrides in anime-app.css
 *     take effect (every transition in the app reads --dur-*).
 *
 * Exposed as a React Context (`SettingsProvider` + `useSettings()`) so a
 * single mutation in SettingsScreen re-renders every consumer (cards,
 * grids, etc.) live.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { DEFAULT_SETTINGS, type Settings } from "../lib/types";

const SETTINGS_KEY = "anime-app-settings";

function read(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Settings>;
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch {
    /* ignore */
  }
  return { ...DEFAULT_SETTINGS };
}

function write(s: Settings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  } catch {
    /* best-effort */
  }
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface SettingsContextValue {
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
  toggleSingleLine: () => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  // Read once on mount.
  useEffect(() => {
    setSettings(read());
  }, []);

  // Apply data-anim-speed + data-poster-style + data-card-density to the
  // .device element so the global CSS rules in anime-app.css pick them up.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const device = document.querySelector(".device");
    if (!device) return;
    device.setAttribute("data-anim-speed", settings.animSpeed);
    device.setAttribute("data-poster-style", settings.posterStyle);
    device.setAttribute("data-card-density", settings.cardDensity);
  }, [settings.animSpeed, settings.posterStyle, settings.cardDensity]);

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      write(next);
      return next;
    });
  }, []);

  const toggleSingleLine = useCallback(() => {
    setSettings((prev) => {
      const next = { ...prev, singleLineTitles: !prev.singleLineTitles };
      write(next);
      return next;
    });
  }, []);

  const value = useMemo<SettingsContextValue>(
    () => ({ settings, update, toggleSingleLine }),
    [settings, update, toggleSingleLine],
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettings must be used within <SettingsProvider>");
  }
  return ctx;
}
