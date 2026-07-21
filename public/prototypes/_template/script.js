/* =========================================================================
   _template / script.js  —  v3
   View routing, theme toggle, clock, portrait battery, likes, toggles,
   follow button, search filter, screen-info panel sync.
   ========================================================================= */

(function () {
  "use strict";

  /* ---- Screen metadata (for right-panel info) ------------------------- */
  var SCREEN_INFO = {
    home:     { name: "Home",     desc: "Scrollable feed with interactive cards, like buttons, and story avatars." },
    search:   { name: "Search",   desc: "Search bar, recent queries, trending chips, and category list." },
    profile:  { name: "Profile",  desc: "User profile with stats, follow button, tabs, and a media grid." },
    settings: { name: "Settings", desc: "Toggle switches, grouped setting rows, and destructive actions." }
  };

  /* ---- View navigation ------------------------------------------------- */
  function goTo(viewName) {
    var views = document.querySelectorAll(".view");
    var found = false;
    views.forEach(function (v) {
      var isActive = v.dataset.view === viewName;
      v.classList.toggle("view--active", isActive);
      if (isActive) { v.scrollTop = 0; found = true; }
    });
    if (!found) return;

    document.querySelectorAll(".bottomnav__item").forEach(function (b) {
      b.classList.toggle("is-active", b.dataset.goto === viewName);
    });
    document.querySelectorAll(".screentlist__item").forEach(function (b) {
      b.classList.toggle("is-active", b.dataset.goto === viewName);
    });

    // update right-panel screen info
    var info = SCREEN_INFO[viewName];
    if (info) {
      var n = document.getElementById("screenInfoName");
      var d = document.getElementById("screenInfoDesc");
      if (n) n.textContent = info.name;
      if (d) d.textContent = info.desc;
    }

    history.replaceState(null, "", "#" + viewName);
  }

  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-goto]");
    if (!t) return;
    e.preventDefault();
    goTo(t.dataset.goto);
  });

  var initial = (location.hash || "#home").slice(1);
  goTo(document.querySelector('[data-view="' + initial + '"]') ? initial : "home");

  /* ---- Theme toggle (scoped to .device, NOT <html>) -------------------- */
  /* The app's dark mode toggle changes ONLY the device's theme, never the
     whole page. data-theme is set on the .device element, and CSS variables
     inside .device cascade to its children. The page (stage, side panels)
     stays in its own fixed theme. See docs/theme-architecture.md. */
  var themeToggle = document.getElementById("themeToggle");
  var device = document.getElementById("device");

  function setTheme(theme) {
    if (!device) return;
    device.setAttribute("data-theme", theme);
    try { localStorage.setItem("proto-app-theme", theme); } catch (_) {}
  }
  try { var saved = localStorage.getItem("proto-app-theme"); if (saved) setTheme(saved); } catch (_) {}

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var current = device ? device.getAttribute("data-theme") : "light";
      setTheme(current === "dark" ? "light" : "dark");
    });
  }

  /* ---- Live clock ------------------------------------------------------ */
  var clock = document.getElementById("clock");
  function tick() {
    if (!clock) return;
    var d = new Date();
    var h = d.getHours() % 12 || 12;
    var m = d.getMinutes().toString().padStart(2, "0");
    clock.textContent = h + ":" + m;
  }
  tick();
  setInterval(tick, 1000 * 30);

  /* ---- Portrait battery fill ------------------------------------------ */
  // Portrait battery viewBox 8x16. Inner body: y=3..14 (height 11).
  // Fill grows from bottom (y=14) upward.
  (function () {
    var pctEl = document.getElementById("battPct");
    var fillEl = document.getElementById("battFill");
    if (!pctEl || !fillEl) return;
    var pct = Math.max(0, Math.min(100, parseInt(pctEl.textContent, 10) || 87));
    pctEl.textContent = pct;
    var innerTop = 3, innerBottom = 14, innerH = innerBottom - innerTop; // 11
    var fh = Math.round((pct / 100) * innerH);
    var fy = innerBottom - fh;
    fillEl.setAttribute("y", String(fy));
    fillEl.setAttribute("height", String(fh));
    if (pct <= 15) fillEl.style.fill = "var(--color-danger)";
  })();

  /* ---- Like buttons (toggle) ------------------------------------------ */
  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-like]");
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    var liked = btn.classList.toggle("is-liked");
    var countEl = btn.querySelector(".post__count");
    if (countEl) {
      var n = parseInt(countEl.textContent, 10) || 0;
      countEl.textContent = liked ? n + 1 : n - 1;
    }
    btn.animate(
      [{ transform: "scale(1.25)" }, { transform: "scale(1)" }],
      { duration: 300, easing: "cubic-bezier(.2,.7,.2,1)" }
    );
  });

  /* ---- Toggle switches ------------------------------------------------- */
  document.addEventListener("click", function (e) {
    var tog = e.target.closest("[data-toggle]");
    if (!tog) return;
    e.preventDefault();
    tog.classList.toggle("is-on");
  });

  /* ---- Follow button --------------------------------------------------- */
  var followBtn = document.getElementById("followBtn");
  if (followBtn) {
    followBtn.addEventListener("click", function () {
      var following = followBtn.classList.toggle("is-following");
      followBtn.textContent = following ? "Following" : "Follow";
    });
  }

  /* ---- Tabs ------------------------------------------------------------ */
  document.addEventListener("click", function (e) {
    var tab = e.target.closest(".tab");
    if (!tab) return;
    var parent = tab.parentElement;
    parent.querySelectorAll(".tab").forEach(function (t) { t.classList.remove("is-active"); });
    tab.classList.add("is-active");
  });

  /* ---- Search filter --------------------------------------------------- */
  var searchInput = document.getElementById("searchInput");
  var recentList = document.getElementById("recentList");
  if (searchInput && recentList) {
    searchInput.addEventListener("input", function () {
      var q = searchInput.value.toLowerCase().trim();
      recentList.querySelectorAll("li").forEach(function (li) {
        var text = li.querySelector("span:nth-child(2)").textContent.toLowerCase();
        li.style.display = !q || text.indexOf(q) !== -1 ? "" : "none";
      });
    });
  }

  /* ---- Chip click feedback -------------------------------------------- */
  document.querySelectorAll(".chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
      chip.animate(
        [{ transform: "scale(.95)" }, { transform: "scale(1)" }],
        { duration: 200, easing: "ease-out" }
      );
    });
  });

  /* ---- Text selection: handled by CSS, not JS blockers ---------------- */
  /* The body has `user-select: none` in CSS (set in styles.css), which
     prevents text selection without blocking scroll/drag gestures. We do
     NOT add global selectstart/dragstart listeners here because they were
     preventing click-drag-to-scroll on desktop (see the scroll module below).
     Inputs/textareas re-enable selection via their own CSS rule. */

  /* ---- Click-drag-to-scroll on the device (desktop) ------------------- */
  /* On desktop, the user wants to scroll the device screen by clicking and
     dragging (like dragging a scrollbar with the mouse). Native wheel/touch
     scrolling already works; this adds the missing drag gesture.
     We only activate this on non-touch devices (pointer: fine) so we don't
     interfere with native touch scrolling on mobile. */
  (function () {
    var finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer || !device) return;

    var dragViews = Array.prototype.slice.call(device.querySelectorAll(".view"));
    var dragTargets = [device.querySelector(".screen")].concat(dragViews).filter(Boolean);

    dragTargets.forEach(function (el) {
      var dragging = false;
      var startX = 0, startY = 0;
      var startScrollLeft = 0, startScrollTop = 0;
      var moved = false;

      el.addEventListener("mousedown", function (e) {
        // Don't hijack clicks on interactive elements
        if (e.target.closest("button, a, input, .toggle, .chip, .tab, [data-goto], [data-like], [data-toggle]")) return;
        if (e.button !== 0) return;
        dragging = true;
        moved = false;
        startX = e.clientX;
        startY = e.clientY;
        startScrollLeft = el.scrollLeft;
        startScrollTop = el.scrollTop;
        el.style.cursor = "grabbing";
        e.preventDefault();
      });

      window.addEventListener("mousemove", function (e) {
        if (!dragging) return;
        var dx = e.clientX - startX;
        var dy = e.clientY - startY;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;
        el.scrollLeft = startScrollLeft - dx;
        el.scrollTop = startScrollTop - dy;
      });

      window.addEventListener("mouseup", function () {
        if (!dragging) return;
        dragging = false;
        el.style.cursor = "";
      });

      // Prevent click from firing after a drag (avoids accidental nav)
      el.addEventListener("click", function (e) {
        if (moved) {
          e.preventDefault();
          e.stopPropagation();
          moved = false;
        }
      }, true);
    });
  })();

  /* ---- Browser Fullscreen API (mobile fullscreen button) -------------- */
  /* Uses the real Fullscreen API (requestFullscreen / exitFullscreen) so the
     browser hides its address bar, tab bar, and (on Android) the system
     status bar — giving a true native-app full-screen experience.
     Falls back to the CSS framed/fullscreen toggle if the API is unavailable
     (e.g., iOS Safari, which doesn't support Fullscreen on iPhone). */
  (function () {
    var fsToggle = document.getElementById("fsToggle");
    var fsExpand = document.getElementById("fsIconExpand");
    var fsShrink = document.getElementById("fsIconShrink");
    if (!fsToggle || !device) return;

    function isFullscreen() {
      return !!(document.fullscreenElement || document.webkitFullscreenElement ||
                document.mozFullScreenElement || document.msFullscreenElement);
    }

    function requestFs() {
      var el = device;
      var req = el.requestFullscreen || el.webkitRequestFullscreen ||
                el.mozRequestFullScreen || el.msRequestFullscreen;
      if (req) {
        var p = req.call(el);
        if (p && p.catch) p.catch(function () { /* user denied or unsupported */ });
      } else {
        // Fallback: CSS-only fullscreen (fills viewport, no browser chrome hidden)
        device.classList.add("device--cssfs");
      }
    }

    function exitFs() {
      var ex = document.exitFullscreen || document.webkitExitFullscreen ||
               document.mozCancelFullScreen || document.msExitFullscreen;
      if (ex) {
        ex.call(document);
      } else {
        device.classList.remove("device--cssfs");
      }
    }

    function syncIcons() {
      var fs = isFullscreen() || device.classList.contains("device--cssfs");
      if (fsExpand) fsExpand.style.display = fs ? "none" : "block";
      if (fsShrink) fsShrink.style.display = fs ? "block" : "none";
    }

    fsToggle.addEventListener("click", function () {
      if (isFullscreen() || device.classList.contains("device--cssfs")) {
        exitFs();
      } else {
        requestFs();
      }
    });

    // Sync icon state when fullscreen changes (including Esc key exit)
    ["fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange", "MSFullscreenChange"].forEach(function (ev) {
      document.addEventListener(ev, syncIcons);
    });

    // Lock orientation to portrait when entering fullscreen (Android Chrome)
    // Best-effort — not all browsers support this.
    document.addEventListener("fullscreenchange", function () {
      if (isFullscreen() && screen.orientation && screen.orientation.lock) {
        screen.orientation.lock("portrait").catch(function () { /* ignore */ });
      }
    });

    syncIcons();
  })();
})();
