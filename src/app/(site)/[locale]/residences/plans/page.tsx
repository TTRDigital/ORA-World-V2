import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getCollections, getFloorPlans, getSiteSettings } from "@/lib/content";
import { pageMetadata, JsonLd, breadcrumbLd } from "@/lib/seo";
import type { Locale } from "@/content/types";
import { PageHero } from "@/components/ui/PageHero";
import { PlanLibrary } from "@/components/plans/PlanLibrary";
import { PillLink } from "@/components/ui/Pill";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const tp = await getTranslations({ locale, namespace: "plans" });
  return pageMetadata({ locale, path: "/residences/plans", title: tp("title"), description: locale === "es" ? "Planos de la Fase 1 de Tesoro Del Mar: 60 residencias en la Torre 1, de un dormitorio con estudio al penthouse de dos niveles." : "Tesoro Del Mar Phase 1 floor plans: 60 residences in Tower 1, from one bedroom with den to the two-level penthouse." });
}

export default async function PlansPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [plans, collections, settings, tp, tn, tc] = await Promise.all([getFloorPlans(), getCollections(), getSiteSettings(), getTranslations({ locale, namespace: "plans" }), getTranslations({ locale, namespace: "nav" }), getTranslations({ locale, namespace: "common" })]);
  return (
    <div className="flex flex-col">
      <JsonLd data={breadcrumbLd(locale, [{ name: "ORA World", path: "/" }, { name: tn("residences"), path: "/residences" }, { name: tp("title"), path: "/residences/plans" }])} />
      <PageHero locale={locale} label={tn("residences")} headline={tp("title")} intro={locale === "es" ? "Fase 1, Torre 1, pisos 5 al 18: 60 residencias en 15 distribuciones, de un dormitorio con estudio al penthouse de dos niveles. Todas con techos de 10 pies. Planos sujetos a cambios." : "Phase 1, Tower 1, floors 5 to 18: 60 residences in 15 layouts, from one bedroom with den to the two-level penthouse. Every residence has 10' ceilings. Plans are subject to change."} compact>
        {settings.floorPlansUrl && (
          <a href={settings.floorPlansUrl} target="_blank" rel="noopener" className="pill pill-basalt" data-track="floor_plans_pdf">
            {locale === "es" ? "PDF completo de planos" : "Full floor plan PDF"}
          </a>
        )}
        <PillLink href="/residences/compare" tone="ghost">{tp("compare")}</PillLink>
        <PillLink href="/visit" tone="brass">{tc("bookVisit")}</PillLink>
      </PageHero>
      <section className="panel panel-travertine container-x section-y" aria-label={tp("title")}>
        <PlanLibrary plans={plans} collections={collections} locale={locale} />
      </section>
    </div>
  );
}
