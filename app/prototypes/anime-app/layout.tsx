import type { Metadata } from "next";
import "../../../src/proto-kit/tokens/tokens.css";
import "../../../src/prototypes/anime-app/anime-app.css";

export const metadata: Metadata = {
  title: "Anime App — ANDROID-PROTOTYPE",
};

/**
 * Layout for the anime-app prototype route.
 *
 * Thin pass-through: the page.tsx (client) renders the full
 * Stage + DeviceFrame + DeviceThemeProvider + SettingsProvider shell.
 */
export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
