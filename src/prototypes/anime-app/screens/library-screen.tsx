"use client";

/**
 * anime-app / screens / library-screen — saved anime with multi-select.
 *
 * localStorage-backed (useLibrary). Status tabs filter the list.
 *
 * Interaction:
 *   - Normal mode: tap a card → opens detail.
 *   - Long-press a card (500ms) → enters selection mode, selects that card.
 *   - Selection mode: tap cards to toggle selection. Bottom action bar
 *     shows: "N selected", Delete, Change Status, Cancel.
 *   - Cancel or back → exits selection mode.
 *
 * Customizable via the LibraryCustomizeSheet (gear button in the topbar):
 *   - Layout: grid | list
 *   - Grid columns: 2–5
 *   - Text placement: below cover | on cover (overlay)
 */
import { useState, useRef, useCallback } from "react";
import { useLibrary } from "../hooks/use-library";
import { useSettings } from "../hooks/use-settings";
import { useCollapsingHeader } from "../hooks/use-collapsing-header";
import { AnimeCard } from "../components/anime-card";
import { LibraryCustomizeSheet } from "../components/library-customize-sheet";
import { fmtScore } from "../lib/anilist";
import type { Anime, LibraryStatus } from "../lib/types";
import styles from "./library-screen.module.css";

interface LibraryScreenProps {
  active: boolean;
  onOpenAnime: (id: number) => void;
}

const TABS: { id: LibraryStatus | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "watching", label: "Watching" },
  { id: "completed", label: "Completed" },
  { id: "plan", label: "Plan to Watch" },
];

const CATEGORY_OPTIONS: { id: LibraryStatus; label: string }[] = [
  { id: "watching", label: "Watching" },
  { id: "completed", label: "Completed" },
  { id: "plan", label: "Plan to Watch" },
];

