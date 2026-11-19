"use client";

import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { Logo } from "@/components/layout/Logo";
import { cn } from "@/lib/utils";

type NavLink = { href: string; label: string };

/**
 * Version C header (old-money, for an older reader): a thin top line with the telephone number; the logo centred with a
 * plain row of words under it; once the visitor scrolls, a slim bar stays at the top. On phones a "Menu" button (a
 * word, not an icon) opens large links and the number to call.
 */
export function CHeader({ links, inquire, phone, place, otherLocale, otherLabel, menu, close }: { links: NavLink[]; inquire: string; phone: string; place: string; otherLocale: "en" | "es"; otherLabel: string; menu: string; close: string }) {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 220);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const tel = `tel:${phone.replace(/[^\d+]/g, "")}`;
  const active = (href: string) => !href.includes("#") && path === href.replace(/^\/c/, "/c");
  return (
    <>
      {/* Top line: where, and the number to call. */}
      <div className="bg-basalt px-5 text-bone md:px-10">
        <div className="mx-auto flex min-h-10 max-w-[1200px] items-center justify-between gap-4 text-[13px] tracking-[0.08em]">
          <span className="hidden sm:inline">{place}</span>
          {phone ? (
            <a href={tel} className="inline-flex min-h-10 items-center gap-2 hover:underline">
              <span aria-hidden>☏</span> {phone}
            </a>
          ) : (
            <span />
          )}
          <Link href={path} locale={otherLocale} className="inline-flex min-h-10 items-center hover:underline">
            {otherLabel}
          </Link>
        </div>
      </div>

      {/* The masthead: the logo centred, the words under it. */}
      <header className="border-b border-travertine-deep bg-bone px-5 md:px-10">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex items-center justify-between py-5 lg:justify-center lg:py-7">
            <Link href="/c" aria-label="ORA World" className="shrink-0">
              <Logo variant="header" height={110} responsive className="h-[70px] w-auto lg:h-[96px]" />
            </Link>
            <button type="button" onClick={() => setOpen(true)} aria-expanded={open} className="inline-flex min-h-12 items-center gap-3 border border-charcoal/40 px-5 text-[14px] font-semibold tracking-[0.18em] text-charcoal uppercase lg:hidden">
              {menu}
            </button>
          </div>
          <nav aria-label="Version C" className="hidden border-t border-travertine-deep lg:block">
            <ul className="flex items-center justify-center gap-10 py-4">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} aria-current={active(l.href) ? "page" : undefined} className={cn("inline-flex min-h-11 items-center text-[14px] font-semibold tracking-[0.18em] text-charcoal uppercase hover:text-brass-ink", active(l.href) && "underline decoration-brass underline-offset-[10px]")}>
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/c#inquire" className="inline-flex min-h-11 items-center bg-basalt px-6 text-[13px] font-semibold tracking-[0.2em] text-bone uppercase hover:bg-basalt-soft">
                  {inquire}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* After the masthead scrolls away: a slim bar that stays. */}
      <div aria-hidden={!scrolled} className={cn("fixed inset-x-0 top-0 z-50 border-b border-travertine-deep bg-bone/97 px-5 backdrop-blur-sm transition-transform duration-300 md:px-10", scrolled ? "translate-y-0" : "-translate-y-full")}>
        <div className="mx-auto flex h-[68px] max-w-[1200px] items-center justify-between gap-6">
          <Link href="/c" aria-label="ORA World" tabIndex={scrolled ? 0 : -1} className="shrink-0">
            <Logo variant="header" height={60} responsive className="h-[50px] w-auto" />
          </Link>
          <ul className="hidden items-center gap-8 lg:flex">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} tabIndex={scrolled ? 0 : -1} className="text-[13px] font-semibold tracking-[0.16em] text-charcoal uppercase hover:text-brass-ink">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3">
            <Link href="/c#inquire" tabIndex={scrolled ? 0 : -1} className="hidden min-h-11 items-center bg-basalt px-5 text-[13px] font-semibold tracking-[0.2em] text-bone uppercase hover:bg-basalt-soft sm:inline-flex">
              {inquire}
            </Link>
            <button type="button" tabIndex={scrolled ? 0 : -1} onClick={() => setOpen(true)} className="inline-flex min-h-11 items-center border border-charcoal/40 px-4 text-[13px] font-semibold tracking-[0.18em] text-charcoal uppercase lg:hidden">
              {menu}
            </button>
          </div>
        </div>
      </div>

      {/* The menu on phones and tablets. */}
      {open && (
        <div role="dialog" aria-modal="true" aria-label={menu} className="fixed inset-0 z-[60] overflow-y-auto bg-bone px-6 pt-6 pb-12" onKeyDown={(e) => e.key === "Escape" && setOpen(false)}>
          <div className="flex items-center justify-between">
            <Logo variant="header" height={60} responsive className="h-[54px] w-auto" />
            <button type="button" autoFocus onClick={() => setOpen(false)} className="inline-flex min-h-12 items-center border border-charcoal/40 px-5 text-[14px] font-semibold tracking-[0.18em] text-charcoal uppercase">
              {close}
            </button>
          </div>
          <ul className="mt-10 border-t border-travertine-deep">
            {[...links, { href: "/c#inquire", label: inquire }].map((l) => (
              <li key={l.href} className="border-b border-travertine-deep">
                <Link href={l.href} onClick={() => setOpen(false)} className="block py-5 font-[family-name:var(--font-display)] text-[32px] leading-tight font-medium text-charcoal">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          {phone && (
            <a href={tel} className="mt-10 block text-[20px] font-semibold text-charcoal">
              ☏ {phone}
            </a>
          )}
        </div>
      )}
    </>
  );
}
