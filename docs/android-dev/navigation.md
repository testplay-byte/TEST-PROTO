# docs/android-dev/ — Native Android Development Guide

> **MANDATORY reading for any agent building or modifying Android apps in this repo.**
> This documents the lessons learned from building the Anime_App — what went wrong,
> how to do it right, and the patterns to follow for ALL future Android apps.

---

## Index

| File | What it covers |
|------|----------------|
| `CRASH_LESSONS.md` | Every crash we hit + root cause + fix. Read before touching Compose layout. |
| `UI_PATTERNS.md` | How to replicate the web prototype's M3 design in Jetpack Compose. |
| `BUILD_GUIDE.md` | How the Gradle project is structured + GitHub Actions APK build. |
| `WORKFLOW.md` | Step-by-step process for converting a web prototype to a native Android app. |

---

## Golden rules (read these FIRST)

1. **STUDY THE PROTOTYPE** — Before writing any Compose code, read the corresponding `.tsx` + `.module.css` files in `src/prototypes/<name>/`. The prototype IS the spec. Every color, spacing, font weight, border radius, and animation must match.

2. **NEVER use emojis** — Always use Material vector icons (`Icons.Filled.*` from `material-icons-extended`). The prototype uses SVG icons, not emojis.

3. **NEVER use negative padding** — Compose's `padding()` throws `IllegalArgumentException` for negative values. Use `offset(y = (-N).dp)` instead for overlaps.

4. **NEVER use `weight(0f)`** — Compose's `weight()` requires > 0. For content-sized items, omit `weight()` entirely (just use `Modifier`).

5. **Pinned collapsing headers** — Place `CollapsingHeader` OUTSIDE the scroll Column (above it). If it's inside the scroll, it scrolls away.

6. **Floating bottom nav** — Do NOT use `Scaffold(bottomBar = ...)`. Use a `Box` overlay so the nav floats on top of scrolling content.

7. **Custom components, not defaults** — Build custom toggles, segmented controls, and bottom sheets. Do NOT use default `Switch`, `SegmentedButton`, or `Slider` without styling.

8. **Use `FontWeight.ExtraBold` (800), not `Bold` (700)** — Android's Roboto at `Bold` (700) doesn't look dramatically different from `Normal` at small sizes. Use `ExtraBold` for all bold text. This was a major user complaint.

9. **Title sizes: 36sp expanded, 26sp collapsed** — The `CollapsingHeader` uses these sizes. The collapsed size must be big enough to still be readable.

10. **M3 color scheme + background** — Set `.background(MaterialTheme.colorScheme.background)` on the root container. Also set `android:colorBackground` in `themes.xml` to prevent the gray flash before Compose loads.

11. **Theme persistence** — `MainActivity` must read `settings.darkTheme` from `SettingsRepository` and pass it to `AnimeAppTheme(darkTheme = ...)`. Do NOT hardcode `darkTheme = true`.

12. **Error handling** — Every network call MUST be wrapped in `runCatching { }.getOrDefault(emptyList())`. An unhandled exception crashes the app.

13. **No nested vertical scroll** — `LazyVerticalGrid` inside `verticalScroll` crashes. Use `Column` + chunked rows for mixed-content scrollable pages.

14. **Container padding** — Cards/sections should have 8dp outer padding from the device edge (not 16dp — the user said 16dp is "way too far away"). Inner content padding can be 12-16dp.
