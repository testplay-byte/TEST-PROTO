# STARTUP.md — Read This First

> **If you are an AI agent (or a human) opening this repository for the first time, read this file in full before doing anything else.**
> This file is the single source of truth for *what this project is, how it is organized, and how to work in it without breaking things.*

---

## 1. What Is This Project?

This repository — **`ANDROID-PROTOTYPE`** — is a **mobile UI prototyping workspace**.

We design **mobile app UI interfaces** (Android-style, but viewable in any modern web browser) and deploy them as **live, interactive prototypes** via **GitHub Pages**. Each prototype is a real, clickable, fully functional web UI — not a static screenshot.

The goal is to validate look-and-feel on the web *before* committing to a native Android build.

---

## 2. Who Works Here?

- **The user (owner):** Provides design briefs, reviews prototypes, makes go/no-go decisions.
- **AI agents (you, most likely):** Create prototypes, manage the repo, write docs, keep navigation files updated, and notify the user on task completion.
- **Future AI agents:** Will rely on this file + every `navigation.md` to understand prior work. **Always leave the repo more navigable than you found it.**

---

## 3. Repository Layout (High Level)

```
ANDROID-PROTOTYPE/
├── STARTUP.md              ← YOU ARE HERE. Master context. Read first.
├── README.md               ← Public landing page for GitHub.
├── navigation.md           ← Root navigation map (every folder + what's in it).
├── CHANGELOG.md            ← Running log of notable changes.
├── package.json            ← Next.js 16 + React 19 + TypeScript.
├── next.config.ts          ← Static export (output:'export'), basePath '/ANDROID-PROTOTYPE'.
├── tsconfig.json           ← TypeScript config (@/* → src/*, @app/* → app/*).
├── app/                    ← Next.js App Router (routes = thin).
│   ├── layout.tsx          ← Root layout (fonts, metadata, <html>).
│   ├── page.tsx            ← Dashboard / prototypes gallery (GitHub Pages root).
│   ├── globals.css         ← Minimal global reset.
│   └── prototypes/         ← Next.js prototypes (one route folder each).
├── src/
│   ├── dashboard/          ← Dashboard styles + theme toggle client component.
│   └── proto-kit/           ← SHARED design system (fix once, inherit everywhere).
│       ├── tokens/tokens.css  ← SINGLE source of truth for all design tokens.
│       ├── device-frame/      ← Phone mockup (bezel, status bar, screen slot).
│       ├── bottom-nav/        ← Floating nav, content-sized active pill.
│       ├── stage/             ← Side panels + stage layout.
│       ├── theme/             ← Device-scoped theme provider (dark/light).
│       └── index.ts           ← Barrel export.
├── public/                 ← Static files served verbatim by Next.js.
│   ├── prototypes/         ← Legacy static prototypes (preserved during migration).
│   └── assets/             ← Shared static assets (icons, fonts, images).
├── templates/              ← Reusable UI fragments (agent reference, not served).
├── archive/                ← Backup of the pre-Next.js static site (zip + manifest).
├── docs/                   ← All documentation (workflow, standards, deploy, etc.).
│   ├── navigation.md       ← Index of docs/.
│   ├── agent-quickstart.md ← 2-minute fast-start for any AI agent.
│   ├── prototype-blueprint.md ← Step-by-step guide to build a new prototype.
│   ├── repo-map.md         ← Visual annotated tree of the entire repo.
│   ├── workflow.md         ← High-level prototype workflow.
│   ├── tech-stack.md       ← Allowed tech + rationale.
│   ├── design-standards.md ← UI/UX standards (spacing, type, color, frame).
│   ├── template-rules.md   ← Rules every prototype follows.
│   ├── theme-architecture.md ← CRITICAL: app theme scoped to .device.
│   ├── preferences.md      ← MANDATORY MEMORY: all user design preferences.
│   ├── notification-protocol.md ← MANDATORY: how to notify via ntfy.sh.
│   ├── github-pages.md     ← Deployment guide + troubleshooting.
│   └── git-conventions.md  ← Branch, commit, PR conventions.
├── Android_app/                ← Native Android apps (Kotlin + Compose). APK built via Actions.
│   ├── navigation.md           ← Index of Android apps.
│   └── Anime_App/              ← First Android app (matches the anime-app prototype).
│       └── IMPROVEMENTS.md     ← Gap tracker (what's done vs. what needs work).
└── .github/
    ├── navigation.md
    └── workflows/
        ├── deploy.yml          ← GitHub Pages auto-deploy (Next.js build → out/).
        └── build-apk.yml       ← Android APK build (debug-signed, artifact upload).
```

