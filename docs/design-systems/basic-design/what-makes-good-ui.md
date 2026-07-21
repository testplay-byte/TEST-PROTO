# what-makes-good-ui.md

> The 8 fundamental principles every UI must obey, regardless of design system. Each principle has a **DO** example and a **DON'T** example with concrete CSS so an AI agent can recognize the difference and self-correct.
>
> Read this once before generating any UI. Re-read it as a checklist after generating UI. If your UI violates any of these, fix it before shipping.

---

## Why this file exists

LLMs that generate UI without an explicit principle set default to "clean and modern" — which is code for "flat, indigo, generic, no personality." That output technically renders, but it fails every qualitative test. This file gives you the vocabulary to **recognize** bad UI and the **specific fixes** to apply.

These 8 principles are not a style preference. They are the minimum bar for a UI to be usable. Every design system in this repo (M3, custom) is built on top of them.

---

## The 8 principles (quick list)

1. **Visual hierarchy** — guide the eye; not everything is equally important.
2. **Consistency** — same patterns, same spacing, same components everywhere.
3. **Feedback** — every interaction gets a visible response.
4. **Affordance** — elements should look how they behave.
5. **White space** — breathing room; not cramming.
6. **Alignment** — grid system, consistent edges.
7. **Contrast** — text legibility, element distinction.
8. **Simplicity** — remove the unnecessary; don't overcomplicate.

---

## 1. Visual hierarchy

The eye should know what to look at first, second, third. Hierarchy is built from **size**, **weight**, **color**, and **position** — usually a combination of all four. A screen with no hierarchy forces the user to scan everything; a screen with good hierarchy lets the user find the primary action in <1 second.

### The four levers

| Lever        | What it signals                                                  | Typical pattern                                  |
|--------------|------------------------------------------------------------------|--------------------------------------------------|
| Size         | Larger = more important.                                         | Page title 24–32px, section header 18px, body 14–16px. |
| Weight       | Bolder = more important.                                         | Title 700, body 400, eyebrow/label 500 uppercase. |
| Color        | Higher saturation / higher contrast = more important.           | Primary action = brand color; secondary action = neutral. |
| Position     | Top-left (LTR) = first read. Bottom-center (mobile) = primary action. | Title at top, primary button at bottom thumb zone. |

### ✅ DO

```css
/* Hierarchy via size + weight + color, on a single page */
.page-title    { font-size: 28px; font-weight: 700; color: var(--on-surface); letter-spacing: -0.02em; }
.section-title { font-size: 18px; font-weight: 600; color: var(--on-surface); }
.body          { font-size: 14px; font-weight: 400; color: var(--on-surface-variant); }
.eyebrow       { font-size: 12px; font-weight: 500; color: var(--primary); text-transform: uppercase; letter-spacing: 0.08em; }

.primary-action {
  background: var(--primary);
  color: var(--on-primary);
  font-weight: 600;
  /* high saturation + bold weight + bottom-of-screen position = "this is the main action" */
}
```

### ❌ DON'T

```css
/* Everything is 14–16px, weight 400, same color. No hierarchy at all. */
.page-title, .section-title, .body, .eyebrow {
  font-size: 14px;
  font-weight: 400;
  color: #333;
}
/* The user has to read every line to find the primary action. */
```

**Why this fails:** The eye has no anchor. The user scans the whole screen, gets fatigued, and bounces. This is the #1 reason AI-generated "clean" UIs feel soulless — they're aesthetically consistent but hierarchically flat.

---

## 2. Consistency

Same patterns, same spacing tokens, same component shapes, same color roles, same motion, *everywhere*. If two buttons do similar things, they should look similar. If two cards are in the same list, they should have identical padding, radius, and shadow.

Consistency is what makes a UI feel **designed** rather than **assembled**. The human brain treats inconsistency as noise; it costs cognitive load every time the user has to re-decode a slightly different pattern.

### The consistency contract (every project should define these once)

