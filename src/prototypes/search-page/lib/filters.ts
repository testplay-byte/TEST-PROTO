/**
 * search-page / lib / filters — filter category definitions + helpers.
 *
 * All AniList enum values + display labels live here so the components
 * and the GraphQL client can share them.
 */
import type { SortOption, Source, FilterState } from "./types";

/** 16 genre chips shown in the Genres section of the filter sheet. */
export const GENRES = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Mecha",
  "Music",
  "Mystery",
  "Psychological",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  "Supernatural",
  "Thriller",
];

/**
 * Sort labels. Includes `TRENDING_DESC` so the source-default sort for the
 * "extension" source displays correctly (the original left this label
 * undefined and rendered the literal text "undefined").
 */
export const SORT_LABELS: Record<SortOption, string> = {
  POPULARITY_DESC: "Popularity",
  SCORE_DESC: "Score",
  START_DATE_DESC: "Newest",
  TITLE_ROMAJI: "Title A-Z",
  FAVOURITES_DESC: "Favorites",
  TRENDING_DESC: "Trending",
};

/** Sort options shown in the dropdown (the 5 user-facing options). */
export const SORT_OPTIONS: SortOption[] = [
  "POPULARITY_DESC",
  "SCORE_DESC",
  "START_DATE_DESC",
  "TITLE_ROMAJI",
  "FAVOURITES_DESC",
];

/** Source-aware defaults — each source picks its own sort + label. */
export const SOURCE_DEFAULTS: Record<
  Source,
  { sort: SortOption; label: string }
> = {
  anilist: { sort: "POPULARITY_DESC", label: "Popular anime" },
  extension: { sort: "TRENDING_DESC", label: "Trending now" },
};

export const SEASONS: { value: string; label: string }[] = [
  { value: "WINTER", label: "Winter" },
  { value: "SPRING", label: "Spring" },
  { value: "SUMMER", label: "Summer" },
  { value: "FALL", label: "Fall" },
];

export const FORMATS: { value: string; label: string }[] = [
  { value: "TV", label: "TV Series" },
  { value: "MOVIE", label: "Movie" },
  { value: "OVA", label: "OVA" },
  { value: "ONA", label: "ONA" },
  { value: "SPECIAL", label: "Special" },
  { value: "MUSIC", label: "Music" },
];

export const STATUSES: { value: string; label: string }[] = [
  { value: "RELEASING", label: "Currently Airing" },
  { value: "FINISHED", label: "Finished" },
  { value: "NOT_YET_RELEASED", label: "Upcoming" },
  { value: "CANCELLED", label: "Cancelled" },
];

/** Flat-view category tabs (id + label). */
export const FLAT_CATEGORIES: { id: string; label: string }[] = [
  { id: "genre", label: "Genres" },
  { id: "release", label: "Release" },
  { id: "type", label: "Type" },
  { id: "score", label: "Min Score" },
  { id: "sort", label: "Sort" },
];

/** Build a descending list of years from the current year down to 1990. */
export function getYearOptions(): number[] {
  const now = new Date().getFullYear();
  const out: number[] = [];
  for (let y = now; y >= 1990; y--) out.push(y);
  return out;
}

const FORMAT_LABELS: Record<string, string> = Object.fromEntries(
  FORMATS.map((f) => [f.value, f.label]),
);

const STATUS_LABELS: Record<string, string> = Object.fromEntries(
  STATUSES.map((s) => [
    s.value,
    s.label === "Currently Airing" ? "Airing" : s.label,
  ]),
);

export function formatLabel(f: string): string {
  return FORMAT_LABELS[f] || f;
}

export function statusLabel(s: string): string {
  return STATUS_LABELS[s] || s;
}

export function seasonLabel(s: string): string {
  if (!s) return "";
  return s.charAt(0) + s.slice(1).toLowerCase();
}

/** Number of active filter selections — drives the badge count. */
export function countActiveFilters(state: FilterState): number {
  let n = 0;
  if (state.genres.length) n += state.genres.length;
  if (state.year) n++;
  if (state.season) n++;
  if (state.format) n++;
  if (state.status) n++;
  if (state.minScore > 0) n++;
  return n;
}
