"use client";

import { usePathname } from "next/navigation";

/** Versions B (/en/b), C (/en/c), D (/en/d) and E (/en/e), and the buyer guides (/en/guides, framed like B), bring their own header
 *  and footer: hide Version A's shared chrome there. */
export const isVersionB = (path: string | null) => !!path && /^\/(en|es)\/(b|c|d|e|guides)(\/|$)/.test(path);

export function ChromeGate({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return isVersionB(path) ? null : <>{children}</>;
}
