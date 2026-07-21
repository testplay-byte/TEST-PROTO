import type { Metadata } from "next";
import "../../../src/proto-kit/tokens/tokens.css";
import "../../../src/prototypes/search-page/search-page.css";

export const metadata: Metadata = {
  title: "Search Page — ANDROID-PROTOTYPE",
};

/**
 * Layout for the search-page prototype route.
 *
 * Thin pass-through: the page.tsx (client) renders the full
 * Stage + DeviceFrame + DeviceThemeProvider shell.
 */
export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
