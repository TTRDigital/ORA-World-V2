import Image from "next/image";
import type { ImageRef, Locale } from "@/content/types";
import { ClipOverlay } from "@/components/ui/ClipOverlay";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/**
 * Version C building blocks (client, 19 Nov: "very basic, old money luxury; for an older audience; less going on,
 * simple, laid out properly, showing what really matters"). Bone paper, charcoal ink, brass rules; large readable
 * type; framed photographs with captions; ledgers for figures; plain words for links. Little motion.
 */

/** A thin rule with the ORA tree between (the house mark, used as a printer's ornament). */
export function Ornament({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("flex items-center justify-center gap-5", className)}>
      <span className="h-px w-14 bg-brass/60 md:w-20" />
      {/* eslint-disable-next-line @next/next/no-img-element -- the small tree mark */}
      <img src="/brand/ora-world-tree.png" alt="" width={30} height={30} className="h-[30px] w-auto opacity-90" />
      <span className="h-px w-14 bg-brass/60 md:w-20" />
    </div>
  );
}

export const CEyebrow = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <p className={cn("text-[12.5px] font-semibold tracking-[0.26em] text-brass-ink uppercase", className)}>{children}</p>
);

/** A centred chapter heading: ornament, eyebrow, serif title and an optional introduction. */
export function CHeading({ eyebrow, title, intro, level = 2, id, ornament = true }: { eyebrow?: string; title: React.ReactNode; intro?: React.ReactNode; level?: 1 | 2; id?: string; ornament?: boolean }) {
  const H = level === 1 ? "h1" : "h2";
  return (
    <div className="mx-auto max-w-[820px] text-center">
      {ornament && <Ornament className="mb-8" />}
      {eyebrow && <CEyebrow>{eyebrow}</CEyebrow>}
      <H id={id} className={cn("font-[family-name:var(--font-display)] font-medium text-balance text-charcoal", eyebrow && "mt-5", level === 1 ? "text-[44px] leading-[1.08] md:text-[68px]" : "text-[38px] leading-[1.1] md:text-[54px]")}>
        {title}
      </H>
      {intro && <p className="mx-auto mt-6 max-w-[60ch] text-[18px] leading-[1.75] text-charcoal-soft md:text-[19px]">{intro}</p>}
    </div>
  );
}

/** A photograph set like a print: a white mount, a hairline frame and an italic caption. Films play quietly. */
export function CFrame({ image, locale, sizes, ratio = "aspect-[3/2]", caption, className }: { image: ImageRef; locale: Locale; sizes: string; ratio?: string; caption?: string; className?: string }) {
  return (
    <figure className={cn("m-0", className)}>
      <div className="border border-travertine-deep bg-white p-2 shadow-[0_18px_40px_-28px_rgb(44_36_22/0.35)] md:p-3">
        <div className={cn("relative overflow-hidden bg-travertine", ratio)}>
          <Image src={image.src} alt={image.alt[locale] || image.alt.en} fill sizes={sizes} quality={82} className="object-cover" style={{ objectPosition: image.focal }} />
          {image.video && <ClipOverlay src={image.video} poster={image.poster} focal={image.focal} />}
        </div>
      </div>
      {caption && <figcaption className="mt-4 text-center font-[family-name:var(--font-display)] text-[18px] text-charcoal-soft italic">{caption}</figcaption>}
    </figure>
  );
}

/** A ledger: figures or facts in ruled rows, the figure in serif, its meaning in plain words beside it. */
export function CLedger({ rows, figures = false }: { rows: { label: string; value: string }[]; figures?: boolean }) {
  return (
    <dl className="border-t-[3px] border-double border-brass/50">
      {rows.map((r) => (
        <div key={r.label} className={cn("grid items-baseline gap-x-8 border-b border-travertine-deep py-5", figures ? "grid-cols-[6.5rem_minmax(0,1fr)] md:grid-cols-[10rem_minmax(0,1fr)]" : "grid-cols-[minmax(0,1fr)_auto]")}>
          {figures ? (
            <>
              <dt className="sr-only">{r.label}</dt>
              <dd className="font-[family-name:var(--font-display)] text-[44px] leading-none font-medium text-brass-ink [font-variant-numeric:lining-nums] md:text-[60px]">{r.value}</dd>
              <dd aria-hidden className="text-[17px] leading-relaxed text-charcoal">{r.label}</dd>
            </>
          ) : (
            <>
              <dt className="text-[17px] text-charcoal-soft">{r.label}</dt>
              <dd className="text-right font-[family-name:var(--font-display)] text-[22px] font-medium text-charcoal [font-variant-numeric:lining-nums] md:text-[24px]">{r.value}</dd>
            </>
          )}
        </div>
      ))}
    </dl>
  );
}

/** A plain, underlined text link with an arrow: easy to see and to tap. */
export function CLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link href={href} className={cn("inline-flex min-h-11 items-center gap-2 border-b border-brass-ink/60 text-[15px] font-semibold tracking-[0.14em] text-charcoal uppercase transition-colors hover:border-charcoal", className)}>
      {children} <span aria-hidden>→</span>
    </Link>
  );
}

/** The one solid button (Inquire / arrange a visit). */
export function CButton({ href, children, light = false }: { href: string; children: React.ReactNode; light?: boolean }) {
  return (
    <Link href={href} className={cn("inline-flex min-h-[52px] items-center px-8 text-[14px] font-semibold tracking-[0.2em] uppercase transition-colors", light ? "bg-bone text-charcoal hover:bg-white" : "bg-basalt text-bone hover:bg-basalt-soft")}>
      {children}
    </Link>
  );
}

/** A section of the page on bone, paper-white or sand. */
export function CSection({ id, tone = "bone", children, labelledBy, className }: { id?: string; tone?: "bone" | "paper" | "sand"; children: React.ReactNode; labelledBy?: string; className?: string }) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn("scroll-mt-24 px-5 py-20 md:px-10 md:py-28", tone === "paper" ? "bg-white" : tone === "sand" ? "bg-bone-deep" : "bg-bone", className)}>
      <div className="mx-auto max-w-[1200px]">{children}</div>
    </section>
  );
}
