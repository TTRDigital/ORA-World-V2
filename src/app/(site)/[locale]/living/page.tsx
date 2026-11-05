import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getActivities } from "@/lib/content";
import { pageMetadata, JsonLd, breadcrumbLd } from "@/lib/seo";
import type { Locale } from "@/content/types";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { LivingBento } from "@/components/home/LivingBento";
import { ActivitiesTabs } from "@/components/residences/ActivitiesTabs";
import { life } from "@/content/seed/images";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const tl = await getTranslations({ locale, namespace: "pages.living" });
  return pageMetadata({ locale, path: "/living", title: tl("title"), description: tl("intro") });
}

export default async function LivingPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [activities, tl, tn, tc] = await Promise.all([getActivities(), getTranslations({ locale, namespace: "pages.living" }), getTranslations({ locale, namespace: "nav" }), getTranslations({ locale, namespace: "common" })]);
  return (
    <div className="flex flex-col gap-3">
      <JsonLd data={breadcrumbLd(locale, [{ name: "ORA World", path: "/" }, { name: tn("living"), path: "/living" }])} />
      <PageHero locale={locale} label="ORA World" headline={tl("title")} intro={tl("intro")} image={life.poolTerrace}>
        <Link href="/visit" className="pill pill-brass">{tc("bookVisit")}</Link>
      </PageHero>
      <LivingBento locale={locale} />
      <section className="panel panel-travertine container-x section-y" aria-label={tl("activities")}>
        <p className="label mb-5" data-reveal>{tl("activities")}</p>
        <ActivitiesTabs activities={activities} locale={locale} />
      </section>
    </div>
  );
}
