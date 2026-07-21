# color-theory.md

> Color theory basics for UI: color roles, dark vs light theme principles, color harmony, the 60-30-10 rule, and this repo's color policy (no indigo/blue as primary; warm earth tones and purple M3 palette approved).
>
> Read this before picking any color for any UI in this repo.

---

## Why this file exists

Color is the single most impactful design decision and the one AI agents get most wrong. The default failure mode is "indigo primary, white background, gray text" — generic, brand-less, and a known AI-tell. This file gives you:

1. The vocabulary (color **roles**, not just colors).
2. The principles for dark vs light themes.
3. The harmony rules (complementary, analogous, triadic).
4. The 60-30-10 distribution rule.
5. **The repo's color policy** — what's allowed, what's forbidden, and why.

---

## The 7 sections (quick list)

1. **Color roles** — primary, secondary, tertiary, surface, background, error, success, warning.
2. **Dark theme principles** — darker backgrounds, lighter surfaces for elevation.
3. **Light theme principles** — lighter backgrounds, darker surfaces for elevation.
4. **Color harmony** — complementary, analogous, triadic.
5. **60-30-10 rule** — 60% dominant, 30% secondary, 10% accent.
6. **Repo color policy** — no indigo/blue as primary; warm earth tones + purple M3 approved.
7. **Verification** — contrast checking, theme testing.

---

## 1. Color roles

A well-designed UI doesn't pick "colors." It picks **roles**, then assigns a color to each role. The role describes the *function*; the color is the *implementation*. Swap implementations without changing roles, and the UI still works.

### The standard roles

| Role                | Function                                              | Typical color choice                                  |
|---------------------|-------------------------------------------------------|-------------------------------------------------------|
| `primary`           | The brand color. Used for primary actions, brand marks, focus rings, links. | The single most saturated, identifiable color in the palette. |
| `on-primary`        | Text/icon color when placed on a `primary` background. | High-contrast against `primary` (usually white or near-white). |
| `primary-container` | A tonal variant of `primary`, used for tinted surfaces (selected chips, subtle highlights). | `primary` at lower saturation / mixed with surface. |
| `secondary`         | A supporting color. Used for less-important actions, secondary navigation, tonal variety. | A different hue from `primary`, lower saturation. |
| `tertiary`          | A third accent color. Used sparingly for emphasis, contrast, or a third tier of action. | A contrasting hue to `primary` and `secondary`. |
| `background` (`bg`) | The page's base background. The lowest elevation.     | Dark theme: very dark (near-black, often tinted). Light theme: very light (near-white, often warm-tinted). |
| `surface`           | The base color for components (cards, sheets). One step up from `bg`. | Slightly lighter (dark theme) or slightly darker (light theme) than `bg`. |
| `surface-2`, `surface-3`, … | Higher elevation tiers. Each step is more "raised." | Each step lighter (dark theme) or darker (light theme) than the previous. |
| `on-surface`        | Text/icon color on `surface`.                         | High contrast against `surface`. |
| `on-surface-variant`| Secondary text on `surface`.                          | Slightly lower contrast than `on-surface`, still WCAG AA. |
| `outline`           | Borders, dividers, hairlines.                         | A neutral tone, often semi-transparent over the surface. |
| `error`             | Errors, destructive actions.                          | Red (but paired with an icon — see `accessibility.md` §7). |
| `on-error`          | Text/icon color on `error` background.                | White or near-white. |
| `success`           | Success states.                                       | Green (paired with ✓ icon). |
| `warning`           | Warning states.                                       | Amber/orange (paired with ! icon). |
| `info`              | Informational states.                                 | Blue (paired with ℹ icon). |

### ✅ DO: define roles as tokens

```css
:root[data-theme="dark"] {
  /* Brand */
  --primary:           #d0bcff;
  --on-primary:        #381e72;
  --primary-container: #4f378b;
  --on-primary-container: #efdbff;

  --secondary:         #ccc2dc;
  --on-secondary:      #332d41;
  --tertiary:          #efb8c8;
  --on-tertiary:       #492532;

  /* Surfaces (elevation tiers) */
  --bg:                #14111f;
  --surface:           #1b1729;     /* surface-1 */
  --surface-2:         #221e33;
  --surface-3:         #2a2540;
  --surface-4:         #332d4c;
  --surface-5:         #3d3656;

  --on-surface:        #e6e0f0;
  --on-surface-variant:#c9c1d6;
  --outline:           #9b94ad;
  --outline-variant:   #4a4558;

  /* Status */
  --error:             #ffb4ab;
  --on-error:          #690005;
  --success:           #b8f2c8;
  --on-success:        #00391a;
  --warning:           #ffd8a8;
  --on-warning:        #422c00;
  --info:              #b8c8ff;
  --on-info:           #002569;
}
```

