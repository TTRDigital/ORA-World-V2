import { getTranslations } from "next-intl/server";
import type { Locale } from "@/content/types";
import { getFaqs, getHome } from "@/lib/content";
import { t, tp } from "@/lib/localize";
import { Module } from "@/components/ui/Module";
import { FaqSearch } from "@/components/faq/FaqSearch";
import { JsonLd, faqLd } from "@/lib/seo";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "@/components/ui/Icons";

/** Module 11: FAQ. Search across every question with topic chips; eight featured in two columns; FAQPage JSON-LD. */
export async function HomeFaq({ locale }: { locale: Locale }) {
  const [home, faqs, tf] = await Promise.all([getHome(), getFaqs(), getTranslations({ locale, namespace: "faq" })]);
  const m = home.faq;
  if (!m.enabled) return null;
  const featured = m.slugs.filter((s) => faqs.some((f) => f.slug === s));
  const featuredFaqs = featured.map((s) => faqs.find((f) => f.slug === s)!);
  return (
    <Module id="faq" tone="bone" label={t(m.label, locale)} headline={t(m.headline, locale)}>
      <JsonLd data={faqLd(featuredFaqs.map((f) => ({ q: t(f.question, locale), a: tp(f.answer, locale).join(" ") })))} />
      <FaqSearch faqs={faqs} columns={2} featured={featured} stagger />
      <div className="mt-8 flex justify-center md:justify-start" data-reveal>
        <Link href="/faq" className="pill pill-ghost min-h-12 gap-1">
          {tf("all")} <ArrowRight width={16} height={16} />
        </Link>
      </div>
    </Module>
  );
}
