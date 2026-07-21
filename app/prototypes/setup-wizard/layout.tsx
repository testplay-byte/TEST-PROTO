import type { Metadata } from "next";
import "../../../src/proto-kit/tokens/tokens.css";
import "../../../src/prototypes/setup-wizard/setup-wizard.css";

export const metadata: Metadata = {
  title: "Setup Wizard — ANDROID-PROTOTYPE",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
