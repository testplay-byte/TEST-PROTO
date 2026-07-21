# docs/design-systems/material-3-expressive/color-system.md

> The Material 3 color system used by the `search-page` prototype. Every hex value here is copied from `prototypes/search-page/styles.css` — these are the canonical tokens, not approximations.

---

## 1. The core M3 principle: elevation = tonal surface color, NOT shadows

This is the single most important rule in the entire M3 system on this repo:

> **An elevated surface is shown by changing its color tone, not by dropping a shadow under it.**

In Material 3, "elevation" is **visual elevation** — a perception of depth created by tonal contrast against the background. A card sits "higher" than the page background because it has a *lighter* tone (in dark theme) or a *darker* tone (in light theme). The browser is not asked to render a drop shadow; the surface color itself does the work.

Consequences for this codebase:

- **Cards, sheets, bottom nav, search bar, chips — none of them get a `box-shadow` for elevation.** They get a surface tier (`--color-surface-1` … `--color-surface-5`).
- The **only** element in the entire prototype that uses `box-shadow` is the `.device` frame itself, because it is hardware (a physical phone mockup on a stage), not a UI surface. See [`elevation.md`](./elevation.md) §4.
- The bottom nav is the *one* UI exception: it carries a soft shadow because it physically floats over scrolling content and we need to read it against arbitrary image colors. See `components.md` §6 for the exact shadow stack.

### Why M3 does it this way

1. **Shadows are expensive and noisy.** Every shadow is a blur pass on the GPU and a visual smudge under the element. Stacking five shadows on a screen turns into mud.
2. **Shadows imply a single light source.** On mobile, with translucent sheets and dynamic backgrounds, a single light source is a lie. Tonal elevation is "light source agnostic."
3. **Tonal elevation works in both themes automatically.** In dark theme, higher elevation = lighter tone. In light theme, higher elevation = *darker* tone. Same token name, opposite direction — that's why M3 ships paired light/dark palettes.
4. **It scales.** Five surface tiers cover 95% of the elevation needs in the app; you never have to invent `--shadow-elevation-6`.

### Direction in each theme

| Theme       | Background tone | Higher elevation →              |
|-------------|-----------------|----------------------------------|
| Dark (default) | Darkest        | **Lighter** tone (closer to white) |
| Light       | Lightest        | **Darker** tone (closer to black)  |

So in dark theme `--color-surface-1` is just barely lighter than `--color-bg`, and `--color-surface-5` is noticeably lighter. In light theme, `--color-surface-1` is just barely darker than `--color-bg` and `--color-surface-5` is noticeably darker.

---

## 2. Surface tiers (tonal elevation ladder)

There are **5 surface tiers** plus the base background. They are the entire elevation system. Memorize the order.

