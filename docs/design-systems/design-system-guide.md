# Design System Guide — How to Design Prototypes

> **Master guide.** This document tells you how to use the design system docs to create beautiful, consistent prototypes.
> Read this before starting any new prototype.

---

## 1. The design workflow

Every prototype follows this workflow (refined through the search-page prototype):

### Step 1: Research (before writing any code)
1. Read [`basic-design/what-makes-good-ui.md`](./basic-design/what-makes-good-ui.md) — the 8 fundamental principles.
2. Read [`basic-design/ai-ui-mistakes.md`](./basic-design/ai-ui-mistakes.md) — 13 mistakes AI commonly makes and how to avoid them.
3. If using Material 3: read [`material-3-expressive/navigation.md`](./material-3-expressive/navigation.md) and all sub-docs.
4. Search the web for current best practices for the specific app type (e.g., "anime app UI design 2024").

### Step 2: Plan the design
1. Choose a color palette — see [`basic-design/color-theory.md`](./basic-design/color-theory.md).
   - M3 prototypes: use the purple tokens from [`material-3-expressive/color-system.md`](./material-3-expressive/color-system.md).
   - Non-M3 prototypes: use warm earth tones (cream, beige, amber, orange). NEVER indigo/blue.
2. Set up the type scale — see [`material-3-expressive/typography.md`](./material-3-expressive/typography.md).
3. Define spacing tokens — see [`material-3-expressive/spacing.md`](./material-3-expressive/spacing.md).
4. Plan elevation strategy — see [`material-3-expressive/elevation.md`](./material-3-expressive/elevation.md).
5. Plan motion — see [`material-3-expressive/motion.md`](./material-3-expressive/motion.md).

### Step 3: Build
1. Copy `prototypes/_template/` → `prototypes/<your-name>/`.
2. Override the design tokens in `styles.css` (keep the M3 structure, change the values).
3. Build components following [`material-3-expressive/components.md`](./material-3-expressive/components.md).
4. Apply layout patterns from [`material-3-expressive/layout-patterns.md`](./material-3-expressive/layout-patterns.md).

### Step 4: Verify
1. Screenshot the live site with Agent Browser.
2. Use VLM to get a **detailed description** (not just a rating): "Describe what you see in detail. What looks bad? What looks AI-generated?"
3. Fix every issue the VLM identifies.
4. If VLM rates below 7/10, iterate.
5. **Never skip verification** — the user will check.

---

## 2. Design principles (non-negotiable)

These principles come from [`basic-design/what-makes-good-ui.md`](./basic-design/what-makes-good-ui.md) and the user's accumulated feedback:

1. **Visual hierarchy** — size, weight, and color guide the eye. Headlines are large, body is medium, labels are small.
2. **Consistency** — same spacing, same radius, same component patterns throughout the app.
3. **Elevation = tonal surfaces** — NOT box-shadows. Higher elevation = lighter surface tone (dark theme). See [`material-3-expressive/elevation.md`](./material-3-expressive/elevation.md).
4. **Proper spacing** — use a 4px grid. Don't use random values. See [`material-3-expressive/spacing.md`](./material-3-expressive/spacing.md).
5. **Proper type scale** — use the full M3 scale (display → label-small). Don't use random font sizes. See [`material-3-expressive/typography.md`](./material-3-expressive/typography.md).
6. **Touch targets** — minimum 44×44px. Preferably 48px. See [`basic-design/mobile-first-design.md`](./basic-design/mobile-first-design.md).
7. **Accessibility** — semantic HTML, ARIA labels, WCAG AA contrast. See [`basic-design/accessibility.md`](./basic-design/accessibility.md).
8. **Motion** — use M3 emphasized easing. Don't use linear or default ease. See [`material-3-expressive/motion.md`](./material-3-expressive/motion.md).

---

## 3. What makes a prototype look "AI-generated" (and how to avoid it)

From [`basic-design/ai-ui-mistakes.md`](./basic-design/ai-ui-mistakes.md):

| Mistake | Fix |
|---------|-----|
| Generic "clean and modern" look | Use a specific design system (M3 Expressive) with real tokens |
| Flat cards with no depth | Use tonal elevation (surface-1 → surface-5) |
| Inconsistent spacing | Use CSS custom properties (sp-1 through sp-10) |
| Low contrast text | Check WCAG AA (4.5:1 for body, 3:1 for large) |
| Small touch targets | Min 44px, preferably 48px |
| Generic color (indigo/blue) | Use M3 purple or warm earth tones |
| No personality | Add brand-specific details (icons, motion, layout) |
| Forgetting to verify | ALWAYS screenshot + VLM check on the live site |
| Using box-shadow for elevation | Use tonal surface colors instead |

