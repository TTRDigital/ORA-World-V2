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
 * Fixed bar, 12px from the top, the same on every scroll position (client feedback: it should not shrink or change
 * while scrolling; simple and professional). Desktop: logo, links, language and "Book a visit". Below lg: logo,
 * "Book a visit" (from sm) and the menu button, which opens the sheet.
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
      <header className="pointer-events-none fixed inset-x-0 top-3 z-[60] flex justify-center px-3">
        <nav
          aria-label="Primary"
          className={cn(
            "pointer-events-auto flex w-full max-w-[1240px] items-center justify-between gap-2 rounded-full bg-bone/95 py-2 pr-2 pl-2 backdrop-blur-md transition-shadow duration-300 md:pl-3 lg:pr-2.5 lg:pl-4",
            scrolled ? "shadow-[0_10px_30px_-14px_rgb(28_27_25/0.35)]" : "shadow-[0_6px_20px_-14px_rgb(28_27_25/0.2)]",
          )}
        >
          <Link
            href="/"
            aria-label={t("home")}
            className="flex shrink-0 items-center rounded-full px-2 py-1 md:px-4 lg:px-6"
          >
            <Logo
              height={76}
              priority
              responsive
              className="logo-lift h-[58px] md:h-[68px] lg:h-[76px]"
            />
          </Link>
          <ul className="hidden items-center gap-1 lg:flex xl:gap-3">
            {primaryNav.map((item) => (
              <li key={item.key}>
                {/* Skiper UI TextRoll: letters roll on hover. The roll is aria-hidden (every letter renders twice),
                    so the link's accessible name comes from aria-label. */}
                <Link
                  href={item.href}
                  aria-label={t(item.key)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "hairline inline-flex min-h-10 items-center px-3 text-[14px] font-semibold text-charcoal transition-colors hover:text-brass-ink",
                    isActive(item.href) && "is-active text-brass-ink",
                  )}
                >
                  <TextRoll>{t(item.key)}</TextRoll>
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex shrink-0 items-center gap-2">
            <LanguageToggle className="mr-2 hidden lg:flex" />
            <Link
              href="/visit"
              className="pill pill-brass hidden min-h-11 sm:inline-flex"
              data-track="cta_book_visit"
              data-track-label="header"
            >
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
