# Search Page (v1.0)

A Material 3 Expressive search screen — single-screen prototype with real AniList data.

## What's inside

- **Material 3 dark purple theme** (`#d0bcff` primary on `#14101f` background)
- **Source toggle:** AniList (real API) / Extension (visual-only)
- **Search bar:** pill-shaped, debounced, with clear button
- **Filter chips:** quick genre filters (Action, Romance, Comedy, Fantasy, Sci-Fi, Drama)
- **Expandable filter panel:** year, season, format, sort
- **Results grid:** 3-column anime cards with cover, score badge, title
- **Material 3 bottom nav:** 5 items, active item shows pill indicator + label, search item always shows label
- Default results show popular anime (no query needed)

## Files

- `index.html` — search screen + bottom nav + side panels
- `styles.css` — Material 3 theme + components
- `script.js` — AniList API, source toggle, filters, search
- `navigation.md` — detailed folder index

## Live preview

https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/search-page/

## Data source

[AniList GraphQL API](https://graphql.anilist.co) — public, CORS-enabled, no auth required.
