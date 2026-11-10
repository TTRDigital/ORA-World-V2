"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";
import { cn } from "@/lib/utils";
import { Chat, Close } from "@/components/ui/Icons";
import { FaqSearch } from "@/components/faq/FaqSearch";
import { LeadFormLazy } from "@/components/forms/LeadFormLazy";
import type { Faq } from "@/content/types";

type Tab = "questions" | "call" | "book";

/**
 * Persistent bottom-right "Ask ORA" pill → slide-over with three tabs: Quick questions (searchable FAQ),
 * Call / WhatsApp (hidden until numbers exist) and Book a visit. Tabs follow the WAI-ARIA pattern with arrow keys.
 */
export function AskOra({ faqs, phone, whatsapp, consentText }: { faqs: Faq[]; phone: string | null; whatsapp: string | null; consentText: string }) {
  const t = useTranslations("ask");
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("questions");
  // Client: the first screen shows one button only, so the Ask ORA button appears once the banner is scrolled past.
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const panel = useRef<HTMLDivElement>(null);
  const tabs: Tab[] = ["questions", ...(phone || whatsapp ? (["call"] as Tab[]) : []), "book"];

  useEffect(() => {
    const onOpen = (e: Event) => {
      setTab(((e as CustomEvent).detail as Tab) || "questions");
      setOpen(true);
    };
    window.addEventListener("ora2:ask", onOpen);
    return () => window.removeEventListener("ora2:ask", onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    lockScroll();
    panel.current?.querySelector<HTMLElement>("[role=tab][aria-selected=true]")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && panel.current) {
        const f = Array.from(panel.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input, select, textarea"));
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      unlockScroll();
    };
  }, [open]);

  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
    setTab(next);
    (e.currentTarget.parentElement?.children[tabs.indexOf(next)] as HTMLElement)?.focus();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={t("open")}
        className={cn(
          "ask-ora-btn pill pill-basalt fixed right-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-[65] size-12 justify-center gap-2 px-0 shadow-lift transition-[opacity,transform] duration-300 md:right-5 md:bottom-5 md:size-auto md:min-h-12 md:pr-5 md:pl-4",
          shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
        )}
        tabIndex={shown ? 0 : -1}
        data-track="ask_ora_open"
      >
        <Chat className="text-brass-light" />
        <span className="hidden md:inline">{t("open")}</span>
      </button>
      {open && (
        <div className="fixed inset-0 z-[85]" role="dialog" aria-modal="true" aria-label={t("title")}>
          <button type="button" aria-label="Close" onClick={() => setOpen(false)} className="fade-in absolute inset-0 bg-basalt/45" />
          <div ref={panel} data-lenis-prevent className="slide-in-right absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-bone shadow-lift md:inset-y-3 md:right-3 md:rounded-[28px]">
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <p className="display-s">{t("title")}</p>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="inline-flex size-11 items-center justify-center rounded-full bg-bone-deep">
                <Close />
              </button>
            </div>
            <div role="tablist" aria-label={t("title")} className="flex gap-1 px-5">
              {tabs.map((k, i) => (
                <button
                  key={k}
                  role="tab"
                  id={`ask-tab-${k}`}
                  aria-selected={tab === k}
                  aria-controls={`ask-panel-${k}`}
                  tabIndex={tab === k ? 0 : -1}
                  onClick={() => setTab(k)}
                  onKeyDown={(e) => onTabKey(e, i)}
                  className={cn("hairline min-h-11 px-2 text-[14px] font-semibold", tab === k ? "is-active text-brass-ink" : "text-charcoal-soft")}
                >
                  {t(k === "questions" ? "questions" : k === "call" ? "call" : "book")}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto px-5 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
              <div role="tabpanel" id="ask-panel-questions" aria-labelledby="ask-tab-questions" hidden={tab !== "questions"}>
                <FaqSearch faqs={faqs} columns={1} compact limit={8} />
              </div>
              {(phone || whatsapp) && (
                <div role="tabpanel" id="ask-panel-call" aria-labelledby="ask-tab-call" hidden={tab !== "call"} className="grid gap-3">
                  {phone && (
                    <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="pill pill-basalt min-h-12">
                      {t("callNow")} {phone}
                    </a>
                  )}
                  {whatsapp && (
                    <a href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener" className="pill pill-brass min-h-12">
                      {t("whatsapp")}
                    </a>
                  )}
                </div>
              )}
              <div role="tabpanel" id="ask-panel-book" aria-labelledby="ask-tab-book" hidden={tab !== "book"}>
                {tab === "book" && <LeadFormLazy variant="short" consentText={consentText} compact />}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
