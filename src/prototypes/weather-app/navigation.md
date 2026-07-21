# weather-app — navigation

## What this prototype is
A beautiful, minimal weather app with location search, current conditions dashboard (6 stats), hourly & daily forecasts (12h + 7-day), and customizable settings (units, theme). Sky-blue palette with dark/light theming.

## Screens
| Screen    | View id    | Description |
|-----------|------------|-------------|
| Welcome   | `welcome`  | Onboarding with city search + popular city chips. Animated entry. |
| Home      | `home`     | Current weather dashboard: temperature, condition icon, description, feels like, humidity, wind, UV index, pressure, visibility (6 detail cards). |
| Forecast  | `forecast` | Tab-switchable hourly (12h) and daily (7d) forecast lists. |
| Settings  | `settings` | Temperature unit (°C/°F), wind unit (km/h/mph), dark/light theme toggle, change location, app info. |

## Navigation
- Welcome screen has no bottom nav (full onboarding flow).
- Bottom nav appears after location selected: Home | Forecast | Settings.
- Hash routing: `#welcome` → `#home` → `#forecast` → `#settings`.
- "Change location" in Settings returns to welcome screen.

## Interactions
- City search with live filtering
- Popular city chips (tap to select)
- Segmented controls: hourly/daily tabs, C/F, km/mph
- Dark/light theme toggle (scoped to `.device`)
- Theme persists via localStorage (`weather-theme`)
- Settings persist via localStorage (`weather-app-settings`)

## Files
| File | What it is |
|------|------------|
| `app/prototypes/weather-app/page.tsx` | Shell + hash router |
| `app/prototypes/weather-app/layout.tsx` | Pass-through, imports tokens + CSS |
| `src/prototypes/weather-app/weather-app.css` | Sky-blue palette overrides + panel styles |
| `src/prototypes/weather-app/screens/welcome-screen.tsx` | Onboarding screen |
| `src/prototypes/weather-app/screens/home-screen.tsx` | Current weather dashboard |
| `src/prototypes/weather-app/screens/forecast-screen.tsx` | Hourly + daily forecast |
| `src/prototypes/weather-app/screens/settings-screen.tsx` | Units, theme, location |
| `src/prototypes/weather-app/components/weather-icon.tsx` | Weather condition SVG icon |
| `src/prototypes/weather-app/hooks/use-weather.ts` | Fetches current/hourly/daily data |
| `src/prototypes/weather-app/hooks/use-settings.tsx` | Persisted unit settings |
| `src/prototypes/weather-app/lib/types.ts` | TypeScript types |
| `src/prototypes/weather-app/lib/weather-data.ts` | Simulated weather data for 8 cities |

## Live URL
https://testplay-byte.github.io/TEST-PROTO/prototypes/weather-app/