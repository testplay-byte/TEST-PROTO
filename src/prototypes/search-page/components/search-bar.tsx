"use client";

/**
 * SearchBar — pill input with magnifier icon + clear button.
 *
 * Collapsed-state animations (height shrink, font shrink on scroll) are
 * owned by the parent search-screen module via a :global selector on the
 * stable `.searchbar` class — so this component applies both its module
 * class and the plain `searchbar` class.
 */
import styles from "./search-bar.module.css";

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  onClear: () => void;
  inputRef?: React.Ref<HTMLInputElement>;
}

export function SearchBar({ value, onChange, onClear, inputRef }: SearchBarProps) {
  return (
    <div className={`${styles.searchbar} searchbar`}>
      <span className={styles.icon} aria-hidden="true">
        <svg
          width="22"
          height="22"
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
      </span>
      <input
        ref={inputRef}
        type="text"
        className={`${styles.input} searchbar__input`}
        placeholder="Search anime by title..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          type="button"
          className={styles.clear}
          onClick={onClear}
          aria-label="Clear"
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
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}