---

## 4. The M3 token system

All M3 prototypes use this token structure (from the search-page prototype):

```css
:root {
  /* Type scale */
  --fs-display: 32px;  --fs-h1: 26px;  --fs-h2: 22px;  --fs-h3: 18px;
  --fs-body-l: 16px;   --fs-body: 14px; --fs-body-s: 13px;
  --fs-label: 12px;    --fs-label-s: 11px;

  /* Spacing (4px grid) */
  --sp-1: 4px;  --sp-2: 8px;   --sp-3: 12px;  --sp-4: 16px;
  --sp-5: 20px; --sp-6: 24px;  --sp-8: 32px;  --sp-10: 40px;

  /* Radius */
  --r-xs: 8px; --r-sm: 12px; --r-md: 16px; --r-lg: 20px; --r-xl: 28px;
  --r-pill: 999px;

  /* Motion */
  --ease-standard: cubic-bezier(.2, 0, 0, 1);
  --ease-emphasized: cubic-bezier(.3, 0, 0, 1);
  --ease-emphasized-decel: cubic-bezier(.05, .7, .1, 1);
  --dur-1: 100ms; --dur-2: 200ms; --dur-3: 300ms; --dur-4: 400ms; --dur-5: 500ms;
}

.device {
  /* Tonal surface tiers (elevation) */
  --color-bg: #14111f;
  --color-surface-1: #1b1729;
  --color-surface-2: #221e33;
  --color-surface-3: #2a2540;
  --color-surface-4: #332d4c;
  --color-surface-5: #3d3656;

  /* Text */
  --color-text: #ece6f5;
  --color-text-muted: #a89ec0;
  --color-text-subtle: #6e6688;

  /* Color roles */
  --color-primary: #d0bcff;
  --color-primary-fg: #381e72;
  --color-on-primary-container: #eaddff;
  --color-primary-container: #4f378b;
  --color-secondary: #ccc2dc;
  --color-secondary-container: #4a4458;
  --color-outline: #938f99;
  --color-outline-variant: #49454f;
}
```

See [`material-3-expressive/color-system.md`](./material-3-expressive/color-system.md) for the full token tables and light theme equivalents.

---

## 5. Layout patterns

Key patterns from the search-page prototype (see [`material-3-expressive/layout-patterns.md`](./material-3-expressive/layout-patterns.md) for full specs):

| Pattern | Description |
|---------|-------------|
| **Floating bottom nav** | 16px padding from all edges, 28px radius, shadow, tonal surface-3. Active item: text beside icon. Non-active: icon only. All items flex: 1 1 0 (even width). |
| **Collapsing header** | On scroll: title shrinks, search bar moves right of title, source toggle fades out, filters slide left, sort slides right. All animate with M3 emphasized easing. |
| **Section trays** | Each section (recent searches, results) has its own tonal surface-1 background with rounded corners. Minimal side margin (0-4px). |
| **Filter bottom sheet** | Slides up from bottom. No drag handle, no X button. Accordion (list) or flat (tabs) view toggle. Apply + Clear all buttons. |
| **Blur gradient on scroll** | Only visible when topbar is collapsed. Stronger at top, fades to nothing at bottom. Uses backdrop-filter: blur(14px) + linear gradient. |
| **Recent searches collapse** | Toggle next to text. Collapsed: toggle hidden, "Show" button on right. Expanded: "Clear all" on right. Max 3 visible + "Show N more". |

---

## 6. Quick checklist before finalizing a prototype

- [ ] All tokens defined (type, spacing, radius, motion, color)
- [ ] Tonal elevation used (not box-shadow)
- [ ] Type scale followed (no random font sizes)
- [ ] 4px spacing grid followed (no random values)
- [ ] Touch targets ≥ 44px
- [ ] Semantic HTML used
- [ ] ARIA labels on icon-only buttons
- [ ] WCAG AA contrast met
- [ ] M3 emphasized easing used for transitions
- [ ] No indigo/blue colors
- [ ] Bottom nav: floating, rounded, text beside icon
- [ ] No iPhone home indicator bar
- [ ] Verified with VLM on the LIVE site (not just localhost)
- [ ] VLM rating ≥ 7/10
- [ ] Cache version bumped (`?v=N` on CSS/JS links)

---

*Last updated: design system documentation pass.*
