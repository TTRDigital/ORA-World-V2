import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getCollections } from "@/lib/content";
import { pageMetadata, JsonLd, breadcrumbLd, residenceLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/utils";
import { t } from "@/lib/localize";
import type { Locale } from "@/content/types";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { Picture } from "@/components/ui/Picture";
import { Explorer } from "@/components/home/Explorer";
import { tdm } from "@/content/seed/images";
import { ArrowRight } from "@/components/ui/Icons";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const tr = await getTranslations({ locale, namespace: "pages.residences" });
  return pageMetadata({ locale, path: "/residences", title: tr("title"), description: tr("intro") });
}

export default async function ResidencesPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [collections, tr, tn, tc] = await Promise.all([getCollections(), getTranslations({ locale, namespace: "pages.residences" }), getTranslations({ locale, namespace: "nav" }), getTranslations({ locale, namespace: "common" })]);
  return (
    <div className="flex flex-col gap-3">
      <JsonLd data={[breadcrumbLd(locale, [{ name: "ORA World", path: "/" }, { name: tn("residences"), path: "/residences" }]), residenceLd(locale, "Tesoro Del Mar", tr("intro"), `${SITE_URL}${tdm.exteriorPull.src}`)]} />
      <PageHero locale={locale} label="Tesoro Del Mar" headline={tr("title")} intro={tr("intro")} image={tdm.aptLiving2}>
        <Link href="/residences/plans" className="pill pill-brass">{tc("viewPlans")}</Link>
        <Link href="/visit" className="pill pill-ghost">{tc("bookVisit")}</Link>
      </PageHero>
      <Explorer locale={locale} />
      <section className="panel panel-travertine container-x section-y" aria-label={tr("collections")}>
        <p className="label mb-6" data-reveal>{tr("collections")}</p>
        <ul className="grid gap-4 md:grid-cols-2">
          {collections.map((c, i) => (
            <li key={c.slug} className="card lift overflow-hidden" data-reveal style={{ "--reveal-delay": `${i * 70}ms` } as React.CSSProperties}>
              <Link href={`/residences/${c.slug}`} className="group block">
                <div className="ambient-zoom">
                  <Picture image={c.image} locale={locale} ratio="16/10" rounded="none" reveal={false} sizes="(max-width: 768px) 92vw, 46vw" />
                </div>
                <div className="flex items-end justify-between gap-4 p-5">
                  <div>
                    <h2 className="display-s">{t(c.name, locale)}</h2>
                    <p className="small mt-1 text-charcoal-soft">{t(c.tagline, locale)}</p>
                  </div>
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-bone-deep text-brass-ink transition-transform duration-500 [transition-timing-function:var(--ease-out)] group-hover:translate-x-1"><ArrowRight /></span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
