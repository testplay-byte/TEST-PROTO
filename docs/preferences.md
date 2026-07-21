# docs/preferences.md — User Design Preferences (MEMORY FILE)

> **MANDATORY MEMORY FILE.** This captures the user's accumulated design preferences from feedback across multiple iterations.
> Any AI agent working on this repo **must** read this before designing anything. Do not violate these preferences.

---

## 1. Homepage

### Top navigation
- **Two disconnected pill containers** — NOT a full-width bar.
- Left pill: brand logo + "ANDROID-PROTOTYPE" name + subtitle.
- Right pill: Repo button + theme toggle.
- Each pill has: `border-radius: 12px`, `border: 1px solid border`, `background: card/90`, `backdrop-filter: blur(12px)`, `box-shadow: shadow-sm`, `padding`.
- Nothing connects the two pills — page background flows between them.
- Reference: https://testplay-byte.github.io/AIO-STUFF/ (copy this exactly).

### Hero
- **No eyebrow text** above the title.
- Title split into **exactly 2 lines**: "Interactive mobile UI prototypes" / "live in your browser." (second line in orange accent).
- **No lead paragraph** below the title.
- Never let the title wrap to 3 lines — 2 lines max.

### Bottom of page
- **No footer.**
- **No links strip** (Startup guide, Navigation map, etc.) — removed entirely.

### Prototype cards
- Phone silhouette in the center with info panels on **left and right** (3-column grid).
- Right panel should have **mini-charts**: a donut chart + bar chart + stats, not just text.

---

## 2. Prototype template (the phone mockup)

### Device frame
- **Bezel width is per-theme** (a bright/platinum border is visually heavier than a dark one, so it gets fewer pixels):
  - Dark app theme: `3.5px` bezel + `4px` edge rim (platinum border — thinner).
  - Light app theme: `4px` bezel + `4.4px` edge rim (dark border — kept as-is).
- **Corner radius**: 32px (not too rounded, not too sharp).
- Device shadow: soft drop shadow for depth, tuned per theme (`--frame-shadow`).
- **Bezel color INVERTS by theme** (anime-app, latest preference):
  - Dark app theme → **soft light/platinum** frame (`#cfcfcf` bezel + `#a8a8a8` rim). NOT stark white — the user found pure `#ffffff` too glaring ("reduce its whiteness a bit but don't turn it into black"). A soft platinum reads as a refined light metal.
  - Light app theme → **dark** frame (`#0e0a17` bezel + `#1b1729` rim) for contrast against the light screen.
  - The inversion gives premium contrast in both themes: the frame always contrasts with the screen interior.
- (Legacy search-page used a different warm palette: near-black `#1a1612` in light mode, medium-gray `#3a3530` in dark mode. The anime-app M3 purple palette uses the inversion approach above.)

### Status bar (left → center → right)
1. **Time** (left) — 12-hour, tabular-nums, ~13px, live clock.
2. **Punch-hole camera** (center) — **13px** circle (bigger per feedback), dark radial gradient.
3. **Right icons** (left to right):
   - **Wi-Fi** — 3 arcs, 2 bright (outermost dim).
   - **Mobile signal** — 4 bars, **LEFT 2 bright, RIGHT 2 dim** (`opacity: 0.3`). NOT the other way around.
   - **Portrait battery** — vertical orientation, small (8×16px), fill grows from bottom.
   - **Battery %** — to the **right** of the battery glyph.
- **No Bluetooth icon.** Removed permanently.

### Text selection
- **Entire page is `user-select: none`.** No text is selectable anywhere in the prototype.
- Global `selectstart` + `dragstart` listeners cancel any remaining selection.
- Only `<input>` / `<textarea>` allow text entry.
- The user hates drag-to-copy behavior — this must never happen.

