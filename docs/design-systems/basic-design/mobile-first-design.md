# mobile-first-design.md

> Mobile-first design principles for this repo. Every prototype in this repo targets mobile (phone) as the primary platform; desktop is a progressive enhancement. This file defines the constraints that follow from that decision: touch targets, thumb zone, one-handed usability, breakpoints, safe-area insets, performance budget, gesture support, content prioritization.
>
> Read this before designing any screen. If the screen violates any of these constraints, the design is wrong.

---

## Why this file exists

Mobile-first is not "design for phone, then scale up." It's a design philosophy: **the constraints of mobile (small screen, touch input, one hand, slow network, interruptions) force simplicity, and that simplicity makes the desktop version better too.** Designing desktop-first and shrinking to mobile produces cramped, unusable mobile UIs. Designing mobile-first and expanding to desktop produces focused, usable desktop UIs.

This file defines the mobile constraints every screen in the repo must respect.

---

## The 8 principles (quick list)

1. **Touch targets** — 44×44px minimum, 48px preferred.
2. **Thumb zone** — important actions in the bottom half of the screen.
3. **One-handed usability** — reach everything with one thumb.
4. **Responsive breakpoints** — mobile-first, progressive enhancement.
5. **Safe area insets** — respect notches, home indicators, status bars.
6. **Performance** — lazy loading, minimal JS, fast first paint.
7. **Gesture support** — swipe, tap, long-press where native.
8. **Content prioritization** — show what matters first; defer the rest.

---

## 1. Touch targets

Every interactive element must be **at least 44×44 CSS pixels** (the WCAG 2.5.5 minimum and Apple HIG minimum). **48×48px is preferred** for primary actions. Anything smaller causes mis-taps, especially when the user's hand is in the way (see §2 Thumb zone).

### Why 44px?

The average adult fingertip is ~10mm wide. 44 CSS pixels at the standard 96dpi reference = ~11.6mm, which gives a small margin around the actual touch point. Below 44px, the user starts hitting neighbors; below 32px, mis-taps become the dominant interaction.

### Implementation rules

