"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { ImageRef } from "@/content/types";
import { cn } from "@/lib/utils";
import { Picture } from "@/components/ui/Picture";
import { IslandMap, ISLAND_PATH, type MapPin } from "@/components/place/IslandMap";
import { ArrowRight } from "@/components/ui/Icons";

export type PortfolioCard = {
  slug: string;
  name: string;
  tagline: string;
  image: ImageRef | null;
  href: string | null;
  pin: { x: number; y: number; municipality: string } | null;
  revealed: boolean;
};

/** Island map plus the twelve location cards; a pin selects its card, a card pulses its pin. */
export function PortfolioStage({ items }: { items: PortfolioCard[] }) {
  const t = useTranslations("portfolio");
  const tc = useTranslations("common");
  const locale = useLocale() as "en" | "es";
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const cardRefs = useRef(new Map<string, HTMLElement>());
  const pins: MapPin[] = items.filter((i) => i.pin).map((i) => ({ slug: i.slug, name: i.name, x: i.pin!.x, y: i.pin!.y, municipality: i.pin!.municipality }));

  useEffect(() => {
    if (!selected) return;
    const el = cardRefs.current.get(selected);
    el?.scrollIntoView({ block: "nearest", behavior: document.documentElement.classList.contains("reduced-motion") ? "auto" : "smooth" });
  }, [selected]);

  return (
    <div className="grid gap-6 md:gap-8">
      <IslandMap pins={pins} selected={selected} hovered={hovered} onSelect={setSelected} onHover={setHovered} />
      {selected && (
        <div className="-mt-2 flex justify-end">
          <button type="button" className="chip" onClick={() => setSelected(null)}>
            {t("clear")}
          </button>
        </div>
      )}
      <ul className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4" data-testid="portfolio-cards">
        {items.map((it, i) => {
          const active = selected === it.slug;
          const dark = !it.revealed;
          return (
            <li
              key={it.slug}
              ref={(el) => {
                if (el) cardRefs.current.set(it.slug, el);
              }}
              data-reveal
              style={{ "--reveal-delay": `${(i % 4) * 70}ms` } as React.CSSProperties}
            >
              <article
                data-card={it.slug}
                onMouseEnter={() => setHovered(it.slug)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(it.slug)}
                onBlur={() => setHovered(null)}
                className={cn(
                  "card lift flex h-full flex-col overflow-hidden",
                  dark ? "card-dark" : "bg-bone",
                  active && "shadow-lift ring-2 ring-brass ring-offset-2 ring-offset-travertine",
                  hovered === it.slug && !active && "shadow-lift",
                )}
              >
                {dark ? (
                  <div className="relative flex items-center justify-center bg-basalt-soft" style={{ aspectRatio: "16/10" }}>
                    <svg viewBox="0 0 1000 420" className="h-auto w-[78%]" aria-hidden>
                      <path d={ISLAND_PATH} fill="none" stroke="#D4B987" strokeWidth="3" opacity="0.35" />
                      <ellipse cx="972" cy="300" rx="22" ry="8" fill="none" stroke="#D4B987" strokeWidth="3" opacity="0.35" />
                    </svg>
                  </div>
                ) : it.image ? (
                  <Picture image={it.image} locale={locale} sizes="(min-width: 1024px) 24vw, 46vw" ratio="16/10" rounded="none" className="ambient-zoom" />
                ) : (
                  /* No published render yet: a brand card that places the location on the island instead. */
                  <div
                    className="relative overflow-hidden bg-[radial-gradient(120%_90%_at_70%_20%,var(--color-bone)_0%,var(--color-travertine)_70%)]"
                    style={{ aspectRatio: "16/10" }}
                    data-testid="brand-card"
                  >
                    <svg viewBox="0 0 1000 420" className="absolute inset-x-[8%] top-[18%] h-auto w-[84%]" aria-hidden>
                      <path d={ISLAND_PATH} fill="var(--color-bone)" stroke="var(--color-brass)" strokeWidth="3" opacity="0.9" />
                      {it.pin && (
                        <g transform={`translate(${it.pin.x * 10} ${it.pin.y * 4.2})`}>
                          <circle r="34" fill="var(--color-brass)" opacity="0.18" className="brand-pin-ring" />
                          <circle r="13" fill="var(--color-brass)" />
                        </g>
                      )}
                    </svg>
                    <Image src="/brand/ora-world-logo-gold.png" alt="" width={44} height={31} className="absolute top-3 right-3" style={{ width: 44, height: "auto" }} />
                    <span className="absolute bottom-3 left-3 rounded-full bg-bone/90 px-2.5 py-1 text-[11px] font-semibold text-brass-ink">{t("renderTbc")}</span>
                  </div>
                )}
                <div className="flex flex-1 flex-col p-3.5 md:p-4">
                  {it.pin && (
                    <p className="mb-1 flex items-center gap-1 text-[12px] font-semibold text-brass-ink">
                      <span aria-hidden className={cn("size-1.5 rounded-full bg-brass", (active || hovered === it.slug) && "brand-pin-dot")} />
                      {it.pin.municipality}
                    </p>
                  )}
                  <h3 className={cn("display-s", dark && "text-bone")}>{it.name}</h3>
                  <p className={cn("small mt-1 flex-1", dark ? "text-bone/70" : "text-charcoal-soft")}>{it.tagline}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {it.href ? (
                      <Link href={it.href} className="pill pill-basalt min-h-10 gap-1 px-4" data-track="portfolio_explore" data-track-label={it.slug}>
                        {tc("explore")} <ArrowRight width={16} height={16} />
                      </Link>
                    ) : (
                      <span className={cn("chip opacity-70", dark && "on-dark")} aria-disabled="true">
                        {tc("comingSoon")}
                      </span>
                    )}
                    {!it.pin && (
                      <span className={cn("text-[11px] font-semibold", dark ? "text-bone/50" : "text-charcoal-soft")}>{t("unpinned")}</span>
                    )}
                  </div>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
