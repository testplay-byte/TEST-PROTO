"use client";

/**
 * anime-app / components / filter-sheet — bottom-sheet filter UI.
 *
 *  - Accordion: 5 expandable sections (Genres, Release, Type, Min score,
 *    Sort by). Only one section open at a time.
 *  - Flat: tab row + single content panel showing the selected category.
 *
 *  Clear all → resets every filter (and the sort to the source default,
 *  driven by the parent). Apply → closes the sheet.
 *
 *  The scrim + sheet's transform-open animation are owned by this module.
 */
import { useState } from "react";
import type { FilterState, FilterViewMode, SortOption } from "../lib/types";
import {
  GENRES,
  SORT_LABELS,
  SORT_OPTIONS,
  SEASONS,
  FORMATS,
  STATUSES,
  FLAT_CATEGORIES,
  getYearOptions,
} from "../lib/filters";
import styles from "./filter-sheet.module.css";

interface FilterSheetProps {
  open: boolean;
  filters: FilterState;
  sort: SortOption;
  onFilterChange: (patch: Partial<FilterState>) => void;
  onSortChange: (s: SortOption) => void;
  onClearAll: () => void;
  onApply: () => void;
}

export function FilterSheet({
  open,
  filters,
  sort,
  onFilterChange,
  onSortChange,
  onClearAll,
  onApply,
}: FilterSheetProps) {
  const [viewMode, setViewMode] = useState<FilterViewMode>("accordion");
  const [openAccordionId, setOpenAccordionId] = useState<string | null>(null);
  const [flatCategory, setFlatCategory] = useState<string>("genre");

  const years = getYearOptions();

  function toggleGenre(g: string) {
    const next = filters.genres.includes(g)
      ? filters.genres.filter((x) => x !== g)
      : [...filters.genres, g];
    onFilterChange({ genres: next });
  }

  function toggleAccordion(id: string) {
    setOpenAccordionId((cur) => (cur === id ? null : id));
  }

  function setViewModeAndReset(mode: FilterViewMode) {
    setViewMode(mode);
    setOpenAccordionId(null);
  }

  return (
    <>
      <div
        className={`${styles.scrim} ${open ? styles.scrimIsVisible : ""}`}
        onClick={onApply}
        aria-hidden={!open}
      />
      <div
        className={`${styles.sheet} ${open ? styles.sheetIsOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
      >
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h2 className={styles.title}>Filters</h2>
          </div>
          <div className={styles.viewToggle}>
            <button
              type="button"
              className={`${styles.viewToggleBtn} ${viewMode === "accordion" ? styles.viewToggleBtnIsActive : ""}`}
              onClick={() => setViewModeAndReset("accordion")}
              aria-label="Accordion view"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="4" width="18" height="6" rx="2" />
                <rect x="3" y="14" width="18" height="6" rx="2" />
              </svg>
            </button>
            <button
              type="button"
              className={`${styles.viewToggleBtn} ${viewMode === "flat" ? styles.viewToggleBtnIsActive : ""}`}
              onClick={() => setViewModeAndReset("flat")}
              aria-label="Flat view"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="8" height="8" rx="1" />
                <rect x="13" y="3" width="8" height="8" rx="1" />
                <rect x="3" y="13" width="8" height="8" rx="1" />
                <rect x="13" y="13" width="8" height="8" rx="1" />
              </svg>
            </button>
          </div>
        </div>

        <div className={styles.body}>
          {viewMode === "accordion" ? (
            <>
              {/* 1. Genres */}
              <Accordion
                id="genre"
                label="Genres"
                count={filters.genres.length}
                isOpen={openAccordionId === "genre"}
                onToggle={toggleAccordion}
                icon={
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />
                  </svg>
                }
              >
                <div className={styles.chipsWrap}>
                  {GENRES.map((g) => (
                    <FilterChip
                      key={g}
                      active={filters.genres.includes(g)}
                      onClick={() => toggleGenre(g)}
                    >
                      {g}
                    </FilterChip>
                  ))}
                </div>
              </Accordion>

              {/* 2. Release */}
              <Accordion
                id="release"
                label="Release"
                count={(filters.year ? 1 : 0) + (filters.season ? 1 : 0)}
                isOpen={openAccordionId === "release"}
                onToggle={toggleAccordion}
                icon={
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                }
              >
                <div className={styles.selectRow}>
                  <select
                    className={styles.select}
                    value={filters.year}
                    onChange={(e) => onFilterChange({ year: e.target.value })}
                  >
                    <option value="">Year: Any</option>
                    {years.map((y) => (
                      <option key={y} value={String(y)}>
                        {y}
                      </option>
                    ))}
                  </select>
                  <select
                    className={styles.select}
                    value={filters.season}
                    onChange={(e) => onFilterChange({ season: e.target.value })}
                  >
                    <option value="">Season: Any</option>
                    {SEASONS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </Accordion>

              {/* 3. Type */}
              <Accordion
                id="type"
                label="Type"
                count={(filters.format ? 1 : 0) + (filters.status ? 1 : 0)}
                isOpen={openAccordionId === "type"}
                onToggle={toggleAccordion}
                icon={
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                }
              >
                <div className={styles.selectRow}>
                  <select
                    className={styles.select}
                    value={filters.format}
                    onChange={(e) => onFilterChange({ format: e.target.value })}
                  >
                    <option value="">Format: Any</option>
                    {FORMATS.map((f) => (
                      <option key={f.value} value={f.value}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                  <select
                    className={styles.select}
                    value={filters.status}
                    onChange={(e) => onFilterChange({ status: e.target.value })}
                  >
                    <option value="">Status: Any</option>
                    {STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </Accordion>

              {/* 4. Minimum score */}
              <Accordion
                id="score"
                label="Minimum score"
                count={filters.minScore > 0 ? 1 : 0}
                isOpen={openAccordionId === "score"}
                onToggle={toggleAccordion}
                icon={
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                }
              >
                <ScoreSlider
                  value={filters.minScore}
                  onChange={(v) => onFilterChange({ minScore: v })}
                />
              </Accordion>

              {/* 5. Sort by */}
              <Accordion
                id="sort"
                label="Sort by"
                count={0}
                isOpen={openAccordionId === "sort"}
                onToggle={toggleAccordion}
                icon={
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 6h18M7 12h10M10 18h4" />
                  </svg>
                }
              >
                <div className={styles.chipsWrap}>
                  {SORT_OPTIONS.map((key) => (
                    <FilterChip
                      key={key}
                      active={sort === key}
                      onClick={() => onSortChange(key)}
                    >
                      {SORT_LABELS[key]}
                    </FilterChip>
                  ))}
                </div>
              </Accordion>
            </>
          ) : (
            <FlatView
              filters={filters}
              sort={sort}
              onFilterChange={onFilterChange}
              onSortChange={onSortChange}
              activeCategory={flatCategory}
              onCategoryChange={setFlatCategory}
            />
          )}
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.btnOutlined}
            onClick={onClearAll}
          >
            Clear all
          </button>
          <button
            type="button"
            className={styles.btnFilled}
            onClick={onApply}
          >
            Apply filters
          </button>
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Accordion section
// ---------------------------------------------------------------------------

interface AccordionProps {
  id: string;
  label: string;
  count: number;
  isOpen: boolean;
  onToggle: (id: string) => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function Accordion({
  id,
  label,
  count,
  isOpen,
  onToggle,
  icon,
  children,
}: AccordionProps) {
  return (
    <div className={styles.facc}>
      <button
        type="button"
        className={`${styles.faccBtn} ${isOpen ? styles.faccBtnIsActive : ""}`}
        onClick={() => onToggle(id)}
        aria-expanded={isOpen}
      >
        <span className={styles.faccBtnLeft}>
          <span className={styles.faccBtnIcon}>{icon}</span>
          <span className={styles.faccBtnLabel}>{label}</span>
        </span>
        {count > 0 && (
          <span className={styles.faccBtnCount}>{count}</span>
        )}
        <svg
          className={styles.faccChevron}
          width="18"
          height="18"
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
      <div
        className={`${styles.faccContent} ${isOpen ? styles.faccContentIsOpen : ""}`}
      >
        <div className={styles.faccContentInner}>{children}</div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Filter chip
// ---------------------------------------------------------------------------

interface FilterChipProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function FilterChip({ active, onClick, children }: FilterChipProps) {
  return (
    <button
      type="button"
      className={`${styles.fchip} ${active ? styles.fchipIsActive : ""}`}
      onClick={onClick}
    >
      <svg
        className={styles.fchipCheck}
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
      <span>{children}</span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Score slider
// ---------------------------------------------------------------------------

interface ScoreSliderProps {
  value: number;
  onChange: (v: number) => void;
}

function ScoreSlider({ value, onChange }: ScoreSliderProps) {
  return (
    <div className={styles.scoreSliderWrap}>
      <div className={styles.scoreSliderRow}>
        <input
          type="range"
          className={styles.scoreSlider}
          min={0}
          max={100}
          value={value}
          step={5}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
        />
        <span className={styles.scoreValue}>
          {value > 0 ? `${(value / 10).toFixed(1)}+` : "Any"}
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Flat view (tab row + content)
// ---------------------------------------------------------------------------

interface FlatViewProps {
  filters: FilterState;
  sort: SortOption;
  onFilterChange: (patch: Partial<FilterState>) => void;
  onSortChange: (s: SortOption) => void;
  activeCategory: string;
  onCategoryChange: (id: string) => void;
}

function FlatView({
  filters,
  sort,
  onFilterChange,
  onSortChange,
  activeCategory,
  onCategoryChange,
}: FlatViewProps) {
  const years = getYearOptions();

  function toggleGenre(g: string) {
    const next = filters.genres.includes(g)
      ? filters.genres.filter((x) => x !== g)
      : [...filters.genres, g];
    onFilterChange({ genres: next });
  }

  return (
    <>
      <div className={styles.flatTabs}>
        {FLAT_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`${styles.flatTab} ${activeCategory === cat.id ? styles.flatTabIsActive : ""}`}
            onClick={() => onCategoryChange(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>
      <div className={styles.flatContent}>
        {activeCategory === "genre" && (
          <div className={styles.chipsWrap}>
            {GENRES.map((g) => (
              <FilterChip
                key={g}
                active={filters.genres.includes(g)}
                onClick={() => toggleGenre(g)}
              >
                {g}
              </FilterChip>
            ))}
          </div>
        )}

        {activeCategory === "release" && (
          <div className={styles.selectRow}>
            <select
              className={styles.select}
              value={filters.year}
              onChange={(e) => onFilterChange({ year: e.target.value })}
            >
              <option value="">Year: Any</option>
              {years.map((y) => (
                <option key={y} value={String(y)}>
                  {y}
                </option>
              ))}
            </select>
            <select
              className={styles.select}
              value={filters.season}
              onChange={(e) => onFilterChange({ season: e.target.value })}
            >
              <option value="">Season: Any</option>
              {SEASONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {activeCategory === "type" && (
          <div className={styles.selectRow}>
            <select
              className={styles.select}
              value={filters.format}
              onChange={(e) => onFilterChange({ format: e.target.value })}
            >
              <option value="">Format: Any</option>
              {FORMATS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
            <select
              className={styles.select}
              value={filters.status}
              onChange={(e) => onFilterChange({ status: e.target.value })}
            >
              <option value="">Status: Any</option>
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {activeCategory === "score" && (
          <ScoreSlider
            value={filters.minScore}
            onChange={(v) => onFilterChange({ minScore: v })}
          />
        )}

        {activeCategory === "sort" && (
          <div className={styles.chipsWrap}>
            {SORT_OPTIONS.map((key) => (
              <FilterChip
                key={key}
                active={sort === key}
                onClick={() => onSortChange(key)}
              >
                {SORT_LABELS[key]}
              </FilterChip>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
