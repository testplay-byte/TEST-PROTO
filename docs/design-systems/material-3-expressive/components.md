# docs/design-systems/material-3-expressive/components.md

> M3 component specs for the `search-page` prototype. Each component lists: elevation tier, radius, height, padding, color roles, states, and the CSS class names. Every value is copied from `prototypes/search-page/styles.css`.

This is the component-by-component reference. For how they compose into screen patterns (collapsing header, trays, sheets), see [`layout-patterns.md`](./layout-patterns.md). For token definitions, see [`color-system.md`](./color-system.md), [`typography.md`](./typography.md), [`spacing.md`](./spacing.md), [`elevation.md`](./elevation.md), [`motion.md`](./motion.md).

---

## 1. Buttons

M3 has three button variants in this prototype: **filled**, **outlined**, and **tonal**. All share a 52px height (filled/outlined) and pill radius (`--r-pill: 999px`).

### 1.1 Filled button (`.btn-filled`)

The highest-emphasis action. Used once per screen at most — in the filter sheet, it's the "Apply filters" button.

```css
.btn-filled {
  flex: 1 1 0;
  height: 52px;
  border-radius: var(--r-pill);
  background: var(--color-primary);
  color: var(--color-primary-fg);
  font-size: var(--fs-body-l);          /* 16px */
  font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  transition:
    background var(--dur-1) var(--ease-standard),
    transform  var(--dur-1) var(--ease-emphasized);
  box-shadow: 0 2px 8px color-mix(in srgb, var(--color-primary) 30%, transparent);
}
.btn-filled:active  { transform: scale(.97); }
.btn-filled:hover   { background: color-mix(in srgb, var(--color-primary) 85%, #fff); }
```

| Property     | Value                                              |
|--------------|----------------------------------------------------|
| Height       | 52px                                               |
| Radius       | pill (999px)                                       |
| Background   | `--color-primary`                                  |
| Text color   | `--color-primary-fg`                               |
| Font         | `--fs-body-l` (16px), weight 700                   |
| Elevation    | None — gets a **brand-tinted glow** shadow (not elevation): `0 2px 8px` at 30% primary. |
| States       | `:hover` → 85% primary + 15% white. `:active` → scale 0.97. |
| Use for      | Primary action of a screen or modal (one per view). |

### 1.2 Outlined button (`.btn-outlined`)

Medium emphasis. The secondary action — in the filter sheet, it's the "Clear all" button. Also used as the sort button (with smaller height — see §1.4).

```css
.btn-outlined {
  flex: 0 0 auto;
  height: 52px;
  padding: 0 var(--sp-6);                /* 24px horizontal */
  border-radius: var(--r-pill);
  border: 1px solid var(--color-outline-variant);
  background: transparent;
  color: var(--color-text);
  font-size: var(--fs-body);             /* 14px */
  font-weight: 600;
  display: flex; align-items: center; justify-content: center;
  transition: all var(--dur-1) var(--ease-standard);
}
.btn-outlined:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
```

| Property     | Value                                              |
|--------------|----------------------------------------------------|
| Height       | 52px                                               |
| Radius       | pill                                               |
| Background   | transparent                                        |
| Border       | 1px `--color-outline-variant`                      |
| Text color   | `--color-text` (default), `--color-primary` (hover)|
| Font         | `--fs-body` (14px), weight 600                     |
| Elevation    | None.                                              |
| States       | `:hover` → border + text both become `--color-primary`. |
| Use for      | Secondary action — paired with `.btn-filled` in the filter sheet actions row. |

### 1.3 Tonal button (`.filter-btn`)

A surface-toned button that uses **surface tier 2** by default and bumps to tier 3 on hover. The "Filters" trigger in the quick row.

```css
.filter-btn {
  display: flex; align-items: center; gap: 7px;
  padding: 10px 18px 10px 14px;          /* asymmetric: leading icon gets less room */
  border-radius: var(--r-pill);
  border: none;
  background: var(--color-surface-2);
  color: var(--color-text);
  font-size: var(--fs-body-s);           /* 13px */
  font-weight: 600;
  transition: all var(--dur-2) var(--ease-standard);
  flex: 0 0 auto;
}
.filter-btn:hover     { background: var(--color-surface-3); }
.filter-btn.is-active {
  background: var(--color-primary-container);
  color: var(--color-on-primary-container);
}
```

