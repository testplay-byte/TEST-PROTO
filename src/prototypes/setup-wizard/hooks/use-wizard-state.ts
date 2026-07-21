import { useState, useCallback } from "react";
import type { ThemeMode, ThemePalette } from "../lib/themes";
import { DEFAULT_PALETTE } from "../lib/themes";

export interface WizardState {
  step: number;
  themeMode: ThemeMode;
  palette: ThemePalette;
  folderSelected: boolean;
  backupSelected: boolean;
  permissionsGranted: {
    installApps: boolean;
    notifications: boolean;
    battery: boolean;
  };
}

export const TOTAL_STEPS = 7;

export function useWizardState() {
  const [step, setStep] = useState(0);
  const [themeMode, setThemeMode] = useState<ThemeMode>("dark");
  const [palette, setPalette] = useState<ThemePalette>(DEFAULT_PALETTE);
  const [folderSelected, setFolderSelected] = useState(false);
  const [backupSelected, setBackupSelected] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState({
    installApps: false,
    notifications: false,
    battery: false,
  });

  const next = useCallback(() => {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }, []);

  const back = useCallback(() => {
    setStep((s) => Math.max(s - 1, 0));
  }, []);

  /**
   * Jump directly to the Finish screen (last step), skipping intermediate
   * screens. Used by the Restore screen's "Skip" button so that skipping a
   * backup bypasses the Backup Summary screen entirely (nothing to summarize).
   */
  const skipToFinish = useCallback(() => {
    setStep(TOTAL_STEPS - 1);
  }, []);

  const reset = useCallback(() => {
    setStep(0);
    setThemeMode("dark");
    setPalette(DEFAULT_PALETTE);
    setFolderSelected(false);
    setBackupSelected(false);
    setPermissionsGranted({ installApps: false, notifications: false, battery: false });
  }, []);

  const togglePermission = useCallback((key: keyof typeof permissionsGranted) => {
    setPermissionsGranted((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  return {
    step,
    themeMode,
    setThemeMode,
    palette,
    setPalette,
    folderSelected,
    setFolderSelected,
    backupSelected,
    setBackupSelected,
    permissionsGranted,
    togglePermission,
    next,
    back,
    skipToFinish,
    reset,
  };
}
