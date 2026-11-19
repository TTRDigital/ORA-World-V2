"use client";

import { usePathname } from "next/navigation";

/** Versions B (/en/b) and C (/en/c) bring their own header and footer: hide Version A's shared chrome there. */
export const isVersionB = (path: string | null) => !!path && /^\/(en|es)\/(b|c)(\/|$)/.test(path);

export function ChromeGate({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return isVersionB(path) ? null : <>{children}</>;
}
