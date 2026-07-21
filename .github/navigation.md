# .github/ — GitHub configuration

> Standard GitHub config directory. Not deployed as content, but drives CI and issue templates.

---

## Contents

| Path                     | Purpose                                                        |
|--------------------------|----------------------------------------------------------------|
| `workflows/deploy.yml`   | GitHub Actions workflow: deploys the repo to GitHub Pages on every push to `main`. |
| `ISSUE_TEMPLATE/`        | (Reserved) Issue templates for design tasks / bugs.            |

---

## The deploy workflow

- **Trigger:** push to `main`, or manual run.
- **Build:** none — the repo is static.
- **Artifact:** entire repo uploaded as the Pages site.
- **Pages source (repo setting):** "GitHub Actions".

See [`../docs/github-pages.md`](../docs/github-pages.md) for URLs and troubleshooting.

---

*Last updated: documentation pass (v7).*