### Dark mode scoping (CRITICAL)
- The app's dark mode toggle changes **ONLY the device's theme**, never the whole page.
- `data-theme` is set on the `.device` element, NOT on `<html>`.
- The page (stage background, side panels, body text) uses page-level tokens (`--stage-bg`, `--sb-*`) that never change.
- The app (device screen, cards, text) uses app-level tokens (`--color-*`) scoped to `.device`.
- The device bezel **inverts by theme** (anime-app): soft platinum in dark mode, dark in light mode — see "Device frame" above.
- **The user's exact words:** "Make sure that the whole page never turns into dark mode when a user presses a button inside the app. The app is a different part from the actual web page so only the app's theme color should change."
- See `docs/theme-architecture.md` for the full architecture.

### Scrollbar
- **No visible scrollbar** anywhere — not on the app screen, not on side panels.
- Use `scrollbar-width: none` + `::-webkit-scrollbar { display: none }`.
- Scrolling still works; the bar is just invisible.

### Side panels (desktop)
- **Left panel** and **right panel** flank the device horizontally.
- NEVER top/bottom — always left/right.
- Left: prototype name, description, screen list (clickable, syncs with device), tags.
- Right: screen info, mini-donut (components), mini-bars (interactions), stats.
- Hidden on screens <1024px.

### Mobile experience
- On mobile (≤480px), the app fills the viewport by default (no device frame).
- The **fullscreen button is mobile-only** — it gives a native-app full-screen experience by triggering the real browser Fullscreen API (`requestFullscreen` on the `.device` element). On PC (>480px) it's hidden — no need for fullscreen on a big screen.
- **When in fullscreen, the button completely disappears** (no exit button). The user exits via the system back button/gesture (mobile).
- The button only enters fullscreen — it never toggles to an exit button.
- Part of `<DeviceFrame>` in proto-kit, so every prototype gets it automatically.

### Custom on-screen keyboard (proto-kit)
- A custom QWERTY keyboard replaces the native soft keyboard on ALL platforms (mobile + desktop).
- `inputMode="none"` on inputs prevents the native keyboard from appearing.
- The keyboard writes to the input's value via the `onChange` callback (same as physical keyboard input).
- **No dismiss bar** — the user dismisses by tapping anywhere outside the input (blur with 200ms timeout).
- Layout (5 rows, no emoji): numbers (1-0), QWERTYUIOP, ASDFGHJKL, Shift+ZXCVBNM+Backspace, Space+Enter.
- Enter button is on the **right side** of the last row.
- Shift toggles uppercase; auto-disables after one letter (mobile-like).
- Key press state uses **pointer events** (not CSS `:active`) for reliable theme-color flash on both desktop and mobile.
- Keys use `tabIndex={-1}` + `onMouseDown preventDefault` so they never steal focus from the input.
- Animations: slide-up (emphasized-decel), staggered key pop-in by row, scale(0.92) + primary color on press.
- Architecture: `<KeyboardProvider>` + `useKeyboardInput()` hook + `<Keyboard>` component in proto-kit.

### Scrolling (desktop) + swipe gestures (proto-kit, permanent)
- The device screen supports **click-drag-to-scroll** via the `useSwipeSimulation` hook — a permanent part of proto-kit:
  - Click + drag vertically → grab-scrolls the content (1:1 movement, cursor: grab → grabbing).
  - Click + drag horizontally past 70px → navigates between screens (left = next, right = previous).
  - Swipe right on the detail screen → back gesture (closes detail).
  - Clicks after a drag (>8px) are suppressed so you don't accidentally open a card.
  - Text selection and image ghost-dragging are prevented during drag (`preventDefault` on all moves + `-webkit-user-drag: none` on images).
- Every prototype wires it up in its page.tsx with its own screen order + navigation callbacks. The grab cursor + image-drag-prevention CSS live globally in proto-kit's device-frame CSS.
- Touch input is left alone — native touch scrolling still works on mobile. The hook only activates for mouse/pen.
- Dragging is ignored on interactive elements (buttons, links, inputs, toggles) so their clicks still work.
- This is in addition to native wheel scrolling and trackpad gestures.

