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
 * Solid full-width bar fixed to the top, the same on every scroll position (client feedback: simple, professional,
 * like idealdentalsolutions.com). Logo left; links, language and "Book a visit" right. Below lg: logo and the menu
 * button, which opens the sheet. Height: 76px phones, 88px desktop (main's top padding matches).
 */
export function Header({ tiles }: { tiles: MenuTile[] }) {
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

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[60] border-b bg-bone/97 backdrop-blur-md transition-[box-shadow,border-color] duration-300",
          scrolled ? "border-travertine-deep shadow-[0_8px_24px_-18px_rgb(28_27_25/0.4)]" : "border-transparent",
        )}
      >
        <nav aria-label="Primary" className="mx-auto flex h-[76px] max-w-[1400px] items-center justify-between gap-4 px-4 md:px-8 lg:h-[88px] lg:px-12">
          <Link href="/" aria-label={t("home")} className="flex shrink-0 items-center">
            <Logo height={64} priority responsive className="logo-lift h-[56px] lg:h-[64px]" />
          </Link>
          <div className="flex items-center gap-1 lg:gap-2">
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
                      "hairline inline-flex min-h-11 items-center px-3 text-[15px] font-semibold tracking-[0.02em] text-charcoal uppercase transition-colors hover:text-brass-ink xl:px-4",
                      isActive(item.href) && "is-active text-brass-ink",
                    )}
                  >
                    <TextRoll>{t(item.key)}</TextRoll>
                  </Link>
                </li>
              ))}
            </ul>
            <LanguageToggle className="mx-2 hidden lg:flex" />
            <Link href="/visit" className="pill pill-brass hidden min-h-11 sm:inline-flex" data-track="cta_book_visit" data-track-label="header">
              {t("visit")}
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={t("openMenu")}
              className="inline-flex size-11 items-center justify-center rounded-full bg-bone-deep text-charcoal lg:hidden"
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
