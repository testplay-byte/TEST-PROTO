"use client";

/**
 * anime-app / page — the prototype entry point.
 *
 * Renders the full shell:
 *   DeviceThemeProvider (theme, scoped to .device) →
 *   SettingsProvider (settings, scoped to this subtree) →
 *   Stage (left/right info panels + device) →
 *   DeviceFrame → Screen → (all 6 views always mounted; visibility via
 *   .view--active) + BottomNav (hidden when detail is active).
 *
 * Hash router:
 *   #home / #search / #library / #history / #schedule / #settings → that view.
 *   #animedetails{id} → detail view (pushed, slides in from right).
 *   #animedetails{id}-{episode} → player view (episode number after dash).
 *
 * Detail pushes use history.pushState (not replaceState) so the browser's
 * back button closes the detail view. The popstate listener re-parses
 * the hash on every navigation.
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
  KeyboardProvider,
  Keyboard,
} from "../../../src/proto-kit";
import { SettingsProvider } from "../../../src/prototypes/anime-app/hooks/use-settings";
import { HomeScreen } from "../../../src/prototypes/anime-app/screens/home-screen";
import { SearchScreen } from "../../../src/prototypes/anime-app/screens/search-screen";
import { LibraryScreen } from "../../../src/prototypes/anime-app/screens/library-screen";
import { HistoryScreen } from "../../../src/prototypes/anime-app/screens/history-screen";
import { ScheduleScreen } from "../../../src/prototypes/anime-app/screens/schedule-screen";
import { SettingsScreen } from "../../../src/prototypes/anime-app/screens/settings-screen";
import { DetailScreen } from "../../../src/prototypes/anime-app/screens/detail-screen";
import { PlayerScreen } from "../../../src/prototypes/anime-app/screens/player-screen";

type ViewId = "home" | "search" | "library" | "history" | "schedule" | "settings" | "detail" | "player";

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
    id: "schedule",
    label: "Schedule",
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
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
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
  home: {
    name: "Home",
    desc: "Browse trending, seasonal, and top-rated anime.",
  },
  library: {
    name: "Library",
    desc: "Your saved anime, organized by status.",
  },
  history: {
    name: "History",
    desc: "Recently viewed anime.",
  },
  schedule: {
    name: "Schedule",
    desc: "Weekly airing schedule — see what's on today and this week.",
  },
  search: {
    name: "Search",
    desc: "Search AniList with filters and recent searches.",
  },
  settings: {
    name: "Settings",
    desc: "Theme, display, animations, and data management.",
  },
  detail: {
    name: "Detail",
    desc: "Anime details with synopsis, genres, and episodes.",
  },
  player: {
    name: "Player",
    desc: "Video player with episode list, share, and download options.",
  },
};

// ---------------------------------------------------------------------------
// Hash parsing
// ---------------------------------------------------------------------------

interface HashState {
  view: ViewId;
  detailId: number | null;
  episode: number | null;
}

function parseHash(): HashState {
  if (typeof window === "undefined") return { view: "home", detailId: null, episode: null };
  const hash = window.location.hash.replace(/^#/, "");
  if (!hash || hash === "home") return { view: "home", detailId: null, episode: null };
  if (
    hash === "search" ||
    hash === "library" ||
    hash === "history" ||
    hash === "schedule" ||
    hash === "settings"
  ) {
    return { view: hash, detailId: null, episode: null };
  }
  if (hash.startsWith("animedetails")) {
    const raw = hash.replace("animedetails", "");
    // Check for episode suffix: animedetails123-45
    const dashIdx = raw.indexOf("-");
    if (dashIdx !== -1) {
      const id = parseInt(raw.slice(0, dashIdx), 10);
      const ep = parseInt(raw.slice(dashIdx + 1), 10);
      if (id && ep) return { view: "player", detailId: id, episode: ep };
    }
    const id = parseInt(raw, 10);
    if (id) return { view: "detail", detailId: id, episode: null };
  }
  return { view: "home", detailId: null, episode: null };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function Page() {
  const [view, setView] = useState<ViewId>("home");
  const [detailId, setDetailId] = useState<number | null>(null);
  const [episode, setEpisode] = useState<number | null>(null);

  // Read hash on mount. If empty, replaceState to #home (matches original).
  useEffect(() => {
    if (window.location.hash === "") {
      try {
        history.replaceState(null, "", "#home");
      } catch {
        /* sandbox may block hash writes — ignore */
      }
      setView("home");
      setDetailId(null);
      setEpisode(null);
    } else {
      const { view: v, detailId: id, episode: ep } = parseHash();
      setView(v);
      setDetailId(id);
      setEpisode(ep);
    }
  }, []);

  // Listen for back/forward.
  useEffect(() => {
    function onPop() {
      const { view: v, detailId: id, episode: ep } = parseHash();
      setView(v);
      setDetailId(id);
      setEpisode(ep);
    }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Open detail from a card click — pushState so back button closes it.
  function openDetail(id: number) {
    try {
      history.pushState({ view: "detail", id }, "", `#animedetails${id}`);
    } catch {
      /* sandbox may block — fall through to state update only */
    }
    setView("detail");
    setDetailId(id);
    setEpisode(null);
  }

  // Open player from an episode click — pushState so back returns to detail.
  function openPlayer(animeId: number, epNum: number) {
    try {
      history.pushState(
        { view: "player", id: animeId, episode: epNum },
        "",
        `#animedetails${animeId}-${epNum}`,
      );
    } catch {
      /* ignore */
    }
    setView("player");
    setDetailId(animeId);
    setEpisode(epNum);
  }

  // Bottom nav click.
  function handleNav(id: string) {
    if (id === view) return;
    try {
      history.pushState(null, "", `#${id}`);
    } catch {
      /* ignore */
    }
    setView(id as ViewId);
    setDetailId(null);
    setEpisode(null);
  }

  // Back button on the detail or player screen → history.back() → popstate fires.
  function closeDetail() {
    history.back();
  }

  // ─────────────────────────────────────────────────────────────────────
  // Swipe gestures (proto-kit)
  // Click+drag vertically = scroll content. Click+drag horizontally past
  // 70px = navigate between screens (left = next, right = previous).
  // On the detail screen, swipe right = back (close detail).
  // ─────────────────────────────────────────────────────────────────────
  const SWIPE_ORDER: ViewId[] = [
    "home", "library", "history", "schedule", "search", "settings",
  ];

  useSwipeSimulation({
    enabled: true,
    onSwipeLeft: () => {
      if (view === "detail" || view === "player") return;
      const idx = SWIPE_ORDER.indexOf(view);
      if (idx >= 0 && idx < SWIPE_ORDER.length - 1) {
        handleNav(SWIPE_ORDER[idx + 1]);
      }
    },
    onSwipeRight: () => {
      if (view === "detail" || view === "player") {
        closeDetail();
        return;
      }
      const idx = SWIPE_ORDER.indexOf(view);
      if (idx > 0) {
        handleNav(SWIPE_ORDER[idx - 1]);
      }
    },
  });
  // ─────────────────────────────────────────────────────────────────────

  const info = SCREEN_INFO[view];

  // The active nav id — when detail/player is open, no nav item is highlighted.
  const navActiveId = view === "detail" || view === "player" ? "" : view;

  return (
    <DeviceThemeProvider storageKey="anime-app-theme" initialTheme="dark">
      <KeyboardProvider>
      <SettingsProvider>
        <Stage
          leftPanel={
            <>
              <PanelBadge>prototype</PanelBadge>
              <PanelTitle>Anime App</PanelTitle>
              <PanelDesc>
                Material 3 Expressive anime app with Home, Library, History,
                Schedule, Search, Settings, and Detail pages. Real AniList
                data. Add-to-library functionality.
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
              {/* All views always mounted — visibility via .view--active.
                  The bottom nav is hidden on the detail view. */}
              <HomeScreen
                active={view === "home"}
                onOpenAnime={openDetail}
              />
              <LibraryScreen
                active={view === "library"}
                onOpenAnime={openDetail}
              />
              <HistoryScreen
                active={view === "history"}
                onOpenAnime={openDetail}
              />
              <ScheduleScreen
                active={view === "schedule"}
                onOpenAnime={openDetail}
              />
              <SearchScreen
                active={view === "search"}
                onOpenAnime={openDetail}
              />
              <SettingsScreen active={view === "settings"} />

{/* Detail (pushed view) — slides in from the right.
                   Records itself into history when its anime loads
                   (the effect lives inside DetailScreen). */}
              <DetailScreen
                active={view === "detail"}
                animeId={detailId}
                onBack={closeDetail}
                onPlayEpisode={(animeId, epNum) => openPlayer(animeId, epNum)}
              />

              {/* Player (pushed view) — slides in from the right.
                   Shows video player, episode list, and action buttons. */}
              <PlayerScreen
                active={view === "player"}
                animeId={detailId}
                episode={episode}
                onBack={closeDetail}
                onSelectEpisode={(epNum) => {
                  if (detailId !== null) openPlayer(detailId, epNum);
                }}
              />
            </Screen>

            {/* Bottom nav — hidden when detail or player is open. */}
            {view !== "detail" && view !== "player" && (
              <BottomNav
                items={NAV_ITEMS}
                activeId={navActiveId}
                onSelect={handleNav}
              />
            )}

            {/* Custom on-screen keyboard (replaces native soft keyboard) */}
            <Keyboard />
          </DeviceFrame>
        </Stage>
      </SettingsProvider>
      </KeyboardProvider>
    </DeviceThemeProvider>
  );
}

/**
 * DetailTracker — REMOVED.
 *
 * Originally wrapped DetailScreen to call useAnimeDetail + useHistory at the
 * page level. Moved both calls into DetailScreen itself (it already calls
 * useAnimeDetail; useHistory.add is now triggered from a useEffect inside
 * DetailScreen when the anime becomes available). This avoids double-fetching
 * the same Media via two separate useAnimeDetail hook instances.
 */

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
