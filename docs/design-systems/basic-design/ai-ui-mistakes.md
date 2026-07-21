# ai-ui-mistakes.md

> The 13 most common mistakes AI agents make when generating UI — and a concrete fix for each. Read this **before** generating any UI to avoid the failure modes; re-read it **after** generating UI as a verification checklist.
>
> This is the file that separates "AI-generated UI that ships" from "AI-generated UI that gets thrown away."

---

## Why this file exists

LLMs that generate UI without an explicit anti-pattern list default to a recognizable house style: flat cards, indigo gradient buttons, low-contrast gray text, 12px touch targets, `box-shadow` elevation, no personality. This file catalogs those failure modes so you can:

1. **Predict** them before generating.
2. **Detect** them after generating.
3. **Fix** them with the specific CSS / structural change given for each.

Every mistake below has three sections: **The mistake** (what it looks like), **Why it's bad** (the user/system impact), and **How to fix it** (the concrete change).

---

## The 13 mistakes (quick list)

1. Generic "clean and modern" descriptor → produces generic output.
2. Flat cards with no elevation or depth.
3. Inconsistent spacing (uneven gaps).
4. Low contrast text.
5. Small touch targets (< 44px).
6. Generic color schemes (indigo/blue defaults).
7. No personality or branding.
8. Forgetting to verify the result.
9. Over-complicating with too many features.
10. Ignoring platform conventions (mobile vs desktop).
11. Not using a proper type scale.
12. Using `box-shadow` for elevation instead of tonal surfaces.
13. *(See also: ignoring accessibility — covered in `accessibility.md`, but cross-referenced below where relevant.)*

---

## 1. Generic "clean and modern" descriptor → produces generic output

### The mistake
The prompt is something like *"Make a clean, modern settings page"* with no further constraints. The model leans on the safest possible interpretation: lots of white space, indigo accent, sans-serif, flat cards, generic icons. The output technically matches the words but has no information about *what kind* of clean and modern.

### Why it's bad
"Clean and modern" is content-free. It gives the model permission to pick its defaults — and LLM UI defaults are exactly the failure modes in mistakes #2–#7. You get a UI that any other LLM would also produce, which means your UI is interchangeable with every other AI-generated UI on the internet. No brand, no opinion, no soul.

### How to fix it
Replace adjectives with **specifics**. Before generating, define:

- **Color palette:** name 2–4 specific roles + their hex/tonal values. (See `color-theory.md`.)
- **Type scale:** name the font family and 3–5 specific sizes. (See `typography-basics.md`.)
- **Spacing scale:** name the base grid (4px) and 3–4 tokens.
- **Component shape:** name the radius (e.g. "12px rounded, pill buttons").
- **Reference:** "Like [specific app] but with [specific difference]."

**Bad prompt:**
> "Make a clean, modern profile screen."

**Good prompt:**
> "Make a mobile profile screen. Dark theme, M3 purple palette (primary #d0bcff, surface-2 #221e33, on-surface #e6e0f0). Roboto. Type scale: title 22px/600, body 14px/400, label 12px/500 uppercase +0.08em. 4px spacing grid. Cards on surface-2, 12px radius, 16px padding. Pill buttons, 52px tall. Bottom nav floating, 28px radius. Touch targets ≥ 44px. See `/docs/design-systems/material-3-expressive/` for tokens."

The second prompt can't produce a generic result because every decision is pinned down.

---

## 2. Flat cards with no elevation or depth

### The mistake
Every card is `background: white; border: 1px solid #eee;` — visually indistinguishable from the page background. The list of cards reads as one continuous block of content rather than discrete items.

### Why it's bad
- The user can't tell where one card ends and the next begins without reading.
- Scanning is slower because there's no visual chunking.
- The UI feels low-effort and dated (early-2010s flat-design hangover).
- When everything is the same elevation, nothing can be emphasized via elevation.

### How to fix it
Give cards a **different surface tone** from the page background. In M3 (see `material-3-expressive/elevation.md`), the page is `--bg` and cards are `--surface-2` (one tonal step lighter in dark theme, one step darker in light theme). This is **tonal elevation**, not `box-shadow`.

```css
/* ✅ DO: tonal elevation */
:root[data-theme="dark"] {
  --bg:        #14111f;
  --surface-1: #1b1729;
  --surface-2: #221e33;  /* cards live here — visibly lighter than bg */
  --surface-3: #2a2540;  /* higher-elevation elements (sheets, dropdowns) */
}
.page { background: var(--bg); }
.card { background: var(--surface-2); border-radius: 12px; padding: 16px; }
/* No border needed — the tonal difference is the separation. */

:root[data-theme="light"] {
  --bg:        #fef7ff;
  --surface-1: #f3edf7;
  --surface-2: #ece6f0;  /* cards slightly darker than bg in light theme */
  --surface-3: #e6e0ec;
}
```

