# Anime App (v2.0)

A Material 3 Expressive anime app with 6 working screens. Real AniList data. Add to library functionality.

## What's inside

- **6 screens:** Home, Library, History, Search, Settings, Detail (pushed)
- **Home:** Hero carousel (trending), Popular This Season, Top Rated — all from AniList
- **Library:** localStorage-backed, status tabs (All/Watching/Completed/Plan to Watch), add/remove
- **History:** Recently viewed anime, auto-tracked, max 20
- **Search:** Full AniList search with filters, sort, recent searches, source toggle
- **Settings:** Dark/light theme toggle (persisted)
- **Detail:** Banner, cover, title, score, genres, synopsis (expandable), episode list, Add to Library
- Click any anime card → opens detail page
- Same M3 design language as the search-page prototype

## Device frame (per-theme inversion)

The phone frame inverts with the app theme for premium contrast:

| App theme | Frame color | Border width | Notes |
|-----------|-------------|--------------|-------|
| **Dark**  | Soft platinum `#cfcfcf` + `#a8a8a8` rim | `3.5px / 4px` | Light but not stark white; thinner (bright border reads heavier) |
| **Light** | Dark `#0e0a17` + `#1b1729` rim | `4px / 4.4px` | Dark border, kept as-is |

The frame and background transition smoothly when toggling themes.

## Bottom navigation

- Floating pill, `58px` tall, `28px` radius, tonal `surface-3` background.
- **Active item:** content-sized expanding pill (`flex: 0 1 auto`) — full label always visible, never truncated. Slim `42px` height.
- **Inactive items:** icon-only, share remaining space evenly.

## Live preview

https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/anime-app/
