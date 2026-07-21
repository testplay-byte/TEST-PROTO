# UI_PATTERNS.md — Replicating the Web Prototype in Jetpack Compose

> How to convert each prototype UI element to its Compose equivalent.
> Study this alongside the prototype source code.

---

## Font weight — use ExtraBold, not Bold

**CRITICAL**: Android's Roboto font at `FontWeight.Bold` (700) doesn't look dramatically different from `Normal` (400) at small sizes (11-14sp). The user reported "I don't see any text at all which was made bold."

**Always use `FontWeight.ExtraBold` (800)** for bold text in Compose:
```kotlin
// WRONG — looks the same as Normal on Android
Text("Title", fontWeight = FontWeight.Bold)

// RIGHT — clearly bold
Text("Title", fontWeight = FontWeight.ExtraBold)
```

For even more prominence (labels, section headers), use `FontWeight.Black` (900).

---

## Title sizes — 36sp expanded, 26sp collapsed

The prototype uses `--fs-display: 32px` for screen titles. On Android, 32sp looks small. Use **36sp** expanded and **26sp** collapsed for the `CollapsingHeader`.

---

## Collapsing header (title stays, shrinks on scroll)

**Prototype:** The title is 32sp bold at the top. When scrolled past 20px, it shrinks to 22sp. It NEVER scrolls away — it stays pinned.

**WRONG**: Put the title inside the scrolling Column → it scrolled away with the content.

**RIGHT:**
```kotlin
val scrollState = rememberScrollState()
Column(modifier = Modifier.fillMaxSize()) {
    CollapsingHeader(title = "Anime", scrollState = scrollState)
    Column(modifier = Modifier.verticalScroll(scrollState)) { ... }
}
```

---

## Collapsing search bar (moves beside title when scrolled)

**Prototype:** When scrolled, the search bar moves BESIDE the title (same row), and the source toggle fades out.

**Implementation:** Use `AnimatedVisibility` for the search bar below the title:
```kotlin
// Row: Title + (SourceToggle OR compact SearchBar)
Row {
    Text("Search", fontSize = titleFontSize.sp, fontWeight = FontWeight.ExtraBold)
    if (collapsed) {
        SearchBar(compact = true, modifier = Modifier.weight(1f))
    } else {
        SourceToggle(modifier = Modifier.width(sourceWidth).alpha(sourceAlpha))
    }
}
// Full search bar below — animated appearance
AnimatedVisibility(
    visible = !collapsed,
    enter = fadeIn(tween(300)) + expandVertically(tween(300)),
    exit = fadeOut(tween(200)) + shrinkVertically(tween(200)),
) {
    SearchBar(compact = false, modifier = Modifier.fillMaxWidth())
}
```

---

## Floating bottom navigation bar

**WRONG:** `Scaffold(bottomBar = { BottomNavBar() })` → creates a solid section at the bottom.

**RIGHT:**
```kotlin
Box(modifier = Modifier.fillMaxSize().background(MaterialTheme.colorScheme.background)) {
    NavHost(...) { /* screens */ }
    BottomNavBar(modifier = Modifier.align(Alignment.BottomCenter))
}
```

---

## Bottom nav pill — content-sized active item

**WRONG:** `Modifier.weight(0f)` → crashes.

**RIGHT:** Active item = `Modifier` (no weight). Inactive = `Modifier.weight(1f)`.

---

## Background color

**CRITICAL**: Set the background on the root container, AND in themes.xml:
```kotlin
// In NavHost root
Box(modifier = Modifier.fillMaxSize().background(MaterialTheme.colorScheme.background))
```
```xml
<!-- In themes.xml — prevents gray flash before Compose loads -->
<item name="android:colorBackground">#14111F</item>
```

---

## Container/card padding

**Prototype**: Cards have `margin: 0 16px` (16px from the edge).
**Android**: 16dp looks too far from the device edge. Use **8dp** outer padding:
```kotlin
Surface(
    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
) {
    Column(modifier = Modifier.padding(horizontal = 16.dp, vertical = 12.dp)) { ... }
}
```

---

## Custom toggle switch

**Do NOT use** `Switch` from Material 3. Build custom:
```kotlin
Box(
    modifier = Modifier.width(44.dp).height(26.dp)
        .clip(CircleShape).background(if (on) primary else surface5)
        .clickable { onChange(!on) }
) {
    Box(modifier = Modifier.offset(x = knobOffset).size(20.dp).clip(CircleShape).background(knobColor))
}
```

---

## Text-only segmented control

**Do NOT use** `SingleChoiceSegmentedButtonRow`. Build custom:
```kotlin
Surface(color = surfaceVariant, shape = RoundedCornerShape(16.dp)) {
    Row {
        options.forEach { opt ->
            Surface(
                color = if (opt == value) primary else Color.Transparent,
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.weight(1f).clickable { onChange(opt) }
            ) { Text(opt, fontWeight = FontWeight.ExtraBold) }
        }
    }
}
```

---

## Settings section groups

- Group label: 11sp, `FontWeight.Black`, UPPERCASE, `onSurfaceVariant` color, letter-spacing 0.08sp.
- Card: surface-1 background, rounded 20dp.
- Row: title (14sp ExtraBold) + description (13sp Medium, muted) on left, control on right.
- Divider: 1dp `HorizontalDivider` between rows (inset 16dp), last row no divider.

---

## Cover overlap on detail screen

**WRONG:** `Modifier.padding(top = (-70).dp)` → crashes.

**RIGHT:** `Modifier.offset(y = (-70).dp)`.

---

## Grid inside a scrollable page

**WRONG:** `LazyVerticalGrid` inside `verticalScroll` → crashes.

**RIGHT:** Use `Column` + chunked rows:
```kotlin
items.chunked(3).forEach { rowItems ->
    Row {
        rowItems.forEach { AnimeCard(modifier = Modifier.weight(1f)) }
        repeat(3 - rowItems.size) { Spacer(Modifier.weight(1f)) }
    }
}
```

---

## Filter sheet (accordion + flat views)

- Use `ModalBottomSheet` with `dragHandle = null` (no dismiss handle).
- Two view modes: accordion (expandable sections) + flat (tab + content panel).
- View toggle in header using Material icons (`ViewStream` / `GridView`).
- Accordion sections: animated expand/collapse via `AnimatedVisibility(expandVertically + fadeIn)`.
- Chips: outline border when inactive, primaryContainer when active, checkmark icon.

---

## Recent searches card

- In a surface-1 card (tinted bg, rounded 20dp, 8dp outer padding).
- Collapsible: chevron toggle + "Show" pill button to expand.
- "Clear all" button when expanded.
- Individual delete (X button) on each item.
- "Show N more" / "Show less" expander (3 visible by default).
- Each item: clock icon in a circle + text + delete button.

---

## Theme persistence

**WRONG:** `AnimeAppTheme(darkTheme = true)` — hardcoded, toggle doesn't work.

**RIGHT:**
```kotlin
val settings by settingsRepo.settings.collectAsStateWithLifecycle(initialValue = AppSettings())
AnimeAppTheme(darkTheme = settings.darkTheme) { AnimeApp() }
```
