"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { LanguageToggle } from "./LanguageToggle";
import { primaryNav } from "./nav";
import { TextRoll } from "@/components/vendor/skiper-ui/skiper58";
import type { MenuTile } from "./MobileSheet";
import { MobileMenu, MenuToggle } from "./MobileMenu";

/**
 * Clean white bar fixed across the top of the page (client, 15 Nov: white, the logo in its original gold, always at
 * the top, full width rather than a floating pill, and "Inquire" as the only action; no phone number). Desktop: logo,
 * tracked capitals navigation, EN | ES and "Inquire". Phones: logo, "Inquire" and the menu.
 * Height 80px phones / 96px desktop (client, 15 Nov: a bigger, clearer logo); main's top padding matches.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- the tiles of the old bottom sheet, kept in the props
export function Header({ tiles }: { tiles: MenuTile[] }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Client, 16 Nov: back to the white bar at the top on every page, the homepage included (the full-screen opening with a
  // clear bar was tried and dropped).
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
      <header
        data-mode="solid"
        className={cn(
          "fixed inset-x-0 top-0 z-[60] border-b bg-white transition-[box-shadow,border-color] duration-500",
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
          {/* Eight links fit on one line from 1280px; narrower screens use the menu (client added Act 60 and Finishes, 18 Nov). */}
          <ul className="hidden items-center xl:flex">
            {primaryNav.map((item) => (
              <li key={item.key}>
                {/* Skiper UI TextRoll: letters roll on hover. The roll is aria-hidden (every letter renders twice),
                    so the link's accessible name comes from aria-label. */}
                <Link
                  href={item.href}
                  aria-label={t(item.key)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-11 items-center px-2.5 text-[12px] font-semibold tracking-[0.2em] whitespace-nowrap uppercase transition-colors hover:text-brass-ink 2xl:px-4",
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
            <MenuToggle
              open={open}
              onClick={() => setOpen((o) => !o)}
              label={open ? t("closeMenu") : t("openMenu")}
            />
          </div>
        </nav>
      </header>
      {/* Client, 24 Nov: Version 2's phone menu on every version. */}
      <MobileMenu
        open={open}
        onClose={() => setOpen(false)}
        top="top-[80px] lg:top-[96px]"
        label={t("openMenu")}
        links={primaryNav.map((i) => ({ href: i.href, label: t(i.key) }))}
        footer={<LanguageToggle className="flex" />}
      />
    </>
  );
}
