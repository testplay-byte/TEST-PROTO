# accessibility.md

> Accessibility (a11y) fundamentals. **Every UI in this repo must pass these.** Accessibility is not optional, not a "nice to have," not a post-launch task. It's part of the minimum quality bar.
>
> This file is the contract. If your UI fails any rule here, it's broken — fix it before shipping.

---

## Why this file exists

Roughly 1 in 6 humans has a disability that affects how they use the web (WHO data). Permanent (low vision, motor impairment, deafness), temporary (broken arm, eye surgery recovery), or situational (bright sunlight, one-handed while holding a baby, in a quiet library). Accessibility serves all of them — and, as a side effect, makes the UI better for everyone (keyboard users, screen-reader users, search engines, automation).

AI-generated UI consistently under-delivers on a11y. This file gives you the explicit rules so you can't claim ignorance.

---

## The 8 fundamentals (quick list)

1. **Semantic HTML** — use `<button>`, `<nav>`, `<main>`, `<section>`, `<article>`, not `<div>`.
2. **ARIA labels on icon-only buttons** — every icon button needs `aria-label`.
3. **Color contrast** — WCAG AA: 4.5:1 body, 3:1 large text and UI components.
4. **Keyboard navigation** — tab order, visible focus, no keyboard traps.
5. **Screen reader support** — `sr-only` text, `alt` text on images, proper roles.
6. **`prefers-reduced-motion`** — respect the user's OS setting.
7. **Don't rely on color alone** — pair color with icon or text.
8. **Touch target size** — 44×44px minimum.

---

## 1. Semantic HTML

**Use the right HTML element for the job.** A `<button>` is always better than `<div role="button" tabindex="0">` — it gets keyboard handling, form submission, focus, and screen-reader semantics for free. AI agents love to use `<div>` for everything because it's the path of least resistance; resist it.

### The semantic element cheat-sheet

| Element         | Use for                                         | Don't use `<div>` for…              |
|-----------------|--------------------------------------------------|--------------------------------------|
| `<button>`      | Anything clickable that triggers an action.     | Clickable divs.                      |
| `<a href>`      | Navigation (changes URL).                        | JS-driven "links" without href.      |
| `<input>` (with `<label>`) | User input.                          | Custom div-based inputs.             |
| `<nav>`         | A group of navigation links.                     | Lists of links in a `<div>`.         |
| `<main>`        | The main content of the page (only one per page). | Wrapping everything in `<div>`.      |
| `<header>`      | Page or section header (logo, title, top nav).   | `<div class="header">`.              |
| `<footer>`      | Page or section footer.                          | `<div class="footer">`.              |
| `<section>`     | A thematic grouping with a heading.              | `<div class="section">`.             |
| `<article>`     | Self-contained content (a post, a card, a comment). | `<div class="card">`.                |
| `<aside>`       | Sidebar, related content, pull-quote.            | `<div class="sidebar">`.             |
| `<h1>`–`<h6>`   | Headings, in order, no levels skipped.           | `<div class="title">`.               |
| `<ul>` / `<ol>` | Lists.                                           | `<div>` with `<div>` children.       |
| `<figure>` + `<figcaption>` | Images with captions.                | `<div class="image-with-caption">`.  |
| `<dialog>`      | Modal dialogs.                                   | `<div class="modal">` with custom JS.|
| `<details>` + `<summary>` | Native disclosure widget.             | Custom expand/collapse divs.         |

### ✅ DO

```html
<main>
  <header>
    <h1>Settings</h1>
  </header>
  <nav aria-label="Settings sections">
    <ul>
      <li><a href="#account">Account</a></li>
      <li><a href="#notifications">Notifications</a></li>
    </ul>
  </nav>
  <section id="account" aria-labelledby="account-heading">
    <h2 id="account-heading">Account</h2>
    <article>
      <h3>Profile</h3>
      <label for="display-name">Display name</label>
      <input id="display-name" type="text" value="Ada">
      <button type="submit" class="btn btn--primary">Save</button>
    </article>
  </section>
</main>
```

