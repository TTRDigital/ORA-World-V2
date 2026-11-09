import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getFaqs } from "@/lib/content";
import { pageMetadata, JsonLd, faqLd, breadcrumbLd } from "@/lib/seo";
import type { Locale } from "@/content/types";
import { PageHero } from "@/components/ui/PageHero";
import { FaqSearch } from "@/components/faq/FaqSearch";
import { PillLink } from "@/components/ui/Pill";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const tn = await getTranslations({ locale, namespace: "pages.faq" });
  return pageMetadata({ locale, path: "/faq", title: tn("title"), description: tn("intro") });
}

export default async function FaqPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [faqs, tn, tc] = await Promise.all([getFaqs(), getTranslations({ locale, namespace: "pages.faq" }), getTranslations({ locale, namespace: "common" })]);
  const tf = await getTranslations({ locale, namespace: "pages.facts" });
  const tpg = await getTranslations({ locale, namespace: "pages" });
  const facts = [
    { label: tf("questions"), value: String(faqs.length) },
    { label: tf("topics"), value: String(new Set(faqs.map((f) => f.topic)).size) },
    { label: tf("languages"), value: "EN · ES" },
  ];
  return (
    <div className="flex flex-col gap-3">
      <JsonLd data={[faqLd(faqs.map((f) => ({ q: f.question[locale], a: f.answer[locale].join(" ") }))), breadcrumbLd(locale, [{ name: "ORA World", path: "/" }, { name: tn("title"), path: "/faq" }])]} />
      <PageHero locale={locale} label="ORA World" headline={tn("title")} intro={tn("intro")} compact place={tpg("placeLine")} facts={facts}>
        <PillLink href="/visit" tone="brass">{tc("bookVisit")}</PillLink>
      </PageHero>
      <section className="panel panel-travertine container-x section-y" aria-label={tn("title")}>
        <FaqSearch faqs={faqs} columns={2} variant="centre" />
      </section>
    </div>
  );
}
