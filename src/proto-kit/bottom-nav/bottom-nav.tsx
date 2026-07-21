"use client";

import type { ReactNode } from "react";
import styles from "./bottom-nav.module.css";

export interface NavItem {
  /** Unique key, also used for the hash route (e.g. "home", "search"). */
  id: string;
  /** Full label — always shown on the active item, never truncated. */
  label: string;
  /** SVG icon node (22x22, stroke=currentColor). */
  icon: ReactNode;
}

export interface BottomNavProps {
  items: NavItem[];
  /** The id of the active item. */
  activeId: string;
  /** Called when an item is clicked. */
  onSelect: (id: string) => void;
}

/**
 * BottomNav — floating pill navigation.
 *
 * - Active item: content-sized expanding pill, full label always visible.
 * - Inactive items: icon-only, share remaining space evenly.
 * - Slim 42px pill height, 58px bar height.
 *
 * The parent owns the active state + routing; BottomNav is presentational.
 */
export function BottomNav({ items, activeId, onSelect }: BottomNavProps) {
  return (
    <nav className={styles.bottomnav} aria-label="Primary">
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <button
            key={item.id}
            className={`${styles.item} ${isActive ? styles.itemIsActive : ""}`}
            onClick={() => onSelect(item.id)}
            aria-current={isActive ? "page" : undefined}
          >
            <span
              className={`${styles.icon} ${isActive ? styles.iconActive : ""}`}
            >
              {item.icon}
            </span>
            <span
              className={`${styles.label} ${isActive ? "" : styles.labelHidden}`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
