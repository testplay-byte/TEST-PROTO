"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { AppTheme, ThemeProviderProps } from "./types";

interface ThemeContextValue {
  theme: AppTheme;
  setTheme: (t: AppTheme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * DeviceThemeProvider — scopes the app theme to the device element.
 *
 * Usage in a prototype layout:
 * ```tsx
 * <DeviceThemeProvider storageKey="anime-app-theme" initialTheme="dark">
 *   <DeviceFrame>...</DeviceFrame>
 * </DeviceThemeProvider>
 * ```
 *
 * The provider sets `data-theme` on the nearest `.device` element (the
 * DeviceFrame). It does NOT touch <html> — the page theme is separate.
 */
export function DeviceThemeProvider({
  initialTheme = "dark",
  storageKey,
  onThemeChange,
  children,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<AppTheme>(initialTheme);

  // Read persisted theme on mount.
  useEffect(() => {
    if (!storageKey) return;
    try {
      const saved = localStorage.getItem(storageKey) as AppTheme | null;
      if (saved === "dark" || saved === "light") {
        setThemeState(saved);
      }
    } catch {}
  }, [storageKey]);

  // Apply theme to the .device element + persist.
  useEffect(() => {
    const device = document.querySelector(".device");
    if (device) {
      device.setAttribute("data-theme", theme);
    }
    if (storageKey) {
      try {
        localStorage.setItem(storageKey, theme);
      } catch {}
    }
    onThemeChange?.(theme);
  }, [theme, storageKey, onThemeChange]);

  const setTheme = useCallback((t: AppTheme) => setThemeState(t), []);
  const toggleTheme = useCallback(
    () => setThemeState((t) => (t === "dark" ? "light" : "dark")),
    []
  );

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useDeviceTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useDeviceTheme must be used within <DeviceThemeProvider>");
  }
  return ctx;
}
