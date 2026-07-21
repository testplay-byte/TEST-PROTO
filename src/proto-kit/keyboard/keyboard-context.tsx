"use client";

/**
 * proto-kit / keyboard / keyboard-context — global on-screen keyboard state.
 *
 * Provides:
 *   - `KeyboardProvider` — wraps the app, holds the active input target.
 *   - `useKeyboard()` — for the <Keyboard> component to read state + press keys.
 *   - `useKeyboardInput({ value, onChange, onEnter })` — for inputs to register
 *     with the keyboard. Returns props to spread on the <input>.
 *
 * The keyboard replaces the native soft keyboard. Inputs use `inputMode="none"`
 * to prevent the native keyboard from appearing on mobile. The custom keyboard
 * writes to the input's value via the `onChange` callback.
 *
 * Key presses use `onMouseDown` + `preventDefault` so the input doesn't blur
 * when tapping a key (the keyboard stays active while typing).
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode, FocusEvent } from "react";

export interface KeyboardTarget {
  /** Current value of the input. */
  value: string;
  /** Called when a key is pressed — updates the input's value. */
  onChange: (value: string) => void;
  /** Called when Enter is pressed (optional). */
  onEnter?: () => void;
  /** Placeholder for the keyboard's "enter" key label (e.g. "Search"). */
  enterLabel?: string;
}

interface KeyboardContextValue {
  /** The active input target, or null if the keyboard is hidden. */
  target: KeyboardTarget | null;
  /** Activate the keyboard for an input. Called on input focus. */
  activate: (target: KeyboardTarget) => void;
  /** Deactivate (hide) the keyboard. Called on input blur / close. */
  deactivate: () => void;
  /** Press a key (letter, number, space, etc.). */
  press: (key: string) => void;
  /** Delete the last character. */
  backspace: () => void;
  /** Press enter. */
  enter: () => void;
}

const KeyboardContext = createContext<KeyboardContextValue | null>(null);

export interface KeyboardProviderProps {
  children: ReactNode;
}

export function KeyboardProvider({ children }: KeyboardProviderProps) {
  const [target, setTarget] = useState<KeyboardTarget | null>(null);
  // Ref that always holds the latest value — avoids stale state when
  // rapid key presses fire before React re-renders.
  const valueRef = useRef("");

  const activate = useCallback((t: KeyboardTarget) => {
    valueRef.current = t.value;
    setTarget(t);
  }, []);

  const deactivate = useCallback(() => setTarget(null), []);

  const press = useCallback((key: string) => {
    setTarget((prev) => {
      if (!prev) return prev;
      const next = valueRef.current + key;
      valueRef.current = next;
      prev.onChange(next);
      return prev;
    });
  }, []);

  const backspace = useCallback(() => {
    setTarget((prev) => {
      if (!prev) return prev;
      const next = valueRef.current.slice(0, -1);
      valueRef.current = next;
      prev.onChange(next);
      return prev;
    });
  }, []);

  const enter = useCallback(() => {
    setTarget((prev) => {
      prev?.onEnter?.();
      return prev;
    });
  }, []);

  const value = useMemo<KeyboardContextValue>(
    () => ({ target, activate, deactivate, press, backspace, enter }),
    [target, activate, deactivate, press, backspace, enter],
  );

  return (
    <KeyboardContext.Provider value={value}>
      {children}
    </KeyboardContext.Provider>
  );
}

export function useKeyboard(): KeyboardContextValue {
  const ctx = useContext(KeyboardContext);
  if (!ctx) {
    throw new Error("useKeyboard must be used within <KeyboardProvider>");
  }
  return ctx;
}

/**
 * useKeyboardInput — hook for inputs that should use the custom keyboard.
 *
 * Returns props to spread on the <input>:
 *   - `inputMode: "none"` — prevents the native soft keyboard on mobile.
 *   - `onFocus` — activates the custom keyboard with the current value/onChange.
 *   - `onClick` — also activates (backup for mobile where focus alone may not fire).
 *   - `onBlur` — deactivates after a short delay (so key clicks register first).
 *
 * Usage:
 * ```tsx
 * const kb = useKeyboardInput({ value: query, onChange: setQuery, onEnter: doSearch, enterLabel: "Search" });
 * <input {...kb} placeholder="Search..." />
 * ```
 */
export function useKeyboardInput(options: KeyboardTarget): {
  inputMode: "none";
  onFocus: (e: FocusEvent<HTMLInputElement>) => void;
  onClick: (e: React.MouseEvent<HTMLInputElement>) => void;
  onBlur: (e: FocusEvent<HTMLInputElement>) => void;
} {
  const { activate, deactivate } = useKeyboard();

  const activateHandler = () => {
    activate({
      value: options.value,
      onChange: options.onChange,
      onEnter: options.onEnter,
      enterLabel: options.enterLabel,
    });
  };

  return {
    inputMode: "none",
    onFocus: activateHandler,
    onClick: activateHandler,
    onBlur: () => {
      // Delay deactivation so keyboard key clicks (mousedown) register
      // before the blur fires. 200ms is enough for a tap.
      setTimeout(() => deactivate(), 200);
    },
  };
}