- Use `min-height` + `min-width` + `padding`, not a fixed `height`, so text scaling still works.
- Visually-small icon buttons can stay visually small if their **hit area** is extended with transparent padding (`::before` pseudo-element extending the tappable region).
- Never overlap two interactive elements' hit areas.
- Vertical spacing between stacked interactive elements: ≥ 8px (so a mis-tap on the boundary doesn't fire both).

### CSS

```css
:root {
  --touch-min: 44px;
  --touch-preferred: 48px;
}

.btn {
  min-height: var(--touch-min);
  min-width: var(--touch-min);
  padding: var(--sp-3) var(--sp-4);   /* 12px 16px */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--sp-2);
  border-radius: var(--r-pill);
  font-weight: 600;
  /* No fixed height — let min-height + padding grow it for longer labels. */
}

.btn--primary {
  min-height: var(--touch-preferred);   /* 48px for primary actions */
}

.icon-button {
  width: var(--touch-min);
  height: var(--touch-min);
  display: grid;
  place-items: center;
  border-radius: var(--r-pill);
}

/* Visually small icon button (e.g. in a dense toolbar) with extended hit area */
.icon-button--compact {
  width: 32px;
  height: 32px;
  position: relative;
}
.icon-button--compact::before {
  content: "";
  position: absolute;
  inset: -6px;     /* extends 6px each side → 44×44 hit area */
  /* transparent — extends touch without affecting visuals */
}

/* List rows must be ≥ 48px tall — they're stacked, so more forgiving */
.list-row {
  min-height: 48px;
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding: var(--sp-3) var(--sp-4);
}
```

### Anti-pattern

```css
/* ❌ DON'T */
.btn { height: 28px; padding: 4px 8px; }
.icon-btn { width: 24px; height: 24px; }
.list-row { height: 32px; }
/* Mis-tap city. Especially in the thumb zone. */
```

See also: `accessibility.md` § Touch target size.

---

## 2. Thumb zone

The **thumb zone** is the area of the screen reachable by the thumb while holding the phone one-handed (typically the bottom 2/3 of the screen on a 6" phone, curved slightly toward the thumb side). The **dead zone** is the top of the screen, especially the top-right corner for right-handed users — the thumb has to stretch or the user has to use the other hand.

### Principles

- **Primary actions go in the bottom half.** Save buttons, submit, "compose," "add new" — all bottom-anchored.
- **The bottom-right corner** is the most reachable spot for a right-handed user (most users). Place the single most important action there.
- **Top of screen = navigation and identity**, not actions. Back button, title, maybe a profile avatar. Not "Save."
- **Floating bottom nav / FAB** is the canonical pattern for primary navigation + primary action.
- **Mirror for left-handed users** if your design supports it; otherwise accept the right-handed default.

### Anatomy diagram

```
┌─────────────────────────┐
│  Hard to reach          │  ← dead zone (top ~25%)
│  (back button, title)   │
├─────────────────────────┤
│                         │
│  Stretch zone           │  ← reachable but uncomfortable
│  (secondary content)    │
│                         │
├─────────────────────────┤
│                         │
│  Thumb zone (easy)      │  ← natural zone
│  (primary actions,      │
│   bottom nav, FAB)      │
└─────────────────────────┘
```

### CSS pattern: bottom-anchored primary action

```css
.screen {
  position: relative;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

.screen__content {
  flex: 1;
  overflow-y: auto;
  padding: var(--sp-4);
  padding-bottom: calc(var(--sp-10) + 64px);  /* room for sticky button + bottom nav */
}

.screen__primary-action {
  position: sticky;
  bottom: 0;
  background: linear-gradient(to top, var(--bg) 60%, transparent);
  padding: var(--sp-3) var(--sp-4) calc(var(--sp-4) + env(safe-area-inset-bottom));
  /* env(safe-area-inset-bottom) handles iPhone home indicator — see §5 */
}

.screen__primary-action .btn {
  width: 100%;
  min-height: var(--touch-preferred);   /* 48px — easy thumb tap */
}

/* FAB alternative for "add new" action */
.fab {
  position: fixed;
  right: var(--sp-4);
  bottom: calc(80px + env(safe-area-inset-bottom));  /* above bottom nav */
  width: 56px; height: 56px;                          /* larger than min — it's primary */
  border-radius: var(--r-md);                          /* or pill if you prefer */
  background: var(--primary);
  color: var(--on-primary);
  box-shadow: 0 4px 12px rgba(0,0,0,0.25);
}
```

### Anti-pattern

```css
/* ❌ DON'T: "Save" button at top-right of screen. */
.top-bar .save-btn { position: absolute; top: 16px; right: 16px; }
/* Right-handed users have to re-grip the phone to tap it.
   Left-handed users can't reach it at all without both hands. */
```

---

## 3. One-handed usability

A user holding a phone one-handed has a thumb reach arc of roughly ⅔ of the screen height, biased toward their thumb side. Anything outside that arc requires re-gripping, which the user will avoid — meaning they won't use that part of the UI.

### Principles

- **All primary interactions reachable in one-handed grip.** If a user has to use their other hand for the core flow, the design is wrong.
- **Navigation in the bottom nav, not the top.** Bottom nav is thumb-reachable; top hamburger is not.
- **No critical actions in the top-right corner.** That's the worst spot for right-handed reach.
- **Sheet-based interactions** (bottom sheets that slide up) are one-handed-friendly. Modals centered on screen force the user to reach the middle.
- **Test on a 6.5" phone.** If it's not reachable on a 6.5" phone, it's not one-handed.

### Implementation pattern: bottom sheet over centered modal

```css
/* ✅ DO: bottom sheet — slides up from thumb zone */
.sheet {
  position: fixed;
  left: 0; right: 0; bottom: 0;
  max-height: 85dvh;
  background: var(--surface-3);
  border-radius: var(--r-xl) var(--r-xl) 0 0;   /* 28px top corners only */
  padding: var(--sp-4) var(--sp-4) calc(var(--sp-4) + env(safe-area-inset-bottom));
  transform: translateY(100%);
  transition: transform 500ms var(--ease-emphasized);
  overflow-y: auto;
}
.sheet.is-open { transform: translateY(0); }

/* ❌ DON'T: centered modal — forces reach to middle of screen */
.modal {
  position: fixed;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  /* On a 6.5" phone, the action buttons are at ~60% height — reachable,
     but the title and close button at the top of the modal are not. */
}
```

---

## 4. Responsive breakpoints

Mobile-first means: **write the mobile styles first, then add `min-width` media queries to enhance for larger screens.** Never start with desktop and shrink.

### The repo's breakpoint scale

| Breakpoint | Width       | Target                                  |
|------------|-------------|-----------------------------------------|
| `xs`       | 0–359px     | Small phones (older Androids, iPhone SE 1) — must still work. |
| `sm`       | 360–599px   | Standard phones (iPhone SE 2+, Pixel, Galaxy S). The default. |
| `md`       | 600–899px   | Large phones, small tablets, foldables open. |
| `lg`       | 900–1199px  | Tablets, foldables open, small laptops. |
| `xl`       | 1200–1535px | Desktop.                                  |
| `xxl`      | 1536px+     | Large desktop.                           |

### CSS pattern: mobile-first enhancement

```css
/* ✅ DO: base styles are mobile (sm), enhanced upward */

.card-grid {
  /* mobile default: single column, full width */
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--sp-3);
}

@media (min-width: 600px) {
  /* md: 2 columns on tablet */
  .card-grid { grid-template-columns: repeat(2, 1fr); gap: var(--sp-4); }
}

@media (min-width: 900px) {
  /* lg: 3 columns on desktop */
  .card-grid { grid-template-columns: repeat(3, 1fr); gap: var(--sp-5); }
}

@media (min-width: 1200px) {
  /* xl: 4 columns on large desktop */
  .card-grid { grid-template-columns: repeat(4, 1fr); }
}

/* ❌ DON'T: desktop-first, then shrink */
/*
.card-grid { grid-template-columns: repeat(4, 1fr); }
@media (max-width: 899px) { .card-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 599px) { .card-grid { grid-template-columns: 1fr; } }
*/
/* This works but it's harder to reason about, encourages desktop assumptions
   (hover, multiple columns, dense layouts) to leak into mobile. */
```

### Container queries (modern alternative)

For component-level responsiveness (e.g. a card that adapts based on its container width, not the viewport), prefer `@container`:

```css
.card-host { container-type: inline-size; }

.card { /* narrow default */ }
@container (min-width: 400px) {
  .card { /* wider layout */ }
}
```

Use container queries when the component is reused in multiple contexts (sidebar, main column, grid) and needs to adapt to its container, not the viewport.

---

## 5. Safe area insets (notches, home indicators, status bars)

Modern phones have **notches / Dynamic Island** at the top, **home indicators** at the bottom, and (on some Androids) **curved edges**. UI must respect these — content under a notch is invisible, content under a home indicator is uninterpretable.

### The viewport meta tag (required)

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```

`viewport-fit=cover` tells the browser to extend the web view into the notch area. Without it, `env(safe-area-inset-*)` returns 0 and your content gets pushed under the notch.

### Using `env(safe-area-inset-*)`

```css
:root {
  /* Convenient aliases */
  --safe-top:    env(safe-area-inset-top, 0px);
  --safe-bottom: env(safe-area-inset-bottom, 0px);
  --safe-left:   env(safe-area-inset-left, 0px);
  --safe-right:  env(safe-area-inset-right, 0px);
}

/* Top bar: respect status bar + notch */
.top-bar {
  position: sticky;
  top: 0;
  padding-top: var(--safe-top);          /* pushes content below notch */
  padding-left: max(var(--sp-4), var(--safe-left));
  padding-right: max(var(--sp-4), var(--safe-right));
  /* Use max() so we get at least the design padding, more if the inset is larger. */
}

/* Bottom nav / sticky button: respect home indicator */
.bottom-nav {
  position: fixed;
  bottom: 0;
  padding-bottom: var(--safe-bottom);
}

.sticky-action {
  padding-bottom: calc(var(--sp-4) + var(--safe-bottom));
}

/* Full-bleed background that should extend INTO the notch area,
   but keep its content out of it */
.full-bleed {
  background: var(--surface-3);
  /* extend background into safe area */
  padding-top: var(--safe-top);
  padding-left: var(--safe-left);
  padding-right: var(--safe-right);
}
.full-bleed__content {
  /* content stays inside the safe area */
  padding: var(--sp-4);
}
```

### Landscape orientation

In landscape, `safe-area-inset-left` and `-right` become significant (notch on the side). Use the same `max()` pattern.

### Anti-pattern

```css
/* ❌ DON'T: hardcode padding without env() */
.top-bar { padding-top: 44px; }   /* status bar height on iPhone X... but wrong on Android,
                                     wrong on older iPhones, wrong in landscape. */
.bottom-nav { padding-bottom: 34px; }  /* home indicator height... same problem. */

/* ❌ DON'T: omit viewport-fit=cover */
<meta name="viewport" content="width=device-width, initial-scale=1">
/* env(safe-area-inset-*) returns 0. Your "respect the notch" CSS does nothing. */
```

---

## 6. Performance (lazy loading, minimal JS)

Mobile networks are slow. Mobile CPUs are slower than desktop CPUs. Mobile users abandon pages that take >3s to load. Performance is a design constraint, not an optimization afterthought.

### Budgets

| Metric        | Target                                  |
|---------------|-----------------------------------------|
| First Contentful Paint | < 1.8s on a mid-range phone over 4G. |
| Largest Contentful Paint | < 2.5s.                           |
| Total JS bundle (gzipped) | < 100KB for a single screen.       |
| Total CSS (gzipped) | < 30KB.                            |
| Images (initial viewport) | < 100KB total.                  |
| Images (below the fold) | Lazy-loaded.                      |

### Techniques

**Lazy-load images and below-the-fold content:**

```html
<img src="hero.jpg" alt="…" width="800" height="600">             <!-- above fold: eager -->
<img src="card1.jpg" alt="…" loading="lazy" width="400" height="300">  <!-- below fold: lazy -->
<img src="card2.jpg" alt="…" loading="lazy" width="400" height="300">
```

Always include `width` and `height` so the browser can reserve space (prevents layout shift).

**Defer non-critical JS:**

```html
<script src="app.js" defer></script>           <!-- defer: runs after HTML parsed -->
<script src="analytics.js" async></script>     <!-- async: runs whenever, non-blocking -->
```

**Use CSS for animations, not JS:**

```css
/* ✅ DO: CSS transitions — composited, GPU-accelerated, cheap. */
.card { transition: transform 200ms var(--ease-emphasized); }
.card:hover { transform: translateY(-2px); }

/* ❌ DON'T: JS rAF loop updating style.left — main-thread thrash, janky. */
```

**Avoid layout thrash:**

```js
// ❌ DON'T: read then write then read then write in a loop
for (const el of elements) {
  const h = el.offsetHeight;       // read (forces layout)
  el.style.height = h + 10 + 'px'; // write (invalidates layout)
  const w = el.offsetWidth;        // read (forces layout AGAIN)
  el.style.width = w + 10 + 'px';  // write
}
// Each iteration forces a full layout recalc. O(n²) on a long list.

// ✅ DO: batch reads, then batch writes
const measurements = elements.map(el => ({ h: el.offsetHeight, w: el.offsetWidth }));
elements.forEach((el, i) => {
  el.style.height = measurements[i].h + 10 + 'px';
  el.style.width  = measurements[i].w + 10 + 'px';
});
// One layout recalc total.
```

**Skeleton screens over spinners:**

```css
.skeleton {
  background: linear-gradient(90deg, var(--surface-2) 0%, var(--surface-3) 50%, var(--surface-2) 100%);
  background-size: 200% 100%;
  animation: shimmer 1.4s linear infinite;
  border-radius: var(--r-sm);
}
@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton { animation: none; background: var(--surface-2); }
}
```

A skeleton shows the *shape* of incoming content, which feels faster than a spinner (which shows nothing).

---

## 7. Gesture support (swipe, tap, long-press)

Mobile users expect gestures. A screen that requires tapping a tiny "back" button when swipe-back is the native convention feels broken.

### Gestures to support

| Gesture       | What it does                                  | When to use                                  |
|---------------|-----------------------------------------------|----------------------------------------------|
| Tap           | Primary action (button, link, list item).     | Default for everything.                       |
| Swipe left/right | Reveal actions (delete, archive) on list items. Or carousel navigation. | List items with secondary actions. |
| Swipe down    | Dismiss a sheet/modal. Or pull-to-refresh.    | Bottom sheets, refreshable lists.            |
| Swipe up (from bottom edge) | Open app switcher (OS-level, don't intercept). | — |
| Long-press    | Reveal context menu, "select", reorder.       | List items, cards with secondary actions.    |
| Pinch         | Zoom (images, maps).                          | Image viewers, maps.                         |
| Double-tap    | Zoom in / out (images), or "like".            | Image viewers, social feeds.                 |

### Implementation notes

**Don't intercept OS-level gestures.** Swiping up from the bottom edge (iOS home gesture), swiping down from the top (notifications), edge-swipe-back (iOS) — leave these alone. Interception breaks the user's mental model of the OS.

**Use Pointer Events, not Touch Events, for new code.** Pointer Events unify mouse, touch, and pen, and they're easier to reason about.

```js
// ✅ DO: Pointer Events for swipe detection
let startX = 0, startY = 0, tracking = false;
const el = document.querySelector('.list-item');

el.addEventListener('pointerdown', (e) => {
  startX = e.clientX; startY = e.clientY; tracking = true;
  el.setPointerCapture(e.pointerId);
});
el.addEventListener('pointermove', (e) => {
  if (!tracking) return;
  const dx = e.clientX - startX;
  const dy = e.clientY - startY;
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) {
    el.style.transform = `translateX(${Math.max(-80, Math.min(80, dx))}px)`;
  }
});
el.addEventListener('pointerup', (e) => {
  if (!tracking) return;
  tracking = false;
  const dx = e.clientX - startX;
  if (dx < -80) { revealDeleteAction(); }      // swiped left far enough
  el.style.transform = '';                      // snap back
});
```

**Add a visible affordance for gestures.** A small chevron, a hint label ("Swipe to delete"), or a partially-revealed action behind the item. Users won't discover invisible gestures.

**Respect `prefers-reduced-motion`** for all gesture animations (see `accessibility.md`).

### Anti-pattern

```css
/* ❌ DON'T: hide navigation behind gestures with no visible affordance. */
/* "Swipe left to see the menu" — nobody will find it. Always have a visible button too. */
```

---

## 8. Content prioritization

On a 6" screen, you can show ~5–7 list items, ~2 sections of content, or ~1 hero + 3 secondary items. Everything else is below the fold or deferred. **Choose what the user sees first.**

### Principles

- **The first screenful should answer the user's primary question.** If the user opened the screen to see their balance, the balance is the first thing on screen — not a banner, not a promo, not a "welcome back."
- **Defer secondary content below the fold or behind a tab.** Don't compete for the top.
- **Cut chrome.** Every pixel of chrome is a pixel not showing content. Top bars, tab bars, banners — minimize.
- **Show content, not empty states.** If the screen has data, show it. Don't make the user tap "Load" first.
- **Progressive disclosure.** Show summary, then expand on demand. Don't dump 14 fields on the user; show the 3 they need and reveal more as needed.

### Pattern: progressive disclosure

```html
<!-- ✅ DO: card shows summary, expands on tap -->
<article class="card" data-expandable>
  <header class="card__header">
    <h3 class="card__title">Order #1234</h3>
    <span class="card__meta">Shipped · 2 days ago</span>
    <button class="card__toggle" aria-expanded="false" aria-label="Toggle details">▾</button>
  </header>
  <div class="card__summary">
    <p>3 items · $42.50</p>
  </div>
  <div class="card__details" hidden>
    <!-- full order contents, shipping address, tracking number -->
  </div>
