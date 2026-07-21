# docs/design-systems/material-3-expressive/layout-patterns.md

> Screen-level layout patterns used in the `search-page` prototype: collapsing header, floating bottom nav, section trays, recent-searches collapse, blur gradient on scroll. Every value is copied from `prototypes/search-page/styles.css` and `prototypes/search-page/script.js`.

This doc covers **how components compose into screen-level patterns**. For component specs (heights, radii, tokens), see [`components.md`](./components.md). For the motion values referenced here, see [`motion.md`](./motion.md).

---

## 1. Collapsing header on scroll

The signature pattern of the search screen. When the user scrolls the content area down past 20px, the topbar collapses: the title shrinks, the search bar shrinks and slides next to the title, the source toggle fades out, and the filters/sort buttons slide outward in opposite directions. Scroll back to top and everything expands again.

### The trigger (JS)

```js
// In script.js
var contentView = document.querySelector('[data-view="search"] .content');
var topbar      = document.querySelector('[data-view="search"] .topbar');
var collapseThreshold = 20;  // px scrolled before collapsing

contentView.addEventListener("scroll", function () {
  var st = contentView.scrollTop;
  if (st > collapseThreshold && !topbar.classList.contains("is-collapsed")) {
    topbar.classList.add("is-collapsed");
  } else if (st <= collapseThreshold && topbar.classList.contains("is-collapsed")) {
    topbar.classList.remove("is-collapsed");
  }
});
```

- **Threshold**: 20px. Small enough to feel responsive, large enough that a tiny accidental scroll doesn't collapse the header.
- **Trigger**: the `.content` element's `scroll` event (not `window`), because only the content scrolls inside the device frame.
- **Class**: `.is-collapsed` is added to/removed from `.topbar`. Everything else is driven by CSS selectors that target descendants or siblings.

### The choreography (CSS)

Five things happen in parallel, all over 300ms with `--ease-emphasized`:

| Element                | Expanded state                          | Collapsed state                                          |
|------------------------|-----------------------------------------|----------------------------------------------------------|
| `.topbar` (container)  | `max-height: 220px`, `padding: 8px 12px 4px`, `gap: 8px` | `max-height: 56px`, `padding-top: 8px`, `padding-bottom: 4px`, `gap: 4px` |
| `.topbar__title`       | `font-size: 32px` (`--fs-display`), `flex: 1 1 auto` | `font-size: 22px` (`--fs-h2`), `flex: 0 0 auto`, `margin-right: 4px` |
| `.searchbar`           | `height: 56px`, `flex: 1 1 100%` (full width, wraps to next line) | `height: 44px`, `flex: 1 1 auto` (grows to fill the row next to the title) |
| `.source-toggle`       | visible, `width: auto`, `opacity: 1`    | `opacity: 0`, `transform: scale(.8)`, `width: 0`, `pointer-events: none` |
| `.quick-row` (sibling) | visible, `max-height: 60px`              | `opacity: 0`, `max-height: 0`, `padding: 0`, `margin: 0`, `visibility: hidden` |
| `.quick-row .filter-btn` | visible                                | `transform: translateX(-200%)`, `opacity: 0`             |
| `.quick-row .sort-btn` | visible                                 | `transform: translateX(200%)`, `opacity: 0`              |

### Why this choreography works

1. **The title stays visible.** It shrinks but never disappears — the user always knows what screen they're on. This is the only element that persists across the collapse.
2. **The search bar moves *next to* the title, not below it.** This is the key insight: in the expanded state, the title and search bar are stacked vertically (title row, then search bar row). In the collapsed state, they're side-by-side in a single row. The search bar's `flex` changes from `1 1 100%` (forces wrap) to `1 1 auto` (shares the row).
3. **The source toggle fades AND scales AND shrinks width to 0.** Three properties in parallel so it doesn't leave a visual "ghost" — by the time opacity hits 0, the width is also 0 so there's no empty space.
4. **Filters slide LEFT, sort slides RIGHT.** They part outward, reinforcing the collapse. The `200%` translate is large enough to push them entirely off-screen (not just to the edge).
5. **The whole `.quick-row` collapses** (max-height 0, padding 0, margin 0, visibility hidden) so there's no leftover space.

### The CSS (key rules)

