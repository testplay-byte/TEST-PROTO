"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getWeather,
  getHourlyForecast,
  getDailyForecast,
} from "../lib/weather-data";
import type {
  CurrentWeather,
  HourlyForecast,
  DailyForecast,
} from "../lib/types";

export function useWeather(locationId: string | null) {
  const [current, setCurrent] = useState<CurrentWeather | null>(null);
  const [hourly, setHourly] = useState<HourlyForecast[]>([]);
  const [daily, setDaily] = useState<DailyForecast[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWeather = useCallback((id: string) => {
    setLoading(true);
    setTimeout(() => {
      setCurrent(getWeather(id));
      setHourly(getHourlyForecast(id));
      setDaily(getDailyForecast(id));
      setLoading(false);
    }, 400);
  }, []);

  useEffect(() => {
    if (locationId) fetchWeather(locationId);
  }, [locationId, fetchWeather]);

  return { current, hourly, daily, loading };
}