### Content
- Prototypes must be **fully navigable**: multiple screens, scrollable content, clickable buttons, toggles, etc.
- Not static screens — real interaction.

---

## 3. Color palette

### Homepage (warm cream — from AIO-STUFF)
- Background: `#f2e8da`
- Card: `#f9f2ea`
- Foreground: `#1e1a13`
- Primary: `#231e18` (dark)
- Primary foreground: `#f9f2ea`
- Muted foreground: `#5d574e`
- Border: `#d7cec1`
- Chart accents: `#f05100` (orange), `#0fa05c` (green), `#3d6a7f` (teal), `#f2a618` (amber), `#f0503d` (red)

### Dark theme
- Background: `#12100e`
- Card: `#1c1916`
- Foreground: `#ebe7e2`
- Primary: `#e1ddd8`
- Chart accents: `#fe6a00`, `#43c07a`, `#608da4`, `#f0b135`, `#f75f4c`

### Rule
- **Never use indigo or blue** as primary colors.
- Warm earth tones (cream, beige, amber, orange) are the approved palette.

---

## 4. References

| Reference | URL | What to copy |
|-----------|-----|--------------|
| AIO-STUFF | https://testplay-byte.github.io/AIO-STUFF/ | Homepage nav (pill containers), color palette, hero layout, stat cards, charts |
| INFRO/app | https://testplay-byte.github.io/INFRO/app/ | Device frame proportions, side panel concept, mobile full-screen switch, warm minimalist aesthetic |

Both are the user's own creations — copy freely.

---

## 5. Notification protocol
- **Always** notify on task completion via ntfy.sh, topic `TASKISDONE`.
- 8 emojis (single color) on line 1: 🟩 success, 🟥 error, 🟦 paused, 🟧 processing.
- See `docs/notification-protocol.md` for the full spec.

---

## 6. Material 3 Expressive design (for prototypes that use M3)

When a prototype uses Material 3 (like the search-page), follow these rules:

### Elevation = tonal surfaces, NOT heavy shadows
- M3 dark theme uses **surface color tiers** for elevation: `surface-1` → `surface-2` → `surface-3` → `surface-4` → `surface-5`.
- Higher elevation = **lighter tone** (in dark theme).
- **Do NOT use `box-shadow` for elevation** — use tonal surface colors.
- The only exception: the device frame's outer drop shadow (for depth against the page background).

### Bottom navigation — floating, rounded, text beside icon
- **Floating**: the nav bar has padding from all edges (12px left, right, bottom). It does NOT stretch edge-to-edge.
- **Rounded corners**: use `border-radius: 20px` (or `--r-lg`).
- **Shadow**: a subtle drop shadow (`0 4px 16px rgba(0,0,0,.25)`) makes it float above the content.
- **Horizontal layout**: the active nav item shows **text beside the icon** (horizontal `flex-direction: row`), NOT below it.
- **Non-active items**: show **icon only** (no text label).
- **Active pill is content-sized (anime-app, latest)**: the active item uses `flex: 0 1 auto` so it expands to fit its **full label** (never truncated — "Settings", "Library", "History" all show completely). Inactive items stay `flex: 1 1 0` (compact, icon-only). This is the M3 expanding-pill behavior. The user found equal-width pills truncated labels after a few letters — "increase its width a little bit so that the full name can be shown properly."
- **Slim pill height (anime-app, latest)**: active pill `42px` tall, nav bar `58px` tall. The user found the previous `48px`/`64px` too chunky — "its height is way too much."
- **Tonal background**: use `surface-3` (a higher tier than the content background) for the nav bar.
- **NO border line**: no `border-top` or divider — the tonal surface + shadow provides separation.
- The user explicitly said: "floating kind of rounded corners navigation bar with some padding on the right side, some padding on the left side, some padding on the bottom" and "show the text on the right side of the logo itself instead of showing it at the bottom."

