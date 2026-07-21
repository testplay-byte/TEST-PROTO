# docs/template-rules.md — Prototype Template Rules & Guides

> The rules every prototype built on `src/proto-kit/` must follow.
> These codify the look, feel, and interaction behavior the user has approved.
> Read this before deviating from the shared components.
>
> **Reference prototype:** `app/prototypes/search-page/` + `src/prototypes/search-page/`. Study it as the canonical pattern. The shared frame/nav/stage/tokens live in `src/proto-kit/`.

---

## 1. The phone frame

The frame is a single shared component — `<DeviceFrame>` in `src/proto-kit/device-frame/`. Every prototype renders it; nobody re-implements it.

| Spec                  | Value                                       |
|-----------------------|---------------------------------------------|
| Viewport              | 390 × 844 px                                |
| Device corner radius  | **32px**                                     |
| Bezel (dark theme)    | **3.5px** platinum ring (`--device-bezel: #cfcfcf`) + 4px edge (`--device-edge: #a8a8a8`) |
| Bezel (light theme)   | **4px** dark ring (`--device-bezel: #0e0a17`) + 4.4px edge (`--device-edge: #1b1729`) |
| Device shadow         | soft drop shadow (`--frame-shadow`) for depth on desktop |
| Desktop stage         | centered, side info panels on left & right via `<Stage>` |
| Mobile (≤480px)       | frame collapses to full viewport (`100dvh`), no bezel, no chrome |

