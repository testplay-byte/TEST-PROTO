"use client";

/**
 * anime-app / components / search-bar — pill input with magnifier + clear.
 *
 * Uses the proto-kit custom keyboard (useKeyboardInput) instead of the native
 * soft keyboard. `inputMode="none"` prevents the native keyboard on mobile;
 * the custom keyboard writes to the value via the onChange callback.
 *
 * Collapsed-state animations (height shrink, font shrink on scroll) are
 * owned by the parent search-screen module via a :global selector on the
 * stable `.searchbar` class — so this component applies both its module
 * class and the plain `searchbar` class.
 */
import { useKeyboardInput } from "../../../proto-kit";
import styles from "./search-bar.module.css";

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  onClear: () => void;
  onEnter?: () => void;
  inputRef?: React.Ref<HTMLInputElement>;
}

export function SearchBar({ value, onChange, onClear, onEnter, inputRef }: SearchBarProps) {
  const kb = useKeyboardInput({
    value,
    onChange,
    onEnter,
    enterLabel: "Search",
  });

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
        {...kb}
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