### Home indicator — REMOVED
- The iPhone-style gesture bar (`.home-indicator`) has been **removed permanently**.
- The bottom navigation bar is the last element inside the device.
- Do NOT re-add it.

### Type scale
- Use a proper M3 type scale: display (32px) → h1 (26px) → h2 (22px) → h3 (18px) → body-large (16px) → body (14px) → label (12px) → label-small (11px).
- Headlines should use negative letter-spacing (`-.02em` for display, `-.01em` for h1/h2).

### Motion
- Use M3 emphasized easing: `cubic-bezier(.3, 0, 0, 1)` for enter/exit, `cubic-bezier(.05, .7, .1, 1)` for decelerate.
- Stagger card animations: 40ms delay per card index.
- Bottom sheet slides up with `var(--dur-5)` (500ms) emphasized easing.

### Collapsing header on scroll
- When the user scrolls the content down (past ~20px), the top bar should **collapse smoothly**:
  - Title font shrinks (e.g., display → h2)
  - Search bar height shrinks (e.g., 56px → 44px)
  - Source toggle scales down (0.9)
  - Padding and gaps reduce
- When the user scrolls back to the top, the top bar **expands** back to full size.
- Use CSS transitions with M3 emphasized easing for smooth animation.
- The user explicitly said: "When the user scrolls on the search page, the top options getting minimized or getting hidden a bit would be a better option too, smoothly the options get hidden."

### Separated Filters and Sort
- **Filters** and **Sort** should be in **separate, distinguishable areas** — not combined in one row as equals.
- Filters button: tonal-filled (`surface-2` background), prominent, with a badge count.
- Sort button: outlined, secondary, with a chevron icon that rotates when the dropdown is open.
- Sort opens its **own dropdown menu** (not the filter sheet) — positioned above the sort button.
- The user explicitly said: "I kind of do not feel like it is a good idea to handle them like that. I think maybe you could add the filters option to a separate area."

### Settings page
- Every prototype with a bottom nav should have a **functional Settings page**.
- Must include a **light/dark theme toggle** (M3 segmented buttons).
- Theme must **persist** in localStorage and apply to the `.device` element (scoped theming).
- Theme key: `<prototype-name>-theme` (e.g., `search-theme`).
- **Poster style**: text-only segmented control (Rounded / Soft / Sharp). No image previews, no circle option.
- **Card density**: text-only segmented control (Compact / Default / Comfortable). No dot previews.
- Both use a clean pill-style segmented control with primary background on the active option.

### Library page
- **Long-press** (500ms) on a card enters **selection mode** — no X button on cards.
- Selection mode: tap cards to toggle selection. Purple checkmark circles on selected items.
- **Bottom action bar** sits ON TOP of the bottom nav (same position/dimensions, replaces it visually).
  Buttons are horizontal (icon + label side by side). Actions: Cancel, Category, Delete.
- **Category menu** (renamed from Status): shows current categories as chips at top, divider,
  then "Move to category" options (Watching / Completed / Plan to Watch).
- **Customize sheet** (gear button in topbar): 5 organized sections:
  1. Layout (Grid / List)
  2. Columns per row (2–5, grid only)
  3. Text placement (Below cover / On cover, grid only)
  4. Cover details (Show format toggle, Show episode count toggle)
  5. Episode badge position (Top L / Top R / Bot L / Bot R / Off, grid only)
- No dismiss handle on the sheet — tap scrim to close.

### Continue Watching
- Horizontal scrollable cards at the top of History (and Home).
- Each card: banner image, play icon (center), episode label (top-right), title overlay (bottom),
  progress bar (bottom edge, primary color fill).
- Progress is simulated (advances 15–35% on each view, wraps to next episode past 100%).

### Recent searches
- Show only **3 items by default** — don't let recent searches push the anime grid down.
- Add a **"Show N more"** button to expand (with a chevron that rotates).
- "Show less" to collapse.
- Max 12 stored in localStorage.

---

## 7. Native Android app (Kotlin + Jetpack Compose)