### ❌ DON'T

```html
<div class="main">
  <div class="header">
    <div class="title">Settings</div>
  </div>
  <div class="nav">
    <div class="nav-item" onclick="go('account')">Account</div>
    <div class="nav-item" onclick="go('notifications')">Notifications</div>
  </div>
  <div class="section">
    <div class="section-title">Account</div>
    <div class="card">
      <div class="card-title">Profile</div>
      <div class="input-label">Display name</div>
      <div class="input" contenteditable>Ada</div>
      <div class="btn btn-primary" onclick="save()">Save</div>
    </div>
  </div>
</div>
<!-- Visually identical. Semantically empty. Screen reader users get "group, group, group, group…". -->
```

### Why it matters

- Screen readers navigate by semantic elements (jump to next heading, next landmark, next list). Without them, the user is stranded in a sea of generic "group" announcements.
- Keyboard navigation works for free with semantic elements (`<button>` is focusable and activatable with Enter/Space; `<div>` is not).
- Search engines and other automation parse semantics; divs are opaque.
- Native elements get OS-level behavior for free (form submission, focus management, copy-paste).

### The first rule of ARIA

> **No ARIA is better than bad ARIA.**

If you can use a native HTML element instead of ARIA, use the native element. ARIA is for cases where native HTML can't express the semantics (e.g. a tablist, a live region, a custom combobox). Don't slap `role="button"` on a `<div>` — use a `<button>`.

---

## 2. ARIA labels on icon-only buttons

An icon-only button has no visible text. A screen reader reading "button" gives the user zero information about what it does. Every icon-only button must have an `aria-label` that describes the action.

### ✅ DO

```html
<button class="icon-button" aria-label="Search">
  <svg aria-hidden="true" focusable="false">…</svg>
</button>

<button class="icon-button" aria-label="Close dialog">
  <svg aria-hidden="true">…</svg>
</button>

<button class="icon-button" aria-label="More options" aria-haspopup="true" aria-expanded="false">
  <svg aria-hidden="true">…</svg>
</button>
```

### ❌ DON'T

```html
<button class="icon-button">
  <svg>…</svg>
</button>
<!-- Screen reader: "button". The user has no idea what it does. -->
```

```html
<button class="icon-button" aria-label="Magnifying glass icon">
  <svg>…</svg>
</button>
<!-- Wrong: aria-label describes the icon, not the action. -->
<!-- Right: aria-label="Search". -->
```

### Rules

- `aria-label` describes the **action**, not the **icon**. "Search," not "magnifying glass."
- Mark the SVG `aria-hidden="true"` so screen readers don't try to announce it.
- Add `focusable="false"` to decorative SVGs in some browsers (older IE/Edge).
- If the button has visible text too, you usually don't need `aria-label` — use `aria-labelledby` if a separate element labels the button, or just put the text inside the button.
- For toggle buttons (mute/unmute), use `aria-pressed="true|false"` and update it on toggle.

### Toggle button pattern

```html
<button id="mute-btn" aria-pressed="false" aria-label="Mute microphone">
  <svg class="icon-unmuted" aria-hidden="true">…</svg>
  <svg class="icon-muted" aria-hidden="true" hidden>…</svg>
</button>
<script>
  const btn = document.getElementById('mute-btn');
  btn.addEventListener('click', () => {
    const muted = btn.getAttribute('aria-pressed') === 'true';
    btn.setAttribute('aria-pressed', String(!muted));
    btn.setAttribute('aria-label', muted ? 'Mute microphone' : 'Unmute microphone');
    // also swap the visible icon…
  });
</script>
```

---

## 3. Color contrast (WCAG AA)

Text and UI components must meet **WCAG 2.1 Level AA** contrast ratios. This is a hard requirement, not a guideline.

### The ratios

| Content type                       | Minimum ratio (AA) | Enhanced (AAA) |
|------------------------------------|--------------------|----------------|
| Body text (< 18.66px regular or < 14px bold) | **4.5:1**          | 7:1            |
| Large text (≥ 18.66px regular or ≥ 14px bold) | **3:1**            | 4.5:1          |
| UI components (button borders, icon strokes, focus rings) | **3:1**  | —              |
| Non-text content (charts, diagrams) | **3:1** for meaningful parts | —              |