### ❌ DON'T: pick colors per element

```css
/* ❌ DON'T: hardcoded colors with no role structure */
.hero-button { background: #d0bcff; color: #381e72; }
.save-button { background: #cab4ff; color: #2e1763; }  /* "another purple" — not a token */
.card         { background: #221e33; }
.modal        { background: #2d2840; }                 /* invented, not on the surface scale */
.error-text   { color: #ff5555; }                      /* not the error token */
/* No structure, no theming, no way to swap palettes. */
```

### Why roles matter

- **Theming:** Swap the entire palette by changing the tokens at `:root`. Every component updates.
- **Consistency:** Two "primary buttons" anywhere in the app are guaranteed to look the same because they both reference `--primary`.
- **Elevation:** Surface tiers (`--surface-1` → `--surface-5`) are a structured elevation system (see §2 and §3 below).
- **Accessibility:** Contrast checks happen at the role level. Verify `--on-surface` vs `--surface-2` once; every card that uses those tokens inherits the verified ratio.

---

## 2. Dark theme principles

Dark themes are not "white text on pure black." They're a structured system where **elevation is communicated by tonal lightening** — higher elevation = lighter surface tone.

### The core principle

> **In dark theme, the background is the darkest tone. Higher-elevation surfaces are progressively lighter.**

