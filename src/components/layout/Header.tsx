"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { LanguageToggle } from "./LanguageToggle";
import { primaryNav } from "./nav";
import { Menu } from "@/components/ui/Icons";
import { TextRoll } from "@/components/vendor/skiper-ui/skiper58";
import { MobileSheet, type MenuTile } from "./MobileSheet";

/**
 * Floating dark bar (client reference: theresidencesatcipriani.com), the same on every scroll position: logo, tracked
 * capitals navigation, the sales line, EN | ES and a gold "Get price list". Below lg: logo, price list and the menu.
 * Height 72px phones / 80px desktop, 12px from the top; main's top padding matches.
 */
export function Header({ tiles, phone }: { tiles: MenuTile[]; phone?: string | null }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Only the shadow deepens once content passes under the bar; size, layout and colour never change.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // Only the most specific match is active, so /residences/plans lights "Floor plans", not "Residences" as well.
  const activeHref = primaryNav
    .map((i) => i.href as string)
    .filter((h) => pathname === h || pathname.startsWith(`${h}/`))
    .sort((a, b) => b.length - a.length)[0];
  const isActive = (href: string) => href === activeHref;

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-3 z-[60] px-3 lg:px-6">
        <nav
          aria-label="Primary"
          className={cn(
            "pointer-events-auto mx-auto flex h-[72px] max-w-[1400px] items-center justify-between gap-3 rounded-full bg-basalt/95 pr-2 pl-7 text-bone backdrop-blur-md transition-shadow duration-300 lg:h-[80px] lg:pr-3 lg:pl-10",
            scrolled ? "shadow-[0_14px_34px_-16px_rgb(0_0_0/0.55)]" : "shadow-[0_10px_26px_-18px_rgb(0_0_0/0.45)]",
          )}
        >
          <Link href="/" aria-label={t("home")} className="flex shrink-0 items-center">
            <Logo variant="white" height={64} priority responsive className="h-[50px] lg:h-[58px]" />
          </Link>
          <ul className="hidden items-center lg:flex">
            {primaryNav.map((item) => (
              <li key={item.key}>
                {/* Skiper UI TextRoll: letters roll on hover. The roll is aria-hidden (every letter renders twice),
                    so the link's accessible name comes from aria-label. */}
                <Link
                  href={item.href}
                  aria-label={t(item.key)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-11 items-center px-3 text-[12px] font-semibold tracking-[0.22em] uppercase transition-colors hover:text-brass-light xl:px-4",
                    isActive(item.href) ? "text-brass-light" : "text-bone/85",
                  )}
                >
                  <TextRoll>{t(item.key)}</TextRoll>
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2 lg:gap-3">
            {phone && (
              <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="hidden text-[13px] font-semibold tracking-[0.08em] text-bone/90 hover:text-brass-light xl:inline">
                {phone}
              </a>
            )}
            <LanguageToggle dark className="hidden rounded-full px-3 py-1.5 ring-1 ring-bone/20 lg:flex" />
            <Link href="/#contact" className="cta hidden min-h-11 px-5 text-[11px] lg:inline-flex" data-track="cta_price_list" data-track-label="header">
              {t("priceList")}
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={t("openMenu")}
              className="inline-flex size-11 items-center justify-center rounded-full bg-white/10 text-bone lg:hidden"
            >
              <Menu />
            </button>
          </div>
        </nav>
      </header>
      <MobileSheet open={open} onClose={() => setOpen(false)} tiles={tiles} />
    </>
  );
}
