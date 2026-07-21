# src/proto-kit/ — Shared Design System

> The single source of truth for the phone mockup, navigation, tokens, and theme.
> Every prototype imports from here — **fix once, inherit everywhere**.

---

## What's inside

| Component / File | What it does | Import |
|------------------|--------------|--------|
| `tokens/tokens.css` | ALL design tokens: type scale, spacing, radius, motion, M3 color roles, per-theme frame invert + widths, stage backgrounds. Import once in each prototype's layout. | `import "@proto-kit/tokens/tokens.css"` |
| `device-frame/device-frame.tsx` | `<DeviceFrame theme="dark">` — the phone mockup (bezel + status bar + fullscreen button + screen slot). Frame color/width invert by theme automatically. | `{ DeviceFrame, Screen }` |
| `device-frame/status-bar.tsx` | `<StatusBar>` — live clock, punch-hole, Wi-Fi/signal/battery icons. Auto-rendered inside DeviceFrame. | `{ StatusBar }` |
| `device-frame/fullscreen-button.tsx` | `<FullscreenButton>` — real Fullscreen API toggle. Desktop-only (hidden on mobile). Auto-rendered inside DeviceFrame. | (internal) |
| `bottom-nav/bottom-nav.tsx` | `<BottomNav items activeId onSelect>` — floating pill nav. Active item is content-sized (full label always visible). 42px pill / 58px bar. | `{ BottomNav, NavItem }` |
| `stage/stage.tsx` | `<Stage leftPanel rightPanel>` — desktop layout with side panels. Panels hide on ≤1024px. | `{ Stage, PanelBadge, PanelTitle, PanelDesc, PanelHead }` |
| `theme/theme-provider.tsx` | `<DeviceThemeProvider storageKey="..." initialTheme="dark">` — scopes `data-theme` to `.device` (NOT `<html>`). Persists to localStorage. | `{ DeviceThemeProvider, useDeviceTheme }` |
| `swipe-simulation/use-swipe-simulation.ts` | `useSwipeSimulation({ onSwipeLeft, onSwipeRight })` — test feature. Click+drag = touch swipe. Easily removable. | `{ useSwipeSimulation }` |

---

## Token architecture (CRITICAL)

Two independent token layers — read [`docs/theme-architecture.md`](../../docs/theme-architecture.md) for the full explanation.

```
:root  — universal tokens (type, spacing, radius, motion) + STAGE tokens (--stage-bg, --sb-*)
         Stage tokens MUST be on :root because .stage is an ANCESTOR of .device.
         If they were on .device, the stage couldn't read them → white background bug.

.device — app-level tokens (M3 color roles, surfaces, frame bezel/width).
          data-theme="dark" (default) or data-theme="light".
          Light mode overrides via .device[data-theme="light"].
          Stage also adapts via :has(.device[data-theme="light"]).
```

---

## Device frame — per-theme inversion

The frame inverts by theme for premium contrast:

| Theme | Frame color | Border width | Notes |
|-------|-------------|--------------|-------|
| **Dark** | Soft platinum `#cfcfcf` + `#a8a8a8` rim | `3.5px / 4px` | Light but not stark white; thinner (bright border reads heavier) |
| **Light** | Dark `#0e0a17` + `#1b1729` rim | `4px / 4.4px` | Dark border against light screen |

The frame + background transition smoothly when toggling themes.

---

## Bottom nav — content-sized active pill

- Active item: `flex: 0 1 auto` (content-sized) — full label always visible, never truncated.
- Inactive items: `flex: 1 1 0` (icon-only, share remaining space evenly).
- Slim: 42px pill height, 58px bar height.
- Expanding-pill animation on tab switch.

---

## Fullscreen button

- Part of `<DeviceFrame>` — every prototype gets it automatically.
- Real Fullscreen API (`requestFullscreen` on `.device`).
- Purple circular, 40px, bottom-right above the nav bar.
- **Mobile-only** — hidden on PC (>480px) via `@media (min-width: 481px)`.
- **Completely disappears when in fullscreen mode** (no exit button). The user exits via the system back button/gesture (mobile).
- The button only enters fullscreen — it never toggles to an exit button.

---

## Custom on-screen keyboard

A custom QWERTY keyboard that replaces the native soft keyboard on ALL platforms.

- **No dismiss bar** — dismiss by tapping outside the input (blur with 200ms timeout).
- Layout: numbers (1-0), QWERTYUIOP, ASDFGHJKL, Shift+ZXCVBNM+Backspace, Space+Enter.
- Enter button on the **right side** of the last row.
- Shift toggles uppercase; auto-disables after one letter.
- Key press uses **pointer events** (not CSS `:active`) for reliable theme-color flash.
- Keys use `tabIndex={-1}` + `onMouseDown preventDefault` so they never steal focus.
- `inputMode="none"` prevents the native keyboard on mobile.
- Animations: slide-up (emphasized-decel), staggered key pop-in, scale(0.92) + primary on press.

```tsx
import { KeyboardProvider, Keyboard, useKeyboardInput } from "@/proto-kit";

<KeyboardProvider>
  <DeviceFrame>
    <Screen>...</Screen>
    <Keyboard />
  </DeviceFrame>
</KeyboardProvider>

// In any input:
const kb = useKeyboardInput({ value, onChange, onEnter, enterLabel: "Search" });
<input {...kb} placeholder="Search..." />
```

---

## Swipe gestures (permanent proto-kit feature)

Every prototype wires up `useSwipeSimulation()` in its page.tsx with its own screen order + navigation callbacks:

```tsx
import { useSwipeSimulation } from "@/proto-kit";

useSwipeSimulation({
  onSwipeLeft: () => goNext(),
  onSwipeRight: () => goPrev(),
});
```

- Click + drag vertically → grab-scrolls content (1:1, cursor: grab → grabbing).
- Click + drag horizontally past 70px → navigate screens (left = next, right = prev).
- Swipe right on detail → back gesture (closes detail).
- Clicks after a drag (>8px) are suppressed (no accidental card opens).
- Text selection + image ghost-drag prevented (`preventDefault` + `-webkit-user-drag: none`).
- Desktop-only (mouse/pen); touch unaffected.

The grab cursor + image-drag-prevention CSS live globally in proto-kit's device-frame CSS, so every prototype gets them automatically — even before wiring the hook.

---

## Usage pattern

```tsx
import "@proto-kit/tokens/tokens.css";
import { DeviceThemeProvider, DeviceFrame, Screen, Stage, BottomNav } from "@/proto-kit";

<DeviceThemeProvider storageKey="my-prototype-theme" initialTheme="dark">
  <Stage leftPanel={...} rightPanel={...}>
    <DeviceFrame theme="dark">
      <Screen>
        {/* screens here */}
      </Screen>
      <BottomNav items={NAV_ITEMS} activeId={active} onSelect={handleNav} />
    </DeviceFrame>
  </Stage>
</DeviceThemeProvider>
```

See `app/prototypes/search-page/` as the reference implementation.