| Token                     | Dark hex    | Light hex  | Dark role (where it's used)                                                  |
|---------------------------|-------------|------------|-------------------------------------------------------------------------------|
| `--color-bg`              | `#14111f`   | `#fef7ff`  | Page background (screen). Darkest tier.                                       |
| `--color-surface-1`       | `#1b1729`   | `#f3edf7`  | Lowest elevated surface: search bar, section trays, recent-item hover.       |
| `--color-surface-2`       | `#221e33`   | `#ede7f4`  | Cards (anime cards, recent-icon), filter sheet background, settings cards.   |
| `--color-surface-3`       | `#2a2540`   | `#e7e0eb`  | Chips, accordion buttons, sort-dropdown items hover, flat filter tabs, bottom nav. |
| `--color-surface-4`       | `#332d4c`   | `#ddd6e4`  | Sort dropdown menu container, accordion button icon background.              |
| `--color-surface-5`       | `#3d3656`   | `#d0c9dd`  | Highest elevated surface: score-slider track, sort-dropdown item hover.       |

The progression in dark theme is monotonic — each step is ~6–10 units lighter in L* in HSL space. There are no jumps or reversals.

### How to choose a tier

- **Background (`--color-bg`)** — the screen canvas. Only the screen and the topbar use this directly.
- **Tier 1 (`--color-surface-1`)** — anything that "sits on" the background and is touched occasionally: search bar, trays, hover states.
- **Tier 2 (`--color-surface-2`)** — content containers: cards, sheets, settings cards. The default for "a card."
- **Tier 3 (`--color-surface-3`)** — interactive controls that need to feel "above" the cards: chips, accordion buttons, the bottom nav (which floats over content).
- **Tier 4 (`--color-surface-4`)** — popovers and sub-controls inside sheets: dropdown menus, accordion icon badges.
- **Tier 5 (`--color-surface-5`)** — the topmost tier, used sparingly: slider tracks, hovered dropdown items.

If you're not sure, default to `--color-surface-2` for a card and `--color-surface-3` for an interactive control.

---

## 3. Text colors

Three text tones, used in a strict hierarchy. Never invent a fourth.

| Token                    | Dark hex    | Light hex  | Use                                                       |
|--------------------------|-------------|------------|------------------------------------------------------------|
| `--color-text`           | `#ece6f5`   | `#1d1b20`  | Primary text. Titles, card titles, input text.             |
| `--color-text-muted`     | `#a89ec0`   | `#49454f`  | Secondary text. Subtitles, meta, descriptions, placeholders. |
| `--color-text-subtle`    | `#6e6688`   | `#766c8e`  | Tertiary text. Meta in cards (episode count, year), remove icons. |

Hierarchy: `text` > `text-muted` > `text-subtle`. Don't skip levels (e.g. jumping from primary to subtle in adjacent text) — the eye loses the gradient.

---

## 4. Color roles

M3 uses **named roles**, not raw hex, in CSS. Always reference the role token; never hardcode `#d0bcff` in a rule.

| Role                         | Dark hex    | Light hex  | Use                                                                  |
|------------------------------|-------------|------------|----------------------------------------------------------------------|
| `--color-primary`            | `#d0bcff`   | `#6750a4`  | The brand accent. Filled buttons, active chips, links, slider thumb. |
| `--color-primary-fg`         | `#381e72`   | `#ffffff`  | Text/icon color **on top of** `--color-primary`.                     |
| `--color-primary-container`  | `#4f378b`   | `#eaddff`  | Tonal container for the primary. Active bottom-nav item, active filter chips, active source toggle. |
| `--color-on-primary-container` | `#eaddff` | `#21005d`  | Text/icon color **on top of** `--color-primary-container`.           |
| `--color-secondary`          | `#ccc2dc`   | `#625b71`  | Less prominent accent. (Reserved — not heavily used in search-page.) |
| `--color-secondary-container` | `#4a4458`  | `#e8def8`  | Tonal container for secondary.                                       |
| `--color-tertiary`           | `#efb8c8`   | `#7d5260`  | Pinkish accent. Used in sidepanel mini-bars and tertiary highlights. |
| `--color-tertiary-container` | `#633b48`   | `#ffd8e4`  | Tonal container for tertiary.                                        |
| `--color-error`              | `#f2b8b5`   | `#b3261e`  | Error states (red).                                                  |
| `--color-error-container`    | `#8c1d18`   | `#f9dedc`  | Tonal container for error.                                           |
| `--color-success`            | `#a5d6a7`    | —          | Green for success indicators (sidepanel bars).                       |
| `--color-warn`               | `#ffcc80`    | —          | Amber for warnings and score badges.                                 |
| `--color-outline`            | `#938f99`   | `#79747e`  | Strong outline (rarely used directly).                               |
| `--color-outline-variant`    | `#49454f`   | `#cac4d0`  | Default hairline border on cards, outlined buttons, source toggle, theme toggle, accordion buttons. |

### Role naming convention

- A role **without** `-container` is the *vivid* version — used for fills where you want contrast (filled button bg, slider thumb).
- A role **with** `-container` is the *tonal* version — used for less aggressive active states (active chips, active nav item). Containers are always less saturated than the bare role.
- A role prefixed `--color-on-*` is the *foreground* that goes on top of the matching background. `on-primary-container` is the foreground for `primary-container`. Never mix these up — putting `--color-text` on `--color-primary-container` will fail contrast in light theme.

### `color-mix` for tints

When a role needs a subtle tint (e.g. the recent-toggle background uses 8% primary), use CSS `color-mix`:

```css
.recent-toggle {
  background: color-mix(in srgb, var(--color-primary) 8%, transparent);
}
.recent-toggle:hover {
  background: color-mix(in srgb, var(--color-primary) 14%, transparent);
}
```

`color-mix(in srgb, <role> <pct>, transparent)` is the canonical pattern for 6–14% tints of any role. Don't hardcode rgba.

---

## 5. Dark theme (default) — full token block

This is the canonical dark-purple M3 theme. Scopes to `.device` (not `<html>`) so the page background never changes when the user toggles the app theme. See [`docs/theme-architecture.md`](../../theme-architecture.md) for why.

```css
.device {
  /* Base surfaces — tonal tiers for elevation */
  --color-bg: #14111f;             /* lowest — background */
  --color-surface-1: #1b1729;      /* search bar, bottom nav base, trays */
  --color-surface-2: #221e33;      /* surface container (cards) */
  --color-surface-3: #2a2540;      /* surface container high (chips) */
  --color-surface-4: #332d4c;      /* surface container highest (sheet, dropdown) */
  --color-surface-5: #3d3656;      /* elevated surface */

  /* Text */
  --color-text: #ece6f5;
  --color-text-muted: #a89ec0;
  --color-text-subtle: #6e6688;

  /* M3 color roles */
  --color-primary: #d0bcff;
  --color-primary-fg: #381e72;
  --color-on-primary-container: #eaddff;
  --color-primary-container: #4f378b;
  --color-secondary: #ccc2dc;
  --color-secondary-container: #4a4458;
  --color-tertiary: #efb8c8;
  --color-tertiary-container: #633b48;
  --color-error: #f2b8b5;
  --color-error-container: #8c1d18;
  --color-success: #a5d6a7;
  --color-warn: #ffcc80;
  --color-outline: #938f99;
  --color-outline-variant: #49454f;

  /* Device hardware (frame, not app surfaces) */
  --device-bezel: #0e0a17;
  --device-edge: #1b1729;
}
```

### Why purple?

The user's preferred M3 source color is a purple (M3's own default Material You purple, seed ≈ `#6750a4`). The dark theme is the M3 dark-tonal palette generated from that seed; the light theme is the M3 light-tonal palette from the same seed. The two themes share a single seed color so the brand reads consistently across both.

