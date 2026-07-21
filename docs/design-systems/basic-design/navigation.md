# docs/design-systems/basic-design/navigation.md

> Index of every **basic design** doc in this folder. These files are the **foundational design-literacy reference** that every agent should read *before* touching any prototype — regardless of which design system (M3, custom, etc.) that prototype uses.
>
> This folder is intentionally **system-agnostic**. It does not assume Material 3, Tailwind, Bootstrap, or any other framework. It teaches the *principles* (hierarchy, contrast, touch targets, color roles, type scale, a11y) that every system is built on top of. The sibling `material-3-expressive/` folder applies these principles to one specific system.

---

## Why this folder exists

The repo's top-level `docs/design-standards.md` covers mobile-frame and per-prototype rules. The `material-3-expressive/` folder documents one specific theme. **This folder fills the gap in between**: the universal design principles that any AI agent needs to know in order to:

- Recognize *why* a UI looks bad (so you can fix it, not just regenerate).
- Avoid the failure modes that LLMs fall into when generating UI without explicit guidance.
- Produce UIs that are accessible, mobile-first, and visually coherent even without a fully-specced design system.

If a prototype violates a rule in this folder, the prototype is wrong (or it has a documented exception). File an issue in the worklog if a rule here contradicts a rule in a system-specific folder — one of them needs updating.

---

## Files

| File                         | What it covers                                                                                                  |
|------------------------------|------------------------------------------------------------------------------------------------------------------|
| `navigation.md`              | **This file.** Index of the basic-design docs and suggested reading order.                                       |
| `what-makes-good-ui.md`      | The 8 fundamental principles of good UI (visual hierarchy, consistency, feedback, affordance, white space, alignment, contrast, simplicity). Each principle has a DO and a DON'T example with CSS. |
| `ai-ui-mistakes.md`          | The 13 most common mistakes AI agents make when generating UI — and concrete fixes for each. Read this *before* generating any UI; re-read it *after* generating UI as a checklist. |
| `mobile-first-design.md`     | Mobile-first principles: 44px touch targets, thumb zone, one-handed usability, breakpoints, safe-area insets, performance, gestures, content prioritization. |
| `accessibility.md`           | A11y fundamentals: semantic HTML, ARIA labels, WCAG color contrast (4.5:1 body / 3:1 large), keyboard nav, screen-reader support, `prefers-reduced-motion`, don't rely on color alone, touch-target size. |
| `color-theory.md`            | Color roles (primary/secondary/tertiary/surface/background/error/success/warning), dark vs light theme elevation rules, color harmony, 60-30-10 rule. **Repo policy:** never use indigo/blue as primary; warm earth tones and purple M3 palette are approved. |
| `typography-basics.md`       | Type scale, font weights (400/500/600/700), line-height (1.5 body / 1.2 headlines), letter-spacing, font-family stack, readability (max line length 60–80 chars), hierarchy through size + weight. |

---

## Suggested reading order for a new agent

1. [`what-makes-good-ui.md`](./what-makes-good-ui.md) — the vocabulary. Read once, refer back often.
2. [`ai-ui-mistakes.md`](./ai-ui-mistakes.md) — the failure-mode checklist. Read before *and* after generating UI.
3. [`mobile-first-design.md`](./mobile-first-design.md) — applies if the target is mobile (which it almost always is in this repo).
4. [`accessibility.md`](./accessibility.md) — non-negotiable. Every UI must pass these.
5. [`color-theory.md`](./color-theory.md) — before picking any color. Includes the repo's color-policy rules (no indigo/blue primary).
6. [`typography-basics.md`](./typography-basics.md) — before setting any font-size.

If you only have time for two files: read `what-makes-good-ui.md` and `ai-ui-mistakes.md`. They cover 80% of the failure modes.

---

## How this folder relates to the rest of the repo

```
docs/
├── design-standards.md              ← top-level mobile frame + per-prototype rules
└── design-systems/
    ├── basic-design/                ← THIS FOLDER — universal principles (system-agnostic)
    │   ├── navigation.md            ← you are here
    │   ├── what-makes-good-ui.md
    │   ├── ai-ui-mistakes.md
    │   ├── mobile-first-design.md
    │   ├── accessibility.md
    │   ├── color-theory.md
    │   └── typography-basics.md
    └── material-3-expressive/       ← one specific system that builds on these principles
        ├── color-system.md
        ├── typography.md
        ├── spacing.md
        ├── elevation.md
        ├── motion.md
        ├── components.md
        └── layout-patterns.md
```

The basic-design folder is **the contract every prototype must obey**. The system-specific folders are **one valid way to obey it**. A prototype can use a non-M3 system and still be correct as long as it obeys the principles here.

---

## Repo-wide color policy (quick reference, full detail in `color-theory.md`)

| Status        | Palette                                    | Use                                                          |
|---------------|--------------------------------------------|--------------------------------------------------------------|
| ❌ Forbidden  | Indigo / Tailwind default blue as primary  | Generic, no personality, AI-tell. Do not use as the brand color. |
| ✅ Approved   | Warm earth tones (cream, beige, amber, orange) | Default palette for warm/organic prototypes.                |
| ✅ Approved   | Purple M3 palette                          | Use for M3 prototypes (see `material-3-expressive/color-system.md` for exact tokens). |
| ⚠️ Conditional | Other palettes                           | Allowed only if the prototype explicitly requires them (document the reason in the prototype's own README). |

---

## The non-negotiables (TL;DR if you read nothing else)

1. **Touch targets ≥ 44×44px** (48px preferred). Never smaller. See `mobile-first-design.md` and `accessibility.md`.
2. **Body-text contrast ≥ 4.5:1, large-text contrast ≥ 3:1** (WCAG AA). Verify with a contrast checker, don't eyeball. See `accessibility.md`.
3. **No indigo/blue as primary color.** See `color-theory.md`.
4. **Elevation = tonal surfaces, not `box-shadow`** (except where shadows are physically correct, e.g. a floating bottom nav). See `material-3-expressive/elevation.md` for the M3 implementation; the principle generalizes.
5. **Use a type scale, not random sizes.** See `typography-basics.md`.
6. **Semantic HTML first, ARIA only when needed.** A `<button>` is always better than `<div role="button">`. See `accessibility.md`.
7. **Every interaction has visual feedback.** Hover, focus, active, disabled — all four states must be styled. See `what-makes-good-ui.md` § Feedback.
8. **Verify your output.** After generating UI, walk through `ai-ui-mistakes.md` as a checklist. Do not ship unreviewed AI-generated UI. See `ai-ui-mistakes.md` § "Forgetting to verify the result".

---

*Last updated: design system documentation pass.*
