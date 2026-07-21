/**
 * search-page / lib / anilist — AniList GraphQL client.
 *
 * Single endpoint, simple in-memory cache, builds a parameterised query
 * from the active filters (matches the original script.js behaviour 1:1).
 */
import type { Anime, FilterState, SortOption } from "./types";

const API = "https://graphql.anilist.co";

interface GraphQLResponse {
  data?: { Page?: { media: Anime[] } };
  errors?: unknown;
}

const cache = new Map<string, GraphQLResponse>();

/** POST a GraphQL query, caching by query+vars. */
export async function gql<T = GraphQLResponse>(
  query: string,
  variables: Record<string, unknown>,
): Promise<T> {
  const key = query + JSON.stringify(variables || {});
  const cached = cache.get(key);
  if (cached) return cached as T;

  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });
  const data = (await res.json()) as T;
  cache.set(key, data as GraphQLResponse);
  return data;
}

interface FetchMediaArgs extends FilterState {
  search?: string;
  sort?: SortOption;
}

/** Build + send the AniList media search query. */
export function fetchMedia(args: FetchMediaArgs): Promise<GraphQLResponse> {
  const vars: Record<string, unknown> = { page: 1, perPage: 30 };
  const params: string[] = ["type:ANIME"];

  if (args.search) {
    params.push("search:$search");
    vars.search = args.search;
  }
  if (args.genres?.length) {
    params.push("genre_in:$genres");
    vars.genres = args.genres;
  }
  if (args.year) {
    params.push("seasonYear:$year");
    vars.year = parseInt(args.year, 10);
  }
  if (args.season) {
    params.push("season:$season");
    vars.season = args.season;
  }
  if (args.format) {
    params.push("format:$format");
    vars.format = args.format;
  }
  if (args.status) {
    params.push("status:$status");
    vars.status = args.status;
  }
  if (args.minScore && args.minScore > 0) {
    params.push("averageScore_greater:$minScore");
    vars.minScore = args.minScore;
  }
  if (args.sort) params.push("sort:" + args.sort);

  const varDecls: string[] = ["$page:Int", "$perPage:Int"];
  if (vars.search !== undefined) varDecls.push("$search:String");
  if (vars.genres !== undefined) varDecls.push("$genres:[String]");
  if (vars.year !== undefined) varDecls.push("$year:Int");
  if (vars.season !== undefined) varDecls.push("$season:MediaSeason");
  if (vars.format !== undefined) varDecls.push("$format:MediaFormat");
  if (vars.status !== undefined) varDecls.push("$status:MediaStatus");
  if (vars.minScore !== undefined) varDecls.push("$minScore:Int");

  const q =
    `query(${varDecls.join(",")}){` +
    `Page(page:$page,perPage:$perPage){` +
    `media(${params.join(",")}){` +
    `id title{romaji english} coverImage{large extraLarge} ` +
    `averageScore episodes format season seasonYear genres status` +
    `}}}`;

  return gql<GraphQLResponse>(q, vars);
}

/** Format an AniList 0–100 average score as a 0.0–10.0 string. */
export function fmtScore(s?: number | null): string {
  return s ? (s / 10).toFixed(1) : "—";
}
