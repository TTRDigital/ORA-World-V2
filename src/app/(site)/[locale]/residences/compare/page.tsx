import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getFloorPlans } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/content/types";
import { PageHero } from "@/components/ui/PageHero";
import { PlanCompare } from "@/components/plans/PlanCompare";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const tn = await getTranslations({ locale, namespace: "pages.compare" });
  return pageMetadata({ locale, path: "/residences/compare", title: tn("title"), description: tn("intro"), noIndex: true });
}

export default async function ComparePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [plans, tn] = await Promise.all([getFloorPlans(), getTranslations({ locale, namespace: "pages.compare" })]);
  return (
    <div className="flex flex-col">
      <PageHero locale={locale} label={locale === "es" ? "Residencias" : "Residences"} headline={tn("title")} intro={tn("intro")} compact />
      <section className="panel panel-travertine container-x section-y" aria-label={tn("title")}>
        <PlanCompare plans={plans} locale={locale} />
      </section>
    </div>
  );
}
