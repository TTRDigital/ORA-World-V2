import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { ImageRef, L, Locale } from "@/content/types";
import { t } from "@/lib/localize";
import { cip } from "@/content/seed/homeCip";
import { tdm, life } from "@/content/seed/images";
import { CHeading, CFrame, CSection, CEyebrow, CButton, Ornament } from "@/components/v3/C";

/** Version C · Longevity: the client's longevity content, set plainly for an older reader (19 Nov). */
const clip = (n: string) => ({ video: `/videos/clips/${n}.mp4`, poster: `/videos/clips/${n}-poster.jpg` });

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
  const spa: ImageRef = { ...life.spa, src: "/videos/clips/spa-ocean-poster.jpg", width: 1248, height: 704, focal: "50% 50%", ...clip("spa-ocean") };
  return (
    <>
      <section aria-labelledby="c-long" className="px-5 pt-16 pb-20 md:px-10 md:pt-20 md:pb-28">
        <div className="mx-auto max-w-[1200px]">
          <CHeading level={1} id="c-long" eyebrow={es ? "Longevidad" : "Longevity"} title={x(lp.promiseTitle)} intro={x(cip.who.intro)} ornament={false} />
          <CFrame image={spa} locale={locale} sizes="(max-width: 1199px) calc(100vw - 40px), 1200px" ratio="aspect-[4/3] md:aspect-[21/9]" caption={es ? "Una sala de tratamientos frente al mar, en el spa." : "An ocean-view treatment room at the spa."} className="mt-14" />
        </div>
      </section>

      {/* The promise, in four plain steps. */}
      <CSection tone="paper" labelledBy="c-promise">
        <CHeading id="c-promise" eyebrow={x(lp.promiseLabel)} title={es ? "Nuestra promesa, en cuatro pasos." : "Our promise, in four steps."} />
        <ol className="mx-auto mt-16 grid max-w-[1000px] gap-x-16 gap-y-12 md:grid-cols-2">
          {lp.steps.map((st, k) => (
            <li key={k} className="border-t-[3px] border-double border-brass/50 pt-6">
              <p className="font-[family-name:var(--font-display)] text-[28px] leading-none text-brass-ink">{["I", "II", "III", "IV"][k]}</p>
              <h3 className="mt-4 font-[family-name:var(--font-display)] text-[30px] leading-tight font-medium text-charcoal">{x(st.title)}</h3>
              <p className="mt-3 text-[18px] leading-[1.7] text-charcoal-soft">{x(st.text)}</p>
            </li>
          ))}
        </ol>
        <p className="mx-auto mt-16 max-w-[30ch] text-center font-[family-name:var(--font-display)] text-[28px] leading-snug text-charcoal italic md:text-[34px]">“{x(lp.promiseQuote)}”</p>
      </CSection>

      {/* The program, item by item. */}
      <CSection labelledBy="c-program">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
          <div>
            <CEyebrow>{x(lp.programLabel)}</CEyebrow>
            <h2 id="c-program" className="mt-5 font-[family-name:var(--font-display)] text-[38px] leading-[1.1] font-medium text-charcoal md:text-[50px]">
              {x(lp.programTitle)}
            </h2>
            <p className="mt-6 text-[18px] leading-[1.75] text-charcoal-soft">{x(lp.programIntro)}</p>
            <CFrame image={{ ...tdm.kitchenWine, ...clip("p16-apartment-kitchen") }} locale={locale} sizes="(max-width: 1023px) calc(100vw - 40px), 560px" ratio="aspect-[4/3]" caption={es ? "Comidas que le gustan, preparadas para usted." : "Meals you like, prepared for you."} className="mt-12" />
          </div>
          <ol className="border-t-[3px] border-double border-brass/50">
            {lp.program.map((it, k) => (
              <li key={k} className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-4 border-b border-travertine-deep py-6">
                <span className="font-[family-name:var(--font-display)] text-[26px] leading-none text-brass-ink">{k + 1}.</span>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-[26px] leading-tight font-medium text-charcoal">{x(it.title)}</h3>
                  <p className="mt-1.5 text-[17.5px] leading-relaxed text-charcoal-soft">{x(it.text)}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </CSection>

      {/* Fitness, in the client's words. */}
      <CSection tone="paper" labelledBy="c-fit">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-20">
          <CFrame image={{ ...tdm.gym, focal: "78% 50%", ...clip("p14-gym") }} locale={locale} sizes="(max-width: 1023px) calc(100vw - 40px), 560px" ratio="aspect-[4/5]" caption={es ? "El gimnasio, con vista al jardín." : "The fitness center, with garden views."} />
          <div>
            <CEyebrow>{x(cip.fitness.eyebrow)}</CEyebrow>
            <h2 id="c-fit" className="mt-5 font-[family-name:var(--font-display)] text-[38px] leading-[1.1] font-medium text-charcoal md:text-[50px]">
              {x(cip.fitness.title)}
            </h2>
            <p className="mt-6 text-[18px] leading-[1.75] text-charcoal">{x(cip.fitness.intro)}</p>
            <p className="mt-5 text-[18px] leading-[1.75] text-charcoal-soft">{x(cip.fitness.body)}</p>
          </div>
        </div>
      </CSection>

      <section aria-label={es ? "Consultar" : "Inquire"} className="bg-bone-deep px-5 py-20 text-center md:px-10 md:py-24">
        <Ornament />
        <p className="mx-auto mt-8 max-w-[26ch] font-[family-name:var(--font-display)] text-[30px] leading-snug text-charcoal md:text-[40px]">{x(lp.closing)}</p>
        <div className="mt-10">
          <CButton href="/c#inquire">{es ? "Consultar" : "Inquire"}</CButton>
        </div>
      </section>
    </>
  );
}