```css
/* ❌ DON'T: flat with no separation */
.card { background: white; border: 1px solid #eee; border-radius: 8px; }
body  { background: white; }
/* Card and page are the same color. The 1px border is the only separation,
   which disappears in bright sunlight and on low-DPI screens. */
```

If you must use a flat (single-tone) surface, use a **1px border at sufficient contrast** (≥ 3:1 against the surface), not `#eee`.

---

## 3. Inconsistent spacing (uneven gaps)

### The mistake
Padding values are `12px`, `15px`, `14px`, `20px`, `12px`, `18px` scattered through the CSS — none of them on a shared grid. Gaps between list items are `8px` in one place and `10px` in another for no reason. Margin collapses in unexpected ways.

### Why it's bad
- The eye perceives inconsistency as "off" even when no single value is wrong.
- Maintaining the CSS is impossible: changing "the gap between cards" means hunting through 15 rules.
- Spacing decisions are unreviewable because there's no principle to compare against.

### How to fix it
Define a **4px-base spacing scale** as CSS custom properties, then only ever use those tokens. Never hardcode a raw pixel value for padding, margin, or gap.

```css
:root {
  --sp-1: 4px;   --sp-2: 8px;   --sp-3: 12px;  --sp-4: 16px;
  --sp-5: 20px;  --sp-6: 24px;  --sp-8: 32px;  --sp-10: 40px;
}

/* ✅ DO: only tokens, never raw px */
.card { padding: var(--sp-4); }
.card + .card { margin-top: var(--sp-3); }
.section { margin-bottom: var(--sp-8); }

/* ❌ DON'T: raw pixel values sprinkled around */
.card-a { padding: 12px; }
.card-b { padding: 15px; }
.card-c { padding: 14px; }
```

See `material-3-expressive/spacing.md` for the full token system; it's the reference implementation of this rule.

---

## 4. Low contrast text

### The mistake
Body text is `color: #999` on `background: #fff` (contrast ≈ 2.85:1). Hints are `color: #bbb` (contrast ≈ 1.9:1). Looks subtle on a calibrated monitor; unreadable in any other condition.

### Why it's bad
- **Fails WCAG AA** (4.5:1 for body text, 3:1 for large text). The UI is non-compliant and can't ship to enterprise/government/education customers.
- **Unreadable in real conditions:** sunlight, low-quality screens, aging eyes, low-vision users.
- Reads as "designed by someone who doesn't care" even to users who can technically read it.

### How to fix it
Verify every text/background pair with a contrast checker (browser DevTools, WebAIM, or `chrome://flags`). Pick text colors that hit **4.5:1 minimum** for body and **3:1** for large text.

```css
:root[data-theme="light"] {
  --bg: #fef7ff;
  --on-bg:            #1d1b20;   /* contrast ≈ 16:1 ✓ for headings + body */
  --on-bg-variant:    #49454f;   /* contrast ≈ 9:1 ✓ for secondary text */
  /* ❌ never: --on-bg-faint: #999; → 2.85:1 fail */
  /* ⚠️ only for non-essential decoration: --on-bg-disabled: #76716f; → 4.6:1 (just barely passes, use sparingly) */
}

:root[data-theme="dark"] {
  --bg: #14111f;
  --on-bg:            #e6e0f0;   /* contrast ≈ 14:1 ✓ */
  --on-bg-variant:    #c9c1d6;   /* contrast ≈ 10:1 ✓ */
}
```

**Rule of thumb:** if you're tempted to use `#aaa`–`#ccc` on white, you're wrong. Either make it darker (≥ `#767676`) or restructure the UI so the text isn't secondary in the first place.

See `accessibility.md` § Color contrast for the full WCAG reference.

---

## 5. Small touch targets (< 44px)

### The mistake
Buttons are 28px tall. Icon buttons are 24×24px. List rows are 32px tall. Everything fits on screen but none of it is comfortably tappable.

### Why it's bad
- **Fails WCAG 2.5.5** (minimum target size 44×44px) and Apple HIG (44pt minimum).
- **Mis-taps:** users hit the wrong button, especially on phones with cases or with motor impairments.
- **Especially bad in the thumb zone** where the user can't see what they're tapping because their hand is in the way.