**Frame inverts by theme (premium contrast):** in dark mode the bezel is a soft platinum (light but not stark white — reads visually heavier so it's thinner); in light mode the bezel is dark. This is token-driven (`--device-bezel`, `--device-edge`, `--bezel-w`, `--edge-w` in `src/proto-kit/tokens/tokens.css`), so toggling the theme flips the frame automatically.

**Rule:** Don't make the corners more rounded than 32px. The user specifically asked for *less* rounding. If a future brief asks for "more rounded", confirm first (🟦).

---

## 2. The status bar

Rendered by `<StatusBar>` inside `<DeviceFrame>`. The status bar is **decorative** — it sells the "this is a phone" illusion. It must contain, left → center → right:

```
[ time ]        [ ● punch-hole ]        [ wifi  signal  battery  battery% ]
```

### 2.1 Time (left)
- Live, updates every 30s.
- 12-hour format, tabular-nums, font-weight 600, size ~13px.

### 2.2 Punch-hole camera (center)
- A **13px** circle, centered absolutely in the status bar.
- Dark radial gradient (mimics glass over a front camera).
- `pointer-events: none` — never interactive.

### 2.3 System icons (right), in this order (left to right)
1. **Wi-Fi** — 3 arcs total. **2 of 3 bright** (outermost arc dim). Represents a moderate connection.
2. **Mobile data signal** — 4 bars total. **LEFT 2 bars bright** (the two shorter bars on the left); **RIGHT 2 bars dim** (the two taller bars on the right, `opacity: 0.3`). Represents a weak/moderate connection.
3. **Battery** — **portrait (vertical) orientation**, small (8×16px). A vertical rectangle with a nub at the top and a fill that grows from the bottom.
4. **Battery percentage** — shown **to the right** of the battery glyph (e.g., `87%`).

> **No Bluetooth icon.** Removed per feedback.

### 2.4 Battery behavior (portrait)
- The fill `<rect>` `y` and `height` are driven from the percentage by the `<StatusBar>` component.
- Fill grows from the **bottom** upward (portrait orientation).
- Below 15%, the fill tints with `--color-error`.
- Default demo value: 87%.

### 2.5 Status bar rules
- Never let real content overlap the status bar.
- Status bar is `user-select: none` (see §4).
- In dark theme, icons inherit `--color-text` so they stay visible.

---

## 3. Color & theming

- Tokens are defined in `src/proto-kit/tokens/tokens.css` (single source of truth). Import it once in the prototype's `layout.tsx`:
  ```ts
  import "../../src/proto-kit/tokens/tokens.css";
  ```
- Two token layers: `:root` (universal + stage tokens, dark default) + `.device` (app tokens, M3 colors). Light overrides via `.device[data-theme="light"]` and `:has(.device[data-theme="light"])`. See [`docs/theme-architecture.md`](./theme-architecture.md).
- Theme toggle is via `<DeviceThemeProvider storageKey="<name>-theme" initialTheme="dark">` + the `useDeviceTheme()` hook. It sets `data-theme` on the `.device` element and persists to `localStorage`.
- Default M3 palette is purple (`--color-primary: #d0bcff` dark / `#6750a4` light). A prototype **may override any `--color-*` token** by re-declaring it on `.device` in its own CSS, but should keep all other tokens.
- See `docs/design-standards.md` for the full token list.

---

## 4. Text selection (NON-NEGOTIABLE)

**Problem the user reported:** pressing a button and dragging the mouse upward selects/copies text instead of scrolling. This must never happen on chrome.

### Rule
- The **`.device` element** is `user-select: none`. No text in a prototype is selectable — prototypes behave like real apps.
- Inputs (`<input>`/`<textarea>`) are exempt so users can still type.
- CSS-only — no global `selectstart`/`dragstart` listeners (those block click-drag-to-scroll).

### What this achieves
- Dragging from any element (button, card, text, nav) → **never** selects text.
- Scrolling works normally everywhere.
- Inputs (search fields) still allow text entry.

### Implementation
The `.device` rule (`user-select: none; -webkit-user-select: none;`) lives in `src/proto-kit/device-frame/device-frame.module.css` and is inherited by every prototype automatically. Don't re-add global JS listeners that block scrolling.

**Prototypes are not for reading/copying text. They are for simulating app interaction.**

---

## 5. Touch & interaction

- Minimum **44 × 44 px** hit area for every tappable element.
- `:active` state gives feedback (scale down ~3–6%, or background tint).
- Transitions: 150ms for taps, 250ms for view changes.
- Respect `prefers-reduced-motion` (the proto-kit components disable non-essential animations).
- View navigation uses **hash routing** (`#home`, `#search`) — see `page.tsx` in any prototype for the pattern (`useState` + `popstate` listener + `history.pushState`).

---

## 6. Scrollbar handling

- **No visible scrollbar** anywhere in the prototype — not on the screen content, not on side panels.
- Implemented via `scrollbar-width: none` (Firefox) + `::-webkit-scrollbar { display: none }` (Chrome/Safari) on scrollable containers.
- Scrolling still works (touch, wheel, trackpad) — the scrollbar is just invisible.

## 7. Mobile full-screen experience

On mobile (≤480px), the device fills the viewport (no device frame) by default — the `.device` element collapses to `width:100%; height:100dvh; border-radius:0` via the media query in `src/proto-kit/device-frame/device-frame.module.css`. The app behaves like a true native app on phones.

(If a prototype wants a manual fullscreen button using the real Fullscreen API, add it as a prototype-specific component — the shared frame does not include one by default.)

---

## 8. Side panels (desktop only) — via `<Stage>`

- Use the `<Stage>` component from `src/proto-kit/`: it lays out the device in the center with left/right info panels.
- **Left panel** (`leftPanel` prop): prototype name, description, tags, optional screen list.
- **Right panel** (`rightPanel` prop): screen info, component donut, interaction bars, stats.
- Panels are **hidden on screens <1024px** — on mobile/tablet, only the device shows.
- Panels flank the device horizontally (left and right), never top/bottom.

---

## 9. Theming architecture (CRITICAL)

The app's theme is **scoped to the `.device` element**, NOT set on `<html>`. This is the most important architectural rule:

- `data-theme` is set on `<div class="device" data-theme="light|dark">` only — by `<DeviceThemeProvider>`.
- The page (stage background, side panels, body text) uses **stage tokens** (`--stage-bg`, `--sb-*`) defined on `:root` (NOT on `.device`). They adapt to the device theme via `:has(.device[data-theme="light"])`.
- The app (device screen, cards, text, buttons) uses **app-level tokens** (`--color-*`) defined on `.device`, overridden by `.device[data-theme="light"]`.
- The device bezel color **inverts by theme**: platinum (`#cfcfcf`) in dark mode (thinner, 3.5/4px), dark (`#0e0a17`) in light mode (slightly thicker, 4/4.4px).
- **Never** set `data-theme` on `<html>`. **Never** define `--color-*` on `:root`. **Never** move the stage tokens onto `.device` (the `.stage` element is an *ancestor* of `.device`, so it couldn't read them).
- See [`docs/theme-architecture.md`](./theme-architecture.md) for the full explanation and token tables.

---

## 10. What to reuse vs. what to change

### Reuse as-is (from `src/proto-kit/`)
- `<DeviceFrame>` + `<StatusBar>` + `<Screen>` (phone frame, status bar, punch-hole, system icons, battery logic).
- `<Stage>` + `PanelBadge/PanelTitle/PanelDesc/PanelHead` (side panels layout).
- `<BottomNav>` (floating pill, content-sized active item, 42px pill / 58px bar).
- `<DeviceThemeProvider>` + `useDeviceTheme()` (theme toggle, scoped to `.device`).
- `tokens/tokens.css` (type/spacing/radius/motion + M3 color roles + stage tokens).

### Change per prototype
- The screens' content (one file per screen in `src/prototypes/<name>/screens/`).
- `--color-primary` and the rest of the palette (override on `.device` in the prototype's own CSS if the brand differs from the default M3 purple).
- Bottom-nav items (add/remove, relabel) — passed as props to `<BottomNav>`.
- The prototype's own `navigation.md` + `README.md`.

### Never
- Don't re-implement the frame/status bar/bottom nav — import from `src/proto-kit/`.
- Don't import code from another prototype. Stay self-contained (proto-kit is the only shared dependency).
- Don't remove the `user-select: none` rule on `.device`.
- Don't make the device corners more rounded than 32px without confirming.
- Don't put real content in the status bar.

---

## 11. Accessibility (unchanged from design-standards)

- Semantic HTML, keyboard reachable, visible focus.
- `aria-label` on icon-only buttons.
- Color is never the only signal.

---

*Last updated: Next.js migration (Phase 4) — frame/nav/stage/tokens moved into `src/proto-kit/`; reference prototype is `app/prototypes/search-page/`. Frame now inverts by theme (platinum dark / dark light, per-theme widths).*
