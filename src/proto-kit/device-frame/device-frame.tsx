import type { ReactNode } from "react";
import { StatusBar } from "./status-bar";
import { FullscreenButton } from "./fullscreen-button";
import styles from "./device-frame.module.css";

/**
 * DeviceFrame — the phone mockup.
 *
 * Renders the bezel, status bar, fullscreen button, and a screen slot for
 * the prototype's content. The frame color/width invert by theme
 * automatically (via tokens).
 *
 * The `theme` prop sets the initial `data-theme` on the device element for
 * SSR. A DeviceThemeProvider (client) takes over on mount to read/persist
 * the saved theme and keep `data-theme` in sync.
 *
 * The fullscreen button uses the real Fullscreen API — always available,
 * part of every prototype.
 *
 * Usage:
 * ```tsx
 * <DeviceFrame theme="dark">
 *   <Screen>{children}</Screen>
 * </DeviceFrame>
 * ```
 */
export interface DeviceFrameProps {
  theme?: "dark" | "light";
  children: ReactNode;
}

export function DeviceFrame({ theme = "dark", children }: DeviceFrameProps) {
  return (
    <div className={`${styles.device} device`} data-theme={theme}>
      <FullscreenButton />
      <StatusBar />
      {children}
    </div>
  );
}

/**
 * Screen — the scrollable app area below the status bar.
 * The prototype renders its views/screens inside this.
 */
export function Screen({ children }: { children: ReactNode }) {
  return <main className={styles.screen}>{children}</main>;
}
