# docs/prototype-blueprint.md — How to Build a New Prototype

> A detailed, step-by-step blueprint for creating a new prototype on top of `src/proto-kit/`.
> Read this alongside [`docs/workflow.md`](./workflow.md) (which is the high-level process).
> This is the **how-to with specifics**.
>
> **Reference implementation:** `app/prototypes/search-page/` + `src/prototypes/search-page/`. Study it before you start — it is the canonical pattern.

---

## Prerequisites

Before you start, you should have read:
- [`STARTUP.md`](../STARTUP.md)
- [`docs/preferences.md`](./preferences.md) — user's design preferences
- [`docs/template-rules.md`](./template-rules.md) — the rules every prototype follows
- [`docs/theme-architecture.md`](./theme-architecture.md) — how theming works (scoped to `.device`)
- [`docs/tech-stack.md`](./tech-stack.md) — the allowed tech + why

And skimmed the reference prototype:
- `app/prototypes/search-page/layout.tsx` — how tokens are imported
- `app/prototypes/search-page/page.tsx` — the shell + hash router pattern
- `src/prototypes/search-page/screens/*.tsx` — one file per screen

---

## Step 1: Name the prototype

- Use `kebab-case`, descriptive of the app or flow.
- Examples: `food-delivery-checkout`, `bank-onboarding`, `music-player-home`.
- Avoid generic names like `app1` or `prototype-v2`.

---

## Step 2: Scaffold the two folders

Each prototype lives in **two** places:

```bash
cd /home/z/DESIGN-PROTOTYPE

# 1. The Next.js route (thin shell):
mkdir -p app/prototypes/<your-name>

# 2. The prototype's source (screens/components/hooks/lib):
mkdir -p src/prototypes/<your-name>/{screens,components,hooks,lib}
```

You now have:

```
app/prototypes/<your-name>/
├── layout.tsx     ← Imports tokens.css + prototype CSS. Pass-through wrapper.
└── page.tsx       ← Client component. Shell + hash router → renders screens.

src/prototypes/<your-name>/
├── <your-name>.css          ← Prototype-wide token overrides + globals.
├── screens/                 ← One file per screen (.tsx + .module.css).
├── components/              ← Prototype-specific UI pieces (.tsx + .module.css).
├── hooks/                   ← Prototype-specific hooks.
└── lib/                     ← Prototype-specific logic (API clients, filters, types).
```

### `layout.tsx` (minimal)

```tsx
import type { Metadata } from "next";
import "../../../src/proto-kit/tokens/tokens.css";
import "../../../src/prototypes/<your-name>/<your-name>.css";

export const metadata: Metadata = {
  title: "<Your Name> — ANDROID-PROTOTYPE",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

### `page.tsx` (shell + hash router)

```tsx
"use client";
import { useEffect, useState } from "react";
import {
  DeviceThemeProvider,
  DeviceFrame,
  Screen,
  Stage,
  BottomNav,
} from "../../../src/proto-kit";
import { HomeScreen } from "../../../src/prototypes/<your-name>/screens/home-screen";
// … other screens …

type ViewId = "home" | "search" | "settings";

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: (/* …svg… */) },
  // …
];