</article>
```

```css
.card__details { max-height: 0; overflow: hidden; transition: max-height 300ms var(--ease-emphasized-decel); }
.card[data-expanded] .card__details { max-height: 500px; }
.card[data-expanded] .card__toggle { transform: rotate(180deg); }
```

### Pattern: content-first loading

```html
<!-- ✅ DO: show content as soon as it's ready, don't block on everything -->
<div class="screen">
  <header class="top-bar">…</header>             <!-- renders immediately -->
  <main class="content">
    <div class="skeleton-card"></div>             <!-- placeholder while data loads -->
    <div class="skeleton-card"></div>
    <div class="skeleton-card"></div>
  </main>
</div>
<!-- As each card's data arrives, swap its skeleton for the real card. -->
```

### Anti-pattern

```html
<!-- ❌ DON'T: full-screen spinner blocking all interaction until "ready" -->
<div class="screen-loading">
  <spinner></spinner>
  <p>Loading…</p>
</div>
<!-- User waits 2s staring at a spinner, then everything appears at once.
     Feels slower than skeletons + progressive reveal, even at the same total time. -->
```

---

## Putting it all together: the mobile screen template

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#14111f">
  <title>Screen title</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body data-theme="dark">
  <div class="screen">

    <!-- Top bar: identity + back. No actions here (thumb zone violation). -->
    <header class="top-bar">
      <button class="icon-button" aria-label="Back">
        <svg>…</svg>
      </button>
      <h1 class="top-bar__title">Screen title</h1>
    </header>

    <!-- Content: scrollable, padding respects safe areas. -->
    <main class="screen__content">
      <section class="section">
        <h2 class="section__title">Primary content</h2>
        <!-- the user's primary question answered here, first -->
      </section>
      <section class="section">
        <h2 class="section__title">Secondary content</h2>
        <!-- deferred below the fold -->
      </section>
    </main>

    <!-- Primary action: sticky bottom, in thumb zone, 48px tall. -->
    <div class="screen__primary-action">
      <button class="btn btn--primary">Save</button>
    </div>

    <!-- Bottom nav: floating, thumb-reachable. -->
    <nav class="bottom-nav" aria-label="Primary">
      <a class="bottom-nav__item is-active" href="#"><svg>…</svg><span>Home</span></a>
      <a class="bottom-nav__item" href="#"><svg>…</svg><span>Search</span></a>
      <a class="bottom-nav__item" href="#"><svg>…</svg><span>Profile</span></a>
    </nav>

  </div>
  <script src="app.js" defer></script>
</body>
</html>
```