| Property     | Value                                              |
|--------------|----------------------------------------------------|
| Height       | ~44px (10+13+10 padding + line height ≈ 44)       |
| Radius       | pill                                               |
| Background   | `--color-surface-2` (default) → `--color-surface-3` (hover) → `--color-primary-container` (active) |
| Text color   | `--color-text` (default) → `--color-on-primary-container` (active) |
| Font         | `--fs-body-s` (13px), weight 600                   |
| Elevation    | Tonal (tier 2 → 3 on hover).                       |
| States       | `:hover` bumps tier. `.is-active` switches to primary-container. |
| Badge        | Optional `<span class="filter-btn__badge">N</span>` — primary background, primary-fg text, 10px font, pill shape. When `.is-active`, inverts (on-primary-container bg, primary-container text). |
| Use for      | Filter trigger button. |

### 1.4 Sort button (`.sort-btn`)

A small outlined button paired with `.filter-btn` in the quick row. Lower visual weight than the Filters button.

```css
.sort-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 10px 14px;
  border-radius: var(--r-pill);
  border: 1px solid var(--color-outline-variant);
  background: transparent;
  color: var(--color-text-muted);
  font-size: var(--fs-label);            /* 12px */
  font-weight: 600;
  transition: all var(--dur-2) var(--ease-standard);
  flex: 0 0 auto;
}
.sort-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-text);
  background: color-mix(in srgb, var(--color-primary) 6%, transparent);
}
.sort-btn svg              { transition: transform var(--dur-2) var(--ease-emphasized); }
.sort-btn.is-open svg      { transform: rotate(180deg); }
```

| Property     | Value                                              |
|--------------|----------------------------------------------------|
| Height       | ~40px                                              |
| Radius       | pill                                               |
| Background   | transparent + 6% primary tint on hover             |
| Border       | 1px `--color-outline-variant` → `--color-primary` on hover |
| Text color   | `--color-text-muted` → `--color-text` on hover     |
| Font         | `--fs-label` (12px), weight 600                    |
| Chevron      | Rotates 180° when `.is-open` (dropdown is visible). 200ms emphasized. |
| Use for      | Sort trigger. |

---

## 2. Cards

### 2.1 Anime card (`.anime-card`)

The 3-column grid card. Composed of three parts: cover image (with optional score badge), title (2-line clamp), and meta line.

```css
.anime-card {
  display: flex; flex-direction: column; gap: 6px;
  cursor: pointer;
  transition: transform var(--dur-1) var(--ease-emphasized);
  animation: cardFadeIn var(--dur-4) var(--ease-emphasized-decel) backwards;
}
.anime-card:active { transform: scale(.96); }

.anime-card__cover {
  position: relative;
  width: 100%;
  aspect-ratio: 2 / 3;
  border-radius: var(--r-sm);            /* 12px */
  overflow: hidden;
  background: var(--color-surface-2);    /* tier 2 — fallback before image loads */
}
.anime-card__cover img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform var(--dur-4) var(--ease-emphasized-decel);
}
.anime-card:active .anime-card__cover img { transform: scale(1.1); }

.anime-card__score {
  position: absolute; bottom: 6px; left: 6px;
  background: rgba(20, 17, 31, 0.82);    /* dark-tinted, not a surface token — overlay on image */
  color: var(--color-warn);
  font-size: 10px; font-weight: 700;
  padding: 3px 7px;
  border-radius: var(--r-xs);            /* 8px */
  display: flex; align-items: center; gap: 2px;
  backdrop-filter: blur(10px);
  letter-spacing: .01em;
}

.anime-card__title {
  font-size: var(--fs-label);            /* 12px */
  font-weight: 600;
  line-height: 1.35;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: var(--color-text);
  letter-spacing: -.005em;
}

.anime-card__meta {
  font-size: var(--fs-label-s);          /* 11px */
  font-weight: 500;
  color: var(--color-text-subtle);
  letter-spacing: .01em;
}
```

| Part         | Spec                                                |
|--------------|-----------------------------------------------------|
| Cover        | `aspect-ratio: 2/3`, `border-radius: 12px` (`--r-sm`), background `--color-surface-2` (loading fallback). |
| Score badge  | Absolute bottom-left, 8px radius, dark translucent bg (rgba 0.82), `--color-warn` text, 10px, `backdrop-filter: blur(10px)`. |
| Title        | 12px (`--fs-label`), weight 600, 2-line clamp, `letter-spacing: -.005em`. |
| Meta         | 11px (`--fs-label-s`), weight 500, `--color-text-subtle`. |
| Press        | Card scales 0.96; cover image zooms to 1.1.         |
| Entrance     | `cardFadeIn` 400ms emphasized-decel, 40ms stagger per card. |
| Elevation    | Tier 2 background only (the cover). The card itself has no background — the cover is the visible surface. |

