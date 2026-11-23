"use client";

import { useEffect, useState } from "react";
import { LOGO_EMBLEM, LOGO_VIEWBOX, LOGO_WORD } from "./logoPaths";

/**
 * Version E opening (client, 23 Nov: "like Cipriani, on landing it draws the actual logo on the page, and says
 * Beyond expectations"): on Deep Earth, a pen draws the emblem, then writes the wordmark; the logo fills in gold,
 * "Beyond expectations" appears, and the curtain lifts onto the film. Once per visit (sessionStorage); a click or
 * Escape skips it; never shown with reduced motion (CSS). An inline script hides it before paint on a repeat visit.
 */
const KEY = "ora2_e_intro";
const FULL = [...LOGO_EMBLEM, ...LOGO_WORD].join(" ");

export function ELogoIntro({ line }: { line: string }) {
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const done = () => {
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {}
      setGone(true);
    };
    const t = setTimeout(done, 5200);
    const key = (e: KeyboardEvent) => e.key === "Escape" && done();
    window.addEventListener("keydown", key);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", key);
    };
  }, []);
  if (gone) return null;
  const draw = (d: string, k: number, start: number, step: number) => (
    <path key={k} d={d} pathLength={1} className="e-draw" style={{ animationDelay: `${start + k * step}ms` }} />
  );
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: `try{if(sessionStorage.getItem("${KEY}"))document.documentElement.classList.add("e-intro-seen")}catch(e){}` }} />
      <div
        aria-hidden
        onClick={() => {
          try {
            sessionStorage.setItem(KEY, "1");
          } catch {}
          setGone(true);
        }}
        className="e-intro fixed inset-0 z-[80] grid cursor-pointer place-items-center bg-basalt px-6"
      >
        <div className="flex w-full max-w-[520px] flex-col items-center">
          <svg viewBox={LOGO_VIEWBOX} className="w-full">
            <g fill="none" stroke="#D4B987" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
              {LOGO_EMBLEM.map((d, k) => draw(d, k, 100, 28))}
              {LOGO_WORD.map((d, k) => draw(d, k, 1150, 32))}
            </g>
            {/* One path, so the holes (inside the circle, the letters' counters) stay open, as in the original trace. */}
            <path className="e-fill" fill="#D4B987" fillRule="evenodd" d={FULL} />
          </svg>
          <p className="e-line mt-10 text-center text-[13px] font-semibold tracking-[0.42em] text-bone uppercase md:text-[15px]">{line}</p>
        </div>
      </div>
    </>
  );
}
