/**
 * setup-wizard / lib / themes — color palette definitions.
 *
 * The default primary color is #2596be (teal/cyan).
 * Users can switch between several pre-made palettes during the wizard.
 * Each palette defines: primary, primaryContainer, onPrimary, onPrimaryContainer,
 * and a background tint for both dark and light themes.
 */

export interface ThemePalette {
  id: string;
  name: string;
  /** Primary color hex (used for buttons, accents, active states) */
  primary: string;
  /** Primary container (lighter/darker variant for containers) */
  primaryContainerDark: string;
  primaryContainerLight: string;
  /** On-primary text color (dark theme) */
  onPrimary: string;
  /** On-primary-container text color (dark theme) */
  onPrimaryContainer: string;
  /** Background tint (dark theme) — a very dark version of the primary */
  bgDark: string;
  /** Background tint (light theme) — a very light version of the primary */
  bgLight: string;
  /** Surface tiers (dark theme) — progressively lighter tints */
  surface1Dark: string;
  surface2Dark: string;
  surface3Dark: string;
  surface4Dark: string;
  surface5Dark: string;
}

export const DEFAULT_PALETTE: ThemePalette = {
  id: "lime",
  name: "Lime",
  primary: "#b3f35a",
  primaryContainerDark: "#2a4a10",
  primaryContainerLight: "#dff5b0",
  onPrimary: "#0a1a00",
  onPrimaryContainer: "#e8ffd4",
  bgDark: "#0a120a",
  bgLight: "#f5fdf0",
  surface1Dark: "#0f1a0f",
  surface2Dark: "#142214",
  surface3Dark: "#1a2a1a",
  surface4Dark: "#1f321f",
  surface5Dark: "#253a25",
};

export const PALETTES: ThemePalette[] = [
  DEFAULT_PALETTE,
  {
    id: "teal",
    name: "Teal",
    primary: "#2596be",
    primaryContainerDark: "#0a4a63",
    primaryContainerLight: "#b8e8f5",
    onPrimary: "#ffffff",
    onPrimaryContainer: "#e0f7ff",
    bgDark: "#0a1a1f",
    bgLight: "#f0fafd",
    surface1Dark: "#0f2329",
    surface2Dark: "#142d35",
    surface3Dark: "#1a3740",
    surface4Dark: "#1f414b",
    surface5Dark: "#254b56",
  },
  {
    id: "purple",
    name: "Purple",
    primary: "#6750a4",
    primaryContainerDark: "#4f378b",
    primaryContainerLight: "#eaddff",
    onPrimary: "#ffffff",
    onPrimaryContainer: "#eaddff",
    bgDark: "#14111f",
    bgLight: "#fef7ff",
    surface1Dark: "#1b1729",
    surface2Dark: "#221e33",
    surface3Dark: "#2a2540",
    surface4Dark: "#332d4c",
    surface5Dark: "#3d3656",
  },
  {
    id: "coral",
    name: "Coral",
    primary: "#e85d5d",
    primaryContainerDark: "#5c2a2a",
    primaryContainerLight: "#ffdadc",
    onPrimary: "#ffffff",
    onPrimaryContainer: "#ffe0e0",
    bgDark: "#1f0e0e",
    bgLight: "#fff5f5",
    surface1Dark: "#291515",
    surface2Dark: "#331c1c",
    surface3Dark: "#3d2424",
    surface4Dark: "#472c2c",
    surface5Dark: "#523434",
  },
  {
    id: "green",
    name: "Forest",
    primary: "#2e7d32",
    primaryContainerDark: "#1b4a1f",
    primaryContainerLight: "#c8e6c9",
    onPrimary: "#ffffff",
    onPrimaryContainer: "#d4f5d6",
    bgDark: "#0a1a0a",
    bgLight: "#f0faf0",
    surface1Dark: "#0f2310",
    surface2Dark: "#142d16",
    surface3Dark: "#1a371c",
    surface4Dark: "#1f4122",
    surface5Dark: "#254b28",
  },
  {
    id: "amber",
    name: "Amber",
    primary: "#e6912c",
    primaryContainerDark: "#5c3c10",
    primaryContainerLight: "#ffe0b2",
    onPrimary: "#ffffff",
    onPrimaryContainer: "#fff0d4",
    bgDark: "#1f1505",
    bgLight: "#fffaf0",
    surface1Dark: "#291f0a",
    surface2Dark: "#332910",
    surface3Dark: "#3d3316",
    surface4Dark: "#473d1c",
    surface5Dark: "#524722",
  },
];

export type ThemeMode = "dark" | "light" | "system";
