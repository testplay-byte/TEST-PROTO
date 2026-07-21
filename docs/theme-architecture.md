# docs/theme-architecture.md — Theme Architecture

> **CRITICAL.** This document explains how theming works in prototypes and why the app's theme is **scoped to the device**, separate from the page theme.
> Read this before touching any CSS variables or theme toggle logic.
>
> **Single source of truth:** `src/proto-kit/tokens/tokens.css`.

---

## The problem we solved

**User feedback:**
> "When I turn it into dark mode, the whole page turns into dark mode. The app is a different part from the actual web page so only the app's theme color should change if needed. Make sure that the whole page never turns into dark mode when a user presses a button inside the app."

**Root cause:** `data-theme` was set on `<html>` (the document root), which cascaded to *everything* — the device, the side panels, the stage background, the body. Pressing the in-app dark mode toggle turned the entire page dark.

**Solution:** Scope `data-theme` to the `.device` element only. The page (stage, side panels, body) uses its own set of CSS variables that adapt *indirectly* to the device theme via `:has()`, never directly.

---

## Architecture: two independent token layers

```
┌─ <html> ─────────────────────────────────────────────────────────┐
│                                                                    │
│  :root — universal tokens (type, spacing, radius, motion)         │
│  :root — stage tokens (--stage-bg, --sb-*)  ◄── DARK default      │
│                                                                    │
│  ┌─ .stage ─────────────────────────────────────────────────────┐ │
│  │                                                               │ │
│  │  ┌─ .sidepanel ───┐    ┌─ .device ──────────────────────┐    │ │
│  │  │ uses --sb-*    │    │ data-theme="light|dark"        │    │ │
│  │  │ (read from     │    │ (set by <DeviceThemeProvider>) │    │ │
│  │  │  :root via     │    │                                │    │ │
│  │  │  :has() inherit│    │ .device — app tokens           │    │ │
│  │  │  ance)         │    │ (--color-*, --chart-*)         │    │ │
│  │  └────────────────┘    │                                │    │ │
│  │                        │ .device[data-theme="light"]    │    │ │
│  │                        │ overrides app tokens           │    │ │
│  │                        │ + inverts bezel color/width    │    │ │
│  │                        └────────────────────────────────┘    │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  :has(.device[data-theme="light"]) — overrides stage tokens       │
│  (the page reads the device's theme via :has() and adapts)        │
└────────────────────────────────────────────────────────────────────┘
```

### Why stage tokens live on `:root` (NOT on `.device`) — CRITICAL

The `.stage` element is an **ancestor** of `.device`. CSS custom properties cascade *down* the tree, never up. If `--stage-bg` were defined on `.device`, the `.stage` element (which is above `.device`) couldn't read it and would fall back to `transparent`, showing the white `<body>` behind it.

So the stage tokens (`--stage-bg`, `--sb-bg`, `--sb-muted`, `--sb-border`, `--sb-text`, `--sb-text-muted`) **must** live on `:root`. They default to the dark palette (dark gray `#2a2a2a`). When the device switches to light mode, the `:has(.device[data-theme="light"])` rule on `:root` overrides them with the light palette (light gray `#c8c8c8`). The stage thus "follows" the app theme without `data-theme` ever being set on `<html>`.

### Layer 1: Universal tokens (`:root`)

Type scale, spacing, radius, motion — defined once, used everywhere:

| Group      | Examples                                                    |
|------------|-------------------------------------------------------------|
| Type scale | `--fs-display`, `--fs-h1`, `--fs-h2`, `--fs-body`, …       |
| Spacing    | `--sp-1` … `--sp-10` (4px grid)                            |
| Radius     | `--r-xs` … `--r-xl`, `--r-pill`                            |
| Motion     | `--ease-standard`, `--ease-emphasized`, `--dur-1` … `--dur-5` |

### Layer 1 (cont.): Stage tokens (`:root`, adapt via `:has()`)

