# assets/navigation.md

> Shared static assets used across prototypes. Referenced by relative path from each prototype.

---

## Subfolders

| Folder    | Holds                                                        |
|-----------|--------------------------------------------------------------|
| `icons/`  | Reusable SVG icons (single-file, themeable via `currentColor`). |
| `fonts/`  | Self-hosted font files (if not using system/Google Fonts).   |
| `images/` | Shared images (logos, illustrations, placeholder photos).    |

---

## Referencing from a prototype

From `prototypes/<name>/index.html`:

```html
<img src="../../assets/images/logo.svg" alt="Logo" />
```

> Prefer **inline SVG** for icons (no extra request, themeable). Only put an icon here if it's reused by 2+ prototypes.

---

## Naming

- `kebab-case`, lowercase.
- SVGs: `<name>.svg`.
- Images: `<name>.<ext>`, include a `-2x` variant for retina where relevant.

---

## Currently empty

No shared assets yet. Add when a real need arises.

---

*Last updated: documentation pass (v7) — still empty; add assets when a real need arises.*
