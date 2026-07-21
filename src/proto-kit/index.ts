/**
 * proto-kit — shared design-system components for all prototypes.
 *
 * Import from a prototype:
 *   import { DeviceFrame, Screen, BottomNav, Stage } from "@/proto-kit";
 *   import "@/proto-kit/tokens/tokens.css";
 */

export { DeviceFrame, Screen, type DeviceFrameProps } from "./device-frame/device-frame";
export { StatusBar } from "./device-frame/status-bar";
export { BottomNav, type NavItem, type BottomNavProps } from "./bottom-nav/bottom-nav";
export {
  Stage,
  PanelBadge,
  PanelTitle,
  PanelDesc,
  PanelHead,
  type StageProps,
} from "./stage/stage";
export { DeviceThemeProvider, useDeviceTheme } from "./theme/theme-provider";
export type { AppTheme, ThemeProviderProps } from "./theme/types";

// Swipe gestures — permanent proto-kit feature. Every prototype wires it
// up in its page.tsx with its own screen order + navigation callbacks.
export { useSwipeSimulation, type SwipeSimulationOptions } from "./swipe-simulation/use-swipe-simulation";

// On-screen keyboard — replaces the native soft keyboard. Every prototype
// wraps with <KeyboardProvider> and renders <Keyboard /> inside DeviceFrame.
export { KeyboardProvider, useKeyboard, useKeyboardInput, type KeyboardTarget, type KeyboardProviderProps } from "./keyboard/keyboard-context";
export { Keyboard } from "./keyboard/keyboard";
