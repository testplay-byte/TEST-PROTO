"use client";
/**
 * setup-wizard / screens / permissions-screen — step 3.
 *
 * Optional permission grants. Three rows (Install apps, Notifications,
 * Battery) each with a toggle. All optional — the subtitle still mentions
 * skipping but there is NO Skip button; only Back + Continue. An abstract
 * shield visual with radiating ripple rings + an animated checkmark sits
 * at the top.
 */
import type { ReactNode } from "react";
import type { ThemePalette } from "../lib/themes";
import { PermissionsVisual } from "../components/visuals";

interface Permissions {
  installApps: boolean;
  notifications: boolean;
  battery: boolean;
}

interface PermissionsScreenProps {
  active: boolean;
  onNext: () => void;
  onBack: () => void;
  permissions: Permissions;
  togglePermission: (key: keyof Permissions) => void;
  palette: ThemePalette;
}

interface PermRowDef {
  key: keyof Permissions;
  title: string;
  desc: string;
  icon: ReactNode;
}

const PERM_ROWS: PermRowDef[] = [
  {
    key: "installApps",
    title: "Install apps",
    desc: "Allow installing anime extensions",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 3v12M7 10l5 5 5-5M5 21h14"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    key: "notifications",
    title: "Notifications",
    desc: "Get notified about new episodes",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    key: "battery",
    title: "Battery",
    desc: "Allow background sync for updates",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="2" y="7" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
        <rect x="4" y="9" width="11" height="6" rx="1" fill="currentColor" />
        <path d="M22 11v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function PermissionsScreen({
  active,
  onNext,
  onBack,
  permissions,
  togglePermission,
  palette,
}: PermissionsScreenProps) {
  return (
    <div className={`wizard-step ${active ? "wizard-step--active" : ""}`}>
      <div className="wizard-content">
        {/* Illustration — shield with ripple rings + animated checkmark */}
        <div className="illustration" key={active ? "on" : "off"}>
          <PermissionsVisual />
        </div>

        <h1 className="wizard-title" style={{ fontWeight: 800 }}>Grant permissions</h1>
        <p className="wizard-subtitle">(optional — you can skip these)</p>

        {/* Permission rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)", width: "100%", maxWidth: 320 }}>
          {PERM_ROWS.map((row, i) => {
            const isOn = permissions[row.key];
            return (
              <div
                key={row.key}
                className="perm-row"
                style={{
                  animation: `slideInLeft 0.4s var(--ease-emphasized-decel) ${0.1 * i + 0.2}s backwards`,
                }}
              >
                <div
                  className="perm-icon"
                  style={isOn ? { background: palette.primary, color: palette.onPrimary } : undefined}
                >
                  {row.icon}
                </div>
                <div className="perm-info">
                  <p className="perm-title">{row.title}</p>
                  <p className="perm-desc">{row.desc}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isOn}
                  aria-label={`Toggle ${row.title}`}
                  className={`perm-toggle ${isOn ? "perm-toggle--on" : ""}`}
                  onClick={() => togglePermission(row.key)}
                  style={isOn ? { background: palette.primary } : undefined}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="wizard-actions">
        <button type="button" className="wizard-btn wizard-btn--secondary" onClick={onBack} style={{ fontWeight: 800 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M19 12H5M11 18l-6-6 6-6"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back
        </button>
        {/* Only Continue — no Skip button (subtitle still mentions optional) */}
        <button
          type="button"
          className="wizard-btn wizard-btn--primary"
          onClick={onNext}
          style={{ background: palette.primary, color: palette.onPrimary, fontWeight: 800 }}
        >
          Continue
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M5 12h14M13 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
