"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";
import { SoundOn } from "@/components/ui/Icons";

const KEY = "ora2_entered";
const subscribe = () => () => {};
const readEntered = () => {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return true; // no storage (private mode, previews): never block the page
  }
};

/**
 * First-visit welcome screen (client: "sound on when the site opens"). Browsers never play sound before the visitor's
 * first click, so the site asks for that one click up front: "Enter with sound" starts the banner film with sound
 * straight away; "Enter without sound" keeps it silent. Shown once per browser; returning visitors go straight in.
 */
export function EnterGate({ line }: { line: string }) {
  const t = useTranslations("hero");
  const entered = useSyncExternalStore(subscribe, readEntered, () => true);
  const [closed, setClosed] = useState(false);
  const enterBtn = useRef<HTMLButtonElement>(null);
  const open = !entered && !closed;

  const leave = useCallback((withSound: boolean) => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {}
    window.dispatchEvent(new Event(withSound ? "ora2:sound-on" : "ora2:sound-off"));
    setClosed(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    lockScroll();
    enterBtn.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") leave(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      unlockScroll();
    };
  }, [open, leave]);

  if (!open) return null;
  // Rendered on <body>: an ancestor with a transform would otherwise pin this "fixed" screen to the page, not the
  // window, and focusing its button would scroll the page away from the banner.
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t("gateLabel")}
      data-testid="enter-gate"
      data-enter-gate
      className="fade-in fixed inset-0 z-[95] flex flex-col items-center justify-center bg-basalt/85 px-6 text-center text-bone backdrop-blur-md"
    >
      <Image src="/brand/ora-world-logo-white.png" alt="ORA World · Puerto Rico" width={170} height={120} className="h-[96px] w-auto md:h-[120px]" priority />
      <p className="hero-text-shadow mt-8 font-[family-name:var(--font-display)] text-[30px] leading-tight tracking-[0.06em] uppercase md:text-[44px]">{line}</p>
      <button ref={enterBtn} type="button" onClick={() => leave(true)} className="cta mt-10 min-h-[54px] px-8" data-track="gate_enter_sound">
        <SoundOn /> {t("gateEnter")}
      </button>
      <button type="button" onClick={() => leave(false)} className="mt-4 min-h-11 px-4 text-[12px] font-semibold tracking-[0.2em] text-bone/75 uppercase hover:text-bone" data-track="gate_enter_quiet">
        {t("gateQuiet")}
      </button>
    </div>,
    document.body,
  );
}
