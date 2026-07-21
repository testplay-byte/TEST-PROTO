# prototypes/_template/navigation.md

> The starter template (v6). Copy this whole folder to begin a new prototype.
> See [`docs/prototype-blueprint.md`](../../docs/prototype-blueprint.md) for the full step-by-step.

---

## What this is

A fully interactive phone-frame prototype with 4 navigable screens, side info panels, scoped theming, click-drag scrolling, and mobile fullscreen. This is the starting point for every new prototype.

**Live:** https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/_template/

---

## Files

| File           | What it is                                                         |
|----------------|--------------------------------------------------------------------|
| `index.html`   | Phone frame (32px corners, 5px bezel, 13px punch-hole) + 4 screens (Home, Search, Profile, Settings) + bottom nav + left/right side panels. |
| `styles.css`   | Design tokens (page-level + app-level scoped to `.device`) + frame + status bar (Wi-Fi, signal, portrait battery) + components (posts, cards, toggles, tabs, chips, stories). |
| `script.js`    | View routing (`data-goto`), scoped theme toggle, live clock, portrait battery fill, like buttons, toggles, follow button, tabs, search filter, click-drag-to-scroll (desktop), Fullscreen API (mobile). |
| `navigation.md`| This file.                                                         |
| `README.md`    | Short description of the template.                                 |

---

## Key features (v6)

- **Device frame:** 32px corners, 5px bezel (near-black in light, adaptive gray in dark), 13px punch-hole camera.
- **Status bar:** time (left), punch-hole (center), Wi-Fi 2/3 arcs + signal 2/4 left-bright + portrait battery + battery% (right). No Bluetooth.
- **4 screens:** Home (scrollable feed with stories, posts, like buttons), Search (filterable input, chips, categories), Profile (avatar, stats, follow toggle, tabs, media grid), Settings (5 toggle switches in grouped rows).
- **Side panels:** Left = prototype info + clickable screen list (syncs with device). Right = screen info, component donut, interaction bars, stats. Hidden on <1024px.
- **Scoped theming:** `data-theme` on `.device` only — app dark mode doesn't affect the page. See [`docs/theme-architecture.md`](../../docs/theme-architecture.md).
- **No scrollbar:** `scrollbar-width: none` everywhere.
- **No text selection:** `user-select: none` on body (CSS-only, no JS blockers).
- **Click-drag-to-scroll:** desktop only (`pointer: fine`).
- **Mobile fullscreen:** real Fullscreen API (`requestFullscreen`), hides browser chrome + status bar.

---

## How to use

1. Copy this folder to `prototypes/<your-name>/`.
2. Replace the 4 sample views with your screens (add/remove `<section class="view">` blocks).
3. Update the bottom nav items (`data-goto`).
4. Update the left side panel (screen list, name, description, tags).
5. Update `SCREEN_INFO` in `script.js` (right panel syncs automatically).
6. Override `--color-primary` in `styles.css` if your app has a different brand color.
7. Add your unique components/interactions.
8. Fill in this folder's `navigation.md` and `README.md`.
9. Register the prototype in [`../navigation.md`](../navigation.md).
10. Follow [`docs/prototype-blueprint.md`](../../docs/prototype-blueprint.md) for the full process.

---

## What NOT to change

- The device frame dimensions, bezel, corner radius, punch-hole.
- The status bar SVGs (Wi-Fi, signal, battery) — they follow [`docs/template-rules.md`](../../docs/template-rules.md).
- The page-level tokens (`--stage-bg`, `--sb-*`) — these are fixed.
- The `body { user-select: none; }` rule.
- The scrollbar-hiding rules.
- The click-drag-scroll and Fullscreen API modules in `script.js`.

---

*Last updated: documentation pass (v7) — reflects template v6.*
