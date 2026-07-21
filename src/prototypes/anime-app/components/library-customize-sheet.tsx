"use client";

/**
 * anime-app / components / library-customize-sheet — bottom sheet for
 * customizing the Library page's look and feel.
 *
 * Organized into sections:
 *   1. Layout: Grid | List
 *   2. Columns (grid only): 2 | 3 | 4 | 5
 *   3. Text placement (grid only): Below cover | On cover
 *   4. Cover details: Show format, Show episode count, Episode badge position
 *
 * No dismiss handle — the user dismisses by tapping outside (scrim).
 */
import { useSettings } from "../hooks/use-settings";
import type { LibraryLayout, LibraryTextPlacement, LibraryEpisodePosition } from "../lib/types";
import styles from "./library-customize-sheet.module.css";

interface LibraryCustomizeSheetProps {
  open: boolean;
  onClose: () => void;
}

export function LibraryCustomizeSheet({ open, onClose }: LibraryCustomizeSheetProps) {
  const { settings, update } = useSettings();

  return (
    <>
      {/* Scrim — tap to close */}
      <div
        className={`${styles.scrim} ${open ? styles.scrimIsOpen : ""}`}
        onClick={onClose}
        aria-hidden={!open}
      />

      {/* Sheet */}
      <div
        className={`${styles.sheet} ${open ? styles.sheetIsOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Customize library"
        aria-hidden={!open}
      >
        <div className={styles.header}>
          <h2 className={styles.title}>Customize Library</h2>
        </div>

        <div className={styles.body}>
          {/* ---- Section 1: Layout ---- */}
          <Section label="Layout">
            <Segmented
              options={[
                { value: "grid", label: "Grid" },
                { value: "list", label: "List" },
              ]}
              value={settings.libraryLayout}
              onChange={(v) => update({ libraryLayout: v as LibraryLayout })}
            />
          </Section>

          {/* ---- Section 2: Columns (grid only) ---- */}
          {settings.libraryLayout === "grid" && (
            <Section label="Columns per row">
              <Segmented
                options={[
                  { value: "2", label: "2" },
                  { value: "3", label: "3" },
                  { value: "4", label: "4" },
                  { value: "5", label: "5" },
                ]}
                value={String(settings.libraryColumns)}
                onChange={(v) => update({ libraryColumns: parseInt(v, 10) })}
              />
            </Section>
          )}

          {/* ---- Section 3: Text placement (grid only) ---- */}
          {settings.libraryLayout === "grid" && (
            <Section label="Text placement">
              <Segmented
                options={[
                  { value: "below", label: "Below cover" },
                  { value: "overlay", label: "On cover" },
                ]}
                value={settings.libraryTextPlacement}
                onChange={(v) =>
                  update({ libraryTextPlacement: v as LibraryTextPlacement })
                }
              />
            </Section>
          )}

          {/* ---- Section 4: Cover details ---- */}
          <Section label="Cover details">
            <div className={styles.toggleRow}>
              <span className={styles.toggleLabel}>Show format (TV / Movie / OVA)</span>
              <Toggle
                on={settings.libraryShowFormat}
                onChange={(v) => update({ libraryShowFormat: v })}
              />
            </div>
            <div className={styles.toggleRow}>
              <span className={styles.toggleLabel}>Show episode count</span>
              <Toggle
                on={settings.libraryShowEpisodes}
                onChange={(v) => update({ libraryShowEpisodes: v })}
              />
            </div>
          </Section>

          {/* ---- Section 5: Episode badge position (grid only) ---- */}
          {settings.libraryLayout === "grid" && settings.libraryShowEpisodes && (
            <Section label="Episode badge position">
              <Segmented
                options={[
                  { value: "top-left", label: "Top L" },
                  { value: "top-right", label: "Top R" },
                  { value: "bottom-left", label: "Bot L" },
                  { value: "bottom-right", label: "Bot R" },
                  { value: "hidden", label: "Off" },
                ]}
                value={settings.libraryEpisodePosition}
                onChange={(v) =>
                  update({ libraryEpisodePosition: v as LibraryEpisodePosition })
                }
              />
            </Section>
          )}
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.doneBtn} onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.section}>
      <span className={styles.sectionLabel}>{label}</span>
      {children}
    </div>
  );
}

interface SegOption {
  value: string;
  label: string;
}

function Segmented({
  options,
  value,
  onChange,
}: {
  options: SegOption[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className={styles.segmented} role="radiogroup">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="radio"
          aria-checked={value === opt.value}
          className={`${styles.segBtn} ${value === opt.value ? styles.segBtnIsActive : ""}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      className={`${styles.toggle} ${on ? styles.toggleIsOn : ""}`}
      onClick={() => onChange(!on)}
      aria-pressed={on}
    >
      <span className={styles.toggleKnob} />
    </button>
  );
}