- **Spacing scale:** 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 px (4px base grid).
- **Type scale:** 11 / 12 / 13 / 14 / 16 / 18 / 22 / 26 / 32 px — pick from this list, never invent a 15px or a 17px.
- **Radius scale:** 8 / 12 / 16 / 20 / 28 / 999px (pill).
- **Color roles:** primary, secondary, tertiary, surface, background, error, success, warning — each a single token.
- **Motion:** standard / emphasized easing, durations 100/200/300/400/500ms.
- **Component shapes:** a button is *always* the same height and radius; a card is *always* the same surface tier and padding.

### ✅ DO

```css
:root {
  --sp-1: 4px;  --sp-2: 8px;   --sp-3: 12px;  --sp-4: 16px;
  --sp-5: 20px; --sp-6: 24px;  --sp-8: 32px;  --sp-10: 40px;
  --r-sm: 12px; --r-md: 16px;  --r-lg: 20px;  --r-pill: 999px;
}

.card         { padding: var(--sp-4); border-radius: var(--r-sm); background: var(--surface-2); }
.card--large  { padding: var(--sp-6); border-radius: var(--r-md); background: var(--surface-2); }
/* Same shape, same surface, only padding + radius scale up. Predictable. */

.btn          { height: 44px; padding: 0 var(--sp-4); border-radius: var(--r-pill); font-weight: 600; }
.btn--lg      { height: 52px; padding: 0 var(--sp-6); }
/* Same shape, just taller. The user instantly recognizes "this is a button". */
```

### ❌ DON'T

```css
/* Each card is its own little snowflake. */
.card-a { padding: 12px; border-radius: 8px; background: #fff; box-shadow: 0 2px 4px #0001; }
.card-b { padding: 15px; border-radius: 10px; background: #fafafa; box-shadow: 0 1px 3px #0002; }
.card-c { padding: 20px; border-radius: 6px;  background: #f5f5f5; box-shadow: 0 4px 8px #0003; }
/* These are visually "almost the same" but never quite, which is worse than being obviously different. */
```

**Why this fails:** The user's brain keeps noticing "this one is slightly different" and re-engaging with the chrome instead of the content. Micro-inconsistencies are a tax on attention.

---

## 3. Feedback

Every interaction — hover, focus, active (press), disabled, loading, success, error — must produce a visible response within ~100ms. If the user clicks and nothing changes on screen, they assume the click didn't register, and they click again (often double-submitting).

Feedback is the UI telling the user **"I heard you. Here's what's happening."**

### States every interactive element must have

| State     | What it signals                              | Implementation |
|-----------|----------------------------------------------|----------------|
| Default   | Resting state, ready.                        | Base styles. |
| Hover     | Cursor is over it; it's clickable. (Desktop only.) | `:hover` — slight bg change or lift. |
| Focus     | Keyboard / assistive-tech focus is here.    | `:focus-visible` — visible outline (never `outline: none` without a replacement). |
| Active    | Currently being pressed.                     | `:active` — slightly darker bg or scale(0.98). |
| Disabled  | Not currently actionable.                    | `:disabled` — reduced opacity (0.38), `pointer-events: none`, no hover/focus. |
| Loading   | Action is in progress; wait.                 | Spinner, shimmer, or button → loading state. |
| Success   | Action completed.                            | Brief color/Icon change (1–2s) then revert. |
| Error     | Action failed.                               | Red outline, inline message, or toast. |

### ✅ DO

```css
.btn {
  background: var(--primary);
  color: var(--on-primary);
  transition: background-color 100ms, transform 100ms, box-shadow 100ms;
}
.btn:hover         { background: var(--primary-hover); }                       /* desktop lift */
.btn:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; } /* keyboard */
.btn:active        { transform: scale(0.98); }                                  /* press */
.btn:disabled      { opacity: 0.38; pointer-events: none; cursor: not-allowed; }
.btn.is-loading    { color: transparent; }                                      /* spinner shows through */
.btn.is-loading::after {
  content: ""; position: absolute; inset: 0; margin: auto;
  width: 18px; height: 18px; border: 2px solid var(--on-primary); border-top-color: transparent;
  border-radius: 50%; animation: spin 700ms linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
```

