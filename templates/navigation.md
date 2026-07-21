# templates/navigation.md

> Reusable UI fragments. **Currently empty** — in the Next.js architecture,
> the shared component layer lives in `src/proto-kit/` (DeviceFrame, BottomNav,
> StatusBar, Stage, tokens). This folder is reserved for future copy-paste
> fragments that aren't full components (e.g. SVG icon sets, HTML snippets).

---

## Structure

| Subfolder | Holds |
|-----------|-------|
| `components/` | Atomic UI pieces (currently empty — use `src/proto-kit/` instead) |
| `screens/` | Full-screen layouts (currently empty — study `app/prototypes/search-page/` as the reference) |

When proto-kit doesn't have what you need, add it to proto-kit (not here)
so every prototype can reuse it.
