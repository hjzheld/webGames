import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";
export default function config(phase: string): NextConfig {
  return {
    distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next",
    outputFileTracingRoot: process.cwd(),
    output: "export",
    trailingSlash: true,
    images: { unoptimized: true },
    poweredByHeader: false,
    experimental: { cpus: 2 },
  };
}
