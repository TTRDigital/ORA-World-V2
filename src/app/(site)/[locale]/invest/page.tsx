import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getHome, getIncentives, getInvestmentSteps } from "@/lib/content";
import { pageMetadata, JsonLd, breadcrumbLd } from "@/lib/seo";
import { t, tp } from "@/lib/localize";
import type { Locale } from "@/content/types";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { Orientation } from "@/components/invest/Orientation";
import { Act60Reader } from "@/components/invest/Act60Reader";
import { DepositStepper } from "@/components/invest/DepositStepper";
import { Estimator } from "@/components/invest/Estimator";
import { ResilienceDial } from "@/components/home/ResilienceDial";
import { tdm } from "@/content/seed/images";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const ti = await getTranslations({ locale, namespace: "pages.invest" });
  return pageMetadata({ locale, path: "/invest", title: ti("title"), description: ti("intro") });
}

export default async function InvestPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [home, incentives, steps, ti, tn, tv, tc] = await Promise.all([getHome(), getIncentives(), getInvestmentSteps(), getTranslations({ locale, namespace: "pages.invest" }), getTranslations({ locale, namespace: "nav" }), getTranslations({ locale, namespace: "invest" }), getTranslations({ locale, namespace: "common" })]);
  const sections = incentives.map((s) => ({ slug: s.slug, title: t(s.title, locale), summary: t(s.summary, locale), body: tp(s.body, locale), tags: s.tags as string[] }));
  return (
    <div className="flex flex-col gap-3">
      <JsonLd data={breadcrumbLd(locale, [{ name: "ORA World", path: "/" }, { name: tn("invest"), path: "/invest" }])} />
      <PageHero locale={locale} label={t(home.invest.label, locale)} headline={ti("title")} intro={ti("intro")} image={tdm.exteriorGolf}>
        <Link href="/visit" className="pill pill-brass">{tc("talkToAdvisor")}</Link>
      </PageHero>
      <section className="panel panel-travertine container-x section-y" aria-label={t(home.invest.headline, locale).replace(/\*/g, "")}>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7" data-reveal><Orientation sections={sections} /></div>
          <div className="lg:col-span-5" data-reveal><Estimator /></div>
        </div>
      </section>
      <section className="panel panel-bone container-x section-y" aria-label="Act 60">
        <p className="label mb-5" data-reveal>{tv("read")}</p>
        <Act60Reader incentives={incentives} locale={locale} />
        <p className="legal mt-8 max-w-4xl text-charcoal-soft">{t(home.invest.disclaimer, locale)}</p>
      </section>
      <section className="panel panel-travertine container-x section-y" aria-label={tv("depositTitle")}>
        <div className="mx-auto max-w-3xl"><DepositStepper steps={steps} locale={locale} /></div>
      </section>
      <ResilienceDial locale={locale} />
    </div>
  );
}