### How to verify

Don't eyeball. Use a contrast checker:

- **Browser DevTools:** Chrome → Elements → Accessibility → contrast ratio shown next to color values.
- **WebAIM Contrast Checker:** <https://webaim.org/resources/contrastchecker/>
- **Polypane:** built-in contrast checker.
- **axe DevTools:** browser extension, audits the whole page.

### ✅ DO

```css
:root[data-theme="dark"] {
  --bg:               #14111f;
  --on-bg:            #e6e0f0;   /* contrast vs --bg ≈ 14.4:1 ✓ body */
  --on-bg-variant:    #c9c1d6;   /* contrast vs --bg ≈ 10.5:1 ✓ body */
  --on-bg-faint:      #9b94ad;   /* contrast vs --bg ≈ 6.0:1 ✓ body, but use sparingly */

  --surface-2:        #221e33;
  --on-surface-2:     #e6e0f0;   /* ≈ 12.5:1 ✓ */
  --on-surface-2-var: #c9c1d6;   /* ≈ 9.1:1 ✓ */

  --primary:          #d0bcff;   /* on dark bg, ≈ 13.5:1 ✓ */
  --on-primary:       #381e72;   /* on --primary bg, ≈ 9.8:1 ✓ */
}

:root[data-theme="light"] {
  --bg:               #fef7ff;
  --on-bg:            #1d1b20;   /* ≈ 15.5:1 ✓ */
  --on-bg-variant:    #49454f;   /* ≈ 8.7:1 ✓ */
}
```

### ❌ DON'T

```css
/* All of these fail AA on white: */
body  { color: #999; }     /* 2.85:1 — fail body, fail large */
.hint { color: #bbb; }     /* 1.92:1 — fail body, fail large */
.faint{ color: #777; }     /* 4.48:1 — fail body (just barely), pass large */
.link { color: #6cb2fa; }  /* 2.95:1 — fail body, fail large (light blue on white is a classic fail) */

/* On dark background: */
body  { background: #1a1a1a; color: #888; }   /* 3.48:1 — fail body */
```

### The "looks fine to me" trap

Contrast depends on the **rendered** colors, which depend on the user's screen, ambient light, vision, and OS color profile. What looks fine on your calibrated 4K monitor at 50% brightness may be unreadable on a $200 phone in sunlight. The 4.5:1 ratio exists because it's the floor at which ~95% of users in ~95% of conditions can read text. Don't second-guess it.

---

## 4. Keyboard navigation

Every interactive element must be **reachable via keyboard** (Tab / Shift+Tab), **activatable via keyboard** (Enter for links/buttons, Space for buttons/checkboxes), and **visible when focused** (a focus ring or equivalent).

### Tab order

Tab order follows DOM order by default. Don't fight it with `tabindex`. If you need to remove an element from the tab order, use `tabindex="-1"` (focusable programmatically but not via Tab). Avoid `tabindex` values > 0 — they create explicit tab orders that break as the DOM changes.

```html
<!-- ✅ DO: natural DOM order, no tabindex -->
<nav>
  <a href="/">Home</a>
  <a href="/search">Search</a>
  <a href="/profile">Profile</a>
</nav>
<button>Sign out</button>

<!-- ❌ DON'T: explicit tabindex fighting DOM order -->
<a href="/" tabindex="3">Home</a>
<a href="/search" tabindex="1">Search</a>   <!-- jumps first, ignoring nav order -->
<a href="/profile" tabindex="2">Profile</a>
```

### Visible focus

Every focusable element must show a visible focus indicator when focused via keyboard. The standard pattern is `:focus-visible` (which only shows the ring for keyboard focus, not mouse click).

