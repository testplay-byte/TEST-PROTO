"use client";

/* ════════════════════════════════════════════════════════════════════════
   SWIPE GESTURES (proto-kit)
   ════════════════════════════════════════════════════════════════════════

   Makes the mouse act like a touch input on the device screen:
     • Click + drag vertically   → grab-scrolls the content (1:1 movement).
     • Click + drag horizontally → navigates between screens (past threshold).
     • Clicks after a drag are suppressed (so you don't open a card by
       accident when you meant to scroll).
     • Cursor changes to grab / grabbing.
     • Touch input is left alone — native touch scrolling still works.

   This is a permanent part of proto-kit — every prototype should wire it
   up in its page.tsx with its own screen order + navigation callbacks.

   Usage:
   ```tsx
   useSwipeSimulation({
     onSwipeLeft: () => goNext(),
     onSwipeRight: () => goPrev(),
   });
   ```

   ════════════════════════════════════════════════════════════════════════ */

import { useEffect, useRef } from "react";

export interface SwipeSimulationOptions {
  /** Enable/disable. Default true. Set to false to disable without removing code. */
  enabled?: boolean;
  /** Min horizontal drag (px) to trigger screen navigation. Default 70. */
  swipeThreshold?: number;
  /** Min drag (px) before click suppression kicks in. Default 8. */
  clickSuppressThreshold?: number;
  /** Drag left (next). */
  onSwipeLeft?: () => void;
  /** Drag right (previous). */
  onSwipeRight?: () => void;
}

/**
 * useSwipeSimulation — attach to any page that renders a `.device` element.
 *
 * Self-contained: finds `.device` internally, attaches pointer listeners,
 * cleans up on unmount. No ref needed.
 *
 * Usage:
 * ```tsx
 * useSwipeSimulation({
 *   onSwipeLeft: () => goNext(),
 *   onSwipeRight: () => goPrev(),
 * });
 * ```
 */
export function useSwipeSimulation(options: SwipeSimulationOptions = {}) {
  const {
    enabled = true,
    swipeThreshold = 70,
    clickSuppressThreshold = 8,
    onSwipeLeft,
    onSwipeRight,
  } = options;

  // Keep latest callbacks in a ref so the effect doesn't need to re-bind.
  const cbRef = useRef({ onSwipeLeft, onSwipeRight });
  cbRef.current = { onSwipeLeft, onSwipeRight };

  useEffect(() => {
    if (!enabled) return;

    const found = document.querySelector(".device") as HTMLElement | null;
    if (!found) return;
    const device: HTMLElement = found;

    // ── Drag state (mutable, persists across events) ──────────────────
    const drag = {
      down: false,
      startX: 0,
      startY: 0,
      scrollEl: null as HTMLElement | null,
      startScrollTop: 0,
      moved: 0, // max distance moved (px)
      horizontal: false, // is this drag horizontal-dominant?
    };

    function onDown(e: PointerEvent) {
      // Only mouse/pen — leave touch to native scrolling.
      if (e.pointerType === "touch") return;
      if (e.button !== 0) return; // left button only

      const target = e.target as HTMLElement | null;

      // Don't start a drag on interactive controls (buttons, inputs, tabs,
      // nav items) — those should receive normal clicks.
      if (target?.closest('button, input, select, textarea, a, [role="tab"]')) {
        return;
      }

      // Find the nearest scrollable content element under the cursor.
      // CSS module classes are hashed but always contain "content" or "list".
      const scrollEl = target?.closest(
        '[class*="content"], [class*="list"]',
      ) as HTMLElement | null;

      drag.down = true;
      drag.startX = e.clientX;
      drag.startY = e.clientY;
      drag.scrollEl = scrollEl;
      drag.startScrollTop = scrollEl ? scrollEl.scrollTop : 0;
      drag.moved = 0;
      drag.horizontal = false;
    }

    function onMove(e: PointerEvent) {
      if (!drag.down) return;
      const dx = e.clientX - drag.startX;
      const dy = e.clientY - drag.startY;
      const dist = Math.hypot(dx, dy);

      if (dist > 4) {
        drag.moved = Math.max(drag.moved, dist);
        device.setAttribute("data-swipe-grabbing", "true");
        drag.horizontal = Math.abs(dx) > Math.abs(dy);
        // Once the drag has clearly started, prevent default on ALL moves
        // (not just vertical) to stop text selection and image dragging.
        e.preventDefault();
      }

      // Vertical-dominant drag → grab-scroll the content (1:1).
      if (drag.scrollEl && !drag.horizontal) {
        drag.scrollEl.scrollTop = drag.startScrollTop - dy;
      }
    }

    function onUp(e: PointerEvent) {
      if (!drag.down) return;
      const dx = e.clientX - drag.startX;
      const dy = e.clientY - drag.startY;
      drag.down = false;
      device.removeAttribute("data-swipe-grabbing");

      // Horizontal swipe past threshold → navigate.
      if (
        drag.moved > clickSuppressThreshold &&
        Math.abs(dx) > swipeThreshold &&
        Math.abs(dx) > Math.abs(dy)
      ) {
        if (dx < 0) cbRef.current.onSwipeLeft?.();
        else cbRef.current.onSwipeRight?.();
      }
    }

    // Suppress clicks that fire right after a drag (so dragging over a card
    // doesn't accidentally open it). Uses capture phase to intercept before
    // React's synthetic event system.
    function onClick(e: MouseEvent) {
      if (drag.moved > clickSuppressThreshold) {
        e.preventDefault();
        e.stopPropagation();
        drag.moved = 0; // reset so subsequent normal clicks work
      }
    }

    device.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove, { passive: false });
    window.addEventListener("pointerup", onUp);
    device.addEventListener("click", onClick, true);

    return () => {
      device.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      device.removeEventListener("click", onClick, true);
      device.removeAttribute("data-swipe-grabbing");
    };
  }, [enabled, swipeThreshold, clickSuppressThreshold]);
}
