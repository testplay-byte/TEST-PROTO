# docs/design-systems/material-3-expressive/spacing.md

> The 4px base grid and spacing tokens for the `search-page` prototype. Every value here is copied from `prototypes/search-page/styles.css`.

---

## 1. The 4px base grid

Everything in the M3 system is sized on a **4-pixel grid**. Spacing, padding, gaps, heights, radii — all multiples of 4. This is non-negotiable.

Why 4?

- It's small enough to express fine differences (4 vs 8 vs 12 reads as "tight / normal / loose").
- It's the smallest unit that comfortably rounds to crisp pixel boundaries at all DPRs (1x, 2x, 3x).
- 4 is what Material has shipped since M2; M3 inherits it.

Half-steps (2px) are **not allowed** in the spacing system. If you find yourself reaching for 2px, use a hairline border (`1px solid var(--color-outline-variant)`) instead.

### The 8 tokens

```css
:root {
  --sp-1:  4px;
  --sp-2:  8px;
  --sp-3: 12px;
  --sp-4: 16px;
  --sp-5: 20px;
  --sp-6: 24px;
  --sp-8: 32px;
  --sp-10: 40px;
}
```

The numbering (`sp-1`, `sp-2`, `sp-3` …) refers to **the multiplier on the 4px base**, so `sp-3 = 12px`, `sp-6 = 24px`, `sp-10 = 40px`. We skip `sp-7` (28px) and `sp-9` (36px) because they aren't used in the prototype — the scale is intentionally sparse to force consistent choices.

| Token    | px    | When to use                                                                                          |
|----------|-------|------------------------------------------------------------------------------------------------------|
| `--sp-1` | 4px   | Hairline gaps inside a tight group: between an icon and label inside a chip, between two stacked rows in a kvlist. |
| `--sp-2` | 8px   | Default inner gap: between an icon and label in a button, between rows in a list, padding inside a tray. |
| `--sp-3` | 12px  | Default inner padding for cards, between an icon and text in a search bar, the gap inside a recent-item. |
| `--sp-4` | 16px  | Card padding, sheet header padding, sidepanel padding, gap between major controls in a row.          |
| `--sp-5` | 20px  | Settings-group bottom margin, sidepanel padding (vertical).                                          |
| `--sp-6` | 24px  | Stage padding (desktop), sort-dropdown horizontal padding, button horizontal padding (`btn-outlined`). |
| `--sp-8` | 32px  | Major section breaks, empty-state vertical padding.                                                  |
| `--sp-10`| 40px  | Empty-state padding, the largest vertical air in the system.                                         |

---

## 2. When to use each token

### `--sp-1` (4px) — hairline gaps

Only for sub-8px gaps between tightly grouped elements. Almost always horizontal.

```css
.active-filter-chip      { gap: 6px; }   /* ← 6px is a violation, but kept for legacy; prefer 4 or 8 */
.bottomnav__item         { gap: 6px; }   /* same */
.filter-view-toggle      { gap: 4px; }   /* correct: 4px between two toggle buttons */
.recent-toggle           { gap: 4px; }   /* correct: 4px between icon and label */
```

The 4px and 6px values are visually nearly identical; prefer 4px for new components.

### `--sp-2` (8px) — default inner gap

The "normal" gap. Between an icon and a label inside a button. Between rows of a list. Padding inside a tray.

```css
.tray                  { padding: var(--sp-2) var(--sp-3); }
.topbar                { gap: var(--sp-2); }
.quick-row             { gap: var(--sp-2); }
.filter-sheet__actions { gap: var(--sp-3); }
```

### `--sp-3` (12px) — default inner padding

The "normal" padding inside a card or interactive row. The gap between a leading icon and its text in a search bar.

```css
.searchbar        { gap: var(--sp-3); padding: 0 var(--sp-2) 0 var(--sp-4); }
.recent-item      { gap: var(--sp-3); padding: var(--sp-3) var(--sp-2); }
.setting-row      { padding: var(--sp-4) var(--sp-4); gap: var(--sp-3); }
```

### `--sp-4` (16px) — card / section padding

The padding inside a card or sheet header. The horizontal margin of the floating bottom nav (it sits 16px from each edge).

```css
.filter-sheet__header  { padding: var(--sp-4) var(--sp-4) var(--sp-2); }
.filter-sheet__body    { padding: 0 var(--sp-4) var(--sp-4); }
.bottomnav             { left: 16px; right: 16px; bottom: 16px; }
.sidepanel             { padding: 20px; gap: 16px; }
```

### `--sp-5` (20px) — section spacing

Used for bottom margins between settings groups and for vertical padding of the sidepanel.

```css
.settings-group    { margin-bottom: var(--sp-5); }
.sidepanel         { padding: 20px; }
```

### `--sp-6` (24px) — stage padding, button width

The desktop stage padding (24px around the device). The horizontal padding of an outlined button.

```css
.stage             { padding: 24px; gap: 24px; }
.btn-outlined      { padding: 0 var(--sp-6); }
```

### `--sp-8` (32px) — major section break

Larger vertical air. Currently only used in the empty-state padding scale (combined with `--sp-10` and `--sp-6`).

### `--sp-10` (40px) — the largest air

The biggest vertical spacing in the system. Reserved for empty states where you want the content to feel centered and isolated.

```css
.empty-state       { padding: var(--sp-10) var(--sp-6); }
```

---

## 3. Spacing rhythm

The rhythm of the prototype follows a "tight inside, loose outside" pattern:

