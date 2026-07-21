import type { NextConfig } from "next";

/**
 * Next.js config for ANDROID-PROTOTYPE.
 *
 * Deploys as a STATIC EXPORT to GitHub Pages at:
 *   https://testplay-byte.github.io/TEST-PROTO/
 *
 * - output: 'export'  → produces static HTML/CSS/JS in ./out (no server needed)
 * - basePath          → the repo is a project page, served under /TEST-PROTO
 * - trailingSlash     → directory-style URLs (out/prototypes/x/ → /prototypes/x/)
 * - images.unoptimized → required for static export (no Next image server)
 *
 * Old static prototypes live in public/prototypes/ and are copied verbatim
 * into out/prototypes/ by the static export, preserving their URLs during the
 * migration to Next.js components.
 */
const nextConfig: NextConfig = {
  output: "export",
  basePath: "/TEST-PROTO",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Fix Turbopack workspace-root detection when multiple lockfiles exist
  // in the parent directory (local dev). On CI there's only one lockfile.
  outputFileTracingRoot: __dirname,
  // Suppress build errors from old static HTML in public/ (it isn't compiled).
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
