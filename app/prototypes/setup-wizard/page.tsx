"use client";

/**
 * setup-wizard / page — the prototype entry point.
 *
 * A 7-step animated setup wizard for an anime app.
 * Theme color: #b3f35a (lime) by default, user can switch palettes.
 *
 * Steps:
 *   0. Welcome
 *   1. Theme selection (light/dark/system + color palette)
 *   2. Folder selection (merged with confirm — auto-advances)
 *   3. Permissions (install apps, notifications, battery — optional)
 *   4. Restore backup (auto-advances after backup selection; Skip jumps to Finish)
 *   5. Backup summary (mock data — only shown if a backup was selected)
 *   6. Finish (good luck screen)
 *
 * The wizard applies the selected theme + palette to the .device element
 * so subsequent screens reflect the user's choices immediately. Abstract
 * animated visuals appear on every screen with per-screen motion graphics.
 */
import { useState, useEffect, useMemo } from "react";
import {
  DeviceThemeProvider,
  DeviceFrame,
  Screen,
  Stage,
  PanelBadge,
  PanelTitle,
  PanelDesc,
  PanelHead,
} from "../../../src/proto-kit";
import { useWizardState } from "../../../src/prototypes/setup-wizard/hooks/use-wizard-state";
import { WelcomeScreen } from "../../../src/prototypes/setup-wizard/screens/welcome-screen";
import { ThemeScreen } from "../../../src/prototypes/setup-wizard/screens/theme-screen";
import { FolderScreen } from "../../../src/prototypes/setup-wizard/screens/folder-screen";
import { PermissionsScreen } from "../../../src/prototypes/setup-wizard/screens/permissions-screen";
import { RestoreScreen } from "../../../src/prototypes/setup-wizard/screens/restore-screen";
import { BackupSummaryScreen } from "../../../src/prototypes/setup-wizard/screens/backup-summary-screen";
import { FinishScreen } from "../../../src/prototypes/setup-wizard/screens/finish-screen";
import { WizardProgress } from "../../../src/prototypes/setup-wizard/components/wizard-progress";

const STEP_NAMES = [
  "Welcome",
  "Theme",
  "Folder",
  "Permissions",
  "Restore",
  "Summary",
  "Finish",
];

const STEP_DESCRIPTIONS = [
  "Welcome to the setup wizard.",
  "Choose your theme and colors.",
  "Select your anime folder (auto-advances).",
  "Grant app permissions (optional).",
  "Restore from a backup (auto-advances).",
  "Backup summary preview.",
  "You're all set!",
];

