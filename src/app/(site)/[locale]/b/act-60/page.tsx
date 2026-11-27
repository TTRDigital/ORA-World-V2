import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { L, Locale } from "@/content/types";
import { t } from "@/lib/localize";
import { cip } from "@/content/seed/homeCip";
import { tdm } from "@/content/seed/images";
import { getFaqs } from "@/lib/content";
import { TaxComparison } from "@/components/cip/TaxComparison";
import { BHero, BChapter, BFullBleed, BNumbered, BClose, Eyebrow } from "@/components/v2/B";

/** Version B · Act 60: its own layout; copy as on Version A (the Act 60 audit brief's reviewed wording). */
const SOURCES = [
  { en: "Puerto Rico Act 38-2026 (official text)", es: "Ley 38-2026 de Puerto Rico (texto oficial)", href: "https://bvirtualogp.pr.gov/ogp/Bvirtual/leyesreferencia/PDF/2020/0038-2026.pdf" },
  { en: "DDEC Informative Bulletin 2026-004", es: "Boletín Informativo del DDEC 2026-004", href: "https://docs.pr.gov/files/DDEC/Aviso%20Pu%CC%81blico/Informative%20Bulletin%20DDEC%20NO.%202026-004%20Final.pdf" },
  { en: "IRS Publication 570: bona fide residence", es: "Publicación 570 del IRS: residencia bona fide", href: "https://www.irs.gov/publications/p570" },
  { en: "DDEC Incentives Portal", es: "Portal de Incentivos del DDEC", href: "https://incentives.ddec.pr.gov/" },
];

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "es" ? "Ley 60 · Versión B" : "Act 60 · Version B", robots: { index: false, follow: false } };
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const es = locale === "es";
  const x = (l: L) => t(l, locale);
  const faqs = (await getFaqs()).filter((f) => f.topic === "tax");
  const tests = [
    { title: es ? "Presencia" : "Presence", text: es ? "Una prueba de presencia que califique, a menudo 183 días en Puerto Rico en el año fiscal." : "A qualifying presence test, often 183 days in Puerto Rico in the tax year." },
    { title: es ? "Domicilio fiscal" : "Tax home", text: es ? "Su domicilio fiscal, su lugar principal de trabajo o negocio, está en Puerto Rico." : "Your tax home, your main place of work or business, is in Puerto Rico." },
    { title: es ? "Conexión más cercana" : "Closer connection", text: es ? "Sin una conexión más cercana con Estados Unidos u otro país extranjero." : "No closer connection to the United States or another foreign country." },
  ];
  return (
    <>
      <BHero image={tdm.aerialCoast} locale={locale} eyebrow={es ? "Ley 60 · Puerto Rico" : "Act 60 · Puerto Rico"} title={es ? "Conserve más de lo que gana" : "Keep more of what you earn"} line={x(cip.why.short)} cue={es ? "Desplácese" : "Scroll to explore"} />

      {/* Client, 27 Nov: the calculator first, right after the banner, bigger and in the middle. */}
      <section id="calculator" aria-labelledby="b-calc-title" className="bg-basalt px-5 py-16 text-bone md:px-10 md:py-24">
        <div className="mx-auto max-w-[760px] text-center">
          <h2 id="b-calc-title" className="font-[family-name:var(--font-display)] text-[36px] leading-tight md:text-[52px]">{es ? "Una comparación ilustrativa" : "An illustrative comparison"}</h2>
          <p className="mx-auto mt-5 max-w-[62ch] text-[16px] leading-relaxed text-bone/75">
            {es
              ? "Escriba su dirección, mueva el control y cambie de régimen: la calculadora compara el impuesto federal, estatal, municipal y local estimado donde vive hoy con la tasa de la Ley 60. Son ilustraciones, no su obligación fiscal ni un ahorro garantizado."
              : "Enter your home address, move the slider and switch the regime: the calculator compares estimated federal, state, city and other local tax where you live today with the Act 60 rate. These are illustrations, not your tax liability or guaranteed savings."}
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-[1080px] lg:[zoom:1.1]">
          <TaxComparison es={es} />
        </div>
      </section>

      <section className="bg-bone px-5 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-[1100px] text-center">
          <Eyebrow>{es ? "El programa" : "The program"}</Eyebrow>
          <p className="mt-8 font-[family-name:var(--font-display)] text-[24px] leading-[1.4] text-basalt md:text-[32px]">{x(cip.why.intro)}</p>
        </div>
      </section>

      <BChapter eyebrow={es ? "Las cifras" : "The numbers"} title={es ? "Tres cifras, bien entendidas." : "Three numbers, clearly understood."}>
        <dl className="grid gap-px overflow-hidden bg-bone/15 md:grid-cols-3">
          {cip.why.stats.map((st) => (
            <div key={st.value} className="bg-basalt p-8 md:p-10">
              <dt className="sr-only">{x(st.label)}</dt>
              <dd className="font-[family-name:var(--font-display)] text-[88px] leading-none text-brass-light [font-variant-numeric:lining-nums] md:text-[120px]">{st.value}</dd>
              <dd aria-hidden className="mt-5 text-[14.5px] leading-relaxed text-bone/75">{x(st.label)}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 max-w-[90ch] text-[12.5px] leading-relaxed text-bone/55">{x(cip.why.statsNote)}</p>
      </BChapter>

      <BChapter tone="light" eyebrow={es ? "Residencia" : "Residency"} title={es ? "Establezca residencia bona fide." : "Establish bona fide residency."} intro={es ? "El IRS generalmente exige las tres condiciones; pueden aplicar otras pruebas de presencia y reglas del año de la mudanza. Contar días no basta." : "The IRS generally requires all three; other presence tests and year-of-move rules may apply. Day counting alone is not enough."}>
        <BNumbered items={tests} />
      </BChapter>

      <BFullBleed image={tdm.exteriorRoad} locale={locale} eyebrow={es ? "Fecha límite de solicitud 2026" : "2026 application deadline"} title={es ? "31 de diciembre" : "December 31"}>
        <p className="mt-6 max-w-[56ch] text-[16px] leading-relaxed text-white/85">
          {es
            ? "Según la guía del DDEC, las solicitudes elegibles recibidas hasta las 11:59 p. m. del 31 de diciembre de 2026, según la hora del pago en el Portal de Incentivos, conservan los términos vigentes al presentarlas aunque se aprueben después. Presentar a tiempo no garantiza la aprobación ni sustituye los requisitos de residencia y cumplimiento."
            : "DDEC guidance states that eligible applications received by 11:59 p.m. on December 31, 2026, based on the Incentives Portal filing-fee timestamp, retain the substantive terms in effect at filing even if approved later. Timely filing does not guarantee approval or replace residency and compliance requirements."}
        </p>
      </BFullBleed>

      <BChapter tone="light" eyebrow={es ? "Cómo calificar" : "How to qualify"} title={es ? "Cuatro pasos hacia un decreto." : "Four steps to a decree."}>
        <BNumbered items={cip.why.bullets.map((b) => ({ title: x(b) }))} />
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          <div className="bg-bone-deep p-8">
            <Eyebrow>{es ? "Decreto del gobierno" : "Government decree"}</Eyebrow>
            <p className="mt-4 text-[15px] leading-relaxed text-charcoal-soft">
              {es ? "Los decretos de la Ley 60 los emite el Gobierno de Puerto Rico y definen los beneficios y obligaciones; siguen sujetos a la elegibilidad, el cumplimiento, la ley aplicable y una posible revocación." : "Act 60 tax decrees are issued by the Government of Puerto Rico and define the applicable benefits and obligations; they remain subject to eligibility, compliance, governing law and potential revocation."}
            </p>
          </div>
          <div className="bg-bone-deep p-8">
            <Eyebrow>{es ? "Asesoría" : "Advice"}</Eyebrow>
            <p className="mt-4 text-[15px] leading-relaxed text-charcoal-soft">
              {es ? "Cada situación es específica. ORA World puede ponerle en contacto con asesores fiscales independientes de Puerto Rico. Comprar una residencia, también en Tesoro del Mar, no le califica por sí solo." : "Every situation is specific. ORA World can connect you with independent Puerto Rico tax advisers. Buying a residence, including at Tesoro del Mar, does not by itself qualify you."}
            </p>
          </div>
        </div>
      </BChapter>

      <BChapter eyebrow={es ? "Preguntas" : "Questions"} title={es ? "La Ley 60, respondida." : "Act 60, answered."}>
        <div className="border-t border-bone/20">
          {faqs.map((f) => (
            <details key={f.slug} className="group border-b border-bone/20">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-5 font-[family-name:var(--font-display)] text-[22px] md:text-[26px] [&::-webkit-details-marker]:hidden">
                {x(f.question)}
                <span aria-hidden className="text-[26px] leading-none text-brass-light transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="max-w-[80ch] pb-6 text-[15px] leading-relaxed text-bone/75">
                {(f.answer[locale] || f.answer.en).map((para, k) => (
                  <p key={k} className={k ? "mt-3" : undefined}>
                    {para}
                  </p>
                ))}
              </div>
            </details>
          ))}
        </div>
        <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-1">
          {SOURCES.map((s) => (
            <li key={s.href}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-[13px] text-brass-light underline-offset-4 hover:underline">
                {es ? s.es : s.en} ↗
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-[90ch] text-[12.5px] leading-relaxed text-bone/55">{x(cip.why.note)}</p>
      </BChapter>

      <BClose image={tdm.aerialForest} locale={locale} eyebrow="Act 60 · Tesoro del Mar" title={es ? "Hable con nosotros sobre la Ley 60." : "Talk to us about Act 60."} inquire={es ? "Consultar" : "Inquire"} second={{ href: "/b/floor-plans", label: es ? "Ver planos" : "View floor plans" }} />
    </>
  );
}
