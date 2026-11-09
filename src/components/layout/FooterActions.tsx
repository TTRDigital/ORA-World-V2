"use client";

import { MessageCircle, ArrowUp } from "lucide-react";

/** Footer client actions: open Ask ORA, and go back to the top (smooth unless reduced motion). */
export function FooterAsk({ label }: { label: string }) {
  return (
    <button type="button" className="pill pill-ghost min-h-12" onClick={() => window.dispatchEvent(new CustomEvent("ora2:ask", { detail: "questions" }))}>
      <MessageCircle aria-hidden size={18} strokeWidth={1.75} className="text-brass-light" /> {label}
    </button>
  );
}

export function BackToTop({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: document.documentElement.classList.contains("reduced-motion") ? "auto" : "smooth" })}
      className="group inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-[13px] font-semibold text-bone/75 transition-colors hover:text-bone"
    >
      <span className="inline-flex size-8 items-center justify-center rounded-full ring-1 ring-brass-light/40 transition-transform duration-500 [transition-timing-function:var(--ease-out)] group-hover:-translate-y-0.5">
        <ArrowUp aria-hidden size={16} strokeWidth={1.75} className="text-brass-light" />
      </span>
      {label}
    </button>
  );
}
