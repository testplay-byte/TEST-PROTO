/**
 * anime-app / lib / types — shared types for the anime-app prototype.
 *
 * Extends the search-page type set with Library + History + Settings rows
 * and the few extra Anime fields the detail screen needs (bannerImage,
 * description, nextAiringEpisode).
 */

export interface AnimeTitle {
  romaji?: string | null;
  english?: string | null;
}

export interface AnimeCoverImage {
  large?: string | null;
  extraLarge?: string | null;
}

export interface NextAiringEpisode {
  airingAt?: number | null;
  episode?: number | null;
}

export interface Anime {
  id: number;
  title: AnimeTitle;
  coverImage: AnimeCoverImage;
  bannerImage?: string | null;
  averageScore?: number | null;
  episodes?: number | null;
  format?: string | null;
  season?: string | null;
  seasonYear?: number | null;
  genres?: string[];
  status?: string | null;
  description?: string | null;
  nextAiringEpisode?: NextAiringEpisode | null;
  siteUrl?: string | null;
}

/** Filter values selectable in the bottom sheet (excludes query + sort). */
export interface FilterState {
  genres: string[];
  year: string; // "" or "2024" etc.
  season: string; // "" or "WINTER" etc.
  format: string; // "" or "TV" etc.
  status: string; // "" or "RELEASING" etc.
  minScore: number; // 0..100
}

export type SortOption =
  | "POPULARITY_DESC"
  | "SCORE_DESC"
  | "START_DATE_DESC"
  | "TITLE_ROMAJI"
  | "FAVOURITES_DESC"
  | "TRENDING_DESC";

export type Source = "anilist" | "extension";

export type FilterViewMode = "accordion" | "flat";

export type FlatCategoryId = "genre" | "release" | "type" | "score" | "sort";

/** Default filter state — no genres/year/etc. selected. */
export const EMPTY_FILTERS: FilterState = {
  genres: [],
  year: "",
  season: "",
  format: "",
  status: "",
  minScore: 0,
};

// ---------------------------------------------------------------------------
// Library + History + Settings
// ---------------------------------------------------------------------------

export type LibraryStatus = "watching" | "completed" | "plan";

/** A saved anime row in `localStorage["anime-library"]`. */
export interface LibraryItem {
  id: number;
  title: string;
  cover: string;
  score: number | null;
  format: string | null;
  episodes: number | null;
  status: LibraryStatus;
  addedAt: number;
}

/** A "recently viewed" entry in `localStorage["anime-history"]`.
 *  Also powers the Continue Watching section — episode + progress are
 *  simulated (we don't have real playback) but stored persistently. */
export interface HistoryItem {
  id: number;
  title: string;
  cover: string;
  viewedAt: number;
  /** Last episode the user was "watching" (simulated). */
  episode: number;
  /** Total episodes (if known from AniList). */
  totalEpisodes: number | null;
  /** Progress within the current episode, 0–100 (simulated). */
  progress: number;
  /** Banner image for the continue-watching card (from AniList). */
  banner: string;
}

export type PosterStyle = "rounded" | "soft" | "sharp";
export type CardDensity = "compact" | "default" | "comfortable";
export type AnimSpeed = "fast" | "normal" | "slow";

// ---------------------------------------------------------------------------
// Library customization
// ---------------------------------------------------------------------------

export type LibraryLayout = "grid" | "list";
export type LibraryTextPlacement = "below" | "overlay";
/** Where to show the episode badge on grid covers. */
export type LibraryEpisodePosition = "top-left" | "top-right" | "bottom-left" | "bottom-right" | "hidden";

export interface Settings {
  singleLineTitles: boolean;
  posterStyle: PosterStyle;
  cardDensity: CardDensity;
  animSpeed: AnimSpeed;
  /** Library-specific display options. */
  libraryLayout: LibraryLayout;
  /** Columns in grid mode (2–5). */
  libraryColumns: number;
  libraryTextPlacement: LibraryTextPlacement;
  /** Show/hide the format type (TV/Movie/OVA) on library cards. */
  libraryShowFormat: boolean;
  /** Show/hide the episode count on library cards. */
  libraryShowEpisodes: boolean;
  /** Where to show the episode badge on grid covers. */
  libraryEpisodePosition: LibraryEpisodePosition;
}

export const DEFAULT_SETTINGS: Settings = {
  singleLineTitles: true,
  posterStyle: "rounded",
  cardDensity: "default",
  animSpeed: "normal",
  libraryLayout: "grid",
  libraryColumns: 3,
  libraryTextPlacement: "below",
  libraryShowFormat: true,
  libraryShowEpisodes: true,
  libraryEpisodePosition: "bottom-right",
};