The end goal is to build **native Android apps** that match the prototypes exactly. The web prototypes
are the design reference; the Android apps are the deliverable.

- **Location**: `Android_app/<App_Name>/` in the repo root.
- **Tech stack**: Kotlin 2.0+ / Jetpack Compose / Material 3 / Navigation Compose / Coil / Ktor / DataStore.
- **Build**: GitHub Actions builds the APK (debug-signed) and uploads it as an artifact.
- **Design**: match the prototype's M3 dark purple theme, tonal elevation, type scale, motion,
  bottom nav (floating, content-sized active pill), collapsing headers, card animations, etc.
- **Improvement docs**: `Android_app/<App_Name>/IMPROVEMENTS.md` — tracks what needs work to
  match the prototype more closely.

### Critical Android-specific rules (learned from Anime_App, 16 builds)

1. **Bundle the Roboto font** — Android's system Roboto may not have ExtraBold (800) weight installed. Bundle TTF files in `res/font/` and use `FontFamily` in Typography. Without this, bold text renders as Regular on some devices.
2. **Use `FontWeight.ExtraBold` (800), not `Bold` (700)** — Android's Roboto at Bold (700) doesn't look dramatically different from Normal at small sizes.
3. **Title sizes: 36sp expanded, 26sp collapsed** — bigger than the prototype's 32px because Android sp reads smaller.
4. **NEVER use negative padding** — use `Modifier.offset(y = (-N).dp)` instead.
5. **NEVER use `weight(0f)`** — omit weight for content-sized items.
6. **Floating bottom nav** — use `Box` overlay, NOT `Scaffold(bottomBar = ...)`.
7. **CollapsingHeader pinned** — place OUTSIDE the scroll Column (above it).
8. **Background color** — set `.background(MaterialTheme.colorScheme.background)` on root + `android:colorBackground` in themes.xml.
9. **Theme persistence** — `MainActivity` reads `settings.darkTheme` from DataStore, NOT hardcoded.
10. **Container padding: 8dp outer** — 16dp looks too far from device edges on Android.

Full documentation: [`docs/android-dev/`](../docs/android-dev/) — 14 golden rules, crash lessons, UI patterns, build guide, and 8-phase workflow.

---

## 8. Workflow for AI agents (CRITICAL — read this before starting work)

The user has explicitly praised the following workflow. **Follow it every time:**

1. **Research first** — Before designing, search the web for:
   - "Material 3 design best practices"
   - "why AI generated UI looks bad common mistakes"
   - Modern UI techniques for the specific app type (e.g., "anime app UI design")
   - Use the `web-search` skill (z-ai CLI: `z-ai function -n web_search -a '{"query": "...", "num": 5}'`)

2. **Analyze the current state** — Screenshot the live site with Agent Browser, then use VLM to get brutally honest feedback:
   - `z-ai vision -p "Be brutally honest: what looks bad, ugly, or AI-generated?" -i screenshot.png`
   - List every problem the VLM identifies.

3. **Implement fixes** — Address every problem from the VLM analysis. Apply modern M3 techniques (tonal elevation, proper type scale, emphasized easing).

4. **Verify with VLM on the LIVE site** (not just localhost):
   - Screenshot the live URL with Agent Browser.
   - Use VLM to verify: "Does it look polished and professional, or still AI-generated?"
   - If VLM rates it below 7/10, iterate.

5. **Never skip verification** — The user will check, and they will notice if you didn't verify.

### Why AI UI looks bad (common mistakes to avoid)
- Using "clean and modern" as a style descriptor (too vague → generic output)
- Not specifying the platform (mobile vs desktop)
- Flat cards with no elevation/depth
- Inconsistent spacing (uneven gaps between elements)
- Low contrast text
- Small touch targets
- Generic color schemes (the user hates indigo/blue)
- No personality or branding
- Forgetting to verify the result

---

*Last updated: after search-page v4 (settings page, improved recent searches, removed home indicator, staggered animations, M3 tonal elevation, workflow documentation).*
