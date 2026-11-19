import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { L, Locale } from "@/content/types";
import { t } from "@/lib/localize";
import { cip } from "@/content/seed/homeCip";
import { tdm } from "@/content/seed/images";
import { FloorExplorer } from "@/components/cip/FloorExplorer";
import { CHeading, CFrame, CLedger, CSection, CButton, Ornament } from "@/components/v3/C";

/** Version C · Residences: Phase One pricing as a ledger, then the same floor-by-floor explorer as Version A. */
const clip = (n: string) => ({ video: `/videos/clips/${n}.mp4`, poster: `/videos/clips/${n}-poster.jpg` });

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
      <section aria-labelledby="c-res" className="px-5 pt-16 pb-20 md:px-10 md:pt-20 md:pb-28">
        <div className="mx-auto max-w-[1200px]">
          <CHeading level={1} id="c-res" eyebrow={es ? "Las residencias" : "The residences"} title={x(cip.explorer.title)} intro={x(p.intro)} ornament={false} />
          <CFrame image={{ ...tdm.penthouseLiving, ...clip("p24-penthouse-living") }} locale={locale} sizes="(max-width: 1199px) calc(100vw - 40px), 1200px" ratio="aspect-[4/3] md:aspect-[21/9]" caption={es ? "El salón del penthouse, en dos niveles." : "The penthouse living room, on two levels."} className="mt-14" />
        </div>
      </section>
      <CSection tone="paper" labelledBy="c-price">
        <CHeading id="c-price" eyebrow={x(p.eyebrow)} title={x(p.title)} />
        <div className="mx-auto mt-14 max-w-[720px]">
          <CLedger rows={p.tiers.map((tier) => ({ label: x(tier.label), value: `${tier.value} ${x(p.perSqFt)}` }))} />
          <p className="mt-6 text-center text-[16px] text-charcoal-soft">{x(p.plansNote)}</p>
        </div>
      </CSection>
      <CSection id="explorer" labelledBy="c-floor">
        <CHeading id="c-floor" eyebrow={es ? "Torre 1 · Piso a piso" : "Tower 1 · Floor by floor"} title={es ? "Elija un piso, luego una residencia." : "Choose a floor, then a residence."} />
        <div className="mt-14">
          <FloorExplorer locale={locale} />
        </div>
      </CSection>
      <section aria-label={es ? "Consultar" : "Inquire"} className="bg-bone-deep px-5 py-20 text-center md:px-10 md:py-24">
        <Ornament />
        <p className="mx-auto mt-8 max-w-[26ch] font-[family-name:var(--font-display)] text-[30px] leading-snug text-charcoal md:text-[40px]">{es ? "Reciba los planos completos de la Fase 1." : "Receive the full Phase 1 floor plans."}</p>
        <div className="mt-10">
          <CButton href="/c#inquire">{es ? "Consultar" : "Inquire"}</CButton>
        </div>
      </section>
    </>
  );
}
