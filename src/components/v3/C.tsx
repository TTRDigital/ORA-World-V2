import Image from "next/image";
import type { ImageRef, Locale } from "@/content/types";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/**
 * Version C building blocks, in the manner of ciprianiresidences-brickell.com (client, 19 Nov: "do it like this", and
 * "use images, not all videos": only the homepage banner is a film). Thin, widely spaced capitals with one italic serif
 * accent; a short brass rule before each eyebrow; photographs with a caption line under them; ruled lists; square
 * buttons with an arrow. ORA's palette: Deep Earth for the dark notes, bone and white, brass.
 */

/** The title manner: CAPITALS in a thin sans, then an italic serif accent. */
export function CTitle({ caps, accent, light = false, className, as: H = "h2", id }: { caps: string; accent?: string; light?: boolean; className?: string; as?: "h1" | "h2" | "h3"; id?: string }) {
  return (
    <H id={id} className={cn("text-balance", light ? "text-white" : "text-charcoal", className)}>
      <span className="font-[family-name:var(--font-sans)] font-extralight tracking-[0.12em] uppercase">{caps}</span>
      {accent && (
        <>
          {" "}
          <em className="font-[family-name:var(--font-display)] font-medium tracking-normal normal-case italic">{accent}</em>
        </>
      )}
    </H>
  );
}

/** The eyebrow: a short brass rule, then small spaced capitals. */
export const CEyebrow = ({ children, light = false, className }: { children: React.ReactNode; light?: boolean; className?: string }) => (
  <p className={cn("flex items-center gap-4 text-[11.5px] font-semibold tracking-[0.3em] uppercase", light ? "text-brass-light" : "text-brass-ink", className)}>
    <span aria-hidden className={cn("h-px w-9", light ? "bg-brass-light" : "bg-brass")} />
    {children}
  </p>
);

/** A section heading: eyebrow, title (capitals + italic accent) and a line, left-aligned or centred. */
export function CHeading({ eyebrow, caps, accent, intro, level = 2, id, center = false, light = false }: { eyebrow?: string; caps: string; accent?: string; intro?: React.ReactNode; level?: 1 | 2; id?: string; center?: boolean; light?: boolean }) {
  return (
    <div className={cn(center && "mx-auto max-w-[820px] text-center")}>
      {eyebrow && <CEyebrow light={light} className={cn(center && "justify-center")}>{eyebrow}</CEyebrow>}
      <CTitle as={level === 1 ? "h1" : "h2"} id={id} caps={caps} accent={accent} light={light} className={cn("mt-5 text-[34px] leading-[1.15] md:text-[46px]", level === 1 && "md:text-[54px]")} />
      {intro && <p className={cn("mt-6 max-w-[62ch] text-[16px] leading-[1.75] md:text-[17px]", light ? "text-white/85" : "text-charcoal-soft", center && "mx-auto")}>{intro}</p>}
    </div>
  );
}

/** A photograph with the caption line under it: what it shows on the left, its group on the right. */
export function CPhoto({ image, locale, sizes, ratio = "aspect-[3/2]", caption, tag, className }: { image: ImageRef; locale: Locale; sizes: string; ratio?: string; caption?: string; tag?: string; className?: string }) {
  return (
    <figure className={cn("m-0", className)}>
      <div className={cn("relative overflow-hidden bg-travertine", ratio)}>
        <Image src={image.src} alt={image.alt[locale] || image.alt.en} fill sizes={sizes} quality={82} className="object-cover" style={{ objectPosition: image.focal }} />
      </div>
      {(caption || tag) && (
        <figcaption className="mt-3 flex justify-between gap-4 text-[12.5px] text-charcoal-soft">
          <span>{caption}</span>
          {tag && <span className="tracking-[0.12em]">{tag}</span>}
        </figcaption>
      )}
    </figure>
  );
}