> **Homepage design language:** the dashboard (`app/page.tsx`, styles in `src/dashboard/dashboard.css`) follows the approved warm-cream theme (cream `#f2e8da` bg, dark `#231e18` primary, orange `#f05100` chart accents) with a split top nav and a hero + stat cards + charts layout. Do not revert to a generic/blue look. See `docs/template-rules.md` for prototype-frame rules.
>
> **Prototype design language:** prototypes use `src/proto-kit/` (shared DeviceFrame, StatusBar, BottomNav, Stage, tokens). The frame inverts by theme — soft platinum in dark mode, dark in light mode. See `docs/preferences.md` § Device frame.
>
> **Native Android apps:** each web prototype can be converted to a native Android app (Kotlin + Jetpack Compose + Material 3). The Android apps live in `Android_app/<App_Name>/`. Read [`docs/android-dev/`](./docs/android-dev/) before building one — it has 14 golden rules, crash lessons, UI patterns, and a step-by-step workflow.

**Rule:** Every directory that contains project content has its own `navigation.md`. When in doubt about where something is, read the nearest `navigation.md`.

---

## 4. How Prototypes Are Built (Tech Stack)

The project is a **Next.js 16 (App Router) static export** deployed to GitHub Pages. Each prototype is a **self-contained folder** of React components — one file per screen — sharing a common design system (`src/proto-kit/`).

| Layer        | Choice                                                        |
|--------------|--------------------------------------------------------------|
| Framework    | Next.js 16 (App Router) + TypeScript 5                        |
| Export       | `output: 'export'` → pure static HTML/CSS/JS (no server)     |
| Styling      | CSS Modules (scoped per component) + `tokens.css` (shared)   |
| Interactivity| React 19 (client components for state/interaction)           |
| Icons        | Inline SVG                                                    |
| Frame        | `proto-kit` `<DeviceFrame>` (bezel + status bar + screen)    |
| State        | React state + localStorage (Zustand optional for complex)    |
| Routing      | Hash routing (`#home`, `#search`) — preserves in-app feel    |

**Why Next.js static export?** Component model + hot reload + type safety during dev, but the output is identical static HTML to before — GitHub Pages serves it the same way. The `basePath: '/ANDROID-PROTOTYPE'` keeps the URL unchanged.

**Build & preview locally:**
```bash
npm install
npm run build          # static export → ./out
# Preview with correct basePath:
mkdir -p /tmp/preview/ANDROID-PROTOTYPE && cp -r out/* /tmp/preview/ANDROID-PROTOTYPE/
cd /tmp/preview && python3 -m http.server 3001
# → open http://localhost:3001/ANDROID-PROTOTYPE/
```

See `docs/tech-stack.md` for the full rationale.

---

## 5. How to Create a New Prototype (Quick Start)

1. **Read** [`docs/prototype-blueprint.md`](./docs/prototype-blueprint.md) for the detailed step-by-step.
2. **Scaffold** a route folder: `app/prototypes/<your-prototype-name>/` with a `layout.tsx` (wraps content in `<DeviceThemeProvider>` + `<Stage>` + `<DeviceFrame>`) and a `page.tsx` (hash router → renders the active screen).
3. **Create one file per screen** in `src/prototypes/<name>/screens/` (e.g. `home-screen.tsx`). Each screen is self-contained — edit one without touching the others.
4. **Use proto-kit** components (`DeviceFrame`, `StatusBar`, `BottomNav`, `Stage`) and tokens. Override tokens only if the prototype needs a different palette.
5. **Add prototype-specific components/hooks** under `src/prototypes/<name>/components/` and `hooks/`.
6. **Fill in** the prototype's own `navigation.md` and `README.md`.
7. **Register** the new prototype in the prototypes index.
8. **Add a card** to the dashboard gallery (`app/page.tsx`).
9. **Build & verify** locally: `npm run build` + preview at `/ANDROID-PROTOTYPE/prototypes/<name>/`.
10. **Commit & push** to `main`. GitHub Actions builds + deploys to Pages.
11. **Verify** the live URL (see [`docs/github-pages.md`](./docs/github-pages.md)).
12. **Notify** the user via ntfy.sh (see §7 below).

