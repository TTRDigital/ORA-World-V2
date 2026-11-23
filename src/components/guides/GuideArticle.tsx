import Image from "next/image";
import { Fragment } from "react";
import type { ImageRef } from "@/content/types";
import type { Guide, GuideSection } from "@/content/guides";
import { guides, GUIDE_PUBLISHED } from "@/content/guides";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/**
 * A buyer guide (TTR-2508), in Version B's grammar and the ORA palette: a full-bleed photograph with the title, a Deep
 * Earth band of facts, a large serif lede, then the article itself beside a sticky index, with wide photographs and
 * pull quotes between sections, a call band, the questions, more guides and the closing call to book a call with Reza.
 * Server-rendered throughout: no client JavaScript of its own.
 */

const Eyebrow = ({ children, light = false }: { children: React.ReactNode; light?: boolean }) => (
  <p className={cn("text-[11px] tracking-[0.32em] uppercase", light ? "text-brass-light" : "text-brass-ink")}>{children}</p>
);

/** Body text with [label](/path) links. "@book" is the booking page; other external links open in a new tab. */
function Rich({ text, bookingUrl }: { text: string; bookingUrl: string | null }) {
  const parts: React.ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  const linkCls = "text-brass-ink underline decoration-brass/50 underline-offset-4 transition-colors hover:text-basalt hover:decoration-basalt";
  while ((m = re.exec(text))) {
    parts.push(text.slice(last, m.index));
    const [, label, href] = m;
    if (href === "@book") {
      parts.push(
        bookingUrl ? (
          <a key={m.index} href={bookingUrl} target="_blank" rel="noopener" className={linkCls} data-track="book_call_reza">
            {label}
          </a>
        ) : (
          <Link key={m.index} href="/b#inquire" className={linkCls}>
            {label}
          </Link>
        ),
      );
    } else if (/^https?:/.test(href)) {
      parts.push(
        <a key={m.index} href={href} target="_blank" rel="noopener noreferrer" className={linkCls}>
          {label}
        </a>,
      );
    } else {
      parts.push(
        <Link key={m.index} href={href} className={linkCls}>
          {label}
        </Link>,
      );
    }
    last = m.index + m[0].length;
  }
  parts.push(text.slice(last));
  return <>{parts}</>;
}

function Photo({ image, sizes, className, priority = false }: { image: ImageRef; sizes: string; className?: string; priority?: boolean }) {
  return (
    <div className={cn("relative overflow-hidden bg-basalt-soft", className)}>
      <Image src={image.src} alt={image.alt.en} fill sizes={sizes} quality={80} priority={priority} fetchPriority={priority ? "high" : undefined} className="object-cover" style={{ objectPosition: image.focal }} />
    </div>
  );
}

function BookButton({ bookingUrl, light = false, label = "Book a call with Reza" }: { bookingUrl: string | null; light?: boolean; label?: string }) {
  const cls = cn("inline-flex min-h-12 items-center px-7 text-[11px] tracking-[0.26em] uppercase transition-colors", light ? "bg-brass text-basalt hover:bg-brass-light" : "bg-basalt text-bone hover:bg-basalt-soft");
  return bookingUrl ? (
    <a href={bookingUrl} target="_blank" rel="noopener" className={cls} data-track="book_call_reza">
      {label}
    </a>
  ) : (
    <Link href="/b#inquire" className={cls}>
      {label}
    </Link>
  );
}

const words = (g: Guide) =>
  [g.lede, g.answer ?? "", ...g.sections.flatMap((s) => [s.h2, ...s.body, ...(s.list ?? []), ...(s.steps ?? []).flatMap((st) => [st.title, st.text])]), ...g.faqs.flatMap((f) => [f.q, f.a])]
    .join(" ")
    .split(/\s+/).length;

export const readMinutes = (g: Guide) => Math.max(3, Math.round(words(g) / 220));

