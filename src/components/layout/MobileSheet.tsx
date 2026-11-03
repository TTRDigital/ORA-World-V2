"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";
import { LanguageToggle } from "./LanguageToggle";
import { Close } from "@/components/ui/Icons";
import type { ImageRef } from "@/content/types";
import { primaryNav } from "./nav";

export type MenuTile = { key: (typeof primaryNav)[number]["key"]; href: string; image: ImageRef };

/** Bottom sheet menu with large rounded tiles, each with a small render; contact and language at the foot. */
export function MobileSheet({ open, onClose, tiles }: { open: boolean; onClose: () => void; tiles: MenuTile[] }) {
  const t = useTranslations("nav");
  const locale = useLocale() as "en" | "es";
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const firstPath = useRef(pathname);

  useEffect(() => {
    if (!open) return;
    lockScroll();
    const node = ref.current;
    const focusable = () => Array.from(node?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []);
    focusable()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const f = focusable();
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      unlockScroll();
    };
  }, [open, onClose]);

  useEffect(() => {
    if (firstPath.current !== pathname) {
      firstPath.current = pathname;
      if (open) onClose();
    }
  }, [pathname, open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] lg:hidden" role="dialog" aria-modal="true" aria-label={t("menu")} id="mobile-menu">
      <button type="button" aria-label={t("closeMenu")} onClick={onClose} className="fade-in absolute inset-0 bg-basalt/50" />
      <div ref={ref} data-lenis-prevent className="sheet-up absolute inset-x-0 bottom-0 max-h-[92dvh] overflow-y-auto rounded-t-[28px] bg-bone px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-travertine-deep" aria-hidden />
        <div className="mb-3 flex items-center justify-between">
          <p className="label">{t("menu")}</p>
          <button type="button" onClick={onClose} aria-label={t("closeMenu")} className="inline-flex size-11 items-center justify-center rounded-full bg-bone-deep">
            <Close />
          </button>
        </div>
        <ul className="grid grid-cols-2 gap-3">
          {tiles.map((tile, i) => (
            <li key={tile.key} className={i === 0 ? "col-span-2" : undefined}>
              <Link href={tile.href} className="card lift relative block overflow-hidden rounded-[20px] bg-travertine" style={{ aspectRatio: i === 0 ? "16/9" : "4/3" }}>
                <Image src={tile.image.src} alt="" fill sizes={i === 0 ? "(max-width: 1024px) 92vw, 600px" : "(max-width: 1024px) 46vw, 300px"} quality={80} className="object-cover" style={{ objectPosition: tile.image.focal }} />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-basalt/80 to-transparent p-4 pt-10 text-[17px] font-semibold text-bone">{t(tile.key)}</span>
              </Link>
            </li>
          ))}
          <li className="col-span-2">
            <Link href="/visit" className="pill pill-brass w-full min-h-12">
              {t("visit")}
            </Link>
          </li>
        </ul>
        <div className="mt-4 flex items-center justify-between border-t border-travertine-deep pt-4">
          <div className="flex gap-4 text-[14px] font-semibold text-charcoal-soft">
            <Link href="/faq">{t("faq")}</Link>
            <Link href="/brokers">{t("brokers")}</Link>
            <Link href="/visit">{t("contact")}</Link>
          </div>
          <LanguageToggle />
        </div>
        <p className="visually-hidden">{locale}</p>
      </div>
    </div>
  );
}
