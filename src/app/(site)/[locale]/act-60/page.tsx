import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { L, Locale } from "@/content/types";
import { t } from "@/lib/localize";
import { cip } from "@/content/seed/homeCip";
import { tdm } from "@/content/seed/images";
import { getFaqs } from "@/lib/content";
import { pageMetadata, JsonLd, breadcrumbLd } from "@/lib/seo";
import { PageHero } from "@/components/ui/PageHero";
import { TaxCalculator } from "@/components/cip/WhyWidgets";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "@/components/ui/Icons";

/**
 * Act 60 (client, 18 Nov: "a page about Act 60: tax, all about that and money saving"). Facts as already published on
 * the site (Act 60 as amended by Act 38-2026: 0% for applications filed by 31 Dec 2026, 4% from 1 Jan 2027, program to
 * 2055) and the owner's brief (§6: you only need to apply; an official, public law; accountants to guide you). The
 * calculator is an illustration. Tax team to confirm before go-live (CONTENT-TODO.md).
 */
const COPY = {
  label: { en: "Act 60", es: "Ley 60" },
  headline: { en: "Keep more of what you earn", es: "Conserve más de lo que gana" },
  figuresLabel: { en: "The numbers", es: "Las cifras" },
  calcTitle: { en: "See what you keep", es: "Vea lo que conserva" },
  calcText: {
    en: "Move the slider to your investment gains. The bars compare the top federal rate on the mainland with Act 60, and the figure below is the money you keep.",
    es: "Mueva el control hasta sus ganancias de inversión. Las barras comparan la tasa federal máxima en EE. UU. con la Ley 60, y la cifra de abajo es el dinero que conserva.",
  },
  qualifyLabel: { en: "How to qualify", es: "Cómo calificar" },
  qualifyTitle: { en: "Four steps to your decree", es: "Cuatro pasos hacia su decreto" },
  applyLine: { en: "You don't need to move now. You just need to apply.", es: "No necesita mudarse ahora. Solo necesita solicitar." },
  applySub: {
    en: "If your application is in by December 31, 2026, you keep the 0% rate, even if the process finishes next year.",
    es: "Si su solicitud se presenta antes del 31 de diciembre de 2026, conserva la tasa del 0%, aunque el proceso termine el año siguiente.",
  },
  trust: [
    {
      title: { en: "An official law", es: "Una ley oficial" },
      text: { en: "Your decree is approved by the government of Puerto Rico, and nobody can take it away.", es: "Su decreto lo aprueba el gobierno de Puerto Rico, y nadie se lo puede quitar." },
    },
    {
      title: { en: "Public and easy to verify", es: "Público y fácil de verificar" },
      text: { en: "Look the law up yourself on the government's site, desarrollo.pr.gov.", es: "Consulte la ley usted mismo en el sitio del gobierno, desarrollo.pr.gov." },
      href: "https://www.desarrollo.pr.gov",
    },
    {
      title: { en: "Our accountants guide you", es: "Nuestros contadores le guían" },
      text: { en: "Every situation is specific. ORA's team of accountants walks you through yours.", es: "Cada situación es específica. El equipo de contadores de ORA le acompaña en la suya." },
    },
  ],
  faqLabel: { en: "Questions", es: "Preguntas" },
  faqTitle: { en: "Act 60, answered", es: "La Ley 60, respondida" },
  closing: { en: "Start your application with ORA", es: "Comience su solicitud con ORA" },
} satisfies Record<string, unknown>;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/act-60",
    title: locale === "es" ? "Ley 60: los beneficios fiscales de vivir en Puerto Rico" : "Act 60: the tax benefits of living in Puerto Rico",
    description: t(cip.why.intro, locale),
  });
}

