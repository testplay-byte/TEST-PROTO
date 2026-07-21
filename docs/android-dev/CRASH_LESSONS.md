# CRASH_LESSONS.md — Android App Crashes We Hit + Root Causes

> Every crash we encountered, what caused it, and how to avoid it in the future.
> Read this before touching any Compose layout code.

---

## Crash 1: `IllegalArgumentException: invalid weight 0.0; must be greater than zero`

**Where:** `BottomNavBar.kt` — `Modifier.weight(0f)` for the active nav pill.

**Root cause:** `weight(0f)` is invalid in Compose — it throws. For content-sized items, omit `weight()` entirely.

**Fix:** `modifier = if (isActive) Modifier else Modifier.weight(1f)`

**Lesson:** Compose `weight()` ≠ CSS `flex`. `weight(0)` crashes. Use no weight for content-sized.

---

## Crash 2: `IllegalArgumentException: Padding must be non-negative`

**Where:** `DetailScreen.kt` — `Modifier.padding(top = (-70).dp)` for cover poster overlap.

**Root cause:** Compose's `padding()` doesn't allow negative values.

**Fix:** Use `Modifier.offset(y = (-70).dp)` instead.

**Lesson:** CSS negative margins ≠ Compose padding. Use `offset` for overlaps.

---

## Crash 3: Missing launcher icon (`resource mipmap/ic_launcher not found`)

**Where:** `AndroidManifest.xml` referenced `@mipmap/ic_launcher` but no icon resources existed.

**Fix:** Created adaptive icon resources in `res/mipmap-anydpi-v26/` + fallback in `res/drawable-anydpi-v24/`.

**Lesson:** Always create launcher icons. The manifest MUST have valid `android:icon`.

---

## Crash 4: Missing Kotlin Serialization plugin

**Where:** `@Serializable` annotations weren't being processed.

**Root cause:** The `org.jetbrains.kotlin.plugin.serialization` Gradle plugin wasn't applied.

**Fix:** Added the plugin to both project-level and app-level `build.gradle.kts`.

**Lesson:** `@Serializable` requires the compiler plugin, not just the runtime dependency.

---

## Crash 5: Experimental API not opted in

**Where:** `FlowRow`, `combinedClickable`, `ModalBottomSheet`.

**Fix:** `@file:OptIn(ExperimentalMaterial3Api::class, ExperimentalFoundationApi::class, ExperimentalLayoutApi::class)`

**Lesson:** Check for `@Experimental*` annotations. Add `@file:OptIn(...)`.

---

## Crash 6: `RowScope` required for `weight()`

**Where:** `SearchScreen.kt` — `SourceToggleBtn` used `Modifier.weight(1f)` but wasn't a `RowScope` extension.

**Root cause:** `weight()` is a `RowScope`/`ColumnScope` extension — it only works inside a `Row` or `Column` composable lambda.

**Fix:** Made `SourceToggleBtn` a `RowScope.SourceToggleBtn` extension function.

**Lesson:** `weight()` requires `RowScope` or `ColumnScope`. If a composable uses `weight()`, it must be called from within a `Row`/`Column` and declared as a `RowScope`/`ColumnScope` extension.

---

## Crash 7: Missing `Surface` import

**Where:** `SearchScreen.kt` — used `Surface` without importing it.

**Fix:** Added `import androidx.compose.material3.Surface`.

**Lesson:** Compose doesn't auto-import. Check ALL imports when using M3 components.

---

## Non-crash issues (UI doesn't match prototype)

### Issue 1: Background color is gray (#303030) instead of M3 purple

**Root cause:** Content area had no background set — transparent, showing the Android window default.

**Fix:** `.background(MaterialTheme.colorScheme.background)` on root Box + `android:colorBackground` in themes.xml.

### Issue 2: Bold text not visible

**Root cause:** Two issues:
1. `FontWeight.Bold` (700) on Android's Roboto looks similar to Normal at small sizes.
2. Some devices don't have ExtraBold (800) or Black (900) weights in their system Roboto — Compose falls back to Regular (400).

**Fix:** 
1. Use `FontWeight.ExtraBold` (800) everywhere instead of `Bold` (700).
2. **Bundle the Roboto TTF files** in `res/font/` (regular/medium/bold/black = 400/500/700/900) and use a `FontFamily` in Typography. This guarantees the ExtraBold weight renders on ALL devices regardless of system font availability.

**Lesson:** Never rely on system fonts for specific weights. Bundle the font files in the APK.

### Issue 3: Theme toggle doesn't work

**Root cause:** `MainActivity` hardcoded `darkTheme = true`.

**Fix:** Read `settings.darkTheme` from `SettingsRepository` via `collectAsStateWithLifecycle`.

### Issue 4: Title scrolls away

**Root cause:** Title was inside the scrolling Column.

**Fix:** Place `CollapsingHeader` OUTSIDE the scroll Column (above it).

### Issue 5: Bottom nav is a solid section, not floating

**Root cause:** Used `Scaffold(bottomBar = ...)`.

**Fix:** Use `Box` overlay — nav floats on top of scrolling content.

---

## Pattern: How to debug a crash from a logcat

1. Look for `FATAL EXCEPTION` in the logcat.
2. Read the exception class + message.
3. Find the `at com.testplaybyte.animeapp...` line — exact file + line number.
4. Read that line in the source code.
5. Understand WHY the exception is thrown.
6. Fix the root cause — don't just try random changes.
7. Verify the fix doesn't break anything else.