Naming convention: `kebab-case`, descriptive. Example: `app/prototypes/food-delivery-checkout/`.

**Reference implementation:** `app/prototypes/search-page/` (the first ported prototype). Study its layout + page + screens structure as the pattern to follow.

---

## 5b. How to Convert a Prototype to a Native Android App

Once a web prototype is finalized, it can be converted to a native Android app (Kotlin + Jetpack Compose + Material 3). The web prototype IS the design spec — the Android app must match it exactly.

1. **Read** [`docs/android-dev/WORKFLOW.md`](./docs/android-dev/WORKFLOW.md) — the full 8-phase process.
2. **Read** [`docs/android-dev/navigation.md`](./docs/android-dev/navigation.md) — 14 golden rules (CRITICAL — prevents most crashes + UI mismatches).
3. **Study the prototype source** — read every `.tsx` + `.module.css` file before writing any Kotlin.
4. **Create** `Android_app/<App_Name>/` with the Gradle project structure (see `docs/android-dev/BUILD_GUIDE.md`).
5. **Bundle the Roboto font** in `res/font/` — system fonts may not have ExtraBold (800), so bold text won't render. This is mandatory.
6. **Build + iterate** — push to GitHub, GitHub Actions builds the APK, download and test. Expect 3-5 iterations.
7. **Read** [`docs/android-dev/CRASH_LESSONS.md`](./docs/android-dev/CRASH_LESSONS.md) when a build fails — every crash we've hit is documented with root cause + fix.
8. **Update** `IMPROVEMENTS.md` with what's implemented vs. what needs work.

**Reference implementation:** `Android_app/Anime_App/` (the first Android app, 16 build iterations). Study its structure as the pattern to follow.

**Key rules (see navigation.md for all 14):**
- NEVER use emojis — use Material vector icons
- NEVER use negative padding — use `offset()` instead
- NEVER use `weight(0f)` — omit weight for content-sized items
- Use `FontWeight.ExtraBold` (800), NOT `Bold` (700) — and bundle the font
- Title sizes: 36sp expanded, 26sp collapsed
- Floating bottom nav (Box overlay, NOT Scaffold)
- CollapsingHeader pinned OUTSIDE the scroll Column
- Set `.background(MaterialTheme.colorScheme.background)` on root + `android:colorBackground` in themes.xml

---

## 6. The Navigation Discipline (NON-NEGOTIABLE)

This repo is built to be navigable by AI agents. The rules:

1. **Every content directory has a `navigation.md`.** It lists what is inside, what each item is, and where to go next.
2. **Navigation files are updated FIRST when things change.** If you add/rename/move/delete anything, update the relevant `navigation.md` in the same commit.
3. **The root `navigation.md` is the master index.** Keep it accurate.
4. **Cross-link generously.** If a doc references another doc, link it.
5. **When you finish a task, append to `CHANGELOG.md`.**

A future agent should be able to understand the entire project by reading `STARTUP.md` → `navigation.md` → the relevant sub-`navigation.md`, without guessing.

---

## 7. Task Completion Notification Protocol (MANDATORY)

