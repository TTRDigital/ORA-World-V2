import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { ImageRef, L, Locale } from "@/content/types";
import { getSiteSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { t } from "@/lib/localize";
import { cip } from "@/content/seed/homeCip";
import { tdm, life } from "@/content/seed/images";
import { pointsOfInterest } from "@/content/seed/places";
import { LeadFormLazy } from "@/components/forms/LeadFormLazy";
import { CHeading, CFrame, CLedger, CLink, CButton, CSection, CEyebrow, Ornament } from "@/components/v3/C";

/**
 * Version C (client, 19 Nov: "a third version, completely different, same content: very basic, old money, high end,
 * for older people; less going on, simple, laid out properly, showing what really matters; all about longevity and
 * tax"). A quiet printed-page manner: a framed film, a letter, three things that matter (health, wealth, home), a
 * ledger for the Act 60 figures, the setting in plain words and a private-visit form. Same facts and approved copy as
 * Version A (Act 60 per the audit brief); nothing in Version A or B changes.
 */
const clip = (n: string) => ({ video: `/videos/clips/${n}.mp4`, poster: `/videos/clips/${n}-poster.jpg` });

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const meta = pageMetadata({ locale, path: "/c", title: locale === "es" ? "Tesoro del Mar · Versión C" : "Tesoro del Mar · Version C", description: locale === "es" ? "ORA World en Dorado, Puerto Rico: una residencia privada para una vida más larga y mejor." : "ORA World in Dorado, Puerto Rico: a private residence for a longer, better life." });
  return { ...meta, robots: { index: false, follow: false } };
}

