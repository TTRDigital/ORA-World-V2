import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getProjects } from "@/lib/content";
import { pageMetadata, JsonLd, breadcrumbLd } from "@/lib/seo";
import { t } from "@/lib/localize";
import type { Locale } from "@/content/types";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { Picture } from "@/components/ui/Picture";
import { Island } from "@/components/home/Island";
import { CompareProjects } from "@/components/home/CompareProjects";
import { tdm, dw } from "@/content/seed/images";
import { ArrowRight } from "@/components/ui/Icons";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const tpg = await getTranslations({ locale, namespace: "pages.place" });
  return pageMetadata({ locale, path: "/place", title: tpg("title"), description: tpg("intro") });
}

export default async function PlacePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [projects, tpg, tn, tc] = await Promise.all([getProjects(), getTranslations({ locale, namespace: "pages.place" }), getTranslations({ locale, namespace: "nav" }), getTranslations({ locale, namespace: "common" })]);
  return (
    <div className="flex flex-col gap-3">
      <JsonLd data={breadcrumbLd(locale, [{ name: "ORA World", path: "/" }, { name: tn("place"), path: "/place" }])} />
      <PageHero locale={locale} label="Dorado · Puerto Rico" headline={tpg("title")} intro={tpg("intro")} image={tdm.aerialCoast}>
        <Link href="/place/gallery" className="pill pill-ghost">{tpg("gallery")}</Link>
        <Link href="/place/tour" className="pill pill-brass">{tpg("tour")}</Link>
      </PageHero>
      <section className="panel panel-travertine container-x section-y" aria-label={tpg("projects")}>
        <p className="label mb-6" data-reveal>{tpg("projects")}</p>
        <ul className="grid gap-4 md:grid-cols-2">
          {projects.map((p, i) => (
            <li key={p.slug} className="card lift overflow-hidden" data-reveal style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}>
              <Link href={`/place/${p.slug}`} className="group block">
                <div className="ambient-zoom"><Picture image={p.slug === "dorado-waterfalls" ? dw.avenue : p.hero} locale={locale} ratio="16/10" rounded="none" reveal={false} sizes="(max-width: 768px) 92vw, 46vw" /></div>
                <div className="flex items-end justify-between gap-4 p-5">
                  <div>
                    <p className="label">{t(p.location, locale)}</p>
                    <h2 className="display-m mt-1">{t(p.name, locale)}</h2>
                    <p className="small mt-1 text-charcoal-soft">{t(p.tagline, locale)}</p>
                  </div>
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-bone-deep text-brass-ink transition-transform duration-500 group-hover:translate-x-1"><ArrowRight /></span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <Island locale={locale} />
      <CompareProjects locale={locale} />
      <section className="panel panel-bone container-x section-y" aria-label={tpg("gallery")}>
        <div className="grid gap-4 md:grid-cols-2">
          {[{ href: "/place/gallery", label: tpg("gallery"), image: tdm.foyerAtrium }, { href: "/place/tour", label: tpg("tour"), image: tdm.penthouseDining }].map((x, i) => (
            <Link key={x.href} href={x.href} className="card lift group relative block overflow-hidden" data-reveal style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}>
              <div className="ambient-zoom"><Picture image={x.image} locale={locale} ratio="16/10" rounded="none" reveal={false} sizes="(max-width: 768px) 92vw, 46vw" /></div>
              <span className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-basalt/80 to-transparent p-5 pt-12 text-bone"><span className="display-s">{x.label}</span><span className="pill pill-brass min-h-10">{tc("explore")}</span></span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
