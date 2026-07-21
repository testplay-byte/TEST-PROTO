# _template (v6)

The starter scaffold for every new prototype. A fully interactive phone-frame UI with 4 navigable screens, side info panels, scoped theming, click-drag scrolling, and mobile fullscreen.

## What's inside

- A **phone frame** (32px corners, 5px bezel, 13px punch-hole camera) with a warm-cream palette matching the homepage.
- A **status bar** with: live clock (left), punch-hole camera (center), and system icons (right) — Wi-Fi (2/3 arcs), signal (2/4 bars, left-bright), portrait battery with percentage.
- **4 fully navigable screens**:
  - **Home** — scrollable feed with story avatars, post cards, like buttons.
  - **Search** — filterable search input, trending chips, category list.
  - **Profile** — avatar, stats, follow button toggle, tabs, media grid.
  - **Settings** — 5 toggle switches in grouped setting rows.
- **Side info panels** (desktop): left panel has a clickable screen list that syncs with the device; right panel shows screen info, a component donut chart, interaction bars, and stats.
- **Scoped theming:** dark mode toggle changes only the device, never the page. `data-theme` is on `.device`, not `<html>`.
- **Click-drag-to-scroll** on desktop (grab cursor hint).
- **Mobile fullscreen** via the real browser Fullscreen API — hides address bar + status bar.
- **No visible scrollbar** anywhere. **No text selection** (entire page non-selectable).

## Files

- `index.html` — markup (phone frame + 4 screens + side panels)
- `styles.css` — design tokens + frame + components (v6)
- `script.js` — routing, theme, clock, battery, scroll, fullscreen
- `navigation.md` — folder index (detailed)
- `README.md` — this file

## How to start a new prototype

```bash
cp -r prototypes/_template prototypes/my-new-prototype
```

Then edit the three files and fill in `navigation.md` + `README.md`.

See [`docs/prototype-blueprint.md`](../../docs/prototype-blueprint.md) for the full step-by-step guide.

## Live preview

https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/_template/
