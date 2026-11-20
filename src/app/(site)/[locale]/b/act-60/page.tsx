import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { L, Locale } from "@/content/types";
import { t } from "@/lib/localize";
import { cip } from "@/content/seed/homeCip";
import { tdm } from "@/content/seed/images";
import { getFaqs } from "@/lib/content";
import { TaxAdviceCard } from "@/components/cip/WhyWidgets";
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
    { title: es ? "Presencia" : "Presence", text: es ? "Una prueba de presencia en Puerto Rico que califique para el año fiscal." : "A qualifying presence test in Puerto Rico for the tax year." },
    { title: es ? "Domicilio fiscal" : "Tax home", text: es ? "Su domicilio fiscal, su lugar principal de trabajo o negocio, está en Puerto Rico." : "Your tax home, your main place of work or business, is in Puerto Rico." },
    { title: es ? "Conexión más cercana" : "Closer connection", text: es ? "Sin una conexión más cercana con Estados Unidos u otro país extranjero." : "No closer connection to the United States or another foreign country." },
  ];
  return (
    <>
      <BHero image={tdm.aerialCoast} locale={locale} eyebrow={es ? "Ley 60 · Puerto Rico" : "Act 60 · Puerto Rico"} title={es ? "La Ley 60, explicada con claridad" : "Act 60, clearly explained"} line={x(cip.why.short)} cue={es ? "Desplácese" : "Scroll to explore"} />

      <section className="bg-bone px-5 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-[1100px] text-center">
          <Eyebrow>{es ? "El programa" : "The program"}</Eyebrow>
          <p className="mt-8 font-[family-name:var(--font-display)] text-[24px] leading-[1.4] text-basalt md:text-[32px]">{x(cip.why.intro)}</p>
        </div>
      </section>

      <BChapter eyebrow={es ? "Lo esencial" : "The essentials"} title={es ? "Tres palabras, bien entendidas." : "Three words, clearly understood."}>
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
        <div className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:items-center lg:gap-16">
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-[34px] leading-tight md:text-[48px]">{es ? "Háblelo con un asesor" : "Talk it through with an adviser"}</h3>
            <p className="mt-5 max-w-[46ch] text-[16px] leading-relaxed text-bone/75">
              {es ? "Si la Ley 60 encaja en sus planes depende de sus ingresos, su residencia y los términos del decreto. Un asesor independiente revisa su caso." : "Whether Act 60 fits your plans depends on your income, your residency and the decree's terms. An independent adviser reviews your situation."}
            </p>
          </div>
          <TaxAdviceCard es={es} />
        </div>
      </BChapter>

      <BChapter tone="light" eyebrow={es ? "Residencia" : "Residency"} title={es ? "Establezca residencia bona fide." : "Establish bona fide residency."} intro={es ? "El IRS generalmente exige las tres condiciones; pueden aplicar otras pruebas de presencia y reglas del año de la mudanza. Contar días no basta." : "The IRS generally requires all three; other presence tests and year-of-move rules may apply. Day counting alone is not enough."}>
        <BNumbered items={tests} />
      </BChapter>

      {/* Kia, 20 Nov: no deadlines in marketing copy; the application deadline band now explains the portal. */}
      <BFullBleed image={tdm.exteriorRoad} locale={locale} eyebrow={es ? "Solicitud" : "Application"} title={es ? "Por el portal oficial" : "Through the official portal"}>
        <p className="mt-6 max-w-[56ch] text-[16px] leading-relaxed text-white/85">
          {es
            ? "Las solicitudes de decreto se presentan por el Portal de Incentivos del DDEC. Presentarla no garantiza la aprobación ni sustituye los requisitos de residencia y cumplimiento."
            : "Decree applications are filed through the DDEC Incentives Portal. Filing does not guarantee approval or replace the residency and compliance requirements."}
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
