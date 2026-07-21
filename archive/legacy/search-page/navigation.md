# prototypes/search-page/navigation.md

> A Material 3 Expressive search screen — single-screen prototype with AniList integration.

---

## What this is

A beautiful, focused search screen built with Material 3 Expressive design (dark purple theme). Features an AniList/Extension source toggle, filter chips, an expandable filter panel, and a Material 3 bottom navigation bar with the active-pill indicator pattern.

**Live:** https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/search-page/

---

## Design language

- **Material 3 Expressive** — dark purple theme
- **Primary:** `#d0bcff` (M3 light purple, used on dark surfaces)
- **Primary container:** `#4f378b` (active pill backgrounds)
- **Surface:** `#1d1a2e` (cards, bottom nav)
- **Background:** `#14101f` (deep purple-tinted dark)
- **Shapes:** pill-shaped (search bar, chips, source toggle), 12px rounded cards
- **Motion:** Material 3 emphasized easing (`cubic-bezier(.3,0,0,1)`)

---

## Features

### Top: Source toggle
- Two segmented buttons: **AniList** and **Extension**
- AniList fetches real data from the AniList GraphQL API
- Extension is visual-only (shows the same results, for UI testing)
- M3 segmented button styling with pill container

### Search bar
- Pill-shaped with search icon + clear button
- Debounced (450ms) — types smoothly without spamming the API
- Shows "Popular anime" by default when empty (no query needed)

### Filter chips (quick filters)
- Horizontal scrollable row of genre chips: Action, Romance, Comedy, Fantasy, Sci-Fi, Drama
- Multi-select — tap to toggle, active chips show a checkmark
- "Filters" chip expands the full filter panel

### Expandable filter panel
- Year dropdown (1990 → current year)
- Season dropdown (Winter/Spring/Summer/Fall)
- Format dropdown (TV/Movie/OVA/ONA/Special)
- Sort dropdown (Popularity/Score/Newest/Title A-Z)
- Reset button to clear all filters

### Results grid
- 3-column grid of anime cards
- Each card: cover image (2:3 aspect), score badge (★ rating), title (2-line clamp), format + episodes
- Skeleton loading state while fetching
- Empty state for no results

### Bottom navigation (Material 3)
- 5 items: Home, Library, History, **Search** (4th), Settings
- **Active item** shows a pill-shaped indicator (M3 active-pill pattern) + its label
- **Non-active items** show only the icon (no label) — per user spec
- **Search item** always shows its label + icon (per user spec: "the search one will show the search text along with the icon but the other ones will not show the text")
- Search is the active item by default with a filled primary-color pill

---

## Files

| File | What it is |
|------|------------|
| `index.html` | Single search screen + bottom nav + side panels |
| `styles.css` | Material 3 dark purple theme + all components |
| `script.js` | AniList API, source toggle, filters, debounced search, drag-scroll, fullscreen |
| `navigation.md` | This file |
| `README.md` | Short description |

---

## Data

- **AniList GraphQL API** (`https://graphql.anilist.co`) — real covers, titles, scores, genres
- **Extension source** — visual-only toggle (same AniList data, for UI testing)
- Default results (no query) show popular anime sorted by popularity

---

*Created: search-page v1.0. Material 3 Expressive design.*
