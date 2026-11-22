"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { captureAttribution } from "@/lib/attribution";

/** Captures where the visitor came from on each page view (src/lib/attribution.ts). Renders nothing. */
export function AttributionCapture() {
  const pathname = usePathname();
  useEffect(() => {
    captureAttribution();
  }, [pathname]);
  return null;
}
