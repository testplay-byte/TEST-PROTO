"use client";

/**
 * proto-kit / device-frame / fullscreen-button — real Fullscreen API toggle.
 *
 * Calls `device.requestFullscreen()` on the nearest `.device` ancestor.
 * The button only ENTERS fullscreen — it completely hides once fullscreen
 * is active (via CSS `.device:fullscreen .fsToggle { display: none }`).
 * The user exits fullscreen via the system back button/gesture (mobile) or
 * Esc key (desktop).
 *
 * Lives inside <DeviceFrame> so every prototype gets it automatically.
 * Positioned bottom-right of the device, above the bottom nav.
 */
import { useEffect } from "react";
import styles from "./device-frame.module.css";

export function FullscreenButton() {
  // No state needed — the button only enters fullscreen. The CSS hides it
  // when fullscreen is active. We just need the click handler.
  useEffect(() => {
    // Ensure the button doesn't interfere with fullscreen state syncing
    // (the CSS handles visibility via :fullscreen pseudo-class).
  }, []);

  function enter() {
    const device = document.querySelector(".device") as HTMLElement | null;
    if (!device) return;
    const currentlyFs = !!(document.fullscreenElement || (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement);
    if (currentlyFs) return; // already fullscreen — button shouldn't be visible anyway
    const req = device.requestFullscreen || (device as unknown as { webkitRequestFullscreen?: () => void }).webkitRequestFullscreen;
    if (req) req.call(device);
  }

  return (
    <button
      type="button"
      className={styles.fsToggle}
      aria-label="Enter fullscreen"
      onClick={enter}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9V5a2 2 0 0 1 2-2h4M21 9V5a2 2 0 0 0-2-2h-4M3 15v4a2 2 0 0 0 2 2h4M21 15v4a2 2 0 0 1-2 2h-4" />
      </svg>
    </button>
  );
}