### How to fix it
Set a hard floor: **44×44px minimum, 48px preferred** for every interactive element. Use the `padding` + `min-height` combo, not a fixed `height`, so text scaling still works.

```css
/* ✅ DO: 44px minimum, achieved with min-height + padding so it scales */
.btn {
  min-height: 44px;
  min-width: 44px;
  padding: var(--sp-3) var(--sp-4);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--sp-2);
}

.icon-button {
  width: 44px; height: 44px;
  display: grid; place-items: center;
}

.list-row {
  min-height: 48px;            /* taller because rows are stacked, more forgiving */
  display: flex; align-items: center; gap: var(--sp-3);
  padding: var(--sp-3) var(--sp-4);
}

/* If a visually-small button is required (e.g. icon in a dense toolbar),
   keep the visual size small but extend the hit area with padding
   and don't overlap neighbors. */
.compact-icon-btn {
  width: 32px; height: 32px;       /* visual */
  /* hit area extended via transparent padding: */
  position: relative;
}
.compact-icon-btn::before {
  content: ""; position: absolute; inset: -6px;  /* +12px each axis → 44px hit area */
}
```

```css
/* ❌ DON'T */
.btn { height: 28px; padding: 4px 8px; }
.icon-btn { width: 24px; height: 24px; }
/* Nobody can reliably tap these with a thumb. */
```

See `mobile-first-design.md` § Touch targets and `accessibility.md` § Touch target size.

---

## 6. Generic color schemes (indigo/blue defaults)

### The mistake
The AI reaches for `#6366f1` (Tailwind indigo-500) or `#3b82f6` (blue-500) as the primary color. Buttons, links, focus rings — all indigo. The result looks like every Vercel/Linear clone on the internet.

### Why it's bad
- **No brand identity.** Indigo is the AI-tell. Reviewers can spot it instantly.
- **No emotional resonance.** Color carries meaning; indigo carries none because it's been used for everything.
- **Repo policy violation.** This repo explicitly forbids indigo/blue as primary (see `color-theory.md` § Color policy).

### How to fix it
Pick a palette with intentionality. Approved palettes in this repo:

