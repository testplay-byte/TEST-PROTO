# docs/design-systems/material-3-expressive/elevation.md

> How Material 3 Expressive elevation works in this repo: tonal surfaces, NOT shadows. The 5-tier surface ladder. The one (and only) place `box-shadow` is allowed.

This doc is the operational companion to [`color-system.md`](./color-system.md) §1. Read that first if you haven't — it explains *why* elevation is tonal. This doc explains *how* to implement it in CSS.

---

## 1. The rule

> **Elevation is expressed by changing the surface color tone, not by adding a `box-shadow`.**

There is exactly one `box-shadow` allowed in the entire M3 component layer of the prototype: the **device frame** itself, because it's hardware, not a UI surface. Everything else — cards, sheets, the bottom nav, dropdowns, chips, the search bar — uses tonal surfaces.

Concretely: the elevation of an element is **which `--color-surface-N` token it uses**. No `box-shadow`, no `filter: drop-shadow`, no inset highlight. Just the surface tone.

---

## 2. The 5-tier surface ladder

(Cross-reference: full hex values in [`color-system.md`](./color-system.md) §2.)

| Tier | Token                   | Dark hex    | Light hex  | Used for                                                          |
|------|-------------------------|-------------|------------|-------------------------------------------------------------------|
| 0    | `--color-bg`            | `#14111f`   | `#fef7ff`  | The screen canvas. Lowest elevation.                              |
| 1    | `--color-surface-1`     | `#1b1729`   | `#f3edf7`  | Search bar, section trays, recent-item hover.                     |
| 2    | `--color-surface-2`     | `#221e33`   | `#ede7f4`  | Cards, settings cards, filter sheet background.                   |
| 3    | `--color-surface-3`     | `#2a2540`   | `#e7e0eb`  | Chips, accordion buttons, sort-dropdown hover, bottom nav.        |
| 4    | `--color-surface-4`     | `#332d4c`   | `#ddd6e4`  | Sort-dropdown menu container, accordion icon badge.               |
| 5    | `--color-surface-5`     | `#3d3656`   | `#d0c9dd`  | Score-slider track, sort-dropdown item hover (highest).           |

### Direction of elevation

In **dark** theme, higher elevation → **lighter** tone (closer to white). The lowest tier (`--color-bg`) is near-black; the highest (`--color-surface-5`) is medium-purple.

In **light** theme, higher elevation → **darker** tone (closer to black). The lowest tier (`--color-bg`) is near-white; the highest (`--color-surface-5`) is medium-lavender.

The CSS variable names are the same in both themes — only the values flip. **This is the magic of M3 tonal elevation**: a single token gives you correct elevation in both themes with zero extra code.

### Why "5" tiers?

- Fewer than 5 and you can't distinguish card-on-bg from card-on-sheet from chip-on-card.
- More than 5 and designers start inventing tiers that don't carry meaning.
- 5 covers: background, "on background", card, "on card", and "highest". That's enough.

---

## 3. How to apply elevation in CSS

### Pattern: pick a tier, use the token

```css
/* A card sits on the background → tier 2 */
.anime-card__cover {
  background: var(--color-surface-2);
}

/* A chip sits on a card → tier 3 */
.fchip {
  background: var(--color-surface-3);
}

/* A dropdown menu floats above everything → tier 4 */
.sort-dropdown {
  background: var(--color-surface-4);
}
```

That's it. No shadow. The tonal contrast against the parent background does the work.

### Pattern: hover = bump up one tier

For hover/active states, move the element **one tier up** (lighter in dark theme, darker in light theme). This makes hover feel like "lifting" — the same metaphor as elevation.

```css
.recent-item              { /* default — sits on the tray (tier 1) */ }
.recent-item:hover        { background: var(--color-surface-1); }

.sort-dropdown__item      { /* default — sits in the dropdown (tier 4) */ }
.sort-dropdown__item:hover{ background: var(--color-surface-5); }

.searchbar                { background: var(--color-surface-1); }
.searchbar:focus-within   { background: var(--color-surface-3); }  /* jump 2 tiers — focus is "more elevated" than hover */
```

The focus-within jump on `.searchbar` skips tier 2 (goes from 1 → 3) because focus is the most important interaction state and should feel like the search bar "popped up" to greet the user.

### Pattern: parent + child = tier + 1 or + 2

When you nest surfaces, the child should sit **1 or 2 tiers above** the parent so the eye can see the boundary.

```css
/* Filter sheet body is tier 2 */
.filter-sheet             { background: var(--color-surface-2); }

/* Accordion buttons inside the sheet are tier 3 (one above) */
.facc__btn                { background: var(--color-surface-3); }

/* Icon badges inside accordion buttons are tier 4 (two above) */
.facc__btn-icon           { background: var(--color-surface-4); }
```

This gives a clean "stacked" reading without any shadows.

---

## 4. The ONE allowed shadow: the device frame

