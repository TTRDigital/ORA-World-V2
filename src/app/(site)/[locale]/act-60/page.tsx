import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { L, Locale } from "@/content/types";
import { t } from "@/lib/localize";
import { cip } from "@/content/seed/homeCip";
import { tdm } from "@/content/seed/images";
import { getFaqs } from "@/lib/content";
import { pageMetadata, JsonLd, breadcrumbLd } from "@/lib/seo";
import { PageHero } from "@/components/ui/PageHero";
import { TaxAdviceCard } from "@/components/cip/WhyWidgets";
import { Link } from "@/i18n/navigation";
import { ArrowRight, ArrowUpRight } from "@/components/ui/Icons";

/**
 * Act 60 (client, 18 Nov). Copy follows the Act 60 audit brief ("ORA World | Act 60 publication review", Nov 17 2026):
 * qualifying Puerto Rico income-tax treatment only, no guarantees (Kia, 20 Nov: no rates, savings or deadlines), bona
 * fide residency explained (no day-count shortcut), decree caveats, primary
 * sources linked. Puerto Rico tax counsel to approve before promotion; Spanish to be reviewed separately.
 */
const SOURCES = [
  { en: "Puerto Rico Act 38-2026 (official text)", es: "Ley 38-2026 de Puerto Rico (texto oficial)", href: "https://bvirtualogp.pr.gov/ogp/Bvirtual/leyesreferencia/PDF/2020/0038-2026.pdf" },
  { en: "DDEC Informative Bulletin 2026-004", es: "Boletín Informativo del DDEC 2026-004", href: "https://docs.pr.gov/files/DDEC/Aviso%20Pu%CC%81blico/Informative%20Bulletin%20DDEC%20NO.%202026-004%20Final.pdf" },
  { en: "IRS Publication 570: bona fide residence", es: "Publicación 570 del IRS: residencia bona fide", href: "https://www.irs.gov/publications/p570" },
  { en: "DDEC Incentives Portal", es: "Portal de Incentivos del DDEC", href: "https://incentives.ddec.pr.gov/" },
];
const COPY = {
  label: { en: "Act 60", es: "Ley 60" },
  headline: { en: "Act 60, clearly explained", es: "La Ley 60, explicada con claridad" },
  figuresLabel: { en: "The program", es: "El programa" },
  calcTitle: { en: "Talk it through with an adviser", es: "Háblelo con un asesor" },
  calcText: {
    en: "Whether Act 60 fits your plans depends on your income, your residency and the decree's terms. ORA World can connect you with independent Puerto Rico tax advisers who review your situation.",
    es: "Si la Ley 60 encaja en sus planes depende de sus ingresos, su residencia y los términos del decreto. ORA World puede ponerle en contacto con asesores fiscales independientes de Puerto Rico que revisan su caso.",
  },
  resLabel: { en: "Residency", es: "Residencia" },
  resTitle: { en: "Establish bona fide Puerto Rico residency", es: "Establezca residencia bona fide en Puerto Rico" },
  resIntro: {
    en: "The IRS generally requires all three of the following. Other presence tests and year-of-move rules may apply; day counting alone is not enough.",
    es: "El IRS generalmente exige las tres condiciones siguientes. Pueden aplicar otras pruebas de presencia y reglas del año de la mudanza; contar días no basta.",
  },
  resTests: [
    { title: { en: "Presence", es: "Presencia" }, text: { en: "A qualifying presence test in Puerto Rico for the tax year.", es: "Una prueba de presencia en Puerto Rico que califique para el año fiscal." } },
    { title: { en: "Tax home", es: "Domicilio fiscal" }, text: { en: "Your tax home, your main place of work or business, is in Puerto Rico.", es: "Su domicilio fiscal, su lugar principal de trabajo o negocio, está en Puerto Rico." } },
    { title: { en: "Closer connection", es: "Conexión más cercana" }, text: { en: "No closer connection to the United States or another foreign country.", es: "Sin una conexión más cercana con Estados Unidos u otro país extranjero." } },
  ],
  qualifyLabel: { en: "How to qualify", es: "Cómo calificar" },
  qualifyTitle: { en: "Four steps to a decree", es: "Cuatro pasos hacia un decreto" },
  homeNote: {
    en: "The decree includes a commitment to acquire a primary residence in Puerto Rico, with ownership and title rules set by DDEC. Buying a residence, including at Tesoro del Mar, does not by itself qualify you or automatically satisfy the rule.",
    es: "El decreto incluye el compromiso de adquirir una residencia principal en Puerto Rico, con reglas de titularidad fijadas por el DDEC. Comprar una residencia, también en Tesoro del Mar, no le califica por sí solo ni cumple la regla automáticamente.",
  },
  features: [
    {
      kicker: { en: "Application", es: "Solicitud" },
      title: { en: "Through the official portal", es: "Por el portal oficial" },
      text: {
        en: "Decree applications are filed through the DDEC Incentives Portal. Filing does not guarantee approval or replace the residency and compliance requirements.",
        es: "Las solicitudes de decreto se presentan por el Portal de Incentivos del DDEC. Presentarla no garantiza la aprobación ni sustituye los requisitos de residencia y cumplimiento.",
      },
    },
    {
      kicker: { en: "Government decree", es: "Decreto del gobierno" },
      title: { en: "Established under Puerto Rico law", es: "Establecido por la ley de Puerto Rico" },
      text: {
        en: "Act 60 tax decrees are issued by the Government of Puerto Rico and define the applicable benefits and obligations. Decrees remain subject to eligibility, compliance, governing law and potential revocation.",
        es: "Los decretos de la Ley 60 los emite el Gobierno de Puerto Rico y definen los beneficios y obligaciones aplicables. Siguen sujetos a la elegibilidad, el cumplimiento, la ley aplicable y una posible revocación.",
      },
    },
    {
      kicker: { en: "Advice", es: "Asesoría" },
      title: { en: "Independent tax advisers", es: "Asesores fiscales independientes" },
      text: {
        en: "Every situation is specific. ORA World can connect you with independent Puerto Rico tax advisers to review yours.",
        es: "Cada situación es específica. ORA World puede ponerle en contacto con asesores fiscales independientes de Puerto Rico para revisar la suya.",
      },
    },
  ],
  sourcesLabel: { en: "Official sources", es: "Fuentes oficiales" },
  faqLabel: { en: "Questions", es: "Preguntas" },
  faqTitle: { en: "Act 60, answered", es: "La Ley 60, respondida" },
  closing: { en: "Talk to us about Act 60 and Tesoro del Mar", es: "Hable con nosotros sobre la Ley 60 y Tesoro del Mar" },
} satisfies Record<string, unknown>;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/act-60",
    title: locale === "es" ? "Ley 60: los beneficios fiscales de vivir en Puerto Rico" : "Act 60: the tax benefits of living in Puerto Rico",
    description: t(cip.why.short, locale),
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
      <PageHero locale={locale} label={x(COPY.label)} headline={x(COPY.headline)} intro={x(cip.why.short)} image={tdm.aerialCoast} />

      {/* The numbers and the calculator, on the dark band. */}
      <section id="calculator" aria-labelledby="calc-title" data-tone="dark" className="on-dark bg-basalt px-5 py-16 text-bone md:px-10 md:py-24">
        <div className="mx-auto max-w-[1280px]">
          <p className="eyebrow">
            <span className="rule" aria-hidden />
            {x(COPY.figuresLabel)}
          </p>
          <p className="mt-6 max-w-[72ch] text-[16px] leading-relaxed text-bone/85 md:text-[18px]">{x(cip.why.intro)}</p>
          <dl className="mt-10 grid gap-8 sm:grid-cols-3 md:mt-12">
            {cip.why.stats.map((st) => (
              <div key={st.value}>
                <dt className="sr-only">{x(st.label)}</dt>
                <dd className="font-[family-name:var(--font-display)] text-[64px] leading-none text-brass-light [font-variant-numeric:lining-nums] md:text-[84px]">{st.value}</dd>
                <dd aria-hidden className="mt-3 max-w-[30ch] text-[14px] leading-relaxed text-bone/75">{x(st.label)}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 max-w-[90ch] border-b border-bone/15 pb-12 text-[12.5px] leading-relaxed text-bone/65 md:pb-16">{x(cip.why.statsNote)}</p>
          <div className="mt-12 grid gap-10 md:mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:items-center lg:gap-16">
            <div>
              <h2 id="calc-title" className="font-[family-name:var(--font-display)] text-[36px] leading-[1.08] font-normal text-bone md:text-[52px]">{x(COPY.calcTitle)}</h2>
              <p className="mt-5 max-w-[46ch] text-[16px] leading-relaxed text-bone/80 md:text-[17px]">{x(COPY.calcText)}</p>
            </div>
            <TaxAdviceCard es={es} />
          </div>
        </div>
      </section>

      {/* Residency (Act 60 audit brief, 18 Nov: the "183 minus 30 days" graphic removed; bona fide residency explained). */}
      <section aria-labelledby="residency-title" className="border-b border-travertine-deep/60 bg-bone px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1280px]">
          <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end md:gap-12">
            <div>
              <p className="eyebrow">
                <span className="rule" aria-hidden />
                {x(COPY.resLabel)}
              </p>
              <h2 id="residency-title" className="mt-5 font-[family-name:var(--font-display)] text-[36px] leading-[1.08] font-normal text-charcoal md:text-[52px]">
                {x(COPY.resTitle)}
              </h2>
            </div>
            <p className="max-w-[48ch] text-[16px] leading-relaxed text-charcoal-soft md:text-[17px]">{x(COPY.resIntro)}</p>
          </div>
          <ol className="mt-10 grid gap-4 md:mt-12 md:grid-cols-3">
            {COPY.resTests.map((r, k) => (
              <li key={r.title.en} className="rounded-[20px] bg-white p-7 ring-1 ring-travertine-deep/70 md:p-8">
                <span className="font-[family-name:var(--font-display)] text-[40px] leading-none text-brass [font-variant-numeric:lining-nums]">{String(k + 1).padStart(2, "0")}</span>
                <h3 className="mt-6 font-[family-name:var(--font-display)] text-[26px] leading-tight text-charcoal">{x(r.title)}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-charcoal-soft">{x(r.text)}</p>
              </li>
            ))}
          </ol>
          <a href="https://www.irs.gov/publications/p570" target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-11 items-center gap-2 text-[11px] font-semibold tracking-[0.22em] text-brass-ink uppercase hover:text-charcoal">
            {es ? "IRS Publicación 570" : "IRS Publication 570"} <ArrowUpRight width={13} height={13} />
          </a>
        </div>
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
          <p className="mt-6 max-w-[90ch] text-[14px] leading-relaxed text-charcoal-soft">{x(COPY.homeNote)}</p>
        </div>
      </section>

      {/* Deadline, decree and advice (Act 60 audit brief, 18 Nov), with the official sources. */}
      <section aria-labelledby="deadline-title" className="border-b border-travertine-deep/60 bg-white px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1280px]">
          <h2 id="deadline-title" className="sr-only">{es ? "Solicitud, decreto y asesoría" : "Application, decree and advice"}</h2>
          <ul className="grid gap-4 md:grid-cols-3">
            {COPY.features.map((f, k) => (
              <li key={f.kicker.en} className={k === 0 ? "rounded-[20px] bg-basalt p-7 text-bone md:p-8" : "rounded-[20px] bg-bone p-7 ring-1 ring-travertine-deep/70 md:p-8"}>
                <p className={`text-[11px] font-semibold tracking-[0.22em] uppercase ${k === 0 ? "text-brass-light" : "text-brass-ink"}`}>{x(f.kicker)}</p>
                <h3 className={`mt-4 font-[family-name:var(--font-display)] leading-tight ${k === 0 ? "text-[40px] text-bone" : "text-[26px] text-charcoal"}`}>{x(f.title)}</h3>
                <p className={`mt-3 text-[14.5px] leading-relaxed ${k === 0 ? "text-bone/80" : "text-charcoal-soft"}`}>{x(f.text)}</p>
              </li>
            ))}
          </ul>
          <div className="mt-10 border-t border-travertine-deep pt-6">
            <p className="text-[11px] font-semibold tracking-[0.24em] text-charcoal-soft uppercase">{x(COPY.sourcesLabel)}</p>
            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-1">
              {SOURCES.map((src) => (
                <li key={src.href}>
                  <a href={src.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-[14px] text-brass-ink underline-offset-4 hover:text-charcoal hover:underline">
                    {es ? src.es : src.en} <ArrowUpRight width={12} height={12} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
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
