# docs/agent-quickstart.md — 2-Minute Fast-Start for AI Agents

> **Read this if you're an AI agent and need to get productive immediately.**
> It condenses everything you need to start working into one page.
> For full detail, follow the links.

---

## What this repo is (30 seconds)

**ANDROID-PROTOTYPE** — a mobile UI prototyping workspace. We build **interactive, fully functional mobile app UI prototypes** (phone-frame mockups with real navigation, scrolling, toggles, etc.) and deploy them via **GitHub Pages**. The project is a **Next.js 16 static export** (App Router + TypeScript + CSS Modules): each prototype is a self-contained folder of React components, and `next build` produces pure static HTML/CSS/JS that GitHub Pages serves directly. No server, no backend.

- **Repo:** https://github.com/testplay-byte/ANDROID-PROTOTYPE
- **Live:** https://testplay-byte.github.io/ANDROID-PROTOTYPE/
- **Reference prototype:** https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/search-page/ (study its code at `app/prototypes/search-page/` + `src/prototypes/search-page/`)

---

## The 5 things you MUST know (60 seconds)

### 1. Read these files first (in order)
1. [`STARTUP.md`](../STARTUP.md) — master context
2. [`docs/preferences.md`](./preferences.md) — **all user design preferences** (don't violate these)
3. [`docs/template-rules.md`](./template-rules.md) — the rules every prototype follows
4. [`docs/theme-architecture.md`](./theme-architecture.md) — how app theme is scoped (CRITICAL)
5. [`docs/notification-protocol.md`](./notification-protocol.md) — how to notify the user

### 2. Notify the user on EVERY task completion
- **Topic:** `TASKISDONE` on ntfy.sh
- **Format:** 8 emojis (one color) on line 1, blank line, then message
- **Colors:** 🟩 success · 🟥 error · 🟦 paused · 🟧 processing
- Copy-paste command in [`docs/notification-protocol.md`](./notification-protocol.md)

### 3. The reference prototype is `app/prototypes/search-page/` + `src/prototypes/search-page/`
- To start a new prototype: scaffold `app/prototypes/<name>/` (`layout.tsx` + `page.tsx`) and `src/prototypes/<name>/` (`screens/`, `components/`, `hooks/`, `lib/`). Study `search-page` as the pattern — see [`docs/prototype-blueprint.md`](./prototype-blueprint.md).
- It uses the shared design system in `src/proto-kit/`: `<DeviceFrame>` (32px corners, theme-inverting bezel — platinum in dark, dark in light, per-theme widths), `<StatusBar>` (time, Wi-Fi 2/3, signal 2/4 left-bright, portrait battery, battery%), `<BottomNav>` (floating pill, content-sized active item, 42px pill / 58px bar), `<Stage>` (side panels), `<DeviceThemeProvider>`.
- **Theme is scoped to `.device`** — `data-theme` goes on the `.device` element, NOT `<html>`. The page never turns dark when the app toggle is pressed.
- Tokens live in `src/proto-kit/tokens/tokens.css` (single source of truth). Import it once in the prototype's `layout.tsx`.

### 4. Navigation discipline
- Every directory has a `navigation.md`. **Update it in the same commit** as any change.
- When you add/rename/move/delete a file, update the relevant `navigation.md`.
- Append to `CHANGELOG.md` when you finish a task.

### 5. Design preferences (don't violate)
- **Warm-cream palette for the dashboard** — never indigo/blue. Prototypes use their own M3 palette via `tokens.css`. See [`docs/preferences.md`](./preferences.md).
- **Frame bezel inverts by theme:** platinum (`#cfcfcf`) in dark mode, dark (`#0e0a17`) in light mode. Per-theme widths: 3.5px bezel / 4px edge in dark, 4px / 4.4px in light. Frame is in `src/proto-kit/device-frame/`.
- **32px corners**, **13px punch-hole**.
- **Signal bars**: LEFT 2 bright, RIGHT 2 dim. **Portrait battery** (vertical, small). **No Bluetooth icon**.
- **No visible scrollbar** anywhere. **No text selection** (`.device { user-select: none; }`).
- **Side panels** flank the device left/right (never top/bottom), hidden on <1024px (via the `<Stage>` component).

---

## Build & preview locally

```bash
cd /home/z/DESIGN-PROTOTYPE
npm install
npm run build          # static export → ./out

# Preview with correct basePath (/ANDROID-PROTOTYPE):
mkdir -p /tmp/preview/ANDROID-PROTOTYPE
cp -r out/* /tmp/preview/ANDROID-PROTOTYPE/
cd /tmp/preview && python3 -m http.server 3001
# → open http://localhost:3001/ANDROID-PROTOTYPE/
# → prototype: http://localhost:3001/ANDROID-PROTOTYPE/prototypes/<name>/
```

The `basePath: '/ANDROID-PROTOTYPE'` in `next.config.ts` keeps URLs identical to production. Always preview from `/tmp/preview/ANDROID-PROTOTYPE/` — serving `./out/` directly from the repo root will give you 404s for assets.

---

## Quick task guide (30 seconds)

| You need to... | Do this |
|---|---|
| Build a new prototype | Scaffold `app/prototypes/<name>/` + `src/prototypes/<name>/`, study `search-page` as the pattern. See [`docs/prototype-blueprint.md`](./prototype-blueprint.md). |
| Understand the file structure | Read [`docs/repo-map.md`](./repo-map.md) |
| Change a design preference | Update [`docs/preferences.md`](./preferences.md) + the relevant code |
| Fix a bug in the shared frame/nav | Edit `src/proto-kit/`, rebuild, push, notify |
| Add a shared component | Put it in `src/proto-kit/` (frame/nav/stage/tokens) or `templates/` (UI fragments) |
| Deploy | Just push to `main` — GitHub Actions runs `npm ci → next build → deploy out/` |
| Preview locally | `npm run build`, copy `out/*` to `/tmp/preview/ANDROID-PROTOTYPE/`, serve with `python3 -m http.server 3001` |

---

## The mandatory checklist before you push

- [ ] `npm run build` succeeds locally and `./out/` contains the prototype
- [ ] Previewed at `/tmp/preview/ANDROID-PROTOTYPE/prototypes/<name>/` — all screens + interactions work
- [ ] Navigation files updated (if structure changed)
- [ ] `CHANGELOG.md` has a new entry
- [ ] No secrets / absolute paths / backend calls
- [ ] Notification sent to ntfy.sh

---

*Last updated: Next.js migration (Phase 4) — project converted from static HTML/CSS/JS to Next.js 16 static export. Keep this page accurate — it's the fastest on-ramp for new agents.*
