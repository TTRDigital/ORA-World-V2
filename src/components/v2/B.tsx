import Image from "next/image";
import type { ImageRef, Locale } from "@/content/types";
import { ClipOverlay } from "@/components/ui/ClipOverlay";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/**
 * Version B building blocks (client, 18 Nov: "Version B's pages look too much like Version A"): the parksidebrickell.com
 * grammar in the ORA brand palette: a full-screen film with a centred giant title, huge centred statements, Deep Earth
 * chapters with large picture grids, full-bleed photographs with words over them, and big-numeral lists.
 */
export const Eyebrow = ({ children, light = false, className }: { children: React.ReactNode; light?: boolean; className?: string }) => (
  <p className={cn("text-[11px] tracking-[0.32em] uppercase", light ? "text-brass-light" : "text-brass-ink", className)}>{children}</p>
);

export function BMedia({ image, locale, sizes, className = "" }: { image: ImageRef; locale: Locale; sizes: string; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden bg-basalt-soft", className)}>
      <Image src={image.src} alt={image.alt[locale] || image.alt.en} fill sizes={sizes} quality={80} className="object-cover" style={{ objectPosition: image.focal }} />
      {image.video && <ClipOverlay src={image.video} poster={image.poster} focal={image.focal} />}
    </div>
  );
}

/** Full-screen opener: the film edge to edge, a centred giant serif title, a line, "scroll". */
export function BHero({ image, locale, eyebrow, title, line, cue }: { image: ImageRef; locale: Locale; eyebrow: string; title: string; line?: string; cue: string }) {
  return (
    <section aria-label={title} className="relative isolate flex h-[100svh] min-h-[600px] flex-col items-center justify-center overflow-hidden px-5 text-center text-white">
      <BMedia image={image} locale={locale} sizes="100vw" className="!absolute inset-0 -z-10" />
      <span aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgb(28_24_18/0.5),rgb(28_24_18/0.22)_65%),linear-gradient(180deg,rgb(28_24_18/0.4),transparent_30%,transparent_70%,rgb(28_24_18/0.55))]" />
      <p className="hero-fade text-[11px] tracking-[0.42em] uppercase opacity-90">{eyebrow}</p>
      <h1 className="hero-fade mt-6 max-w-[14ch] font-[family-name:var(--font-display)] text-[54px] leading-[0.98] font-normal text-balance md:text-[96px] lg:text-[124px]" style={{ animationDelay: "200ms" }}>
        {title}
      </h1>
      {line && (
        <p className="hero-fade mt-7 max-w-[52ch] text-[15px] leading-relaxed text-white/85 md:text-[17px]" style={{ animationDelay: "400ms" }}>
          {line}
        </p>
      )}
      <span aria-hidden className="absolute bottom-8 flex flex-col items-center gap-2 text-[10px] tracking-[0.32em] uppercase opacity-85">
        {cue}
        <span className="scroll-cue-arrow">↓</span>
      </span>
    </section>
  );
}

/** A huge centred serif line on bone. */
export function BStatement({ text, sub }: { text: string; sub?: string }) {
  return (
    <section className="flex min-h-[56svh] flex-col items-center justify-center px-5 py-24 text-center md:min-h-[66svh] md:px-10">
      <p className="max-w-[18ch] font-[family-name:var(--font-display)] text-[40px] leading-[1.06] text-balance text-basalt md:text-[76px] lg:text-[96px]" data-reveal>
        {text}
      </p>
      {sub && <p className="mt-8 max-w-[56ch] text-[16px] leading-relaxed text-charcoal-soft md:text-[18px]">{sub}</p>}
    </section>
  );
}

/** A chapter: Deep Earth (dark), bone (light) or bone-deep (sand), with the eyebrow, a big serif title and a line. */
export function BChapter({
  id,
  tone = "dark",
  eyebrow,
  title,
  intro,
  children,
  split = true,
}: {
  id?: string;
  tone?: "dark" | "light" | "sand";
  eyebrow: string;
  title: React.ReactNode;
  intro?: string;
  children?: React.ReactNode;
  split?: boolean;
}) {
  const dark = tone === "dark";
  return (
    <section id={id} data-tone={dark ? "dark" : undefined} className={cn("scroll-mt-24 lg:scroll-mt-28 px-5 py-20 md:px-10 md:py-28", dark ? "on-dark bg-basalt text-bone" : tone === "sand" ? "bg-bone-deep text-basalt" : "bg-bone text-basalt")}>
      <div className="mx-auto max-w-[1440px]">
        <Eyebrow light={dark}>{eyebrow}</Eyebrow>
        <div className={cn("mt-6", split && intro && "grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end md:gap-16")}>
          <h2 className="max-w-[16ch] font-[family-name:var(--font-display)] text-[40px] leading-[1.06] font-normal md:text-[64px]">{title}</h2>
          {intro && <p className={cn("max-w-[52ch] text-[16px] leading-relaxed md:text-[17px]", dark ? "text-bone/75" : "text-charcoal-soft", !split && "mt-6")}>{intro}</p>}
        </div>
        {children && <div className="mt-14">{children}</div>}
      </div>
    </section>
  );
}