```css
/* ✅ DO: visible focus ring */
.btn:focus-visible,
.icon-button:focus-visible,
a:focus-visible,
input:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
  border-radius: inherit;
}

/* ❌ DON'T: kill focus outline globally */
* { outline: none; }
/* This is the #1 a11y sin. Keyboard users now have no idea where they are. */

/* ❌ DON'T: replace outline with a subtle color change that's invisible at a glance */
.btn:focus { background: var(--primary-hover); }
/* This fails for low-vision users — they can't see the slight color shift. */
```

### Focus rules

- **Never remove focus without restoring it.** If you close a modal, focus must return to the element that opened it.
- **Trap focus in modals.** Tabbing should cycle within the modal, not escape to the background.
- **Don't auto-focus on page load** unless it's a single-purpose page (e.g. a search box on google.com).
- **Skip links** for keyboard users to bypass repetitive nav:

```html
<body>
  <a href="#main" class="skip-link">Skip to main content</a>
  <nav>… long navigation …</nav>
  <main id="main">…</main>
</body>
```
```css
.skip-link {
  position: absolute;
  top: -100px; left: 0;             /* off-screen until focused */
  background: var(--primary);
  color: var(--on-primary);
  padding: var(--sp-3) var(--sp-4);
  z-index: 1000;
}
.skip-link:focus { top: 0; }       /* slides in when tabbed to */
```

### Keyboard trap anti-pattern

```html
<!-- ❌ DON'T: modal without focus trap. User tabs out into the background,
     can't see where focus is, can't get back to the close button. -->
<div class="modal-overlay">
  <div class="modal">
    <button>Close</button>
    <button>Action A</button>
    <button>Action B</button>
  </div>
</div>
```

---

## 5. Screen reader support

Screen reader users navigate via audio. They hear the page announced element-by-element. Your job is to make sure what they hear matches what's visually on screen — no more, no less.

### The `sr-only` class (visually hidden, screen-reader-visible)

Sometimes you need text that's announced to screen readers but not shown visually (e.g. additional context for an icon). Use the standard `sr-only` pattern:

```css
.sr-only {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

```html
<button class="icon-button">
  <svg aria-hidden="true">…</svg>
  <span class="sr-only">Delete item</span>
</button>
```

Note: `sr-only` is for content that should be **announced but not seen**. For content that should be **seen but not announced** (decorative icons, redundant text), use `aria-hidden="true"`.

### `alt` text on images

Every `<img>` must have an `alt` attribute. The value depends on the image's purpose:

| Image purpose                    | `alt` value                                           |
|----------------------------------|-------------------------------------------------------|
| Informative (photo, illustration, chart) | Concise description of what the image shows.   |
| Decorative (background, divider, ornament) | `alt=""` (empty — tells screen reader to skip). |
| Functional (icon button, logo link) | Description of the function/destination.         |
| Image containing text            | The text in the image.                                |

```html
<!-- ✅ DO -->
<img src="profile.jpg" alt="Ada Lovelace, profile photo">
<img src="divider.png" alt="">  <!-- decorative -->
<img src="logo.svg" alt="Acme Corp home">  <!-- functional — clicking goes home -->

<a href="/">
  <img src="logo.svg" alt="Acme Corp home">   <!-- alt describes destination, not the icon -->
</a>

<!-- ❌ DON'T -->
<img src="profile.jpg">                          <!-- no alt at all -->
<img src="profile.jpg" alt="image">              <!-- useless alt -->
<img src="profile.jpg" alt="profile.jpg">        <!-- filename as alt -->
<img src="logo.svg" alt="logo">                  <!-- describes the icon, not the action -->
```

### Live regions

When content updates dynamically (a toast, a loading status, a chat message), screen readers don't announce it by default. Use `aria-live` to opt in:

```html
<div class="toast-region" aria-live="polite" aria-atomic="true">
  <!-- toasts appended here are announced after the current utterance finishes -->
</div>

<div class="alert-region" aria-live="assertive">
  <!-- urgent alerts interrupt the current utterance -->
