import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getCollection, getCollections, getFloorPlans } from "@/lib/content";
import { pageMetadata, JsonLd, breadcrumbLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/utils";
import { t, tp } from "@/lib/localize";
import type { Locale } from "@/content/types";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { Picture } from "@/components/ui/Picture";
import { CollectionGallery } from "@/components/residences/CollectionGallery";
import { PlanCard } from "@/components/plans/PlanCard";
import { ShortlistBar } from "@/components/plans/ShortlistBar";
import { Tbc } from "@/components/ui/Tbc";
import { ArrowRight, Check } from "@/components/ui/Icons";

export async function generateStaticParams() {
  const cs = await getCollections();
  return routing.locales.flatMap((locale) => cs.map((c) => ({ locale, collection: c.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; collection: string }> }): Promise<Metadata> {
  const { locale, collection } = await params;
  const c = await getCollection(collection);
  if (!c) return {};
  return pageMetadata({ locale, path: `/residences/${collection}`, title: t(c.name, locale), description: t(c.tagline, locale), image: `${SITE_URL}${c.image.src}` });
}

export default async function CollectionPage({ params }: { params: Promise<{ locale: Locale; collection: string }> }) {
  const { locale, collection: slug } = await params;
  setRequestLocale(locale);
  const c = await getCollection(slug);
  if (!c) notFound();
  const [all, plans, tr, tn, tc, te] = await Promise.all([getCollections(), getFloorPlans(), getTranslations({ locale, namespace: "pages.residences" }), getTranslations({ locale, namespace: "nav" }), getTranslations({ locale, namespace: "common" }), getTranslations({ locale, namespace: "explorer" })]);
  const own = plans.filter((p) => p.collection === c.slug);
  const pos = all.findIndex((x) => x.slug === c.slug);
  const nextC = all.length > 1 ? all[(pos + 1) % all.length] : null;
  return (
    <div className="flex flex-col gap-3">
      <JsonLd data={breadcrumbLd(locale, [{ name: "ORA World", path: "/" }, { name: tn("residences"), path: "/residences" }, { name: t(c.name, locale), path: `/residences/${c.slug}` }])} />
      <PageHero locale={locale} label={tr("collections")} headline={t(c.name, locale)} intro={t(c.tagline, locale)} image={c.image}>
        <Link href="/residences/plans" className="pill pill-brass">{tc("viewPlans")}</Link>
        <Link href="/visit" className="pill pill-ghost">{tc("bookVisit")}</Link>
      </PageHero>
      {/* Collection switcher: every collection one tap away, the current one marked. */}
      <nav aria-label={te("otherCollections")} className="panel panel-bone container-x py-4">
        <ul className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
          {all.map((x, n) => (
            <li key={x.slug} className="shrink-0">
              <Link
                href={`/residences/${x.slug}`}
                aria-current={x.slug === c.slug ? "page" : undefined}
                className={x.slug === c.slug ? "chip is-active min-h-11 gap-2" : "chip min-h-11 gap-2"}
              >
                <span className="numeral text-[15px] opacity-70">{String(n + 1).padStart(2, "0")}</span>
                {t(x.name, locale)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <section className="panel panel-travertine container-x section-y" aria-label={tr("gallery")}>
        <CollectionGallery images={c.gallery} locale={locale} label={t(c.name, locale)} />
      </section>
      <section className="panel panel-bone container-x section-y" aria-label={te("features")}>
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            {tp(c.description, locale).map((p, i) => (
              <p key={i} className="statement mb-4 text-charcoal-soft" data-reveal>{p}</p>
            ))}
          </div>
          <div className="grid gap-4 lg:col-span-7 md:grid-cols-2">
            <div className="card p-5" data-reveal>
              <p className="label mb-3">{te("features")}</p>
              <ul className="grid gap-2 text-[15px]">
                {c.features.map((f, i) => (
                  <li key={f.en} className="flex items-start gap-2" data-reveal style={{ "--reveal-delay": `${i * 100}ms` } as React.CSSProperties}><Check className="mt-0.5 shrink-0 text-brass-ink" />{t(f, locale)}</li>
                ))}
              </ul>
            </div>
            <div className="card p-5" data-reveal style={{ "--reveal-delay": "100ms" } as React.CSSProperties}>
              <p className="label mb-3">{te("specs")}</p>
              <table className="tabular w-full text-[15px]">
                <tbody>
                  {c.specs.map((s) => (
                    <tr key={s.label.en} className="border-t border-travertine-deep first:border-0">
                      <th scope="row" className="py-2 text-left font-medium text-charcoal-soft">{t(s.label, locale)}</th>
                      <td className="py-2 text-right font-semibold">{s.value ? t(s.value, locale) : <Tbc />}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {c.finishes.length > 0 && (
              <div className="card p-5 md:col-span-2" data-reveal style={{ "--reveal-delay": "200ms" } as React.CSSProperties}>
                <p className="label mb-3">{tr("finishes")}</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {c.finishes.map((g) => (
                    <div key={g.group.en}>
                      <p className="font-semibold">{t(g.group, locale)}</p>
                      <ul className="mt-1 grid gap-1 text-[15px] text-charcoal-soft">
                        {g.items.map((it) => <li key={it.en}>{t(it, locale)}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      {own.length > 0 && (
        <section className="panel panel-travertine container-x section-y" aria-label={tn("plans")}>
          <div className="mb-6 flex items-end justify-between gap-4">
            <p className="label">{tn("plans")}</p>
            <Link href="/residences/plans" className="pill pill-ghost">{tc("viewPlans")}</Link>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {own.map((p, i) => <PlanCard key={p.slug} plan={p} locale={locale} index={i} />)}
          </ul>
          <ShortlistBar />
        </section>
      )}
      {nextC && (
        <Link href={`/residences/${nextC.slug}`} className="panel panel-basalt on-dark group container-x grid gap-6 py-8 md:grid-cols-[1fr_auto] md:items-center md:py-10" data-tone="dark">
          <span>
            <span className="label block">{te("nextCollection")}</span>
            <span className="display-m mt-2 block text-bone">{t(nextC.name, locale)}</span>
            <span className="small mt-1 block text-bone/75">{t(nextC.tagline, locale)}</span>
          </span>
          <span className="flex items-center gap-4">
            <span className="relative block h-[96px] w-[154px] overflow-hidden rounded-[16px] md:h-[120px] md:w-[192px]">
              <Picture image={nextC.image} locale={locale} ratio="8/5" rounded="none" reveal={false} sizes="(max-width: 767px) 154px, 192px" className="absolute inset-0 h-full w-full rounded-none" imgClassName="transition-transform duration-700 group-hover:scale-105" />
            </span>
            <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-brass text-basalt transition-transform duration-500 group-hover:translate-x-1">
              <ArrowRight />
            </span>
          </span>
        </Link>
      )}
    </div>
  );
}