These live on `:root` and **adapt** to the device theme via `:has(.device[data-theme="light"])`:

| Token             | Dark value (default) | Light value  | Purpose                          |
|-------------------|----------------------|--------------|----------------------------------|
| `--stage-bg`      | `#2a2a2a`            | `#c8c8c8`    | Page background behind the device |
| `--sb-bg`         | `#232323`            | `#d0d0d0`    | Side panel card background       |
| `--sb-muted`      | `#333333`            | `#c0c0c0`    | Side panel muted surface          |
| `--sb-border`     | `#3a3a3a`            | `#b8b8b8`    | Side panel border                 |
| `--sb-text`       | `#e0e0e0`            | `#333333`    | Side panel / page text            |
| `--sb-text-muted` | `#999999`            | `#666666`    | Side panel muted text             |

### Layer 2: App-level tokens (`.device`, M3 color roles)

Defined on `.device` (dark = default M3 purple palette) and overridden by `.device[data-theme="light"]`:

| Token                | Dark value  | Light value  | Purpose                        |
|----------------------|-------------|--------------|--------------------------------|
| `--color-bg`         | `#14111f`   | `#fef7ff`    | App screen background          |
| `--color-surface-1`  | `#1b1729`   | `#f3edf7`    | Surface tier 1                 |
| `--color-surface-2`  | `#221e33`   | `#ede7f4`    | Surface tier 2                 |
| `--color-surface-3`  | `#2a2540`   | `#e7e0eb`    | Surface tier 3 (bottom nav)    |
| `--color-surface-4`  | `#332d4c`   | `#ddd6e4`    | Surface tier 4                 |
| `--color-surface-5`  | `#3d3656`   | `#d0c9dd`    | Surface tier 5                 |
| `--color-text`       | `#ece6f5`   | `#1d1b20`    | App text                       |
| `--color-text-muted` | `#a89ec0`   | `#49454f`    | App muted text                 |
| `--color-primary`    | `#d0bcff`   | `#6750a4`    | App primary (M3 purple)        |
| `--color-primary-fg` | `#381e72`   | `#ffffff`    | Text on primary                |
| `--color-primary-container` | `#4f378b` | `#eaddff` | Primary container              |
| `--color-on-primary-container` | `#eaddff` | `#21005d` | On primary container       |
| `--color-secondary`  | `#ccc2dc`   | `#625b71`    | Secondary                      |
| `--color-tertiary`   | `#efb8c8`   | `#7d5260`    | Tertiary                       |
| `--color-error`      | `#f2b8b5`   | `#f2b8b5`    | Error                          |
| `--color-success`    | `#a5d6a7`   | `#a5d6a7`    | Success                        |
| `--color-warn`       | `#ffcc80`   | `#ffcc80`    | Warning                        |
| `--color-outline`    | `#938f99`   | `#79747e`    | Outline                        |
| `--color-outline-variant` | `#49454f` | `#cac4d0` | Outline variant                |

### Layer 3: Device frame tokens (`.device`, invert by theme)

The bezel/frame color and width **invert by theme** for premium contrast:

| Token             | Dark value          | Light value         | Why                                                    |
|-------------------|---------------------|---------------------|--------------------------------------------------------|
| `--device-bezel`  | `#cfcfcf` (platinum)| `#0e0a17` (dark)    | Dark theme: bright platinum reads as a premium light frame. Light theme: classic dark phone frame. |
| `--device-edge`   | `#a8a8a8`           | `#1b1729`           | Thin highlight edge, slightly different from the bezel.|
| `--bezel-w`       | `3.5px`             | `4px`               | Bright/platinum border reads visually heavier, so it's thinner in dark mode. |
| `--edge-w`        | `4px`               | `4.4px`             | Edge ring slightly thicker than the bezel.             |
| `--frame-shadow`  | `rgba(0,0,0,.55)`   | `rgba(0,0,0,.4)`    | Soft drop shadow under the device.                     |

