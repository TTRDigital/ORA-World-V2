"use client";

import { useEffect } from "react";

/**
 * Keeps visitors inside Version B: the shared page content (Living, Longevity, Act 60...) links to Version A paths;
 * inside Version B those links point to the Version B pages instead. Links marked data-keep stay as they are.
 */
const MAP: [RegExp, string][] = [
  [/^\/(en|es)\/residences\/plans\/?$/, "/$1/b/floor-plans"],
  [/^\/(en|es)\/(act-60|finishes|longevity|living)\/?$/, "/$1/b/$2"],
  [/^\/(en|es)\/?$/, "/$1/b"],
];

export function LinkRewriter() {
  useEffect(() => {
    const root = document.querySelector("[data-version-b]");
    if (!root) return;
    const fix = () =>
      root.querySelectorAll<HTMLAnchorElement>("a[href^='/']:not([data-keep])").forEach((a) => {
        const url = new URL(a.getAttribute("href")!, location.origin);
        if (url.pathname === "/") {
          const lang = document.documentElement.lang === "es" ? "es" : "en";
          a.setAttribute("href", `/${lang}/b${url.search}${url.hash}`);
          return;
        }
        for (const [re, to] of MAP) {
          if (re.test(url.pathname)) {
            a.setAttribute("href", url.pathname.replace(re, to) + url.search + url.hash);
            break;
          }
        }
      });
    fix();
    const mo = new MutationObserver(fix);
    mo.observe(root, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, []);
  return null;
}