### ❌ DON'T

```css
.btn { background: var(--primary); color: var(--on-primary); }
/* No :hover, no :focus-visible, no :active, no :disabled.
   The button looks identical in every state.
   The user can't tell whether they've hovered, focused, or pressed it. */
```

```html
<button onclick="submit()">Save</button>
<!-- After click, nothing changes for 2 seconds while the request is in flight.
     The user clicks again. Two requests go out. -->
```

**Why this fails:** Without feedback, the user has no confidence the system registered their action. They retry, which causes duplicate writes, race conditions, and frustration.

---

## 4. Affordance

An element should **look how it behaves**. A button should look pressable. A link should look clickable. A text input should look typeable. A draggable handle should look grabbable.

The classic affordance violations are: a `<div>` styled to look like a button but missing `cursor: pointer` and `role="button"`; a flat gray rectangle that's actually a text input but looks like a label; an icon with no `aria-label` that the user can't tell is clickable.

### The affordance checklist

- Buttons: pill or rounded rect, brand color, `cursor: pointer`, visible press state.
- Links: underlined or distinct color, `cursor: pointer`.
- Inputs: visible border or filled surface, `cursor: text`, `:focus-visible` ring.
- Draggable: `cursor: grab` (and `cursor: grabbing` while dragging); often a ⋮⋮ handle icon.
- Icon buttons: 44×44px hit area, `aria-label`, visible hover/focus state.
- Disabled: reduced opacity, `cursor: not-allowed`, no hover state.

### ✅ DO

```css
.text-input {
  background: var(--surface-2);
  border: 1px solid var(--outline);
  border-radius: var(--r-sm);
  padding: var(--sp-3) var(--sp-4);
  cursor: text;                 /* tells the user "you can type here" */
  transition: border-color 100ms, background-color 100ms;
}
.text-input:focus-visible {
  outline: none;
  border-color: var(--primary);
  background: var(--surface-3); /* darker surface = "this field is active" */
}

.icon-button {
  width: 44px; height: 44px;    /* affordance: big enough to tap */
  display: grid; place-items: center;
  border-radius: var(--r-pill);
  cursor: pointer;
  color: var(--on-surface-variant);
}
.icon-button:hover { background: var(--surface-3); color: var(--on-surface); }
```

```html
<button class="icon-button" aria-label="Search">
  <svg width="24" height="24" aria-hidden="true">…</svg>
</button>
```

### ❌ DON'T

```css
.thing {
  background: #eee;             /* looks like a label, not a button */
  /* no cursor, no border, no radius */
}
```
```html
<div class="thing" onclick="doStuff()">Click me</div>
<!-- A screen reader sees a generic div. A mouse user sees a gray box.
     Nobody can tell this is interactive until they accidentally hover and see it has no cursor change either. -->
```

