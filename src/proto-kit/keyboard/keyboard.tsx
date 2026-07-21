"use client";

/**
 * proto-kit / keyboard — on-screen QWERTY keyboard.
 *
 * Replaces the native soft keyboard. Slides up from the bottom of the device
 * when an input is focused. 5-row layout:
 *   1. Numbers (1-0)
 *   2. QWERTYUIOP
 *   3. ASDFGHJKL
 *   4. Shift + ZXCVBNM + Backspace
 *   5. Space (wide) + Enter (right side)
 *
 * No dismiss bar — the user dismisses by tapping anywhere outside the input.
 * No emoji — just the essential keys.
 *
 * Key press uses onPointerDown + preventDefault to keep the input focused
 * while typing. A pressed state (via pointer events) ensures the theme color
 * shows reliably on both desktop and mobile (CSS :active is unreliable on touch).
 */

import { useState, useCallback } from "react";
import { useKeyboard } from "./keyboard-context";
import styles from "./keyboard.module.css";

const ROW1 = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const ROW2 = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];
const ROW3 = ["a", "s", "d", "f", "g", "h", "j", "k", "l"];
const ROW4 = ["z", "x", "c", "v", "b", "n", "m"];

export function Keyboard() {
  const { target, press, backspace, enter, deactivate } = useKeyboard();
  const [shifted, setShifted] = useState(false);
  const active = target !== null;

  const handleKey = useCallback(
    (key: string) => {
      press(shifted ? key.toUpperCase() : key);
      if (shifted) setShifted(false);
    },
    [press, shifted],
  );

  const handleShift = useCallback(() => setShifted((s) => !s), []);
  const handleBackspace = useCallback(() => backspace(), [backspace]);
  const handleEnter = useCallback(() => enter(), [enter]);

  // Prevent default on pointer down so the focused input doesn't blur.
  const preventBlur = (e: React.PointerEvent) => {
    e.preventDefault();
  };

  const transform = (k: string) => (shifted ? k.toUpperCase() : k);

  return (
    <div
      className={`${styles.keyboard} ${active ? styles.keyboardIsActive : ""}`}
      aria-hidden={!active}
    >
      <div className={styles.keypad}>
        {/* Row 1: Numbers */}
        <div className={styles.row}>
          {ROW1.map((k) => (
            <Key
              key={k}
              label={k}
              onPointerDown={preventBlur}
              onClick={() => handleKey(k)}
            />
          ))}
        </div>

        {/* Row 2: QWERTYUIOP */}
        <div className={styles.row}>
          {ROW2.map((k) => (
            <Key
              key={k}
              label={transform(k)}
              onPointerDown={preventBlur}
              onClick={() => handleKey(k)}
            />
          ))}
        </div>

        {/* Row 3: ASDFGHJKL (slightly indented) */}
        <div className={`${styles.row} ${styles.rowIndented}`}>
          {ROW3.map((k) => (
            <Key
              key={k}
              label={transform(k)}
              onPointerDown={preventBlur}
              onClick={() => handleKey(k)}
            />
          ))}
        </div>

        {/* Row 4: Shift + ZXCVBNM + Backspace */}
        <div className={styles.row}>
          <Key
            label="⇧"
            wide
            active={shifted}
            onPointerDown={preventBlur}
            onClick={handleShift}
          />
          {ROW4.map((k) => (
            <Key
              key={k}
              label={transform(k)}
              onPointerDown={preventBlur}
              onClick={() => handleKey(k)}
            />
          ))}
          <Key
            label="⌫"
            wide
            onPointerDown={preventBlur}
            onClick={handleBackspace}
          />
        </div>

        {/* Row 5: Space (wide) + Enter (right) */}
        <div className={styles.row}>
          <Key
            label="space"
            extraWide
            onPointerDown={preventBlur}
            onClick={() => handleKey(" ")}
          />
          <Key
            label={target?.enterLabel ?? "Return"}
            wide
            accent
            onPointerDown={preventBlur}
            onClick={handleEnter}
          />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Key component — uses pointer events for reliable pressed state
// ---------------------------------------------------------------------------

interface KeyProps {
  label: string;
  wide?: boolean;
  extraWide?: boolean;
  active?: boolean;
  accent?: boolean;
  onPointerDown: (e: React.PointerEvent) => void;
  onClick: () => void;
}

function Key({
  label,
  wide,
  extraWide,
  active,
  accent,
  onPointerDown,
  onClick,
}: KeyProps) {
  const [pressed, setPressed] = useState(false);

  // Use pointer events for the VISUAL pressed state only (reliable on touch).
  // The actual key action stays on onClick (works for mouse, touch, keyboard).
  const handlePointerDown = (e: React.PointerEvent) => {
    onPointerDown(e);
    setPressed(true);
  };

  const handlePointerUp = () => {
    setPressed(false);
  };

  const handlePointerLeave = () => {
    setPressed(false);
  };

  const cls = [
    styles.key,
    wide ? styles.keyWide : "",
    extraWide ? styles.keyExtraWide : "",
    active ? styles.keyIsActive : "",
    accent ? styles.keyAccent : "",
    pressed ? styles.keyIsPressed : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={cls}
      tabIndex={-1}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerLeave}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