---

## 6. Light theme — full token block

Applied by setting `data-theme="light"` on the `.device` element. Persisted to `localStorage` (`search-theme` key).

```css
.device[data-theme="light"] {
  --color-bg: #fef7ff;
  --color-surface-1: #f3edf7;
  --color-surface-2: #ede7f4;
  --color-surface-3: #e7e0eb;
  --color-surface-4: #ddd6e4;
  --color-surface-5: #d0c9dd;
  --color-text: #1d1b20;
  --color-text-muted: #49454f;
  --color-text-subtle: #766c8e;
  --color-primary: #6750a4;
  --color-primary-fg: #ffffff;
  --color-on-primary-container: #21005d;
  --color-primary-container: #eaddff;
  --color-secondary: #625b71;
  --color-secondary-container: #e8def8;
  --color-tertiary: #7d5260;
  --color-tertiary-container: #ffd8e4;
  --color-outline: #79747e;
  --color-outline-variant: #cac4d0;

  /* Device hardware stays the same — the phone is the phone */
  --device-bezel: #0e0a17;
  --device-edge: #1b1729;
}
```

Notice the inversion: in dark theme `--color-primary` (`#d0bcff`) is *lighter* than `--color-primary-container` (`#4f378b`); in light theme `--color-primary` (`#6750a4`) is *darker* than `--color-primary-container` (`#eaddff`). This is the M3 dark/light pairing — same role, opposite tonal direction.