The `.device` element is hardware — a phone mockup sitting on a stage. It uses `box-shadow` for three reasons that are **unique to the device** and do not apply to UI surfaces:

1. The device sits on a *different palette* (the stage) than the app, so tonal elevation doesn't work — there's no shared surface ladder between the app and the stage.
2. The device has a physical bezel that needs a real shadow to read as 3D hardware.
3. The shadow is part of the "this is a phone on a desk" metaphor.

```css
.device {
  width: 390px; height: 844px;
  background: var(--color-bg);
  border-radius: 32px;
  box-shadow:
    0 0 0 5px   var(--device-bezel),                              /* black bezel ring */
    0 0 0 5.5px var(--device-edge),                               /* hairline edge */
    0 24px 60px -16px rgba(0,0,0,.5);                             /* soft drop shadow on the stage */
}
```

This is the **only** `box-shadow` in the entire prototype CSS that represents hardware. Don't copy this pattern for UI surfaces.

### The bottom-nav exception

The floating bottom nav *does* carry a `box-shadow`, but for a specific reason: it physically floats over scrolling content (which can be arbitrary images in the anime card grid), and we need it to read against unpredictable backgrounds.

```css
.bottomnav {
  background: var(--color-surface-3);
  box-shadow:
    0 8px 24px rgba(0,0,0,.35),
    0 2px 8px  rgba(0,0,0,.2);
}
```

This is the **only UI element** with a real shadow. The rest of the system stays tonal. If you find yourself adding `box-shadow` to a card or a sheet, you're doing it wrong — use a higher surface tier instead.

### The filled-button micro-shadow

`.btn-filled` (the primary "Apply filters" button) has a small tinted shadow:

```css
.btn-filled {
  box-shadow: 0 2px 8px color-mix(in srgb, var(--color-primary) 30%, transparent);
}
```

This is a **brand-tinted glow**, not elevation — it draws the eye to the primary action. It's a deliberate exception, not a pattern to repeat.

---

## 5. Why no shadows? (the longer argument)

### Performance

Every `box-shadow` is a Gaussian blur on the GPU. Stack 30 anime cards each with a shadow and the browser does 30 blurs per frame. Scrolling stutters. Tonal elevation costs zero GPU time — it's a fill color.

### Visual coherence

Shadows only look right with a consistent light source. On mobile, screens scroll, sheets slide up, content reflows. A consistent light source is impossible. Tonal elevation is light-source-agnostic — every tier reads correctly regardless of where the "light" is.

### Theme pairing

Tonal elevation gives you dark + light themes for free. The same `--color-surface-3` token is `#2a2540` in dark (lighter than bg) and `#e7e0eb` in light (darker than bg). One token, two correct directions. A shadow doesn't flip with theme — it's always dark-on-light, which is wrong in dark theme.

### Accessibility

Tonal elevation **is** contrast — between the surface and what's behind it. So elevating a card automatically improves its text contrast. Shadows don't; they just smudge the edges.

### Editability

If you decide your card should be tier 3 instead of tier 2, you change one CSS variable reference. With shadows, you'd be tweaking blur radii, opacities, and offsets — a much messier change.

---

## 6. CSS implementation pattern (custom properties)

The whole elevation system is built on CSS custom properties defined on `.device` (dark default) and overridden on `.device[data-theme="light"]`. Here's the full pattern:

```css
/* ---- App-level tokens (scoped to .device) — M3 dark purple ----------- */
.device {
  --color-bg: #14111f;
  --color-surface-1: #1b1729;
  --color-surface-2: #221e33;
  --color-surface-3: #2a2540;
  --color-surface-4: #332d4c;
  --color-surface-5: #3d3656;
  /* …other tokens… */
}

/* Light theme override — only the values change, the token names stay the same */
.device[data-theme="light"] {
  --color-bg: #fef7ff;
  --color-surface-1: #f3edf7;
  --color-surface-2: #ede7f4;
  --color-surface-3: #e7e0eb;
  --color-surface-4: #ddd6e4;
  --color-surface-5: #d0c9dd;
  /* …other tokens… */
}
```

### Why scope to `.device`?

Because the app theme is **independent** of the page theme. The user can toggle dark/light inside the app without changing the desktop stage around it. See [`docs/theme-architecture.md`](../../theme-architecture.md) for the full reasoning.

### How a component consumes the tokens

```css
.anime-card__cover {
  background: var(--color-surface-2);    /* elevation tier 2 */
  border-radius: var(--r-sm);            /* 12px shape */
  /* NO box-shadow */
}

.filter-sheet {
  background: var(--color-surface-2);    /* sheet sits on the screen background */
  border-radius: var(--r-xl) var(--r-xl) 0 0;
  /* NO box-shadow — the scrim (rgba(0,0,0,.55)) provides the separation from background */
}
```

Notice: the sheet's separation from the background comes from the **scrim** (a translucent black overlay on the rest of the screen), not from a shadow on the sheet itself. This is correct M3 — modal surfaces use a scrim, not a shadow, to indicate they're above the content.

---

