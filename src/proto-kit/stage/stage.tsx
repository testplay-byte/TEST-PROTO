import type { ReactNode } from "react";
import styles from "./stage.module.css";

export interface StageProps {
  /** Left info panel content (prototype name, description, tags). */
  leftPanel?: ReactNode;
  /** The DeviceFrame (the phone mockup). */
  children: ReactNode;
  /** Right info panel content (screen info, design notes). */
  rightPanel?: ReactNode;
}

/**
 * Stage — the desktop layout: [left panel] [device] [right panel].
 *
 * Side panels hide on <=1024px. The device fills the viewport on <=480px.
 * The stage background adapts to the device theme (via :has() in tokens.css).
 */
export function Stage({ leftPanel, children, rightPanel }: StageProps) {
  return (
    <div className={styles.stage}>
      {leftPanel && (
        <aside className={styles.sidepanel} aria-label="Prototype info">
          {leftPanel}
        </aside>
      )}
      {children}
      {rightPanel && (
        <aside className={styles.sidepanel} aria-label="Screen info">
          {rightPanel}
        </aside>
      )}
    </div>
  );
}

/** Convenience sub-components for panel content. */
export function PanelBadge({ children }: { children: ReactNode }) {
  return <span className={styles.sidepanel__badge}>{children}</span>;
}
export function PanelTitle({ children }: { children: ReactNode }) {
  return <h2 className={styles.sidepanel__title}>{children}</h2>;
}
export function PanelDesc({ children }: { children: ReactNode }) {
  return <p className={styles.sidepanel__desc}>{children}</p>;
}
export function PanelHead({ children }: { children: ReactNode }) {
  return <h3 className={styles.sidepanel__head}>{children}</h3>;
}
