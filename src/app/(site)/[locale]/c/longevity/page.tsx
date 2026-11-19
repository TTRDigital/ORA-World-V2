import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import type { ImageRef, L, Locale } from "@/content/types";
import { t } from "@/lib/localize";
import { cip } from "@/content/seed/homeCip";
import { tdm } from "@/content/seed/images";
import { cImg } from "@/content/seed/imagesC";
import { CPageHero, CHeading, CEyebrow, CTitle, CButton, CQuote, CSection } from "@/components/v3/C";

/** Version C · Longevity: the client's longevity content, photographs only, in the Version C manner. */
export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "es" ? "Longevidad · Versión C" : "Longevity · Version C", robots: { index: false, follow: false } };
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const es = locale === "es";
  const x = (l: L) => t(l, locale);
  const lp = cip.longevityPage;
  const spa: ImageRef = { src: "/videos/clips/spa-ocean-poster.jpg", width: 1248, height: 704, focal: "50% 50%", alt: { en: "An ocean-view treatment room at the spa", es: "Una sala de tratamientos con vista al mar en el spa" }, rendering: true };
  const photo = (i: ImageRef, sizes: string, cls: string) => (
    <div className={`relative overflow-hidden bg-travertine ${cls}`}>
      <Image src={i.src} alt={i.alt[locale] || i.alt.en} fill sizes={sizes} quality={82} className="object-cover" style={{ objectPosition: i.focal }} />
    </div>
  );
  return (
    <>
      <CPageHero image={spa} locale={locale} place={es ? "Longevidad · ORA World" : "Longevity · ORA World"} caps={es ? "Una vida más larga." : "A longer life."} accent={es ? "Una vida mejor." : "A better life."} line={x(cip.who.intro)} />

      <CSection labelledBy="c-promise">
        <CHeading id="c-promise" center eyebrow={x(lp.promiseLabel)} caps={es ? "Nuestra promesa," : "Our promise,"} accent={es ? "en cuatro pasos" : "in four steps"} />
        <ol className="mt-14 grid border-t border-travertine-deep md:grid-cols-4">
          {lp.steps.map((st, k) => (
            <li key={k} className={`border-b border-travertine-deep py-8 md:border-b-0 md:px-6 md:py-10 ${k ? "md:border-l" : ""}`}>
              <span className="text-[11px] font-semibold tracking-[0.2em] text-charcoal-soft">{String(k + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 font-[family-name:var(--font-display)] text-[26px] leading-tight font-medium text-charcoal">{x(st.title)}</h3>
              <p className="mt-3 text-[15.5px] leading-relaxed text-charcoal-soft">{x(st.text)}</p>
            </li>
          ))}
        </ol>
      </CSection>

      <CQuote text={x(lp.promiseQuote)} by="ORA World" />

      <CSection labelledBy="c-program">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
          <div className="grid content-start grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] items-end gap-4">
            {photo(cImg.kitchenIsland, "(max-width: 1023px) 52vw, 320px", "aspect-[4/5]")}
            {photo(cImg.kitchenWine, "(max-width: 1023px) 42vw, 260px", "mb-[-3rem] aspect-[3/4]")}
          </div>
          <div>
            <CEyebrow>{x(lp.programLabel)}</CEyebrow>
            <CTitle id="c-program" caps={es ? "Siete cosas," : "Seven things,"} accent={es ? "hechas para usted" : "done for you"} className="mt-5 text-[34px] leading-[1.15] md:text-[44px]" />
            <p className="mt-6 text-[16px] leading-[1.75] text-charcoal-soft md:text-[17px]">{x(lp.programIntro)}</p>
            <ol className="mt-8 border-t border-travertine-deep">
              {lp.program.map((it, k) => (
                <li key={k} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3 border-b border-travertine-deep py-4">
                  <span className="pt-1 text-[11px] font-semibold tracking-[0.18em] text-charcoal-soft">{String(k + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="text-[15px] font-semibold tracking-[0.12em] text-charcoal uppercase">{x(it.title)}</h3>
                    <p className="mt-1 text-[15.5px] leading-relaxed text-charcoal-soft">{x(it.text)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </CSection>

      <section aria-labelledby="c-fit" className="relative isolate overflow-hidden px-5 py-28 text-white md:px-10 md:py-40">
        <Image src={tdm.gym.src} alt={tdm.gym.alt[locale] || tdm.gym.alt.en} fill sizes="100vw" quality={80} className="-z-10 object-cover" style={{ objectPosition: "60% 50%" }} />
        <span aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(28_24_18/0.85),rgb(28_24_18/0.55)_55%,rgb(28_24_18/0.25))]" />
        <div className="mx-auto max-w-[1200px]">
          <div className="max-w-[580px]">
            <CEyebrow light>{x(cip.fitness.eyebrow)}</CEyebrow>
            <CTitle id="c-fit" caps={es ? "Su cuerpo" : "Your body"} accent={es ? "se hace a sí mismo" : "is self-made"} light className="mt-5 text-[34px] leading-[1.15] md:text-[46px]" />
            <p className="mt-6 text-[16px] leading-[1.75] text-white/90 md:text-[17px]">{x(cip.fitness.intro)}</p>
            <p className="mt-4 text-[16px] leading-[1.75] text-white/80 md:text-[17px]">{x(cip.fitness.body)}</p>
          </div>
        </div>
      </section>

      <CSection tone="bone" labelledBy="c-close">
        <div className="text-center">
          <CTitle id="c-close" caps={es ? "Cuéntenos" : "Tell us"} accent={es ? "sus metas" : "your goals"} className="text-[34px] leading-[1.15] md:text-[44px]" />
          <p className="mx-auto mt-5 max-w-[52ch] text-[16px] leading-[1.75] text-charcoal-soft">{x(lp.closingSub)}</p>
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
