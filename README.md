# ANDROID-PROTOTYPE

> A mobile UI prototyping workspace. We design **interactive, fully functional mobile app interfaces** and deploy them as live prototypes via **GitHub Pages**.

---

## What this is

This repository holds **web-based mobile UI prototypes** — real, clickable interfaces that look and feel like Android apps, rendered in the browser so they can be reviewed quickly before committing to a native build.

Each prototype is a **self-contained folder of React components** (one file per screen) sharing a common design system (`src/proto-kit/`). The project is a **Next.js 16 static export** — `next build` produces pure static HTML/CSS/JS that GitHub Pages serves directly. No server, no backend.

---

## Start here

- **New to the repo?** Read [`STARTUP.md`](./STARTUP.md) first — it is the master context file.
- **Want a 2-minute overview?** Read [`docs/agent-quickstart.md`](./docs/agent-quickstart.md).
- **Looking for something specific?** Check [`navigation.md`](./navigation.md) or [`docs/repo-map.md`](./docs/repo-map.md).
- **Want to build a prototype?** Read [`docs/prototype-blueprint.md`](./docs/prototype-blueprint.md) and study [`app/prototypes/search-page/`](./app/prototypes/search-page/) as the reference pattern.

---

## Live prototypes

Prototypes are deployed to GitHub Pages automatically on every push to `main`.

- **Dashboard (homepage gallery):** [https://testplay-byte.github.io/TEST-PROTO/](https://testplay-byte.github.io/TEST-PROTO/)
- **Search page prototype:** [https://testplay-byte.github.io/TEST-PROTO/prototypes/search-page/](https://testplay-byte.github.io/TEST-PROTO/prototypes/search-page/)
- **Anime app prototype:** [https://testplay-byte.github.io/TEST-PROTO/prototypes/anime-app/](https://testplay-byte.github.io/TEST-PROTO/prototypes/anime-app/)

A prototype at `app/prototypes/my-app/` is reachable at `https://testplay-byte.github.io/TEST-PROTO/prototypes/my-app/`.

---

## Repository structure

```
.
├── app/                    # Next.js App Router (routes = thin)
│   ├── page.tsx            # Dashboard / prototypes gallery
│   └── prototypes/         # One route folder per prototype
├── src/
│   ├── proto-kit/          # Shared design system (DeviceFrame, BottomNav, tokens)
│   ├── prototypes/         # Prototype screens/components/hooks/lib (one file per screen)
│   └── dashboard/          # Dashboard styles + theme toggle
├── public/                 # Static assets served verbatim
├── archive/                # Backup of the pre-Next.js static site
├── docs/                   # All documentation (17 files)
├── templates/              # Reusable UI fragments (agent reference)
├── next.config.ts          # output:'export', basePath:'/TEST-PROTO'
└── package.json            # Next.js 16 + React 19 + TypeScript 5
```

Every directory has its own `navigation.md` explaining its contents. See [`docs/repo-map.md`](./docs/repo-map.md) for the full annotated tree.

---

## Tech stack

| Layer         | Choice                                              |
|---------------|-----------------------------------------------------|
| Framework     | Next.js 16 (App Router) + TypeScript 5              |
| Export        | `output: 'export'` → pure static HTML/CSS/JS        |
| Styling       | CSS Modules (scoped) + `tokens.css` (shared)        |
| Interactivity | React 19 (client components)                        |
| Icons         | Inline SVG                                           |
| Frame         | `proto-kit` `<DeviceFrame>` (bezel + status bar)    |
| State         | React state + localStorage                          |
| Routing       | Hash routing (`#home`, `#search`)                   |

**Build & preview locally:**
```bash
npm install && npm run build   # → ./out (static export)
```

See [`docs/tech-stack.md`](./docs/tech-stack.md) for the full rationale.

---

## Conventions

- Default branch: `main`
- Prototype folders use `kebab-case`
- Every directory has a `navigation.md`, updated alongside any change
- Every completed task triggers an `ntfy.sh` notification (see [`docs/notification-protocol.md`](./docs/notification-protocol.md))

---

## License

Proprietary — internal prototyping use only.
