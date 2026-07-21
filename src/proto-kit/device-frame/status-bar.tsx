"use client";

import { useEffect, useState } from "react";
import styles from "./device-frame.module.css";

/**
 * StatusBar — the phone status bar (time, punch-hole, wifi/signal/battery).
 *
 * The clock updates live (once per minute). Battery/signal are static icons
 * matching the approved template (left 2 signal bars bright, right 2 dim).
 */
export function StatusBar() {
  const [time, setTime] = useState("9:41");

  useEffect(() => {
    const update = () => {
      const d = new Date();
      let h = d.getHours();
      const m = d.getMinutes().toString().padStart(2, "0");
      h = h % 12 || 12;
      setTime(`${h}:${m}`);
    };
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={styles.statusbar}>
      <span className={styles.statusbar__time}>{time}</span>
      <span className={styles.statusbar__punchhole} aria-hidden="true" />
      <span className={styles.statusbar__icons} aria-hidden="true">
        {/* Wi-Fi */}
        <svg
          className={styles.ic}
          width="15"
          height="11"
          viewBox="0 0 15 11"
          fill="currentColor"
        >
          <path
            d="M7.5 0.5C4.6 0.5 1.9 1.6 0 3.3l1.2 1.2A8.8 8.8 0 0 1 7.5 2c2.3 0 4.4.8 6 2.2L14.7 3A11.5 11.5 0 0 0 7.5.5z"
            opacity="0.3"
          />
          <path d="M7.5 3.8c-1.8 0-3.4.7-4.6 1.8l1.2 1.2A4.7 4.7 0 0 1 7.5 5.3c1.2 0 2.3.4 3.2 1.2l1.2-1.2A6.5 6.5 0 0 0 7.5 3.8z" />
          <path d="M7.5 7.2c-.8 0-1.5.3-2 .8L7.5 11l2-2.5c-.5-.5-1.2-.8-2-.8z" />
        </svg>
        {/* Signal — left 2 bright, right 2 dim */}
        <svg
          className={styles.ic}
          width="16"
          height="11"
          viewBox="0 0 16 11"
          fill="currentColor"
        >
          <rect x="0" y="8" width="3" height="3" rx="0.5" />
          <rect x="4.5" y="6" width="3" height="5" rx="0.5" />
          <rect x="9" y="3.5" width="3" height="7.5" rx="0.5" opacity="0.3" />
          <rect x="13.5" y="1" width="3" height="10" rx="0.5" opacity="0.3" />
        </svg>
        {/* Battery */}
        <span className={styles.battery}>
          <svg
            className={styles.icBatt}
            width="8"
            height="16"
            viewBox="0 0 8 16"
            fill="none"
          >
            <rect
              x="2.5"
              y="0"
              width="3"
              height="1.5"
              rx="0.75"
              fill="currentColor"
              opacity="0.5"
            />
            <rect
              x="0.5"
              y="1.5"
              width="7"
              height="14"
              rx="2"
              stroke="currentColor"
              strokeWidth="0.9"
              strokeOpacity="0.6"
            />
            <rect
              className={styles.battery__fill}
              x="1.5"
              y="3"
              width="5"
              height="11"
              rx="0.8"
              fill="currentColor"
            />
          </svg>
          <span className={styles.battery__pct}>
            <span>87</span>%
          </span>
        </span>
      </span>
    </div>
  );
}
