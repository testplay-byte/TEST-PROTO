"use client";

/**
 * anime-app / screens / search-screen — full AniList search view.
 *
 * Wires together:
 *   - collapsing topbar (title + SourceToggle + SearchBar)
 *   - active filter chips row
 *   - Filters button + Sort dropdown quick row
 *   - content area: RecentSearches (when no query/filters) + results grid
 *   - FilterSheet bottom sheet
 *
 * State (query, filters, sort, source, sheet open, sort dropdown open,
 * topbar collapsed) lives here; child components are presentational.
 *
 * Same UI as search-page's search screen; the only difference is that
 * clicking a card calls onOpenAnime(id) (the page-level detail push)
 * instead of being a no-op.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { SourceToggle } from "../components/source-toggle";
import { SearchBar } from "../components/search-bar";
import { AnimeCard } from "../components/anime-card";
import { RecentSearches } from "../components/recent-searches";
import { FilterSheet } from "../components/filter-sheet";
import { SortDropdown } from "../components/sort-dropdown";
import { useAniListSearch, useRecentSearches } from "../hooks/use-anilist";
import { useSettings } from "../hooks/use-settings";
import {
  SOURCE_DEFAULTS,
  SORT_LABELS,
  countActiveFilters,
  formatLabel,
  seasonLabel,
  statusLabel,
} from "../lib/filters";
import type { FilterState, SortOption, Source } from "../lib/types";
import { EMPTY_FILTERS } from "../lib/types";
import styles from "./search-screen.module.css";

interface SearchScreenProps {
  active: boolean;
  onOpenAnime: (id: number) => void;
}

export function SearchScreen({ active, onOpenAnime }: SearchScreenProps) {
  const { settings } = useSettings();
  const [source, setSource] = useState<Source>("anilist");
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [sort, setSort] = useState<SortOption>(SOURCE_DEFAULTS.anilist.sort);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const { recents, add, remove, clear } = useRecentSearches();
  const { media, loading, error } = useAniListSearch({
    query,
    source,
    sort,
    ...filters,
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Add to recents 500ms after the user stops typing.
  useEffect(() => {
    if (!query) return;
    const t = setTimeout(() => add(query), 500);
    return () => clearTimeout(t);
  }, [query, add]);

  // Collapse the topbar when the content area is scrolled past 20px.
  function handleScroll(e: React.UIEvent<HTMLDivElement>) {
    const st = e.currentTarget.scrollTop;
    if (st > 20 && !collapsed) setCollapsed(true);
    else if (st <= 20 && collapsed) setCollapsed(false);
  }

  // Close the sort dropdown on any outside click.
  useEffect(() => {
    if (!sortOpen) return;
    function onDocClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest(`.${styles.sortWrap}`)) setSortOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [sortOpen]);

  function handleSourceChange(s: Source) {
    if (s === source) return;
    setSource(s);
    setSort(SOURCE_DEFAULTS[s].sort);
  }

  function handleQueryChange(v: string) {
    setQuery(v.trim());
  }

  function handleClearQuery() {
    setQuery("");
    inputRef.current?.focus();
  }

  function handleFilterChange(patch: Partial<FilterState>) {
    setFilters((prev) => ({ ...prev, ...patch }));
  }

  function handleSortChange(s: SortOption) {
    setSort(s);
    setSortOpen(false);
  }

  function handleClearAll() {
    setFilters(EMPTY_FILTERS);
    setSort(SOURCE_DEFAULTS[source].sort);
  }

  function handlePickRecent(q: string) {
    setQuery(q);
    add(q);
  }

  const activeCount = countActiveFilters(filters);
  const hasChips = activeCount > 0;

  // Build the active-filter chips array.
  const chips = useMemo(() => {
    const out: { label: string; onRemove: () => void }[] = [];
    filters.genres.forEach((g) =>
      out.push({
        label: g,
        onRemove: () =>
          handleFilterChange({
            genres: filters.genres.filter((x) => x !== g),
          }),
      }),
    );
    if (filters.year)
      out.push({
        label: filters.year,
        onRemove: () => handleFilterChange({ year: "" }),
      });
    if (filters.season)
      out.push({
        label: seasonLabel(filters.season),
        onRemove: () => handleFilterChange({ season: "" }),
      });
    if (filters.format)
      out.push({
        label: formatLabel(filters.format),
        onRemove: () => handleFilterChange({ format: "" }),
      });
    if (filters.status)
      out.push({
        label: statusLabel(filters.status),
        onRemove: () => handleFilterChange({ status: "" }),
      });
    if (filters.minScore > 0)
      out.push({
        label: `★ ${(filters.minScore / 10).toFixed(1)}+`,
        onRemove: () => handleFilterChange({ minScore: 0 }),
      });
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // Result header label.
  const resultsLabel = (() => {
    if (query) return `Results for "${query}"`;
    if (activeCount > 0) return "Filtered results";
    return SOURCE_DEFAULTS[source].label;
  })();
  const resultsLabelSuffix = source === "extension" ? " · Extension" : "";
  const showRecent = !query && activeCount === 0 && recents.length > 0;

  const densityClass =
    settings.cardDensity === "compact"
      ? "results-grid--compact"
      : settings.cardDensity === "comfortable"
        ? "results-grid--comfortable"
        : "";

  return (
    <section
      className={`view ${active ? "view--active" : ""}`}
      data-view="search"
      aria-label="Search"
      aria-hidden={!active}
    >
      {/* Top bar — collapses on scroll */}
      <div
        className={`${styles.topbar} ${collapsed ? styles.topbarIsCollapsed : ""}`}
      >
        <div className={styles.topbarRow}>
          <h1 className={styles.topbarTitle}>Search</h1>
          <SourceToggle source={source} onChange={handleSourceChange} />
          <SearchBar
            value={query}
            onChange={handleQueryChange}
            onClear={handleClearQuery}
            inputRef={inputRef}
          />
        </div>
      </div>

      {/* Active filter chips */}
      <div
        className={`${styles.activeFilters} ${hasChips ? styles.activeFiltersHasChips : ""}`}
      >
        {chips.map((chip, i) => (
          <button
            key={`${chip.label}-${i}`}
            type="button"
            className={styles.activeFilterChip}
            onClick={chip.onRemove}
          >
            <span>{chip.label}</span>
            <span className={styles.activeFilterChipX}>
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </span>
          </button>
        ))}
      </div>

      {/* Quick row: Filters + Sort (slides out when topbar collapses) */}
      <div
        className={`${styles.quickRow} ${collapsed ? styles.quickRowIsCollapsed : ""}`}
      >
        <button
          type="button"
          className={`${styles.filterBtn} ${activeCount > 0 ? styles.filterBtnIsActive : ""}`}
          onClick={() => setSheetOpen(true)}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="7" y1="12" x2="17" y2="12" />
            <line x1="10" y1="18" x2="14" y2="18" />
          </svg>
          <span>Filters</span>
          {activeCount > 0 && (
            <span className={styles.filterBadge}>{activeCount}</span>
          )}
        </button>
        <div className={styles.spacer} />
        <div className={styles.sortWrap}>
          <button
            type="button"
            className={`${styles.sortBtn} ${sortOpen ? styles.sortBtnIsOpen : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              setSortOpen((v) => !v);
            }}
          >
            <span>{SORT_LABELS[sort]}</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          {sortOpen && (
            <SortDropdown value={sort} onSelect={handleSortChange} />
          )}
        </div>
      </div>

      {/* Content — scrollable, owns the collapse trigger */}
      <div
        ref={contentRef}
        className={`${styles.content} ${collapsed ? styles.contentIsCollapsed : ""}`}
        onScroll={handleScroll}
      >
        {showRecent && (
          <RecentSearches
            recents={recents}
            onPick={handlePickRecent}
            onRemove={remove}
            onClear={clear}
          />
        )}

        <div className={styles.resultsTray}>
          <div className={styles.contentHeader}>
            <span className={styles.contentLabel}>
              {resultsLabel}
              {resultsLabelSuffix}
            </span>
            <span className={styles.contentCount}>
              {!loading && !error && media.length > 0
                ? `${media.length} found`
                : ""}
            </span>
          </div>

          {loading && <SkeletonGrid density={densityClass} />}

          {!loading && error && (
            <EmptyState title="Search error" desc={error} />
          )}

          {!loading && !error && media.length === 0 && (
            <EmptyState
              title="No results found"
              desc="Try different keywords or adjust your filters."
            />
          )}

          {!loading && !error && media.length > 0 && (
            <div className={`${styles.resultsGrid} results-grid ${densityClass}`}>
              {media.map((a, i) => (
                <AnimeCard
                  key={a.id}
                  anime={a}
                  index={i}
                  onClick={onOpenAnime}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filter bottom sheet */}
      <FilterSheet
        open={sheetOpen}
        filters={filters}
        sort={sort}
        onFilterChange={handleFilterChange}
        onSortChange={setSort}
        onClearAll={handleClearAll}
        onApply={() => setSheetOpen(false)}
      />
    </section>
  );
}

// ---------------------------------------------------------------------------
// Skeleton loading grid (12 placeholders while fetching).
// ---------------------------------------------------------------------------

function SkeletonGrid({ density }: { density: string }) {
  return (
    <div
      className={`${styles.resultsGrid} results-grid ${density}`}
      aria-hidden="true"
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className={styles.skeleton}
          style={{ aspectRatio: "2 / 3" }}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Empty state (no results / error).
// ---------------------------------------------------------------------------

function EmptyState({ title, desc }: { title: string; desc: string }) {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyStateIcon}>
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </div>
      <h3 className={styles.emptyStateTitle}>{title}</h3>
      <p className={styles.emptyStateDesc}>{desc}</p>
    </div>
  );
}