</div>
```

- `polite`: announce when the user pauses. Default for non-urgent updates.
- `assertive`: announce immediately, interrupting. Use sparingly — overuse is jarring.
- `aria-atomic="true"`: announce the whole region as one unit (good for toasts where the new content is the whole region).

### Form labels

Every form field needs a `<label>` (or `aria-label`, or `aria-labelledby`). Placeholder text is **not** a label — it disappears on input, and screen readers may skip it.

```html
<!-- ✅ DO -->
<label for="email">Email address</label>
<input id="email" type="email" name="email" autocomplete="email">
<p id="email-hint" class="hint">We'll never share your email.</p>
<input id="email" type="email" aria-describedby="email-hint">

<!-- ❌ DON'T: placeholder as label -->
<input type="email" placeholder="Email address">
<!-- Once the user types, the placeholder vanishes. They forget what field they're in.
     Screen reader users may not hear the placeholder at all. -->
```

---

## 6. `prefers-reduced-motion`

Some users experience motion sickness, vestibular disorders, or seizures from animation. The OS exposes a "Reduce motion" setting; the browser exposes it via `@media (prefers-reduced-motion: reduce)`. **Honor it.**

### What to disable / reduce

- Looping animations (shimmer, spinners) — replace with a static loading indicator.
- Parallax, autoscroll, autoplay video.
- Slide/fade transitions > 200ms — shorten or remove.
- Bounce / spring physics — make them linear.
- Hover transforms (translateY, scale) — keep the color change, drop the transform.

### ✅ DO

```css
.card {
  transition: transform 200ms var(--ease-emphasized), background-color 100ms;
}
.card:hover { transform: translateY(-2px); background: var(--surface-3); }

.skeleton {
  animation: shimmer 1.4s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  .skeleton { animation: none; background: var(--surface-2); }
  .card:hover { transform: none; }   /* keep the color change, drop the lift */
}
```

### ❌ DON'T

```css
/* ❌ DON'T: animations with no reduced-motion override */
.hero { animation: fadeIn 2s ease; }
.spinner { animation: spin 0.8s linear infinite; }
/* Vestibular disorder users get nauseous from the infinite spin. */

/* ❌ DON'T: completely removing all feedback in reduced-motion */
@media (prefers-reduced-motion: reduce) {
  * { transition: none !important; animation: none !important; }
}
/* Now hover/focus states snap with no transition, which feels broken.
   Better: shorten durations to near-zero (0.01ms) rather than removing them,
   so states still change but without motion. */
```

### JS-side

```js
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reduceMotion) {
  // Skip the entrance animation, just show the cards
  cards.forEach(c => c.classList.add('is-visible'));
} else {
  // Staggered fade-in
  cards.forEach((c, i) => {
    c.style.animationDelay = (i * 40) + 'ms';
    c.classList.add('animate-in');
  });
}
```

---

## 7. Don't rely on color alone

Color is one channel. ~8% of men and ~0.5% of women have some form of color vision deficiency (colorblindness). If your UI communicates state (error, success, warning) **only** through color, those users can't perceive it.

**Pair every color signal with an icon, text label, or pattern.**

### ✅ DO

```html
<!-- Status indicators: color + icon + text -->
<p class="status status--error">
  <svg class="status__icon" aria-hidden="true">✕</svg>
  <span class="status__text">Connection failed</span>
</p>

<p class="status status--success">
  <svg class="status__icon" aria-hidden="true">✓</svg>
  <span class="status__text">Saved</span>
</p>

<p class="status status--warning">
  <svg class="status__icon" aria-hidden="true">!</svg>
  <span class="status__text">Storage almost full</span>
</p>

<!-- Form field error: color + icon + text -->
<div class="field is-error">
  <label for="email">Email</label>
  <input id="email" type="email" aria-invalid="true" aria-describedby="email-error">
  <p id="email-error" class="field__error">
    <svg aria-hidden="true">⚠</svg> Enter a valid email address.
  </p>
</div>

<!-- Charts: don't rely on color alone; use patterns or direct labels -->
<svg>
  <rect fill="url(#stripes-blue)" …/>  <text>Series A: 45%</text>
  <rect fill="url(#stripes-orange)" …/> <text>Series B: 30%</text>
