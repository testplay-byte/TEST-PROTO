# docs/design-systems/material-3-expressive/typography.md

> M3 type scale, font family, weights, line-heights, and letter-spacing rules used by the `search-page` prototype. Every value here is copied from `prototypes/search-page/styles.css`.

---

## 1. Font family

```css
body {
  font-family: "Roboto", "Inter", -apple-system, BlinkMacSystemFont,
               "Segoe UI", Roboto, sans-serif;
}
```

- **Roboto first** — Material's native typeface. Loaded by name if available.
- **Inter second** — geometric sans fallback that reads cleanly at small sizes.
- **System stack** after that (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`) — what gets used on most platforms in practice. The system stack ensures the UI never falls back to a serif or a monospace font.
- **No web font is loaded over the network.** The prototype intentionally relies on system-installed Roboto/Inter. Don't add a `<link>` to Google Fonts; the design works without it and the page stays fast.

### Anti-aliasing

Always enable both axes:

```css
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

Without this, light-on-dark text in Roboto/Inter looks too thin on macOS.

---

## 2. Type scale (the 9 tokens)

M3 Expressive uses a **9-step scale**. Sizes are absolute pixels (not rem) because the prototype runs inside a fixed 390 × 844 device frame and we want pixel-perfect control.

| Token           | Size   | Used for                                                                  |
|-----------------|--------|---------------------------------------------------------------------------|
| `--fs-display`  | 32px   | Screen title when expanded (e.g. "Search" / "Settings" header).           |
| `--fs-h1`       | 26px   | Filter sheet title ("Filters").                                           |
| `--fs-h2`       | 22px   | Title when **collapsed** on scroll (display shrinks to h2).               |
| `--fs-h3`       | 18px   | Empty-state title, sidepanel title.                                       |
| `--fs-body-l`   | 16px   | Search input text, recent-item text, setting-row title, screeninfo name.  |
| `--fs-body`     | 14px   | Body text (default). Sort dropdown items, btn-outlined label.             |
| `--fs-body-s`   | 13px   | Status bar time, filter button label, accordion button label, recent title. |
| `--fs-label`    | 12px   | Chips, badges, setting-row description, recent-toggle, mini-bar labels.   |
| `--fs-label-s`  | 11px   | Card meta (episodes · year), sort dropdown count, settings-group label, kvlist. |

### The CSS

```css
:root {
  --fs-display: 32px;
  --fs-h1:      26px;
  --fs-h2:      22px;
  --fs-h3:      18px;
  --fs-body-l:  16px;
  --fs-body:    14px;
  --fs-body-s:  13px;
  --fs-label:   12px;
  --fs-label-s: 11px;
}
```

`body` defaults to `--fs-body` (14px). Everything else is set explicitly — don't rely on `em` cascade. Pixel values everywhere.

---

## 3. Font weights

Five weights see active use. Roboto/Inter both support all of them.

| Weight | Token in CSS         | Used for                                                                    |
|--------|----------------------|------------------------------------------------------------------------------|
| 400    | (default, no rule)   | Body text, descriptions, input text.                                         |
| 500    | `font-weight: 500`   | Sort dropdown items, recent-item text, score value.                          |
| 600    | `font-weight: 600`   | Buttons, chips, labels, badges, recent-toggle, sidepanel tags.               |
| 700    | `font-weight: 700`   | Titles (display/h1/h2/h3), active nav label, count number, group label.      |

There's no `300` (light) or `800` (extra-bold) in the system. If you find yourself wanting one, you're probably misclassifying the text — pick from 400/500/600/700.

### Mapping to M3 type roles

| M3 type role       | Size token     | Weight | Letter-spacing      |
|--------------------|----------------|--------|---------------------|
| Display            | `--fs-display` | 700    | `-.02em`            |
| Headline (h1)      | `--fs-h1`      | 700    | `-.02em`            |
| Title (h2/h3)      | `--fs-h2/h3`   | 700    | `-.01em` to `-.005em` |
| Body large         | `--fs-body-l`  | 400–500| 0                   |
| Body               | `--fs-body`    | 400    | 0                   |
| Body small         | `--fs-body-s`  | 500–600| 0                   |
| Label              | `--fs-label`   | 600    | 0                   |
| Label small        | `--fs-label-s` | 700    | `+.08em` (uppercase) |

---

## 4. Letter-spacing rules

M3 has two letter-spacing regimes. Get this right — it's the difference between "looks designed" and "looks wrong."

### Negative letter-spacing for headlines

Display and headline text is set with **negative** tracking. Larger text has more space between glyphs by default; tightening it improves readability and gives the heading a "tighter, more confident" feel.

```css
.topbar__title         { letter-spacing: -.02em; }  /* display 32 / h2 22 */
.filter-sheet__title   { letter-spacing: -.02em; }  /* h1 26 */
.sidepanel__title      { letter-spacing: -.01em; }  /* h3 18 */
.content__label        { letter-spacing: -.005em; } /* body-large 16 */
.anime-card__title     { letter-spacing: -.005em; } /* label 12 but tight */
```

Rule of thumb: **the larger the size, the more negative the tracking.** 32px → `-0.02em`. 16px → `-0.005em`. Below 14px, no tracking (0).

### Positive letter-spacing for overlines/eyebrows

Small uppercase labels get **positive** tracking + `text-transform: uppercase`. This is the M3 "overline" pattern.

```css
.sidepanel__head        { font-size: 10px;  font-weight: 700;
                          text-transform: uppercase; letter-spacing: .1em; }
.settings-group__label  { font-size: var(--fs-label-s); font-weight: 700;
                          text-transform: uppercase; letter-spacing: .08em; }
.recent-title           { font-size: var(--fs-body-s); font-weight: 700;
                          text-transform: uppercase; letter-spacing: .02em; }
.sidepanel__badge       { font-size: 10px; font-weight: 700;
                          text-transform: uppercase; letter-spacing: .1em; }
.anime-card__score      { letter-spacing: .01em; }   /* small score badge */
.anime-card__meta       { letter-spacing: .01em; }   /* card meta line */
```

Tracking ranges:
- `.02em` — for short uppercase labels at body-small size.
- `.08em` — for label-small uppercase (settings group label).
- `.1em` — for tiny 10px uppercase eyebrows (sidepanel heads, badge).

### When NOT to apply letter-spacing

- Body text (`--fs-body` and `--fs-body-l`) — leave at 0.
- Tabular numbers — leave at 0 and use `font-variant-numeric: tabular-nums` instead. Examples: clock, battery %, score value, mini-bar numbers, kvlist values.

---

## 5. Line-heights

```css
body             { line-height: 1.5; }   /* default for body, descriptions */
.anime-card__title { line-height: 1.35; }  /* slightly tighter for clamped 2-line titles */
.sidepanel__desc { line-height: 1.5; }
.screeninfo__desc { line-height: 1.5; }
.empty-state__desc { line-height: 1.5; }
```

Three values in active use:

| Line-height | Where                                              |
|-------------|----------------------------------------------------|
| 1.5         | Default body text, descriptions, sidepanel copy.   |
| 1.35        | Card titles (2-line clamp) — slightly tighter so the second line breathes. |
| 1.0         | Single-line tabular numbers (clock, battery).      |

Don't invent other ratios. If a multi-line description needs more air, increase the font-size, not the line-height.

---

## 6. Tabular numbers

Any number that updates or aligns in a column uses `font-variant-numeric: tabular-nums` so digits don't shift width:

```css
.statusbar__time   { font-variant-numeric: tabular-nums; }
.battery           { font-variant-numeric: tabular-nums; }
.mini-bar-num      { font-variant-numeric: tabular-nums; }
.kvlist__row b     { font-variant-numeric: tabular-nums; }
.score-value       { font-variant-numeric: tabular-nums; }
```

Without this, "12:05" → "12:06" causes a 1px layout shift as `5` and `6` have different widths in proportional fonts.

---

## 7. Text clamping (multi-line ellipsis)

For titles that must not wrap past N lines, use the WebKit line-clamp pattern:

```css
.anime-card__title {
  display: -webkit-box;
  -webkit-line-clamp: 2;            /* max 2 lines */
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

Always paired with `overflow: hidden` and (usually) a fixed line-height. The card title is the canonical example. Use 2 lines for titles, 1 line for nav labels.

### Single-line ellipsis

```css
.bottomnav__label,
.recent-item__text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

---

## 8. Text selection

Per repo-wide user preference (see [`docs/preferences.md`](../../preferences.md) §2), the entire prototype is `user-select: none`. Only `<input>` / `<textarea>` allow text entry. This is set globally on `body` and reinforced on `.device`:

```css
body   { user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; }
.device { user-select: none; -webkit-user-select: none; }
```

Don't override this on individual elements. The user hates drag-to-copy behavior.

---

## 9. Anti-patterns to avoid

- **Don't add a Google Fonts `<link>`.** Roboto/Inter are referenced by name; if they're not installed, the system stack takes over. Adding a network font breaks offline use and adds latency.
- **Don't use `rem` units for type.** The device is a fixed-pixel frame; rem scales with root font-size which can drift. Stick to `px`.
- **Don't mix tracking directions within a heading.** If a heading is uppercase + tracked-out, all of it is. If it's mixed case, it's tracked-in or zero.
- **Don't apply `font-weight: 300`.** There's no light weight in the system. Body text is 400; if 400 reads too heavy, switch font (not weight).
- **Don't tighten tracking on body text.** Negative tracking at 14px causes letters to collide. Only headlines get `-0.02em`.
- **Don't use `text-decoration: underline` on links.** M3 indicates links via color (`--color-primary`), not underlines. There are no real links in the prototype anyway.

---

## 10. Quick reference

```
DISPLAY     32px / 700 / -.02em        — screen title (expanded)
H1          26px / 700 / -.02em        — filter sheet title
H2          22px / 700 / -.02em        — screen title (collapsed)
H3          18px / 700 / -.01em        — section title, sidepanel title
BODY-L      16px / 400–500 / 0         — input text, list item title
BODY        14px / 400 / 0             — default body
BODY-S      13px / 500–600 / 0         — status bar, accordion, recent title (uppercase +.02em)
LABEL       12px / 600 / 0             — chips, badges, descriptions
LABEL-S     11px / 700 / +.08em upper  — settings group label, kvlist, card meta (+.01em)

LINE-HEIGHTS: 1.5 default, 1.35 clamped titles, 1.0 tabular numbers
WEIGHTS:      400, 500, 600, 700  (no 300, no 800)
FONT-FAMILY:  "Roboto", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
```

---

*Last updated: design system documentation pass.*
