"use client";
/**
 * setup-wizard / screens / welcome-screen — step 0.
 *
 * The first screen of the wizard. Welcomes the user with an animated
 * abstract app logo (concentric pulsing rings + orbiting dots + central
 * play-mark), plus decorative blurred background orbs that use the active
 * palette's primary color. A single "Get Started" CTA advances to the
 * theme screen. No back button (first step).
 */
import type { ThemePalette } from "../lib/themes";
import { WelcomeVisual } from "../components/visuals";

interface WelcomeScreenProps {
  active: boolean;
  onNext: () => void;
  palette: ThemePalette;
}

export function WelcomeScreen({ active, onNext, palette }: WelcomeScreenProps) {
  return (
    <div className={`wizard-step ${active ? "wizard-step--active" : ""}`}>
      {/* Decorative blurred background orbs */}
      <div className="bg-orbs" aria-hidden="true">
        <div
          className="bg-orb"
          style={{
            width: 180,
            height: 180,
            top: -40,
            left: -40,
            background: palette.primary,
          }}
        />
        <div
          className="bg-orb"
          style={{
            width: 140,
            height: 140,
            bottom: 80,
            right: -30,
            background: palette.primary,
            animationDelay: "1.5s",
          }}
        />
        <div
          className="bg-orb"
          style={{
            width: 100,
            height: 100,
            top: "40%",
            right: "10%",
            background: palette.primary,
            opacity: 0.1,
            animationDelay: "0.8s",
          }}
        />
      </div>

      <div className="wizard-content" style={{ position: "relative", zIndex: 1 }}>
        {/* Illustration — animated abstract logo */}
        <div className="illustration" key={active ? "on" : "off"}>
          <WelcomeVisual />
        </div>

        {/* Title — explicitly bold (font-weight: 800) */}
        <h1 className="wizard-title" style={{ fontWeight: 800 }}>
          Welcome to Anime App!
        </h1>

        {/* Subtitle */}
        <p className="wizard-subtitle">
          Let&apos;s get you set up in just a few steps. Pick a theme, point us at
          your anime library, and start watching.
        </p>
      </div>

      {/* Actions — single primary CTA, no back button (first step) */}
      <div className="wizard-actions">
        <button
          type="button"
          className="wizard-btn wizard-btn--primary"
          onClick={onNext}
          style={{ background: palette.primary, color: palette.onPrimary, fontWeight: 800 }}
        >
          Get Started
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
