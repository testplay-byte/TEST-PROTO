"use client";

import { useState, useEffect, useCallback } from "react";
import type { AppSettings, TemperatureUnit, WindUnit } from "../lib/types";
import { DEFAULT_SETTINGS } from "../lib/types";

const STORAGE_KEY = "weather-app-settings";

function loadSettings(): AppSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AppSettings;
  } catch {
    /* ignore */
  }
  return DEFAULT_SETTINGS;
}

function saveSettings(s: AppSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  const setTempUnit = useCallback((u: TemperatureUnit) => {
    setSettings((prev) => {
      const next = { ...prev, tempUnit: u };
      saveSettings(next);
      return next;
    });
  }, []);

  const setWindUnit = useCallback((u: WindUnit) => {
    setSettings((prev) => {
      const next = { ...prev, windUnit: u };
      saveSettings(next);
      return next;
    });
  }, []);

  return { settings, setTempUnit, setWindUnit };
}