# docs/repo-map.md — Repository Map

> A visual, annotated map of every file and folder in the repository.
> Use this to find things fast. Cross-reference with `navigation.md` files.

---

## Full tree

```
ANDROID-PROTOTYPE/
│
├── STARTUP.md                  ← READ FIRST. Master context for any agent.
├── README.md                   ← Public GitHub landing page.
├── navigation.md               ← Root navigation index (master map).
├── CHANGELOG.md                ← Running log of all changes (newest first).
├── package.json                ← Next.js 16 + React 19 + TypeScript 5 deps.
├── package-lock.json           ← Pinned deps — MUST be committed (CI uses npm ci).
├── next.config.ts              ← output:'export', basePath:'/ANDROID-PROTOTYPE', trailingSlash.
├── tsconfig.json               ← TS config (@/*→src/*, @app/*→app/*).
├── next-env.d.ts               ← Next.js TypeScript ambient decls (auto-generated).
├── .gitignore                  ← Ignores node_modules, out, .next.
│
├── app/                        ← Next.js App Router (routes are thin).
│   ├── layout.tsx              ← Root layout (fonts, metadata, <html>).
│   ├── page.tsx                ← Dashboard / prototypes gallery (Pages root).
│   ├── globals.css             ← Minimal global reset.
│   └── prototypes/             ← One route folder per prototype.
│       ├── search-page/        ← Reference prototype.
│       │   ├── layout.tsx      ← Imports tokens.css + prototype CSS; pass-through.
│       │   └── page.tsx        ← Client. Shell + hash router → renders screens.
│       └── anime-app/          ← 6-screen M3 Expressive anime app.
│           ├── layout.tsx
│           └── page.tsx
│
├── src/
│   ├── dashboard/              ← Dashboard styles + theme toggle client component.
│   │   ├── dashboard.css
│   │   └── theme-toggle.tsx
│   ├── proto-kit/              ← SHARED DESIGN SYSTEM (fix once, inherit everywhere).
│   │   ├── index.ts            ← Barrel export.
│   │   ├── tokens/
│   │   │   └── tokens.css      ← SINGLE source of truth for all design tokens.
│   │   ├── device-frame/       ← Phone mockup (bezel, status bar, screen slot).
│   │   │   ├── device-frame.tsx
│   │   │   ├── device-frame.module.css
│   │   │   └── status-bar.tsx
│   │   ├── bottom-nav/         ← Floating nav, content-sized active pill.
│   │   │   ├── bottom-nav.tsx
│   │   │   └── bottom-nav.module.css
│   │   ├── stage/              ← Side panels + stage layout (desktop only).
│   │   │   ├── stage.tsx
│   │   │   └── stage.module.css
│   │   └── theme/              ← Device-scoped theme provider (dark/light).
│   │       ├── theme-provider.tsx
│   │       └── types.ts
│   └── prototypes/             ← Prototype screens/components/hooks/lib (one file per screen).
│       ├── search-page/        ← Reference prototype source.
│       │   ├── search-page.css ← Prototype-wide token overrides + globals.
│       │   ├── screens/        ← One file per screen (.tsx + .module.css).
│       │   ├── components/     ← Prototype-specific UI pieces.
│       │   ├── hooks/          ← Prototype-specific hooks (e.g. use-anilist).
│       │   └── lib/            ← Prototype-specific logic (anilist, filters, types).
│       └── anime-app/          ← 6-screen prototype source (same structure).
│
├── public/                     ← Static files served verbatim by Next.js.
│   ├── prototypes/             ← Legacy static prototypes (preserved during migration).
│   │   ├── navigation.md
│   │   └── _template/          ← OLD static template (legacy reference, NOT the starting point).
│   │       ├── index.html, styles.css, script.js, navigation.md, README.md
│   └── assets/                 ← Shared static assets (icons, fonts, images).
│       └── navigation.md
│
├── templates/                  ← Reusable UI fragments (agent reference, not served).
│   └── navigation.md
│
├── archive/                    ← Backup of the pre-Next.js static site.
│   ├── STATIC-V1-MANIFEST.md   ← What was archived + why.
│   ├── static-v1.zip           ← Full snapshot of the old static site.
│   └── legacy/                 ← Old static prototype files (search-page, anime-app).
│
├── docs/                       ← ALL documentation lives here.
│   ├── navigation.md           ← Index of docs/ (read this to find a doc).
│   ├── agent-quickstart.md     ← 2-minute fast-start for any AI agent.
│   ├── prototype-blueprint.md  ← Step-by-step guide to build a new prototype.
│   ├── repo-map.md             ← THIS FILE. Visual tree of the repo.
│   ├── workflow.md             ← High-level prototype workflow (create→deploy).
│   ├── tech-stack.md           ← Allowed tech for prototypes + rationale.
│   ├── design-standards.md     ← UI/UX standards: spacing, type, color, frame.
│   ├── template-rules.md       ← Rules every prototype (built on proto-kit) follows.
│   ├── theme-architecture.md   ← CRITICAL: how app theme is scoped to .device.
│   ├── preferences.md          ← MANDATORY MEMORY: all user design preferences.
│   ├── notification-protocol.md← MANDATORY: how to notify via ntfy.sh.
│   ├── github-pages.md         ← Deployment guide + troubleshooting.
│   ├── git-conventions.md      ← Branch, commit, PR conventions.
│   └── design-systems/         ← DESIGN SYSTEM DOCS (M3 + basic principles).
│       ├── navigation.md
│       ├── design-system-guide.md
│       ├── material-3-expressive/
│       └── basic-design/
│
└── .github/                    ← GitHub configuration.
    ├── navigation.md
    └── workflows/
        └── deploy.yml          ← GitHub Actions: npm ci → next build → deploy out/.
```

