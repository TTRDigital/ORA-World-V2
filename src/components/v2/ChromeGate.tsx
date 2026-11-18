"use client";

import { usePathname } from "next/navigation";

/** Version B (/en/b, /es/b) brings its own header and footer: hide Version A's shared chrome there. */
export const isVersionB = (path: string | null) => !!path && /^\/(en|es)\/b(\/|$)/.test(path);

export function ChromeGate({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return isVersionB(path) ? null : <>{children}</>;
}