/** Large pictures in two (or three) columns, each with a serif caption and a line. */
export function BGrid({ items, locale, cols = 2, dark = true, ratio = "aspect-[16/10]" }: { items: { title: string; text?: string; image: ImageRef; kicker?: string }[]; locale: Locale; cols?: 2 | 3; dark?: boolean; ratio?: string }) {
  return (
    <ul className={cn("grid gap-x-6 gap-y-12", cols === 3 ? "md:grid-cols-3" : "md:grid-cols-2")}>
      {items.map((it) => (
        <li key={it.title}>
          <BMedia image={it.image} locale={locale} sizes={cols === 3 ? "(max-width: 767px) calc(100vw - 40px), 460px" : "(max-width: 767px) calc(100vw - 40px), 700px"} className={ratio} />
          {it.kicker && <p className={cn("mt-5 text-[10.5px] tracking-[0.28em] uppercase", dark ? "text-brass-light" : "text-brass-ink")}>{it.kicker}</p>}
          <h3 className={cn("font-[family-name:var(--font-display)] text-[28px] leading-tight", it.kicker ? "mt-2" : "mt-5")}>{it.title}</h3>
          {it.text && <p className={cn("mt-1.5 max-w-[46ch] text-[14.5px] leading-relaxed", dark ? "text-bone/70" : "text-charcoal-soft")}>{it.text}</p>}
        </li>
      ))}
    </ul>
  );
}

/** A full-bleed photograph or film with words over it. */
export function BFullBleed({ image, locale, eyebrow, title, children, align = "left" }: { image: ImageRef; locale: Locale; eyebrow: string; title: React.ReactNode; children?: React.ReactNode; align?: "left" | "center" }) {
  return (
    <section className={cn("relative isolate flex min-h-[86svh] items-center overflow-hidden px-5 py-24 text-white md:px-10 md:py-32", align === "center" && "justify-center text-center")}>
      <BMedia image={image} locale={locale} sizes="100vw" className="!absolute inset-0 -z-10" />
      <span aria-hidden className={cn("absolute inset-0 -z-10", align === "center" ? "bg-[rgb(28_24_18/0.55)]" : "bg-[linear-gradient(90deg,rgb(28_24_18/0.82),rgb(28_24_18/0.45)_60%,rgb(28_24_18/0.2))]")} />
      <div className={cn("w-full", align === "center" ? "max-w-[920px]" : "mx-auto max-w-[1440px]")}>
        <Eyebrow light>{eyebrow}</Eyebrow>
        <h2 className={cn("mt-6 font-[family-name:var(--font-display)] text-[40px] leading-[1.08] font-normal md:text-[64px]", align === "left" && "max-w-[14ch]")}>{title}</h2>
        {children}
      </div>
    </section>
  );
}

/** Big-numeral rows (01, 02...) with a title and a line. */
export function BNumbered({ items, dark = false }: { items: { title: string; text?: string }[]; dark?: boolean }) {
  return (
    <ol className={cn("border-t", dark ? "border-bone/20" : "border-basalt/15")}>
      {items.map((it, k) => (
        <li key={it.title} className={cn("grid grid-cols-[4.5rem_minmax(0,1fr)] items-baseline gap-x-5 border-b py-7 md:grid-cols-[7rem_minmax(0,1fr)] md:py-9", dark ? "border-bone/20" : "border-basalt/15")}>
          <span className={cn("font-[family-name:var(--font-display)] text-[44px] leading-none [font-variant-numeric:lining-nums] md:text-[64px]", dark ? "text-brass-light" : "text-brass")}>{String(k + 1).padStart(2, "0")}</span>
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-[26px] leading-tight md:text-[32px]">{it.title}</h3>
            {it.text && <p className={cn("mt-2 max-w-[60ch] text-[15.5px] leading-relaxed", dark ? "text-bone/75" : "text-charcoal-soft")}>{it.text}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

/** The closing call over a photograph: a line, Inquire and a second link. */
export function BClose({ image, locale, eyebrow, title, inquire, second }: { image: ImageRef; locale: Locale; eyebrow: string; title: string; inquire: string; second?: { href: string; label: string } }) {
  return (
    <section className="relative isolate overflow-hidden px-5 py-32 text-center text-white md:px-10 md:py-40">
      <BMedia image={image} locale={locale} sizes="100vw" className="!absolute inset-0 -z-10" />
      <span aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(28_24_18/0.4),rgb(28_24_18/0.72))]" />
      <Eyebrow light>{eyebrow}</Eyebrow>
      <h2 className="mx-auto mt-6 max-w-[16ch] font-[family-name:var(--font-display)] text-[40px] leading-[1.08] font-normal md:text-[64px]">{title}</h2>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/b#inquire" className="inline-flex min-h-11 items-center bg-brass px-6 text-[11px] tracking-[0.26em] text-basalt uppercase hover:bg-brass-light">
          {inquire}
        </Link>
        {second && (
          <Link href={second.href} className="inline-flex min-h-11 items-center border border-white/70 px-6 text-[11px] tracking-[0.26em] uppercase hover:bg-white hover:text-basalt">
            {second.label}
          </Link>
        )}
      </div>
    </section>
  );
}
