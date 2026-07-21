"use client";

/**
 * search-page / page — the prototype entry point.
 *
 * Renders the full shell: DeviceThemeProvider (scoped to `.device`) →
 * Stage (left/right info panels + device) → DeviceFrame → Screen →
 * (SearchScreen | SettingsScreen) + BottomNav.
 *
 * Hash router: `#search` (default) ↔ `#settings`. The 3 unimplemented
 * nav items (Home/Library/History) animate on tap but don't change views.
 */
import { useEffect, useState } from "react";
import {
  DeviceThemeProvider,
  DeviceFrame,
  Screen,
  Stage,
  BottomNav,
  PanelBadge,
  PanelTitle,
  PanelDesc,
  PanelHead,
  useSwipeSimulation,
} from "../../../src/proto-kit";
import { SearchScreen } from "../../../src/prototypes/search-page/screens/search-screen";
import { SettingsScreen } from "../../../src/prototypes/search-page/screens/settings-screen";

type ViewId = "search" | "settings";

const NAV_ITEMS = [
  {
    id: "home",
    label: "Home",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
      </svg>
    ),
  },
  {
    id: "library",
    label: "Library",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    id: "history",
    label: "History",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
        <path d="M12 7v5l4 2" />
      </svg>
    ),
  },
  {
    id: "search",
    label: "Search",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    ),
  },
  {
    id: "settings",
    label: "Settings",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

const SCREEN_INFO: Record<ViewId, { name: string; desc: string }> = {
  search: {
    name: "Search",
    desc: "M3 Expressive search with tonal elevation, recent searches, and source-aware defaults.",
  },
  settings: {
    name: "Settings",
    desc: "Theme toggle and app info. Dark/light mode persists across sessions.",
  },
};

function readHashView(): ViewId {
  if (typeof window === "undefined") return "search";
  const h = window.location.hash.replace(/^#/, "");
  return h === "settings" ? "settings" : "search";
}

export default function Page() {
  const [view, setView] = useState<ViewId>("search");

  // Read hash on mount.
  useEffect(() => {
    setView(readHashView());
  }, []);

  // Listen for back/forward.
  useEffect(() => {
    function onPop() {
      setView(readHashView());
    }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  function handleNav(id: string) {
    if (id === "search" || id === "settings") {
      const next = id as ViewId;
      if (next === view) return;
      // Update the URL hash without scrolling.
      try {
        history.pushState(null, "", `#${id}`);
      } catch {
        /* hash may be unavailable in some sandboxes — ignore. */
      }
      setView(next);
    }
    // Non-implemented views (home/library/history) are no-ops.
  }

  // ─────────────────────────────────────────────────────────────────────
  // Swipe gestures (proto-kit)
  // Click+drag vertically = scroll content. Click+drag horizontally past
  // 70px = navigate between screens (left = settings, right = search).
  // ─────────────────────────────────────────────────────────────────────
  useSwipeSimulation({
    enabled: true,
    onSwipeLeft: () => {
      if (view === "search") handleNav("settings");
    },
    onSwipeRight: () => {
      if (view === "settings") handleNav("search");
    },
  });
  // ─────────────────────────────────────────────────────────────────────

  const info = SCREEN_INFO[view];

  return (
    <DeviceThemeProvider storageKey="search-theme" initialTheme="dark">
      <Stage
        leftPanel={
          <>
            <PanelBadge>prototype v3</PanelBadge>
            <PanelTitle>Search Page</PanelTitle>
            <PanelDesc>
              Material 3 Expressive search with tonal elevation, recent
              searches, source-aware defaults, and a feature-rich filter
              bottom sheet.
            </PanelDesc>
            <div className="tags">
              <span className="tag">Material 3</span>
              <span className="tag">AniList</span>
              <span className="tag">v3</span>
            </div>
          </>
        }
        rightPanel={
          <>
            <PanelHead>Screen info</PanelHead>
            <div className="screeninfo">
              <span className="screeninfo__name">{info.name}</span>
              <span className="screeninfo__desc">{info.desc}</span>
            </div>

            <PanelHead>Filters</PanelHead>
            <div className="mini-bars">
              <MiniBar label="Genres" num="16" width="100%" color="var(--color-primary)" />
              <MiniBar label="Year" num="35" width="90%" color="var(--color-tertiary)" />
              <MiniBar label="Season" num="4" width="40%" color="var(--color-secondary)" />
              <MiniBar label="Format" num="6" width="60%" color="var(--color-success)" />
              <MiniBar label="Status" num="4" width="50%" color="var(--color-warn)" />
              <MiniBar label="Score" num="slider" width="75%" color="var(--color-error)" />
              <MiniBar label="Sort" num="5" width="55%" color="var(--color-primary)" />
            </div>

            <PanelHead>Design</PanelHead>
            <div className="kvlist">
              <div className="kvlist__row">
                <span>Theme</span>
                <b>M3 Expressive</b>
              </div>
              <div className="kvlist__row">
                <span>Elevation</span>
                <b>Tonal</b>
              </div>
              <div className="kvlist__row">
                <span>Primary</span>
                <b>#d0bcff</b>
              </div>
            </div>
          </>
        }
      >
        <DeviceFrame theme="dark">
          <Screen>
            {view === "search" ? <SearchScreen /> : <SettingsScreen />}
            <BottomNav
              items={NAV_ITEMS}
              activeId={view}
              onSelect={handleNav}
            />
          </Screen>
        </DeviceFrame>
      </Stage>
    </DeviceThemeProvider>
  );
}

/** A single mini-bar row in the right info panel. */
function MiniBar({
  label,
  num,
  width,
  color,
}: {
  label: string;
  num: string;
  width: string;
  color: string;
}) {
  return (
    <div className="mini-bar-row">
      <span className="mini-bar-label">{label}</span>
      <div className="mini-bar-track">
        <div
          className="mini-bar-fill"
          style={{ width, background: color }}
        />
      </div>
      <span className="mini-bar-num">{num}</span>
    </div>
  );
}
