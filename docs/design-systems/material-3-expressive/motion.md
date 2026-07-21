# docs/design-systems/material-3-expressive/motion.md

> Material 3 Expressive motion system: easing curves, durations, named keyframe animations, and the rules for when to use each. Every value here is copied from `prototypes/search-page/styles.css` and `prototypes/search-page/script.js`.

Motion in M3 Expressive is **physical-feeling but not bouncy**. The curves are asymmetric (fast out, slow in), durations are short (100–500ms), and animations cascade (staggered card fade-ins, sequenced header collapse).

---

## 1. The 3 easing curves

M3 ships three named easings. Everything in the prototype uses one of them. **Never use `linear` or `ease` (the CSS keyword)** — they're reserved for non-UI contexts like progress bars.

```css
:root {
  --ease-standard:         cubic-bezier(.2, 0, 0, 1);
  --ease-emphasized:       cubic-bezier(.3, 0, 0, 1);
  --ease-emphasized-decel: cubic-bezier(.05, .7, .1, 1);
}
```

### `--ease-standard` — `cubic-bezier(.2, 0, 0, 1)`

The "default" M3 curve. Symmetric enough for small state changes. Use for:
- Hover/active background color changes
- Focus state transitions
- Opacity fades where direction doesn't matter
- Short durations (100–200ms)

```css
.filter-btn      { transition: all var(--dur-2) var(--ease-standard); }
.searchbar       { transition: background var(--dur-2) var(--ease-standard); }
.searchbar__clear{ transition: background var(--dur-1) var(--ease-standard); }
```

### `--ease-emphasized` — `cubic-bezier(.3, 0, 0, 1)`

Asymmetric: fast at the start, slow at the end. Used when an element is **moving or transforming** (not just changing color). The asymmetry makes the element feel like it's "settling into place."

Use for:
- Layout changes (header collapse, sheet slide-up entrance/exit)
- Size changes (font-size collapse, max-height collapse)
- Transforms on `transform` / `width` / `gap` / `padding`

```css
.topbar          { transition: padding var(--dur-3) var(--ease-emphasized); }
.topbar__title   { transition: font-size var(--dur-3) var(--ease-emphasized); }
.bottomnav__icon { transition: transform var(--dur-2) var(--ease-emphasized); }
.filter-sheet    { transition: transform var(--dur-5) var(--ease-emphasized); }
```

### `--ease-emphasized-decel` — `cubic-bezier(.05, .7, .1, 1)`

Strong deceleration: starts slow, speeds up, ends very slowly. Used for **entrance animations** — elements that appear from off-screen or fade in. The slow ending makes the element feel like it's "landing" rather than "snapping."

Use for:
- Element entrances (cards fading in, chips appearing)
- View transitions (search ↔ settings)
- Cover image zoom on card press

```css
.view            { transition: opacity var(--dur-3) var(--ease-emphasized-decel),
                              transform var(--dur-3) var(--ease-emphasized-decel); }
.anime-card__cover img { transition: transform var(--dur-4) var(--ease-emphasized-decel); }
.anime-card      { animation: cardFadeIn var(--dur-4) var(--ease-emphasized-decel) backwards; }
.active-filter-chip { animation: chipIn var(--dur-3) var(--ease-emphasized-decel); }
```

### Which curve when? (decision tree)

```
Is the element ENTERING (appearing from nothing)?
  → --ease-emphasized-decel

Is the element MOVING / RESIZING (transform, width, max-height, font-size, gap, padding)?
  → --ease-emphasized

Otherwise (color, opacity, background, border-color)?
  → --ease-standard
```

---

## 2. The 5 duration tokens

```css
:root {
  --dur-1: 100ms;
  --dur-2: 200ms;
  --dur-3: 300ms;
  --dur-4: 400ms;
  --dur-5: 500ms;
}
```

| Token    | Duration | Use                                                                              |
|----------|----------|----------------------------------------------------------------------------------|
| `--dur-1`| 100ms    | Instant feedback: hover backgrounds, color shifts on small controls, press states. |
| `--dur-2`| 200ms    | Quick state changes: chip toggles, button hover, icon rotation, scrim fade.       |
| `--dur-3`| 300ms    | Default for layout transitions: header collapse, view swap, max-height collapse. |
| `--dur-4`| 400ms    | Element entrances: card fade-in, accordion content expand.                       |
| `--dur-5`| 500ms    | Major motion: filter sheet slide-up/down.                                        |

### Why these specific values?

- **100ms is the smallest duration that reads as "animated" rather than "instant."** Below 100ms the eye perceives a jump.
- **500ms is the longest UI animation.** Anything longer feels sluggish. The filter sheet is the only thing at 500ms because it's a major modal transition.
- **The progression is roughly geometric**: 100, 200, 300, 400, 500. Each step is +100ms. We deliberately don't have a 600ms or 750ms — if you need more, the animation is doing too much.