**Every time you complete a task — small or big — you MUST send a notification to the user via [ntfy.sh](https://nty.sh).**

- **Topic:** `TASKISDONE`
- **Endpoint:** `https://ntfy.sh/TASKISDONE`
- **Method:** HTTP POST (see `docs/notification-protocol.md` for exact commands)

### Emoji Color Code

| Emoji | Meaning                                         |
|-------|-------------------------------------------------|
| 🟩 Green  | Success — task completed successfully          |
| 🟥 Red    | Error / issue — needs attention                |
| 🟦 Blue   | Stopping the task — waiting for user input     |
| 🟧 Orange | Processing — task in progress (use sparingly)  |

### Message Format

**Line 1:** Exactly **8 emojis** (all the same color) representing the status.
**Line 2:** Blank.
**Line 3+:** Your actual message (concise: what was done, where, what's next).

#### Example — Success
```
🟩🟩🟩🟩🟩🟩🟩🟩

Task complete: Set up the ANDROID-PROTOTYPE repository structure.
- Created folder layout with navigation.md in every directory
- Configured GitHub Pages auto-deploy
- Pushed initial commit to main
Live URL: https://testplay-byte.github.io/ANDROID-PROTOTYPE/
Next: awaiting your first prototype brief.
```

#### Example — Error
```
🟥🟥🟥🟥🟥🟥🟥🟥

Issue: GitHub Pages deploy failed.
The deploy.yml references Node 20 but the action needs Node 22.
Fixing now. No action needed from you yet.
```

#### Example — Stopping for input
```
🟦🟦🟦🟦🟦🟦🟦🟦

Paused: I need your decision on the color system for the food-delivery prototype.
Option A: warm orange primary
Option B: green primary
Reply with A or B to continue.
```

**Never skip the notification.** Even if a task seems trivial, notify.

---

## 8. Git & GitHub Conventions

- **Default branch:** `main`
- **Commit messages:** Conventional-ish, imperative mood.
  - `feat: add food-delivery-checkout prototype`
  - `docs: update navigation for prototypes/`
  - `chore: fix Pages deploy workflow`
- **One logical change per commit** when possible.
- **Always push to `main`** unless working on a large feature — then use a `feat/<name>` branch and merge.
- **GitHub Pages source:** GitHub Actions (configured in repo settings + `.github/workflows/deploy.yml`).

---

## 9. Where Things Live (Quick Lookup)

| You want to...                         | Go to                                  |
|----------------------------------------|----------------------------------------|
| Understand the project                 | You're here. Then `navigation.md`.     |
| **Get productive fast (2-min guide)**  | [`docs/agent-quickstart.md`](./docs/agent-quickstart.md) |
| **See the full repo map**              | [`docs/repo-map.md`](./docs/repo-map.md) |
| See all prototypes                     | `prototypes/navigation.md`             |
| **Build a new prototype (detailed)**   | [`docs/prototype-blueprint.md`](./docs/prototype-blueprint.md) |
| Start a new prototype (high-level)     | `prototypes/_template/` + `docs/workflow.md` |
| Learn the tech stack                   | `docs/tech-stack.md`                   |
| Learn UI/UX standards                  | `docs/design-standards.md`             |
| Read the prototype template rules      | `docs/template-rules.md`               |
| Understand the theme architecture      | `docs/theme-architecture.md`           |
| **Read user design preferences**       | `docs/preferences.md`                  |
| Understand deployment                  | `docs/github-pages.md`                 |
| See the notification protocol (memory) | `docs/notification-protocol.md`        |
| **Design system guide (master)**       | `docs/design-systems/design-system-guide.md` |
| **Basic design principles**            | `docs/design-systems/basic-design/`    |
| **Material 3 Expressive system**       | `docs/design-systems/material-3-expressive/` |
| Reuse a UI component                   | `templates/components/`                |
| Grab shared icons/fonts                | `assets/`                              |
| See what changed recently              | `CHANGELOG.md`                         |

---

## 10. Golden Rules

1. **Navigation files are sacred.** Update them in the same commit as the change they describe.
2. **Notify on every task.** No exceptions.
3. **Prototypes must be interactive.** A static screen is not a prototype here.
4. **Keep each prototype self-contained.** No cross-prototype dependencies except shared `assets/`.
5. **Leave breadcrumbs.** Future you (or another agent) should never have to guess.
6. **When unsure, read the nearest `navigation.md`.**

---

*Last updated: documentation pass (v7) — added agent-quickstart, prototype-blueprint, repo-map; updated for template v6.*
