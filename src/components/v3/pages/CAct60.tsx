import type { L, Locale } from "@/content/types";
import { t } from "@/lib/localize";
import { cip } from "@/content/seed/homeCip";
import { getFaqs } from "@/lib/content";
import { CPageHero, CHeading, CTitle, CSection, CEyebrow, CButton } from "@/components/v3/C";
import { cImg } from "@/content/seed/imagesC";
import { tdm } from "@/content/seed/images";
import { TaxComparison } from "@/components/cip/TaxComparison";

/** Version C · Act 60: explained plainly, in the Act 60 audit brief's reviewed wording (as on Versions A and B). */
const SOURCES = [
  { en: "Puerto Rico Act 38-2026 (official text)", es: "Ley 38-2026 de Puerto Rico (texto oficial)", href: "https://bvirtualogp.pr.gov/ogp/Bvirtual/leyesreferencia/PDF/2020/0038-2026.pdf" },
  { en: "DDEC Informative Bulletin 2026-004", es: "Boletín Informativo del DDEC 2026-004", href: "https://docs.pr.gov/files/DDEC/Aviso%20Pu%CC%81blico/Informative%20Bulletin%20DDEC%20NO.%202026-004%20Final.pdf" },
  { en: "IRS Publication 570: bona fide residence", es: "Publicación 570 del IRS: residencia bona fide", href: "https://www.irs.gov/publications/p570" },
  { en: "DDEC Incentives Portal", es: "Portal de Incentivos del DDEC", href: "https://incentives.ddec.pr.gov/" },
];