function readHashView(): ViewId {
  if (typeof window === "undefined") return "home";
  const h = window.location.hash.replace(/^#/, "");
  return (["home", "search", "settings"] as const).includes(h as ViewId)
    ? (h as ViewId)
    : "home";
}

export default function Page() {
  const [view, setView] = useState<ViewId>("home");

  useEffect(() => setView(readHashView()), []);
  useEffect(() => {
    function onPop() { setView(readHashView()); }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  function handleNav(id: string) {
    const next = id as ViewId;
    if (next === view) return;
    try { history.pushState(null, "", `#${id}`); } catch {}
    setView(next);
  }

  return (
    <DeviceThemeProvider storageKey="<your-name>-theme" initialTheme="dark">
      <Stage leftPanel={/* … */} rightPanel={/* … */}>
        <DeviceFrame theme="dark">
          <Screen>
            {view === "home" && <HomeScreen />}
            {view === "search" && <SearchScreen />}
            {view === "settings" && <SettingsScreen />}
            <BottomNav items={NAV_ITEMS} activeId={view} onSelect={handleNav} />
          </Screen>
        </DeviceFrame>
      </Stage>
    </DeviceThemeProvider>
  );
}
```

Copy the full pattern from `app/prototypes/search-page/page.tsx` — don't reinvent it.

---

## Step 3: Plan your screens

Before writing code, decide:
1. **How many screens?** (typically 3–6 for a prototype)
2. **What is each screen?** (home, search, detail, settings, profile, etc.)
3. **What navigation pattern?** (bottom nav with tabs? stack with back button? both?)
4. **What interactions?** (buttons, toggles, forms, lists, cards)

Write this down in the prototype's `navigation.md` as a screen list.

---

## Step 4: Build each screen as one file

Each screen is a self-contained React component in `src/prototypes/<your-name>/screens/`:

```
screens/
├── home-screen.tsx
├── home-screen.module.css
├── search-screen.tsx
├── search-screen.module.css
└── …
```

### Screen component shape

```tsx
"use client";  // only if the screen uses hooks/interaction
import styles from "./home-screen.module.css";

export function HomeScreen() {
  return (
    <div className={styles.root}>
      <header className={styles.appbar}>
        <h1 className={styles.title}>Home</h1>
      </header>
      <div className={styles.content}>
        {/* your screen content here */}
      </div>
    </div>
  );
}
```

- Use the shared tokens (`var(--color-bg)`, `var(--sp-4)`, `var(--r-md)`, …) — never hardcode colors/spacing.
- Use CSS Modules for scoped styles — class names are auto-prefixed.
- Keep each screen self-contained — edit one without touching the others.

---

## Step 5: Use the proto-kit components

Import from `src/proto-kit` (the barrel re-exports everything):

```tsx
import {
  DeviceThemeProvider, useDeviceTheme,
  DeviceFrame, Screen,
  StatusBar,
  BottomNav,
  Stage, PanelBadge, PanelTitle, PanelDesc, PanelHead,
} from "../../../src/proto-kit";
```

| Component | Role |
|---|---|
| `<DeviceThemeProvider storageKey="..." initialTheme="dark">` | Wraps the prototype. Sets `data-theme` on `.device` (scoped, not on `<html>`). Persists theme to `localStorage[storageKey]`. |
| `<DeviceFrame theme="dark">` | The phone mockup: bezel + status bar + screen slot. Bezel inverts by theme automatically. |
| `<Screen>` | The scrollable app area below the status bar. Put your screens + `<BottomNav>` inside. |
| `<BottomNav items activeId onSelect>` | Floating pill nav. Active item is content-sized (full label visible). Pass your `NAV_ITEMS` array. |
| `<Stage leftPanel rightPanel>` | Desktop layout: device centered + left/right info panels. Hidden on <1024px. |
| `useDeviceTheme()` | Hook for in-app theme toggles. Returns `{ theme, setTheme, toggleTheme }`. |

---

## Step 6: Style with tokens + CSS Modules

### 6.1 Override tokens (only if the brand differs from default M3 purple)

`tokens.css` defaults to the M3 purple palette (`--color-primary: #d0bcff` dark / `#6750a4` light). If your app has a different brand, override the palette on `.device` in your prototype's CSS:

```css
/* src/prototypes/<your-name>/<your-name>.css */
.device {
  --color-primary: #your-brand-color;
  --color-primary-fg: #ffffff;
}
.device[data-theme="light"] {
  --color-primary: #your-light-brand-color;
}
```

**Don't change** the universal tokens (`--fs-*`, `--sp-*`, `--r-*`, `--dur-*`) or the stage tokens (`--stage-bg`, `--sb-*`). See [`docs/theme-architecture.md`](./theme-architecture.md).

### 6.2 Add your components

Each component gets its own `.module.css`. Use the existing tokens (`var(--sp-lg)`, `var(--color-surface-2)`, etc.) for consistency.

### 6.3 Keep these rules intact (already enforced by proto-kit)
- `.device { user-select: none; }` — no text selection (in `device-frame.module.css`).
- Scrollbar hidden on scrollable containers (`scrollbar-width: none` + `::-webkit-scrollbar { display: none }`) — add this to your own scrollable containers if needed.
- `.device` collapses to full viewport on ≤480px (in `device-frame.module.css`).

---

## Step 7: Add prototype-specific hooks/lib

Put reusable logic in the right subfolder:

| Subfolder | What goes here |
|---|---|
| `hooks/` | React hooks (`use-anilist.ts`, `use-history.ts`, …). Use `"use client"` if they touch the DOM/localStorage. |
| `lib/` | Pure logic: API clients, filters, types, utilities. No React imports. |
| `components/` | UI pieces used across multiple screens (cards, dropdowns, sheets). Each with its own `.module.css`. |

---

## Step 8: Fill in documentation

### 8.1 `src/prototypes/<your-name>/navigation.md` (or alongside the route)
```markdown
# <your-name> — navigation

## What this prototype is
<one-paragraph description>

## Screens
| Screen | View id | Description |
|--------|---------|-------------|
| Home   | `home`  | Browse restaurants |
| …      | …       | … |

## Interactions
- Like buttons (toggle)
- Quantity steppers
- …

## Files
| File | What it is |
|------|------------|
| `app/prototypes/<your-name>/page.tsx` | Shell + hash router |
| `src/prototypes/<your-name>/screens/*.tsx` | One file per screen |
| … | … |

## Live URL
https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/<your-name>/
```

### 8.2 `README.md`
A shorter version — name, description, screens list, live link.

---

## Step 9: Register in the index

Update the prototypes index (e.g. `public/prototypes/navigation.md`) and add a row to the dashboard gallery in `app/page.tsx` so the new prototype appears on the homepage.

---

## Step 10: Build & verify locally BEFORE pushing

```bash
cd /home/z/DESIGN-PROTOTYPE
npm run build          # must succeed with no type errors

# Preview with the correct basePath:
mkdir -p /tmp/preview/ANDROID-PROTOTYPE
cp -r out/* /tmp/preview/ANDROID-PROTOTYPE/
cd /tmp/preview && python3 -m http.server 3001
# → open http://localhost:3001/ANDROID-PROTOTYPE/prototypes/<your-name>/
```

Click through every screen, test every interaction. The build MUST succeed locally before pushing — CI runs the same `next build` and will fail the deploy on type errors.

---

## Step 11: Commit, push, verify live

```bash
cd /home/z/DESIGN-PROTOTYPE
git add app/prototypes/<your-name> src/prototypes/<your-name> app/page.tsx public/prototypes/navigation.md
git commit -m "feat: add <your-name> prototype

- <N> screens: <list>
- <key interactions>
- Built on proto-kit + tokens.css"
git push origin main
```

Wait ~60s for the GitHub Actions deploy, then open:
`https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/<your-name>/`

Click through every screen again on the live URL. If something's broken, fix and re-push.

---

## Step 12: Notify the user

Send an ntfy.sh notification (🟩 green for success):

```bash
curl -H "Title: ANDROID-PROTOTYPE" \
  -d "🟩🟩🟩🟩🟩🟩🟩🟩

Prototype ready: <your-name>.
- <N> screens: <list>
- <key interactions>
Live: https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/<your-name>/
Status: awaiting your review." \
  https://ntfy.sh/TASKISDONE
```

---

## Common pitfalls

| Pitfall | Fix |
|---------|-----|
| Whole page turns dark when app toggle pressed | `data-theme` must be on `.device`, not `<html>`. Use `<DeviceThemeProvider>` — don't set it manually. See [`docs/theme-architecture.md`](./theme-architecture.md). |
| `npm run build` fails on type errors | TypeScript strictness is on (`ignoreBuildErrors: false`). Fix the types — don't loosen the config. |
| Assets 404 in production | Use plain `<img>` with paths under `public/` (served at `/ANDROID-PROTOTYPE/...`). `next/image` is disabled. |
| Prototype works in `npm run dev` but 404s in production | The `basePath: '/ANDROID-PROTOTYPE'` is applied at build time. Preview from `/tmp/preview/ANDROID-PROTOTYPE/` to reproduce it. |
| Scrollbar visible | Add `scrollbar-width: none` + `::-webkit-scrollbar { display: none }` to your scrollable containers. |
| Text gets selected on drag | Don't remove `.device { user-select: none; }`. Don't add global `selectstart` listeners (they block scrolling). |
| Side panels disappear | They're hidden on <1024px (via `<Stage>`). Test on a wide viewport. |
| Battery/signal look wrong | Don't modify the `<StatusBar>` — it follows the spec in [`docs/template-rules.md`](./template-rules.md). |
| CI fails on `npm ci` | `package-lock.json` must be committed. Never re-add it to `.gitignore`. See [`docs/github-pages.md`](./github-pages.md). |
| Prototype doesn't deploy | Check the Actions tab on GitHub. Ensure you pushed to `main` and the build passed locally first. |

---

*Last updated: Next.js migration (Phase 4) — prototypes now scaffolded as `app/prototypes/<name>/` + `src/prototypes/<name>/`, built on `src/proto-kit/`. Reference pattern: `app/prototypes/search-page/`. Follow this blueprint for every new prototype.*
