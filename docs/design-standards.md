# docs/design-standards.md — Mobile UI/UX Standards

> The visual + interaction rules every prototype follows so the suite feels consistent and reads as "real mobile app".

---

## 1. The phone frame

- **Viewport size:** 390 × 844 px (a common modern phone viewport).
- **Device shell:** rounded corners **32px**, **5px** dark bezel + 0.5px edge (slightly thicker per feedback), soft drop shadow on desktop.
- **Status bar:** 36px tall, decorative only. Layout left→center→right: `[ time ] [ ● punch-hole ] [ wifi · signal · portrait-battery · battery% ]`. See `docs/template-rules.md` §2 for the full spec.
- **Punch-hole:** **13px** centered circle (bigger per feedback) mimicking the front camera.
- **Wi-Fi:** 3 arcs, 2 bright (outermost dim) — moderate connection.
- **Signal:** 4 bars, **LEFT 2 bright, RIGHT 2 dim** — weak/moderate strength.
- **Battery:** **portrait (vertical)**, small (8×16px); fill grows from bottom; percentage shown to the right; tints danger below 15%.
- **Screen area:** fills the rest; scrolls independently; overflow hidden on the shell.
- **Bottom safe area:** 34px reserved for gestures / home indicator.
- **Desktop preview:** device centered with **left and right info panels** showing screen list, stats, and mini-charts. Warm-cream page background.
- **Bezel color:** near-black (`#1a1612`) in light mode; adaptive medium-gray (`#3a3530`) in dark mode (visible against both backgrounds). See `docs/theme-architecture.md`.
- **Theming:** app theme is scoped to `.device` (`data-theme` on the device element, NOT `<html>`). The page never turns dark when the app toggle is pressed. See `docs/theme-architecture.md`.
- **Mobile preview:** frame collapses to full viewport (no device chrome, panels hidden) so it feels native. A floating button toggles back to framed view.

The template in `prototypes/_template/` implements this. Copy it; don't reinvent. Authoritative rules live in `docs/template-rules.md`.

---

## 2. Spacing scale (4pt grid)

| Token   | px    | Use                          |
|---------|-------|------------------------------|
| `xs`    | 4     | Hairline gaps                |
| `sm`    | 8     | Tight grouping               |
| `md`    | 12    | Default inner padding        |
| `lg`    | 16    | Card padding, list gaps      |
| `xl`    | 24    | Section spacing              |
| `2xl`   | 32    | Major section breaks         |
| `3xl`   | 48    | Page-level breathing room    |

Use CSS custom properties: `--space-xs` … `--space-3xl`.

---

## 3. Type scale

| Token     | size / line-height | Use                  |
|-----------|--------------------|----------------------|
| `caption` | 12 / 16            | Labels, timestamps   |
| `body`    | 14 / 20            | Default text         |
| `subtitle`| 16 / 22            | List titles          |
| `title`   | 18 / 24            | Card headers         |
| `h2`      | 22 / 28            | Screen titles        |
| `h1`      | 28 / 34            | Hero / large display |
| `display` | 34 / 40            | Onboarding numerals  |

System font stack: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`.

---

## 4. Color

- Use **CSS custom properties** for theming so a prototype can switch light/dark trivially.
- Default light surface: `#FFFFFF`; default dark surface: `#121212`.
- Avoid indigo/blue as primary unless the brief asks. Prefer the brand color the user specifies; default to a neutral/teal if unspecified.
- Maintain accessible contrast (≥ 4.5:1 for body text).

Suggested tokens:
```css
:root {
  --color-bg: #ffffff;
  --color-surface: #f7f7f8;
  --color-text: #1a1a1a;
  --color-text-muted: #6b7280;
  --color-primary: #0d9488; /* teal default; override per brief */
  --color-primary-fg: #ffffff;
  --color-border: #e5e7eb;
  --color-danger: #dc2626;
  --color-success: #16a34a;
}
```

---

## 5. Touch targets

- **Minimum 44 × 44 px** for any tappable element.
- Hit area can extend beyond the visible element (use padding).
- Spacing between adjacent tap targets: ≥ 8px.

---

## 6. Motion

- Default transition: `150ms ease` for taps, `250ms ease` for view changes.
- Use `transform`/`opacity` for animation (GPU-friendly); avoid animating `width`/`height`/`top`.
- Respect `prefers-reduced-motion`: disable non-essential animation.

---

## 7. Components to keep consistent

| Component       | Standard                                                                 |
|-----------------|--------------------------------------------------------------------------|
| Buttons         | Primary (filled), Secondary (outline), Ghost (text). Radius 10–12px.     |
| Cards           | `--space-lg` padding, 12px radius, 1px border, subtle shadow.            |
| List rows       | 56–72px tall, leading icon, trailing chevron/action.                     |
| Inputs          | 48px tall, 12px radius, clear focus ring.                                |
| Bottom nav      | 56px tall + safe area, 3–5 items, active item colored.                  |
| Top app bar     | 56px tall, title left, action icons right.                              |
| Sheets/Modals   | Slide up from bottom, backdrop dim, rounded top corners.                |

Reusable versions live in `templates/components/`.

---

## 8. Accessibility (mandatory)

- Semantic HTML (`button`, `nav`, `header`, `main`, `section`).
- All images have `alt`.
- All interactive elements are keyboard reachable; visible focus state.
- Color is never the only signal (pair with icon/text).
- `aria-label` on icon-only buttons.

---

## 9. Content realism

- Use realistic placeholder data (names, prices, messages) — not "Lorem ipsum".
- Keep copy concise; mobile screens have little room.
- If a flow needs an empty state, design it.

---

## 10. Dark mode

- Implement via a `data-theme="dark"` attribute on `<html>` or the frame.
- Provide a toggle in the prototype's debug bar (top-right of the frame on desktop).
- Both themes must look intentional, not an afterthought.

---

*Last updated: repository initialization.*
