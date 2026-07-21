import type { CurrentWeather, HourlyForecast, DailyForecast } from "./types";

const LOCATIONS_DATA: Record<string, CurrentWeather> = {
  tokyo: {
    location: "Tokyo",
    country: "Japan",
    temp: 26,
    feelsLike: 29,
    condition: "partly-cloudy",
    humidity: 68,
    windSpeed: 12,
    windDir: "SW",
    pressure: 1013,
    uvIndex: 6,
    visibility: 10,
    icon: "cloud-sun",
    description: "Partly cloudy with gentle breeze",
    high: 29,
    low: 22,
  },
  london: {
    location: "London",
    country: "United Kingdom",
    temp: 17,
    feelsLike: 15,
    condition: "rainy",
    humidity: 82,
    windSpeed: 18,
    windDir: "W",
    pressure: 1008,
    uvIndex: 2,
    visibility: 7,
    icon: "cloud-rain",
    description: "Light rain throughout the day",
    high: 19,
    low: 14,
  },
  newyork: {
    location: "New York",
    country: "United States",
    temp: 24,
    feelsLike: 25,
    condition: "sunny",
    humidity: 45,
    windSpeed: 8,
    windDir: "SE",
    pressure: 1018,
    uvIndex: 7,
    visibility: 16,
    icon: "sun",
    description: "Clear skies and warm sunshine",
    high: 27,
    low: 20,
  },
  paris: {
    location: "Paris",
    country: "France",
    temp: 20,
    feelsLike: 19,
    condition: "cloudy",
    humidity: 65,
    windSpeed: 14,
    windDir: "N",
    pressure: 1015,
    uvIndex: 4,
    visibility: 12,
    icon: "cloud",
    description: "Overcast with occasional breaks",
    high: 22,
    low: 16,
  },
  sydney: {
    location: "Sydney",
    country: "Australia",
    temp: 22,
    feelsLike: 21,
    condition: "windy",
    humidity: 55,
    windSpeed: 28,
    windDir: "E",
    pressure: 1011,
    uvIndex: 8,
    visibility: 14,
    icon: "wind",
    description: "Strong easterly winds, partly sunny",
    high: 24,
    low: 18,
  },
  dubai: {
    location: "Dubai",
    country: "UAE",
    temp: 38,
    feelsLike: 42,
    condition: "sunny",
    humidity: 35,
    windSpeed: 10,
    windDir: "NW",
    pressure: 1005,
    uvIndex: 11,
    visibility: 20,
    icon: "sun",
    description: "Hot and dry with intense sun",
    high: 40,
    low: 32,
  },
  moscow: {
    location: "Moscow",
    country: "Russia",
    temp: 5,
    feelsLike: 1,
    condition: "snowy",
    humidity: 78,
    windSpeed: 20,
    windDir: "NE",
    pressure: 1020,
    uvIndex: 1,
    visibility: 4,
    icon: "snowflake",
    description: "Light snowfall, freezing winds",
    high: 7,
    low: 0,
  },
  mumbai: {
    location: "Mumbai",
    country: "India",
    temp: 32,
    feelsLike: 36,
    condition: "rainy",
    humidity: 88,
    windSpeed: 16,
    windDir: "SW",
    pressure: 1006,
    uvIndex: 5,
    visibility: 6,
    icon: "cloud-rain",
    description: "Monsoon showers, high humidity",
    high: 33,
    low: 28,
  },
};

const LOCATIONS_SEARCH = [
  { id: "tokyo", name: "Tokyo", country: "Japan" },
  { id: "london", name: "London", country: "United Kingdom" },
  { id: "newyork", name: "New York", country: "United States" },
  { id: "paris", name: "Paris", country: "France" },
  { id: "sydney", name: "Sydney", country: "Australia" },
  { id: "dubai", name: "Dubai", country: "UAE" },
  { id: "moscow", name: "Moscow", country: "Russia" },
  { id: "mumbai", name: "Mumbai", country: "India" },
];

export function searchLocations(query: string) {
  const q = query.toLowerCase().trim();
  if (!q) return LOCATIONS_SEARCH;
  return LOCATIONS_SEARCH.filter(
    (l) =>
      l.name.toLowerCase().includes(q) ||
      l.country.toLowerCase().includes(q),
  );
}

export function getWeather(locationId: string): CurrentWeather {
  return LOCATIONS_DATA[locationId] ?? LOCATIONS_DATA.tokyo;
}

export function getHourlyForecast(locationId: string): HourlyForecast[] {
  const weather = getWeather(locationId);
  const now = new Date();
  const hours: HourlyForecast[] = [];

  for (let i = 0; i < 12; i++) {
    const h = new Date(now);
    h.setHours(now.getHours() + i + 1);
    const hourLabel = `${h.getHours().toString().padStart(2, "0")}:00`;
    const variation = Math.round(Math.sin((i / 4) * Math.PI) * 3);
    hours.push({
      time: hourLabel,
      temp: weather.temp + variation,
      icon: weather.icon,
      condition: weather.condition,
    });
  }
  return hours;
}

export function getDailyForecast(locationId: string): DailyForecast[] {
  const weather = getWeather(locationId);
  const conditions: Array<"sunny" | "cloudy" | "rainy" | "partly-cloudy" | "stormy"> = [
    "sunny",
    "partly-cloudy",
    "cloudy",
    "rainy",
    "partly-cloudy",
    "sunny",
    "cloudy",
  ];
  const icons = ["sun", "cloud-sun", "cloud", "cloud-rain", "cloud-sun", "sun", "cloud"];
  const now = new Date();
  const days: DailyForecast[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    days.push({
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      icon: icons[i],
      condition: conditions[i],
      high: weather.high + Math.round(Math.cos(i * 1.2) * 2),
      low: weather.low + Math.round(Math.cos(i * 1.2 + 1) * 2),
    });
  }
  return days;
}