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
 * Floating pill bar, centred, 12px from the top. Glass over imagery, solid bone over content. On scroll
 * down it compacts to logo, menu and "Book a visit"; scrolling up expands it again.
 */
export function Header({ tiles }: { tiles: MenuTile[] }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const [overHero, setOverHero] = useState(true);

  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setCompact(y > 120 && y > last);
        setOverHero(y < 80);
        last = y;
        ticking = false;
      });
    };
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
            "pointer-events-auto flex items-center gap-2 rounded-full pl-3 pr-2 shadow-[0_8px_30px_-12px_rgb(28_27_25/0.25)] transition-[padding,background-color,box-shadow] duration-500 [transition-timing-function:var(--ease-out)]",
            overHero ? "glass" : "bg-bone",
            compact ? "py-1.5" : "py-2",
          )}
        >
          <Link href="/" aria-label={t("home")} className="flex items-center rounded-full py-1 pr-2">
            <Logo height={44} priority />
          </Link>
          <ul className={cn("hidden items-center gap-1 lg:flex", compact && "lg:hidden")}>
            {primaryNav.map((item) => (
              <li key={item.key}>
                {/* Skiper UI TextRoll: letters roll on hover. The roll is aria-hidden (every letter renders twice),
                    so the link's accessible name comes from aria-label. */}
                <Link
                  href={item.href}
                  aria-label={t(item.key)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn("hairline inline-flex min-h-10 items-center px-3 text-[14px] font-semibold text-charcoal transition-colors hover:text-brass-ink", isActive(item.href) && "is-active text-brass-ink")}
                >
                  <TextRoll>{t(item.key)}</TextRoll>
                </Link>
              </li>
            ))}
          </ul>
          <LanguageToggle className={cn("ml-2 hidden lg:flex", compact && "lg:hidden")} />
          <Link href="/visit" className="pill pill-brass ml-1 hidden min-h-11 sm:inline-flex" data-track="cta_book_visit" data-track-label="header">
            {t("visit")}
          </Link>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={t("openMenu")}
            className={cn("inline-flex size-11 items-center justify-center rounded-full bg-bone-deep text-charcoal lg:hidden", compact && "lg:inline-flex")}
          >
            <Menu />
          </button>
        </nav>
      </header>
      <MobileSheet open={open} onClose={() => setOpen(false)} tiles={tiles} />
    </>
  );
}
