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

  // Over the homepage film (client, 16 Nov: "like 888.dolcegabbana.com"): no logo and no buttons, only a thin menu icon
  // on the left and two plain words on the right ("Floor plans", "Inquire"); on phones a white bar at the bottom
  // (menu, Floor plans, Inquire). Both fade in after the opening text. Scrolling down brings the white bar.
  const clearBar = (
    <>
      <header data-mode="clear" className="header-intro pointer-events-none fixed inset-x-0 top-0 z-[60]">
        <nav
          aria-label="Primary"
          className="mx-auto flex h-[80px] max-w-[1440px] items-center justify-between px-5 text-bone [text-shadow:0_1px_10px_rgb(28_22_14/0.6)] lg:h-[96px] lg:px-10"
        >
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={t("openMenu")}
            className="pointer-events-auto hidden min-h-11 items-center gap-3 text-[12.5px] tracking-[0.18em] uppercase hover:text-white lg:inline-flex"
          >
            <span aria-hidden className="flex w-7 flex-col gap-[7px]">
              <span className="h-px w-full bg-current" />
              <span className="h-px w-full bg-current" />
            </span>
          </button>
          <div className="pointer-events-auto hidden items-center gap-10 text-[12.5px] tracking-[0.18em] uppercase lg:flex">
            <Link href="/residences/plans" className="min-h-11 content-center hover:text-white">
              {t("plans")}
            </Link>
            <Link
              href="/#inquire"
              className="min-h-11 content-center hover:text-white"
              data-track="cta_inquire"
              data-track-label="header"
            >
              {t("priceList")}
            </Link>
          </div>
        </nav>
      </header>
      <div className="header-intro fixed inset-x-0 bottom-0 z-[60] grid grid-cols-[68px_1fr_1fr] divide-x divide-travertine-deep/70 border-t border-travertine-deep/70 bg-white pb-[env(safe-area-inset-bottom)] text-[13px] tracking-[0.16em] text-charcoal uppercase lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={t("openMenu")}
          className="flex h-16 items-center justify-center"
        >
          <span aria-hidden className="flex w-7 flex-col gap-[7px]">
            <span className="h-px w-full bg-current" />
            <span className="h-px w-full bg-current" />
          </span>
        </button>
        <Link href="/residences/plans" className="flex h-16 items-center justify-center">
          {t("plans")}
        </Link>
        <Link
          href="/#inquire"
          className="flex h-16 items-center justify-center"
          data-track="cta_inquire"
          data-track-label="bottom-bar"
        >
          {t("priceList")}
        </Link>
      </div>
    </>
  );

  return (
    <>
      {clear ? (
        clearBar
      ) : (
        <>
          <header
            data-mode="solid"
            className={cn(
              "fixed inset-x-0 top-0 z-[60] border-b bg-white transition-[box-shadow,border-color] duration-500",
              isHome && "header-slide-in",
              scrolled
                ? "border-transparent shadow-[0_10px_28px_-18px_rgb(44_36_22/0.35)]"
                : "border-travertine-deep/50",
            )}
          >
            <nav
              aria-label="Primary"
              className="mx-auto flex h-[80px] max-w-[1440px] items-center justify-between gap-3 px-4 text-charcoal min-[400px]:px-5 lg:h-[96px] lg:px-10"
            >
              <Link href="/" aria-label={t("home")} className="flex shrink-0 items-center">
                <Logo variant="header" height={96} priority responsive className="h-[64px] lg:h-[80px]" />
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
                        isActive(item.href) ? "text-brass-ink" : "text-charcoal",
                      )}
                    >
                      <TextRoll>{t(item.key)}</TextRoll>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-2 lg:gap-3">
                <LanguageToggle className="hidden rounded-full px-3 py-1.5 ring-1 ring-travertine-deep lg:flex" />
                <Link
                  href="/#inquire"
                  className="cta min-h-11 px-5 text-[11px]"
                  data-track="cta_inquire"
                  data-track-label="header"
                >
                  {t("priceList")}
                </Link>
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  aria-expanded={open}
                  aria-controls="mobile-menu"
                  aria-label={t("openMenu")}
                  className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-bone-deep text-charcoal lg:hidden"
                >
                  <Menu />
                </button>
              </div>
            </nav>
          </header>
        </>
      )}
      <MobileSheet open={open} onClose={() => setOpen(false)} tiles={tiles} />
    </>
  );
}
