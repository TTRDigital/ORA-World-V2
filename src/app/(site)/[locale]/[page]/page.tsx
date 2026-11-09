import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPage, getSiteSettings } from "@/lib/content";
import { pageMetadata, JsonLd, breadcrumbLd } from "@/lib/seo";
import { t, tp } from "@/lib/localize";
import type { Locale } from "@/content/types";
import { PageHero } from "@/components/ui/PageHero";
import { Picture } from "@/components/ui/Picture";
import { SectionIndex } from "@/components/ui/SectionIndex";
import { LeadFormLazy } from "@/components/forms/LeadFormLazy";
import { routing } from "@/i18n/routing";

const GENERIC = ["privacy", "terms", "accessibility", "legal-disclaimer", "careers", "hotel-development"];

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) => GENERIC.map((page) => ({ locale, page })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; page: string }> }): Promise<Metadata> {
  const { locale, page } = await params;
  const doc = await getPage(page);
  if (!doc || !GENERIC.includes(page)) return {};
  return pageMetadata({ locale, path: `/${page}`, title: t(doc.title, locale), description: t(doc.seoDescription, locale) });
}

export default async function GenericPage({ params }: { params: Promise<{ locale: Locale; page: string }> }) {
  const { locale, page } = await params;
  if (!GENERIC.includes(page)) notFound();
  setRequestLocale(locale);
  const [doc, settings, tn] = await Promise.all([getPage(page), getSiteSettings(), getTranslations({ locale, namespace: "nav" })]);
  if (!doc) notFound();
  const sections = doc.sections.map((s, i) => ({ ...s, id: `s-${i + 1}`, title: t(s.title, locale) }));
  const isForm = page === "careers";
  return (
    <div className="flex flex-col">
      <JsonLd data={breadcrumbLd(locale, [{ name: "ORA World", path: "/" }, { name: t(doc.title, locale), path: `/${page}` }])} />
      <PageHero locale={locale} label={tn("home")} headline={t(doc.title, locale)} intro={t(doc.intro, locale)} image={doc.hero} compact={!doc.hero} />
      <section className="panel panel-travertine container-x section-y" aria-label={t(doc.title, locale)}>
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <SectionIndex items={sections.map((s) => ({ id: s.id, title: s.title }))} label={t(doc.title, locale)} />
          </div>
          <div className="grid gap-10 lg:col-span-9">
            {sections.map((s, i) => (
              <article key={s.id} id={s.id} className="card grid gap-5 p-6 md:p-8" data-reveal style={{ "--reveal-delay": `${i * 60}ms` } as React.CSSProperties}>
                <h2 className="display-s">{s.title}</h2>
                {s.image && <Picture image={s.image} locale={locale} ratio="16/10" sizes="(max-width: 1024px) 88vw, 60vw" />}
                {tp(s.body, locale).map((p, j) => (
                  <p key={j} className="body text-charcoal-soft">{p}</p>
                ))}
              </article>
            ))}
            {isForm && (
              <div className="card p-6 md:p-8" data-reveal>
                <LeadFormLazy variant="full" consentText={settings.consentText[locale]} />
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
