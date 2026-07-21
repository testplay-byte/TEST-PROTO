import type { Metadata } from "next";
import "../../../src/proto-kit/tokens/tokens.css";
import "../../../src/prototypes/weather-app/weather-app.css";

export const metadata: Metadata = {
  title: "Weather App — TEST-PROTO",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}