```css
:root {
  --sp-1: 4px; --sp-2: 8px; --sp-3: 12px; --sp-4: 16px;
  --sp-5: 20px; --sp-6: 24px; --sp-8: 32px; --sp-10: 40px;
  --touch-min: 44px; --touch-preferred: 48px;
  --safe-top: env(safe-area-inset-top, 0px);
  --safe-bottom: env(safe-area-inset-bottom, 0px);
  --ease-emphasized: cubic-bezier(.3, 0, 0, 1);
}

.screen {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: var(--bg);
  color: var(--on-bg);
}

.top-bar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  padding: max(var(--sp-3), var(--safe-top)) var(--sp-4) var(--sp-3);
  background: var(--bg);
}

.screen__content {
  flex: 1;
  padding: var(--sp-4);
  padding-bottom: calc(var(--sp-10) + 64px + var(--safe-bottom));
}

.screen__primary-action {
  position: sticky;
  bottom: 0;
  z-index: 5;
  padding: var(--sp-3) var(--sp-4) calc(var(--sp-4) + var(--safe-bottom));
  background: linear-gradient(to top, var(--bg) 70%, transparent);
}
.screen__primary-action .btn { width: 100%; min-height: var(--touch-preferred); }

.bottom-nav {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: calc(var(--sp-4) + var(--safe-bottom));
  z-index: 20;
  display: flex;
  gap: var(--sp-2);
  padding: var(--sp-2);
  background: var(--surface-3);
  border-radius: var(--r-xl);   /* 28px */
  box-shadow: 0 4px 16px rgba(0,0,0,0.25);   /* genuine floating element — shadow allowed */
}
.bottom-nav__item {
  min-width: var(--touch-min);
  min-height: var(--touch-min);
  display: grid; place-items: center;
  border-radius: var(--r-pill);
  color: var(--on-surface-variant);
  text-decoration: none;
}
.bottom-nav__item.is-active { background: var(--surface-4); color: var(--on-surface); }
```

---

## See also

- [`what-makes-good-ui.md`](./what-makes-good-ui.md) — the underlying principles mobile-first serves.
- [`accessibility.md`](./accessibility.md) — touch target size, focus, reduced-motion overlap.
- [`../material-3-expressive/layout-patterns.md`](../material-3-expressive/layout-patterns.md) — M3-specific implementations of the patterns here (collapsing header, floating bottom nav, bottom sheet).
- [`../material-3-expressive/spacing.md`](../material-3-expressive/spacing.md) — the 4px spacing scale referenced throughout.

---

*Last updated: design system documentation pass.*