export default async function VersionC({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const es = locale === "es";
  const x = (l: L) => t(l, locale);
  const settings = await getSiteSettings();
  const lp = cip.longevityPage;
  const spa: ImageRef = { ...life.spa, src: "/videos/clips/spa-ocean-poster.jpg", width: 1248, height: 704, focal: "50% 50%" };
  const tel = settings.phone ? `tel:${settings.phone.replace(/[^\d+]/g, "")}` : undefined;

  const three = [
    { n: "I", eyebrow: es ? "Su salud" : "Your health", title: es ? "Una vida más larga y mejor" : "A longer, better life", text: es ? "Un programa de longevidad incluido: escaneo corporal, nutricionistas, una cocina que cocina para usted y un programa de ejercicio fácil." : "A longevity program, included: a body scan, nutritionists, a kitchen that cooks for you and an easy fitness program.", href: "/c/longevity", link: es ? "La longevidad" : "On longevity", image: { ...spa, ...clip("spa-ocean") } },
    { n: "II", eyebrow: es ? "Su patrimonio" : "Your wealth", title: es ? "Conserve más de lo que gana" : "Keep more of what you earn", text: x(cip.why.short), href: "/c/act-60", link: es ? "La Ley 60" : "On Act 60", image: tdm.aerialCoast },
    { n: "III", eyebrow: es ? "Su hogar" : "Your home", title: es ? "Una residencia frente al mar" : "A residence by the sea", text: es ? "129 residencias con vista al mar, interiores italianos y un club privado, en la costa norte." : "129 residences with ocean views, Italian interiors and a private club, on the north coast.", href: "/c/floor-plans", link: es ? "Las residencias" : "The residences", image: tdm.penthouseLiving },
  ];
  const facts = [
    { label: es ? "Residencias" : "Residences", value: "129" },
    { label: es ? "Fase Uno, Torre 1" : "Phase One, Tower 1", value: es ? "60 residencias, pisos 5 a 18" : "60 residences, floors 5 to 18" },
    { label: es ? "Precio inicial" : "Early pricing", value: `${x(cip.plans.startingFrom)} ${cip.plans.tiers[0].value} ${x(cip.plans.perSqFt)}` },
    { label: es ? "Amenidades" : "Amenities", value: es ? "65,500 pies²" : "65,500 sq ft" },
    { label: es ? "Club privado" : "Private club", value: es ? "14,000 pies²" : "14,000 sq ft" },
  ];
  const places = cip.location.places.map((slug) => {
    const p = pointsOfInterest.find((q) => q.slug === slug)!;
    const walk = p.walkMinutes != null;
    return { label: x(p.name), value: `${walk ? p.walkMinutes : p.driveMinutes} ${x(walk ? cip.location.walk : cip.location.drive)}${p.confirmed ? "" : "*"}` };
  });

  return (
    <>
      {/* The opening: the title, then the coast, framed. */}
      <section aria-labelledby="c-title" className="px-5 pt-16 pb-20 md:px-10 md:pt-20 md:pb-28">
        <div className="mx-auto max-w-[1200px]">
          <CHeading level={1} id="c-title" eyebrow="Tesoro del Mar · Dorado, Puerto Rico" title={es ? "Una residencia privada para una vida más larga y mejor." : "A private residence for a longer, better life."} ornament={false} />
          <CFrame image={{ ...tdm.aerialCoast, ...clip("p08-aerial-cove") }} locale={locale} sizes="(max-width: 1199px) calc(100vw - 40px), 1200px" ratio="aspect-[4/3] md:aspect-[21/9]" caption={es ? "La costa norte de Puerto Rico, en Dorado." : "The north coast of Puerto Rico, at Dorado."} className="mt-14" />
        </div>
      </section>

      {/* A letter. */}
      <CSection tone="paper" labelledBy="c-letter">
        <div className="mx-auto max-w-[760px] text-center">
          <Ornament />
          <h2 id="c-letter" className="mt-8 font-[family-name:var(--font-display)] text-[34px] leading-tight font-medium text-charcoal md:text-[44px]">
            {x(cip.who.title)}
          </h2>
          <p className="mt-8 text-[19px] leading-[1.8] text-charcoal md:text-[21px]">{x(cip.who.intro)}</p>
          <p className="mt-6 text-[19px] leading-[1.8] text-charcoal-soft md:text-[21px]">{x(cip.who.body)}</p>
          <p className="mt-10 font-[family-name:var(--font-display)] text-[24px] text-brass-ink italic">ORA World</p>
        </div>
      </CSection>

      {/* What matters: three things, numbered I, II, III. */}
      <CSection labelledBy="c-matters">
        <CHeading id="c-matters" eyebrow={es ? "Lo que importa" : "What matters"} title={es ? "Tres cosas, bien hechas." : "Three things, done well."} />
        <ol className="mt-16 grid gap-14 md:grid-cols-3 md:gap-10">
          {three.map((it) => (
            <li key={it.n} className="text-center">
              <CFrame image={it.image} locale={locale} sizes="(max-width: 767px) calc(100vw - 40px), 380px" ratio="aspect-[4/5]" />
              <p className="mt-8 font-[family-name:var(--font-display)] text-[30px] leading-none text-brass-ink">{it.n}</p>
              <CEyebrow className="mt-4">{it.eyebrow}</CEyebrow>
              <h3 className="mt-3 font-[family-name:var(--font-display)] text-[30px] leading-tight font-medium text-charcoal">{it.title}</h3>
              <p className="mx-auto mt-4 max-w-[36ch] text-[17px] leading-[1.7] text-charcoal-soft">{it.text}</p>
              <CLink href={it.href} className="mt-6">
                {it.link}
              </CLink>
            </li>
          ))}
        </ol>
      </CSection>

      {/* I · Health: the program, plainly listed. */}
      <CSection tone="paper" id="health" labelledBy="c-health">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-20">
          <CFrame image={{ ...tdm.gym, focal: "78% 50%", ...clip("p14-gym") }} locale={locale} sizes="(max-width: 1023px) calc(100vw - 40px), 560px" ratio="aspect-[4/5]" caption={es ? "El gimnasio, con vista al jardín." : "The fitness center, with garden views."} className="lg:sticky lg:top-24" />
          <div>
            <CEyebrow>{es ? "I · Su salud" : "I · Your health"}</CEyebrow>
            <h2 id="c-health" className="mt-5 font-[family-name:var(--font-display)] text-[38px] leading-[1.1] font-medium text-charcoal md:text-[50px]">
              {x(lp.steps[0].text)}
            </h2>
            <p className="mt-6 text-[18px] leading-[1.75] text-charcoal-soft">{x(lp.programIntro)}</p>
            <ol className="mt-10 border-t-[3px] border-double border-brass/50">
              {lp.program.map((it, k) => (
                <li key={k} className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-4 border-b border-travertine-deep py-5">
                  <span className="font-[family-name:var(--font-display)] text-[24px] leading-none text-brass-ink">{k + 1}.</span>
                  <div>
                    <h3 className="font-[family-name:var(--font-display)] text-[24px] leading-tight font-medium text-charcoal">{x(it.title)}</h3>
                    <p className="mt-1 text-[17px] leading-relaxed text-charcoal-soft">{x(it.text)}</p>
                  </div>
                </li>
              ))}
            </ol>
            <CLink href="/c/longevity" className="mt-10">
              {es ? "Todo sobre la longevidad" : "All about longevity"}
            </CLink>
          </div>
        </div>
      </CSection>

      {/* A question worth asking. */}
      <section aria-label={es ? "Una pregunta" : "A question"} className="bg-bone-deep px-5 py-20 text-center md:px-10 md:py-24">
        <Ornament />
        <p className="mx-auto mt-8 max-w-[24ch] font-[family-name:var(--font-display)] text-[34px] leading-[1.25] text-charcoal italic md:text-[48px]">
          “{es ? "¿Cuánto valen para usted 10 años más?" : "What is the value of an extra 10 years for you?"}”
        </p>
      </section>

      {/* II · Wealth: Act 60 as a ledger (the audit brief's wording). */}
      <CSection id="wealth" labelledBy="c-wealth">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
          <div>
            <CEyebrow>{es ? "II · Su patrimonio" : "II · Your wealth"}</CEyebrow>
            <h2 id="c-wealth" className="mt-5 font-[family-name:var(--font-display)] text-[38px] leading-[1.1] font-medium text-charcoal md:text-[50px]">
              {es ? "Conserve más de lo que gana." : "Keep more of what you earn."}
            </h2>
            <p className="mt-6 text-[18px] leading-[1.75] text-charcoal-soft">{x(cip.why.intro)}</p>
            <CLink href="/c/act-60" className="mt-10">
              {es ? "La Ley 60, explicada" : "Act 60, explained"}
            </CLink>
          </div>
          <div>
            <CLedger figures rows={cip.why.stats.map((st) => ({ value: st.value, label: x(st.label) }))} />
            <p className="mt-6 text-[14.5px] leading-relaxed text-charcoal-soft">{x(cip.why.statsNote)}</p>
            <p className="mt-3 text-[14.5px] leading-relaxed text-charcoal-soft">{x(cip.why.note)}</p>
          </div>
        </div>
      </CSection>

      {/* III · Home: the residences, with the facts in a ledger. */}
      <CSection tone="paper" id="home" labelledBy="c-home">
        <CHeading id="c-home" eyebrow={es ? "III · Su hogar" : "III · Your home"} title={x(cip.interiors.title)} intro={x(cip.interiors.intro)} />
        <CFrame image={{ ...tdm.penthouseLiving, ...clip("p24-penthouse-living") }} locale={locale} sizes="(max-width: 1199px) calc(100vw - 40px), 1200px" ratio="aspect-[4/3] md:aspect-[16/7]" caption={es ? "El salón del penthouse, en dos niveles." : "The penthouse living room, on two levels."} className="mt-14" />
        <div className="mx-auto mt-16 grid max-w-[1000px] gap-12 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:gap-16">
          <CLedger rows={facts} />
          <div className="grid content-start gap-8">
            <CFrame image={{ ...tdm.kitchenWine, ...clip("p16-apartment-kitchen") }} locale={locale} sizes="(max-width: 767px) calc(100vw - 40px), 420px" ratio="aspect-[3/2]" caption={es ? "La cocina, con gabinetes italianos." : "The kitchen, with Italian cabinetry."} />
            <div className="flex flex-wrap gap-x-8 gap-y-2">
              <CLink href="/c/floor-plans">{es ? "Planos" : "Floor plans"}</CLink>
              <CLink href="/c/finishes">{es ? "Acabados" : "Finishes"}</CLink>
            </div>
          </div>
        </div>
      </CSection>

      {/* The setting, in plain words and travel times. */}
      <CSection id="setting" labelledBy="c-setting">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-20">
          <div>
            <CEyebrow>{es ? "El entorno" : "The setting"}</CEyebrow>
            <h2 id="c-setting" className="mt-5 font-[family-name:var(--font-display)] text-[38px] leading-[1.1] font-medium text-charcoal md:text-[50px]">
              {es ? "Dorado, en la costa norte." : "Dorado, on the north coast."}
            </h2>
            <p className="mt-6 text-[18px] leading-[1.75] text-charcoal-soft">{x(cip.location.intro)}</p>
            <div className="mt-10">
              <CLedger rows={places} />
              <p className="mt-4 text-[14.5px] text-charcoal-soft">{x(cip.location.note)}</p>
            </div>
            <p className="mt-6 text-[16px] text-charcoal">{x(cip.location.address)}</p>
          </div>
          <CFrame image={tdm.exteriorPull} locale={locale} sizes="(max-width: 1023px) calc(100vw - 40px), 560px" ratio="aspect-[4/5]" caption={es ? "La piscina, entre los jardines." : "The pool, among the gardens."} />
        </div>
      </CSection>

      {/* A private visit. */}
      <CSection tone="sand" id="inquire" labelledBy="c-inquire">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
          <div>
            <Ornament className="justify-start" />
            <h2 id="c-inquire" className="mt-8 font-[family-name:var(--font-display)] text-[38px] leading-[1.1] font-medium text-charcoal md:text-[50px]">
              {es ? "Concierte una visita privada." : "Arrange a private visit."}
            </h2>
            <p className="mt-6 text-[18px] leading-[1.75] text-charcoal-soft">
              {es ? "Déjenos sus datos y le llamaremos para hablar de disponibilidad, precios, el programa de longevidad y la Ley 60." : "Leave your details and we will call you to talk about availability, pricing, the longevity program and Act 60."}
            </p>
            {tel && (
              <div className="mt-10 border-t border-travertine-deep pt-8">
                <p className="text-[16px] text-charcoal-soft">{es ? "O llámenos directamente:" : "Or call us directly:"}</p>
                <a href={tel} className="mt-2 inline-block font-[family-name:var(--font-display)] text-[36px] font-medium text-charcoal hover:text-brass-ink">
                  {settings.phone}
                </a>
              </div>
            )}
          </div>
          <div className="border border-travertine-deep bg-white p-6 md:p-10">
            <LeadFormLazy variant="full" consentText={settings.consentText[locale]} submitLabel={es ? "Enviar" : "Send request"} />
          </div>
        </div>
      </CSection>

      {/* A last word. */}
      <section aria-label="ORA World" className="bg-bone px-5 py-20 text-center md:px-10">
        <Ornament />
        <p className="mx-auto mt-8 max-w-[26ch] font-[family-name:var(--font-display)] text-[30px] leading-snug text-charcoal md:text-[40px]">
          {es ? "Una costa tranquila. Una vida más larga." : "A quiet coast. A longer life."}
        </p>
        <div className="mt-10">
          <CButton href="/c#inquire">{es ? "Consultar" : "Inquire"}</CButton>
        </div>
      </section>
    </>
  );
}