```css
.topbar {
  padding: var(--sp-2) var(--sp-3) var(--sp-1);
  display: flex; flex-direction: column; gap: var(--sp-2);
  flex: 0 0 auto;
  background: var(--color-bg);
  transition:
    padding    var(--dur-3) var(--ease-emphasized),
    gap        var(--dur-3) var(--ease-emphasized),
    max-height var(--dur-3) var(--ease-emphasized);
  max-height: 220px;
  overflow: hidden;
}

.topbar.is-collapsed {
  padding-top: var(--sp-2);
  padding-bottom: var(--sp-1);
  gap: var(--sp-1);
  max-height: 56px;
}

.topbar.is-collapsed .topbar__title {
  font-size: var(--fs-h2);          /* 32px → 22px */
  flex: 0 0 auto;
  margin-right: var(--sp-1);
}

.topbar.is-collapsed .searchbar {
  height: 44px;
  flex: 1 1 auto;                   /* grows to share the row with the title */
}
.topbar.is-collapsed .searchbar input { font-size: var(--fs-body); }

.topbar.is-collapsed .source-toggle {
  opacity: 0;
  transform: scale(.8);
  pointer-events: none;
  width: 0;
  overflow: hidden;
  margin-left: 0;
}

/* quick-row is a SIBLING of topbar — use the general sibling combinator */
.topbar.is-collapsed ~ .quick-row {
  opacity: 0 !important;
  max-height: 0 !important;
  padding: 0 !important;
  margin: 0 !important;
  overflow: hidden !important;
  pointer-events: none !important;
  visibility: hidden;
}
.topbar.is-collapsed ~ .quick-row .filter-btn {
  transform: translateX(-200%);
  opacity: 0;
}
.topbar.is-collapsed ~ .quick-row .sort-btn {
  transform: translateX(200%);
  opacity: 0;
}
```

### The `!important` exception