export async function CAct60({ locale, films = false }: { locale: Locale; films?: boolean }) {
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
      <CPageHero image={films ? tdm.aerialCoast : cImg.aerialCove} locale={locale} place={es ? "Ley 60 · Puerto Rico" : "Act 60 · Puerto Rico"} caps={es ? "Conserve más" : "Keep more"} accent={es ? "de lo que gana" : "of what you earn"} line={x(cip.why.short)} />

      {/* Client, 27 Nov: the four-step calculator right after the banner, as on Versions 1 and 2. */}
      <section id="calculator" aria-labelledby="c-calc-title" className="bg-basalt px-5 py-16 text-bone md:px-10 md:py-24">
        <div className="mx-auto max-w-[760px] text-center">
          <h2 id="c-calc-title" className="font-[family-name:var(--font-display)] text-[36px] leading-tight font-light md:text-[52px]">
            {es ? "Calcule su ahorro" : "Calculate your savings"}
          </h2>
          <p className="mx-auto mt-5 max-w-[62ch] text-[16px] leading-relaxed text-bone/75">
            {es
              ? "En cuatro pasos: su dirección, su estado civil tributario, sus ganancias de capital e ingreso ordinario calificado, y su tasa en Puerto Rico. La calculadora compara el impuesto federal, estatal, municipal y local estimado donde vive hoy con la tasa de la Ley 60. Son ilustraciones, no su obligación fiscal ni un ahorro garantizado."
              : "In four steps: your home address, your filing status, your capital gains and qualified ordinary income, and your Puerto Rico rate. The calculator compares estimated federal, state, city and other local tax where you live today with the Act 60 rate. These are illustrations, not your tax liability or guaranteed savings."}
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-[1080px] lg:[zoom:1.1]">
          <TaxComparison es={es} />
        </div>
      </section>

      {/* The program and the figures. */}
      <CSection tone="bone" labelledBy="c-program">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
          <div>
            <CEyebrow>{es ? "El programa" : "The program"}</CEyebrow>
            <h2 id="c-program" className="mt-5 font-[family-name:var(--font-display)] text-[38px] leading-[1.1] font-medium text-charcoal md:text-[50px]">
              {es ? "Lo que ofrece la Ley 60." : "What Act 60 may offer."}
            </h2>
            <p className="mt-6 text-[18px] leading-[1.8] text-charcoal">{x(cip.why.intro)}</p>
          </div>
          <div>
            <dl className="border-t border-travertine-deep">
              {cip.why.stats.map((st) => (
                <div key={st.value} className="grid grid-cols-[6rem_minmax(0,1fr)] items-baseline gap-x-6 border-b border-travertine-deep py-5 md:grid-cols-[8.5rem_minmax(0,1fr)]">
                  <dt className="sr-only">{x(st.label)}</dt>
                  <dd className="font-[family-name:var(--font-display)] text-[44px] leading-none font-medium text-charcoal md:text-[56px]">{st.value}</dd>
                  <dd aria-hidden className="text-[15.5px] leading-relaxed text-charcoal">{x(st.label)}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-[15px] leading-relaxed text-charcoal-soft">{x(cip.why.statsNote)}</p>
          </div>
        </div>
      </CSection>

      {/* Residency. */}
      <CSection labelledBy="c-res">
        <CHeading id="c-res" center eyebrow={es ? "Residencia" : "Residency"} caps={es ? "Residencia" : "Bona fide"} accent={es ? "bona fide" : "residency"} intro={es ? "El IRS generalmente exige las tres condiciones; pueden aplicar otras pruebas de presencia y reglas del año de la mudanza. Contar días no basta." : "The IRS generally requires all three; other presence tests and year-of-move rules may apply. Day counting alone is not enough."} />
        <ol className="mx-auto mt-16 grid max-w-[1100px] gap-10 md:grid-cols-3">
          {tests.map((it, k) => (
            <li key={it.title} className="border-t border-travertine-deep pt-6 text-center">
              <p className="font-[family-name:var(--font-display)] text-[28px] leading-none text-brass-ink">{["I", "II", "III"][k]}</p>
              <h3 className="mt-4 font-[family-name:var(--font-display)] text-[28px] leading-tight font-medium text-charcoal">{it.title}</h3>
              <p className="mt-3 text-[17.5px] leading-[1.7] text-charcoal-soft">{it.text}</p>
            </li>
          ))}
        </ol>
      </CSection>

      {/* How to qualify, the deadline and advice. */}
      <CSection tone="bone" labelledBy="c-steps">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
          <div>
            <CEyebrow>{es ? "Cómo calificar" : "How to qualify"}</CEyebrow>
            <h2 id="c-steps" className="mt-5 font-[family-name:var(--font-display)] text-[38px] leading-[1.1] font-medium text-charcoal md:text-[50px]">
              {es ? "Cuatro pasos hacia un decreto." : "Four steps to a decree."}
            </h2>
            <ol className="mt-10 border-t border-travertine-deep">
              {cip.why.bullets.map((b, k) => (
                <li key={k} className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-4 border-b border-travertine-deep py-5 text-[18px] leading-relaxed text-charcoal">
                  <span className="font-[family-name:var(--font-display)] text-[26px] leading-none text-brass-ink">{k + 1}.</span>
                  {x(b)}
                </li>
              ))}
            </ol>
          </div>
          <div className="grid content-start gap-8">
            <div className="border border-travertine-deep bg-bone p-8">
              <CEyebrow>{es ? "Fecha límite de solicitud 2026" : "2026 application deadline"}</CEyebrow>
              <p className="mt-4 font-[family-name:var(--font-display)] text-[40px] leading-none font-medium text-charcoal">{es ? "31 de diciembre" : "December 31"}</p>
              <p className="mt-5 text-[16.5px] leading-[1.7] text-charcoal-soft">
                {es
                  ? "Según la guía del DDEC, las solicitudes elegibles recibidas hasta las 11:59 p. m. del 31 de diciembre de 2026, según la hora del pago en el Portal de Incentivos, conservan los términos vigentes al presentarlas aunque se aprueben después. Presentar a tiempo no garantiza la aprobación ni sustituye los requisitos de residencia y cumplimiento."
                  : "DDEC guidance states that eligible applications received by 11:59 p.m. on December 31, 2026, based on the Incentives Portal filing-fee timestamp, retain the substantive terms in effect at filing even if approved later. Timely filing does not guarantee approval or replace residency and compliance requirements."}
              </p>
            </div>
            <div className="border border-travertine-deep bg-bone p-8">
              <CEyebrow>{es ? "Asesoría" : "Advice"}</CEyebrow>
              <p className="mt-4 text-[16.5px] leading-[1.7] text-charcoal-soft">
                {es ? "Los decretos de la Ley 60 los emite el Gobierno de Puerto Rico y siguen sujetos a la elegibilidad, el cumplimiento, la ley aplicable y una posible revocación. ORA World puede ponerle en contacto con asesores fiscales independientes de Puerto Rico. Comprar una residencia, también en Tesoro del Mar, no le califica por sí solo." : "Act 60 decrees are issued by the Government of Puerto Rico and remain subject to eligibility, compliance, governing law and potential revocation. ORA World can connect you with independent Puerto Rico tax advisers. Buying a residence, including at Tesoro del Mar, does not by itself qualify you."}
              </p>
            </div>
          </div>
        </div>
      </CSection>

      {/* Questions. */}
      <CSection labelledBy="c-faq">
        <CHeading id="c-faq" center eyebrow={es ? "Preguntas" : "Questions"} caps={es ? "Preguntas" : "Frequently asked"} accent={es ? "frecuentes" : "questions"} />
        <div className="mx-auto mt-14 max-w-[880px] border-t border-travertine-deep">
          {faqs.map((f) => (
            <details key={f.slug} className="group border-b border-travertine-deep">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-6 font-[family-name:var(--font-display)] text-[24px] leading-snug font-medium text-charcoal md:text-[27px] [&::-webkit-details-marker]:hidden">
                {x(f.question)}
                <span aria-hidden className="shrink-0 text-[28px] leading-none text-brass-ink transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="pb-7 text-[17.5px] leading-[1.75] text-charcoal-soft">
                {(f.answer[locale] || f.answer.en).map((para, k) => (
                  <p key={k} className={k ? "mt-3" : undefined}>
                    {para}
                  </p>
                ))}
              </div>
            </details>
          ))}
        </div>
        <div className="mx-auto mt-12 max-w-[880px]">
          <CEyebrow>{es ? "Fuentes oficiales" : "Official sources"}</CEyebrow>
          <ul className="mt-4 grid gap-1">
            {SOURCES.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-[16.5px] text-charcoal underline decoration-brass underline-offset-4 hover:text-brass-ink">
                  {es ? s.es : s.en} ↗
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-[15px] leading-relaxed text-charcoal-soft">{x(cip.why.note)}</p>
        </div>
      </CSection>

      <CSection tone="sand" labelledBy="c-close">
        <div className="text-center">
          <CTitle id="c-close" caps={es ? "Hable con nosotros" : "Talk to us"} accent={es ? "sobre la Ley 60" : "about Act 60"} className="text-[34px] leading-[1.15] md:text-[44px]" />
          <div className="mt-8">
            <CButton href="/c#inquire">
              {es ? "Agende una presentación" : "Schedule a presentation"} <span aria-hidden>→</span>
            </CButton>
          </div>
        </div>
      </CSection>
    </>
  );
}