1. **Tightest (4–8px)** — between icon and label inside a chip / button / nav item.
2. **Normal (12px)** — between elements inside a card (icon → text → meta), between rows in a list.
3. **Card padding (16px)** — between a card's edge and its content.
4. **Section break (20–24px)** — between stacked cards or between a tray and the content around it.
5. **Page air (32–40px)** — empty states and stage-level breathing room.

### Visual ladder

```
[card padding 16px]
  ┌─────────────────────────┐
  │ [inner gap 12px]        │
  │   icon  text            │
  │        meta             │
  │                         │
  │ [hairline 4px between rows]
  │   icon  text            │
  └─────────────────────────┘
[24px section break]
  ┌─────────────────────────┐
  │ next card               │
  └─────────────────────────┘
```

### Vertical vs horizontal

In most cases vertical and horizontal padding are equal (`padding: var(--sp-4)`), but there are deliberate exceptions:

- **Search bar**: `padding: 0 var(--sp-2) 0 var(--sp-4)` — no vertical padding (height is fixed at 52–56px), asymmetric horizontal (more on the leading edge for the icon).
- **Trays**: `padding: var(--sp-2) var(--sp-3)` — tighter vertical, looser horizontal.
- **Bottom nav items**: `padding: 0 8px` — horizontal only.

When you break symmetry, do it intentionally. The default is `padding: var(--sp-N)` on all sides.

---

## 4. Component-specific spacing cheatsheet

| Component                | Padding / gap                                                        |
|--------------------------|----------------------------------------------------------------------|
| Search bar               | `0 8px 0 16px` (no vertical, asymmetric horizontal)                  |
| Filter button            | `10px 18px 10px 14px` (asymmetric — leading icon needs less room)   |
| Sort button              | `10px 14px`                                                          |
| Filter chip (`.fchip`)   | `8px 14px`                                                           |
| Active filter chip       | `6px 6px 6px 14px` (room for the trailing X button)                  |
| Card title (anime card)  | no padding; gap `6px` between cover, title, meta                     |
| Recent item              | `var(--sp-3) var(--sp-2)` (12px vertical, 8px horizontal)            |
| Setting row              | `var(--sp-4) var(--sp-4)` (16px all sides)                          |
| Bottom nav               | `0 8px` (8px horizontal inside the bar)                              |
| Bottom nav item          | `0 8px` (8px horizontal inside each pill)                            |
| Filter sheet header      | `var(--sp-4) var(--sp-4) var(--sp-2)` (16/16/8)                      |
| Filter sheet body        | `0 var(--sp-4) var(--sp-4)` (0/16/16)                                |
| Filter sheet actions     | `var(--sp-2) var(--sp-4) var(--sp-4)` (8/16/16)                      |
| Accordion button         | `var(--sp-3) var(--sp-3)` (12/12)                                    |
| Accordion content inner  | `var(--sp-2) var(--sp-2) var(--sp-3)` (8/8/12)                       |

---

## 5. Gaps (flex / grid)

Use `gap` instead of margins wherever possible — it's cleaner and doesn't collapse.

```css
.results-grid      { gap: var(--sp-3) var(--sp-2); }   /* 12px row gap, 8px col gap */
.filter-chips-wrap { gap: var(--sp-2); }               /* 8px between chips */
.recent-list       { gap: 2px; }                       /* hairline between items */
.quick-row         { gap: var(--sp-2); }
.topbar__row       { gap: var(--sp-2); }
.stage             { gap: 24px; }
```

The 2px gap on `.recent-list` is a deliberate exception — items are visually grouped, and a larger gap would break the list rhythm. Document exceptions in a comment when you introduce them.

---

## 6. Bottom padding for floating nav

The content area has `padding: var(--sp-2) var(--sp-1) 110px` — that **110px bottom padding** is calculated to clear the floating bottom nav (64px height + 16px from the bottom + ~30px breathing room above the nav):

```
content bottom padding = nav height (64) + nav offset (16) + air (~30) = 110px
```

If you change the bottom nav height or its offset, recalculate this number.

---

## 7. Anti-patterns

- **No `2px` spacing.** Use a 1px border instead, or jump to `--sp-1` (4px).
- **No `10px` padding.** Use `--sp-2` (8px) or `--sp-3` (12px). 10px is the worst of both — neither tight nor loose.
- **No `6px` gaps in new components.** It exists in legacy (`.active-filter-chip`, `.bottomnav__item`) but new components should pick 4 or 8.
- **No margins where `gap` works.** Margins collapse and compose poorly; `gap` doesn't.
- **No `padding: 5px` / `7px` / `9px`.** Always a multiple of 4 (or, in the rare legacy case, a multiple of 2 like 6px).
- **Don't reuse `--sp-N` to mean something other than spacing.** Don't use `--sp-3` as a font size or a radius — those have their own scales.

---

## 8. Quick reference

```
--sp-1   4px    hairline gap
--sp-2   8px    default inner gap (icon ↔ label, list row gap)
--sp-3  12px    default inner padding (card padding, searchbar gap)
--sp-4  16px    card padding, sheet header padding, bottom nav edge offset
--sp-5  20px    section spacing, sidepanel padding
--sp-6  24px    stage padding, button horizontal padding
--sp-8  32px    major section break
--sp-10 40px    largest air (empty-state padding)

CONTENT BOTTOM PADDING (clears floating nav): 110px
DEVICE FRAME SIZE: 390 × 844 px
STATUS BAR HEIGHT: 36px
```

---

*Last updated: design system documentation pass.*
