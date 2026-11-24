"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { lenisRef } from "@/lib/smooth-scroll";

/**
 * Every new page opens at the top (client, 24 Nov: "when I click Living or Act 60 it opens in the middle of the page").
 * The smooth-scroll (Lenis) kept the old position and pulled the window back down after the route change. On a path
 * change without a #section, jump to the top at once, through Lenis and natively, and again on the next frame once
 * the new page has laid out.
 */
export function ScrollTop() {
  const path = usePathname();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (window.location.hash) return;
    const top = () => {
      lenisRef.current?.scrollTo(0, { immediate: true, force: true });
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    };
    top();
    const r1 = requestAnimationFrame(() => {
      top();
      r2 = requestAnimationFrame(top);
    });
    let r2 = 0;
    return () => {
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
    };
  }, [path]);
  return null;
}
