"use client";

import { useEffect, useState } from "react";
import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/layout/Logo";
import { cn } from "@/lib/utils";

/**
 * Version B header (in the manner of parksidebrickell.com): transparent over the film with small spaced capitals and an
 * outlined "Inquire"; once the visitor scrolls it settles on cream with the gold logo. Phones get a full-screen menu.
 */
export function V2Header({ links, inquire, versionA, otherLocale, otherLabel }: { links: { href: string; label: string }[]; inquire: string; versionA: string; otherLocale: "en" | "es"; otherLabel: string }) {
  const path = usePathname();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 60);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const dark = !solid && !open;
  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 transition-colors duration-500", solid || open ? "bg-[var(--v2-cream)]/95 text-[var(--v2-green)] shadow-[0_1px_0_rgb(44_36_22/0.12)] backdrop-blur-md" : "bg-transparent text-white")}>
      <div className="mx-auto flex h-[76px] max-w-[1600px] items-center justify-between gap-6 px-5 md:px-10">
        <Link href="/b" aria-label="ORA World" className="shrink-0">
          {dark ? <Logo variant="white" height={56} className="h-[52px] w-auto" /> : <Logo variant="header" height={56} className="h-[52px] w-auto" />}
        </Link>
        <nav aria-label="Version B" className="hidden xl:block">
          <ul className="flex items-center gap-6">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-[11px] tracking-[0.22em] whitespace-nowrap uppercase opacity-90 transition-opacity hover:opacity-100">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-3">
          <Link href={path} locale={otherLocale} className="hidden text-[11px] tracking-[0.22em] uppercase opacity-80 hover:opacity-100 md:inline">
            {otherLabel}
          </Link>
          <Link href="/b#inquire" className={cn("inline-flex min-h-10 items-center border px-5 text-[11px] tracking-[0.24em] uppercase transition-colors", dark ? "border-white/70 hover:bg-white hover:text-[var(--v2-green)]" : "border-[var(--v2-green)]/60 hover:bg-[var(--v2-green)] hover:text-[var(--v2-cream)]")}>
            {inquire}
          </Link>
          <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Menu" className="grid size-10 place-items-center xl:hidden">
            <span aria-hidden className="grid gap-1.5">
              <span className={cn("block h-px w-6 bg-current transition-transform", open && "translate-y-[3.5px] rotate-45")} />
              <span className={cn("block h-px w-6 bg-current transition-transform", open && "-translate-y-[3.5px] -rotate-45")} />
            </span>
          </button>
        </div>
      </div>
      {open && (
        <div className="h-[calc(100dvh-76px)] overflow-y-auto bg-[var(--v2-cream)] px-5 pt-6 pb-10 xl:hidden">
          <ul className="grid gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={() => setOpen(false)} className="block py-3 font-[family-name:var(--font-display)] text-[34px] leading-tight text-[var(--v2-green)]">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex gap-6 text-[11px] tracking-[0.22em] uppercase">
            <Link href={path} locale={otherLocale}>
              {otherLabel}
            </Link>
            <Link href="/" data-keep="">
              {versionA}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
