"use client";

import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { Logo } from "@/components/layout/Logo";
import { cn } from "@/lib/utils";

/**
 * Version E header (in the manner of ciprianiresidencesmiami.com; 23 Nov: no announcement line): over the film, a
 * solid "Inquire" button and the telephone number on the left and a menu button on the right (the big logo sits in the
 * film); after a short scroll, a bone bar with the gold logo in the middle. The menu opens full screen.
 */
export function EHeader({ links, inquire, phone, otherLocale, otherLabel, menu, close }: { links: { href: string; label: string }[]; inquire: string; phone: string; otherLocale: "en" | "es"; otherLabel: string; menu: string; close: string }) {
  const path = usePathname();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 80);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const tel = `tel:${phone.replace(/[^\d+]/g, "")}`;
  return (
    <>
      <header className={cn("fixed inset-x-0 z-40 transition-[background-color,top,box-shadow] duration-300", solid ? "top-0 bg-bone text-basalt shadow-[0_1px_0_rgb(44_36_22/0.18)]" : "top-0 bg-gradient-to-b from-[rgb(28_24_18/0.4)] to-transparent text-white")}>
        <div className="mx-auto grid h-[72px] max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 md:h-[84px] md:px-8">
          <div className="flex items-center gap-5">
            <Link href="/e#inquire" className={cn("inline-flex min-h-10 items-center px-4 text-[11px] font-semibold tracking-[0.2em] uppercase transition-colors", solid ? "bg-basalt text-bone hover:bg-basalt-soft" : "bg-basalt/90 text-bone hover:bg-basalt")}>
              {inquire}
            </Link>
            {phone && (
              <a href={tel} className="hidden text-[13px] tracking-[0.1em] hover:underline sm:inline">
                {phone}
              </a>
            )}
          </div>
          <Link href="/e" aria-label="ORA World" className={cn("transition-opacity duration-300", solid ? "opacity-100" : "pointer-events-none opacity-0")} tabIndex={solid ? 0 : -1}>
            <Logo variant="header" height={60} responsive className="h-[48px] w-auto md:h-[56px]" />
          </Link>
          <div className="flex justify-end">
            <button type="button" onClick={() => setOpen(true)} aria-expanded={open} aria-label={menu} className="grid size-11 place-items-center">
              <span aria-hidden className="grid gap-[7px]">
                <span className="block h-px w-7 bg-current" />
                <span className="block h-px w-7 bg-current" />
                <span className="block h-px w-7 bg-current" />
              </span>
            </button>
          </div>
        </div>
      </header>
      {open && (
        <div role="dialog" aria-modal="true" aria-label={menu} className="fixed inset-0 z-[60] overflow-y-auto bg-basalt px-6 pt-6 pb-12 text-bone" onKeyDown={(e) => e.key === "Escape" && setOpen(false)}>
          <div className="flex items-center justify-between">
            <Logo variant="white" height={60} responsive className="h-[52px] w-auto" />
            <button type="button" autoFocus onClick={() => setOpen(false)} className="inline-flex min-h-11 items-center gap-3 text-[12px] font-semibold tracking-[0.22em] uppercase">
              {close} <span aria-hidden className="text-[20px] leading-none">×</span>
            </button>
          </div>
          <nav aria-label="Version E" className="mx-auto mt-14 max-w-[720px] text-center">
            <ul className="grid gap-2">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} onClick={() => setOpen(false)} className="inline-block py-3 text-[26px] font-light tracking-[0.14em] uppercase hover:text-brass-light md:text-[34px]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3 text-[12px] tracking-[0.2em] uppercase">
              {phone && <a href={tel}>{phone}</a>}
              <Link href={path} locale={otherLocale} onClick={() => setOpen(false)}>
                {otherLabel}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
