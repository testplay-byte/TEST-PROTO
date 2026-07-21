"use client";

/**
 * anime-app / components / recent-searches — collapsible recent-search list.
 *
 * Behaviour (1:1 port of script.js):
 *   - Shows only when there is no query AND no active filters.
 *   - Visible items: 3 by default, with a "Show N more" expander.
 *   - The whole list can be collapsed via the chevron toggle next to the
 *     title; when collapsed the toggle is hidden and a "Show" button
 *     appears on the far right of the header.
 *   - Picking an item triggers a search; the X button removes it.
 *   - "Clear all" wipes the list (and localStorage).
 */
import { useState } from "react";
import styles from "./recent-searches.module.css";

const RECENT_VISIBLE = 3;

interface RecentSearchesProps {
  recents: string[];
  onPick: (q: string) => void;
  onRemove: (q: string) => void;
  onClear: () => void;
}

export function RecentSearches({
  recents,
  onPick,
  onRemove,
  onClear,
}: RecentSearchesProps) {
  const [expanded, setExpanded] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  if (recents.length === 0) return null;

  const visibleCount = expanded
    ? recents.length
    : Math.min(RECENT_VISIBLE, recents.length);
  const visible = recents.slice(0, visibleCount);
  const hiddenCount = recents.length - RECENT_VISIBLE;

  return (
    <div className={styles.section}>
      <div className={styles.head}>
        <div className={styles.headLeft}>
          <span className={styles.title}>Recent searches</span>
          {!collapsed && (
            <button
              type="button"
              className={styles.toggle}
              onClick={() => setCollapsed(true)}
              aria-label="Collapse recent searches"
            >
              <span className={styles.toggleIcon}>
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
              </span>
            </button>
          )}
        </div>
        <div className={styles.headRight}>
          {collapsed ? (
            <button
              type="button"
              className={styles.show}
              onClick={() => setCollapsed(false)}
            >
              Show
              <svg
                width="12"
                height="12"
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
          ) : (
            <button type="button" className={styles.clear} onClick={onClear}>
              Clear all
            </button>
          )}
        </div>
      </div>

      <div
        className={`${styles.list} ${collapsed ? styles.listIsCollapsed : ""}`}
      >
        {visible.map((q) => (
          <div
            key={q}
            className={styles.item}
            onClick={() => onPick(q)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onPick(q);
              }
            }}
          >
            <span className={styles.itemIcon} aria-hidden="true">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </span>
            <span className={styles.itemText}>{q}</span>
            <button
              type="button"
              className={styles.itemRemove}
              aria-label="Remove"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(q);
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        ))}

        {recents.length > RECENT_VISIBLE && (
          <div
            className={`${styles.more} ${expanded ? styles.moreIsExpanded : ""}`}
            onClick={() => setExpanded((v) => !v)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setExpanded((v) => !v);
              }
            }}
          >
            <span>
              {expanded ? "Show less" : `Show ${hiddenCount} more`}
            </span>
            <span className={styles.moreIcon}>
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
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