This is the opposite of the naive "pure black bg, white cards" approach. Material 3 (and Apple's dark mode, and most well-designed dark themes) all follow this rule.

### Why lighter surfaces for elevation?

1. **Shadows don't work on dark backgrounds.** A drop shadow on a dark bg is invisible. Tonal lightening is the visible signal.
2. **Mimics real-world lighting.** A surface closer to the light source (higher elevation) catches more light, appears lighter.
3. **Reduces eye strain.** Pure black-on-white text creates harsh contrast; tinted dark surfaces soften the contrast while keeping readability.

### The tonal ladder (M3 reference, see `material-3-expressive/color-system.md`)

```css
:root[data-theme="dark"] {
  --bg:        #14111f;   /* darkest — page background */
  --surface-1: #1b1729;   /* +1 tier — subtle cards in lists */
  --surface-2: #221e33;   /* +2 tiers — default card */
  --surface-3: #2a2540;   /* +3 tiers — sheets, dropdowns */
  --surface-4: #332d4c;   /* +4 tiers — dialogs */
  --surface-5: #3d3656;   /* +5 tiers — top-most (rare) */
}
```

Each tier is ~6–8% lighter in lightness (HSL L) than the previous. The hue stays constant (here, a slight purple tint); only the lightness shifts.

### Dark theme contrast

- `--bg` is dark. `--on-bg` (text) must be light, hitting 4.5:1 minimum. Typically a near-white with the same hue tint as the bg: `#e6e0f0` (light purple-tinted white) on `#14111f` gives ~14:1.
- `--on-surface-variant` (secondary text) is slightly dimmer but still passes AA: `#c9c1d6` on `#14111f` is ~10:1.
- Don't use pure white (`#ffffff`) on pure black (`#000000`) — the contrast is ~21:1, which is harsh and creates halation (text appears to glow). Tinted near-white on tinted near-black is easier to read.

### Dark theme anti-patterns

```css
/* ❌ DON'T: pure black + pure white */
body { background: #000; color: #fff; }
.card { background: #fff; color: #000; }   /* inverted card on pure black = brutal halation */

/* ❌ DON'T: shadows for elevation on dark */
.card { background: #1a1a1a; box-shadow: 0 4px 12px rgba(0,0,0,0.5); }
/* The shadow is invisible against #1a1a1a. The card has no visible elevation. */

/* ❌ DON'T: saturated brand colors at full strength */
.btn { background: #6750a4; color: #fff; }
/* Saturated colors read as "shouting" on dark backgrounds.
   M3 uses a tonal variant (lighter, less saturated) for dark theme: #d0bcff. */
```

---

## 3. Light theme principles

Light themes follow the **opposite** rule: the background is the lightest tone, and higher-elevation surfaces are progressively darker.

### The core principle

> **In light theme, the background is the lightest tone. Higher-elevation surfaces are progressively darker.**

### Why darker surfaces for elevation?

1. **Same logic, opposite direction:** shadows work better on light backgrounds (a darker tone reads as "shadow"), but tonal darkening is still more consistent and theme-agnostic.
2. **Visual weight:** a slightly darker card on a lighter bg reads as "more present," which matches the elevation metaphor.
3. **Theme symmetry:** if your dark theme uses tonal lightening, your light theme should use tonal darkening — same structure, opposite direction. Makes theming trivial.

### The tonal ladder (M3 reference, light)

```css
:root[data-theme="light"] {
  --bg:        #fef7ff;   /* lightest — page background */
  --surface-1: #f3edf7;   /* +1 tier */
  --surface-2: #ece6f0;   /* +2 tiers — default card */
  --surface-3: #e6e0ec;   /* +3 tiers — sheets, dropdowns */
  --surface-4: #e3dde9;   /* +4 tiers — dialogs */
  --surface-5: #dfdaef;   /* +5 tiers */
}
```

Each tier is ~2–3% darker in lightness. The light theme has a narrower tonal range than the dark theme because the human eye is more sensitive to small darkening on light backgrounds than small lightening on dark backgrounds.

### Light theme contrast

- `--on-bg` (text) is dark: `#1d1b20` on `#fef7ff` is ~15:1.
- `--on-surface-variant`: `#49454f` on `#fef7ff` is ~9:1.
- Saturated brand colors work at full strength on light backgrounds: `#6750a4` (M3 primary) on `#fef7ff` is ~7:1.

### Light theme anti-patterns

```css
/* ❌ DON'T: pure white + pure black */
body { background: #fff; color: #000; }
/* Works but feels clinical and dated. Tinted near-white + tinted near-black is warmer. */

/* ❌ DON'T: same surface color for everything */
.card, .sheet, .dialog { background: #fff; }
/* On a white bg, the cards disappear. Add a 1px border at 3:1 contrast minimum, or use tonal surfaces. */

/* ❌ DON'T: gray text on white below 4.5:1 */
.hint { color: #999; }   /* 2.85:1 — fail */
.hint { color: #767676; } /* 4.54:1 — just barely passes; use sparingly */
```

---

## 4. Color harmony

Color harmony is about choosing hues that work together. Three classic systems:

### Complementary

Two colors directly opposite on the color wheel. Maximum contrast, maximum vibrance. Use carefully — at full saturation, complementary pairs vibrate visually.

```
        Red ──┐
              │
              │ ←─ complementary
              │
       Teal/Cyan ─┘
```

- **Use for:** high-impact CTAs (the accent stands out from the dominant).
- **Watch out:** vibrating edges when both colors are at full saturation and adjacent. Desaturate one or both.
- **Example:** warm orange `#c2410c` (primary) + cool teal `#0d9488` (accent) on a cream `#faf6f0` background.

### Analogous

Two to five colors adjacent on the color wheel. Calm, cohesive, low contrast. Good for warm/organic themes.

```
   Red-Orange ── Orange ── Amber ── Yellow
```

- **Use for:** cohesive, harmonious palettes. The warm earth tones approved in this repo are analogous (cream → beige → amber → orange).
- **Watch out:** can feel monotonous. Add one complementary accent for punctuation.
- **Example:** cream `#faf6f0` (bg) → beige `#f3ebe0` (surface) → amber `#d97706` (secondary) → orange `#c2410c` (primary).

### Triadic

Three colors evenly spaced on the color wheel (120° apart). Vibrant, balanced, playful.

```
          Color A
            │
   Color C ─┼─ Color B    (120° apart)
```

- **Use for:** playful, energetic brands. Hard to pull off in UI because three saturated hues compete.
- **Watch out:** desaturate two of the three; let one be the dominant.
- **Example:** primary purple `#7c3aed` + secondary teal `#0d9488` + tertiary amber `#d97706`. But see §6 below — purple primary is only for M3 prototypes.

### What to actually pick

For most UIs, **analogous with one complementary accent** is the safest and most flexible:

- 3 analogous colors for the dominant + surfaces + secondary.
- 1 complementary accent for the primary action.

This gives you the cohesion of analogous + the pop of complementary, without the vibrancy of triadic.

---

## 5. The 60-30-10 rule

The 60-30-10 rule is a distribution guideline borrowed from interior design: **60% dominant, 30% secondary, 10% accent.**

### How it applies to UI

| Share | Role                              | Typical implementation                                 |
|-------|-----------------------------------|--------------------------------------------------------|
| 60%   | Dominant — the background.        | `--bg` and `--surface-1` (the page and most flat areas). |
| 30%   | Secondary — surfaces and secondary content. | `--surface-2` cards, `--secondary` tonal elements, neutral text. |
| 10%   | Accent — primary actions, brand marks, key emphasis. | `--primary` buttons, brand mark, focus rings, selected states. |

### ✅ DO

A typical screen:
- 60% is the dark `--bg` showing through the page padding and gutters.
- 30% is `--surface-2` cards and `--on-surface-variant` text.
- 10% is `--primary` on the save button, the active nav item, and the focus ring.

```css
/* The 60-30-10 distribution emerges naturally if you only use --primary for true accents. */
.screen { background: var(--bg); }                           /* 60% */
.card { background: var(--surface-2); color: var(--on-surface-variant); }  /* 30% */
.btn--primary { background: var(--primary); color: var(--on-primary); }     /* 10% */
```

### ❌ DON'T

```css
/* ❌ DON'T: primary everywhere */
.header { background: var(--primary); }
.footer { background: var(--primary); }
.hero { background: var(--primary); }
.cta { background: var(--primary); }
/* 50% of the screen is primary. The brand color is screaming.
   Nothing stands out because everything is the accent. */
```

### Why 60-30-10 works

The eye uses color proportion to identify hierarchy. When 60% is one tone, that tone reads as the "world" — the canvas. When 10% is a contrasting accent, that accent reads as "important" — the eye is drawn to it. Violating 60-30-10 (e.g. 40-40-20) makes everything compete, and the eye can't decide where to look.

---

## 6. Repo color policy

This repo has explicit rules about which palettes are allowed. These are **policy**, not preference.

### ❌ Forbidden: indigo / Tailwind blue as primary

```
Forbidden primaries:  #6366f1 (indigo-500), #3b82f6 (blue-500), #4f46e5 (indigo-600),
                     #2563eb (blue-600), and similar indigo/blue defaults.
```

**Why forbidden:**

1. **AI-tell.** Indigo is the default LLM-generated primary. Using it signals "I didn't think about color."
2. **No brand identity.** Indigo has been used for everything; it carries no meaning.
3. **Generic.** Your UI looks like every other AI-generated UI.
4. **Accessibility trap.** Indigo-on-white is ~4.8:1 — passes AA but barely. Indigo-on-light-gray often fails.

If you're tempted to use indigo or Tailwind blue, **stop and pick an approved palette instead.**

### ✅ Approved: warm earth tones

For warm/organic prototypes (food, lifestyle, content, hospitality, wellness).

```css
:root[data-theme="light"] {
  /* Warm earth tones — light theme */
  --bg:                #faf6f0;   /* cream */
  --surface:           #f3ebe0;   /* beige */
  --surface-2:         #ede2d2;   /* deeper beige */
  --surface-3:         #e3d4bf;
  --on-surface:        #3d2817;   /* dark brown */
  --on-surface-variant:#6b4f33;
  --outline:           #b8a487;

  --primary:           #c2410c;   /* burnt orange */
  --on-primary:        #fef3c7;   /* pale yellow */
  --primary-container: #fed7aa;
  --on-primary-container: #7c2d12;

  --secondary:         #d97706;   /* amber */
  --tertiary:          #65a30d;   /* olive (analogous) */

  --error:             #b91c1c;
  --success:           #15803d;
  --warning:           #d97706;
  --info:              #0369a1;
}

:root[data-theme="dark"] {
  /* Warm earth tones — dark theme (tonal lightening for elevation) */
  --bg:                #1a1410;   /* very dark warm brown */
  --surface:           #241d17;
  --surface-2:         #2d251e;
  --surface-3:         #382e25;
  --on-surface:        #f3e8d8;   /* warm cream */
  --on-surface-variant:#d6c5ac;
  --outline:           #8a7560;

  --primary:           #fb923c;   /* lighter orange for dark bg */
  --on-primary:        #431407;
  --primary-container: #7c2d12;
  --on-primary-container: #fed7aa;

  --secondary:         #fbbf24;   /* lighter amber */
  --tertiary:          #a3e635;   /* lighter olive */

  --error:             #fca5a5;
  --success:           #86efac;
  --warning:           #fcd34d;
  --info:              #93c5fd;
}
```

### ✅ Approved: purple M3 palette

For Material 3 prototypes (Material You aesthetic). Exact tokens live in `material-3-expressive/color-system.md` — copy verbatim, don't re-derive.

```css
:root[data-theme="dark"] {
  --bg:                #14111f;
  --surface-1:         #1b1729;
  --surface-2:         #221e33;
  --surface-3:         #2a2540;
  --surface-4:         #332d4c;
  --surface-5:         #3d3656;
  --on-surface:        #e6e0f0;
  --on-surface-variant:#c9c1d6;
  --primary:           #d0bcff;
  --on-primary:        #381e72;
  --primary-container: #4f378b;
  --on-primary-container: #efdbff;
  /* ...etc, see color-system.md for full palette */
}
```

### ⚠️ Conditional: other palettes

Allowed only if the prototype explicitly requires a different palette (e.g. a brand-specific commission). Document the reason in the prototype's own README. Otherwise, use warm earth tones or the M3 purple palette.

### When in doubt

If you're not sure which palette to use:

1. **Is it an M3 prototype?** Use the purple M3 palette. (See `material-3-expressive/`.)
2. **Is it a warm/organic domain (food, lifestyle, content, wellness)?** Use warm earth tones.
3. **Otherwise?** Ask. Don't default to indigo.

---

## 7. Verification

### Contrast checking

Every text/background pair and every UI component / adjacent-color pair must be verified against WCAG AA. Don't eyeball; use a tool.

- Browser DevTools → Elements → Accessibility panel shows contrast for the selected element.
- WebAIM Contrast Checker: <https://webaim.org/resources/contrastchecker/>
- Polypane has built-in contrast checking.
- axe DevTools extension audits the whole page.

### Theme testing

If your UI supports both light and dark themes:

1. **Test both.** Don't assume that passing contrast in one implies passing in the other. Text that's 8:1 in dark theme can be 3:1 in light theme if you used the same `--on-surface` value.
2. **Switch at the OS level**, not just in your app. `prefers-color-scheme` should drive the default; the in-app toggle should override.
3. **Check the transition.** When switching themes, is there a flash of unstyled content? Is the transition smooth or jarring?

```css
@media (prefers-color-scheme: dark) {
  :root { --bg: #14111f; --on-bg: #e6e0f0; /* ...dark tokens */ }
}
@media (prefers-color-scheme: light) {
  :root { --bg: #fef7ff; --on-bg: #1d1b20; /* ...light tokens */ }
}

/* In-app override */
:root[data-theme="dark"]  { --bg: #14111f; --on-bg: #e6e0f0; /* ... */ }
:root[data-theme="light"] { --bg: #fef7ff; --on-bg: #1d1b20; /* ... */ }
```

### Color blindness testing

Use a simulator to check your UI under different color vision deficiencies:

- Chrome DevTools → Rendering → Emulate vision deficiencies (protanopia, deuteranopia, tritanopia, achromatopsia).
- Stark (browser extension / Figma plugin).
- Sim Daltonism (macOS app).

If your UI relies on color alone to communicate state (see `accessibility.md` §7), it will fail here. Pair every color with an icon or text label.

### The 60-30-10 eyeball test

Step back from the screen (or squint). The dominant color should be the background. The primary color should appear in roughly 10% of the visible area — primary buttons, active states, brand mark. If primary is everywhere, you've violated 60-30-10.

---

## Quick reference: the color-decision flowchart

```
1. Is this an M3 prototype?
   → YES: Use the purple M3 palette from material-3-expressive/color-system.md.
   → NO: continue.

2. Is this a warm/organic domain (food, lifestyle, content, wellness)?
   → YES: Use warm earth tones (§6 above).
   → NO: continue.

3. Is there a documented brand requirement?
   → YES: Use the brand palette. Document the reason in the prototype's README.
   → NO: continue.

4. STOP. Do not default to indigo/blue. Ask the user which palette to use.

5. Once palette is chosen:
   - Define all roles as CSS custom properties on :root.
   - Implement dark + light themes (if both are required).
   - Use tonal surfaces for elevation (lighter-in-dark, darker-in-light).
   - Verify contrast for every text/bg and UI/adjacent pair.
   - Apply 60-30-10 distribution.
   - Don't rely on color alone — pair every status color with an icon.
```

---

## See also

- [`accessibility.md`](./accessibility.md) — §3 Color contrast, §7 Don't rely on color alone.
- [`what-makes-good-ui.md`](./what-makes-good-ui.md) — §1 Visual hierarchy (color as a hierarchy lever), §7 Contrast.
- [`ai-ui-mistakes.md`](./ai-ui-mistakes.md) — §6 Generic color schemes, §2 Flat cards / elevation, §12 box-shadow for elevation.
- [`../material-3-expressive/color-system.md`](../material-3-expressive/color-system.md) — the full M3 token reference.
- [`../material-3-expressive/elevation.md`](../material-3-expressive/elevation.md) — tonal elevation system in depth.

---

*Last updated: design system documentation pass.*