### 2.2 Settings card (`.settings-card`)

A simple container for grouped settings rows.

```css
.settings-card {
  background: var(--color-surface-2);
  border-radius: var(--r-md);            /* 16px */
  overflow: hidden;
}
```

| Property     | Value                                              |
|--------------|----------------------------------------------------|
| Background   | `--color-surface-2` (tier 2)                       |
| Radius       | 16px (`--r-md`)                                    |
| Elevation    | Tonal tier 2.                                      |

---

## 3. Chips

Three chip variants in this prototype: **filter chips** (`.fchip`), **active filter chips** (`.active-filter-chip`), and **flat filter tabs** (`.filter-flat-tab`). All use pill radius.

### 3.1 Filter chip (`.fchip`)

Multi-select chip used inside the accordion filter content. Outlined by default, filled with `primary-container` when active.

```css
.fchip {
  display: flex; align-items: center; gap: 5px;
  padding: 8px 14px;
  border-radius: var(--r-pill);
  border: 1px solid var(--color-outline-variant);
  background: var(--color-surface-3);    /* tier 3 — sits on the sheet (tier 2) */
  color: var(--color-text-muted);
  font-size: var(--fs-label);            /* 12px */
  font-weight: 600;
  transition: all var(--dur-1) var(--ease-standard);
  cursor: pointer;
}
.fchip:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
.fchip.is-active {
  background: var(--color-primary-container);
  border-color: transparent;
  color: var(--color-on-primary-container);
}
.fchip__check { display: none; }
.fchip.is-active .fchip__check { display: flex; }
```

| Property     | Value                                              |
|--------------|----------------------------------------------------|
| Padding      | `8px 14px`                                         |
| Radius       | pill                                               |
| Background   | `--color-surface-3` (default) → `--color-primary-container` (active) |
| Border       | 1px `--color-outline-variant` → transparent when active |
| Text color   | `--color-text-muted` → `--color-primary` (hover) → `--color-on-primary-container` (active) |
| Font         | `--fs-label` (12px), weight 600                    |
| Check icon   | Hidden by default; shown when `.is-active`.        |
| Elevation    | Tier 3 (sits on the tier-2 sheet).                 |
| Animation    | `--dur-1` (100ms) `--ease-standard` for color/border transitions. |

### 3.2 Active filter chip (`.active-filter-chip`)

The chip that appears at the top of the search results when a filter is active. Always in the "active" state — it represents an applied filter that can be removed by tapping the X.

```css
.active-filter-chip {
  flex: 0 0 auto;
  display: flex; align-items: center; gap: 6px;
  padding: 6px 6px 6px 14px;
  border-radius: var(--r-pill);
  background: var(--color-primary-container);
  color: var(--color-on-primary-container);
  font-size: var(--fs-label);            /* 12px */
  font-weight: 600;
  border: none;
  animation: chipIn var(--dur-3) var(--ease-emphasized-decel);
}

.active-filter-chip__x {
  width: 20px; height: 20px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: color-mix(in srgb, var(--color-on-primary-container) 15%, transparent);
}
```

| Property     | Value                                              |
|--------------|----------------------------------------------------|
| Padding      | `6px 6px 6px 14px` (asymmetric — room for trailing X) |
| Radius       | pill                                               |
| Background   | `--color-primary-container`                        |
| Text color   | `--color-on-primary-container`                     |
| Font         | `--fs-label` (12px), weight 600                    |
| X button     | 20×20px circle, 15% on-primary-container tint.     |
| Entrance     | `chipIn` 300ms emphasized-decel (scale .8 → 1).    |

### 3.3 Flat filter tab (`.filter-flat-tab`)

Used in the "flat" view of the filter sheet (alternative to accordion). Horizontal scrollable row.

```css
.filter-flat-tab {
  flex: 0 0 auto;
  display: flex; align-items: center; gap: 5px;
  padding: 10px 16px;
  border-radius: var(--r-pill);
  border: none;
  background: transparent;
  color: var(--color-text-muted);
  font-size: var(--fs-label);            /* 12px */
  font-weight: 600;
  transition: all var(--dur-1) var(--ease-standard);
  white-space: nowrap;
  cursor: pointer;
}
.filter-flat-tab:hover {
  background: var(--color-surface-4);
  color: var(--color-text);
}
.filter-flat-tab.is-active {
  background: var(--color-primary);
  color: var(--color-primary-fg);
  box-shadow: 0 2px 6px color-mix(in srgb, var(--color-primary) 30%, transparent);
}
```

