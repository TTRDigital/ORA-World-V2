"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** The incoming page's panel slides up 24px with a fade (CSS keyframes keyed by pathname). */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="page-in">
      {children}
    </div>
  );
}
