# Static V1 Backup Manifest

This archive preserves the **pre-Next.js static site** (the working GitHub Pages
site as of the migration to Next.js).

**Created:** 2025-01-15 (commit `f0c25df`)
**Tag:** `v1.0-static`
**Branch:** `archive/static-v1`

## Contents

- `static-v1.zip` — full snapshot of the static site (index.html, prototypes/, assets/, templates/, docs/, .github/, README, STARTUP, navigation, CHANGELOG).

## How to restore

1. Unzip `static-v1.zip` into a fresh directory.
2. Restore the old deploy workflow (`.github/workflows/deploy.yml` uploads repo root as-is — no build step).
3. Push to `main`. GitHub Pages will serve it.

Or: `git checkout archive/static-v1` and push that branch to `main`.

## What was in the static site

- Dashboard: `index.html` (root)
- Prototypes: `prototypes/anime-app/`, `prototypes/search-page/`, `prototypes/_template/`
- Shared assets: `assets/fonts`, `assets/icons`, `assets/images`
- Templates: `templates/components`, `templates/screens`
- Docs: `docs/` (17 files incl. design-systems/)
- AI-agent quickstart: `STARTUP.md`, `navigation.md`

## Why it was migrated

The static site worked but each prototype was a monolith (one huge CSS + JS file
per prototype). Editing one screen required touching the whole file. The frame
and nav were copy-pasted across prototypes. Migrating to Next.js (static export)
adds a component model + shared `proto-kit` so the frame/nav/tokens are defined
once and inherited by every prototype, and each screen is its own file.