| Property     | Value                                              |
|--------------|----------------------------------------------------|
| Padding      | `10px 16px`                                        |
| Radius       | pill                                               |
| Background   | transparent (default) → `--color-surface-4` (hover) → `--color-primary` (active) |
| Text color   | `--color-text-muted` → `--color-text` (hover) → `--color-primary-fg` (active) |
| Font         | `--fs-label` (12px), weight 600                    |
| Active state | Filled with bare `--color-primary` (more vivid than `--color-primary-container`) + brand-tinted micro-shadow. |

---

## 4. Search bar (`.searchbar`)

Pill-shaped, 52px tall (44px when collapsed). The most-used input in the prototype.

```css
.searchbar {
  display: flex; align-items: center; gap: var(--sp-3);
  background: var(--color-surface-1);    /* tier 1 — sits on the screen background */
  border-radius: var(--r-pill);
  padding: 0 var(--sp-2) 0 var(--sp-4);  /* 0 8px 0 16px — no vertical, asymmetric horizontal */
  height: 52px;                          /* expanded */
  border: none;
  flex: 1 1 100%;
  transition: all var(--dur-3) var(--ease-emphasized);
}
.searchbar:focus-within { background: var(--color-surface-3); }   /* focus bumps 2 tiers */

.searchbar__icon { color: var(--color-text-muted); flex: 0 0 auto; }

.searchbar input {
  flex: 1 1 auto;
  border: none; outline: none; background: none;
  color: var(--color-text);
  font-size: var(--fs-body-l);           /* 16px */
  font-weight: 400;
}
.searchbar input::placeholder { color: var(--color-text-muted); }

.searchbar__clear {
  width: 40px; height: 40px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: var(--color-text-muted);
  flex: 0 0 auto;
  transition: background var(--dur-1) var(--ease-standard), color var(--dur-1) var(--ease-standard);
}
.searchbar__clear:hover {
  background: var(--color-surface-3);
  color: var(--color-text);
}
```

| Property              | Value                                              |
|-----------------------|----------------------------------------------------|
| Height (expanded)     | 52px                                               |
| Height (collapsed)    | 44px (set via `.topbar.is-collapsed .searchbar`)   |
| Radius                | pill                                               |
| Background            | `--color-surface-1` (default) → `--color-surface-3` (focus) |
| Border                | None — tonal elevation provides separation.        |
| Padding               | `0 8px 0 16px`                                     |
| Input font            | `--fs-body-l` (16px), weight 400                   |
| Placeholder color     | `--color-text-muted`                               |
| Clear button          | 40×40px circle, transparent bg → surface-3 on hover. Hidden by default; shown via JS when input has text. |
| Elevation             | Tier 1 default, tier 3 on focus (jumps 2 tiers — focus is "more elevated" than hover). |
| Animation             | `all` 300ms emphasized — covers height, flex, background changes when collapsing. |

---

## 5. Bottom navigation (`.bottomnav`)

The floating, rounded bottom navigation bar. 5 items, text beside icon (only on active item).

```css
.bottomnav {
  position: absolute;
  left: 16px; right: 16px; bottom: 16px;    /* 16px from every edge */
  height: 64px;
  background: var(--color-surface-3);        /* tier 3 */
  border-radius: var(--r-xl);                /* 28px — most rounded in the system */
  border: none;
  display: flex; align-items: center;
  padding: 0 8px;
  z-index: 10;
  box-shadow:
    0 8px 24px rgba(0,0,0,.35),
    0 2px 8px  rgba(0,0,0,.2);
}

.bottomnav__item {
  flex: 1 1 0;                               /* all items equal width */
  display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 6px;
  height: 48px;
  border-radius: var(--r-pill);
  color: var(--color-text-muted);
  font-size: var(--fs-label);                /* 12px */
  transition:
    color      var(--dur-2) var(--ease-standard),
    background var(--dur-3) var(--ease-emphasized);
  position: relative;
  padding: 0 8px;
  overflow: hidden;
  min-width: 0;
}

.bottomnav__item.is-active {
  color: var(--color-on-primary-container);
  background: var(--color-primary-container);
}

.bottomnav__item:not(.is-active) .bottomnav__label { display: none; }
.bottomnav__item.is-active .bottomnav__label      { display: block; }

.bottomnav__icon {
  flex: 0 0 auto;
  transition: transform var(--dur-2) var(--ease-emphasized);
}
.bottomnav__item.is-active .bottomnav__icon { transform: scale(1.05); }

.bottomnav__label {
  font-size: var(--fs-label);
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: opacity var(--dur-2) var(--ease-standard);
}
```