/** A ruled list: the name on the left, the detail in small capitals on the right (travel times, facts). */
export function CList({ rows, light = false }: { rows: { label: string; value: string }[]; light?: boolean }) {
  return (
    <dl className={cn("border-t", light ? "border-white/25" : "border-travertine-deep")}>
      {rows.map((r) => (
        <div key={r.label} className={cn("flex items-baseline justify-between gap-6 border-b py-4", light ? "border-white/25" : "border-travertine-deep")}>
          <dt className={cn("text-[15.5px]", light ? "text-white" : "text-charcoal")}>{r.label}</dt>
          <dd className={cn("text-right text-[12px] font-semibold tracking-[0.18em] uppercase", light ? "text-white/75" : "text-charcoal-soft")}>{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** A small-capitals text link with an arrow, underlined. */
export function CLink({ href, children, className, light = false }: { href: string; children: React.ReactNode; className?: string; light?: boolean }) {
  return (
    <Link href={href} className={cn("inline-flex min-h-11 items-center gap-2 border-b text-[12px] font-semibold tracking-[0.22em] uppercase transition-colors", light ? "border-white/70 text-white hover:border-white" : "border-charcoal/60 text-charcoal hover:border-charcoal", className)}>
      {children} <span aria-hidden>→</span>
    </Link>
  );
}

/** Square buttons: solid (Deep Earth, or white over a picture) or outlined. */
export function CButton({ href, children, variant = "solid", external }: { href: string; children: React.ReactNode; variant?: "solid" | "outline" | "white" | "outline-light"; external?: boolean }) {
  const cls = cn(
    "inline-flex min-h-12 items-center gap-2 px-6 text-[12px] font-semibold tracking-[0.22em] uppercase transition-colors",
    variant === "solid" && "bg-basalt text-bone hover:bg-basalt-soft",
    variant === "outline" && "border border-charcoal/50 text-charcoal hover:bg-charcoal hover:text-bone",
    variant === "white" && "bg-white text-charcoal hover:bg-bone",
    variant === "outline-light" && "border border-white/70 text-white hover:bg-white hover:text-charcoal",
  );
  if (external)
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

/** The figures strip: large serif figures with small capitals under them, divided by hairlines. */
export function CStats({ items }: { items: { value: string; unit?: string; label: string }[] }) {
  return (
    <dl className="mx-auto grid max-w-[1200px] grid-cols-2 border-b border-travertine-deep md:grid-cols-5">
      {items.map((s, k) => (
        <div key={s.label} className={cn("flex flex-col items-center justify-start px-3 py-8 text-center md:py-10", k > 0 && "md:border-l md:border-travertine-deep", k % 2 === 1 && "border-l border-travertine-deep md:border-l", k >= 2 && "border-t border-travertine-deep md:border-t-0", k === 4 && "col-span-2 md:col-span-1")}>
          <dt className="sr-only">{s.label}</dt>
          <dd className="font-[family-name:var(--font-display)] text-[40px] leading-none font-medium text-charcoal [font-variant-numeric:lining-nums] md:text-[48px]">
            {s.value}
            {s.unit && <span className="ml-1 text-[18px] text-charcoal-soft">{s.unit}</span>}
          </dd>
          <dd aria-hidden className="mt-4 max-w-[18ch] text-[10.5px] leading-relaxed font-semibold tracking-[0.2em] text-charcoal-soft uppercase">{s.label}</dd>
        </div>
      ))}
    </dl>
  );
}

/** An inner-page opener: the photograph full width, the words at the bottom left. */
export function CPageHero({ image, locale, place, caps, accent, line }: { image: ImageRef; locale: Locale; place: string; caps: string; accent?: string; line?: string }) {
  return (
    <section aria-label={caps} className="relative isolate flex min-h-[72svh] items-end overflow-hidden px-5 pt-40 pb-14 text-white md:px-10 md:pb-20">
      <Image src={image.src} alt={image.alt[locale] || image.alt.en} fill priority sizes="100vw" quality={82} className="-z-10 object-cover" style={{ objectPosition: image.focal }} />
      <span aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(28_24_18/0.55),rgb(28_24_18/0.1)_30%,rgb(28_24_18/0.25)_55%,rgb(28_24_18/0.75))]" />
      <div className="mx-auto w-full max-w-[1200px]">
        <p className="text-[11.5px] font-semibold tracking-[0.3em] uppercase opacity-90">{place}</p>
        <CTitle as="h1" caps={caps} accent={accent} light className="mt-4 text-[38px] leading-[1.1] md:text-[60px]" />
        {line && <p className="mt-5 max-w-[60ch] text-[16px] leading-relaxed text-white/90 md:text-[17px]">{line}</p>}
      </div>
    </section>
  );
}

/** A section on white, bone or sand. */
export function CSection({ id, tone = "white", children, labelledBy, className }: { id?: string; tone?: "white" | "bone" | "sand"; children: React.ReactNode; labelledBy?: string; className?: string }) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn("scroll-mt-24 px-5 py-20 md:px-10 md:py-28", tone === "bone" ? "bg-bone" : tone === "sand" ? "bg-bone-deep" : "bg-white", className)}>
      <div className="mx-auto max-w-[1200px]">{children}</div>
    </section>
  );
}

/** The quote band: the tree mark and a quotation in spaced capitals. */
export function CQuote({ text, by }: { text: string; by?: string }) {
  return (
    <section aria-label={by || "ORA World"} className="bg-bone-deep px-5 py-20 text-center md:px-10 md:py-28">
      {/* eslint-disable-next-line @next/next/no-img-element -- the small tree mark */}
      <img src="/brand/ora-world-tree.png" alt="" width={44} height={44} className="mx-auto h-[44px] w-auto" />
      <p className="mx-auto mt-8 max-w-[34ch] text-[22px] leading-[1.45] font-extralight tracking-[0.12em] text-charcoal uppercase md:text-[30px]">“{text}”</p>
      {by && <p className="mt-6 text-[11px] font-semibold tracking-[0.3em] text-brass-ink uppercase">{by}</p>}
    </section>
  );
}