function Section({ s, bookingUrl, index }: { s: GuideSection; bookingUrl: string | null; index: number }) {
  return (
    <section id={s.id} aria-labelledby={`${s.id}-h`} className="scroll-mt-32">
      <p className="font-[family-name:var(--font-display)] text-[15px] text-brass-ink [font-variant-numeric:lining-nums]">{String(index + 1).padStart(2, "0")}</p>
      <h2 id={`${s.id}-h`} className="mt-2 max-w-[24ch] font-[family-name:var(--font-display)] text-[32px] leading-[1.1] font-normal text-basalt text-balance md:text-[44px]">
        {s.h2}
      </h2>
      <div className="mt-6 grid max-w-[68ch] gap-5 text-[17px] leading-[1.75] text-charcoal md:text-[18px]">
        {s.body.map((p, k) => (
          <p key={k}>
            <Rich text={p} bookingUrl={bookingUrl} />
          </p>
        ))}
      </div>
      {s.list && (
        <ul className="mt-7 grid max-w-[68ch] gap-3 border-t border-basalt/15 pt-6">
          {s.list.map((it) => (
            <li key={it} className="flex items-start gap-4 text-[16.5px] leading-relaxed text-charcoal">
              <span aria-hidden className="mt-[0.7em] h-px w-5 shrink-0 bg-brass" />
              <span>
                <Rich text={it} bookingUrl={bookingUrl} />
              </span>
            </li>
          ))}
        </ul>
      )}
      {s.steps && (
        <ol className="mt-8 border-t border-basalt/15">
          {s.steps.map((st, k) => (
            <li key={st.title} className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-baseline gap-x-5 border-b border-basalt/15 py-6 md:grid-cols-[5rem_minmax(0,1fr)]">
              <span className="font-[family-name:var(--font-display)] text-[40px] leading-none text-brass [font-variant-numeric:lining-nums] md:text-[52px]">{String(k + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="font-[family-name:var(--font-display)] text-[24px] leading-tight text-basalt md:text-[28px]">{st.title}</h3>
                <p className="mt-2 max-w-[60ch] text-[16px] leading-relaxed text-charcoal-soft">{st.text}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
      {s.quote && (
        <figure className="mt-12 border-l-2 border-brass py-1 pl-6 md:pl-10">
          <blockquote className="max-w-[30ch] font-[family-name:var(--font-display)] text-[28px] leading-[1.2] text-basalt text-balance md:text-[40px]">“{s.quote.text}”</blockquote>
          <figcaption className="mt-5 text-[11px] tracking-[0.28em] text-brass-ink uppercase">{s.quote.cite}</figcaption>
        </figure>
      )}
      {s.image && (
        <figure className="mt-12">
          <Photo image={s.image.ref} sizes="(max-width: 1023px) calc(100vw - 40px), 1000px" className="aspect-[16/10] md:aspect-[16/9]" />
          <figcaption className="mt-3 text-[13px] text-charcoal-soft">{s.image.caption}</figcaption>
        </figure>
      )}
    </section>
  );
}

export function GuideArticle({ guide: g, bookingUrl, legalNotice }: { guide: Guide; bookingUrl: string | null; legalNotice: string }) {
  const more = guides.filter((x) => x.slug !== g.slug);
  const updated = new Date(`${GUIDE_PUBLISHED}T12:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
  return (
    <article>
      {/* Opener: the photograph edge to edge, the title over it. */}
      <header className="relative isolate flex min-h-[620px] flex-col justify-end overflow-hidden px-5 pt-40 pb-14 text-white md:h-[92svh] md:px-10 md:pb-20">
        <Photo image={g.hero} sizes="100vw" priority className="!absolute inset-0 -z-10" />
        <span aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(28_24_18/0.62),rgb(28_24_18/0.15)_70%),linear-gradient(180deg,rgb(28_24_18/0.5),rgb(28_24_18/0.15)_35%,rgb(28_24_18/0.4)_60%,rgb(28_24_18/0.88))]" />
        <div className="mx-auto w-full max-w-[1440px]">
          <nav aria-label="Breadcrumb" className="text-[11px] tracking-[0.24em] uppercase opacity-85">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/b" className="hover:underline">
                  ORA World
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>Guides</li>
            </ol>
          </nav>
          <p className="mt-8 text-[11px] tracking-[0.32em] text-brass-light uppercase">{g.eyebrow}</p>
          <h1 className="mt-5 max-w-[20ch] font-[family-name:var(--font-display)] text-[40px] leading-[1.03] font-normal text-balance md:text-[68px] lg:text-[84px]">{g.title}</h1>
          <p className="mt-6 max-w-[58ch] text-[16px] leading-relaxed text-white/85 md:text-[18px]">{g.deck}</p>
          <p className="mt-8 text-[11px] tracking-[0.24em] uppercase opacity-75">
            {readMinutes(g)} min read · Updated <time dateTime={GUIDE_PUBLISHED}>{updated}</time>
          </p>
        </div>
      </header>

      {/* The facts, on Deep Earth. */}
      <section aria-label="At a glance" data-tone="dark" className="on-dark bg-basalt px-5 py-12 text-bone md:px-10 md:py-16">
        <dl className="mx-auto grid max-w-[1440px] grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {g.facts.map((f) => (
            <div key={f.label} className="border-t border-bone/20 pt-5">
              <dt className="sr-only">{f.label}</dt>
              <dd className="font-[family-name:var(--font-display)] text-[34px] leading-none text-brass-light [font-variant-numeric:lining-nums] md:text-[52px]">{f.value}</dd>
              <dd className="mt-3 max-w-[24ch] text-[13.5px] leading-relaxed text-bone/75">{f.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* The lede. */}
      <section aria-label="Introduction" className="px-5 py-20 md:px-10 md:py-28">
        <p className="mx-auto max-w-[30ch] text-center font-[family-name:var(--font-display)] text-[28px] leading-[1.25] text-basalt text-balance md:text-[44px]">{g.lede}</p>
        {g.answer && (
          <div className="mx-auto mt-14 max-w-[72ch] border-l-2 border-brass bg-bone-deep px-6 py-7 md:mt-20 md:px-10 md:py-9">
            <p className="text-[11px] tracking-[0.28em] text-brass-ink uppercase">The short answer</p>
            <p className="mt-3 text-[17px] leading-[1.7] text-charcoal md:text-[18px]">{g.answer}</p>
          </div>
        )}
      </section>

      {/* The article, beside its index. */}
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 pb-8 md:px-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-20">
        <aside className="lg:sticky lg:top-32 lg:self-start" aria-labelledby="toc-h">
          <p id="toc-h" className="text-[11px] tracking-[0.28em] text-brass-ink uppercase">
            In this guide
          </p>
          <ol className="mt-4 grid gap-1 border-l border-basalt/15">
            {g.sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="-ml-px block border-l border-transparent py-1.5 pl-4 text-[14px] leading-snug text-charcoal-soft transition-colors hover:border-brass hover:text-basalt">
                  {s.h2}
                </a>
              </li>
            ))}
            <li>
              <a href="#questions" className="-ml-px block border-l border-transparent py-1.5 pl-4 text-[14px] leading-snug text-charcoal-soft transition-colors hover:border-brass hover:text-basalt">
                Questions
              </a>
            </li>
            {g.sources && g.sources.length > 0 && (
              <li>
                <a href="#sources" className="-ml-px block border-l border-transparent py-1.5 pl-4 text-[14px] leading-snug text-charcoal-soft transition-colors hover:border-brass hover:text-basalt">
                  Sources
                </a>
              </li>
            )}
          </ol>
        </aside>

        <div className="grid gap-20 md:gap-28">
          {g.sections.map((s, k) => (
            <Fragment key={s.id}>
              <Section s={s} bookingUrl={bookingUrl} index={k} />
              {k + 1 === g.ctaAfter && (
                <aside aria-label="Book a call" className="bg-bone-deep px-6 py-10 md:px-12 md:py-14">
                  <Eyebrow>Talk to ORA World</Eyebrow>
                  <p className="mt-4 max-w-[26ch] font-[family-name:var(--font-display)] text-[28px] leading-[1.15] text-basalt md:text-[38px]">Questions about Tesoro Del Mar? Ask Reza.</p>
                  <p className="mt-4 max-w-[56ch] text-[16px] leading-relaxed text-charcoal-soft">
                    Reza, ORA World&apos;s agent, can answer your questions, send the brochure and the Phase 1 floor plans, and arrange a visit or a video call.
                  </p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <BookButton bookingUrl={bookingUrl} />
                    <Link href="/place/tour" className="inline-flex min-h-12 items-center border border-basalt/40 px-7 text-[11px] tracking-[0.26em] uppercase transition-colors hover:bg-basalt hover:text-bone">
                      Take the 360° tour
                    </Link>
                  </div>
                </aside>
              )}
            </Fragment>
          ))}
        </div>
      </div>

      {/* Questions. */}
      <section id="questions" aria-labelledby="questions-h" className="mt-20 scroll-mt-28 bg-bone-deep px-5 py-20 md:mt-28 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-20">
          <div>
            <Eyebrow>Questions</Eyebrow>
            <h2 id="questions-h" className="mt-5 max-w-[14ch] font-[family-name:var(--font-display)] text-[36px] leading-[1.08] font-normal text-basalt md:text-[52px]">
              Frequently asked questions
            </h2>
          </div>
          <div className="border-t border-basalt/20">
            {g.faqs.map((f) => (
              <details key={f.q} className="group border-b border-basalt/20">
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-5 font-[family-name:var(--font-display)] text-[21px] leading-snug text-basalt md:text-[25px] [&::-webkit-details-marker]:hidden">
                  <h3 className="font-normal">{f.q}</h3>
                  <span aria-hidden className="text-[26px] leading-none text-brass transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="max-w-[70ch] pb-6 text-[16px] leading-relaxed text-charcoal-soft">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Sources, for the facts that are not ORA World's own. */}
      {g.sources && g.sources.length > 0 && (
        <section id="sources" aria-labelledby="sources-h" className="px-5 pt-20 md:px-10 md:pt-28">
          <div className="mx-auto max-w-[1440px] border-t border-basalt/15 pt-10">
            <Eyebrow>Sources</Eyebrow>
            <h2 id="sources-h" className="sr-only">
              Sources
            </h2>
            <ol className="mt-6 max-w-[100ch] list-decimal pl-5 text-[14.5px] leading-relaxed text-charcoal-soft marker:text-brass-ink md:columns-2 md:gap-x-14 [&>li]:mb-3 [&>li]:break-inside-avoid">
              {g.sources.map((src) => (
                <li key={src.href}>
                  <a href={src.href} target="_blank" rel="noopener noreferrer" className="break-words underline decoration-brass/50 underline-offset-4 transition-colors hover:text-basalt hover:decoration-basalt">
                    {src.label}
                  </a>
                </li>
              ))}
            </ol>
            <p className="mt-6 max-w-[90ch] text-[13px] leading-relaxed text-charcoal-soft">
              Rules, fees and schedules change. Check each agency&apos;s current page, and ask a licensed professional about your own situation.
            </p>
          </div>
        </section>
      )}

      {/* More guides. */}
      <section aria-labelledby="more-h" className="px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1440px]">
          <Eyebrow>Keep reading</Eyebrow>
          <h2 id="more-h" className="mt-5 font-[family-name:var(--font-display)] text-[34px] leading-[1.08] font-normal text-basalt md:text-[48px]">
            More guides to Dorado
          </h2>
          <ul className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((m) => (
              <li key={m.slug}>
                <Link href={`/guides/${m.slug}`} className="group block">
                  <Photo image={m.hero} sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) 45vw, 440px" className="aspect-[4/3]" />
                  <p className="mt-5 text-[10.5px] tracking-[0.28em] text-brass-ink uppercase">{m.eyebrow}</p>
                  <h3 className="mt-2 font-[family-name:var(--font-display)] text-[23px] leading-tight text-basalt group-hover:underline group-hover:decoration-brass group-hover:underline-offset-4">{m.cardTitle}</h3>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* The closing call. */}
      <section aria-labelledby="close-h" className="relative isolate overflow-hidden px-5 py-28 text-center text-white md:px-10 md:py-40">
        <Photo image={g.sections.find((s) => s.image)?.image?.ref ?? g.hero} sizes="100vw" className="!absolute inset-0 -z-10" />
        <span aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(28_24_18/0.5),rgb(28_24_18/0.78))]" />
        <Eyebrow light>Tesoro Del Mar · Dorado</Eyebrow>
        <h2 id="close-h" className="mx-auto mt-6 max-w-[18ch] font-[family-name:var(--font-display)] text-[38px] leading-[1.08] font-normal text-balance md:text-[64px]">
          Talk to Reza about your residence
        </h2>
        <p className="mx-auto mt-6 max-w-[54ch] text-[16px] leading-relaxed text-white/85 md:text-[17px]">
          Book a call with ORA World&apos;s agent to talk about your goals, receive the brochure and the Phase 1 floor plans, and plan a visit to Dorado.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <BookButton bookingUrl={bookingUrl} light />
          <Link href="/b#inquire" className="inline-flex min-h-12 items-center border border-white/70 px-7 text-[11px] tracking-[0.26em] uppercase transition-colors hover:bg-white hover:text-basalt">
            Inquire
          </Link>
        </div>
      </section>

      {/* Notices. */}
      <section aria-label="Notices" className="bg-bone px-5 py-10 md:px-10">
        <div className="mx-auto max-w-[1440px] text-[12px] leading-relaxed text-charcoal-soft">
          <p>All images of Tesoro Del Mar on this page are artist renderings.</p>
          <p className="mt-2">{legalNotice}</p>
        </div>
      </section>
    </article>
  );
}