### Pairing duration with easing

- **Short (100–200ms) + `--ease-standard`** — for color/opacity changes. The eye doesn't notice the curve at this duration; the duration is the message.
- **Medium (300ms) + `--ease-emphasized`** — for layout changes. The curve sells the "physical" feeling.
- **Long (400–500ms) + `--ease-emphasized-decel`** — for entrances. The slow landing is what makes it feel "placed" rather than "dropped."

---

## 3. Named keyframe animations

The prototype defines a small set of named `@keyframes`. Each one is a reusable motion primitive — call them by name, don't reinvent.

### `cardFadeIn` — staggered card entrance

```css
@keyframes cardFadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

.anime-card {
  animation: cardFadeIn var(--dur-4) var(--ease-emphasized-decel) backwards;
}
```

- **Duration**: 400ms (`--dur-4`)
- **Easing**: `--ease-emphasized-decel` (slow landing)
- **Direction**: enters from 12px below + 0 opacity → settles at 0 + 1 opacity
- **`backwards` fill-mode**: keeps the card invisible (opacity 0) before the animation starts. This is what makes the stagger possible — without `backwards`, the card would flash visible then animate.

### `chipIn` — active-filter-chip entrance

```css
@keyframes chipIn {
  from { opacity: 0; transform: scale(.8); }
  to   { opacity: 1; transform: scale(1); }
}

.active-filter-chip {
  animation: chipIn var(--dur-3) var(--ease-emphasized-decel);
}
.recent-item {
  animation: chipIn var(--dur-3) var(--ease-emphasized-decel);
}
```

- **Duration**: 300ms (`--dur-3`)
- **Easing**: `--ease-emphasized-decel`
- **Direction**: enters from scale 0.8 + 0 opacity → settles at scale 1 + 1 opacity
- **Used for**: active filter chips appearing at the top of the search results, and recent-search items when the recent list renders.

### `dropdownIn` — sort dropdown menu entrance

```css
@keyframes dropdownIn {
  from { opacity: 0; transform: translateY(8px) scale(.95); }
  to   { opacity: 1; transform: translateY(-100%) scale(1); }
}

.sort-dropdown {
  animation: dropdownIn var(--dur-2) var(--ease-emphasized-decel);
}
```

- **Duration**: 200ms (`--dur-2`) — fast, because dropdowns should feel responsive
- **Easing**: `--ease-emphasized-decel`
- **Direction**: enters from 8px below + 95% scale → animates upward (translateY(-100%)) to its anchored position above the trigger button
- **The `translateY(-100%)` end-state is unusual**: it positions the dropdown above its anchor. Combined with the entrance, it reads as "popped up from the button."

### `shimmer` — skeleton loading

```css
@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.skeleton {
  background: linear-gradient(90deg,
    var(--color-surface-2) 25%,
    var(--color-surface-3) 50%,
    var(--color-surface-2) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  border-radius: var(--r-sm);
}
```

- **Duration**: 1400ms (1.4s) — slower than UI animations; this is "loading," not "interaction"
- **Easing**: linear (the `infinite` keyword on `animation` uses linear by default for shimmer; we want a constant sweep)
- **Technique**: animated `background-position` on a 3-stop linear gradient. The middle stop is one tier lighter than the outer stops, creating a "highlight sweep" that loops every 1.4s.
- **No easing token is used** — this is a loading state, not a transition. Linear is correct here.

---

## 4. Signature animation: staggered card fade-in (40ms per card)

When search results arrive, each card fades in with a **40ms delay** from the previous one. This is the prototype's signature motion — it makes the grid feel "alive" without being slow.

```js
// In script.js, after fetching results:
media.forEach(function (a, i) {
  var card = animeCard(a);
  // Staggered fade-in animation
  card.style.animationDelay = (i * 40) + 'ms';
  grid.appendChild(card);
});
```

### How it works

