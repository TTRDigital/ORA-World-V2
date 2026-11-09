import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPortfolio, getTeam } from "@/lib/content";
import { pageMetadata, JsonLd, breadcrumbLd } from "@/lib/seo";
import { t, tp } from "@/lib/localize";
import type { Locale } from "@/content/types";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { Picture } from "@/components/ui/Picture";
import { Portfolio } from "@/components/home/Portfolio";
import { places } from "@/content/seed/images";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const tpf = await getTranslations({ locale, namespace: "pages.portfolio" });
  return pageMetadata({ locale, path: "/portfolio", title: tpf("title"), description: tpf("intro") });
}

export default async function PortfolioPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [team, portfolio, tpf, tn, tc] = await Promise.all([getTeam(), getPortfolio(), getTranslations({ locale, namespace: "pages.portfolio" }), getTranslations({ locale, namespace: "nav" }), getTranslations({ locale, namespace: "common" })]);
  const tf = await getTranslations({ locale, namespace: "pages.facts" });
  const tpg = await getTranslations({ locale, namespace: "pages" });
  // Counted from the published portfolio list, nothing invented.
  const facts = [
    { label: tf("locations"), value: String(portfolio.length) },
    { label: tf("municipalities"), value: String(new Set(portfolio.filter((l) => l.pin).map((l) => l.pin!.municipality)).size) },
    { label: tf("projectPages"), value: String(portfolio.filter((l) => l.href).length) },
    { label: tf("revealed"), value: String(portfolio.filter((l) => !l.revealed).length) },
  ];
  return (
    <div className="flex flex-col gap-3">
      <JsonLd data={breadcrumbLd(locale, [{ name: "ORA World", path: "/" }, { name: tn("portfolio"), path: "/portfolio" }])} />
      <PageHero locale={locale} label="ORA World" headline={tpf("title")} intro={tpf("intro")} image={places.coastalAerial} place={tpg("placeLine")} facts={facts}>
        <Link href="/visit" className="pill pill-brass">{tc("bookVisit")}</Link>
      </PageHero>
      <Portfolio locale={locale} />
      {team.length > 0 && (
        <section className="panel panel-bone container-x section-y" aria-label="ORA World">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
            {team[0].portrait && (
              <div className="lg:col-span-5"><Picture image={team[0].portrait} locale={locale} ratio="4/3" rounded="lg" sizes="(max-width: 1024px) 92vw, 40vw" /></div>
            )}
            <div className="lg:col-span-7">
              <p className="label mb-2" data-reveal>{t(team[0].role, locale)}</p>
              <h2 className="display-m" data-reveal>{team[0].name}</h2>
              {tp(team[0].bio, locale).map((p, i) => <p key={i} className="statement mt-4 text-charcoal-soft" data-reveal>{p}</p>)}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
