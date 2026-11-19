import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { L, Locale } from "@/content/types";
import { t } from "@/lib/localize";
import { cip } from "@/content/seed/homeCip";
import { cImg } from "@/content/seed/imagesC";
import { FloorExplorer } from "@/components/cip/FloorExplorer";
import { CPageHero, CHeading, CTitle, CList, CButton, CSection } from "@/components/v3/C";

/** Version C · Residences: Phase One pricing as a ruled list, then the floor-by-floor explorer. */
export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "es" ? "Residencias · Versión C" : "Residences · Version C", robots: { index: false, follow: false } };
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const es = locale === "es";
  const x = (l: L) => t(l, locale);
  const p = cip.plans;
  return (
    <>
      <CPageHero image={cImg.diningPiano} locale={locale} place={es ? "Residencias · Torre 1" : "Residences · Tower 1"} caps={es ? "Encuentre" : "Find your"} accent={es ? "su residencia" : "residence"} line={x(p.intro)} />
      <CSection labelledBy="c-price">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end lg:gap-20">
          <CHeading id="c-price" eyebrow={x(p.eyebrow)} caps={es ? "Fase Uno" : "Phase"} accent={es ? "Torre 1" : "One"} intro={x(p.plansNote)} />
          <CList rows={p.tiers.map((tier) => ({ label: x(tier.label), value: `${tier.value} ${x(p.perSqFt)}` }))} />
        </div>
      </CSection>
      <CSection id="explorer" tone="bone" labelledBy="c-floor">
        <CHeading id="c-floor" eyebrow={es ? "Piso a piso" : "Floor by floor"} caps={es ? "Elija un piso," : "Choose a floor,"} accent={es ? "luego una residencia" : "then a residence"} />
        <div className="mt-12">
          <FloorExplorer locale={locale} />
        </div>
      </CSection>
      <CSection tone="sand" labelledBy="c-close">
        <div className="text-center">
          <CTitle id="c-close" caps={es ? "Reciba los planos" : "Receive the full"} accent={es ? "de la Fase 1" : "Phase 1 floor plans"} className="text-[34px] leading-[1.15] md:text-[44px]" />
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