1. Each `.anime-card` has `animation: cardFadeIn var(--dur-4) var(--ease-emphasized-decel) backwards;` in CSS.
2. JS sets `animationDelay = i * 40ms` on each card before appending.
3. The `backwards` fill-mode keeps the card invisible during its delay (otherwise it would show, then jump to invisible, then animate — flicker).
4. With 12 cards, the last card starts at 11 × 40ms = 440ms after the first. Total visible stagger: ~440ms + 400ms (last card's animation) = 840ms end-to-end.

### Why 40ms?

- **30ms** is too tight — the eye reads it as "all at once."
- **50ms** is too loose — the eye reads it as "slow loading."
- **40ms** is the sweet spot — the eye perceives a clear cascade but doesn't get impatient.

### Variants

The same 40ms stagger is appropriate for:
- Grid results (current use)
- Filter chip rows appearing
- Recent search items appearing
- Settings rows on first paint

Don't use it for:
- Hover states (those should be instant — `--dur-1`)
- Modal entrances (those should be a single animation, not staggered)

---

## 5. Signature animation: sheet slide-up (500ms)

The filter bottom sheet slides up from the bottom of the screen when opened, and slides back down when closed. Both directions use the same duration and easing.

```css
.filter-sheet {
  position: absolute; left: 0; right: 0; bottom: 0;
  transform: translateY(100%);               /* hidden below the screen */
  transition: transform var(--dur-5) var(--ease-emphasized);
}

.filter-sheet.is-open {
  transform: translateY(0);                   /* visible at rest */
}
```

- **Duration**: 500ms (`--dur-5`) — the longest UI animation in the system. Sheets are major modal transitions and deserve the time.
- **Easing**: `--ease-emphasized` (asymmetric: fast start, slow end). The sheet "shoots up" then "settles" into place.
- **Mechanism**: CSS `transform: translateY()` on the sheet itself, toggled by adding/removing the `.is-open` class.
- **Same duration for close**: when `.is-open` is removed, the sheet slides back down with the same 500ms / `--ease-emphasized`. Don't use a different duration for close — the symmetry feels right.

### The scrim fades in parallel

```css
.sheet-scrim {
  opacity: 0;
  transition: opacity var(--dur-3) var(--ease-standard);
}
.sheet-scrim.is-visible { opacity: 1; }
```

The scrim (the dark overlay behind the sheet) fades in over 300ms while the sheet slides up over 500ms. They start together but the scrim finishes first, so the background darkens "into" the sheet's arrival. This is intentional — it tells the eye "the world behind is going dark to make room for this."

---

## 6. Signature animation: chip-in (300ms)

When the user activates a filter, an "active filter chip" appears at the top of the results section. It scales up from 0.8 to 1.0 with a fade-in.

```css
.active-filter-chip {
  animation: chipIn var(--dur-3) var(--ease-emphasized-decel);
}
```

- **Duration**: 300ms (`--dur-3`)
- **Easing**: `--ease-emphasized-decel` (slow landing — the chip "arrives")
- **Mechanism**: `@keyframes chipIn` (see §3)
- **Triggered by**: a new `<button class="active-filter-chip">` being added to the DOM. The animation runs once on insertion.
- **No exit animation**: when the user removes a chip, it just disappears. Adding an exit animation would require a "leave" state machine; the prototype opts for simplicity. (If you add an exit, use `chipIn` reversed: `to { opacity: 0; transform: scale(.8); }`.)

---

## 7. View swap (search ↔ settings)

When the user taps a bottom-nav item, the current view fades out and the new view fades in. Both run in parallel.

```css
.view {
  position: absolute; inset: 0;
  opacity: 0;
  transform: translateX(8px);                /* starts 8px to the right */
  pointer-events: none;
  transition:
    opacity  var(--dur-3) var(--ease-emphasized-decel),
    transform var(--dur-3) var(--ease-emphasized-decel);
}

.view--active {
  opacity: 1;
  transform: none;                            /* settles at 0 */
  pointer-events: auto;
}
```

- **Duration**: 300ms (`--dur-3`)
- **Easing**: `--ease-emphasized-decel` (slow landing)
- **Direction**: incoming view slides in from 8px to the right + fades in. The outgoing view reverses (fades out + slides left) because both views share the same transition rule.
- **The 8px translateX** is small enough to read as "settling" rather than "swiping." A larger value (like 24px) would feel like a page navigation; 8px feels like a focus shift.

### No exit animation

There's no separate exit animation — when `.view--active` is removed from view A and added to view B, both transition simultaneously. A fades out (opacity 1 → 0, translateX 0 → -8px), B fades in (opacity 0 → 1, translateX 8px → 0). The crossfade is fast and clean.

---

## 8. Header collapse on scroll (multi-property, 300ms emphasized)

The topbar collapses when the user scrolls down. This is the most complex animation in the prototype — multiple properties animate in parallel.

```css
.topbar {
  transition:
    padding     var(--dur-3) var(--ease-emphasized),
    gap         var(--dur-3) var(--ease-emphasized),
    max-height  var(--dur-3) var(--ease-emphasized);
  max-height: 220px;
  overflow: hidden;
}

.topbar.is-collapsed {
  padding-top: var(--sp-2);
  padding-bottom: var(--sp-1);
  gap: var(--sp-1);
  max-height: 56px;
}

.topbar__title {
  transition: font-size var(--dur-3) var(--ease-emphasized);
}
.topbar.is-collapsed .topbar__title {
  font-size: var(--fs-h2);            /* 32px → 22px */
}

.searchbar {
  transition: all var(--dur-3) var(--ease-emphasized);
  height: 56px;                       /* expanded */
}
.topbar.is-collapsed .searchbar {
  height: 44px;                       /* collapsed */
  flex: 1 1 auto;                     /* grows to fill the row */
}

.source-toggle {
  transition:
    opacity   var(--dur-3) var(--ease-emphasized),
    transform var(--dur-3) var(--ease-emphasized),
    width     var(--dur-3) var(--ease-emphasized);
}
.topbar.is-collapsed .source-toggle {
  opacity: 0;
  transform: scale(.8);
  width: 0;
  pointer-events: none;
  overflow: hidden;
}
```

All these properties transition in parallel over 300ms with `--ease-emphasized`. The result reads as one fluid motion: the title shrinks, the search bar shrinks and slides into the title's row, the source toggle fades and scales out, and the row's gap tightens.

The filter/sort buttons slide out in opposite directions (filter left, sort right):

```css
.topbar.is-collapsed ~ .quick-row .filter-btn {
  transform: translateX(-200%);
  opacity: 0;
}
.topbar.is-collapsed ~ .quick-row .sort-btn {
  transform: translateX(200%);
  opacity: 0;
}
```

This "parting" motion reinforces the collapse — the controls "make room" for the search bar by sliding outward.

See [`layout-patterns.md`](./layout-patterns.md) §1 for the full choreography.

---

## 9. Press feedback (`:active`)

Tappable elements give a small press feedback via `transform: scale()`. Always uses `--ease-emphasized` and a short duration.

```css
.anime-card:active       { transform: scale(.96); }                  /* 4% shrink */
.anime-card:active .anime-card__cover img { transform: scale(1.1); } /* image zooms INSIDE the card */
.btn-filled:active       { transform: scale(.97); }                  /* 3% shrink */
.score-slider::-webkit-slider-thumb:active { transform: scale(1.25); } /* 25% grow */
```

- **Cards shrink 4%** (0.96) — feels like a physical press into the surface.
- **Buttons shrink 3%** (0.97) — slightly less than cards; buttons are smaller and a 4% shrink would read as too much.
- **Sliders grow 25%** (1.25) — the thumb expands on press so the user feels they're "gripping" it.
- **Cover images zoom 10%** (1.1) inside the card on press — gives the impression of "pressing into" the artwork. Uses the long 400ms + `--ease-emphasized-decel` for a slow, satisfying zoom.

```css
.anime-card:active .anime-card__cover img {
  transform: scale(1.1);
  transition: transform var(--dur-4) var(--ease-emphasized-decel);
}
```

---

## 10. Reduced motion

The prototype respects `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  * { transition: none !important; animation: none !important; }
}
```

When the user has reduced motion enabled at the OS level, **all transitions and animations are disabled**. State changes become instant. This is non-negotiable — don't override it for "important" animations.

The staggered card fade-in still works (cards just appear instantly instead of cascading), the sheet still opens (just appears without sliding), and the header still collapses (just snaps). The functional behavior is identical; only the motion is removed.

---

## 11. Animation tokens cheat sheet

```
EASING
  --ease-standard          cubic-bezier(.2, 0, 0, 1)      — color, opacity, hover
  --ease-emphasized        cubic-bezier(.3, 0, 0, 1)      — transform, layout, size
  --ease-emphasized-decel  cubic-bezier(.05, .7, .1, 1)   — entrances, view swaps

DURATIONS
  --dur-1  100ms   — instant feedback (hover, color)
  --dur-2  200ms   — quick state changes (toggle, icon rotate)
  --dur-3  300ms   — default (header collapse, view swap, chip-in)
  --dur-4  400ms   — entrances (card fade-in, accordion expand)
  --dur-5  500ms   — major motion (sheet slide-up/down)

KEYFRAMES
  cardFadeIn    — 400ms, emphasized-decel — translateY(12px) + opacity 0 → 1
  chipIn        — 300ms, emphasized-decel — scale(.8) + opacity 0 → 1
  dropdownIn    — 200ms, emphasized-decel — translateY(8px) scale(.95) → translateY(-100%) scale(1)
  shimmer       — 1.4s, linear, infinite  — background-position 200% → -200%

SIGNATURE MOTIONS
  Staggered cards:    40ms × i delay, cardFadeIn 400ms emphasized-decel
  Sheet slide-up:     500ms emphasized, transform translateY(100% → 0)
  Chip-in:            300ms emphasized-decel, scale(.8 → 1)
  View swap:          300ms emphasized-decel, opacity + translateX(8px → 0)
  Header collapse:    300ms emphasized, multi-property (padding, gap, max-height, font-size, height, opacity, transform, width)
  Press feedback:     scale(.96–.97), emphasized, on :active

REDUCED MOTION:  all transitions + animations disabled via prefers-reduced-motion
```

---

*Last updated: design system documentation pass.*
