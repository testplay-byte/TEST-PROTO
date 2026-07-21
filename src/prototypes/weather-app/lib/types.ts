export interface WeatherLocation {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export interface CurrentWeather {
  location: string;
  country: string;
  temp: number;
  feelsLike: number;
  condition: WeatherCondition;
  humidity: number;
  windSpeed: number;
  windDir: string;
  pressure: number;
  uvIndex: number;
  visibility: number;
  icon: string;
  description: string;
  high: number;
  low: number;
}

export interface HourlyForecast {
  time: string;
  temp: number;
  icon: string;
  condition: WeatherCondition;
}

export interface DailyForecast {
  day: string;
  date: string;
  icon: string;
  condition: WeatherCondition;
  high: number;
  low: number;
}

export type WeatherCondition =
  | "sunny"
  | "partly-cloudy"
  | "cloudy"
  | "rainy"
  | "stormy"
  | "snowy"
  | "foggy"
  | "windy";

export type TemperatureUnit = "celsius" | "fahrenheit";
export type WindUnit = "kmh" | "mph";

export interface AppSettings {
  tempUnit: TemperatureUnit;
  windUnit: WindUnit;
}

export const DEFAULT_SETTINGS: AppSettings = {
  tempUnit: "celsius",
  windUnit: "kmh",
};