</svg>
```

### ❌ DON'T

```html
<!-- ❌ DON'T: color only -->
<p style="color: red">Connection failed</p>
<p style="color: green">Saved</p>
<!-- Red-green colorblind users see both as the same muddy brown. -->

<!-- ❌ DON'T: colored border on a form field with no text -->
<div class="field" style="border-color: red">
  <label for="email">Email</label>
  <input id="email" type="email">
</div>
<!-- The user doesn't know why the field is red. -->
```

### The red/green trap

Red-green colorblindness (deuteranopia, protanopia) is the most common. The classic failure is "red for error, green for success." Use:

- **Red + ✕ icon** for errors.
- **Green + ✓ icon** for success.
- **Amber + ! icon** for warnings.
- **Blue + ℹ icon** for info.

Or use shape (✕ vs ✓) as the primary signal and color as reinforcement.

---

## 8. Touch target size

Every interactive element must be at least **44×44 CSS pixels** (WCAG 2.5.5). 48×48 preferred for primary actions. See `mobile-first-design.md` § Touch targets for the full treatment.

### Quick reference

```css
.btn, .icon-button, .list-row { min-height: 44px; min-width: 44px; }
.btn--primary { min-height: 48px; }
```

The `min-height` + `padding` pattern (not a fixed `height`) allows text scaling without breaking the target.

---

## The a11y verification checklist

After generating any UI, walk through this checklist:

1. **Semantic HTML:** Is every interactive element a real `<button>`, `<a>`, or `<input>`? Are landmarks (`<main>`, `<nav>`, `<header>`, `<footer>`) present? Are headings in order with no levels skipped?
2. **Icon buttons:** Does every icon-only button have an `aria-label` describing the action?
3. **Contrast:** Does every text/background pair hit 4.5:1 (body) or 3:1 (large/UI)? Verified with a contrast checker, not eyeballed?
4. **Keyboard:** Can you tab to every interactive element in a logical order? Is the focus ring visible? Are there keyboard traps? Does the modal return focus on close?
5. **Screen reader:** Do images have appropriate `alt`? Are decorative elements `aria-hidden`? Are dynamic updates in `aria-live` regions? Do form fields have `<label>`s?
6. **Reduced motion:** Does the UI still work with `prefers-reduced-motion: reduce`? Are infinite animations replaced with static equivalents?
7. **Color reliance:** Is every state signal paired with an icon or text, not color alone?
8. **Touch targets:** Is every interactive element ≥ 44×44px?

If any answer is "no," the UI is broken. Fix it before shipping.

### Tools to automate the checklist

- **axe DevTools** (browser extension) — audits a page for ~50 a11y issues in one click.
- **Lighthouse** (Chrome DevTools → Lighthouse tab) — includes an a11y audit.
- **WAVE** (browser extension or webaim.org) — visual overlay of a11y issues.
- **VoiceOver / NVDA / TalkBack** — actually run a screen reader on the page. There's no substitute for this.
- **Keyboard-only test** — unplug your mouse, try to use the page. If you can't, neither can your keyboard users.

---

## See also

- [`what-makes-good-ui.md`](./what-makes-good-ui.md) — Feedback (§3), Contrast (§7), Affordance (§4) overlap heavily with a11y.
- [`mobile-first-design.md`](./mobile-first-design.md) — Touch targets (§1), gestures, one-handed usability overlap.
- [`color-theory.md`](./color-theory.md) — Color roles and contrast-friendly palettes.
- [`ai-ui-mistakes.md`](./ai-ui-mistakes.md) — Mistakes #4 (contrast), #5 (touch targets), #13 (a11y) overlap.

### External references

- WCAG 2.1: <https://www.w3.org/TR/WCAG21/>
- WCAG 2.2: <https://www.w3.org/TR/WCAG22/>
- ARIA Authoring Practices Guide: <https://www.w3.org/WAI/ARIA/apg/>
- WebAIM Contrast Checker: <https://webaim.org/resources/contrastchecker/>
- Inclusive Components: <https://inclusive-components.design/>

---

*Last updated: design system documentation pass.*
