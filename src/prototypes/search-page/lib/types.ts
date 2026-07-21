/**
 * search-page / lib / types — shared types for the search-page prototype.
 */

export interface AnimeTitle {
  romaji?: string | null;
  english?: string | null;
}

export interface AnimeCoverImage {
  large?: string | null;
  extraLarge?: string | null;
}

export interface Anime {
  id: number;
  title: AnimeTitle;
  coverImage: AnimeCoverImage;
  averageScore?: number | null;
  episodes?: number | null;
  format?: string | null;
  season?: string | null;
  seasonYear?: number | null;
  genres?: string[];
  status?: string | null;
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