export default async function Act60Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const es = locale === "es";
  const x = (l: L) => t(l, locale);
  const [faqs, tn] = await Promise.all([getFaqs(), getTranslations({ locale, namespace: "nav" })]);
  const taxFaqs = faqs.filter((f) => f.topic === "tax");
  const inquire = es ? "Consultar" : "Inquire";
  return (
    <div className="flex flex-col">
      <JsonLd data={breadcrumbLd(locale, [{ name: "ORA World", path: "/" }, { name: tn("act60"), path: "/act-60" }])} />
      <PageHero locale={locale} label={x(COPY.label)} headline={x(COPY.headline)} intro={x(cip.why.intro)} image={tdm.aerialCoast} />

      {/* The numbers and the calculator, on the dark band. */}
      <section id="calculator" aria-labelledby="calc-title" data-tone="dark" className="on-dark bg-basalt px-5 py-16 text-bone md:px-10 md:py-24">
        <div className="mx-auto max-w-[1280px]">
          <p className="eyebrow">
            <span className="rule" aria-hidden />
            {x(COPY.figuresLabel)}
          </p>
          <dl className="mt-8 grid gap-8 border-b border-bone/15 pb-12 sm:grid-cols-3 md:pb-16">
            {cip.why.stats.map((st) => (
              <div key={st.value}>
                <dt className="sr-only">{x(st.label)}</dt>
                <dd className="font-[family-name:var(--font-display)] text-[64px] leading-none text-brass-light [font-variant-numeric:lining-nums] md:text-[84px]">{st.value}</dd>
                <dd aria-hidden className="mt-3 max-w-[30ch] text-[14px] leading-relaxed text-bone/75">{x(st.label)}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-12 grid gap-10 md:mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:items-center lg:gap-16">
            <div>
              <h2 id="calc-title" className="font-[family-name:var(--font-display)] text-[36px] leading-[1.08] font-normal text-bone md:text-[52px]">{x(COPY.calcTitle)}</h2>
              <p className="mt-5 max-w-[46ch] text-[16px] leading-relaxed text-bone/80 md:text-[17px]">{x(COPY.calcText)}</p>
            </div>
            <TaxCalculator es={es} />
          </div>
        </div>
      </section>

      {/* Residency (client, 18 Nov, from the client's graphic): "Easy to meet residency requirements: 183 minus 30 days,
          with one minute counted for the day". */}
      <section aria-labelledby="residency-title" className="relative isolate overflow-hidden border-b border-travertine-deep/60 bg-white px-5 py-16 text-center md:px-10 md:py-24">
        <Image src={tdm.exteriorPull.src} alt="" fill sizes="100vw" quality={70} className="-z-10 object-cover opacity-[0.09]" style={{ objectPosition: tdm.exteriorPull.focal }} />
        <h2 id="residency-title" className="font-[family-name:var(--font-display)] text-[20px] tracking-[0.08em] text-brass-ink uppercase md:text-[28px]">
          {es ? "Requisitos de residencia fáciles de cumplir" : "Easy to meet residency requirements"}
        </h2>
        <p className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-[family-name:var(--font-display)] text-brass md:mt-10 md:gap-x-10">
          <span className="text-[88px] leading-none [font-variant-numeric:lining-nums] md:text-[150px]">183</span>
          <span className="text-[26px] tracking-[0.08em] text-brass-ink uppercase md:text-[44px]">{es ? "menos" : "minus"}</span>
          <span className="text-[88px] leading-none [font-variant-numeric:lining-nums] md:text-[150px]">30</span>
          <span className="text-[26px] tracking-[0.08em] text-brass-ink uppercase md:text-[44px]">{es ? "días" : "days"}</span>
        </p>
        <p className="mt-8 text-[13px] tracking-[0.32em] text-charcoal-soft uppercase md:mt-10 md:text-[18px]">
          {es ? "Con un minuto contado como el día" : "With one minute counted for the day"}
        </p>
      </section>

      {/* How to qualify. */}
      <section aria-labelledby="qualify-title" className="border-b border-travertine-deep/60 bg-bone px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1280px]">
          <p className="eyebrow">
            <span className="rule" aria-hidden />
            {x(COPY.qualifyLabel)}
          </p>
          <h2 id="qualify-title" className="mt-5 font-[family-name:var(--font-display)] text-[36px] leading-[1.08] font-normal text-charcoal md:text-[52px]">{x(COPY.qualifyTitle)}</h2>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-12 lg:grid-cols-4">
            {cip.why.bullets.map((b, k) => (
              <li key={k} className="flex flex-col rounded-[20px] bg-white p-6 ring-1 ring-travertine-deep/70">
                <span className="font-[family-name:var(--font-display)] text-[34px] leading-none text-brass [font-variant-numeric:lining-nums]">{String(k + 1).padStart(2, "0")}</span>
                <p className="mt-6 text-[15.5px] leading-relaxed text-charcoal">{x(b)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* "You just need to apply", and why it can be trusted. */}
      <section aria-labelledby="apply-title" className="border-b border-travertine-deep/60 bg-white px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1280px]">
          <h2 id="apply-title" className="mx-auto max-w-[24ch] text-center font-[family-name:var(--font-display)] text-[32px] leading-[1.15] font-normal text-charcoal md:text-[48px]">
            {x(COPY.applyLine)}
          </h2>
          <p className="mx-auto mt-5 max-w-[56ch] text-center text-[16px] leading-relaxed text-charcoal-soft md:text-[17px]">{x(COPY.applySub)}</p>
          <ul className="mt-12 grid gap-4 md:mt-14 md:grid-cols-3">
            {COPY.trust.map((tr) => (
              <li key={tr.title.en} className="rounded-[20px] bg-bone p-6 ring-1 ring-travertine-deep/70 md:p-7">
                <span aria-hidden className="block h-px w-10 bg-brass" />
                <h3 className="mt-5 font-[family-name:var(--font-display)] text-[24px] leading-tight text-charcoal">{x(tr.title)}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-charcoal-soft">{x(tr.text)}</p>
                {"href" in tr && tr.href && (
                  <a href={tr.href} target="_blank" rel="noopener" className="mt-4 inline-flex min-h-11 items-center gap-2 text-[11px] font-semibold tracking-[0.22em] text-brass-ink uppercase hover:text-charcoal">
                    desarrollo.pr.gov <ArrowUpRight width={13} height={13} />
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* The tax questions from the FAQ. */}
      {taxFaqs.length > 0 && (
        <section aria-labelledby="act60-faq" className="border-b border-travertine-deep/60 bg-bone px-5 py-16 md:px-10 md:py-24">
          <div className="mx-auto grid max-w-[1280px] gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-16">
            <div>
              <p className="eyebrow">
                <span className="rule" aria-hidden />
                {x(COPY.faqLabel)}
              </p>
              <h2 id="act60-faq" className="mt-5 font-[family-name:var(--font-display)] text-[36px] leading-[1.08] font-normal text-charcoal md:text-[48px]">{x(COPY.faqTitle)}</h2>
            </div>
            <div className="border-t border-travertine-deep">
              {taxFaqs.map((f) => (
                <details key={f.slug} className="group border-b border-travertine-deep">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-[17px] text-charcoal [&::-webkit-details-marker]:hidden">
                    {x(f.question)}
                    <span aria-hidden className="text-[22px] leading-none text-brass transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <div className="pb-5 text-[15px] leading-relaxed text-charcoal-soft">
                    {(f.answer[locale] || f.answer.en).map((para, k) => (
                      <p key={k} className={k ? "mt-3" : undefined}>
                        {para}
                      </p>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Closing: the note, and Inquire. */}
      <section aria-labelledby="act60-close" data-tone="dark" className="on-dark bg-basalt px-5 py-16 text-center text-bone md:px-10 md:py-20">
        <div className="mx-auto max-w-[880px]">
          <h2 id="act60-close" className="font-[family-name:var(--font-display)] text-[30px] leading-tight font-normal md:text-[42px]">{x(COPY.closing)}</h2>
          <Link href="/#inquire" className="cta mt-8 inline-flex min-h-[52px] px-8" data-track="cta_inquire" data-track-label="act-60">
            {inquire} <ArrowRight width={14} height={14} />
          </Link>
          <p className="mx-auto mt-8 max-w-[64ch] text-[12.5px] leading-relaxed text-bone/65">{x(cip.why.note)}</p>
        </div>
      </section>
    </div>
  );
}
