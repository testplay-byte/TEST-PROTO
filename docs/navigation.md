# docs/navigation.md

> Index of everything in `docs/`. These are the reference documents that govern how we work.

---

## Files

| File                          | What it covers                                                      |
|-------------------------------|---------------------------------------------------------------------|
| `agent-quickstart.md`         | **2-minute fast-start** for any AI agent. Read this first if you're new. |
| `prototype-blueprint.md`      | **Step-by-step guide** to build a new prototype (detailed).         |
| `repo-map.md`                 | **Visual annotated tree** of the entire repository.                 |
| `workflow.md`                 | High-level prototype workflow (create → update → retire).           |
| `tech-stack.md`               | The allowed tech for prototypes and *why* each choice was made.      |
| `design-standards.md`         | Mobile UI/UX standards: spacing, type scale, color, touch targets, the phone frame. |
| `github-pages.md`             | How deployment works, how to find live URLs, how to troubleshoot.    |
| `notification-protocol.md`    | **MANDATORY MEMORY FILE.** The ntfy.sh protocol: topic, colors, format, copy-paste commands. |
| `preferences.md`              | **MANDATORY MEMORY FILE.** All accumulated user design preferences. Read before designing anything. |
| `template-rules.md`           | The rules every prototype (built on `src/proto-kit/`) must follow (frame, status bar, text-selection, scrollbar, mobile, theming). |
| `theme-architecture.md`       | **CRITICAL.** How app theme (scoped to `.device`) is separated from page theme. Read before touching CSS variables. |
| `git-conventions.md`          | Branch, commit message, and PR conventions.                         |
| `design-systems/`             | **Design system documentation** — Material 3 Expressive + Basic Design Principles + master guide. See [`design-systems/navigation.md`](./design-systems/navigation.md). |
| `android-dev/`                | **Native Android development guide** — 14 golden rules, crash lessons, UI patterns, build guide, and 8-phase workflow for converting prototypes to native apps. See [`android-dev/navigation.md`](./android-dev/navigation.md). |

---

## Reading order for a new agent

1. [`../STARTUP.md`](../STARTUP.md) — master context
2. [`agent-quickstart.md`](./agent-quickstart.md) — 2-minute fast-start
3. [`repo-map.md`](./repo-map.md) — see where everything is
4. [`preferences.md`](./preferences.md) — user's design preferences (MANDATORY)
5. [`template-rules.md`](./template-rules.md) — the rules every prototype follows
6. [`theme-architecture.md`](./theme-architecture.md) — how theming works (CRITICAL)
7. [`prototype-blueprint.md`](./prototype-blueprint.md) — how to build a prototype
8. [`notification-protocol.md`](./notification-protocol.md) — how to notify the user
9. [`workflow.md`](./workflow.md) — high-level process
10. [`design-standards.md`](./design-standards.md) — UI/UX specs (reference as needed)
11. [`design-systems/design-system-guide.md`](./design-systems/design-system-guide.md) — master design system guide
12. [`design-systems/basic-design/what-makes-good-ui.md`](./design-systems/basic-design/what-makes-good-ui.md) — what makes good UI
13. [`design-systems/basic-design/ai-ui-mistakes.md`](./design-systems/basic-design/ai-ui-mistakes.md) — common AI UI mistakes to avoid
14. [`design-systems/material-3-expressive/navigation.md`](./design-systems/material-3-expressive/navigation.md) — M3 design system (if using M3)
15. [`android-dev/navigation.md`](./android-dev/navigation.md) — **if building a native Android app** (14 golden rules + crash lessons + UI patterns + workflow)

---

*Last updated: Anime_App Android build complete (Build #16). Native Android development guide at `docs/android-dev/`. STARTUP.md §5b covers the prototype→Android workflow.*