**Why this fails:** Affordance is the contract between what the UI *looks like* and what it *does*. Violate the contract and users either miss the affordance (don't click when they should) or expect an affordance that isn't there (click something that isn't a button).

---

## 5. White space

White space (negative space) is the gaps *between* elements, *around* elements, and *inside* elements. It is not "empty" — it is the visual rest that lets each element be perceived as distinct.

Beginner / AI-tell mistake: cramming everything together to "fit more content." The result is a wall of noise. More white space → easier scanning, higher perceived quality, fewer errors.

### White-space rules of thumb

- **Inside a component:** padding 12–20px minimum. Text should not touch its container edge.
- **Between sibling components:** 8–16px for tight groupings (chips in a row), 16–24px for normal list items, 32–48px between sections.
- **Around the screen:** 16–24px gutter on mobile, 24–40px on tablet, 32–80px on desktop.
- **Sections need MORE white space than you think.** When in doubt, double the gap.

### ✅ DO

```css
.screen           { padding: var(--sp-4) var(--sp-4) var(--sp-10); }    /* 16px gutter, 40px bottom */
.section          { margin-bottom: var(--sp-8); }                        /* 32px between sections */
.section:last-child { margin-bottom: 0; }
.card             { padding: var(--sp-4); }                              /* 16px inside */
.card + .card     { margin-top: var(--sp-3); }                           /* 12px between cards in a list */
.chip + .chip     { margin-left: var(--sp-2); }                          /* 8px between chips */
```

### ❌ DON'T

```css
.screen { padding: 8px; }       /* everything pressed against the edges */
.card   { padding: 4px; }       /* text touches the card border */
.card + .card { margin-top: 2px; }  /* cards visually merge into one block */
/* The screen reads as a dense grey wall. Users skip it. */
```

**Why this fails:** Without white space, the eye can't chunk content into groups. Everything merges into noise. The cognitive cost of parsing the screen goes up, and users bounce.

---

## 6. Alignment

Every element on a screen should align to a shared vertical grid (and, where relevant, a horizontal baseline). Misalignment of even 1–2px is perceptible as "something feels off," even if the user can't articulate why.

### Alignment rules

- Pick a gutter width (16px mobile, 24–40px desktop) and align every screen-edge element to it.
- Pick a type-scale baseline (4px) and snap every element height + padding to it.
- Text in adjacent columns should baseline-align (use `align-items: baseline` in flex).
- Icon + text pairs: center-align icon to the cap height of the text, not to the box height.

### ✅ DO

```css
.screen { padding-inline: var(--sp-4); }                 /* 16px gutter everywhere */
.row    { display: flex; align-items: center; gap: var(--sp-3); }
.row .icon { width: 24px; height: 24px; flex-shrink: 0; } /* icon column is fixed, text aligns */
.row .text { min-width: 0; }                              /* allow text to wrap/truncate */

/* 12-column grid on tablet+ */
@media (min-width: 600px) {
  .grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: var(--sp-4); }
  .col-6 { grid-column: span 6; }
  .col-4 { grid-column: span 4; }
}
```

### ❌ DON'T

```css
/* Random inline padding. Icons different sizes. Text baselines drift. */
.card-a { padding: 12px 14px 11px 16px; }
.card-b { padding: 14px 12px 13px 15px; }
.icon-x { width: 22px; } .icon-y { width: 26px; }
/* The eye perceives "everything is slightly off" even though no single value is wrong. */
```

**Why this fails:** Misalignment reads as "this was made by someone who doesn't care." Whether that's true or not, the user's perception of quality drops. Alignment is the cheapest quality lever available — use it.

---

## 7. Contrast

Contrast has two jobs: **legibility** (text vs background) and **distinction** (one element vs another). Both must hit WCAG AA minimums (see `accessibility.md` for the full spec).

### Contrast rules

- **Body text:** ≥ 4.5:1 contrast against its background. Verify, don't eyeball — your monitor lies.
- **Large text** (≥ 18.66px bold or ≥ 24px regular): ≥ 3:1.
- **UI components** (button borders, icon strokes, focus rings): ≥ 3:1 against adjacent colors.
- **Non-text content** (charts, diagrams): ≥ 3:1 for the meaningful parts.

### ✅ DO

```css
:root {
  /* Dark theme: dark bg, light text. Easy to hit 4.5:1. */
  --bg:               #14111f;
  --on-bg:            #e6e0f0;   /* contrast vs --bg ≈ 14:1 ✓ */
  --on-bg-variant:    #c9c1d6;   /* contrast vs --bg ≈ 10:1 ✓ */
  --surface-2:        #221e33;
  --on-surface-2:     #e6e0f0;   /* still ~12:1 ✓ */

  /* Don't use --on-bg-variant for body copy if its contrast drops below 4.5:1.
     Reserve it for secondary labels, captions, hints. */
}
```

### ❌ DON'T

```css
body { color: #999; background: #fff; }   /* contrast ≈ 2.85:1 — fails WCAG AA */
.hint { color: #bbb; }                    /* contrast ≈ 1.9:1 — fails even AA Large */
/* Looks "subtle and elegant" on a calibrated monitor; is unreadable in sunlight
   and illegal for accessibility compliance. */
```

**Why this fails:** Low-contrast text is unreadable for anyone over 40, anyone in bright ambient light, anyone with low-vision, and anyone using a screen with poor calibration. It's not a style choice — it's a usability bug.

---

## 8. Simplicity

Remove the unnecessary. Every element on the screen should justify its existence. If you can ship the same value with fewer components, fewer words, fewer buttons, fewer columns — do it.

AI agents especially struggle with this one: the instinct is to "add more features to be helpful." Resist. A UI with 3 features that all work is better than a UI with 12 features that are all half-baked.

### Simplicity rules

- **One primary action per screen.** If there are two, demote one to secondary.
- **Default to one column on mobile.** Two columns only when the content genuinely pairs.
- **Cut words.** "Submit your response" → "Submit." "There are no items to display" → "Nothing here yet."
- **Cut fields.** Every form field is a tax. Ask: can the system infer this? Can it be asked later?
- **Cut states.** If a button has 6 visually distinct states, you have too many states.
- **Cut features.** Ship the smallest version that solves the user's actual problem. Add features when users ask.

### ✅ DO

```html
<!-- A settings screen: 3 sections, each with 1 primary action and a couple of toggles. -->
<section>
  <h2>Account</h2>
  <button class="btn btn--primary">Sign out</button>
</section>
<section>
  <h2>Notifications</h2>
  <label class="toggle"><input type="checkbox" checked> Email</label>
  <label class="toggle"><input type="checkbox"> Push</label>
</section>
<section>
  <h2>Theme</h2>
  <segmented-control>System / Light / Dark</segmented-control>
</section>
```

### ❌ DON'T

```html
<!-- A settings screen with 12 sections, 47 toggles, 3 nested sub-pages,
     a "power user" mode, integrations with 9 third-party services,
     and a "what's new" banner that can't be dismissed. -->
<!-- The user opens it to change one thing and gives up. -->
```

**Why this fails:** Complexity compounds. Every added feature is one more thing the user has to scan past, one more code path to test, one more reason the page loads slowly. Simplicity is a feature — usually the most valuable one.

---

## How to use this file as a checklist

After generating any UI, walk through these 8 questions:

1. **Hierarchy:** Can I find the primary action in <1 second? Is there a clear visual anchor?
2. **Consistency:** Are all buttons the same shape? All cards the same padding? All spacing from the same scale?
3. **Feedback:** Does every interactive element have hover, focus, active, and disabled states? Does submit show a loading state?
4. **Affordance:** Do clickable things look clickable? Do inputs look typeable? Are icon buttons labeled?
5. **White space:** Is there breathing room between sections? Does text touch container edges?
6. **Alignment:** Does everything snap to the gutter / grid / baseline?
7. **Contrast:** Does body text hit 4.5:1? Did I verify with a contrast checker?
8. **Simplicity:** Can I remove one element and still ship the value?

If the answer to any question is "no" or "I'm not sure," fix it before shipping.

---

## See also

- [`ai-ui-mistakes.md`](./ai-ui-mistakes.md) — the failure modes that result when these principles are violated, with concrete fixes.
- [`accessibility.md`](./accessibility.md) — contrast and focus in depth.
- [`color-theory.md`](./color-theory.md) — color roles and hierarchy.
- [`typography-basics.md`](./typography-basics.md) — size + weight hierarchy in depth.
- [`mobile-first-design.md`](./mobile-first-design.md) — touch targets, thumb zone, simplicity under constraint.

---

*Last updated: design system documentation pass.*