| Property              | Value                                              |
|-----------------------|----------------------------------------------------|
| Position              | `absolute`, 16px from every edge (left/right/bottom) |
| Height                | 64px (bar) / 48px (item)                           |
| Radius                | 28px (`--r-xl`) — bar / pill — item                |
| Background            | `--color-surface-3` (tier 3)                       |
| Item background       | transparent (default) → `--color-primary-container` (active) |
| Item text             | `--color-text-muted` (default) → `--color-on-primary-container` (active) |
| Item layout           | `flex-direction: row` — **icon beside label**, not stacked. |
| Label visibility      | Hidden on non-active items, shown on active.       |
| Icon scale            | Active item icon scales to 1.05 (200ms emphasized). |
| Shadow                | Soft shadow stack — `0 8px 24px rgba(0,0,0,.35)` + `0 2px 8px rgba(0,0,0,.2)`. **Only UI element with a real shadow** (see [`elevation.md`](./elevation.md) §4). |
| Z-index               | 10                                                 |
| Items                 | 5: Home, Library, History, **Search** (active by default), Settings. |

### Why text beside icon (not below)

M3 Expressive prefers horizontal nav items over the older "icon-over-label" pattern. The horizontal layout:
- Reads faster (eye scans left-to-right, doesn't need to drop down for the label).
- Saves vertical space (48px item height vs ~72px for stacked).
- Lets the active item's label appear with the icon as a single pill, reinforcing "this is selected."

Non-active items hide their label entirely — only the active item shows text. This is the user's explicit preference (see [`prototypes/search-page/navigation.md`](../../../prototypes/search-page/navigation.md) §Bottom navigation).

---

## 6. Filter bottom sheet (`.filter-sheet`)

The modal filter sheet. Slides up from the bottom of the screen. Has two view modes: **accordion** (default) and **flat**.

```css
.filter-sheet {
  position: absolute; left: 0; right: 0; bottom: 0;
  background: var(--color-surface-2);    /* tier 2 */
  border-radius: var(--r-xl) var(--r-xl) 0 0;    /* 28px top corners only */
  z-index: 51;
  max-height: 85%;
  display: flex; flex-direction: column;
  transform: translateY(100%);           /* hidden below the screen */
  transition: transform var(--dur-5) var(--ease-emphasized);
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
.filter-sheet.is-open { transform: translateY(0); }

.sheet-scrim {
  position: absolute; inset: 0;
  background: rgba(0, 0, 0, 0.55);       /* 55% black scrim */
  z-index: 50;
  opacity: 0; pointer-events: none;
  transition: opacity var(--dur-3) var(--ease-standard);
}
.sheet-scrim.is-visible { opacity: 1; pointer-events: auto; }
```

| Property              | Value                                              |
|-----------------------|----------------------------------------------------|
| Position              | `absolute`, anchored to bottom (left/right/bottom: 0) |
| Background            | `--color-surface-2` (tier 2)                       |
| Radius                | 28px top corners only (`--r-xl --r-xl 0 0`)        |
| Max height            | 85% of the device height                           |
| Transform             | `translateY(100%)` (hidden) → `translateY(0)` (open) |
| Animation             | `transform` 500ms emphasized (slide-up/down)       |
| Scrim                 | Separate element (`.sheet-scrim`), 55% black, fades in 300ms standard. Tap scrim to close. |
| Z-index               | Sheet: 51. Scrim: 50.                              |
| Drag handle           | **None.** Removed per user request.                |
| Close button          | **None.** Tap scrim to close.                      |
| Clear button (in-header) | **None.** Clear-all lives in the actions row at the bottom. |

### Sheet structure

```html
<div class="sheet-scrim" id="sheetScrim"></div>
<div class="filter-sheet" id="filterSheet">
  <div class="filter-sheet__header">
    <div class="filter-sheet__header-left">
      <h2 class="filter-sheet__title">Filters</h2>
    </div>
    <div class="filter-view-toggle" id="filterViewToggle">
      <!-- Two segmented buttons: accordion / flat view -->
    </div>
  </div>
  <div class="filter-sheet__body" id="filterSheetBody">
    <!-- Accordion items OR flat tabs + content (depending on view mode) -->
  </div>
  <div class="filter-sheet__actions">
    <button class="btn-outlined">Clear all</button>
    <button class="btn-filled">Apply filters</button>
  </div>
</div>
```

### 6.1 View toggle (`.filter-view-toggle`)

A segmented control in the sheet header that switches between accordion and flat view.

```css
.filter-view-toggle {
  display: flex; align-items: center; gap: 4px;
  padding: 4px;
  border-radius: var(--r-pill);
  background: var(--color-surface-3);
}
.filter-view-toggle__btn {
  display: flex; align-items: center; justify-content: center;
  width: 32px; height: 32px;
  border-radius: var(--r-pill);
  color: var(--color-text-muted);
  transition:
    background var(--dur-1) var(--ease-standard),
    color      var(--dur-1) var(--ease-standard);
}
.filter-view-toggle__btn.is-active {
  background: var(--color-primary-container);
  color: var(--color-on-primary-container);
}
```

### 6.2 Accordion item (`.facc`)

Each filter category (Genres, Year, Season, Format, Status, Score) is an accordion row. Tap to expand its content below.

```css
.facc__btn {
  display: flex; align-items: center; justify-content: space-between; gap: var(--sp-2);
  width: 100%;
  padding: var(--sp-3) var(--sp-3);       /* 12px 12px */
  border-radius: var(--r-sm);             /* 12px */
  background: var(--color-surface-3);     /* tier 3 — sits on the tier-2 sheet */
  color: var(--color-text-muted);
  font-size: var(--fs-body-s);            /* 13px */
  font-weight: 600;
  transition: all var(--dur-2) var(--ease-emphasized);
  text-align: left;
  border: 1px solid var(--color-outline-variant);
  cursor: pointer;
}
.facc__btn:hover     { border-color: var(--color-primary); color: var(--color-text); }
.facc__btn.is-active {
  background: var(--color-primary-container);
  color: var(--color-on-primary-container);
  border-color: transparent;
}

.facc__btn-icon {
  display: flex; align-items: center; justify-content: center;
  width: 28px; height: 28px;
  border-radius: 50%;
  background: var(--color-surface-4);     /* tier 4 — sits inside the tier-3 button */
  color: var(--color-text-muted);
  flex: 0 0 auto;
  transition: all var(--dur-2) var(--ease-standard);
}
.facc__btn.is-active .facc__btn-icon {
  background: color-mix(in srgb, var(--color-on-primary-container) 15%, transparent);
  color: var(--color-on-primary-container);
}

.facc__btn-count {
  font-size: var(--fs-label-s);          /* 11px */
  font-weight: 700;
  color: var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 15%, transparent);
  padding: 2px 8px;
  border-radius: var(--r-pill);
  min-width: 20px;
  text-align: center;
}
.facc__btn.is-active .facc__btn-count {
  color: var(--color-on-primary-container);
  background: color-mix(in srgb, var(--color-on-primary-container) 15%, transparent);
}

.facc__chevron {
  transition: transform var(--dur-2) var(--ease-emphasized);
  flex: 0 0 auto;
  color: var(--color-text-muted);
}
.facc__btn.is-active .facc__chevron {
  transform: rotate(180deg);
  color: var(--color-on-primary-container);
}

.facc__content {
  overflow: hidden;
  max-height: 0;
  transition: max-height var(--dur-4) var(--ease-emphasized);
}
.facc__content.is-open { max-height: 400px; }
.facc__content-inner { padding: var(--sp-2) var(--sp-2) var(--sp-3); }
```

The accordion button has a 4-part layout: `[icon badge] [label] [count badge] [chevron]`. All four parts swap color when `.is-active` is toggled.

### 6.3 Flat filter view (`.filter-flat-tabs` + `.filter-flat-content`)

The alternative to accordion. A horizontal scrollable tab row + a content area below.

```css
.filter-flat-tabs {
  display: flex; gap: var(--sp-1);
  overflow-x: auto;
  padding: var(--sp-2);
  scrollbar-width: none;
  background: var(--color-surface-3);
  border-radius: var(--r-md);             /* 16px */
  margin-bottom: var(--sp-3);
}
.filter-flat-content {
  padding: var(--sp-2) 0 var(--sp-3);
  min-height: 120px;
}
```

When the user activates a flat tab, JS auto-scrolls it to center within the tab row (see `script.js` lines 500-510 for the implementation pattern).

---

## 7. Segmented buttons

Three segmented-button groups exist in the prototype, all using the same pattern: a pill container with 2–3 transparent buttons, the active one filled with `--color-primary-container`.

### 7.1 Source toggle (`.source-toggle`)

In the topbar. Two segments: AniList / Extension.

```css
.source-toggle {
  display: flex;
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--r-pill);
  padding: 2px;
  gap: 0;
  flex: 0 0 auto;
  transition:
    opacity   var(--dur-3) var(--ease-emphasized),
    transform var(--dur-3) var(--ease-emphasized),
    width     var(--dur-3) var(--ease-emphasized);
  overflow: hidden;
}
.source-toggle__btn {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 14px;
  border-radius: var(--r-pill);
  font-size: var(--fs-label);             /* 12px */
  font-weight: 600;
  color: var(--color-text-muted);
  transition:
    background var(--dur-2) var(--ease-emphasized),
    color      var(--dur-2) var(--ease-emphasized);
  white-space: nowrap;
}
.source-toggle__btn.is-active {
  background: var(--color-primary-container);
  color: var(--color-on-primary-container);
}
```

On header collapse, `.source-toggle` fades + scales out (opacity 0, transform scale .8, width 0).

### 7.2 Theme toggle (`.theme-toggle`)

In the Settings view. Same pattern, two segments: Dark / Light.

```css
.theme-toggle {
  display: flex;
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--r-pill);
  padding: 2px;
  gap: 0;
  flex: 0 0 auto;
}
.theme-toggle__btn {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 12px;
  border-radius: var(--r-pill);
  font-size: var(--fs-label);
  font-weight: 600;
  color: var(--color-text-muted);
  transition:
    background var(--dur-2) var(--ease-emphasized),
    color      var(--dur-2) var(--ease-emphasized);
  white-space: nowrap;
}
.theme-toggle__btn.is-active {
  background: var(--color-primary-container);
  color: var(--color-on-primary-container);
}
```

### 7.3 Filter view toggle (`.filter-view-toggle`)

In the filter sheet header. See §6.1 above — icon-only segmented control (no labels), 32×32 buttons.

---

## 8. Dropdown menu (`.sort-dropdown`)

A floating menu anchored above the sort button. Distinct from the filter sheet — this is for the sort options only (Popularity, Score, Newest, Title A-Z, Favorites).

```css
.sort-dropdown {
  background: var(--color-surface-4);     /* tier 4 — highest tier, floats above content */
  border-radius: var(--r-md);             /* 16px */
  padding: var(--sp-1);                   /* 4px padding around items */
  min-width: 160px;
  box-shadow: 0 8px 24px rgba(0,0,0,.3);  /* soft drop shadow — popover above scrolling content */
  animation: dropdownIn var(--dur-2) var(--ease-emphasized-decel);
}

.sort-dropdown__item {
  display: flex; align-items: center; justify-content: space-between; gap: var(--sp-2);
  width: 100%;
  padding: 10px var(--sp-3);              /* 10px 12px */
  border-radius: var(--r-sm);             /* 12px */
  font-size: var(--fs-body-s);            /* 13px */
  font-weight: 500;
  color: var(--color-text-muted);
  transition:
    background var(--dur-1) var(--ease-standard),
    color      var(--dur-1) var(--ease-standard);
  text-align: left;
}
.sort-dropdown__item:hover {
  background: var(--color-surface-5);     /* tier 5 — hover bump */
  color: var(--color-text);
}
.sort-dropdown__item.is-active {
  color: var(--color-primary);
  font-weight: 600;
}
```

| Property              | Value                                              |
|-----------------------|----------------------------------------------------|
| Background            | `--color-surface-4` (tier 4)                       |
| Radius                | 16px (`--r-md`)                                    |
| Padding               | 4px (around items)                                 |
| Min width             | 160px                                              |
| Shadow                | `0 8px 24px rgba(0,0,0,.3)` — popover shadow (like the bottom nav, this floats over scrolling content). |
| Entrance              | `dropdownIn` 200ms emphasized-decel — translateY(8px) scale(.95) → translateY(-100%) scale(1). |
| Item padding          | `10px 12px`                                        |
| Item radius           | 12px (`--r-sm`)                                    |
| Item hover            | Background bumps to `--color-surface-5` (tier 5).  |
| Item active           | Text becomes `--color-primary`, weight 600. No background change. |
| Use for               | Sort options (5 items): Popularity, Score, Newest, Title A-Z, Favorites. |

---

## 9. Other small components

### 9.1 Recent item (`.recent-item`)

A list item for a recent search query. Pill shape, hover state, optional remove button.

```css
.recent-item {
  display: flex; align-items: center; gap: var(--sp-3);
  padding: var(--sp-3) var(--sp-2);
  border-radius: var(--r-pill);
  cursor: pointer;
  transition: background var(--dur-1) var(--ease-standard);
  animation: chipIn var(--dur-3) var(--ease-emphasized-decel);
}
.recent-item:hover { background: var(--color-surface-1); }

.recent-item__icon {
  width: 32px; height: 32px;
  border-radius: 50%;
  background: var(--color-surface-2);     /* tier 2 — sits on the tier-1 hover bg */
  display: flex; align-items: center; justify-content: center;
  color: var(--color-text-muted);
  flex: 0 0 auto;
}

.recent-item__text {
  flex: 1 1 auto;
  font-size: var(--fs-body);             /* 14px */
  font-weight: 500;
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.recent-item__remove {
  width: 28px; height: 28px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: var(--color-text-subtle);
  flex: 0 0 auto;
  transition:
    background var(--dur-1) var(--ease-standard),
    color      var(--dur-1) var(--ease-standard);
}
.recent-item__remove:hover {
  background: var(--color-surface-3);
  color: var(--color-text);
}
```

### 9.2 Score slider (`.score-slider`)

Inside the Score accordion item. Range input with custom thumb.

```css
.score-slider {
  flex: 1 1 auto;
  -webkit-appearance: none; appearance: none;
  height: 4px;
  border-radius: var(--r-pill);
  background: var(--color-surface-5);     /* tier 5 — highest */
  outline: none;
}
.score-slider::-webkit-slider-thumb {
  -webkit-appearance: none; appearance: none;
  width: 20px; height: 20px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  border: none;
  transition: transform var(--dur-1) var(--ease-emphasized);
}
.score-slider::-webkit-slider-thumb:active { transform: scale(1.25); }
.score-slider::-moz-range-thumb {
  width: 20px; height: 20px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  border: none;
}
```

### 9.3 Skeleton (`.skeleton`)

Loading placeholder. Shimmer animation.

```css
.skeleton {
  background: linear-gradient(90deg,
    var(--color-surface-2) 25%,
    var(--color-surface-3) 50%,
    var(--color-surface-2) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  border-radius: var(--r-sm);             /* 12px — matches anime card cover */
}
```

### 9.4 Empty state (`.empty-state`)

Centered, generous padding, icon + title + description.

```css
.empty-state {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: var(--sp-3);
  padding: var(--sp-10) var(--sp-6);      /* 40px 24px */
  text-align: center;
}
.empty-state__icon {
  width: 72px; height: 72px;
  border-radius: 50%;
  background: var(--color-surface-2);
  display: flex; align-items: center; justify-content: center;
  color: var(--color-text-muted);
}
.empty-state__title {
  margin: 0;
  font-size: var(--fs-h3);                /* 18px */
  font-weight: 700;
  color: var(--color-text);
}
.empty-state__desc {
  margin: 0;
  font-size: var(--fs-body);              /* 14px */
  color: var(--color-text-muted);
  max-width: 30ch;
  line-height: 1.5;
}
```

---

## 10. Component cheatsheet

```
BUTTONS
  .btn-filled       52px / pill / primary bg / primary-fg text / brand-tinted micro-shadow
  .btn-outlined     52px / pill / transparent / 1px outline-variant / hover → primary border
  .filter-btn       ~44px / pill / surface-2 → surface-3 hover → primary-container active
  .sort-btn         ~40px / pill / transparent / outline-variant border / chevron rotates

CARDS
  .anime-card       aspect 2:3 cover / 12px radius / surface-2 fallback / 12px title 2-line clamp / 11px meta
  .settings-card    surface-2 / 16px radius / overflow hidden

CHIPS
  .fchip                    8px 14px / pill / surface-3 → primary-container
  .active-filter-chip       6px 6px 6px 14px / pill / primary-container / chipIn 300ms
  .filter-flat-tab          10px 16px / pill / transparent → surface-4 hover → primary active

SEARCH BAR
  .searchbar        52px expanded, 44px collapsed / pill / surface-1 → surface-3 focus / no border

BOTTOM NAV
  .bottomnav        64px / 28px radius / surface-3 / 16px from edges / soft shadow stack
  .bottomnav__item  48px / pill / row layout (icon beside label) / label only on active

FILTER SHEET
  .filter-sheet     28px top corners / surface-2 / 85% max-height / translateY 100% → 0
  .filter-view-toggle  segmented control in sheet header (32×32 buttons)
  .facc__btn        12px 12px / 12px radius / surface-3 → primary-container / chevron rotates 180°
  .filter-flat-tabs  surface-3 container, 16px radius, horizontal scroll

SEGMENTED BUTTONS (all share the same pattern)
  .source-toggle    2 segments (AniList/Extension), in topbar, fades on collapse
  .theme-toggle     2 segments (Dark/Light), in settings
  .filter-view-toggle  2 icon segments (accordion/flat), in sheet header

DROPDOWN
  .sort-dropdown    surface-4 / 16px radius / 4px padding / popover shadow / dropdownIn 200ms
  .sort-dropdown__item  10px 12px / 12px radius / surface-5 hover / primary text on active
```

---

*Last updated: design system documentation pass.*
