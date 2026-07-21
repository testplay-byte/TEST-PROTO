"use client";

/**
 * anime-app / components / sort-dropdown — floating sort-option menu.
 *
 * Positioning + open animation are owned by this module; the dropdown is
 * anchored above the sort button via `bottom: calc(100% + 8px); right: 0`.
 */
import type { SortOption } from "../lib/types";
import { SORT_LABELS, SORT_OPTIONS } from "../lib/filters";
import styles from "./sort-dropdown.module.css";

interface SortDropdownProps {
  value: SortOption;
  onSelect: (s: SortOption) => void;
}

export function SortDropdown({ value, onSelect }: SortDropdownProps) {
  return (
    <div className={styles.dropdown} role="menu">
      {SORT_OPTIONS.map((key) => (
        <button
          key={key}
          type="button"
          className={`${styles.item} ${value === key ? styles.itemIsActive : ""}`}
          onClick={() => onSelect(key)}
          role="menuitem"
        >
          <span>{SORT_LABELS[key]}</span>
          {value === key && (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </button>
      ))}
    </div>
  );
}
