import type { ReactNode } from "react";

/** Root layout owns the document and shared fonts for every game route. */
export default function PlayLayout({ children }: { children: ReactNode }) {
  return children;
}
