# docs/github-pages.md — Deployment Guide

> How prototypes get from a git push to a live URL.

---

## How it works

1. You push to `main`.
2. The GitHub Actions workflow at `.github/workflows/deploy.yml` runs:
   1. `actions/checkout@v4`
   2. `actions/setup-node@v4` (Node 20, npm cache)
   3. `npm ci` — install exact pinned deps from `package-lock.json`
   4. `npm run build` — `next build` produces the static export in `./out`
   5. `actions/configure-pages@v5`
   6. `actions/upload-pages-artifact@v3` (uploads `./out`)
   7. `actions/deploy-pages@v4` (deploys the artifact to Pages)
3. GitHub serves the static `./out` directory at the Pages URL.

There IS a build step now (the migration from static HTML to Next.js). The output is still pure static HTML/CSS/JS — GitHub Pages serves it the same way as before, but CI has to run `next build` first.

---

## URLs

- **Repo:** `https://github.com/testplay-byte/TEST-PROTO`
- **Pages base:** `https://testplay-byte.github.io/TEST-PROTO/`
- **Dashboard (homepage gallery):** `https://testplay-byte.github.io/TEST-PROTO/` (built from `app/page.tsx`)
- **A prototype:** `https://testplay-byte.github.io/TEST-PROTO/prototypes/<name>/`
- **A specific asset:** `https://testplay-byte.github.io/TEST-PROTO/<path/under/public/>`

> The `basePath: '/TEST-PROTO'` in `next.config.ts` makes every URL in the build start with `/TEST-PROTO`, matching the Pages project URL. Always preview locally from `/tmp/preview/TEST-PROTO/` to reproduce this basePath (see below).

---

## First-time setup (already done, for reference)

These were configured at init:

1. **Settings → Pages → Build and deployment → Source:** set to **GitHub Actions**.
2. The workflow `.github/workflows/deploy.yml` uses `actions/deploy-pages`.
3. Permissions in the workflow: `pages: write` and `id-token: write`.

If Pages ever breaks, re-check step 1 — the source must be "GitHub Actions", not "Deploy from a branch".

---

## The build pipeline (CI)

`.github/workflows/deploy.yml` runs on every push to `main` (and on manual `workflow_dispatch`):

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci          # requires package-lock.json to be committed
      - run: npm run build   # next build → ./out (static export)
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./out
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: github-pages
    steps:
      - uses: actions/deploy-pages@v4
```

### Critical: `package-lock.json` MUST be committed

`npm ci` refuses to run without a `package-lock.json` in the repo. Earlier in the project this file was gitignored, which broke CI. **It must be committed.** Never re-add it to `.gitignore`.

---

## The dashboard (`app/page.tsx`)

A lightweight dashboard at the Pages root lists all prototypes with cards. Built from `app/page.tsx` (a server component) + `src/dashboard/dashboard.css` + `src/dashboard/theme-toggle.tsx`. It is auto-maintained: when you add a prototype, add a card to `app/page.tsx`.

---

## Preview locally (with correct basePath)

The `basePath: '/TEST-PROTO'` means assets won't resolve if you serve `./out/` from the repo root. Always preview from a `/tmp/preview/TEST-PROTO/` directory:

```bash
cd C:/Users/khurr/Desktop/PROTOTYPE
npm install
npm run build          # → ./out

# Reproduce the production basePath:
mkdir -p /tmp/preview/TEST-PROTO
cp -r out/* /tmp/preview/TEST-PROTO/
cd /tmp/preview && python3 -m http.server 3001
# → http://localhost:3001/TEST-PROTO/
# → http://localhost:3001/TEST-PROTO/prototypes/<name>/
```

(You can also `npm run dev` for hot reload during development — Next.js handles the basePath automatically. But always do a final `next build` + preview before pushing.)

---

## Troubleshooting

| Symptom                                      | Fix                                                                 |
|----------------------------------------------|---------------------------------------------------------------------|
| 404 at Pages URL                             | Wait 60s; check Actions tab for a failed run; confirm source = Actions. |
| CI fails on `npm ci`                         | `package-lock.json` must be committed (it was gitignored before — that broke CI). |
| CI fails on `next build`                     | Check the build log for TypeScript errors. `typescript.ignoreBuildErrors: false` — type errors fail the build. |
| Assets 404 in production but work in `npm run dev` | You're hitting the `basePath` mismatch. All URLs in the build start with `/TEST-PROTO`. |
| Prototype CSS missing                        | Confirm the prototype's `layout.tsx` imports `tokens.css` and its own CSS. |
| Images broken                                | Use `next/image` is disabled (`images.unoptimized: true`). Use plain `<img>` with paths under `public/` (served at `/ANDROID-PROTOTYPE/...`). |
| Old static prototypes 404                    | They live in `public/prototypes/` and are copied verbatim into `out/prototypes/`. Confirm the folder exists. |
| Workflow not running                         | Ensure `.github/workflows/deploy.yml` is on `main`.                 |
| Workflow fails on permissions                | Confirm repo Settings → Actions → General → Workflow permissions = read+write. |

---

## Checking deploy status

- **Web:** repo → Actions tab → latest "Deploy to GitHub Pages" run.
- **CLI:** `gh run list` (if `gh` is installed) or watch the Actions page.

A successful run prints the Pages URL in its summary.

---

*Last updated: Next.js migration (Phase 4) — deployment now has a build step (`npm ci → next build → deploy out/`). `package-lock.json` MUST be committed. basePath is `/ANDROID-PROTOTYPE`.*