**User preference:** the bezel should be a *soft platinum* in dark mode (light but not stark white) and a *dark* frame in light mode. The thinner platinum width in dark mode keeps it from feeling too heavy.

---

## How the toggle works (React + DeviceThemeProvider)

`<DeviceThemeProvider>` (in `src/proto-kit/theme/theme-provider.tsx`) is a client component. Wrap the prototype's content in it:

```tsx
<DeviceThemeProvider storageKey="search-theme" initialTheme="dark">
  <DeviceFrame theme="dark">
    <Screen>{/* …screens… */}</Screen>
  </DeviceFrame>
</DeviceThemeProvider>
```

What it does:
1. On mount, reads the saved theme from `localStorage[storageKey]` (per-prototype key, no collisions).
2. Sets `data-theme` on the nearest `.device` element via `document.querySelector(".device")?.setAttribute("data-theme", theme)`.
3. Persists the new theme to `localStorage` whenever it changes.
4. Exposes `{ theme, setTheme, toggleTheme }` via the `useDeviceTheme()` hook for in-app toggles.

**Key points:**
- `data-theme` is set on `.device`, **not** on `document.documentElement` (`<html>`).
- The `storageKey` prop is per-prototype (e.g. `search-theme`, `anime-app-theme`) so each prototype remembers its own theme independently.
- The `<html>` element has **no** `data-theme` attribute at all. The stage adapts via `:has(.device[data-theme="light"])` on `:root`.

---

## What NOT to do

1. **Never** set `data-theme` on `<html>` or `<body>` in a prototype page. This would cascade to the whole page.
2. **Never** define app-level tokens (`--color-*`) on `:root`. They must be on `.device` so they're scoped.
3. **Never** move the stage tokens (`--stage-bg`, `--sb-*`) onto `.device`. The `.stage` is an *ancestor* of `.device`; CSS variables cascade down only — the stage couldn't read them and the page would show a transparent/white background.
4. **Never** use `--color-text` on `body` or side panels. Use `--sb-text` instead.
5. **Never** apply `[data-theme="dark"]` as a global selector. Always scope it: `.device[data-theme="dark"]` (or `light`).
6. **Never** re-declare the universal tokens (`--fs-*`, `--sp-*`, `--r-*`, `--dur-*`) outside `tokens.css`.

---

## Testing the separation

To verify the theme is properly scoped:

1. Open a prototype page (e.g. `/ANDROID-PROTOTYPE/prototypes/search-page/`).
2. Note the page background and side panel colors (dark gray in dark mode, light gray in light mode — they should follow the device theme via `:has()`).
3. Press the dark mode toggle inside the app (e.g. in the Settings screen).
4. **The device screen should flip theme.** The bezel should invert (platinum ↔ dark). The stage background and side panels should *follow* the new theme via `:has()` — but they never read `data-theme` directly from `<html>`.
5. Inspect `<html>` in devtools: it should have **no** `data-theme` attribute. Only `.device` should.
6. If the whole page snaps to a different stylesheet or the stage goes transparent/white, the scoping is broken — check that `data-theme` is on `.device`, and that stage tokens still live on `:root`.

---

## Future: page-level theme (not yet implemented)

If a future task requires a page-level dark mode (for the side panels and stage) that is *independent* of the app toggle, it would use a **separate** attribute on `<html>`:

```html
<html data-page-theme="dark">
  ...
  <div class="device" data-theme="light">
    ...
  </div>
</html>
```

This would allow the page and the app to have independent themes. For now, the stage follows the app theme via `:has()` and there is no separate page-level toggle.

---

*Last updated: Next.js migration (Phase 4) — tokens consolidated in `src/proto-kit/tokens/tokens.css`; theme applied by `<DeviceThemeProvider>`. Stage tokens live on `:root` and adapt via `:has(.device[data-theme="light"])`. Bezel inverts by theme (platinum dark / dark light).*
