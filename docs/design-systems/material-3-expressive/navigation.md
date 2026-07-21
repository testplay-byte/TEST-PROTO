# docs/design-systems/material-3-expressive/navigation.md

> Index of every Material 3 Expressive design-system doc in this folder. These files are the **authoritative token + spec reference** for any prototype built on the M3 dark-purple theme (e.g. `prototypes/search-page/`).
>
> Read the relevant file before touching CSS variables, motion, or component styling in an M3 prototype. The values here are copied verbatim from `prototypes/search-page/styles.css` — do not "improve" or "approximate" them.

---

## Why this folder exists

The repo's top-level `docs/design-standards.md` covers general mobile UI/UX rules (frame, status bar, spacing scale, type scale). This folder goes deeper into the **Material 3 Expressive** system that the `search-page` prototype uses, with exact hex values, token names, CSS code samples, and the reasoning behind each rule.

If `design-standards.md` and a file here ever disagree, **this folder wins** for M3 prototypes. File an issue in the worklog if you spot a conflict.

---

## Files

| File                      | What it covers                                                                                                                |
|---------------------------|-------------------------------------------------------------------------------------------------------------------------------|
| `navigation.md`           | **This file.** Index of the M3 design-system docs and reading order.                                                          |
| `color-system.md`         | M3 color roles (primary, secondary, tertiary, error, outline), tonal surface tiers (surface-1 → surface-5), dark/light themes with exact hex. The M3 principle: elevation = tonal surface color, NOT shadows. |
| `typography.md`           | M3 type scale (display 32 → label-small 11), font family, weights, line-heights, letter-spacing rules (negative for headlines, positive + uppercase for overlines). |
| `spacing.md`              | 4px base grid (`--sp-1` 4 → `--sp-10` 40), when to use each token, spacing rhythm inside cards/sheets/grids.                  |
| `elevation.md`            | M3 tonal elevation system (5 surface tiers), why `box-shadow` is reserved for the device frame ONLY, CSS custom-property implementation patterns. |
| `motion.md`               | M3 easing curves (standard, emphasized, emphasized-decel), duration tokens (100–500ms), staggered card fade-in (40ms per card), sheet slide-up (500ms), chip-in animation, skeleton shimmer. |
| `components.md`           | M3 component specs: buttons (filled / outlined / tonal), cards, chips (filter + assist), search bar, floating bottom nav, filter bottom sheet (accordion + flat toggle), segmented buttons, dropdown menus. |
| `layout-patterns.md`      | Layout patterns used in the search page: collapsing header, floating bottom nav, section trays, recent-searches collapse toggle, blur-gradient on scroll. |

---

## Reading order for a new agent

1. [`color-system.md`](./color-system.md) — the surface tiers are the foundation; every other doc references them.
2. [`elevation.md`](./elevation.md) — explains *why* surface tiers exist (replaces shadows).
3. [`typography.md`](./typography.md) — type scale + letter-spacing rules.
4. [`spacing.md`](./spacing.md) — 4px grid tokens.
5. [`motion.md`](./motion.md) — easing curves + durations + named animations.
6. [`components.md`](./components.md) — component-by-component spec (radii, heights, surface tiers, hover/active states).
7. [`layout-patterns.md`](./layout-patterns.md) — how components compose into screen-level patterns (collapsing header, sheets, trays).

---

## Source of truth

Every value in these docs is lifted from `prototypes/search-page/styles.css` (v3 redesign). If you change a token in a prototype, **update the corresponding doc here in the same commit** so the system stays in sync.

The reference prototype lives at:
- Code: `prototypes/search-page/{index.html, styles.css, script.js}`
- Live: <https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/search-page/>
- README: `prototypes/search-page/README.md`

---

## Quick token cheat-sheet

```css
/* Type scale */
--fs-display: 32px;  --fs-h1: 26px;    --fs-h2: 22px;   --fs-h3: 18px;
--fs-body-l: 16px;   --fs-body: 14px;  --fs-body-s: 13px;
--fs-label: 12px;    --fs-label-s: 11px;

/* Spacing (4px grid) */
--sp-1: 4px;  --sp-2: 8px;   --sp-3: 12px;  --sp-4: 16px;
--sp-5: 20px; --sp-6: 24px;  --sp-8: 32px;  --sp-10: 40px;

/* Radius (M3 shapes) */
--r-xs: 8px;  --r-sm: 12px;  --r-md: 16px;  --r-lg: 20px;  --r-xl: 28px;
--r-pill: 999px;

/* Motion (M3) */
--ease-standard:        cubic-bezier(.2, 0, 0, 1);
--ease-emphasized:      cubic-bezier(.3, 0, 0, 1);
--ease-emphasized-decel: cubic-bezier(.05, .7, .1, 1);
--dur-1: 100ms; --dur-2: 200ms; --dur-3: 300ms; --dur-4: 400ms; --dur-5: 500ms;
```

Full color tokens (dark + light) live in [`color-system.md`](./color-system.md).

---

*Last updated: design system documentation pass.*