The `!important` flags on `.topbar.is-collapsed ~ .quick-row` are deliberate — they override the inline `transition: max-height` on `.quick-row` itself, ensuring the collapse happens immediately when the topbar collapses (rather than waiting for the quick-row's own slower transition). Without `!important`, the quick-row would lag behind the rest of the collapse.

This is one of the very few `!important` usages in the codebase. Document it if you copy the pattern.

---

## 2. Floating bottom navigation

The bottom nav is `position: absolute` inside the device frame, with **16px of padding from every edge** (left, right, bottom). It floats over the scrolling content rather than sitting in the normal flow.

```css
.bottomnav {
  position: absolute;
  left: 16px; right: 16px; bottom: 16px;
  height: 64px;
  background: var(--color-surface-3);
  border-radius: var(--r-xl);          /* 28px — the most rounded radius in the system */
  border: none;
  display: flex; align-items: center;
  padding: 0 8px;
  z-index: 10;
  box-shadow:
    0 8px 24px rgba(0,0,0,.35),
    0 2px 8px  rgba(0,0,0,.2);
}
```

### Why 16px from every edge?

- **16px matches `--sp-4`** (the card-padding token), so the nav aligns with the rest of the screen's horizontal rhythm.
- **16px of bottom clearance** gives the nav room to "float" above the content without touching the device's bottom edge — important on devices with home indicators or gesture areas.
- **Symmetric left/right** keeps the nav centered, which matters because the device frame is exactly 390px wide and asymmetric padding would look wrong.

### Why 28px radius (`--r-xl`)?

- 28px is the largest radius in the system (`--r-xs: 8`, `--r-sm: 12`, `--r-md: 16`, `--r-lg: 20`, `--r-xl: 28`).
- The nav is the most prominent floating element, so it gets the most rounded shape — this visually communicates "I am a separate, elevated thing."
- 28px on a 64px-tall bar gives a stadium/pill-like shape, which is the M3 Expressive aesthetic.

### Why a shadow on the nav (when nothing else has one)?

The nav floats over **scrolling content that can be arbitrary images** (anime cover art in the results grid). Tonal elevation alone isn't enough to guarantee readability against every possible image color. The shadow stack:

```
0 8px 24px rgba(0,0,0,.35)   ← soft, wide shadow for depth
0 2px 8px  rgba(0,0,0,.2)    ← tighter, darker shadow for crisp edge
```

...gives the nav enough separation to read against bright cover artwork. This is the **only UI element** with a real shadow — see [`elevation.md`](./elevation.md) §4 for the full exception list.

### Content bottom padding (clears the nav)

The content area has `padding: var(--sp-2) var(--sp-1) 110px` — that **110px bottom padding** is calculated to clear the floating nav:

```
110px = nav height (64) + nav offset (16) + air above nav (~30)
```

Without this, the last row of cards would be hidden behind the nav. If you change the nav height or offset, recalculate.

---

## 3. Section trays

The content area is divided into **trays** — separate tonal-background sections that group related content. Each tray uses `--color-surface-1` (tier 1) for its background, sitting one tier above the screen's `--color-bg`.

```css
.tray {
  background: var(--color-surface-1);
  border-radius: var(--r-lg);          /* 20px */
  padding: var(--sp-2) var(--sp-3);    /* 8px 12px */
  margin: 0 0 var(--sp-2);             /* 8px bottom margin between trays */
}
.tray--recent  { padding: var(--sp-2) var(--sp-3); }
.tray--results { padding: var(--sp-2) var(--sp-3); }
```

### Why trays?

1. **Visual grouping.** Without trays, the recent-searches list and the results grid would visually merge. The tray backgrounds draw a clear boundary.
2. **Tonal hierarchy.** The trays sit one tier above the screen background, so they read as "content containers" without needing borders or shadows.
3. **Generous radius.** 20px (`--r-lg`) is large enough to read as "intentional shape" but not so large that it eats into the content area.

### Tray types in the prototype

| Tray class            | Contents                                                  |
|-----------------------|-----------------------------------------------------------|
| `.tray.tray--recent`  | Recent searches list (only visible when no query/filters) |
| `.tray.tray--results` | Content header (label + count) + results grid             |

Both share the same padding. The `--recent` and `--results` modifiers exist for future styling differentiation; currently they're identical.

### Tray margin rhythm

```css
.tray { margin: 0 0 var(--sp-2); }   /* 8px bottom margin */
```

Only 8px between trays — tight, so the eye reads them as a sequence rather than as separate sections. If you want more breathing room, use `--sp-3` (12px), but don't exceed that or the screen feels sparse.

---

## 4. Recent searches collapse toggle

The recent-searches section has its own collapse toggle, independent of the header collapse. The user can hide the recent list without scrolling.

### Structure

```html
<div class="recent-section tray tray--recent" id="recentSection">
  <div class="recent-head">
    <div class="recent-head__left">
      <span class="recent-title">Recent searches</span>
      <button class="recent-toggle" id="recentToggle">
        <span class="recent-toggle__icon"><svg>...</svg></span>
      </button>
    </div>
    <div class="recent-head__right" id="recentHeadRight">
      <!-- "Clear all" button (when expanded) or "Show" button (when collapsed) -->
    </div>
  </div>
  <div class="recent-list" id="recentList">
    <!-- recent items -->
  </div>
</div>
```

### The toggle behavior

```js
// In script.js
var recentCollapsed = false;
function toggleRecent() {
  recentCollapsed = !recentCollapsed;
  var list = document.getElementById("recentList");
  var toggle = document.getElementById("recentToggle");
  var headRight = document.getElementById("recentHeadRight");
  list.classList.toggle("is-collapsed", recentCollapsed);
  toggle.classList.toggle("is-collapsed", recentCollapsed);
  if (recentCollapsed) {
    // When collapsed: show "Show" button on the right
    headRight.innerHTML = '<button class="recent-show" id="recentShow">Show</button>';
    document.getElementById("recentShow").addEventListener("click", toggleRecent);
  } else {
    // When expanded: show "Clear all" button
    headRight.innerHTML = '<button class="recent-clear" id="recentClear">Clear all</button>';
    document.getElementById("recentClear").addEventListener("click", function () {
      clearRecent(); renderRecent();
    });
  }
}
```

### The CSS

```css
.recent-list {
  display: flex; flex-direction: column; gap: 2px;
  overflow: hidden;
  transition:
    max-height var(--dur-3) var(--ease-emphasized),
    opacity    var(--dur-2) var(--ease-standard);
  max-height: 500px;
}
.recent-list.is-collapsed {
  max-height: 0;
  opacity: 0;
}

.recent-toggle__icon {
  transition: transform var(--dur-2) var(--ease-emphasized);
  display: flex; align-items: center;
}
.recent-toggle.is-collapsed .recent-toggle__icon {
  transform: rotate(-90deg);              /* chevron points right when collapsed */
}
```

### How it works

- **Expanded state**: the list has `max-height: 500px` (enough for ~12 items) and the chevron points down. The right side shows a "Clear all" button.
- **Collapsed state**: `max-height: 0` + `opacity: 0` (the list shrinks and fades simultaneously), the chevron rotates -90° to point right, and the right side swaps to a "Show" button.
- **The right-side button swap** is done via JS innerHTML replacement. The CSS doesn't animate the swap — it's instant. (Animating it would require a state machine; not worth the complexity.)

### Why `max-height` instead of `display: none`?

`display: none` can't be transitioned — the element would just disappear instantly. `max-height: 0` with `overflow: hidden` lets us animate the collapse smoothly. The `500px` upper bound is generous enough to cover the longest possible recent list (12 items × ~50px each = 600px, but we cap at 500 because lists that long are rare).

### Why both `max-height` AND `opacity`?

- `max-height` animates the *layout* collapse (the list shrinks vertically).
- `opacity` animates the *visibility* (the list fades out).

Running both in parallel (max-height at 300ms emphasized, opacity at 200ms standard) gives a more polished feel than either alone. The opacity finishes first, so by the time the list is fully invisible, it's still shrinking — the eye reads it as "fading away while collapsing."

---

## 5. Blur gradient on scroll

When the topbar collapses (see §1), a **blur + darkening gradient** fades in at the top of the content area. This masks the edge between the (now-collapsed) topbar and the scrolling content, so cards don't visibly "pop" under the topbar edge.

### The mechanism

```css
.content {
  flex: 1 1 auto; overflow-y: auto;
  padding: var(--sp-2) var(--sp-1) 110px;
  scrollbar-width: none;
  position: relative;                  /* required for the ::after to anchor */
}

.content::after {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 36px;
  z-index: 5;
  pointer-events: none;
  /* Darkening: strong at top, fades to transparent at bottom */
  background: linear-gradient(to bottom,
    var(--color-bg) 0%,
    color-mix(in srgb, var(--color-bg) 80%, transparent) 25%,
    color-mix(in srgb, var(--color-bg) 40%, transparent) 60%,
    transparent 100%);
  /* Blur: always applied, invisible until opacity > 0 */
  -webkit-backdrop-filter: blur(14px) saturate(1.3);
  backdrop-filter: blur(14px) saturate(1.3);
  opacity: 0;
  transition: opacity var(--dur-3) var(--ease-standard);
}

/* When topbar is collapsed (scrolled state): fade in the blur + darken */
.topbar.is-collapsed ~ .content::after {
  opacity: 1;
}
```

### How it works

1. **The `::after` pseudo-element** is a 36px-tall overlay at the very top of the `.content` area. It's always there, but invisible (opacity 0) by default.
2. **The background is a 4-stop linear gradient**: 100% bg color at top → 80% bg + 20% transparent at 25% → 40% bg + 60% transparent at 60% → fully transparent at 100%. This creates a smooth darkening that fades out at the bottom of the 36px strip.
3. **The `backdrop-filter: blur(14px) saturate(1.3)`** is always applied but invisible until the element has opacity. When opacity goes to 1, the blur kicks in and the scrolling content behind the strip gets blurred + saturated.
4. **The trigger**: `.topbar.is-collapsed ~ .content::after` uses the general sibling combinator. When `.topbar` gets the `.is-collapsed` class (added by JS on scroll), the adjacent `.content::after` fades in over 300ms.

### Why blur + darken instead of just darken?

- **Darken alone** would create a visible "smudge" at the top of the content — the user would see a dark band.
- **Blur alone** would let bright cover art bleed through and compete with the topbar.
- **Blur + darken together** gives a "frosted glass" effect: the content behind is blurred and darkened, so the topbar (which sits on top of the screen background) reads as a separate layer.

### Why 36px tall?

- Tall enough to cover the visual edge where cards meet the topbar (cards scroll under the topbar at this point).
- Short enough that it doesn't darken the first card too much — the gradient is fully transparent by 36px, so the first visible card art is unaffected.

### Why `pointer-events: none`?

So the overlay doesn't block taps on cards that scroll under it. The user can still tap a card even if part of it is behind the blur strip.

### The `saturate(1.3)` detail

The blur desaturates the content slightly (a known side effect of `backdrop-filter: blur()`). Adding `saturate(1.3)` compensates, keeping the blurred content's colors vivid. Without it, the blur strip looks washed-out.

---

## 6. Layout composition (the full screen)

Here's how all the patterns compose into the search screen, top to bottom:

```
┌─────────────────────────────────────────┐  ← .device (390×844)
│  status bar (36px, flex 0 0 auto)        │
├─────────────────────────────────────────┤
│  .screen (flex 1 1 auto, column)         │
│  ┌───────────────────────────────────┐   │
│  │ .topbar (collapses on scroll)     │   │  ← flex 0 0 auto
│  │   .topbar__row                    │   │
│  │     .topbar__title ("Search")     │   │
│  │     .source-toggle (fades)        │   │
│  │     .searchbar (moves beside title)│  │
│  └───────────────────────────────────┘   │
│  ┌───────────────────────────────────┐   │
│  │ .active-filters (chips row, hidden │   │  ← flex 0 0 auto
│  │   by default, max-height 0 → 44px) │   │
│  └───────────────────────────────────┘   │
│  ┌───────────────────────────────────┐   │
│  │ .quick-row (slides out on collapse)│   │  ← flex 0 0 auto
│  │   .filter-btn  .spacer  .sort-btn │   │
│  └───────────────────────────────────┘   │
│  ┌───────────────────────────────────┐   │
│  │ .content (flex 1 1 auto, scrolls)  │   │
│  │   ::after (blur gradient, fades in)│   │
│  │   .tray.tray--recent (collapsible) │   │
│  │   .tray.tray--results              │   │
│  │     .content__header               │   │
│  │     .results-grid (3-col cards)    │   │
│  │   [110px bottom padding]           │   │  ← clears floating nav
│  └───────────────────────────────────┘   │
│                                          │
│  ┌───────────────────────────────────┐   │
│  │ .bottomnav (absolute, 16px edges) │   │  ← floats above content
│  └───────────────────────────────────┘   │
│                                          │
│  .sheet-scrim + .filter-sheet (absolute, │  ← z-index 50/51, hidden by default
│    below the fold)                       │
└─────────────────────────────────────────┘
```

### Flex hierarchy

- `.device` is `display: flex; flex-direction: column`.
- `.statusbar` is `flex: 0 0 auto` (fixed height).
- `.screen` is `flex: 1 1 auto` (fills the rest).
- Inside `.screen`, the column is: `.topbar` (0 0 auto), `.active-filters` (0 0 auto), `.quick-row` (0 0 auto), `.content` (1 1 auto, scrolls), `.bottomnav` (absolute — out of flow).
- `.filter-sheet` and `.sheet-scrim` are absolute, so they overlay everything when visible.

### The `.view` wrapper

The search screen is one of multiple `.view` elements (search, settings). Only one is visible at a time (`.view--active`). Views are absolutely positioned (`position: absolute; inset: 0`) inside `.screen` so they can crossfade without affecting layout.

```css
.view {
  position: absolute; inset: 0;
  display: flex; flex-direction: column;
  opacity: 0;
  transform: translateX(8px);
  pointer-events: none;
  transition:
    opacity   var(--dur-3) var(--ease-emphasized-decel),
    transform var(--dur-3) var(--ease-emphasized-decel);
  overflow-y: auto;
}
.view--active {
  opacity: 1;
  transform: none;
  pointer-events: auto;
}
```

See [`motion.md`](./motion.md) §7 for the view-swap animation.

---

## 7. Settings screen layout

The settings view uses the same topbar + content structure, but simplified:

```html
<section class="view" data-view="settings">
  <div class="topbar">
    <h1 class="topbar__title">Settings</h1>
    <!-- no source toggle, no search bar, no quick-row -->
  </div>
  <div class="content">
    <div class="settings-group">
      <div class="settings-group__label">Appearance</div>
      <div class="settings-card">
        <div class="setting-row">
          <div class="setting-row__info">
            <span class="setting-row__title">Theme</span>
            <span class="setting-row__desc">Switch between dark and light mode</span>
          </div>
          <div class="theme-toggle">...</div>
        </div>
      </div>
    </div>
    <div class="settings-group">
      <div class="settings-group__label">About</div>
      <div class="settings-card">
        <div class="setting-row setting-row--static">
          <div class="setting-row__info">
            <span class="setting-row__title">Search Page</span>
            <span class="setting-row__desc">Prototype v3 · Material 3 Expressive · AniList API</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

- No source toggle, no search bar, no quick-row — the topbar holds only the title.
- Content is a list of `.settings-group` blocks, each with a label + a `.settings-card`.
- Each card contains one or more `.setting-row`s (info on the left, control on the right).
- The topbar here doesn't collapse on scroll (the JS only attaches the scroll listener to the search view's `.content`).

---

## 8. Anti-patterns

- **Don't make the topbar collapse on settings.** The collapse is search-specific (it makes sense because the search bar takes up space the user wants back). Settings has no search bar; collapsing would just shrink the title for no benefit.
- **Don't add more trays than necessary.** Two trays (recent + results) is enough. Three starts to feel like a dashboard.
- **Don't animate the bottom-nav position.** It's `position: absolute` and stays put. If you want it to hide on scroll, animate opacity or transform, not position.
- **Don't use `position: sticky` for the topbar.** The topbar is `flex: 0 0 auto` in the column flow, so it naturally stays at the top while `.content` scrolls. `position: sticky` would fight the flex layout.
- **Don't put the blur gradient on the topbar itself.** It goes on `.content::after` because the blur should apply to *content scrolling under the topbar*, not to the topbar.
- **Don't forget the 110px content bottom padding** if you change the bottom nav height or offset. Cards will be hidden behind the nav.
- **Don't use `display: none` for the recent-list collapse.** Use `max-height: 0` + `overflow: hidden` so the collapse animates (see §4).

---

## 9. Layout cheatsheet

```
DEVICE                  390 × 844 px, position: relative
STATUS BAR              36px, flex 0 0 auto
SCREEN                  flex 1 1 auto, column, position: relative
VIEW (search/settings)  position: absolute, inset: 0, opacity 0/1, translateX 8px/0

TOPBAR (expanded)       max-height 220px, padding 8px 12px 4px, gap 8px
TOPBAR (collapsed)      max-height 56px, padding 8px 12px 4px, gap 4px
  title (expanded)      32px (--fs-display), flex 1 1 auto
  title (collapsed)     22px (--fs-h2), flex 0 0 auto, margin-right 4px
  searchbar (expanded)  56px height, flex 1 1 100% (wraps)
  searchbar (collapsed) 44px height, flex 1 1 auto (shares row)
  source-toggle         fades opacity 0 + scale .8 + width 0 on collapse

QUICK-ROW (sibling)     slides out: filter-btn translateX(-200%), sort-btn translateX(200%)
                        whole row: max-height 0, padding 0, visibility hidden

CONTENT                 flex 1 1 auto, overflow-y auto, padding 8px 4px 110px
  ::after (blur strip)  36px tall, top 0, blur(14px) saturate(1.3), opacity 0 → 1 on collapse

TRAY                    background surface-1, radius 20px, padding 8px 12px, margin-bottom 8px

RECENT-LIST             max-height 500px → 0 on collapse, opacity 1 → 0, chevron rotate -90°

BOTTOMNAV               absolute, left/right/bottom 16px, height 64px, radius 28px
                        box-shadow 0 8px 24px rgba(0,0,0,.35) + 0 2px 8px rgba(0,0,0,.2)
                        z-index 10

FILTER SHEET            absolute, bottom 0, z-index 51, translateY 100% → 0
SCRIM                   absolute, inset 0, z-index 50, opacity 0 → 1 (rgba(0,0,0,.55))

COLLAPSE THRESHOLD      20px scroll
ALL COLLAPSE ANIMATIONS 300ms --ease-emphasized (except opacity: 200ms --ease-standard)
```

---

*Last updated: design system documentation pass.*
