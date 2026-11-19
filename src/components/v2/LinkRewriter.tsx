"use client";

import { useEffect } from "react";

/**
 * Keeps visitors inside Version B (or C): the shared page content (Living, Longevity, Act 60...) links to Version A
 * paths; inside the version those links point to its own pages instead. Links marked data-keep stay as they are.
 */
const maps = (v: "b" | "c"): [RegExp, string][] => [
  [/^\/(en|es)\/residences\/plans\/?$/, `/$1/${v}/floor-plans`],
  [v === "b" ? /^\/(en|es)\/(act-60|finishes|longevity|living)\/?$/ : /^\/(en|es)\/(act-60|finishes|longevity)\/?$/, `/$1/${v}/$2`],
  ...(v === "c" ? ([[/^\/(en|es)\/(living|place)\/?$/, "/$1/c#setting"]] as [RegExp, string][]) : []),
  [/^\/(en|es)\/?$/, `/$1/${v}`],
];

export function LinkRewriter({ v = "b" }: { v?: "b" | "c" }) {
  useEffect(() => {
    const MAP = maps(v);
    const root = document.querySelector(`[data-version-${v}]`);
    if (!root) return;
    const fix = () =>
      root.querySelectorAll<HTMLAnchorElement>("a[href^='/']:not([data-keep])").forEach((a) => {
        const url = new URL(a.getAttribute("href")!, location.origin);
        if (url.pathname === "/") {
          const lang = document.documentElement.lang === "es" ? "es" : "en";
          a.setAttribute("href", `/${lang}/${v}${url.search}${url.hash}`);
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
  }, [v]);
  return null;
}
