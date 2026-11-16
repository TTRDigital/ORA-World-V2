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
 * Clean white bar fixed across the top of the page (client, 15 Nov: white, the logo in its original gold, always at
 * the top, full width rather than a floating pill, and "Inquire" as the only action; no phone number). Desktop: logo,
 * tracked capitals navigation, EN | ES and "Inquire". Phones: logo, "Inquire" and the menu.
 * Height 80px phones / 96px desktop (client, 15 Nov: a bigger, clearer logo); main's top padding matches.
 */
export function Header({ tiles }: { tiles: MenuTile[] }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Homepage, client 16 Nov (reference: 888.dolcegabbana.com): over the full-screen film the bar is transparent (white
  // logo and links, fading in after the opening text); once the visitor scrolls down, the white bar slides in.
  const isHome = pathname === "/";
  const [overHero, setOverHero] = useState(isHome);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      setOverHero(isHome && window.scrollY < window.innerHeight * 0.55);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname, isHome]);
  const clear = overHero && !open;

  // Only the most specific match is active, so /residences/plans lights "Floor plans", not "Residences" as well.
  const activeHref = primaryNav
    .map((i) => i.href as string)
    .filter((h) => pathname === h || pathname.startsWith(`${h}/`))
    .sort((a, b) => b.length - a.length)[0];
  const isActive = (href: string) => href === activeHref;

  return (
    <>
      <header
        data-mode={clear ? "clear" : "solid"}
        className={cn(
          "fixed inset-x-0 top-0 z-[60] border-b transition-[box-shadow,border-color,background-color] duration-500",
          clear
            ? "header-intro border-transparent bg-transparent"
            : cn("bg-white", isHome && "header-slide-in", scrolled ? "border-transparent shadow-[0_10px_28px_-18px_rgb(44_36_22/0.35)]" : "border-travertine-deep/50"),
        )}
      >
        <nav aria-label="Primary" className={cn("mx-auto flex h-[80px] max-w-[1440px] items-center justify-between gap-3 px-4 min-[400px]:px-5 lg:h-[96px] lg:px-10", clear ? "text-bone [text-shadow:0_1px_10px_rgb(44_36_22/0.7)]" : "text-charcoal")}>
          <Link href="/" aria-label={t("home")} className="flex shrink-0 items-center">
            <Logo variant={clear ? "white" : "header"} height={96} priority responsive className="h-[64px] lg:h-[80px]" />
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
                    "inline-flex min-h-11 items-center px-3 text-[12px] font-semibold tracking-[0.22em] uppercase transition-colors hover:text-brass-ink xl:px-4",
                    clear ? (isActive(item.href) ? "text-brass-light" : "text-bone hover:text-brass-light") : isActive(item.href) ? "text-brass-ink" : "text-charcoal",
                  )}
                >
                  <TextRoll>{t(item.key)}</TextRoll>
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2 lg:gap-3">
            <LanguageToggle dark={clear} className={cn("hidden rounded-full px-3 py-1.5 ring-1 lg:flex", clear ? "ring-bone/35" : "ring-travertine-deep")} />
            <Link href="/#inquire" className="cta min-h-11 px-5 text-[11px] [text-shadow:none]" data-track="cta_inquire" data-track-label="header">
              {t("priceList")}
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={t("openMenu")}
              className={cn("inline-flex size-11 shrink-0 items-center justify-center rounded-full lg:hidden", clear ? "bg-white/15 text-bone ring-1 ring-bone/30 backdrop-blur-sm" : "bg-bone-deep text-charcoal")}
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