## 7. The scrim: how modal elevation works

When a surface is **modal** (covers content and blocks interaction), it gets a scrim — a translucent overlay on everything else:

```css
.sheet-scrim {
  position: absolute; inset: 0;
  background: rgba(0, 0, 0, 0.55);     /* 55% black */
  z-index: 50;
  opacity: 0; pointer-events: none;    /* hidden by default */
  transition: opacity var(--dur-3) var(--ease-standard);
}
.sheet-scrim.is-visible { opacity: 1; pointer-events: auto; }

.filter-sheet {
  z-index: 51;                          /* above the scrim */
  /* … */
}
```

The scrim does two jobs at once:
1. **Visual**: it darkens the background so the sheet's tonal surface stands out.
2. **Interaction**: it captures clicks outside the sheet (tap scrim to close).

A shadow on the sheet would do neither — it would just be a smudge under the sheet's bottom edge. The scrim is the correct M3 pattern.

---

## 8. Elevation cheatsheet

| Element                  | Tier    | Token                   | Notes                                                          |
|--------------------------|---------|-------------------------|----------------------------------------------------------------|
| Screen background        | 0       | `--color-bg`            | The canvas.                                                    |
| Section tray             | 1       | `--color-surface-1`     | Tray wraps recent searches and results.                        |
| Search bar               | 1 → 3   | `--color-surface-1` (default), `--color-surface-3` (focus) | Focus jumps 2 tiers. |
| Recent item hover        | 1       | `--color-surface-1`     | Subtle hover on the tray.                                      |
| Anime card cover         | 2       | `--color-surface-2`     | Card on the background.                                        |
| Settings card            | 2       | `--color-surface-2`     | Card on the background.                                        |
| Filter sheet             | 2       | `--color-surface-2`     | Modal sheet (with scrim).                                      |
| Recent-item icon         | 2       | `--color-surface-2`     | Icon badge inside a recent item.                               |
| Empty-state icon         | 2       | `--color-surface-2`     | Icon circle on the background.                                 |
| Chip (filter chip)       | 3       | `--color-surface-3`     | Chip on a card or sheet.                                       |
| Accordion button         | 3       | `--color-surface-3`     | Accordion row in the sheet.                                    |
| Bottom nav               | 3       | `--color-surface-3`     | Floating bar with extra `box-shadow` for image readability.    |
| Sort dropdown menu       | 4       | `--color-surface-4`     | Popover above the sheet/content.                               |
| Accordion icon badge     | 4       | `--color-surface-4`     | Icon circle inside the accordion button.                       |
| Score slider track       | 5       | `--color-surface-5`     | Highest tier — slider groove.                                  |
| Sort dropdown item hover | 5       | `--color-surface-5`     | Hover bump from tier 4.                                        |
| Device frame             | —       | (hardware)              | Uses real `box-shadow` — see §4.                               |
| Filled button            | —       | `--color-primary`       | Has a tinted micro-shadow as brand glow, not elevation.        |

---

## 9. Anti-patterns

- **Don't add `box-shadow` to a card.** Use `--color-surface-2` (or 3 if it needs to feel elevated).
- **Don't use `text-shadow` for elevation.** If text needs to read on an image, use a `backdrop-filter: blur()` or a translucent background pill.
- **Don't invent `--color-surface-6`.** If you need a higher tier, you're nesting too deep — restructure the layout.
- **Don't use `filter: drop-shadow()` on icons.** M3 icons are flat; they don't cast shadows.
- **Don't reuse the device-frame shadow stack on UI surfaces.** That triple-shadow is for hardware only.
- **Don't add a hover shadow to interactive elements.** Bump the surface tier instead: `:hover { background: var(--color-surface-N+1); }`.
- **Don't fake depth with `transform: translateZ()` on flat elements.** There's no perspective context; the translate does nothing visible.

---

## 10. Quick reference

```
TIER 0  --color-bg          #14111f (dark) / #fef7ff (light)   — screen canvas
TIER 1  --color-surface-1   #1b1729 / #f3edf7                   — search bar, trays, hover
TIER 2  --color-surface-2   #221e33 / #ede7f4                   — cards, sheet bg
TIER 3  --color-surface-3   #2a2540 / #e7e0eb                   — chips, accordion, bottom nav
TIER 4  --color-surface-4   #332d4c / #ddd6e4                   — dropdown menu, icon badge
TIER 5  --color-surface-5   #3d3656 / #d0c9dd                   — slider track, dropdown hover

DARK THEME:  higher tier → LIGHTER tone
LIGHT THEME: higher tier → DARKER tone

BOX-SHADOW ALLOWED ON:
  • .device          (hardware frame — 5px bezel + soft drop shadow)
  • .bottomnav       (floating over images — soft shadow stack)
  • .btn-filled      (brand-tinted glow, not elevation)

MODAL ELEVATION = scrim (rgba(0,0,0,.55)) + z-index, NOT shadow
```

---

*Last updated: design system documentation pass.*
