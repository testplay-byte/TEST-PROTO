# WORKFLOW.md — Converting a Web Prototype to a Native Android App

> Step-by-step process for taking a web prototype (Next.js + CSS Modules) and
> building a native Android app (Kotlin + Jetpack Compose) that matches it exactly.
> Based on the Anime_App build experience (14 build iterations, many lessons learned).

---

## Phase 1: Study the prototype (1-2 hours)

Before writing ANY Android code, read the prototype source thoroughly:

1. **Read every screen file**: `src/prototypes/<name>/screens/*.tsx` + `*.module.css`
2. **Read every component**: `src/prototypes/<name>/components/*.tsx` + `*.module.css`
3. **Read the hooks**: `src/prototypes/<name>/hooks/*.ts`
4. **Read the data layer**: `src/prototypes/<name>/lib/*.ts`
5. **Read the types**: `src/prototypes/<name>/lib/types.ts`
6. **Take notes on**: colors (exact hex), font sizes (sp = px), font weights, spacing (dp = px), border radii, animations (durations + easing), interaction patterns.

**Key mappings:**
| Web (CSS) | Android (Compose) |
|------------|-------------------|
| `font-size: 32px` | `fontSize = 32.sp` |
| `font-weight: 700` | `fontWeight = FontWeight.ExtraBold` (NOT Bold — see rule #8) |
| `padding: 16px` | `Modifier.padding(16.dp)` |
| `border-radius: 20px` | `RoundedCornerShape(20.dp)` |
| `margin-top: -70px` | `Modifier.offset(y = (-70).dp)` (NOT negative padding!) |
| `flex: 0` (content-sized) | `Modifier` (no weight) |
| `flex: 1` | `Modifier.weight(1f)` |
| `transition: 300ms` | `tween(300, easing = FastOutSlowInEasing)` |
| `var(--color-primary)` | `MaterialTheme.colorScheme.primary` |
| `localStorage` | `DataStore Preferences` |
| `fetch()` | `Ktor HttpClient` |

---

## Phase 2: Set up the Gradle project (30 min)

1. Create `Android_app/<App_Name>/` directory structure (see `BUILD_GUIDE.md`)
2. Set up `build.gradle.kts` with ALL required plugins:
   - `com.android.application`
   - `org.jetbrains.kotlin.android`
   - `org.jetbrains.kotlin.plugin.compose` (Kotlin 2.0+ Compose compiler)
   - `org.jetbrains.kotlin.plugin.serialization` (for @Serializable)
3. Add dependencies: Compose BOM, material-icons-extended, Coil, Ktor, DataStore, Navigation
4. Create the theme: `Color.kt` (match prototype colors), `Type.kt` (match type scale), `Theme.kt`
5. Create launcher icons (adaptive icon for API 26+, layer-list fallback for 24-25)
6. Set `android:colorBackground` in themes.xml to prevent gray flash

---

## Phase 3: Build the data layer (1-2 hours)

1. **Models**: Create `model/Models.kt` with `@Serializable` data classes matching the prototype's types
2. **API client**: Create `data/ApiClient.kt` using Ktor. Wrap EVERY call in `runCatching`.
3. **Repositories**: Create `data/*Repository.kt` using DataStore Preferences for persistence.
4. **Settings**: Create `data/SettingsRepository.kt` with a `Flow<AppSettings>` for theme/density/etc.

---

## Phase 4: Build shared components (2-3 hours)

Create these BEFORE the screens (screens depend on them):

1. **CollapsingHeader** — pinned title that shrinks on scroll (36sp → 26sp, ExtraBold)
2. **BottomNavBar** — floating overlay (NOT Scaffold), SVG icons (NOT emojis), content-sized active pill
3. **AnimeCard** (or equivalent) — reusable card with cover, title, score, meta
4. **Any other shared components** the prototype has (HeroCarousel, ContinueWatching, FilterSheet, etc.)

**For each component**: read the prototype's `.tsx` + `.module.css` and replicate EXACTLY.

---

## Phase 5: Build screens (3-5 hours)

Build each screen one at a time. For each:

1. Read the prototype's screen `.tsx` + `.module.css`
2. Create the Kotlin file with the same structure
3. Use `CollapsingHeader` for the title (pinned outside scroll)
4. Use `Column(modifier = Modifier.verticalScroll(scrollState))` for scrollable content
5. For grids: use chunked rows (NOT LazyVerticalGrid inside verticalScroll)
6. For lazy lists (pure list pages): use `LazyColumn` or `LazyVerticalGrid`
7. Add 110dp bottom padding for the floating nav
8. Wrap all network calls in `runCatching`
9. Test mentally: does the layout match the prototype? Are colors correct? Is text bold?

---

## Phase 6: Wire up navigation + theme (30 min)

1. **Navigation**: Use `NavHost` with routes for each screen. NO Scaffold — use Box overlay for the floating nav.
2. **Theme**: `MainActivity` reads `settings.darkTheme` from `SettingsRepository` and passes to `AnimeAppTheme(darkTheme = ...)`.
3. **Background**: Set `.background(MaterialTheme.colorScheme.background)` on the root Box.

---

## Phase 7: Build + iterate (1-3 hours)

1. Push to GitHub → GitHub Actions builds the APK
2. Download the APK artifact, install on a device, test
3. If it crashes: read the logcat, find the root cause, fix, rebuild
4. If the UI doesn't match: study the prototype again, fix the specific issue, rebuild
5. Common issues to check:
   - Background color correct? (should be M3 dark purple, not gray)
   - Text bold enough? (use ExtraBold, not Bold)
   - Titles big enough? (36sp expanded, 26sp collapsed)
   - Bottom nav floating? (not in Scaffold)
   - Header pinned? (not scrolling away)
   - No emojis? (use Material icons)
   - No crashes? (check for negative padding, weight(0f), missing imports)

---

## Phase 8: Document (30 min)

1. Update `IMPROVEMENTS.md` with what's implemented and what needs work
2. Update `docs/android-dev/` with any new patterns or crash lessons
3. Update `CHANGELOG.md` with a summary
4. Update `docs/preferences.md` if any new design preferences were discovered

---

## Time estimate

| Phase | Time | Notes |
|-------|------|-------|
| 1. Study prototype | 1-2h | Don't skip this — it prevents most issues |
| 2. Set up Gradle | 30min | Don't forget serialization plugin + launcher icons |
| 3. Data layer | 1-2h | Ktor + DataStore, wrap in runCatching |
| 4. Components | 2-3h | Build before screens |
| 5. Screens | 3-5h | One at a time, match prototype exactly |
| 6. Nav + theme | 30min | Box overlay, read theme from settings |
| 7. Build + iterate | 1-3h | Expect 3-5 build iterations |
| 8. Document | 30min | |
| **Total** | **10-17h** | |