---

## Quick lookup: where is X?

| You're looking for... | It's at... |
|---|---|
| The master context | `STARTUP.md` |
| The dashboard / gallery (live) | `app/page.tsx` → built to `out/index.html` |
| The reference prototype | `app/prototypes/search-page/` + `src/prototypes/search-page/` |
| The 6-screen anime prototype | `app/prototypes/anime-app/` + `src/prototypes/anime-app/` |
| The shared design system | `src/proto-kit/` (DeviceFrame, StatusBar, BottomNav, Stage, tokens, DeviceThemeProvider) |
| The shared tokens | `src/proto-kit/tokens/tokens.css` |
| How to build a prototype | `docs/prototype-blueprint.md` |
| Design rules for prototypes | `docs/template-rules.md` |
| User's design preferences | `docs/preferences.md` |
| How theming works | `docs/theme-architecture.md` |
| How to notify the user | `docs/notification-protocol.md` |
| The deploy workflow | `.github/workflows/deploy.yml` |
| The Next.js config | `next.config.ts` |
| Old static site (backup) | `archive/` (zip + `legacy/`) |
| Old static template (legacy) | `public/prototypes/_template/` (NOT the starting point — use `search-page`) |
| What changed recently | `CHANGELOG.md` |
| Reusable UI fragments | `templates/` |
| Shared icons/images | `public/assets/` |

---

## File roles at a glance

### Top-level files
| File | Role | Who reads it |
|---|---|---|
| `STARTUP.md` | Master context — read first | Every agent, every session |
| `README.md` | Public face on GitHub | Visitors, new collaborators |
| `navigation.md` | Master index of the repo | Any agent looking for something |
| `CHANGELOG.md` | History of changes | Any agent wondering "what happened" |
| `package.json` | Dependencies + scripts (`dev`, `build`, `start`) | Anyone building locally / CI |
| `package-lock.json` | Pinned dep versions — MUST be committed | CI (`npm ci` requires it) |
| `next.config.ts` | Static export + basePath config | Anyone debugging URLs or build |
| `tsconfig.json` | Path aliases + TS strictness | Anyone importing across `app/` ↔ `src/` |

