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
 * Floating white bar (client, 15 Nov: white background, the logo in its original gold, and "Inquire" plus the phone
 * number at the top on every screen), the same on every scroll position: logo, tracked capitals navigation, the sales
 * line, EN | ES and one gold button, "Inquire". Phones: logo, the phone number, "Inquire" and the menu.
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
            "pointer-events-auto mx-auto flex h-[72px] max-w-[1400px] items-center justify-between gap-2 rounded-full bg-white/97 pr-2 pl-4 text-charcoal ring-1 ring-travertine-deep/40 backdrop-blur-md transition-shadow duration-300 min-[400px]:pl-5 lg:h-[80px] lg:gap-3 lg:pr-3 lg:pl-10",
            scrolled ? "shadow-[0_14px_34px_-16px_rgb(44_36_22/0.4)]" : "shadow-[0_10px_26px_-18px_rgb(44_36_22/0.3)]",
          )}
        >
          <Link href="/" aria-label={t("home")} className="flex shrink-0 items-center">
            <Logo variant="gold" height={72} priority responsive className="h-[46px] min-[400px]:h-[50px] lg:h-[62px]" />
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
          <div className="flex min-w-0 items-center gap-1.5 min-[400px]:gap-2 lg:gap-3">
            {phone && (
              <a
                href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                className="inline-flex min-h-11 items-center px-1 text-[12px] font-semibold whitespace-nowrap text-charcoal hover:text-brass-ink max-[339px]:hidden min-[400px]:text-[13px] lg:max-xl:hidden lg:px-0 lg:tracking-[0.08em]"
                data-track="call"
                data-track-label="header"
              >
                {phone}
              </a>
            )}
            <LanguageToggle className="hidden rounded-full px-3 py-1.5 ring-1 ring-travertine-deep lg:flex" />
            <Link href="/#inquire" className="cta min-h-10 px-3.5 text-[10px] tracking-[0.16em] min-[400px]:px-4 lg:min-h-11 lg:px-5 lg:text-[11px] lg:tracking-[0.2em]" data-track="cta_inquire" data-track-label="header">
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
      <MobileSheet open={open} onClose={() => setOpen(false)} tiles={tiles} />
    </>
  );
}
