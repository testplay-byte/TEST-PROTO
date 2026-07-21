# docs/workflow.md — Prototype Workflow

> The end-to-end process for creating, updating, and retiring a prototype.
> Follow this every time. When in doubt, the steps here win.

---

## 0. Before you start

- Read [`STARTUP.md`](../STARTUP.md), [`docs/tech-stack.md`](./tech-stack.md), and [`docs/template-rules.md`](./template-rules.md).
- Confirm the prototype brief from the user: which screens, what interactions, what vibe.
- Pick a `kebab-case` name that describes the app/flow. Example: `food-delivery-checkout`.
- Skim the reference prototype: `app/prototypes/search-page/` + `src/prototypes/search-page/`.

---

## 1. Scaffold the prototype

Each prototype lives in two places (a thin Next.js route + the prototype source):

```bash
cd /home/z/DESIGN-PROTOTYPE

# 1. Next.js route (thin shell — layout.tsx + page.tsx):
mkdir -p app/prototypes/<your-name>

# 2. Prototype source (one file per screen):
mkdir -p src/prototypes/<your-name>/{screens,components,hooks,lib}
```

Inside the new folders you should have:
- `app/prototypes/<your-name>/layout.tsx` — imports `tokens.css` + the prototype's CSS; pass-through wrapper.
- `app/prototypes/<your-name>/page.tsx` — client component: `DeviceThemeProvider` → `Stage` → `DeviceFrame` → `Screen` + `BottomNav`, plus the hash router.
- `src/prototypes/<your-name>/<your-name>.css` — prototype-wide token overrides + globals.
- `src/prototypes/<your-name>/screens/` — one file per screen (`.tsx` + `.module.css`).
- `src/prototypes/<your-name>/components/` — prototype-specific UI pieces.
- `src/prototypes/<your-name>/hooks/` — prototype-specific hooks.
- `src/prototypes/<your-name>/lib/` — prototype-specific logic (API clients, filters, types).
- A `navigation.md` and `README.md` for the prototype (fill them in).

> **Never** import code from another prototype. Each prototype's only shared dependency is `src/proto-kit/` (DeviceFrame, StatusBar, BottomNav, Stage, tokens, DeviceThemeProvider).

See [`docs/prototype-blueprint.md`](./prototype-blueprint.md) for the full step-by-step with code samples.

---

## 2. Build the screens

1. Start from the proto-kit shell in `page.tsx` (`<DeviceThemeProvider>` → `<Stage>` → `<DeviceFrame>` → `<Screen>` + `<BottomNav>`).
2. Implement each screen as **one file** in `src/prototypes/<your-name>/screens/`. Each screen is a self-contained React component with its own `.module.css`.
3. Wire up navigation between screens with **hash routing** in `page.tsx` (`useState` + `popstate` listener + `history.pushState`). See `app/prototypes/search-page/page.tsx` for the pattern.
4. Make it **interactive**: taps, transitions, form inputs, toggles, loading states. A static screen is not acceptable here.
5. Respect [`design-standards.md`](./design-standards.md) and [`template-rules.md`](./template-rules.md): 44px touch targets, mobile type scale, theme scoped to `.device`, etc.
6. Use the shared tokens (`var(--color-bg)`, `var(--sp-4)`, `var(--r-md)`, …) — never hardcode colors/spacing.

---

## 3. Document the prototype

Fill in the prototype's own `navigation.md` and `README.md`:

- What the prototype demonstrates.
- List of screens with one-line descriptions.
- Known interactions / flows.
- Any open questions for the user.
- The live URL once deployed.

---

## 4. Register the prototype in the index

Update `public/prototypes/navigation.md` (or whichever prototypes index is canonical at the time) and add a card to the dashboard gallery in `app/page.tsx` so the new prototype appears on the homepage.

Status values: `in-progress`, `review`, `approved`, `archived`.

---

## 5. Build & verify locally BEFORE pushing

```bash
cd /home/z/DESIGN-PROTOTYPE
npm install            # if deps changed
npm run build          # must succeed with no type errors (CI runs the same)

# Preview with the correct basePath:
mkdir -p /tmp/preview/ANDROID-PROTOTYPE
cp -r out/* /tmp/preview/ANDROID-PROTOTYPE/
cd /tmp/preview && python3 -m http.server 3001
# → http://localhost:3001/ANDROID-PROTOTYPE/prototypes/<your-name>/
```

Click through every flow you built. The build must pass locally — CI runs the same `npm ci → next build` pipeline and will fail the deploy on type errors.

---

## 6. Commit & push

```bash
git add app/prototypes/<your-name> src/prototypes/<your-name> app/page.tsx public/prototypes/navigation.md
git commit -m "feat: add <your-name> prototype"
git push origin main
```

GitHub Actions runs `npm ci → next build → deploy out/`. See [`github-pages.md`](./github-pages.md).

---

## 7. Verify the live prototype

1. Wait ~60s after push.
2. Open `https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/<your-name>/`.
3. Click through every flow you built. If something is broken, fix and re-push.

---

## 8. Notify the user

Send an `ntfy.sh` notification per [`notification-protocol.md`](./notification-protocol.md). Use 🟩 for success.

---

## 9. Update a prototype

- Edit files in `app/prototypes/<name>/` and/or `src/prototypes/<name>/`.
- If you add/remove screens, update that prototype's `navigation.md` and `README.md`.
- Rebuild + preview locally before pushing.
- Append a line to `CHANGELOG.md`.
- Commit, push, verify, notify.

---

## 10. Retire / archive a prototype

1. Move `app/prototypes/<name>/` and `src/prototypes/<name>/` into `archive/legacy/<name>/` (or just delete the `app/` route and keep `src/` for reference under `archive/legacy/`).
2. Remove the card from `app/page.tsx` and update the prototypes index.
3. Note in `CHANGELOG.md`.
4. Commit, push, notify.

---

## 11. The non-negotiable checklist (before you push)

- [ ] `npm run build` succeeds locally with no type errors.
- [ ] Previewed at `/tmp/preview/ANDROID-PROTOTYPE/prototypes/<name>/` — all screens + interactions work.
- [ ] Prototype is **interactive**, not static.
- [ ] Prototype's `navigation.md` and `README.md` are filled in.
- [ ] Prototypes index + dashboard card added/updated.
- [ ] `CHANGELOG.md` has a new entry.
- [ ] No secrets, no absolute local paths, no backend/server calls.
- [ ] You will notify the user after push.

---

*Last updated: Next.js migration (Phase 4) — prototypes now scaffolded as `app/prototypes/<name>/` + `src/prototypes/<name>/` on top of `src/proto-kit/`. CI runs `npm ci → next build → deploy out/`.*
