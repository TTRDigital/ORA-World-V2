import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getCollections, getFloorPlans } from "@/lib/content";
import { pageMetadata, JsonLd, breadcrumbLd } from "@/lib/seo";
import type { Locale } from "@/content/types";
import { PageHero } from "@/components/ui/PageHero";
import { PlanLibrary } from "@/components/plans/PlanLibrary";
import { PillLink } from "@/components/ui/Pill";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const tp = await getTranslations({ locale, namespace: "plans" });
  return pageMetadata({ locale, path: "/residences/plans", title: tp("title"), description: locale === "es" ? "Planos ilustrativos de Tesoro Del Mar con filtros, favoritos y comparación." : "Illustrative Tesoro Del Mar floor plans with filters, shortlist and comparison." });
}

export default async function PlansPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [plans, collections, tp, tn, tc] = await Promise.all([getFloorPlans(), getCollections(), getTranslations({ locale, namespace: "plans" }), getTranslations({ locale, namespace: "nav" }), getTranslations({ locale, namespace: "common" })]);
  return (
    <div className="flex flex-col gap-3">
      <JsonLd data={breadcrumbLd(locale, [{ name: "ORA World", path: "/" }, { name: tn("residences"), path: "/residences" }, { name: tp("title"), path: "/residences/plans" }])} />
      <PageHero locale={locale} label={tn("residences")} headline={tp("title")} intro={locale === "es" ? "Planos ilustrativos hasta que el cliente publique los del arquitecto. Filtre, guarde hasta tres favoritos y compárelos." : "Illustrative plans until the client releases the architect's drawings. Filter, shortlist up to three and compare."} compact>
        <PillLink href="/residences/compare" tone="ghost">{tp("compare")}</PillLink>
        <PillLink href="/visit" tone="brass">{tc("bookVisit")}</PillLink>
      </PageHero>
      <section className="panel panel-travertine container-x section-y" aria-label={tp("title")}>
        <PlanLibrary plans={plans} collections={collections} locale={locale} />
      </section>
    </div>
  );
}
