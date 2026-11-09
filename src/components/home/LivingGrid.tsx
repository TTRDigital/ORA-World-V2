"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { AmenityCategory, ImageRef, Locale } from "@/content/types";
import { cn } from "@/lib/utils";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";
import { Picture } from "@/components/ui/Picture";
import { Close, ArrowUpRight, ArrowLeft, ArrowRight } from "@/components/ui/Icons";
import { FamilyPetsCard } from "./FamilyPetsCard";

export type LivingTile = {
  slug: string;
  category: AmenityCategory;
  /** lg: 2 columns (wide landscapes), tall: 2 rows (portrait photos), md/sm: one cell. */
  size: "lg" | "tall" | "md" | "sm";
  name: string;
  description: string;
  image: ImageRef;
};
type Filter = "all" | AmenityCategory;

const CATEGORIES: AmenityCategory[] = ["wellness", "family", "pets", "resort", "eco"];
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const DURATION = 500;

type Leaving = { tile: LivingTile; top: number; left: number; width: number; height: number };

const reduced = () =>
  typeof document !== "undefined" && document.documentElement.classList.contains("reduced-motion");

/**
 * Filter chips + bento grid. Filtering is a real FLIP: rects are measured before the change, the new
 * positions are inverted with a transform and played over 500ms; leaving tiles fade and scale out from
 * their last position, entering tiles fade in. Skipped under reduced motion.
 */
