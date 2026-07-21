/* =========================================================================
   search-page / script.js  —  v4 (settings + improved recent + animations)
   - Recent searches (localStorage, limited to 3 visible + expandable)
   - Source-aware defaults: AniList shows popular, Extension shows trending
   - Feature-rich filter bottom sheet
   - Settings page with light/dark theme toggle (persisted)
   - M3 tonal elevation, staggered card animations
   ========================================================================= */

(function () {
  "use strict";

  var device = document.getElementById("device");

  /* ---- Clock + battery ----------------------------------------------- */
  var clock = document.getElementById("clock");
  function tick() { if (!clock) return; var d = new Date(); var h = d.getHours() % 12 || 12; var m = d.getMinutes().toString().padStart(2, "0"); clock.textContent = h + ":" + m; }
  tick(); setInterval(tick, 30000);

  (function () {
    var pctEl = document.getElementById("battPct"), fillEl = document.getElementById("battFill");
    if (!pctEl || !fillEl) return;
    var pct = Math.max(0, Math.min(100, parseInt(pctEl.textContent, 10) || 87));
    pctEl.textContent = pct;
    var fh = Math.round((pct / 100) * 11);
    fillEl.setAttribute("y", String(14 - fh));
    fillEl.setAttribute("height", String(fh));
  })();

  /* ---- Filter state --------------------------------------------------- */
  var GENRES = ["Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Mecha",
    "Music", "Mystery", "Psychological", "Romance", "Sci-Fi", "Slice of Life",
    "Sports", "Supernatural", "Thriller"];
  var SORT_LABELS = {
    "POPULARITY_DESC": "Popularity", "SCORE_DESC": "Score", "START_DATE_DESC": "Newest",
    "TITLE_ROMAJI": "Title A-Z", "FAVOURITES_DESC": "Favorites"
  };

  // Source-aware default sorts
  var SOURCE_DEFAULTS = {
    anilist: { sort: "POPULARITY_DESC", label: "Popular anime" },
    extension: { sort: "TRENDING_DESC", label: "Trending now" }
  };

  var state = {
    source: "anilist",
    query: "",
    genres: [],
    year: "",
    season: "",
    format: "",
    status: "",
    minScore: 0,
    sort: SOURCE_DEFAULTS.anilist.sort
  };

  // Recent searches in localStorage
  var RECENT_LIMIT = 12;  // max stored
  var RECENT_VISIBLE = 3; // visible before "Show more"
  var recentSearches = [];
  try { recentSearches = JSON.parse(localStorage.getItem("search-recent") || "[]"); } catch (e) { recentSearches = []; }
  function saveRecent() { try { localStorage.setItem("search-recent", JSON.stringify(recentSearches)); } catch (e) {} }
  function addRecent(query) {
    query = query.trim();
    if (!query) return;
    var idx = recentSearches.indexOf(query);
    if (idx !== -1) recentSearches.splice(idx, 1);
    recentSearches.unshift(query);
    if (recentSearches.length > RECENT_LIMIT) recentSearches = recentSearches.slice(0, RECENT_LIMIT);
    saveRecent();
  }
  function removeRecent(query) {
    var idx = recentSearches.indexOf(query);
    if (idx !== -1) { recentSearches.splice(idx, 1); saveRecent(); }
  }
  function clearRecent() { recentSearches = []; saveRecent(); }

  function countActiveFilters() {
    var n = 0;
    if (state.genres.length) n += state.genres.length;
    if (state.year) n++;
    if (state.season) n++;
    if (state.format) n++;
    if (state.status) n++;
    if (state.minScore > 0) n++;
    return n;
  }

  /* ---- AniList API ---------------------------------------------------- */
  var API = "https://graphql.anilist.co";
  var cache = {};

  function gql(query, variables) {
    var key = query + JSON.stringify(variables || {});
    if (cache[key]) return Promise.resolve(cache[key]);
    return fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ query: query, variables: variables || {} })
    }).then(function (r) { return r.json(); }).then(function (d) {
      cache[key] = d; return d;
    });
  }

  function fetchMedia(query, filters) {
    var vars = { page: 1, perPage: 30 };
    var params = ["type:ANIME"];
    if (query) { params.push("search:$search"); vars.search = query; }
    if (filters.genres && filters.genres.length) { params.push("genre_in:$genres"); vars.genres = filters.genres; }
    if (filters.year) { params.push("seasonYear:$year"); vars.year = parseInt(filters.year); }
    if (filters.season) { params.push("season:$season"); vars.season = filters.season; }
    if (filters.format) { params.push("format:$format"); vars.format = filters.format; }
    if (filters.status) { params.push("status:$status"); vars.status = filters.status; }
    if (filters.minScore && filters.minScore > 0) { params.push("averageScore_greater:$minScore"); vars.minScore = filters.minScore; }
    if (filters.sort) params.push("sort:" + filters.sort);

    var varDecls = ["$page:Int", "$perPage:Int"];
    if (vars.search !== undefined) varDecls.push("$search:String");
    if (vars.genres !== undefined) varDecls.push("$genres:[String]");
    if (vars.year !== undefined) varDecls.push("$year:Int");
    if (vars.season !== undefined) varDecls.push("$season:MediaSeason");
    if (vars.format !== undefined) varDecls.push("$format:MediaFormat");
    if (vars.status !== undefined) varDecls.push("$status:MediaStatus");
    if (vars.minScore !== undefined) varDecls.push("$minScore:Int");

    var q = "query(" + varDecls.join(",") + "){Page(page:$page,perPage:$perPage){media(" + params.join(",") + "){id title{romaji english} coverImage{large extraLarge} averageScore episodes format season seasonYear genres status}}}";
    return gql(q, vars);
  }

  /* ---- Helpers -------------------------------------------------------- */
  function el(html) { var t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstChild; }
  function fmtScore(s) { return s ? (s / 10).toFixed(1) : "—"; }

  /* ---- App settings (localStorage) ----------------------------------- */
  var appSettings = { singleLineTitles: true, animSpeed: "normal", posterStyle: "rounded", cardDensity: "default" };
  try { var saved = localStorage.getItem("anime-app-settings"); if (saved) appSettings = JSON.parse(saved); } catch (e) {}
  function saveAppSettings() { try { localStorage.setItem("anime-app-settings", JSON.stringify(appSettings)); } catch (e) {} }
  function applyAppSettings() {
    device.setAttribute("data-anim-speed", appSettings.animSpeed || "normal");
    device.setAttribute("data-poster-style", appSettings.posterStyle || "rounded");
    // Card density
    document.querySelectorAll(".results-grid").forEach(function (g) {
      g.classList.remove("results-grid--compact", "results-grid--comfortable");
      if (appSettings.cardDensity === "compact") g.classList.add("results-grid--compact");
      if (appSettings.cardDensity === "comfortable") g.classList.add("results-grid--comfortable");
    });
  }
  applyAppSettings();

  function animeCard(a) {
    var title = a.title.romaji || a.title.english || "Unknown";
    var cover = a.coverImage.large || a.coverImage.extraLarge;
    var score = a.averageScore ? '<span class="anime-card__score"><span class="star">★</span>' + fmtScore(a.averageScore) + '</span>' : '';
    var metaParts = [];
    if (a.format) metaParts.push(a.format);
    if (a.episodes) metaParts.push(a.episodes + " ep");
    else if (a.seasonYear) metaParts.push(a.seasonYear);
    var meta = metaParts.join(" · ");
    var titleClass = appSettings.singleLineTitles ? 'anime-card__title anime-card__title--single' : 'anime-card__title';
    var card = el(
      '<div class="anime-card" data-anime-id="' + a.id + '">' +
        '<div class="anime-card__cover"><img src="' + cover + '" alt="' + title + '" loading="lazy" onload="this.classList.add(\'loaded\')"/>' + score + '</div>' +
        '<h3 class="' + titleClass + '">' + title + '</h3>' +
        '<span class="anime-card__meta">' + meta + '</span>' +
      '</div>'
    );
    return card;
  }

  function showSkeletons(count) {
    var grid = document.getElementById("resultsGrid");
    grid.innerHTML = "";
    for (var i = 0; i < (count || 12); i++) grid.appendChild(el('<div class="skeleton" style="aspect-ratio:2/3"></div>'));
  }

  function showEmpty(title, desc) {
    var grid = document.getElementById("resultsGrid");
    grid.innerHTML = '';
    grid.appendChild(el(
      '<div class="empty-state" style="grid-column:1/-1">' +
        '<div class="empty-state__icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg></div>' +
        '<h3 class="empty-state__title">' + title + '</h3>' +
        '<p class="empty-state__desc">' + desc + '</p>' +
      '</div>'
    ));
  }

  /* ---- Recent searches UI (improved — limited + expandable) ---------- */
  var recentExpanded = false;
  function renderRecent() {
    var section = document.getElementById("recentSection");
    var list = document.getElementById("recentList");
    if (!section || !list) return;

    var hasFilters = countActiveFilters() > 0;
    if (!state.query && !hasFilters && recentSearches.length > 0) {
      section.style.display = "block";
      list.innerHTML = "";
      var visibleCount = recentExpanded ? recentSearches.length : Math.min(RECENT_VISIBLE, recentSearches.length);
      recentSearches.slice(0, visibleCount).forEach(function (q) {
        var item = el(
          '<div class="recent-item" data-query="' + q.replace(/"/g, '&quot;') + '">' +
            '<span class="recent-item__icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg></span>' +
            '<span class="recent-item__text">' + q + '</span>' +
            '<button class="recent-item__remove" data-remove="' + q.replace(/"/g, '&quot;') + '" aria-label="Remove"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>' +
          '</div>'
        );
        item.addEventListener("click", function (e) {
          if (e.target.closest("[data-remove]")) return;
          searchInput.value = q;
          state.query = q;
          searchClear.style.display = "flex";
          addRecent(q);
          doSearch();
        });
        var removeBtn = item.querySelector("[data-remove]");
        removeBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          removeRecent(q);
          renderRecent();
        });
        list.appendChild(item);
      });
      // Add "Show more" button if there are more than RECENT_VISIBLE
      if (recentSearches.length > RECENT_VISIBLE) {
        var more = el(
          '<div class="recent-more' + (recentExpanded ? ' is-expanded' : '') + '" id="recentMore">' +
            '<span>' + (recentExpanded ? 'Show less' : 'Show ' + (recentSearches.length - RECENT_VISIBLE) + ' more') + '</span>' +
            '<span class="recent-more__icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></span>' +
          '</div>'
        );
        more.addEventListener("click", function () {
          recentExpanded = !recentExpanded;
          renderRecent();
        });
        list.appendChild(more);
      }
      // Initialize the headRight with "Clear all" when expanded
      if (!recentCollapsed) {
        var headRight = document.getElementById("recentHeadRight");
        headRight.innerHTML = '<button class="recent-clear" id="recentClear">Clear all</button>';
        document.getElementById("recentClear").addEventListener("click", function () { clearRecent(); renderRecent(); });
      }
    } else {
      section.style.display = "none";
    }
  }

  /* ---- Recent searches collapse toggle -------------------------------- */
  var recentCollapsed = false;
  function toggleRecent() {
    recentCollapsed = !recentCollapsed;
    var list = document.getElementById("recentList");
    var toggle = document.getElementById("recentToggle");
    var headRight = document.getElementById("recentHeadRight");
    list.classList.toggle("is-collapsed", recentCollapsed);
    if (recentCollapsed) {
      // Collapsed: HIDE the toggle (next to text), show "Show" on the far right
      toggle.style.display = "none";
      headRight.innerHTML = '<button class="recent-show" id="recentShow">Show<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></button>';
      document.getElementById("recentShow").addEventListener("click", toggleRecent);
    } else {
      // Expanded: SHOW the toggle (next to text), show "Clear all" on the far right
      toggle.style.display = "flex";
      headRight.innerHTML = '<button class="recent-clear" id="recentClear">Clear all</button>';
      document.getElementById("recentClear").addEventListener("click", function () { clearRecent(); renderRecent(); });
    }
  }
  document.getElementById("recentToggle").addEventListener("click", toggleRecent);

  /* ---- Source toggle -------------------------------------------------- */
  document.getElementById("sourceToggle").addEventListener("click", function (e) {
    var btn = e.target.closest("[data-source]");
    if (!btn) return;
    var src = btn.dataset.source;
    if (src === state.source) return;
    state.source = src;
    // Reset sort to source default
    state.sort = SOURCE_DEFAULTS[src].sort;
    document.getElementById("sortLabel").textContent = SORT_LABELS[state.sort];
    document.querySelectorAll("#sortChips .fchip").forEach(function (c) {
      c.classList.toggle("is-active", c.dataset.sort === state.sort);
    });
    this.querySelectorAll(".source-toggle__btn").forEach(function (b) {
      b.classList.toggle("is-active", b === btn);
    });
    doSearch();
  });

  /* ---- Search input (debounced) --------------------------------------- */
  var searchTimer = null;
  var searchInput = document.getElementById("searchInput");
  var searchClear = document.getElementById("searchClear");

  searchInput.addEventListener("input", function () {
    state.query = this.value.trim();
    searchClear.style.display = state.query ? "flex" : "none";
    renderRecent();
    clearTimeout(searchTimer);
    searchTimer = setTimeout(function () {
      if (state.query) addRecent(state.query);
      doSearch();
    }, 500);
  });

  searchClear.addEventListener("click", function () {
    searchInput.value = "";
    state.query = "";
    searchClear.style.display = "none";
    searchInput.focus();
    renderRecent();
    doSearch();
  });

  /* ---- Build accordion filter sheet ---------------------------------- */
  var filterSheetBody = document.getElementById("filterSheetBody");
  var openAccordion = null;

  function buildFilterAccordion() {
    filterSheetBody.innerHTML = "";

    // 1. Genres
    var genreContent = el('<div class="filter-chips-wrap" id="genreChips"></div>');
    GENRES.forEach(function (g) {
      var chip = el('<button class="fchip" data-genre="' + g + '"><svg class="fchip__check" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg><span>' + g + '</span></button>');
      chip.addEventListener("click", function () {
        var idx = state.genres.indexOf(g);
        if (idx === -1) { state.genres.push(g); this.classList.add("is-active"); }
        else { state.genres.splice(idx, 1); this.classList.remove("is-active"); }
        updateFilterUI(); renderRecent(); doSearch(); updateAccordionCounts();
      });
      genreContent.appendChild(chip);
    });
    addAccordionItem("Genres", "genre", '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"/></svg>', genreContent, function () { return state.genres.length; });

    // 2. Release (year + season)
    var releaseContent = el('<div class="fselect-row"><select class="fselect" id="filterYear"><option value="">Year: Any</option></select><select class="fselect" id="filterSeason"><option value="">Season: Any</option><option value="WINTER">Winter</option><option value="SPRING">Spring</option><option value="SUMMER">Summer</option><option value="FALL">Fall</option></select></div>');
    var yr = new Date().getFullYear();
    var ys = releaseContent.querySelector("#filterYear");
    for (var y = yr; y >= 1990; y--) ys.appendChild(el('<option value="' + y + '">' + y + '</option>'));
    releaseContent.querySelector("#filterYear").addEventListener("change", function () { state.year = this.value; updateFilterUI(); renderRecent(); doSearch(); updateAccordionCounts(); });
    releaseContent.querySelector("#filterSeason").addEventListener("change", function () { state.season = this.value; updateFilterUI(); renderRecent(); doSearch(); updateAccordionCounts(); });
    addAccordionItem("Release", "release", '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>', releaseContent, function () { return (state.year ? 1 : 0) + (state.season ? 1 : 0); });

    // 3. Type (format + status)
    var typeContent = el('<div class="fselect-row"><select class="fselect" id="filterFormat"><option value="">Format: Any</option><option value="TV">TV Series</option><option value="MOVIE">Movie</option><option value="OVA">OVA</option><option value="ONA">ONA</option><option value="SPECIAL">Special</option><option value="MUSIC">Music</option></select><select class="fselect" id="filterStatus"><option value="">Status: Any</option><option value="RELEASING">Currently Airing</option><option value="FINISHED">Finished</option><option value="NOT_YET_RELEASED">Upcoming</option><option value="CANCELLED">Cancelled</option></select></div>');
    typeContent.querySelector("#filterFormat").addEventListener("change", function () { state.format = this.value; updateFilterUI(); renderRecent(); doSearch(); updateAccordionCounts(); });
    typeContent.querySelector("#filterStatus").addEventListener("change", function () { state.status = this.value; updateFilterUI(); renderRecent(); doSearch(); updateAccordionCounts(); });
    addAccordionItem("Type", "type", '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>', typeContent, function () { return (state.format ? 1 : 0) + (state.status ? 1 : 0); });

    // 4. Minimum score
    var scoreContent = el('<div class="score-slider-wrap"><div class="score-slider-row"><input type="range" class="score-slider" id="filterScore" min="0" max="100" value="0" step="5" /><span class="score-value" id="scoreValue">Any</span></div></div>');
    scoreContent.querySelector("#filterScore").addEventListener("input", function () {
      var v = parseInt(this.value);
      state.minScore = v;
      scoreContent.querySelector("#scoreValue").textContent = v > 0 ? (v / 10).toFixed(1) + "+" : "Any";
      updateFilterUI(); updateAccordionCounts();
    });
    scoreContent.querySelector("#filterScore").addEventListener("change", function () { renderRecent(); doSearch(); });
    addAccordionItem("Minimum score", "score", '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>', scoreContent, function () { return state.minScore > 0 ? 1 : 0; });

    // 5. Sort by
    var sortContent = el('<div class="filter-chips-wrap" id="sortChips"></div>');
    Object.keys(SORT_LABELS).forEach(function (key) {
      var chip = el('<button class="fchip' + (state.sort === key ? " is-active" : "") + '" data-sort="' + key + '"><svg class="fchip__check" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg><span>' + SORT_LABELS[key] + '</span></button>');
      chip.addEventListener("click", function () {
        state.sort = key;
        sortContent.querySelectorAll(".fchip").forEach(function (c) { c.classList.toggle("is-active", c === chip); });
        document.getElementById("sortLabel").textContent = SORT_LABELS[key];
        doSearch();
      });
      sortContent.appendChild(chip);
    });
    addAccordionItem("Sort by", "sort", '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M7 12h10M10 18h4"/></svg>', sortContent, function () { return 0; });
  }

  function addAccordionItem(label, id, iconSvg, contentEl, countFn) {
    var item = el(
      '<div class="facc" data-facc="' + id + '">' +
        '<button class="facc__btn" data-facc-btn="' + id + '">' +
          '<div class="facc__btn-left">' +
            '<span class="facc__btn-icon">' + iconSvg + '</span>' +
            '<span class="facc__btn-label">' + label + '</span>' +
          '</div>' +
          '<span class="facc__btn-count" data-facc-count="' + id + '" style="display:none">0</span>' +
          '<svg class="facc__chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>' +
        '</button>' +
        '<div class="facc__content" data-facc-content="' + id + '">' +
          '<div class="facc__content-inner"></div>' +
        '</div>' +
      '</div>'
    );
    item.querySelector(".facc__content-inner").appendChild(contentEl);
    item.querySelector(".facc__btn").addEventListener("click", function () {
      toggleAccordion(id);
    });
    item._countFn = countFn;
    filterSheetBody.appendChild(item);
  }

  function toggleAccordion(id) {
    var btn = document.querySelector('[data-facc-btn="' + id + '"]');
    var content = document.querySelector('[data-facc-content="' + id + '"]');
    if (!btn || !content) return;
    var isOpen = content.classList.contains("is-open");
    // Close all
    document.querySelectorAll(".facc__content").forEach(function (c) { c.classList.remove("is-open"); });
    document.querySelectorAll(".facc__btn").forEach(function (b) { b.classList.remove("is-active"); });
    if (!isOpen) { content.classList.add("is-open"); btn.classList.add("is-active"); openAccordion = id; }
    else openAccordion = null;
  }

  function updateAccordionCounts() {
    document.querySelectorAll(".facc").forEach(function (item) {
      var countFn = item._countFn;
      var countEl = item.querySelector('[data-facc-count]');
      if (countFn && countEl) {
        var n = countFn();
        if (n > 0) { countEl.textContent = n; countEl.style.display = "block"; }
        else countEl.style.display = "none";
      }
    });
  }

  buildFilterAccordion();

  /* ---- Sort dropdown (separate from filter sheet) --------------------- */
  var sortBtn = document.getElementById("sortBtn");
  var sortDropdown = null;

  function closeSortDropdown() {
    if (sortDropdown) { sortDropdown.remove(); sortDropdown = null; sortBtn.classList.remove("is-open"); }
  }

  sortBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    if (sortDropdown) { closeSortDropdown(); return; }
    sortBtn.classList.add("is-open");
    sortDropdown = el('<div class="sort-dropdown" id="sortDropdown"></div>');
    Object.keys(SORT_LABELS).forEach(function (key) {
      var item = el('<button class="sort-dropdown__item' + (state.sort === key ? " is-active" : "") + '" data-sort="' + key + '"><span>' + SORT_LABELS[key] + '</span>' + (state.sort === key ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' : '') + '</button>');
      item.addEventListener("click", function () {
        state.sort = key;
        document.getElementById("sortLabel").textContent = SORT_LABELS[key];
        document.querySelectorAll("#sortChips .fchip").forEach(function (c) { c.classList.toggle("is-active", c.dataset.sort === key); });
        closeSortDropdown();
        doSearch();
      });
      sortDropdown.appendChild(item);
    });
    var rect = sortBtn.getBoundingClientRect();
    var deviceRect = device.getBoundingClientRect();
    sortDropdown.style.position = "absolute";
    sortDropdown.style.top = (rect.top - deviceRect.top - 8) + "px";
    sortDropdown.style.right = (deviceRect.right - rect.right) + "px";
    sortDropdown.style.transform = "translateY(-100%)";
    sortDropdown.style.zIndex = "60";
    device.appendChild(sortDropdown);
  });

  document.addEventListener("click", function (e) {
    if (sortDropdown && !e.target.closest("#sortDropdown") && !e.target.closest("#sortBtn")) closeSortDropdown();
  });

  document.getElementById("applyFilters").addEventListener("click", closeSheet);

  /* ---- Clear all filters --------------------------------------------- */
  document.getElementById("clearAllFilters").addEventListener("click", function () {
    state.genres = []; state.year = ""; state.season = ""; state.format = "";
    state.status = ""; state.minScore = 0;
    state.sort = SOURCE_DEFAULTS[state.source].sort;
    // Rebuild the accordion to reset all UI
    buildFilterAccordion();
    document.getElementById("sortLabel").textContent = SORT_LABELS[state.sort];
    updateFilterUI();
    renderRecent();
    doSearch();
  });

  /* ---- Filter view toggle (accordion ↔ flat) ------------------------- */
  var filterViewMode = "accordion";
  document.getElementById("filterViewToggle").addEventListener("click", function (e) {
    var btn = e.target.closest("[data-view-mode]");
    if (!btn) return;
    filterViewMode = btn.dataset.viewMode;
    this.querySelectorAll(".filter-view-toggle__btn").forEach(function (b) { b.classList.toggle("is-active", b === btn); });
    if (filterViewMode === "accordion") {
      buildFilterAccordion();
    } else {
      buildFlatFilters();
    }
  });

  function buildFlatFilters() {
    var body = document.getElementById("filterSheetBody");
    body.innerHTML = "";
    // Tab row
    var tabs = el('<div class="filter-flat-tabs" id="flatTabs"></div>');
    var categories = [
      { id: "genre", label: "Genres" },
      { id: "release", label: "Release" },
      { id: "type", label: "Type" },
      { id: "score", label: "Min Score" },
      { id: "sort", label: "Sort" }
    ];
    categories.forEach(function (cat, i) {
      var tab = el('<button class="filter-flat-tab' + (i === 0 ? " is-active" : "") + '" data-flat-tab="' + cat.id + '">' + cat.label + '</button>');
      tabs.appendChild(tab);
    });
    body.appendChild(tabs);
    // Content area
    var content = el('<div class="filter-flat-content" id="flatContent"></div>');
    body.appendChild(content);

    // Show first category by default
    showFlatCategory("genre");

    // Tab click handler — auto-scroll to center the selected tab
    tabs.addEventListener("click", function (e) {
      var tab = e.target.closest("[data-flat-tab]");
      if (!tab) return;
      tabs.querySelectorAll(".filter-flat-tab").forEach(function (t) { t.classList.toggle("is-active", t === tab); });
      showFlatCategory(tab.dataset.flatTab);
      // Auto-scroll the tab into center
      var tabsRect = tabs.getBoundingClientRect();
      var tabRect = tab.getBoundingClientRect();
      var scrollOffset = (tabRect.left - tabsRect.left) - (tabsRect.width / 2) + (tabRect.width / 2);
      tabs.scrollTo({ left: tabs.scrollLeft + scrollOffset, behavior: "smooth" });
    });
  }

  function showFlatCategory(id) {
    var content = document.getElementById("flatContent");
    if (!content) return;
    content.innerHTML = "";
    if (id === "genre") {
      var wrap = el('<div class="filter-chips-wrap"></div>');
      GENRES.forEach(function (g) {
        var chip = el('<button class="fchip' + (state.genres.indexOf(g) !== -1 ? " is-active" : "") + '" data-genre="' + g + '"><svg class="fchip__check" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg><span>' + g + '</span></button>');
        chip.addEventListener("click", function () {
          var idx = state.genres.indexOf(g);
          if (idx === -1) { state.genres.push(g); this.classList.add("is-active"); }
          else { state.genres.splice(idx, 1); this.classList.remove("is-active"); }
          updateFilterUI(); renderRecent(); doSearch();
        });
        wrap.appendChild(chip);
      });
      content.appendChild(wrap);
    } else if (id === "release") {
      var row = el('<div class="fselect-row"><select class="fselect" id="filterYear"><option value="">Year: Any</option></select><select class="fselect" id="filterSeason"><option value="">Season: Any</option><option value="WINTER">Winter</option><option value="SPRING">Spring</option><option value="SUMMER">Summer</option><option value="FALL">Fall</option></select></div>');
      var yr = new Date().getFullYear();
      var ys = row.querySelector("#filterYear");
      for (var y = yr; y >= 1990; y--) ys.appendChild(el('<option value="' + y + '">' + y + '</option>'));
      ys.value = state.year;
      row.querySelector("#filterSeason").value = state.season;
      ys.addEventListener("change", function () { state.year = this.value; updateFilterUI(); renderRecent(); doSearch(); });
      row.querySelector("#filterSeason").addEventListener("change", function () { state.season = this.value; updateFilterUI(); renderRecent(); doSearch(); });
      content.appendChild(row);
    } else if (id === "type") {
      var tr = el('<div class="fselect-row"><select class="fselect" id="filterFormat"><option value="">Format: Any</option><option value="TV">TV Series</option><option value="MOVIE">Movie</option><option value="OVA">OVA</option><option value="ONA">ONA</option><option value="SPECIAL">Special</option><option value="MUSIC">Music</option></select><select class="fselect" id="filterStatus"><option value="">Status: Any</option><option value="RELEASING">Currently Airing</option><option value="FINISHED">Finished</option><option value="NOT_YET_RELEASED">Upcoming</option><option value="CANCELLED">Cancelled</option></select></div>');
      tr.querySelector("#filterFormat").value = state.format;
      tr.querySelector("#filterStatus").value = state.status;
      tr.querySelector("#filterFormat").addEventListener("change", function () { state.format = this.value; updateFilterUI(); renderRecent(); doSearch(); });
      tr.querySelector("#filterStatus").addEventListener("change", function () { state.status = this.value; updateFilterUI(); renderRecent(); doSearch(); });
      content.appendChild(tr);
    } else if (id === "score") {
      var sw = el('<div class="score-slider-wrap"><div class="score-slider-row"><input type="range" class="score-slider" id="filterScore" min="0" max="100" value="' + state.minScore + '" step="5" /><span class="score-value" id="scoreValue">' + (state.minScore > 0 ? (state.minScore / 10).toFixed(1) + "+" : "Any") + '</span></div></div>');
      sw.querySelector("#filterScore").addEventListener("input", function () {
        var v = parseInt(this.value);
        state.minScore = v;
        sw.querySelector("#scoreValue").textContent = v > 0 ? (v / 10).toFixed(1) + "+" : "Any";
        updateFilterUI();
      });
      sw.querySelector("#filterScore").addEventListener("change", function () { renderRecent(); doSearch(); });
      content.appendChild(sw);
    } else if (id === "sort") {
      var sc = el('<div class="filter-chips-wrap"></div>');
      Object.keys(SORT_LABELS).forEach(function (key) {
        var chip = el('<button class="fchip' + (state.sort === key ? " is-active" : "") + '" data-sort="' + key + '"><svg class="fchip__check" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg><span>' + SORT_LABELS[key] + '</span></button>');
        chip.addEventListener("click", function () {
          state.sort = key;
          sc.querySelectorAll(".fchip").forEach(function (c) { c.classList.toggle("is-active", c === chip); });
          document.getElementById("sortLabel").textContent = SORT_LABELS[key];
          doSearch();
        });
        sc.appendChild(chip);
      });
      content.appendChild(sc);
    }
  }

  /* ---- Bottom sheet open/close (no X button — tap scrim to close) ----- */
  var sheetScrim = document.getElementById("sheetScrim");
  var filterSheet = document.getElementById("filterSheet");
  function openSheet() { sheetScrim.classList.add("is-visible"); filterSheet.classList.add("is-open"); }
  function closeSheet() { sheetScrim.classList.remove("is-visible"); filterSheet.classList.remove("is-open"); }
  document.getElementById("filterBtn").addEventListener("click", openSheet);
  sheetScrim.addEventListener("click", closeSheet);

  /* ---- Update filter UI ---------------------------------------------- */
  function updateFilterUI() {
    var count = countActiveFilters();
    var badge = document.getElementById("filterBadge");
    var filterBtn = document.getElementById("filterBtn");
    if (count > 0) { badge.textContent = count; badge.style.display = "flex"; filterBtn.classList.add("is-active"); }
    else { badge.style.display = "none"; filterBtn.classList.remove("is-active"); }

    var chips = document.getElementById("activeFilters");
    chips.innerHTML = "";
    state.genres.forEach(function (g) {
      chips.appendChild(makeActiveChip(g, function () {
        state.genres.splice(state.genres.indexOf(g), 1);
        document.querySelectorAll("#genreChips .fchip").forEach(function (c) { if (c.dataset.genre === g) c.classList.remove("is-active"); });
        updateFilterUI(); renderRecent(); doSearch();
      }));
    });
    if (state.year) chips.appendChild(makeActiveChip(state.year, function () { state.year = ""; var ys = document.getElementById("filterYear"); if (ys) ys.value = ""; updateFilterUI(); renderRecent(); doSearch(); updateAccordionCounts(); }));
    if (state.season) chips.appendChild(makeActiveChip(state.season.charAt(0) + state.season.slice(1).toLowerCase(), function () { state.season = ""; var ss = document.getElementById("filterSeason"); if (ss) ss.value = ""; updateFilterUI(); renderRecent(); doSearch(); updateAccordionCounts(); }));
    if (state.format) chips.appendChild(makeActiveChip(formatLabel(state.format), function () { state.format = ""; var fs = document.getElementById("filterFormat"); if (fs) fs.value = ""; updateFilterUI(); renderRecent(); doSearch(); updateAccordionCounts(); }));
    if (state.status) chips.appendChild(makeActiveChip(statusLabel(state.status), function () { state.status = ""; var sts = document.getElementById("filterStatus"); if (sts) sts.value = ""; updateFilterUI(); renderRecent(); doSearch(); updateAccordionCounts(); }));
    if (state.minScore > 0) chips.appendChild(makeActiveChip("★ " + (state.minScore / 10).toFixed(1) + "+", function () { state.minScore = 0; var sl = document.getElementById("filterScore"); if (sl) sl.value = 0; var sv = document.getElementById("scoreValue"); if (sv) sv.textContent = "Any"; updateFilterUI(); renderRecent(); doSearch(); updateAccordionCounts(); }));
    chips.classList.toggle("has-chips", chips.children.length > 0);

    document.getElementById("sortLabel").textContent = SORT_LABELS[state.sort];
    updateAccordionCounts();
  }

  function setGroupClear(group, visible) {
    var btn = document.querySelector('[data-clear="' + group + '"]');
    if (btn) btn.classList.toggle("is-hidden", !visible);
  }
  function formatLabel(f) { var m = { TV: "TV", MOVIE: "Movie", OVA: "OVA", ONA: "ONA", SPECIAL: "Special", MUSIC: "Music" }; return m[f] || f; }
  function statusLabel(s) { var m = { RELEASING: "Airing", FINISHED: "Finished", NOT_YET_RELEASED: "Upcoming", CANCELLED: "Cancelled" }; return m[s] || s; }

  function makeActiveChip(label, onRemove) {
    var chip = el(
      '<button class="active-filter-chip"><span>' + label + '</span>' +
        '<span class="active-filter-chip__x"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></span>' +
      '</button>'
    );
    chip.addEventListener("click", onRemove);
    return chip;
  }

  /* ---- Search execution ---------------------------------------------- */
  function doSearch() {
    var grid = document.getElementById("resultsGrid");
    var label = document.getElementById("resultsLabel");
    var count = document.getElementById("resultsCount");

    var hasQuery = !!state.query;
    var hasFilters = countActiveFilters() > 0;

    if (hasQuery) {
      label.textContent = 'Results for "' + state.query + '"';
    } else if (hasFilters) {
      label.textContent = "Filtered results";
    } else {
      label.textContent = SOURCE_DEFAULTS[state.source].label;
    }
    if (state.source === "extension") label.textContent = label.textContent + " · Extension";

    showSkeletons(12);

    fetchMedia(state.query, {
      genres: state.genres, year: state.year, season: state.season,
      format: state.format, status: state.status, minScore: state.minScore, sort: state.sort
    }).then(function (d) {
      var media = (d.data && d.data.Page && d.data.Page.media) || [];
      count.textContent = media.length ? media.length + " found" : "";
      if (!media.length) { showEmpty("No results found", "Try different keywords or adjust your filters."); return; }
      grid.innerHTML = "";
      media.forEach(function (a, i) {
        var card = animeCard(a);
        // Staggered fade-in animation
        card.style.animationDelay = (i * 40) + 'ms';
        grid.appendChild(card);
      });
    }).catch(function () {
      showEmpty("Search error", "Could not fetch results. Check your connection.");
    });
  }

  /* ---- View navigation (home / library / history / search / settings / detail) ---- */
  var SCREEN_INFO = {
    home:     { name: "Home",     desc: "Browse trending, seasonal, and top-rated anime." },
    library:  { name: "Library",  desc: "Your saved anime, organized by status." },
    history:  { name: "History",  desc: "Recently viewed anime." },
    search:   { name: "Search",   desc: "Search AniList with filters and recent searches." },
    settings: { name: "Settings", desc: "Theme toggle and app info." },
    detail:   { name: "Detail",   desc: "Anime details with synopsis, genres, and episodes." }
  };

  var previousView = "home";
  var bottomNavEl = document.querySelector(".bottomnav");

  function goToView(viewName, skipHash) {
    // Track previous view for detail back-button (don't store "detail" as previous)
    if (viewName === "detail") {
      var currentActive = document.querySelector(".view.view--active");
      if (currentActive && currentActive.dataset.view !== "detail") {
        previousView = currentActive.dataset.view;
      }
    }
    // Toggle view--active; reset scroll on the newly active view
    document.querySelectorAll(".view").forEach(function (v) {
      var active = v.dataset.view === viewName;
      v.classList.toggle("view--active", active);
      if (active) v.scrollTop = 0;
    });
    // Sync bottom nav active state
    document.querySelectorAll(".bottomnav__item").forEach(function (b) {
      b.classList.toggle("is-active", b.dataset.nav === viewName);
    });
    // Hide floating bottom nav on the pushed detail view; show on all others
    if (bottomNavEl) {
      bottomNavEl.style.display = (viewName === "detail") ? "none" : "";
    }
    // Update right side-panel info
    var info = SCREEN_INFO[viewName];
    if (info) {
      var n = document.querySelector(".screeninfo__name");
      var d = document.querySelector(".screeninfo__desc");
      if (n) n.textContent = info.name;
      if (d) d.textContent = info.desc;
    }
    // Lazy-render library/history when opened so they reflect latest localStorage
    if (viewName === "library") renderLibrary();
    if (viewName === "history") renderHistory();
    // Update URL hash — use pushState so browser back goes to previous view
    if (!skipHash) {
      var newHash = "#" + viewName;
      if (viewName === "detail" && currentAnime) {
        newHash = "#animedetails" + currentAnime.id;
      }
      if (location.hash !== newHash) {
        history.pushState({ view: viewName }, "", newHash);
      }
    }
  }

  function goBack() { goToView(previousView || "home"); }

  /* ---- URL hash routing ----------------------------------------------- */
  function handleHash() {
    var hash = location.hash.slice(1);
    if (!hash || hash === "home") { goToView("home", true); return; }
    if (hash === "search" || hash === "library" || hash === "history" || hash === "settings") {
      goToView(hash, true);
      return;
    }
    if (hash.indexOf("animedetails") === 0) {
      var id = parseInt(hash.replace("animedetails", ""), 10);
      if (id) {
        skipNextPush = true; // prevent openDetail from pushing another state
        openDetail(id);
      }
      return;
    }
    goToView("home", true);
  }
  window.addEventListener("popstate", handleHash);
  // Process initial hash on load — set #home if no hash
  if (location.hash) {
    handleHash();
  } else {
    history.replaceState({ view: "home" }, "", "#home");
  }

  /* ---- Theme toggle (persisted, scoped to .device + stage) ----------- */
  var savedTheme = "dark";
  try { savedTheme = localStorage.getItem("search-theme") || "dark"; } catch (e) {}
  device.setAttribute("data-theme", savedTheme);
  updateStageTheme(savedTheme);
  // Sync toggle UI
  document.querySelectorAll(".theme-toggle__btn").forEach(function (b) {
    b.classList.toggle("is-active", b.dataset.themeVal === savedTheme);
  });
  document.getElementById("themeToggle").addEventListener("click", function (e) {
    var btn = e.target.closest("[data-theme-val]");
    if (!btn) return;
    var theme = btn.dataset.themeVal;
    device.setAttribute("data-theme", theme);
    updateStageTheme(theme);
    try { localStorage.setItem("search-theme", theme); } catch (e) {}
    this.querySelectorAll(".theme-toggle__btn").forEach(function (b) {
      b.classList.toggle("is-active", b === btn);
    });
  });

  function updateStageTheme(theme) {
    var root = document.documentElement;
    if (theme === "light") {
      root.style.setProperty("--stage-bg", "#c8c8c8");
      root.style.setProperty("--sb-bg", "#d0d0d0");
      root.style.setProperty("--sb-muted", "#c0c0c0");
      root.style.setProperty("--sb-border", "#b8b8b8");
      root.style.setProperty("--sb-text", "#333333");
      root.style.setProperty("--sb-text-muted", "#666666");
    } else {
      root.style.setProperty("--stage-bg", "#2a2a2a");
      root.style.setProperty("--sb-bg", "#232323");
      root.style.setProperty("--sb-muted", "#333333");
      root.style.setProperty("--sb-border", "#3a3a3a");
      root.style.setProperty("--sb-text", "#e0e0e0");
      root.style.setProperty("--sb-text-muted", "#999999");
    }
  }

  /* ---- App settings toggles (single-line titles, customization) ------ */
  (function () {
    var singleLineBtn = document.getElementById("settingSingleLine");
    if (singleLineBtn) {
      singleLineBtn.classList.toggle("is-on", appSettings.singleLineTitles);
      singleLineBtn.addEventListener("click", function () {
        appSettings.singleLineTitles = !appSettings.singleLineTitles;
        this.classList.toggle("is-on", appSettings.singleLineTitles);
        saveAppSettings();
      });
    }
    // Animation speed
    var animSpeedSelect = document.getElementById("settingAnimSpeed");
    if (animSpeedSelect) {
      animSpeedSelect.value = appSettings.animSpeed || "normal";
      animSpeedSelect.addEventListener("change", function () {
        appSettings.animSpeed = this.value;
        saveAppSettings(); applyAppSettings();
      });
    }
    // Poster style
    var posterStyleSelect = document.getElementById("settingPosterStyle");
    if (posterStyleSelect) {
      posterStyleSelect.value = appSettings.posterStyle || "rounded";
      posterStyleSelect.addEventListener("change", function () {
        appSettings.posterStyle = this.value;
        saveAppSettings(); applyAppSettings();
      });
    }
    // Card density
    var densitySelect = document.getElementById("settingCardDensity");
    if (densitySelect) {
      densitySelect.value = appSettings.cardDensity || "default";
      densitySelect.addEventListener("change", function () {
        appSettings.cardDensity = this.value;
        saveAppSettings(); applyAppSettings();
      });
    }
    var clearHistBtn = document.getElementById("clearHistoryBtn");
    if (clearHistBtn) {
      clearHistBtn.addEventListener("click", function () {
        if (confirm("Clear all watch history?")) {
          historyData = []; saveHistory(); renderHistory();
        }
      });
    }
    var clearLibBtn = document.getElementById("clearLibraryBtn");
    if (clearLibBtn) {
      clearLibBtn.addEventListener("click", function () {
        if (confirm("Clear entire library?")) {
          libraryData = []; saveLibrary(); renderLibrary();
        }
      });
    }
  })();

  // Initial load
  updateFilterUI();
  renderRecent();
  doSearch();
  loadHome();   // fetch trending + seasonal + top rated for the default home view

  /* ---- Collapsing header on scroll (search + home) ------------------- */
  (function () {
    var collapseThreshold = 20;
    function setupCollapse(viewName) {
      var contentView = document.querySelector('[data-view="' + viewName + '"] .content');
      var topbar = document.querySelector('[data-view="' + viewName + '"] .topbar');
      if (!contentView || !topbar) return;
      contentView.addEventListener("scroll", function () {
        var st = contentView.scrollTop;
        if (st > collapseThreshold) topbar.classList.add("is-collapsed");
        else topbar.classList.remove("is-collapsed");
      });
    }
    setupCollapse("search");
    setupCollapse("home");
  })();

  /* ---- Bottom nav (navigate between views) --------------------------- */
  document.querySelectorAll(".bottomnav__item").forEach(function (item) {
    item.addEventListener("click", function () {
      var nav = this.dataset.nav;
      goToView(nav);
    });
  });

  /* ---- Home page ----------------------------------------------------- */
  /* Three separate AniList queries (AniList doesn't support aliasing
     multiple Page queries in a single request):
       1. Trending (5)      → hero carousel (#homeTrending)
       2. Popular this season (12) → card grid (#homeSeasonal)
       3. Top rated (9)     → card grid (#homeTopRated)
     All cards are clickable via the delegated [data-anime-id] handler. */
  var homeLoaded = false;
  function loadHome() {
    if (homeLoaded) return;
    homeLoaded = true;
    loadTrending();
    loadSeasonal();
    loadTopRated();
  }

  function loadTrending() {
    var q = "query{Page(page:1,perPage:5){media(type:ANIME,sort:TRENDING_DESC){id title{romaji english} coverImage{large extraLarge} bannerImage averageScore}}}";
    gql(q, {}).then(function (d) {
      var media = (d.data && d.data.Page && d.data.Page.media) || [];
      renderHero(media);
    }).catch(function () {});
  }

  function loadSeasonal() {
    var now = new Date();
    var m = now.getMonth();
    var season = m <= 1 ? "WINTER" : m <= 4 ? "SPRING" : m <= 7 ? "SUMMER" : "FALL";
    var year = now.getFullYear();
    if (m === 11) { season = "WINTER"; year = year + 1; } // Dec → Winter of next year
    var q = "query($season:MediaSeason,$year:Int){Page(page:1,perPage:12){media(type:ANIME,season:$season,seasonYear:$year,sort:POPULARITY_DESC){id title{romaji english} coverImage{large extraLarge} averageScore episodes format seasonYear}}}";
    gql(q, { season: season, year: year }).then(function (d) {
      var media = (d.data && d.data.Page && d.data.Page.media) || [];
      var grid = document.getElementById("homeSeasonal");
      if (!grid) return;
      grid.innerHTML = "";
      media.forEach(function (a, i) {
        var card = animeCard(a);
        card.style.animationDelay = (i * 40) + 'ms';
        grid.appendChild(card);
      });
    }).catch(function () {});
  }

  function loadTopRated() {
    var q = "query{Page(page:1,perPage:9){media(type:ANIME,sort:SCORE_DESC){id title{romaji english} coverImage{large extraLarge} averageScore episodes format seasonYear}}}";
    gql(q, {}).then(function (d) {
      var media = (d.data && d.data.Page && d.data.Page.media) || [];
      var grid = document.getElementById("homeTopRated");
      if (!grid) return;
      grid.innerHTML = "";
      media.forEach(function (a, i) {
        var card = animeCard(a);
        card.style.animationDelay = (i * 40) + 'ms';
        grid.appendChild(card);
      });
    }).catch(function () {});
  }

  /* Hero carousel — auto-rotating, 5 slides */
  var heroSlides = [];
  var heroIndex = 0;
  var heroTimer = null;

  function renderHero(media) {
    var container = document.getElementById("homeTrending");
    if (!container) return;
    container.innerHTML = "";
    if (!media.length) return;
    heroSlides = media;
    heroIndex = 0;

    var carousel = el('<div class="hero-carousel"></div>');
    media.forEach(function (a, i) {
      var title = a.title.romaji || a.title.english || "Unknown";
      var bg = a.bannerImage || a.coverImage.extraLarge || a.coverImage.large;
      var score = a.averageScore ? '<span class="hero-slide__score"><span class="star">★</span>' + fmtScore(a.averageScore) + '</span>' : '';
      var slide = el(
        '<div class="hero-slide' + (i === 0 ? ' is-active' : '') + '" data-anime-id="' + a.id + '">' +
          '<img class="hero-slide__bg" src="' + bg + '" alt="' + title + '" loading="lazy"/>' +
          '<div class="hero-slide__content">' +
            '<h3 class="hero-slide__title">' + title + '</h3>' +
            score +
          '</div>' +
        '</div>'
      );
      carousel.appendChild(slide);
    });

    // Dot indicators
    var dots = el('<div class="hero-dots"></div>');
    media.forEach(function (a, i) {
      var dot = el('<button class="hero-dot' + (i === 0 ? ' is-active' : '') + '" data-hero-dot="' + i + '" aria-label="Slide ' + (i + 1) + '" data-no-nav></button>');
      dot.addEventListener("click", function (e) {
        e.stopPropagation();
        setHeroIndex(i);
        restartHeroTimer();
      });
      dots.appendChild(dot);
    });
    carousel.appendChild(dots);
    container.appendChild(carousel);

    startHeroTimer();
  }

  function setHeroIndex(i) {
    if (!heroSlides.length) return;
    heroIndex = (i + heroSlides.length) % heroSlides.length;
    var container = document.getElementById("homeTrending");
    if (!container) return;
    container.querySelectorAll(".hero-slide").forEach(function (s, idx) {
      s.classList.toggle("is-active", idx === heroIndex);
    });
    container.querySelectorAll(".hero-dot").forEach(function (d, idx) {
      d.classList.toggle("is-active", idx === heroIndex);
    });
  }

  function startHeroTimer() {
    if (heroTimer) clearInterval(heroTimer);
    if (heroSlides.length < 2) return;
    heroTimer = setInterval(function () { setHeroIndex(heroIndex + 1); }, 5000);
  }
  function restartHeroTimer() { startHeroTimer(); }

  /* ---- Anime detail page -------------------------------------------- */
  /* Fetches full Media by ID and renders banner + cover + meta pills +
     genres + expandable synopsis + add-to-library + episode list.
     Also pushes the anime into history (most-recent-first, deduped). */
  var currentAnime = null;
  var skipNextPush = false; // used when openDetail is called from popstate

  function openDetail(id) {
    var detailContent = document.getElementById("detailContent");
    if (!detailContent) return;
    // Loading skeleton
    detailContent.innerHTML =
      '<div class="skeleton" style="height:200px;border-radius:0"></div>' +
      '<div class="detail-header"><div class="skeleton detail-cover"></div>' +
      '<div class="detail-info"><div class="skeleton" style="height:24px;width:60%;margin-bottom:8px"></div>' +
      '<div class="skeleton" style="height:16px;width:40%"></div></div></div>';
    goToView("detail", true); // skip hash in goToView
    // Only push state if not called from popstate handler
    if (!skipNextPush) {
      history.pushState({ view: "detail", id: id }, "", "#animedetails" + id);
    }
    skipNextPush = false;

    var q = "query($id:Int){Media(id:$id,type:ANIME){id title{romaji english} coverImage{large extraLarge} bannerImage averageScore episodes format season seasonYear genres status description nextAiringEpisode{airingAt episode} siteUrl}}";
    gql(q, { id: id }).then(function (d) {
      var a = (d.data && d.data.Media) || null;
      if (!a) return;
      currentAnime = a;
      renderDetail(a);
      addHistory(a);
    }).catch(function () {
      detailContent.innerHTML = '<div class="empty-state" style="margin-top:80px">' +
        '<div class="empty-state__icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div>' +
        '<h3 class="empty-state__title">Could not load anime</h3>' +
        '<p class="empty-state__desc">Check your connection and try again.</p>' +
        '<button class="btn-outlined" id="detailBackRetry" style="margin-top:12px;flex:0 0 auto">Go back</button>' +
      '</div>';
      var backBtn = document.getElementById("detailBackRetry");
      if (backBtn) backBtn.addEventListener("click", goBack);
    });
  }

  function renderDetail(a) {
    var detailContent = document.getElementById("detailContent");
    if (!detailContent) return;
    var title = a.title.romaji || a.title.english || "Unknown";
    var englishSub = (a.title.english && a.title.english !== title) ? a.title.english : "";
    var banner = a.bannerImage || a.coverImage.extraLarge || a.coverImage.large;
    var cover = a.coverImage.large || a.coverImage.extraLarge;

    // Meta pills: score / status / episodes / format
    var metaParts = [];
    if (a.averageScore) metaParts.push('<span class="meta-pill">★ ' + fmtScore(a.averageScore) + '</span>');
    if (a.status) metaParts.push('<span class="meta-pill">' + statusLabel(a.status) + '</span>');
    if (a.episodes) metaParts.push('<span class="meta-pill">' + a.episodes + ' ep</span>');
    else if (a.nextAiringEpisode && a.nextAiringEpisode.episode) metaParts.push('<span class="meta-pill">Ep ' + a.nextAiringEpisode.episode + ' soon</span>');
    if (a.format) metaParts.push('<span class="meta-pill">' + formatLabel(a.format) + '</span>');
    var meta = metaParts.join("");

    // Genre chips
    var genres = (a.genres || []).map(function (g) {
      return '<span class="genre-chip">' + g + '</span>';
    }).join("");

    // Synopsis — strip AniList HTML tags
    var synopsis = (a.description || "No synopsis available.").replace(/<[^>]+>/g, "");

    // Episode list — number up to a.episodes, capped at 24 for display
    var epCount = a.episodes || 12;
    if (epCount > 24) epCount = 24;
    var episodes = "";
    for (var i = 1; i <= epCount; i++) {
      episodes += '<div class="episode-row">' +
        '<div class="episode-row__num">' + i + '</div>' +
        '<div class="episode-row__info">' +
          '<span class="episode-row__title">Episode ' + i + '</span>' +
          '<span class="episode-row__meta">' + (a.format ? formatLabel(a.format) : "TV") + '</span>' +
        '</div>' +
      '</div>';
    }

    // Add-to-Library button — toggles label & style based on membership
    var inLib = isInLibrary(a.id);
    var libBtn = inLib
      ? '<button class="btn-filled" id="libToggle">In Library ✓</button>'
      : '<button class="btn-outlined" id="libToggle">+ Add to Library</button>';

    detailContent.innerHTML =
      '<div class="detail-banner"><img src="' + banner + '" alt="' + title + '"/></div>' +
      '<button class="detail-back" id="detailBack" aria-label="Back"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button>' +
      '<div class="detail-header">' +
        '<div class="detail-cover"><img src="' + cover + '" alt="' + title + '"/></div>' +
        '<div class="detail-info">' +
          '<h1 class="detail-title">' + title + '</h1>' +
          (englishSub ? '<span class="detail-subtitle">' + englishSub + '</span>' : '') +
          '<div class="detail-meta">' + meta + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="detail-actions">' + libBtn + '</div>' +
      '<div class="detail-body">' +
        (genres ? '<div class="detail-section"><h3>Genres</h3><div class="detail-genres">' + genres + '</div></div>' : '') +
        '<div class="detail-section">' +
          '<h3>Synopsis</h3>' +
          '<p class="detail-synopsis" id="synopsisText">' + synopsis + '</p>' +
          '<button class="detail-expand" id="synopsisExpand">Read more</button>' +
        '</div>' +
        (episodes ? '<div class="detail-section"><h3>Episodes</h3><div class="episode-list">' + episodes + '</div></div>' : '') +
      '</div>';

    // Wire up handlers
    document.getElementById("detailBack").addEventListener("click", goBack);
    document.getElementById("synopsisExpand").addEventListener("click", function () {
      var syn = document.getElementById("synopsisText");
      if (!syn) return;
      syn.classList.toggle("is-expanded");
      this.textContent = syn.classList.contains("is-expanded") ? "Show less" : "Read more";
    });
    document.getElementById("libToggle").addEventListener("click", function () {
      toggleLibrary(a);
    });
  }

  /* ---- Library page (localStorage `anime-library`) ------------------ */
  /* Each entry: {id, title, cover, score, format, episodes, status, addedAt}
     status ∈ {"watching","completed","plan"} — added from detail page as "watching". */
  var LIB_KEY = "anime-library";
  var libraryData = [];
  try { libraryData = JSON.parse(localStorage.getItem(LIB_KEY) || "[]"); } catch (e) { libraryData = []; }
  function saveLibrary() { try { localStorage.setItem(LIB_KEY, JSON.stringify(libraryData)); } catch (e) {} }
  function isInLibrary(id) { return libraryData.some(function (x) { return x.id === id; }); }
  function addToLibrary(a, status) {
    if (isInLibrary(a.id)) return;
    var title = a.title.romaji || a.title.english || "Unknown";
    var cover = a.coverImage.large || a.coverImage.extraLarge;
    libraryData.unshift({
      id: a.id, title: title, cover: cover,
      score: a.averageScore || null, format: a.format || null,
      episodes: a.episodes || null, status: status || "watching",
      addedAt: Date.now()
    });
    saveLibrary();
  }
  function removeFromLibrary(id) {
    var idx = libraryData.findIndex(function (x) { return x.id === id; });
    if (idx !== -1) { libraryData.splice(idx, 1); saveLibrary(); }
  }
  function toggleLibrary(a) {
    if (isInLibrary(a.id)) removeFromLibrary(a.id);
    else addToLibrary(a, "watching");
    // Refresh the detail-page button label/style in place
    var btn = document.getElementById("libToggle");
    if (btn) {
      var inLib = isInLibrary(a.id);
      btn.textContent = inLib ? "In Library ✓" : "+ Add to Library";
      btn.classList.toggle("btn-filled", inLib);
      btn.classList.toggle("btn-outlined", !inLib);
    }
  }

  var libraryFilter = "all";
  function renderLibrary() {
    var container = document.getElementById("libraryContent");
    if (!container) return;
    var items = libraryData;
    if (libraryFilter !== "all") {
      items = items.filter(function (x) { return x.status === libraryFilter; });
    }
    container.innerHTML = "";
    if (!items.length) {
      container.appendChild(el(
        '<div class="empty-state" style="grid-column:1/-1">' +
          '<div class="empty-state__icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></div>' +
          '<h3 class="empty-state__title">Your library is empty</h3>' +
          '<p class="empty-state__desc">Browse anime and add them to your library.</p>' +
        '</div>'
      ));
      return;
    }
    var grid = el('<div class="results-grid"></div>');
    items.forEach(function (item, i) {
      var card = animeCard({
        id: item.id,
        title: { romaji: item.title, english: null },
        coverImage: { large: item.cover, extraLarge: item.cover },
        averageScore: item.score, format: item.format,
        episodes: item.episodes, seasonYear: null
      });
      card.style.animationDelay = (i * 40) + 'ms';
      var wrap = el('<div class="library-card-wrap"></div>');
      wrap.appendChild(card);
      var x = el('<button class="library-card__remove" data-remove-id="' + item.id + '" data-no-nav aria-label="Remove from library"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>');
      wrap.appendChild(x);
      grid.appendChild(wrap);
    });
    container.appendChild(grid);
  }

  // Library status-tab clicks
  (function () {
    var tabs = document.getElementById("libraryTabs");
    if (!tabs) return;
    tabs.addEventListener("click", function (e) {
      var tab = e.target.closest("[data-status]");
      if (!tab) return;
      libraryFilter = tab.dataset.status;
      tabs.querySelectorAll(".tab").forEach(function (t) { t.classList.toggle("is-active", t === tab); });
      renderLibrary();
    });
  })();

  // Library card remove (X) clicks — show confirm dialog before deleting
  (function () {
    var container = document.getElementById("libraryContent");
    if (!container) return;
    container.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-remove-id]");
      if (!btn) return;
      e.stopPropagation();
      var id = parseInt(btn.dataset.removeId, 10);
      var item = libraryData.find(function (x) { return x.id === id; });
      var title = item ? item.title : "this anime";
      // Show confirm dialog
      var dialog = el(
        '<div class="confirm-dialog" id="confirmDialog">' +
          '<div class="confirm-dialog__card">' +
            '<h3 class="confirm-dialog__title">Remove from library?</h3>' +
            '<p class="confirm-dialog__desc">"' + title + '" will be removed from your library.</p>' +
            '<div class="confirm-dialog__actions">' +
              '<button class="btn-outlined" id="confirmCancel">Cancel</button>' +
              '<button class="btn-filled" id="confirmDelete" style="background:var(--color-error)">Remove</button>' +
            '</div>' +
          '</div>' +
        '</div>'
      );
      device.appendChild(dialog);
      requestAnimationFrame(function () { dialog.classList.add("is-visible"); });
      document.getElementById("confirmCancel").addEventListener("click", function () {
        dialog.classList.remove("is-visible");
        setTimeout(function () { dialog.remove(); }, 200);
      });
      document.getElementById("confirmDelete").addEventListener("click", function () {
        removeFromLibrary(id);
        dialog.classList.remove("is-visible");
        setTimeout(function () { dialog.remove(); }, 200);
        renderLibrary();
      });
    });
  })();

  /* ---- History page (localStorage `anime-history`) ------------------ */
  /* Array of {id, title, cover, viewedAt}, most-recent-first, max 20, deduped by ID.
     Pushed every time openDetail() resolves successfully. */
  var HIST_KEY = "anime-history";
  var historyData = [];
  try { historyData = JSON.parse(localStorage.getItem(HIST_KEY) || "[]"); } catch (e) { historyData = []; }
  function saveHistory() { try { localStorage.setItem(HIST_KEY, JSON.stringify(historyData)); } catch (e) {} }
  function addHistory(a) {
    var title = a.title.romaji || a.title.english || "Unknown";
    var cover = a.coverImage.large || a.coverImage.extraLarge;
    var idx = historyData.findIndex(function (x) { return x.id === a.id; });
    if (idx !== -1) historyData.splice(idx, 1);
    historyData.unshift({ id: a.id, title: title, cover: cover, viewedAt: Date.now() });
    if (historyData.length > 20) historyData = historyData.slice(0, 20);
    saveHistory();
  }

  function timeAgo(ts) {
    var diff = Date.now() - ts;
    var s = Math.floor(diff / 1000);
    if (s < 60) return "Just now";
    var m = Math.floor(s / 60);
    if (m < 60) return m + "m ago";
    var h = Math.floor(m / 60);
    if (h < 24) return h + "h ago";
    var d = Math.floor(h / 24);
    if (d < 7) return d + "d ago";
    return new Date(ts).toLocaleDateString();
  }

  function renderHistory() {
    var container = document.getElementById("historyContent");
    if (!container) return;
    container.innerHTML = "";
    if (!historyData.length) {
      container.appendChild(el(
        '<div class="empty-state">' +
          '<div class="empty-state__icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>' +
          '<h3 class="empty-state__title">No history yet</h3>' +
          '<p class="empty-state__desc">Anime you view will appear here.</p>' +
        '</div>'
      ));
      return;
    }
    var list = el('<div class="history-list"></div>');
    historyData.forEach(function (item) {
      var row = el(
        '<div class="anime-row" data-anime-id="' + item.id + '">' +
          '<div class="anime-row__cover"><img src="' + item.cover + '" alt="' + item.title + '" loading="lazy"/></div>' +
          '<div class="anime-row__info">' +
            '<span class="anime-row__title">' + item.title + '</span>' +
            '<span class="anime-row__meta">' + timeAgo(item.viewedAt) + '</span>' +
          '</div>' +
        '</div>'
      );
      list.appendChild(row);
    });
    container.appendChild(list);
  }

  /* ---- Anime card click → open detail (delegated on .screen) -------- */
  /* Catches clicks on ANY element with [data-anime-id]:
     anime cards in home/search/library, hero slides, history rows.
     Elements marked [data-no-nav] (e.g. library remove X, hero dots) are skipped. */
  (function () {
    var screen = document.querySelector(".screen");
    if (!screen) return;
    screen.addEventListener("click", function (e) {
      if (e.target.closest("[data-no-nav]")) return;
      var card = e.target.closest("[data-anime-id]");
      if (!card) return;
      var id = parseInt(card.dataset.animeId, 10);
      if (id) openDetail(id);
    });
  })();

  /* ---- Click-drag-to-scroll (desktop) --------------------------------- */
  (function () {
    var finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer || !device) return;
    var dragViews = Array.prototype.slice.call(device.querySelectorAll(".view, .content, .filter-sheet__body"));
    var dragTargets = [device.querySelector(".screen")].concat(dragViews).filter(Boolean);
    dragTargets.forEach(function (el) {
      var dragging = false, sx = 0, sy = 0, sl = 0, st = 0, moved = false;
      el.addEventListener("mousedown", function (e) {
        if (e.target.closest("button, a, input, select, .fchip, .source-toggle__btn, .bottomnav__item, .filter-sheet, .recent-item")) return;
        if (e.button !== 0) return;
        dragging = true; moved = false; sx = e.clientX; sy = e.clientY; sl = el.scrollLeft; st = el.scrollTop;
        el.style.cursor = "grabbing"; e.preventDefault();
      });
      window.addEventListener("mousemove", function (e) {
        if (!dragging) return;
        var dx = e.clientX - sx, dy = e.clientY - sy;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;
        el.scrollLeft = sl - dx; el.scrollTop = st - dy;
      });
      window.addEventListener("mouseup", function () { if (!dragging) return; dragging = false; el.style.cursor = ""; });
      el.addEventListener("click", function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    });
  })();

  /* ---- Fullscreen API (mobile) --------------------------------------- */
  (function () {
    var fsToggle = document.getElementById("fsToggle");
    var fsExpand = document.getElementById("fsIconExpand");
    var fsShrink = document.getElementById("fsIconShrink");
    if (!fsToggle || !device) return;
    function isFs() { return !!(document.fullscreenElement || document.webkitFullscreenElement); }
    function sync() { var fs = isFs(); if (fsExpand) fsExpand.style.display = fs ? "none" : "block"; if (fsShrink) fsShrink.style.display = fs ? "block" : "none"; }
    fsToggle.addEventListener("click", function () {
      if (isFs()) { (document.exitFullscreen || document.webkitExitFullscreen).call(document); }
      else { var req = device.requestFullscreen || device.webkitRequestFullscreen; if (req) req.call(device); }
    });
    ["fullscreenchange", "webkitfullscreenchange"].forEach(function (ev) { document.addEventListener(ev, sync); });
    sync();
  })();

})();