### `app/` — Next.js App Router routes (thin)
| Path | Role |
|---|---|
| `layout.tsx` | Root `<html>` + fonts + metadata |
| `page.tsx` | Dashboard / prototypes gallery (served at Pages root) |
| `globals.css` | Minimal global reset (everything else is in CSS Modules) |
| `prototypes/<name>/layout.tsx` | Imports `tokens.css` + the prototype's CSS; pass-through wrapper |
| `prototypes/<name>/page.tsx` | Client component: shell (`DeviceThemeProvider` → `Stage` → `DeviceFrame` → `Screen` + `BottomNav`) + hash router |

### `src/proto-kit/` — the shared design system
| Path | Role |
|---|---|
| `index.ts` | Barrel: `DeviceFrame`, `Screen`, `StatusBar`, `BottomNav`, `Stage`, `PanelBadge/Title/Desc/Head`, `DeviceThemeProvider`, `useDeviceTheme` |
| `tokens/tokens.css` | Single source of truth: type/spacing/radius/motion + M3 color roles + stage tokens |
| `device-frame/` | `<DeviceFrame>` (bezel + screen) + `<StatusBar>` + `<Screen>` |
| `bottom-nav/` | `<BottomNav>` — floating pill, content-sized active item (42px pill / 58px bar) |
| `stage/` | `<Stage>` — desktop layout with left/right info panels |
| `theme/` | `<DeviceThemeProvider>` + `useDeviceTheme()` (scopes `data-theme` to `.device`) |

### `src/prototypes/<name>/` — prototype-specific source
| Subfolder | Role |
|---|---|
| `<name>.css` | Prototype-wide token overrides + global styles |
| `screens/` | One file per screen (`.tsx` + `.module.css`) |
| `components/` | Prototype-specific UI pieces |
| `hooks/` | Prototype-specific hooks (e.g. `use-anilist`) |
| `lib/` | Prototype-specific logic (API clients, filters, types) |

### `public/` — static files served verbatim
| Path | Role |
|---|---|
| `prototypes/_template/` | Legacy static HTML template (preserved for reference, NOT the primary starting point) |
| `assets/` | Shared icons/fonts/images (currently sparse — add when needed) |

### `archive/` — backup of the pre-Next.js site
| Path | Role |
|---|---|
| `static-v1.zip` | Full snapshot of the old static site |
| `legacy/<name>/` | Old static prototype files (preserved for diff/reference) |
| `STATIC-V1-MANIFEST.md` | What was archived + why |

### `templates/` and `public/assets/`
Both are currently sparse. They exist so that when patterns repeat, you have a place to promote them. Don't pre-fill — add when needed.

### `.github/`
| Path | Role |
|---|---|
| `workflows/deploy.yml` | Auto-deploys to GitHub Pages on push to `main` (`npm ci → next build → deploy out/`) |

---

## Navigation file chain

Every directory has a `navigation.md`. Follow the chain:

```
STARTUP.md
  └→ navigation.md (root)
       ├→ docs/navigation.md
       │    └→ (individual doc files)
       ├→ src/proto-kit/   (no navigation.md yet — see index.ts barrel)
       ├→ src/prototypes/<name>/  (no navigation.md yet — see the prototype's own docs)
       ├→ public/prototypes/navigation.md
       │    └→ public/prototypes/_template/navigation.md
       ├→ templates/navigation.md
       ├→ public/assets/navigation.md
       ├→ archive/STATIC-V1-MANIFEST.md
       └→ .github/navigation.md
```

**Rule:** If you add/rename/move/delete a file, update the nearest `navigation.md` in the **same commit**.

---

*Last updated: Next.js migration (Phase 4) — project converted from static HTML to Next.js 16 static export. Old static files preserved under `archive/` and `public/prototypes/_template/`. Keep this map accurate — it's how agents find things.*
