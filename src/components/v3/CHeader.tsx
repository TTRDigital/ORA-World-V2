"use client";

import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { Logo } from "@/components/layout/Logo";
import { cn } from "@/lib/utils";

type NavLink = { href: string; label: string };

/**
 * Version C header, in the manner of ciprianiresidences-brickell.com: transparent over the opening picture with the
 * white logo, small spaced capitals and an outlined "Inquire"; after a short scroll it turns bone with the gold logo.
 * Phones get a "Menu" button that opens the links full screen, with the number to call.
 */
export function CHeader({ links, inquire, phone, otherLocale, otherLabel, menu, close }: { links: NavLink[]; inquire: string; phone: string; otherLocale: "en" | "es"; otherLabel: string; menu: string; close: string }) {
  const path = usePathname();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const light = !solid;
  const tel = `tel:${phone.replace(/[^\d+]/g, "")}`;
  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 transition-colors duration-500", solid ? "border-b border-travertine-deep bg-bone/97 text-charcoal backdrop-blur-sm" : "bg-gradient-to-b from-[rgb(28_24_18/0.45)] to-transparent text-white")}>
      <div className="mx-auto flex h-[84px] max-w-[1440px] items-center justify-between gap-6 px-5 md:px-10 lg:h-[96px]">
        <Link href="/c" aria-label="ORA World" className="shrink-0">
          {light ? <Logo variant="white" height={96} responsive className="h-[60px] w-auto lg:h-[72px]" /> : <Logo variant="header" height={96} responsive className="h-[60px] w-auto lg:h-[72px]" />}
        </Link>
        <nav aria-label="Version C" className="hidden xl:block">
          <ul className="flex items-center gap-8">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} aria-current={path === l.href ? "page" : undefined} className={cn("inline-flex min-h-11 items-center text-[12px] font-medium tracking-[0.24em] uppercase transition-opacity hover:opacity-70", path === l.href && "underline underline-offset-[10px]")}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-4">
          <Link href={path} locale={otherLocale} className="hidden text-[12px] font-medium tracking-[0.24em] uppercase hover:opacity-70 md:inline">
            {otherLabel}
          </Link>
          <Link href="/c#inquire" className={cn("hidden min-h-11 items-center border px-6 text-[12px] font-semibold tracking-[0.24em] uppercase transition-colors sm:inline-flex", light ? "border-white/80 hover:bg-white hover:text-charcoal" : "border-charcoal/60 hover:bg-charcoal hover:text-bone")}>
            {inquire}
          </Link>
          <button type="button" onClick={() => setOpen(true)} aria-expanded={open} className={cn("inline-flex min-h-11 items-center border px-4 text-[12px] font-semibold tracking-[0.22em] uppercase xl:hidden", light ? "border-white/80" : "border-charcoal/60")}>
            {menu}
          </button>
        </div>
      </div>
      {open && (
        <div role="dialog" aria-modal="true" aria-label={menu} className="fixed inset-0 z-[60] overflow-y-auto bg-basalt px-6 pt-6 pb-12 text-bone" onKeyDown={(e) => e.key === "Escape" && setOpen(false)}>
          <div className="flex items-center justify-between">
            <Logo variant="white" height={60} responsive className="h-[54px] w-auto" />
            <button type="button" autoFocus onClick={() => setOpen(false)} className="inline-flex min-h-12 items-center border border-bone/60 px-5 text-[12px] font-semibold tracking-[0.22em] uppercase">
              {close}
            </button>
          </div>
          <ul className="mt-12">
            {[...links, { href: "/c#inquire", label: inquire }].map((l) => (
              <li key={l.href} className="border-b border-bone/15">
                <Link href={l.href} onClick={() => setOpen(false)} className="block py-5 text-[26px] font-extralight tracking-[0.14em] uppercase">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap items-center gap-6 text-[13px] tracking-[0.2em] uppercase">
            {phone && <a href={tel}>{phone}</a>}
            <Link href={path} locale={otherLocale} onClick={() => setOpen(false)}>
              {otherLabel}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
