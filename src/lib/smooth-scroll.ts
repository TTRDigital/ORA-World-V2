import type Lenis from "lenis";

/** The page's Lenis instance (desktop pointers only), so components can scroll the window without fighting it. */
export const lenisRef: { current: Lenis | null } = { current: null };

/** Scroll the window to an absolute Y, through Lenis when it runs, natively otherwise. */
export function scrollWindowTo(top: number) {
  const reduced = document.documentElement.classList.contains("reduced-motion") || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (lenisRef.current && !reduced) {
    lenisRef.current.scrollTo(top, { duration: 1.1 });
    return;
  }
  window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
}