export function LivingGrid({
  locale,
  tiles,
  family,
  pets,
}: {
  locale: Locale;
  tiles: LivingTile[];
  family: string[];
  pets: string[];
}) {
  const t = useTranslations("living");
  const tc = useTranslations("common");
  const [filter, setFilter] = useState<Filter>("all");
  const [leaving, setLeaving] = useState<Leaving[]>([]);
  const [open, setOpen] = useState<LivingTile | null>(null);
  const gridRef = useRef<HTMLUListElement>(null);
  const prevRects = useRef<Map<string, DOMRect> | null>(null);
  const prevHeight = useRef(0);
  const [interacted, setInteracted] = useState(false);
  const leaveTimer = useRef<number>(0);
  const chipsRef = useRef<HTMLDivElement>(null);

  const visible = filter === "all" ? tiles : tiles.filter((x) => x.category === filter);
  const counts = Object.fromEntries(
    CATEGORIES.map((c) => [c, tiles.filter((x) => x.category === c).length]),
  ) as Record<AmenityCategory, number>;

  const applyFilter = useCallback(
    (next: Filter) => {
      if (next === filter) return;
      setInteracted(true);
      const grid = gridRef.current;
      if (grid && !reduced()) {
        const gridRect = grid.getBoundingClientRect();
        const map = new Map<string, DOMRect>();
        grid
          .querySelectorAll<HTMLElement>("[data-slug]")
          .forEach((el) => map.set(el.dataset.slug!, el.getBoundingClientRect()));
        prevRects.current = map;
        prevHeight.current = gridRect.height;
        const nextSet = new Set(
          (next === "all" ? tiles : tiles.filter((x) => x.category === next)).map((x) => x.slug),
        );
        const out: Leaving[] = visible
          .filter((x) => !nextSet.has(x.slug))
          .map((x) => {
            const r = map.get(x.slug)!;
            return {
              tile: x,
              top: r.top - gridRect.top,
              left: r.left - gridRect.left,
              width: r.width,
              height: r.height,
            };
          });
        window.clearTimeout(leaveTimer.current);
        setLeaving(out);
        leaveTimer.current = window.setTimeout(() => setLeaving([]), DURATION + 20);
      } else {
        prevRects.current = null;
      }
      setFilter(next);
      chipsRef.current?.querySelectorAll<HTMLElement>(".count").forEach((el, i) => {
        if (!reduced())
          el.animate([{ transform: "scale(1)" }, { transform: "scale(1.35)" }, { transform: "scale(1)" }], {
            duration: 420,
            delay: i * 30,
            easing: EASE,
          });
      });
    },
    [filter, tiles, visible],
  );

  useLayoutEffect(() => {
    const grid = gridRef.current;
    const prev = prevRects.current;
    if (!grid || !prev) return;
    prevRects.current = null;
    const gridRect = grid.getBoundingClientRect();
    grid.querySelectorAll<HTMLElement>("[data-slug]").forEach((el) => {
      const slug = el.dataset.slug!;
      const now = el.getBoundingClientRect();
      const before = prev.get(slug);
      if (before) {
        const dx = before.left - now.left;
        const dy = before.top - now.top;
        const sx = before.width / now.width;
        const sy = before.height / now.height;
        if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5 || Math.abs(sx - 1) > 0.01 || Math.abs(sy - 1) > 0.01) {
          el.style.transformOrigin = "top left";
          el.animate(
            [{ transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})` }, { transform: "none" }],
            { duration: DURATION, easing: EASE },
          );
        }
      } else {
        el.animate(
          [
            { opacity: 0, transform: "scale(0.94)" },
            { opacity: 1, transform: "none" },
          ],
          { duration: DURATION, easing: EASE, delay: 60 },
        );
      }
    });
    if (prevHeight.current && Math.abs(prevHeight.current - gridRect.height) > 1) {
      grid.animate([{ height: `${prevHeight.current}px` }, { height: `${gridRect.height}px` }], {
        duration: DURATION,
        easing: EASE,
      });
    }
    grid.querySelectorAll<HTMLElement>("[data-leaving]").forEach((el) => {
      el.animate(
        [
          { opacity: 1, transform: "scale(1)" },
          { opacity: 0, transform: "scale(0.94)" },
        ],
        { duration: DURATION * 0.7, easing: EASE, fill: "forwards" },
      );
    });
  }, [filter]);

  useEffect(() => () => window.clearTimeout(leaveTimer.current), []);

  const tileSizes = (size: LivingTile["size"]) =>
    // Matches the rendered tile: 2 columns below md (lg spans both), 4 columns above, capped by the panel width.
    size === "lg"
      ? "(max-width: 767px) 100vw, (max-width: 1440px) 50vw, 660px"
      : "(max-width: 767px) 50vw, (max-width: 1440px) 25vw, 330px";

  return (
    <div>
      <div
        ref={chipsRef}
        role="group"
        aria-label={t("filterLabel")}
        className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-2"
        data-reveal
      >
        <button
          type="button"
          className="chip shrink-0"
          aria-pressed={filter === "all"}
          onClick={() => applyFilter("all")}
        >
          {tc("all")} <span className="count">{tiles.length}</span>
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            className="chip shrink-0"
            aria-pressed={filter === c}
            onClick={() => applyFilter(c)}
          >
            {t(c)} <span className="count">{counts[c]}</span>
          </button>
        ))}
      </div>
      <p className="visually-hidden" aria-live="polite">
        {tc("tiles", { count: visible.length })}
      </p>
      <ul
        ref={gridRef}
        className="relative mt-4 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4"
        style={{ gridAutoFlow: "dense" }}
      >
        <li className="col-span-2" data-slug="family-pets" data-reveal={interacted ? undefined : ""}>
          <FamilyPetsCard family={family} pets={pets} />
        </li>
        {visible.map((tile, i) => (
          <li
            key={tile.slug}
            data-slug={tile.slug}
            className={cn(tile.size === "lg" && "col-span-2", tile.size === "tall" && "row-span-2")}
            data-reveal={interacted ? undefined : ""}
            style={{ "--reveal-delay": `${Math.min(i, 10) * 40}ms` } as React.CSSProperties}
          >
            <Tile
              tile={tile}
              locale={locale}
              sizes={tileSizes(tile.size)}
              onOpen={() => setOpen(tile)}
              categoryLabel={t(tile.category)}
            />
          </li>
        ))}
        {leaving.map((l) => (
          <li
            key={`leaving-${l.tile.slug}`}
            data-leaving
            aria-hidden
            className="pointer-events-none absolute"
            style={{ top: l.top, left: l.left, width: l.width, height: l.height }}
          >
            <Tile
              tile={l.tile}
              locale={locale}
              sizes={tileSizes(l.tile.size)}
              onOpen={() => {}}
              tabIndex={-1}
            />
          </li>
        ))}
      </ul>
      {open && (
        <TileSheet
          tile={open}
          locale={locale}
          onClose={() => setOpen(null)}
          position={{ index: visible.findIndex((x) => x.slug === open.slug), total: visible.length }}
          onStep={(d) => {
            const i = visible.findIndex((x) => x.slug === open.slug);
            setOpen(visible[(i + d + visible.length) % visible.length]);
          }}
        />
      )}
    </div>
  );
}

function Tile({
  tile,
  locale,
  sizes,
  onOpen,
  tabIndex,
  categoryLabel,
}: {
  tile: LivingTile;
  locale: Locale;
  sizes: string;
  onOpen: () => void;
  tabIndex?: number;
  categoryLabel?: string;
}) {
  const frame = tile.size === "lg" ? "aspect-[16/9]" : tile.size === "tall" ? "aspect-[2/3]" : "aspect-[4/3]";
  return (
    <button
      type="button"
      onClick={onOpen}
      tabIndex={tabIndex}
      className={cn(
        "card lift ambient-zoom group relative block h-full w-full overflow-hidden rounded-[20px] bg-travertine text-left",
        frame,
      )}
    >
      {/* The frame fills the tile, so a tile stretched by a taller row never over-zooms its photo. */}
      <Picture
        image={tile.image}
        locale={locale}
        sizes={sizes}
        ratio="auto"
        reveal={false}
        rounded="none"
        className="absolute inset-0 h-full w-full rounded-none"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-basalt/85 via-basalt/30 to-transparent transition-[height] duration-500 [transition-timing-function:var(--ease-out)] md:group-hover:h-full"
      />
      {categoryLabel && (
        <span
          className="pointer-events-none absolute top-3 left-3 rounded-full bg-bone/90 px-2.5 py-1 text-[11px] font-semibold text-charcoal md:top-4 md:left-4"
        >
          {categoryLabel}
        </span>
      )}
      <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3 md:p-4">
        <span className="min-w-0">
          <span className="block text-[15px] leading-tight font-semibold text-bone md:text-[17px]">
            {tile.name}
          </span>
          {/* Desktop hover: the published description slides up under the name (touch opens the sheet instead). */}
          <span
            aria-hidden
            className="hidden max-h-0 overflow-hidden text-[13px] leading-snug text-bone/90 opacity-0 transition-[max-height,opacity,margin] duration-500 [transition-timing-function:var(--ease-out)] md:block md:group-hover:mt-1.5 md:group-hover:max-h-20 md:group-hover:opacity-100"
          >
            {tile.description}
          </span>
        </span>
        <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-bone/90 text-basalt opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
          <ArrowUpRight width={16} height={16} />
        </span>
      </span>
    </button>
  );
}

function TileSheet({
  tile,
  locale,
  onClose,
  onStep,
  position,
}: {
  tile: LivingTile;
  locale: Locale;
  onClose: () => void;
  onStep: (d: 1 | -1) => void;
  position: { index: number; total: number };
}) {
  const t = useTranslations("living");
  const tc = useTranslations("common");
  const ref = useRef<HTMLDivElement>(null);
  const [mobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches,
  );

  useEffect(() => {
    lockScroll();
    const node = ref.current;
    const focusable = () =>
      Array.from(node?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []);
    focusable()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onStep(1);
      if (e.key === "ArrowLeft") onStep(-1);
      if (e.key === "Tab") {
        const f = focusable();
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      unlockScroll();
    };
  }, [onClose, onStep]);

  return (
    <div
      className="fixed inset-0 z-[85]"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`sheet-${tile.slug}`}
    >
      <button
        type="button"
        aria-label={tc("close")}
        onClick={onClose}
        className="fade-in absolute inset-0 bg-basalt/50"
      />
      <div
        ref={ref}
        data-lenis-prevent
        className={cn(
          "absolute bg-bone shadow-lift",
          mobile
            ? "sheet-up inset-x-0 bottom-0 max-h-[90dvh] overflow-y-auto rounded-t-[28px]"
            : "fade-in top-1/2 left-1/2 w-[min(760px,calc(100%-24px))] -translate-x-1/2 -translate-y-1/2 rounded-[28px]",
        )}
      >
        {mobile && <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-travertine-deep" aria-hidden />}
        <div className="p-4 md:p-6">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="pt-1">
              <p className="label">
                {t(tile.category)} ·{" "}
                <span className="tabular">
                  {String(position.index + 1).padStart(2, "0")} / {String(position.total).padStart(2, "0")}
                </span>
              </p>
              <p id={`sheet-${tile.slug}`} className="display-s mt-1">
                {tile.name}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label={tc("close")}
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-bone-deep"
            >
              <Close />
            </button>
          </div>
          <div key={tile.slug} className="fade-in">
            <Picture
              image={tile.image}
              locale={locale}
              sizes="(max-width: 767px) 92vw, 710px"
              ratio="16/10"
              reveal={false}
              rounded="lg"
            />
            <p className="body mt-4 text-[16px]">{tile.description}</p>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-2 pb-[max(0px,env(safe-area-inset-bottom))]">
            {position.total > 1 && (
              <span className="mr-auto flex gap-2">
                <button
                  type="button"
                  onClick={() => onStep(-1)}
                  aria-label={tc("previous")}
                  className="inline-flex size-11 items-center justify-center rounded-full bg-bone-deep"
                >
                  <ArrowLeft />
                </button>
                <button
                  type="button"
                  onClick={() => onStep(1)}
                  aria-label={tc("next")}
                  className="inline-flex size-11 items-center justify-center rounded-full bg-bone-deep"
                >
                  <ArrowRight />
                </button>
              </span>
            )}
            <Link href="/living" className="pill pill-basalt">
              {t("allLiving")}
              <ArrowUpRight width={16} height={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
