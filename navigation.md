# navigation.md — Root Navigation Map

> This is the master index of the repository. If you are lost, start here.
> Every directory in this repo also has its own `navigation.md` — follow those for detail.

---

## Top-level files

| File             | What it is                                                      |
|------------------|-----------------------------------------------------------------|
| `STARTUP.md`     | **Read first.** Master context: what the project is, how to work in it, notification protocol. |
| `README.md`      | Public GitHub landing page.                                     |
| `navigation.md`  | This file — the root index.                                     |
| `CHANGELOG.md`   | Running log of notable changes (append on every task).          |
| `package.json`   | Next.js 16 + React 19 + TypeScript 5 dependencies.              |
| `next.config.ts` | Next.js config: static export (`output:'export'`), `basePath:'/ANDROID-PROTOTYPE'`. |
| `tsconfig.json`  | TypeScript config (`@/*`→`src/*`, `@app/*`→`app/*`).            |
| `.gitignore`     | Git ignore rules (node_modules, out, .next).                    |

---

## Top-level directories

| Directory         | Purpose                                                            | Detail nav                |
|-------------------|--------------------------------------------------------------------|---------------------------|
| `app/`            | Next.js App Router routes (thin): dashboard + prototype routes.    | [`STARTUP.md`](./STARTUP.md) §3 |
| `src/`            | Source code: `proto-kit/` (shared design system) + `prototypes/` (prototype screens/components/hooks/lib) + `dashboard/`. | [`STARTUP.md`](./STARTUP.md) §3 |
| `public/`         | Static files served verbatim by Next.js (legacy `_template/` + `assets/`). | — |
| `templates/`      | Reusable UI fragments (agent reference, not served).               | [`templates/navigation.md`](./templates/navigation.md) |
| `archive/`        | Backup of pre-Next.js static site (zip + legacy prototype files).  | [`archive/STATIC-V1-MANIFEST.md`](./archive/STATIC-V1-MANIFEST.md) |
| `Android_app/`    | **Native Android apps** (Kotlin + Compose). APKs built via GitHub Actions. | [`Android_app/navigation.md`](./Android_app/navigation.md) |
| `docs/`           | All documentation: workflow, standards, deployment, protocols.     | [`docs/navigation.md`](./docs/navigation.md) |
| `.github/`        | GitHub config: Actions workflows (Next.js build → Pages).          | [`.github/navigation.md`](./.github/navigation.md) |

---

## Where to go based on what you want to do

| You want to...                          | Go to                                                                 |
|-----------------------------------------|-----------------------------------------------------------------------|
| Understand the whole project            | [`STARTUP.md`](./STARTUP.md)                                          |
| **Get productive fast (2-min guide)**   | [`docs/agent-quickstart.md`](./docs/agent-quickstart.md)              |
| **See the full repo map**               | [`docs/repo-map.md`](./docs/repo-map.md)                              |
| Find a specific prototype               | `app/prototypes/<name>/` + `src/prototypes/<name>/`                   |
| **Build a new prototype (detailed)**    | [`docs/prototype-blueprint.md`](./docs/prototype-blueprint.md)        |
| Start a new prototype (high-level)      | Study `app/prototypes/search-page/` as the reference pattern          |
| Learn the tech stack                    | [`docs/tech-stack.md`](./docs/tech-stack.md)                          |
| Learn the UI/UX design standards        | [`docs/design-standards.md`](./docs/design-standards.md)              |
| Read the prototype template rules       | [`docs/template-rules.md`](./docs/template-rules.md)                  |
| Understand the theme architecture       | [`docs/theme-architecture.md`](./docs/theme-architecture.md)          |
| **Read user design preferences**        | [`docs/preferences.md`](./docs/preferences.md)                        |
| Understand GitHub Pages deployment      | [`docs/github-pages.md`](./docs/github-pages.md)                      |
| Read the notification protocol          | [`docs/notification-protocol.md`](./docs/notification-protocol.md)    |
| Reuse the shared design system          | `src/proto-kit/` (DeviceFrame, StatusBar, BottomNav, Stage, tokens)   |
| See recent changes                      | [`CHANGELOG.md`](./CHANGELOG.md)                                      |

---

## Navigation discipline (reminder)

1. Every content directory has a `navigation.md`.
2. When you add/move/rename/delete anything, update the relevant `navigation.md` **in the same commit**.
3. Keep this root file accurate — it is the entry point for every future agent.

---

*Last updated: Next.js migration (Phase 4) — project converted from static HTML to Next.js 16 static export. Dashboard in app/page.tsx, prototypes in app/prototypes/, shared design system in src/proto-kit/.*
