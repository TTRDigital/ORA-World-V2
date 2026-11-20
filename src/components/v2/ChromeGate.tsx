"use client";

import { usePathname } from "next/navigation";

/** Versions B (/en/b), C (/en/c) and D (/en/d) bring their own header and footer: hide Version A's shared chrome there. */
export const isVersionB = (path: string | null) => !!path && /^\/(en|es)\/(b|c|d)(\/|$)/.test(path);

export function ChromeGate({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return isVersionB(path) ? null : <>{children}</>;
}