| Palette               | When to use                                            | Tokens live in |
|-----------------------|--------------------------------------------------------|----------------|
| Warm earth tones      | Warm/organic prototypes (food, lifestyle, content).    | `color-theory.md` |
| Purple M3 palette     | M3 prototypes (Material You aesthetic).                | `material-3-expressive/color-system.md` |
| Other                 | Only if explicitly required; document the reason.      | (prototype's own README) |

```css
/* ✅ DO: warm earth tones */
:root {
  --primary:        #c2410c;   /* burnt orange */
  --primary-hover:  #9a3412;
  --on-primary:     #fef3c7;
  --surface:        #faf6f0;   /* cream */
  --surface-2:      #f3ebe0;   /* beige */
  --on-surface:     #3d2817;
  --accent:         #d97706;   /* amber */
}

/* ✅ DO: M3 purple (for M3 prototypes) */
:root[data-theme="dark"] {
  --primary:        #d0bcff;
  --on-primary:     #381e72;
  --primary-container: #4f378b;
  --bg:             #14111f;
  --surface-2:      #221e33;
  --on-surface:     #e6e0f0;
}

/* ❌ DON'T: indigo / Tailwind blue */
:root { --primary: #6366f1; }   /* forbidden in this repo */
:root { --primary: #3b82f6; }   /* also forbidden */
```

---

## 7. No personality or branding

### The mistake
The UI has no signature element. It could be a stock template. There's no logo, no custom illustration, no distinctive motion, no typography choice, no signature color. It is technically correct and emotionally inert.

### Why it's bad
- **Unmemorable.** Users forget they used it 10 minutes later.
- **Un differentiated.** In a competitive space, bland loses.
- **Often a sign the AI did the minimum.** Personality usually requires intentional choices the AI won't make unprompted.

### How to fix it
Add **one** signature element. Not five — one. Pick from:

- A distinctive **type pairing** (e.g. a serif display font for titles + sans body).
- A signature **color** used consistently for the brand mark.
- A custom **illustration style** (even simple geometric shapes, used consistently).
- A signature **motion** (e.g. cards stagger in 40ms apart, sheet slides up with emphasized easing).
- A custom **logo / wordmark**.
- A distinctive **shape language** (e.g. everything is 28px radius, or everything has a 4px accent border).

```css
/* ✅ DO: one signature — here, the warm amber accent + 28px radius everywhere */
:root {
  --accent: #d97706;
  --r-signature: 28px;
}
.card, .btn, .sheet { border-radius: var(--r-signature); }
.brand-mark { color: var(--accent); }

/* ✅ DO: signature motion — cards stagger in */
.card { animation: cardIn 300ms cubic-bezier(.05,.7,.1,1) both; }
.card:nth-child(1) { animation-delay: 0ms; }
.card:nth-child(2) { animation-delay: 40ms; }
.card:nth-child(3) { animation-delay: 80ms; }
/* (in JS, use card.style.animationDelay = (i*40)+'ms' for arbitrary counts) */
```

```css
/* ❌ DON'T: 8px radius everywhere, gray-on-white, Inter, no accent. */
/* That's the "I asked ChatGPT for a UI" look. */
```

---

## 8. Forgetting to verify the result

### The mistake
The AI generates the HTML/CSS/JS, the agent moves on to the next task. Nobody opens the page in a browser, runs the contrast checker, tries keyboard navigation, resizes the viewport, or clicks through the user flow. The UI ships broken.

### Why it's bad
- **AI-generated UI is wrong ~30–50% of the time** in subtle ways: contrast that looks fine to the model but fails WCAG, hover states that don't actually trigger, responsive breakpoints that break at the wrong width, z-index stacking issues, focus traps, etc.
- **The cost of catching it now is minutes. The cost of catching it after deploy is hours to days.**
- **Users lose trust** when shipped UI is visibly broken.

### How to fix it
After generating UI, run **this verification checklist** before marking the task done:

1. **Open it in a real browser.** Not just a screenshot — actually load the HTML. Use the `agent-browser` skill if available.
2. **Resize through every breakpoint.** 360 / 414 / 600 / 768 / 1024 / 1280. Does anything overflow? Does anything collapse to one column too early or too late?
3. **Tab through with the keyboard.** Can you reach every interactive element? Is the focus ring visible? Does the order make sense?
4. **Click every button.** Does each one have hover/active/disabled states? Does anything throw a console error?
5. **Check contrast** with the browser's built-in tooling (DevTools → accessibility tab) or WebAIM's contrast checker.
6. **Turn on `prefers-reduced-motion`.** Does the page still work without animation?
7. **Test in both light and dark theme** (if applicable).
8. **Walk through `ai-ui-mistakes.md` items #1–#7 and #9–#12** as a checklist on the actual rendered output.

If any step fails, fix it before shipping. **Do not skip verification because the AI said "done."**

---

## 9. Over-complicating with too many features

### The mistake
The agent interprets "build a profile page" as "build a profile page with avatar upload, cover photo, bio editor, link editor, social links, privacy settings, notification preferences, theme picker, language picker, account deletion flow, export-data flow, and a 'what's new' modal." All of it half-working.

### Why it's bad
- **Each added feature is a bug surface.** Shipping 12 half-working features is worse than shipping 3 fully-working features.
- **The user is overwhelmed.** A profile screen with 12 sections is harder to use than one with 3.
- **The agent's attention is diluted.** Less time per feature = lower quality per feature.
- **Cost and latency go up.** More JS, more API calls, more state.

### How to fix it
**Scope ruthlessly.** Before generating, write down the **single user job** the screen enables. Ship only what's required to do that job. If a feature doesn't directly serve the job, cut it. Defer it to a future iteration.

```
Bad scope: "Build a profile page."
  → Agent fills 12 sections, half work.

Good scope: "Build a profile page whose only job is to let the user
   change their display name and avatar. Two sections, two fields,
   one save button. No settings, no preferences, no exports."
  → Agent fills 2 sections, both work, both are polished.
```

When in doubt, ship less. Adding features later is easy; removing shipped features is hard.

See `what-makes-good-ui.md` § Simplicity.

---

## 10. Ignoring platform conventions (mobile vs desktop)

### The mistake
The agent builds a "responsive" UI that's actually just a desktop layout with `@media (max-width: 768px) { padding: 8px; }` slapped on top. Mobile users get a cramped desktop UI. Or the agent builds a mobile-first UI and ships it to desktop without adapting — desktop users get a giant phone-sized screen with everything centered.

### Why it's bad
- **Mobile users can't use desktop layouts.** Text is too small, hit targets are tiny, hover-only states are unreachable.
- **Desktop users can't use mobile layouts.** Everything is too big, navigation is hidden behind a hamburger that doesn't need to exist, multi-column opportunities are missed.
- **Violates platform expectations** (iOS users expect swipe-back; desktop users expect right-click).

### How to fix it
**Start mobile-first**, then layer desktop enhancements. The mobile layout is the constraint that forces simplicity; the desktop layout is the relaxation that adds density.

```css
/* ✅ DO: mobile-first, progressive enhancement */
.card {
  /* mobile default: single column, generous touch targets */
  padding: var(--sp-4);
  border-radius: var(--r-sm);
}

@media (min-width: 600px) {
  /* tablet: tighter padding, still single column */
  .card { padding: var(--sp-5); }
}

@media (min-width: 1024px) {
  /* desktop: multi-column grid, denser layout, hover states enabled */
  .card-grid { grid-template-columns: repeat(3, 1fr); gap: var(--sp-4); }
  .card { padding: var(--sp-6); }
  .card:hover { transform: translateY(-2px); }  /* hover only meaningful on desktop */
}

/* Adapt patterns to platform: */
/* - Mobile: bottom nav, hamburger, swipe gestures, large tap targets. */
/* - Desktop: top nav, sidebars, hover menus, keyboard shortcuts, dense tables. */
/* - Don't ship a hamburger on desktop. Don't ship a top nav bar on mobile. */
```

**Platform convention cheat-sheet:**

| Pattern               | Mobile                       | Desktop                          |
|-----------------------|------------------------------|----------------------------------|
| Primary navigation    | Bottom nav or hamburger      | Top nav bar or persistent sidebar |
| Primary action        | FAB or sticky bottom button  | Top-right button or in-toolbar   |
| Hover states          | Skip (no hover on touch)     | Yes (`:hover`)                   |
| Modals                | Bottom sheet (slide up)      | Centered dialog                  |
| Form fields           | One per row, full-width      | Can be 2-up or grid              |
| Touch targets         | ≥ 44px                       | ≥ 32px (mouse is precise)        |
| Scroll direction      | Vertical, paginated          | Vertical or horizontal, infinite |

---

## 11. Not using a proper type scale

### The mistake
Font sizes are `12px`, `14px`, `16px`, `17px`, `20px`, `24px`, `26px`, `32px`, `36px`, `40px` — a random selection from the entire integer range. Some are close enough to look like mistakes (`16px` vs `17px`); some are arbitrary (`36px`).

### Why it's bad
- **Inconsistent rhythm.** The eye perceives type as a scale; arbitrary sizes break the rhythm.
- **Maintenance pain.** "The body text feels too small" → which of the 5 body-ish sizes do you change?
- **Hierarchy becomes ambiguous.** If `20px` and `24px` are both used for subheadings, why?
- **AI-tell.** Hand-tuned type scales are a designer signature; random sizes are an AI tell.

### How to fix it
Pick a **modular scale** and only use values from it. Common choices:

```css
/* ✅ DO: M3 scale (the repo default — see material-3-expressive/typography.md) */
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

/* ✅ DO: 1.2 modular scale (alternative) */
/* 12, 14.4, 17.3, 20.7, 24.9, 29.9 → round to 12, 14, 17, 21, 25, 30 */
:root {
  --fs-1: 12px;  --fs-2: 14px;  --fs-3: 17px;
  --fs-4: 21px;  --fs-5: 25px;  --fs-6: 30px;  --fs-7: 36px;
}

/* ❌ DON'T: arbitrary sizes scattered through CSS */
h1 { font-size: 36px; }
h2 { font-size: 24px; }
h3 { font-size: 20px; }
.x { font-size: 17px; }
.y { font-size: 14px; }
.z { font-size: 13px; }
.why { font-size: 22px; }  /* what is this for? */
```

See `typography-basics.md` for the full reference.

---

## 12. Using `box-shadow` for elevation instead of tonal surfaces

### The mistake
Every elevated element gets `box-shadow: 0 4px 12px rgba(0,0,0,0.1)`. Cards, dropdowns, sheets, modals — all differentiated only by how many pixels of shadow they cast.

### Why it's bad
- **Inconsistent across themes.** Box shadows read very differently on light vs dark backgrounds. A shadow that lifts a card on white becomes invisible on dark.
- **Performance cost.** Heavy box-shadows are paint-heavy, especially when stacked and animated.
- **Doesn't compose.** A shadow on a card on a sheet on a backdrop looks like a shadow on a shadow on a shadow — visually muddy.
- **M3 explicitly rejects this model.** Material 3 (and the repo's M3 implementation) uses **tonal surfaces** for elevation. See `material-3-expressive/elevation.md` for the full rationale.

### How to fix it
Use **tonal surfaces** for elevation. In dark theme, higher elevation = **lighter** surface tone. In light theme, higher elevation = **darker** surface tone. Reserve `box-shadow` for the rare cases where it's physically correct (a floating element that genuinely casts a shadow on the content below — e.g. a floating bottom nav).

```css
/* ✅ DO: tonal elevation (M3) */
:root[data-theme="dark"] {
  --bg:        #14111f;
  --surface-1: #1b1729;   /* +1 tier — subtle elevation (cards in lists) */
  --surface-2: #221e33;   /* +2 tiers — default card */
  --surface-3: #2a2540;   /* +3 tiers — sheets, dropdowns */
  --surface-4: #332d4c;   /* +4 tiers — dialogs */
  --surface-5: #3d3656;   /* +5 tiers — top-most (rare) */
}
:root[data-theme="light"] {
  --bg:        #fef7ff;
  --surface-1: #f3edf7;   /* +1 tier */
  --surface-2: #ece6f0;   /* +2 tiers */
  --surface-3: #e6e0ec;   /* +3 tiers */
}

.card    { background: var(--surface-2); }      /* elevation via tone */
.sheet   { background: var(--surface-3); }
.dialog  { background: var(--surface-4); }

/* ✅ DO: box-shadow reserved for genuine floating elements only */
.bottom-nav {
  background: var(--surface-3);
  box-shadow: 0 4px 16px rgba(0,0,0,0.25);  /* this actually casts a shadow on the content below */
}
```

```css
/* ❌ DON'T: box-shadow for every elevated thing */
.card   { background: var(--surface); box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
.sheet  { background: var(--surface); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
.dialog { background: var(--surface); box-shadow: 0 16px 48px rgba(0,0,0,0.2); }
/* On a dark theme, the shadows vanish; the three elevations become indistinguishable. */
```

---

## 13. Ignoring accessibility (cross-reference)

This isn't a separate mistake — it's a category that overlaps with #4 (contrast), #5 (touch targets), and others. But it deserves its own line because AI agents consistently under-deliver on a11y.

The full a11y spec is in [`accessibility.md`](./accessibility.md). The minimum bar:

- **Semantic HTML** (`<button>`, `<nav>`, `<main>`, `<section>`, `<article>`), not `<div>` soup.
- **ARIA labels** on every icon-only button.
- **WCAG AA contrast** (4.5:1 body, 3:1 large/UI).
- **Keyboard navigable** (tab order, visible focus ring).
- **Screen reader support** (`sr-only` text, `alt` on images).
- **`prefers-reduced-motion`** respected.
- **Don't rely on color alone** (pair with icon/text).
- **44×44px touch targets.**

If you ship UI that fails any of these, you've shipped broken UI. Read `accessibility.md` end-to-end before generating UI; re-run its checklist after.

---

## How to use this file as a verification checklist

After generating any UI, walk through these 13 questions on the **actual rendered output** (not the source code):

1. Did the prompt pin down palette, type scale, spacing, and shape? (If not, regenerate with specifics.)
2. Do cards have tonal elevation, not just borders?
3. Is every spacing value from a 4px token scale?
4. Does every text/background pair hit WCAG AA?
5. Is every interactive element ≥ 44×44px?
6. Is the primary color **not** indigo or Tailwind blue?
7. Is there at least one signature element (type, color, motion, shape, logo)?
8. Did I open it in a browser, resize, tab, click, and check contrast?
9. Did I ship only what the user job requires?
10. Did I adapt to mobile vs desktop conventions, not just resize?
11. Are all font sizes from a defined scale?
12. Is elevation tonal, not shadow-based (except genuine floating elements)?
13. Does it pass the `accessibility.md` checklist?

If any answer is "no," fix it before marking the task done.

---

## See also

- [`what-makes-good-ui.md`](./what-makes-good-ui.md) — the principles these mistakes violate.
- [`accessibility.md`](./accessibility.md) — a11y in depth (overlaps with #4, #5, #13).
- [`color-theory.md`](./color-theory.md) — palette policy (overlaps with #6).
- [`typography-basics.md`](./typography-basics.md) — type scale reference (overlaps with #11).
- [`mobile-first-design.md`](./mobile-first-design.md) — platform conventions (overlaps with #5, #10).
- [`../material-3-expressive/elevation.md`](../material-3-expressive/elevation.md) — the tonal-elevation reference implementation (overlaps with #2, #12).

---

*Last updated: design system documentation pass.*
