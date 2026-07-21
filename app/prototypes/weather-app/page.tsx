"use client";

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
import { WelcomeScreen } from "../../../src/prototypes/weather-app/screens/welcome-screen";
import { HomeScreen } from "../../../src/prototypes/weather-app/screens/home-screen";
import { ForecastScreen } from "../../../src/prototypes/weather-app/screens/forecast-screen";
import { SettingsScreen } from "../../../src/prototypes/weather-app/screens/settings-screen";
import { useWeather } from "../../../src/prototypes/weather-app/hooks/use-weather";
import { useSettings } from "../../../src/prototypes/weather-app/hooks/use-settings";

type ViewId = "welcome" | "home" | "forecast" | "settings";

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
    id: "forecast",
    label: "Forecast",
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
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 10h18M8 2v4M16 2v4" />
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
  welcome: {
    name: "Welcome",
    desc: "Onboarding screen — choose your city to get started with beautiful weather forecasts.",
  },
  home: {
    name: "Home",
    desc: "Current weather dashboard with temperature, conditions, and 6 key stats.",
  },
  forecast: {
    name: "Forecast",
    desc: "Hourly (12h) and daily (7-day) forecasts with clear visual indicators.",
  },
  settings: {
    name: "Settings",
    desc: "Units (C/F, km/mi), theme toggle (dark/light), location change, and app info.",
  },
};

const APP_VIEWS: ViewId[] = ["home", "forecast", "settings"];
const ALL_VIEWS: ViewId[] = ["welcome", "home", "forecast", "settings"];

function readHashView(): ViewId {
  if (typeof window === "undefined") return "welcome";
  const h = window.location.hash.replace(/^#/, "");
  return (ALL_VIEWS as readonly string[]).includes(h)
    ? (h as ViewId)
    : "welcome";
}

export default function Page() {
  const [view, setView] = useState<ViewId>("welcome");
  const [locationId, setLocationId] = useState<string | null>(null);

  const { current, hourly, daily, loading } = useWeather(
    view !== "welcome" ? locationId : null,
  );
  const { settings, setTempUnit, setWindUnit } = useSettings();

  // Read hash on mount.
  useEffect(() => {
    setView(readHashView());
    const savedLoc = localStorage.getItem("weather-app-location");
    if (savedLoc) setLocationId(savedLoc);
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
    if (!(ALL_VIEWS as readonly string[]).includes(id)) return;
    // If user taps nav while on welcome, auto-select first location
    if (view === "welcome" && APP_VIEWS.includes(id as ViewId)) {
      handleLocationSelected("tokyo");
      return;
    }
    const next = id as ViewId;
    if (next === view) return;
    try {
      history.pushState(null, "", `#${id}`);
    } catch {
      /* hash may be unavailable */
    }
    setView(next);
  }

  function handleLocationSelected(id: string) {
    setLocationId(id);
    try {
      localStorage.setItem("weather-app-location", id);
    } catch {
      /* ignore */
    }
    try {
      history.pushState(null, "", "#home");
    } catch {
      /* ignore */
    }
    setView("home");
  }

  function handleChangeLocation() {
    setLocationId(null);
    try {
      localStorage.removeItem("weather-app-location");
    } catch {
      /* ignore */
    }
    try {
      history.pushState(null, "", "#welcome");
    } catch {
      /* ignore */
    }
    setView("welcome");
  }

  // Swipe gestures
  useSwipeSimulation({
    enabled: view !== "welcome",
    onSwipeLeft: () => {
      const idx = APP_VIEWS.indexOf(view);
      if (idx < APP_VIEWS.length - 1) handleNav(APP_VIEWS[idx + 1]);
    },
    onSwipeRight: () => {
      const idx = APP_VIEWS.indexOf(view);
      if (idx > 0) handleNav(APP_VIEWS[idx - 1]);
    },
  });

  const info = SCREEN_INFO[view];
  const locationName = current
    ? `${current.location}, ${current.country}`
    : "Not selected";
  const isAppView = APP_VIEWS.includes(view);

  return (
    <DeviceThemeProvider storageKey="weather-theme" initialTheme="dark">
      <Stage
        leftPanel={
          <>
            <PanelBadge>prototype v1</PanelBadge>
            <PanelTitle>Weather App</PanelTitle>
            <PanelDesc>
              A beautiful, minimal weather app with current conditions,
              hourly &amp; daily forecasts, location search, and
              customizable units. Sky-blue palette with dark/light
              theming.
            </PanelDesc>
            <div className="tags">
              <span className="tag">Weather</span>
              <span className="tag">Dark/light</span>
              <span className="tag">v1</span>
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

            <PanelHead>Screens</PanelHead>
            <div className="mini-bars">
              <MiniBar
                label="Welcome"
                num="1"
                width="25%"
                color="var(--color-primary)"
              />
              <MiniBar
                label="Home"
                num="6 stats"
                width="100%"
                color="var(--color-secondary)"
              />
              <MiniBar
                label="Forecast"
                num="7+12"
                width="90%"
                color="var(--color-tertiary)"
              />
              <MiniBar
                label="Settings"
                num="3 opts"
                width="60%"
                color="var(--color-primary)"
              />
            </div>

            <PanelHead>Design</PanelHead>
            <div className="kvlist">
              <div className="kvlist__row">
                <span>Theme</span>
                <b>Sky Blue</b>
              </div>
              <div className="kvlist__row">
                <span>Elevation</span>
                <b>Tonal</b>
              </div>
              <div className="kvlist__row">
                <span>Primary</span>
                <b>#4fc3f7</b>
              </div>
              <div className="kvlist__row">
                <span>Location</span>
                <b>{locationName}</b>
              </div>
            </div>
          </>
        }
      >
        <DeviceFrame theme="dark">
          <Screen>
            {view === "welcome" && (
              <WelcomeScreen onLocationSelected={handleLocationSelected} />
            )}
            {view === "home" && (
              <HomeScreen
                current={current}
                loading={loading}
                settings={settings}
              />
            )}
            {view === "forecast" && (
              <ForecastScreen
                hourly={hourly}
                daily={daily}
                loading={loading}
                settings={settings}
              />
            )}
            {view === "settings" && (
              <SettingsScreen
                tempUnit={settings.tempUnit}
                windUnit={settings.windUnit}
                onTempUnitChange={setTempUnit}
                onWindUnitChange={setWindUnit}
                onChangeLocation={handleChangeLocation}
                locationName={locationName}
              />
            )}
            {isAppView && (
              <BottomNav
                items={NAV_ITEMS}
                activeId={view}
                onSelect={handleNav}
              />
            )}
          </Screen>
        </DeviceFrame>
      </Stage>
    </DeviceThemeProvider>
  );
}

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
        <div className="mini-bar-fill" style={{ width, background: color }} />
      </div>
      <span className="mini-bar-num">{num}</span>
    </div>
  );
}