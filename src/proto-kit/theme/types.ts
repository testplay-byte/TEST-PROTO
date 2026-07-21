/**
 * proto-kit / theme — types and the device-scoped theme provider.
 *
 * The app theme (dark/light) is scoped to the <DeviceFrame> element, NOT to
 * <html>. This is critical: the page (stage, side panels) never changes when
 * the app theme toggles — only the device screen does.
 *
 * Theme is persisted to localStorage under a key the prototype chooses
 * (e.g. "anime-app-theme"). The provider reads it on mount and applies it
 * to the device element via a data-theme attribute.
 */

export type AppTheme = "dark" | "light";

export interface ThemeProviderProps {
  /** Initial theme for SSR (avoids hydration mismatch). Default "dark". */
  initialTheme?: AppTheme;
  /** localStorage key for persistence. */
  storageKey?: string;
  /** Called when the theme changes. */
  onThemeChange?: (theme: AppTheme) => void;
  children: React.ReactNode;
}
