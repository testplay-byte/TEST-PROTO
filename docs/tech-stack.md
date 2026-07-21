# docs/tech-stack.md — Prototype Tech Stack

> What each prototype is built with, and why. Stick to this unless you have a strong reason and you document it.

---

## Core stack (shared across all prototypes)

| Layer          | Choice                                              | Why                                                                                  |
|----------------|-----------------------------------------------------|--------------------------------------------------------------------------------------|
| Framework      | Next.js 16 (App Router) + TypeScript 5              | Component model, type safety, hot reload in dev; static export in prod.              |
| React          | React 19 (client components for state/interaction)  | Modern hooks, concurrent rendering; only the parts that need interactivity ship JS.  |
| Export         | `output: 'export'` in `next.config.ts`              | Produces pure static HTML/CSS/JS in `./out` — GitHub Pages serves it directly, no server. |
| basePath       | `/ANDROID-PROTOTYPE`                                | Matches the GitHub Pages project URL; keeps links identical in dev and prod.         |
| Styling        | CSS Modules (scoped per component, `.module.css`)   | Locally-scoped class names, no runtime, easy to audit, no naming collisions.         |
| Shared tokens  | `src/proto-kit/tokens/tokens.css`                   | Single source of truth for type/spacing/radius/motion + M3 color roles + stage tokens. Imported once per prototype layout. |
| Frame          | `proto-kit` `<DeviceFrame>` (bezel + status bar)    | Defined ONCE in `src/proto-kit/device-frame/`, inherited by every prototype. Frame inverts by theme. |
| Icons          | Inline SVG (stroke=`currentColor`)                  | Crisp, themeable via CSS, no font payload, no extra deps.                            |
| Fonts          | System font stack (configured in `app/layout.tsx`)  | Fast, native-feeling typography; no network fetch.                                   |
| State          | React `useState`/`useReducer` + `localStorage`      | Per-component state, persisted per-prototype via `storageKey`.                       |
| Routing        | Hash routing (`#home`, `#search`)                   | Preserves the in-app feel; works with no server; survives reloads; back/forward works. |
| Theme          | `<DeviceThemeProvider storageKey="...">`            | Client component that sets `data-theme` on the `.device` element (scoped, not on `<html>`). |

---

## The phone frame

Every prototype is wrapped in a **phone mockup** (`<DeviceFrame>`) so that on desktop it visibly reads as "this is a mobile screen".

The shared frame in `src/proto-kit/device-frame/` ships:

- A centered device shell (390×844 viewport, 32px corner radius, iPhone/Android-ish proportions).
- A status bar (time, Wi-Fi, signal, portrait battery, battery%) — decorative.
- A scrollable `<Screen>` area clipped to the device.
- A floating `<BottomNav>` slot (content-sized active pill, 42px pill / 58px bar).
- Theme-inverting bezel: **platinum** (`#cfcfcf`) in dark mode (thinner, 3.5px/4px), **dark** (`#0e0a17`) in light mode (slightly thicker, 4px/4.4px). Token-driven — see `src/proto-kit/tokens/tokens.css`.

On narrow viewports (≤480px actual phones), the frame collapses to full-screen so it behaves like a real app (no bezel, no chrome).

See [`design-standards.md`](./design-standards.md) and [`template-rules.md`](./template-rules.md) for exact dimensions, and [`theme-architecture.md`](./theme-architecture.md) for the token layers.

---

## What we deliberately avoid

| Avoid                             | Reason                                                                 |
|-----------------------------------|------------------------------------------------------------------------|
| Backend / database / API keys     | Prototypes are front-end only. Mock all data in-file (or fetch read-only public APIs like AniList). |
| Heavy UI kits (Material UI etc.)  | Bloats and obscures the design intent. The shared `proto-kit` covers the frame/nav/stage; build the rest by hand with tokens. |
| Server-side rendering / API routes| `output: 'export'` disables them. Everything must run client-side or at build time. |
| `next/image` optimization         | Disabled (`images.unoptimized: true`) — required for static export. Use plain `<img>` or inline SVG. |
| Cross-prototype CSS/JS imports    | Each prototype imports from `src/proto-kit/` only. Prototype-specific code stays under `src/prototypes/<name>/`. |
| jQuery                            | Outdated; React 19 + hooks is shorter and faster now.                  |

---

## When you need a library not listed here

1. Check if React + CSS Modules can do it. Usually yes.
2. If not, prefer a **single-file library** with no SSR/server requirements (the static export can't run server code).
3. Document the dependency in the prototype's `navigation.md` (name, version, why).
4. If a prototype truly needs something that breaks the static export model, raise it with the user first (🟦 notification).

---

## Build & preview

```bash
# Install (once, or after package.json changes)
npm install

# Build the static export → ./out
npm run build

# Preview with the correct basePath (/ANDROID-PROTOTYPE):
mkdir -p /tmp/preview/ANDROID-PROTOTYPE
cp -r out/* /tmp/preview/ANDROID-PROTOTYPE/
cd /tmp/preview && python3 -m http.server 3001
# → http://localhost:3001/ANDROID-PROTOTYPE/
# → http://localhost:3001/ANDROID-PROTOTYPE/prototypes/<name>/
```

CI runs the same `npm ci → next build` pipeline (see `.github/workflows/deploy.yml`).

---

*Last updated: Next.js migration (Phase 4) — project converted from static HTML/CSS/JS to Next.js 16 static export.*