export default function Page() {
  const wizard = useWizardState();
  const { step, themeMode, palette } = wizard;

  // Apply the selected palette as CSS custom properties on the .device element
  useEffect(() => {
    const device = document.querySelector(".device") as HTMLElement | null;
    if (!device) return;

    // Determine effective theme (system → dark for prototype)
    const effectiveDark = themeMode !== "light";

    // Apply theme mode
    device.setAttribute("data-theme", effectiveDark ? "dark" : "light");

    // Apply palette colors as CSS custom properties
    const root = device;
    root.style.setProperty("--color-primary", palette.primary);
    root.style.setProperty("--color-primary-fg", palette.onPrimary);
    root.style.setProperty("--color-on-primary-container", palette.onPrimaryContainer);
    root.style.setProperty("--color-primary-container", effectiveDark ? palette.primaryContainerDark : palette.primaryContainerLight);
    root.style.setProperty("--color-bg", effectiveDark ? palette.bgDark : palette.bgLight);
    root.style.setProperty("--color-surface-1", effectiveDark ? palette.surface1Dark : palette.bgLight);
    root.style.setProperty("--color-surface-2", effectiveDark ? palette.surface2Dark : palette.primaryContainerLight);
    root.style.setProperty("--color-surface-3", effectiveDark ? palette.surface3Dark : palette.bgLight);
    root.style.setProperty("--color-surface-4", effectiveDark ? palette.surface4Dark : palette.primaryContainerLight);
    root.style.setProperty("--color-surface-5", effectiveDark ? palette.surface5Dark : palette.primaryContainerLight);

    // Stage background
    document.documentElement.style.setProperty("--stage-bg", effectiveDark ? palette.bgDark : "#e0e0e0");
  }, [themeMode, palette]);

  const info = STEP_NAMES[step];
  const desc = STEP_DESCRIPTIONS[step];

  return (
    <DeviceThemeProvider storageKey="setup-wizard-theme" initialTheme="dark">
      <Stage
        leftPanel={
          <>
            <PanelBadge>prototype</PanelBadge>
            <PanelTitle>Setup Wizard</PanelTitle>
            <PanelDesc>
              An animated 7-step setup wizard for an anime app. Material 3
              Expressive with a lime (#b3f35a) primary color. Theme switching,
              folder selection (auto-advancing), permissions, backup restore,
              and abstract animated visuals on every screen.
            </PanelDesc>
            <div className="tags">
              <span className="tag">Material 3</span>
              <span className="tag">Animated</span>
              <span className="tag">Abstract</span>
            </div>
          </>
        }
        rightPanel={
          <>
            <PanelHead>Step info</PanelHead>
            <div className="screeninfo">
              <span className="screeninfo__name">{info}</span>
              <span className="screeninfo__desc">{desc}</span>
            </div>

            <PanelHead>Progress</PanelHead>
            <div className="mini-bars">
              {STEP_NAMES.map((name, i) => (
                <div key={name} className="mini-bar-row">
                  <span className="mini-bar-label">{name}</span>
                  <div className="mini-bar-track">
                    <div
                      className="mini-bar-fill"
                      style={{
                        width: i <= step ? "100%" : "0%",
                        background: i <= step ? "var(--color-primary)" : "var(--muted)",
                        transition: "width 0.4s var(--ease-emphasized)",
                      }}
                    />
                  </div>
                  <span className="mini-bar-num">{i + 1}</span>
                </div>
              ))}
            </div>

            <PanelHead>Design</PanelHead>
            <div className="kvlist">
              <div className="kvlist__row">
                <span>Theme</span>
                <b>M3 Expressive</b>
              </div>
              <div className="kvlist__row">
                <span>Primary</span>
                <b style={{ color: palette.primary }}>{palette.primary}</b>
              </div>
              <div className="kvlist__row">
                <span>Mode</span>
                <b>{themeMode}</b>
              </div>
            </div>
          </>
        }
      >
        <DeviceFrame theme="dark">
          {/* Progress bar — OUTSIDE Screen so it flows in the flex column
              between the status bar and the screen. This prevents any
              overlap with the status bar on mobile. */}
          <WizardProgress currentStep={step} totalSteps={7} palette={palette} />
          <Screen>
            {/* Screen content — all screens always mounted, visibility via .wizard-step--active */}
            <WelcomeScreen active={step === 0} onNext={wizard.next} palette={palette} />
            <ThemeScreen
              active={step === 1}
              onNext={wizard.next}
              onBack={wizard.back}
              themeMode={themeMode}
              setThemeMode={wizard.setThemeMode}
              palette={palette}
              setPalette={wizard.setPalette}
            />
            <FolderScreen
              active={step === 2}
              onNext={wizard.next}
              onBack={wizard.back}
              folderSelected={wizard.folderSelected}
              setFolderSelected={wizard.setFolderSelected}
              palette={palette}
            />
            <PermissionsScreen
              active={step === 3}
              onNext={wizard.next}
              onBack={wizard.back}
              permissions={wizard.permissionsGranted}
              togglePermission={wizard.togglePermission}
              palette={palette}
            />
            <RestoreScreen
              active={step === 4}
              onNext={wizard.next}
              onBack={wizard.back}
              onSkip={wizard.skipToFinish}
              backupSelected={wizard.backupSelected}
              setBackupSelected={wizard.setBackupSelected}
              palette={palette}
            />
            <BackupSummaryScreen
              active={step === 5}
              onNext={wizard.next}
              onBack={wizard.back}
              palette={palette}
            />
            <FinishScreen active={step === 6} onRestart={wizard.reset} palette={palette} />
          </Screen>
        </DeviceFrame>
      </Stage>
    </DeviceThemeProvider>
  );
}
