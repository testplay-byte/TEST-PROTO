# BUILD_GUIDE.md — Android Gradle Project Structure + GitHub Actions

> How the Android project is structured, how to build it, and how the APK is delivered.

---

## Project structure

```
Android_app/Anime_App/
├── app/
│   ├── build.gradle.kts          ← app module (dependencies, SDK versions)
│   ├── proguard-rules.pro
│   └── src/main/
│       ├── AndroidManifest.xml   ← app config (permissions, activities)
│       └── java/com/testplaybyte/animeapp/
│           ├── MainActivity.kt   ← entry point
│           ├── AnimeApp.kt       ← root composable
│           ├── theme/
│           │   ├── Color.kt      ← M3 dark purple palette (matches prototype)
│           │   ├── Type.kt       ← M3 type scale
│           │   └── Theme.kt      ← AnimeAppTheme composable
│           ├── model/
│           │   └── Models.kt     ← data models (Anime, LibraryItem, etc.)
│           ├── data/
│           │   ├── AniListClient.kt        ← GraphQL API client (Ktor)
│           │   ├── LibraryRepository.kt    ← DataStore persistence
│           │   ├── HistoryRepository.kt    ← DataStore persistence
│           │   └── SettingsRepository.kt   ← DataStore persistence
│           ├── navigation/
│           │   └── AnimeNavHost.kt  ← NavHost + floating bottom nav
│           └── ui/
│               ├── components/
│               │   ├── BottomNavBar.kt       ← floating pill nav
│               │   ├── NavIcons.kt           ← Material vector icons
│               │   ├── CollapsingHeader.kt   ← pinned shrinking title
│               │   ├── AnimeCard.kt          ← reusable card
│               │   ├── HeroCarousel.kt       ← trending pager
│               │   └── ContinueWatching.kt   ← progress cards
│               └── screens/
│                   ├── HomeScreen.kt
│                   ├── LibraryScreen.kt
│                   ├── HistoryScreen.kt
│                   ├── ScheduleScreen.kt
│                   ├── SearchScreen.kt
│                   ├── SettingsScreen.kt
│                   └── DetailScreen.kt
├── build.gradle.kts              ← project-level (plugins)
├── settings.gradle.kts
├── gradle.properties
├── gradle/wrapper/
│   ├── gradle-wrapper.jar
│   └── gradle-wrapper.properties  ← Gradle 8.9
├── gradlew / gradlew.bat
├── IMPROVEMENTS.md               ← gap tracker (what needs work vs. prototype)
└── .gitignore
```

---

## Tech stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Language | Kotlin | 2.0.20 |
| UI | Jetpack Compose (BOM) | 2024.09.03 |
| Design | Material 3 | (from BOM) |
| Icons | material-icons-extended | 1.7.2 |
| Navigation | Navigation Compose | 2.8.1 |
| Images | Coil | 2.7.0 |
| HTTP | Ktor (Android engine) | 2.3.12 |
| Serialization | kotlinx.serialization | 1.7.3 |
| Persistence | DataStore Preferences | 1.1.1 |
| Build | Gradle | 8.9 |
| Android Gradle Plugin | AGP | 8.5.2 |
| Min SDK | 24 (Android 7.0) | |
| Target SDK | 35 (Android 15) | |
| Java | 17 | |

---

## Required Gradle plugins

```kotlin
// build.gradle.kts (project-level)
plugins {
    id("com.android.application") version "8.5.2" apply false
    id("org.jetbrains.kotlin.android") version "2.0.20" apply false
    id("org.jetbrains.kotlin.plugin.compose") version "2.0.20" apply false
    id("org.jetbrains.kotlin.plugin.serialization") version "2.0.20" apply false
}
```

ALL FOUR plugins are required:
- `com.android.application` — builds the APK
- `org.jetbrains.kotlin.android` — Kotlin compiler
- `org.jetbrains.kotlin.plugin.compose` — Compose compiler extension (Kotlin 2.0+)
- `org.jetbrains.kotlin.plugin.serialization` — `@Serializable` support (without this, serialization crashes at runtime)

---

## GitHub Actions build

The workflow is at `.github/workflows/build-apk.yml`. It:
1. Checks out the repo
2. Sets up JDK 17
3. Sets up Android SDK (platform 35, build-tools 35.0.0)
4. Sets up Gradle (caches dependencies)
5. Runs `./gradlew assembleDebug` in `Android_app/Anime_App/`
6. Uploads the APK as an artifact (`anime-app-apk`)

**To download the APK:**
1. Go to https://github.com/testplay-byte/ANDROID-PROTOTYPE/actions
2. Click the latest "Build Android APK" run
3. Download the `anime-app-apk` artifact
4. Unzip → `app-debug.apk`

The APK is debug-signed (auto-signed with the debug keystore). It can be installed on any device that allows unknown sources.

---

## Common build errors + fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `resource mipmap/ic_launcher not found` | Missing launcher icon | Create adaptive icon in `res/mipmap-anydpi-v26/` |
| `invalid weight 0.0` | `Modifier.weight(0f)` | Use `Modifier` (no weight) for content-sized items |
| `Padding must be non-negative` | `Modifier.padding(top = (-70).dp)` | Use `Modifier.offset(y = (-70).dp)` |
| `@Serializable not processed` | Missing serialization plugin | Add `id("org.jetbrains.kotlin.plugin.serialization")` |
| `Experimental API` | Using `FlowRow`/`combinedClickable` without opt-in | Add `@file:OptIn(Experimental*Api::class)` |
| `Cannot nest verticalScroll in verticalScroll` | `LazyVerticalGrid` inside `verticalScroll` | Use `Column` + chunked rows instead |
| `Unresolved reference 'Surface'` | Missing import | Add `import androidx.compose.material3.Surface` |
| `RowScope required for weight()` | Function uses `weight()` but isn't `RowScope` extension | Make function `RowScope.Foo()` |
| Bold text looks same as normal | System Roboto lacks ExtraBold weight | Bundle TTF files in `res/font/` + use `FontFamily` |
| Gray background (#303030) | No background set on root | `.background(MaterialTheme.colorScheme.background)` + `android:colorBackground` in themes.xml |
| Theme toggle doesn't work | `MainActivity` hardcodes `darkTheme = true` | Read from `SettingsRepository` via `collectAsStateWithLifecycle` |

---

## Font bundling (MANDATORY)

Android's system Roboto font may not have ExtraBold (800) or Black (900) weights on all devices.
Without bundling, bold text renders as Regular on some devices.

**Steps:**
1. Download Roboto TTF files from Google Fonts (regular, medium, bold, black = 400/500/700/900)
2. Place in `app/src/main/res/font/` (lowercase, underscores: `roboto_regular.ttf`)
3. Create a `FontFamily` in `theme/Type.kt`:
```kotlin
val RobotoFamily = FontFamily(
    Font(R.font.roboto_regular, FontWeight.Normal),
    Font(R.font.roboto_medium, FontWeight.Medium),
    Font(R.font.roboto_bold, FontWeight.Bold),
    Font(R.font.roboto_black, FontWeight.ExtraBold),
    Font(R.font.roboto_black, FontWeight.Black),
)
```
4. Use `fontFamily = RobotoFamily` in Typography + key Text composables.