### Tokens intentionally NOT redefined in light theme

- `--color-error-container`, `--color-success`, `--color-warn` — these are accent colors used inside cards/badges and read fine on both themes. Don't override unless a specific contrast issue shows up.
- `--device-bezel`, `--device-edge` — the phone hardware doesn't theme.

---

## 7. Page-level stage tokens (outside the device)

These are the colors of the *desktop stage* around the device mockup (the page background and the left/right info panels). They are NOT app colors — they belong to the design preview environment and are defined on `:root`, not `.device`.

```css
:root {
  --stage-bg: #0e0a17;       /* page background, deeper than the device bg */
  --sb-bg: #181421;          /* sidepanel background */
  --sb-muted: #221d31;       /* sidepanel muted areas (tags, mini-bar tracks) */
  --sb-border: #2c2640;      /* sidepanel border */
  --sb-text: #e6dff0;        /* sidepanel text */
  --sb-text-muted: #948aa8;  /* sidepanel secondary text */
}
```

These tokens are intentionally a different palette from the app — they shouldn't leak into the `.device`. If you find yourself reaching for `--sb-*` inside a component, you're in the wrong scope.

---

## 8. Hex values, quick reference (dark theme)

For paste-into-Figma convenience:

```
bg                  #14111f
surface-1           #1b1729
surface-2           #221e33
surface-3           #2a2540
surface-4           #332d4c
surface-5           #3d3656
text                #ece6f5
text-muted          #a89ec0
text-subtle         #6e6688
primary             #d0bcff
primary-fg          #381e72
primary-container   #4f378b
on-primary-container #eaddff
secondary           #ccc2dc
secondary-container #4a4458
tertiary            #efb8c8
tertiary-container  #633b48
error               #f2b8b5
error-container     #8c1d18
success             #a5d6a7
warn                #ffcc80
outline             #938f99
outline-variant     #49454f
```

## 9. Hex values, quick reference (light theme)

```
bg                  #fef7ff
surface-1           #f3edf7
surface-2           #ede7f4
surface-3           #e7e0eb
surface-4           #ddd6e4
surface-5           #d0c9dd
text                #1d1b20
text-muted          #49454f
text-subtle         #766c8e
primary             #6750a4
primary-fg          #ffffff
primary-container   #eaddff
on-primary-container #21005d
secondary           #625b71
secondary-container #e8def8
tertiary            #7d5260
tertiary-container  #ffd8e4
outline             #79747e
outline-variant     #cac4d0
```

---

## 10. CSS rules for using these tokens

1. **Always reference the role token**, never the raw hex. `color: var(--color-text-muted)` — never `color: #a89ec0`. Hex belongs only in the `:root`/`.device`/`.device[data-theme]` blocks.
2. **Don't invent new surface tiers.** If you need a sixth tier, you're doing it wrong — re-think the elevation logic.
3. **Don't tint surfaces manually with rgba.** Use `color-mix(in srgb, var(--color-primary) 8%, transparent)` if you need a tinted hover.
4. **Foreground on container = `on-*-container`.** Never put `--color-text` on `--color-primary-container`; it'll fail contrast in light theme.
5. **Theme scoping.** Color tokens live on `.device`, not on `:root` or `html`. The page (stage) has its own palette. See [`docs/theme-architecture.md`](../../theme-architecture.md).
6. **The bezel doesn't theme.** `--device-bezel` and `--device-edge` are the same hex in both themes. The phone is a phone.

---

*Last updated: design system documentation pass.*
