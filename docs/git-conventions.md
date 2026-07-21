# docs/git-conventions.md — Git & Commit Conventions

> How we commit, branch, and merge in this repo.

---

## Branch model

- **`main`** is the default and deployable branch. Pushes to `main` trigger GitHub Pages deploy.
- For small/medium work, commit directly to `main` (this repo is a prototype workspace, not a production codebase).
- For large multi-step features, use a branch `feat/<name>` and merge to `main` when stable.

---

## Commit message format

Imperative mood, conventional-ish prefix:

```
<type>: <short subject in lowercase>

<optional body explaining why>
```

### Types

| Type     | Use for                                              |
|----------|------------------------------------------------------|
| `feat`   | A new prototype or new screen/flow                   |
| `fix`    | A bug fix in a prototype or the repo                 |
| `docs`   | Documentation / navigation changes                   |
| `style`  | Visual-only changes (spacing, color, motion)        |
| `refactor` | Restructuring without behavior change              |
| `chore`  | Tooling, config, CI, deps                            |

### Examples

```
feat: add food-delivery-checkout prototype
fix: correct bottom nav overlap on onboarding screen
docs: update prototypes/navigation.md with new entry
style: tighten card padding to design-standards
chore: pin deploy.yml to actions/deploy-pages@v4
```

---

## What goes in a commit

- **One logical change per commit** when possible.
- If you add a prototype **and** update the index **and** update changelog, that's fine in one commit — they belong together.
- Never commit secrets, `.env`, or absolute local paths.

---

## Navigation files ride along

If a commit changes/moves/adds content, the relevant `navigation.md`(s) must be updated **in the same commit**. This keeps the repo navigable at every commit.

---

## Pushing

```bash
git push origin main
```

The deploy workflow runs automatically. Verify the live URL after push (see `github-pages.md`).

---

## Tagging milestones (optional)

When a prototype reaches `approved` status, you may tag:

```bash
git tag -a proto/<name>-v1.0 -m "approved: <name>"
git push origin --tags
```

Not mandatory, but useful for history.

---

*Last updated: repository initialization.*