export function LibraryScreen({ active, onOpenAnime }: LibraryScreenProps) {
  const { settings } = useSettings();
  const { items, remove, setStatus } = useLibrary();
  const [filter, setFilter] = useState<LibraryStatus | "all">("all");
  const [pendingRemove, setPendingRemove] = useState<number[] | null>(null);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const { contentRef, collapsed } = useCollapsingHeader();

  const visible = filter === "all" ? items : items.filter((x) => x.status === filter);

  // Current categories of selected items (for the category menu header).
  const currentCategories = Array.from(
    new Set(
      Array.from(selectedIds)
        .map((id) => items.find((x) => x.id === id))
        .filter((x): x is NonNullable<typeof x> => x != null)
        .map((x) => statusLabel(x.status)),
    ),
  );

  function itemToAnime(id: number): Anime {
    const it = items.find((x) => x.id === id)!;
    return {
      id: it.id,
      title: { romaji: it.title, english: null },
      coverImage: { large: it.cover, extraLarge: it.cover },
      averageScore: it.score,
      format: it.format,
      episodes: it.episodes,
      seasonYear: null,
    };
  }

  const isGrid = settings.libraryLayout === "grid";
  const isOverlay = settings.libraryTextPlacement === "overlay";
  const gridStyle = isGrid
    ? { gridTemplateColumns: `repeat(${settings.libraryColumns}, minmax(0, 1fr))` }
    : undefined;

  // ---- Selection handlers ----
  const toggleSelect = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const exitSelectMode = useCallback(() => {
    setSelectMode(false);
    setSelectedIds(new Set());
    setCategoryMenuOpen(false);
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(visible.map((x) => x.id)));
  }, [visible]);

  const handleDelete = useCallback(() => {
    setPendingRemove(Array.from(selectedIds));
  }, [selectedIds]);

  const confirmDelete = useCallback(() => {
    if (pendingRemove) {
      pendingRemove.forEach((id) => remove(id));
    }
    setPendingRemove(null);
    exitSelectMode();
  }, [pendingRemove, remove, exitSelectMode]);

  const handleSetStatus = useCallback(
    (status: LibraryStatus) => {
      selectedIds.forEach((id) => setStatus(id, status));
      setCategoryMenuOpen(false);
      exitSelectMode();
    },
    [selectedIds, setStatus, exitSelectMode],
  );

  const selectedCount = selectedIds.size;

  return (
    <section
      className={`view ${active ? "view--active" : ""}`}
      data-view="library"
      aria-label="Library"
      aria-hidden={!active}
    >
      <div className={`${styles.topbar} ${collapsed ? styles.topbarIsCollapsed : ""}`}>
        <h1 className={styles.topbarTitle}>
          {selectMode ? `${selectedCount} selected` : "Library"}
        </h1>
        {!selectMode && (
          <button
            type="button"
            className={styles.customizeBtn}
            aria-label="Customize library"
            onClick={() => setCustomizeOpen(true)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        )}
      </div>
      <div ref={contentRef} className={styles.content}>
        {!selectMode && (
          <div className={styles.tabs}>
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`${styles.tab} ${filter === t.id ? styles.tabIsActive : ""}`}
                onClick={() => setFilter(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}

        {selectMode && (
          <div className={styles.selectBar}>
            <button type="button" className={styles.selectBarBtn} onClick={selectAll}>
              Select all
            </button>
            <button type="button" className={styles.selectBarBtn} onClick={() => setSelectedIds(new Set())}>
              Clear
            </button>
          </div>
        )}

        {visible.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <h3 className={styles.emptyStateTitle}>Your library is empty</h3>
            <p className={styles.emptyStateDesc}>
              Browse anime and add them to your library.
            </p>
          </div>
        ) : isGrid ? (
          /* ---- Grid layout ---- */
          <div
            className={`${styles.grid} ${isOverlay ? styles.gridOverlay : ""}`}
            style={gridStyle}
          >
            {visible.map((item, i) => (
              <CardCell
                key={item.id}
                itemId={item.id}
                selectMode={selectMode}
                isSelected={selectedIds.has(item.id)}
                onLongPress={() => {
                  setSelectMode(true);
                  setSelectedIds(new Set([item.id]));
                }}
                onTap={() => {
                  if (selectMode) toggleSelect(item.id);
                  else onOpenAnime(item.id);
                }}
              >
                <AnimeCard
                  anime={itemToAnime(item.id)}
                  index={i}
                  onClick={() => {}}
                  context="library"
                />
              </CardCell>
            ))}
          </div>
        ) : (
          /* ---- List layout ---- */
          <div className={styles.list}>
            {visible.map((item, i) => (
              <CardCell
                key={item.id}
                itemId={item.id}
                selectMode={selectMode}
                isSelected={selectedIds.has(item.id)}
                onLongPress={() => {
                  setSelectMode(true);
                  setSelectedIds(new Set([item.id]));
                }}
                onTap={() => {
                  if (selectMode) toggleSelect(item.id);
                  else onOpenAnime(item.id);
                }}
                layout="list"
                item={item}
                showFormat={settings.libraryShowFormat}
                showEpisodes={settings.libraryShowEpisodes}
              />
            ))}
          </div>
        )}
      </div>

      {/* ---- Bottom action bar (selection mode) — sits on top of bottom nav ---- */}
      {selectMode && (
        <div className={styles.actionBar}>
          <button type="button" className={styles.actionBtn} onClick={exitSelectMode}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            <span>Cancel</span>
          </button>
          <button
            type="button"
            className={styles.actionBtn}
            onClick={() => setCategoryMenuOpen(true)}
            disabled={selectedCount === 0}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
            <span>Category</span>
          </button>
          <button
            type="button"
            className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
            onClick={handleDelete}
            disabled={selectedCount === 0}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
            </svg>
            <span>Delete</span>
          </button>
        </div>
      )}

      {/* ---- Category change menu ---- */}
      {categoryMenuOpen && (
        <div className={styles.categoryMenuScrim} onClick={() => setCategoryMenuOpen(false)}>
          <div className={styles.categoryMenu} onClick={(e) => e.stopPropagation()}>
            {/* Current categories of selected items */}
            <div className={styles.categoryCurrent}>
              <span className={styles.categoryMenuLabel}>Current</span>
              <div className={styles.categoryChips}>
                {currentCategories.length > 0 ? (
                  currentCategories.map((cat) => (
                    <span key={cat} className={styles.categoryChip}>{cat}</span>
                  ))
                ) : (
                  <span className={styles.categoryChipNone}>None</span>
                )}
              </div>
            </div>
            <div className={styles.categoryDivider} />
            <h3 className={styles.categoryMenuTitle}>Move to category</h3>
            <div className={styles.categoryOptions}>
              {CATEGORY_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className={styles.categoryOption}
                  onClick={() => handleSetStatus(opt.id)}
                >
                  <span className={styles.categoryOptionDot} />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Customize sheet */}
      <LibraryCustomizeSheet
        open={customizeOpen}
        onClose={() => setCustomizeOpen(false)}
      />

      {/* Confirm-delete dialog */}
      {pendingRemove && (
        <div
          className="confirm-dialog is-visible"
          role="dialog"
          aria-modal="true"
          aria-label="Confirm removal"
        >
          <div className="confirm-dialog__card">
            <h3 className="confirm-dialog__title">
              Remove {pendingRemove.length} {pendingRemove.length === 1 ? "anime" : "anime"}?
            </h3>
            <p className="confirm-dialog__desc">
              These will be removed from your library.
            </p>
            <div className="confirm-dialog__actions">
              <button
                type="button"
                className="btn-outlined"
                onClick={() => setPendingRemove(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-filled"
                style={{ background: "var(--color-error)" }}
                onClick={confirmDelete}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------
// CardCell — wraps a card with long-press + selection state
// ---------------------------------------------------------------------------

interface CardCellProps {
  itemId: number;
  selectMode: boolean;
  isSelected: boolean;
  onLongPress: () => void;
  onTap: () => void;
  children?: React.ReactNode;
  layout?: "grid" | "list";
  item?: { title: string; cover: string; score: number | null; format: string | null; episodes: number | null; status: LibraryStatus };
  showFormat?: boolean;
  showEpisodes?: boolean;
}

function CardCell({
  itemId,
  selectMode,
  isSelected,
  onLongPress,
  onTap,
  children,
  layout = "grid",
  item,
  showFormat = true,
  showEpisodes = true,
}: CardCellProps) {
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressFired = useRef(false);

  const startLongPress = () => {
    longPressFired.current = false;
    longPressTimer.current = setTimeout(() => {
      longPressFired.current = true;
      onLongPress();
    }, 500);
  };

  const cancelLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleTap = () => {
    // If long-press just fired, don't also trigger a tap
    if (longPressFired.current) {
      longPressFired.current = false;
      return;
    }
    onTap();
  };

  if (layout === "list" && item) {
    return (
      <div
        className={`${styles.listRow} ${isSelected ? styles.listRowSelected : ""}`}
        style={{ animationDelay: "0ms" }}
        onPointerDown={startLongPress}
        onPointerUp={() => { cancelLongPress(); handleTap(); }}
        onPointerLeave={cancelLongPress}
        onPointerCancel={cancelLongPress}
      >
        <div className={styles.listItem}>
          <div className={styles.listCover}>
            <img src={item.cover} alt="" loading="lazy" />
            {selectMode && (
              <div className={`${styles.checkCircle} ${isSelected ? styles.checkCircleOn : ""}`}>
                {isSelected && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
            )}
          </div>
          <div className={styles.listInfo}>
            <h3 className={styles.listTitle}>{item.title}</h3>
            <div className={styles.listMeta}>
              {showFormat && item.format && <span>{item.format}</span>}
              {showEpisodes && item.episodes != null && <span>{item.episodes} ep</span>}
              {item.score != null && (
                <span className={styles.listScore}>★ {fmtScore(item.score)}</span>
              )}
            </div>
            <span className={styles.listStatus}>{statusLabel(item.status)}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${styles.cardWrap} ${isSelected ? styles.cardWrapSelected : ""}`}
      onPointerDown={startLongPress}
      onPointerUp={() => { cancelLongPress(); handleTap(); }}
      onPointerLeave={cancelLongPress}
      onPointerCancel={cancelLongPress}
    >
      {children}
      {selectMode && (
        <div className={`${styles.checkCircle} ${styles.checkCircleGrid} ${isSelected ? styles.checkCircleOn : ""}`}>
          {isSelected && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>
      )}
    </div>
  );
}

function statusLabel(s: LibraryStatus): string {
  if (s === "watching") return "Watching";
  if (s === "completed") return "Completed";
  return "Plan to Watch";
}
