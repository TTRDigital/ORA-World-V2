import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { L, Locale } from "@/content/types";
import { t } from "@/lib/localize";
import { cip } from "@/content/seed/homeCip";
import { tdm } from "@/content/seed/images";
import { FloorExplorer } from "@/components/cip/FloorExplorer";
import { BHero, BChapter, BClose } from "@/components/v2/B";

/** Version B · Floor plans: its own layout, the same explorer and Phase One pricing as Version A. */
const clip = (n: string) => ({ video: `/videos/clips/${n}.mp4`, poster: `/videos/clips/${n}-poster.jpg` });

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "es" ? "Planos · Versión B" : "Floor plans · Version B", robots: { index: false, follow: false } };
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const es = locale === "es";
  const x = (l: L) => t(l, locale);
  const p = cip.plans;
  return (
    <>
      <BHero image={{ ...tdm.penthouseLiving, ...clip("p24-penthouse-living") }} locale={locale} eyebrow={x(cip.explorer.eyebrow)} title={x(cip.explorer.title)} line={x(p.intro)} cue={es ? "Desplácese" : "Scroll to explore"} />
      <BChapter eyebrow={x(p.eyebrow)} title={x(p.title)} intro={x(p.plansNote)}>
        <dl className="grid gap-px overflow-hidden bg-bone/15 md:grid-cols-3">
          {p.tiers.map((tier) => (
            <div key={tier.value} className="bg-basalt p-8 md:p-10">
              <dt className="text-[11px] tracking-[0.28em] text-brass-light uppercase">{x(tier.label)}</dt>
              <dd className="mt-6 font-[family-name:var(--font-display)] text-[72px] leading-none [font-variant-numeric:lining-nums] md:text-[96px]">{tier.value}</dd>
              <dd className="mt-3 text-[14px] text-bone/70">{x(p.perSqFt)}</dd>
            </div>
          ))}
        </dl>
      </BChapter>
      <BChapter id="explorer" tone="light" eyebrow={es ? "Torre 1 · Piso a piso" : "Tower 1 · Floor by floor"} title={es ? "Elija un piso, luego una residencia." : "Choose a floor, then a residence."}>
        <FloorExplorer locale={locale} />
      </BChapter>
      <BClose image={tdm.exteriorRoad} locale={locale} eyebrow={es ? "Planos de la Fase 1" : "Phase 1 floor plans"} title={es ? "Reciba los planos completos." : "Receive the full floor plans."} inquire={es ? "Consultar" : "Inquire"} second={{ href: "/b/finishes", label: es ? "Acabados" : "Finishes" }} />
    </>
  );
}
