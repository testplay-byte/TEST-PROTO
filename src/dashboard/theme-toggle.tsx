"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

/**
 * Theme toggle button.
 *
 * Server renders the light theme (sun icon visible) to match the
 * `<html data-theme="light">` in app/layout.tsx. On mount we read the
 * persisted theme from localStorage and sync state + DOM. Toggling flips
 * `data-theme` on <html>, persists to localStorage, and swaps the icon.
 */
export function ThemeToggle() {
  // Initial state matches server output (light, sun visible) so SSR markup
  // equals the first client render — no hydration mismatch.
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // Read persisted preference on mount.
  useEffect(() => {
    try {
      const saved = localStorage.getItem("gallery-theme");
      if (saved === "dark" || saved === "light") {
        setTheme(saved);
      }
    } catch {
      // localStorage unavailable; stay with default light.
    }
    setMounted(true);
  }, []);

  // Apply theme to <html> and persist. Skipped before mount so we don't
  // clobber a saved value with the initial "light" before reading it.
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("gallery-theme", theme);
    } catch {
      // Persist best-effort.
    }
  }, [theme, mounted]);

  function toggle() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

  const isDark = theme === "dark";
  const ariaLabel = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      className="navbtn navbtn--icon"
      aria-label={ariaLabel}
      onClick={toggle}
    >
      <svg
        id="iconSun"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        style={{ display: isDark ? "none" : "block" }}
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </svg>
      <svg
        id="iconMoon"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        style={{ display: isDark ? "block" : "none" }}
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>
  );
}
