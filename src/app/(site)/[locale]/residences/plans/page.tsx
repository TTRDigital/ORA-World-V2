import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata, JsonLd, breadcrumbLd } from "@/lib/seo";
import type { Locale } from "@/content/types";
import { PageHero } from "@/components/ui/PageHero";
import { PillLink } from "@/components/ui/Pill";
import { FloorExplorer } from "@/components/cip/FloorExplorer";
import { cip } from "@/content/seed/homeCip";
import { t } from "@/lib/localize";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const tp = await getTranslations({ locale, namespace: "plans" });
  return pageMetadata({ locale, path: "/residences/plans", title: tp("title"), description: locale === "es" ? "Planos de la Fase 1 de Tesoro Del Mar: 60 residencias en la Torre 1, de un dormitorio con estudio al penthouse de dos niveles." : "Tesoro Del Mar Phase 1 floor plans: 60 residences in Tower 1, from one bedroom with den to the two-level penthouse." });
}

export default async function PlansPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [tp, tn] = await Promise.all([getTranslations({ locale, namespace: "plans" }), getTranslations({ locale, namespace: "nav" })]);
  return (
    <div className="flex flex-col">
      <JsonLd data={breadcrumbLd(locale, [{ name: "ORA World", path: "/" }, { name: tn("residences"), path: "/residences" }, { name: tp("title"), path: "/residences/plans" }])} />
      <PageHero locale={locale} label={tn("residences")} headline={tp("title")} intro={locale === "es" ? "Fase 1, Torre 1, pisos 5 al 18: 60 residencias en 15 distribuciones, de un dormitorio con estudio al penthouse de dos niveles. Todas con techos de 10 pies. Planos sujetos a cambios." : "Phase 1, Tower 1, floors 5 to 18: 60 residences in 15 layouts, from one bedroom with den to the two-level penthouse. Every residence has 10' ceilings. Plans are subject to change."} compact>
        {/* Client: the complete PDF is sent by the sales team after an inquiry, so the page offers "Inquire". */}
        <PillLink href="/#inquire" tone="brass">{locale === "es" ? "Consultar" : "Inquire"}</PillLink>
        {/* Client, 18 Nov: no "Compare" button here. */}
      </PageHero>
      {/* Client, 17 Nov: the floor-plan explorer moved here from the homepage. */}
      <section id="floor-plans" aria-labelledby="floor-plans-title" className="border-b border-travertine-deep/60 bg-bone px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1280px]">
          <p className="eyebrow">
            <span className="rule" aria-hidden />
            {t(cip.explorer.eyebrow, locale)}
          </p>
          <div className="mt-5 mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2 id="floor-plans-title" className="font-[family-name:var(--font-display)] text-[38px] leading-[1.08] font-semibold text-charcoal md:text-[54px]">
              {t(cip.explorer.title, locale)}
            </h2>
            <p className="text-[12px] font-semibold tracking-[0.24em] text-charcoal-soft uppercase">
              {t(cip.plans.title, locale)} · {t(cip.plans.startingFrom, locale)} <span className="font-[family-name:var(--font-display)] text-[24px] tracking-normal text-charcoal normal-case">{cip.plans.tiers[0].value}</span> {t(cip.plans.perSqFt, locale)}
            </p>
          </div>
          <FloorExplorer locale={locale} />
        </div>
      </section>
      {/* Client, 17 Nov: the plan-card library removed; the explorer above carries every residence. */}
    </div>
  );
}
