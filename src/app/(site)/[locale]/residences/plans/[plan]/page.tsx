import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getCollection, getFloorPlan, getFloorPlans, getSiteSettings } from "@/lib/content";
import { pageMetadata, JsonLd, breadcrumbLd } from "@/lib/seo";
import { t } from "@/lib/localize";
import type { Locale } from "@/content/types";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { RegistrationGate } from "@/components/gate/RegistrationGate";
import { ZoomImage } from "@/components/plans/ZoomImage";
import { ShortlistButton } from "@/components/plans/ShortlistButton";
import { ShortlistBar } from "@/components/plans/ShortlistBar";
import { Tbc } from "@/components/ui/Tbc";
import { Picture } from "@/components/ui/Picture";
import { Check, Lock } from "@/components/ui/Icons";

export async function generateStaticParams() {
  const plans = await getFloorPlans();
  return routing.locales.flatMap((locale) => plans.map((p) => ({ locale, plan: p.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; plan: string }> }): Promise<Metadata> {
  const { locale, plan } = await params;
  const p = await getFloorPlan(plan);
  if (!p) return {};
  return pageMetadata({ locale, path: `/residences/plans/${plan}`, title: t(p.name, locale), description: `${p.bedrooms} ${locale === "es" ? "habitaciones" : "bedrooms"} · ${p.building} · ${t(p.view, locale)}` });
}

export default async function PlanPage({ params }: { params: Promise<{ locale: Locale; plan: string }> }) {
  const { locale, plan: slug } = await params;
  setRequestLocale(locale);
  const plan = await getFloorPlan(slug);
  if (!plan) notFound();
  const [collection, settings, tp, tn, tc] = await Promise.all([getCollection(plan.collection), getSiteSettings(), getTranslations({ locale, namespace: "plans" }), getTranslations({ locale, namespace: "nav" }), getTranslations({ locale, namespace: "common" })]);
  const crumbs = [{ name: "ORA World", path: "/" }, { name: tn("residences"), path: "/residences" }, { name: tp("title"), path: "/residences/plans" }, { name: t(plan.name, locale), path: `/residences/plans/${plan.slug}` }];
  const kp = plan.keyplanPosition;
  return (
    <div className="flex flex-col">
      <JsonLd data={breadcrumbLd(locale, crumbs)} />
      <section className="panel panel-bone container-x pb-10 md:pb-14">
        <Breadcrumbs locale={locale} items={crumbs} />
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="label mb-2">{collection ? t(collection.name, locale) : tn("residences")}</p>
            <h1 className="display-xl">{t(plan.name, locale)}</h1>
            <p className="statement mt-3 text-charcoal-soft">{plan.bedrooms} {tp("bedrooms").toLowerCase()} · {plan.bathrooms} {tp("bath").toLowerCase()} · {plan.building} · {t(plan.view, locale)}</p>
          </div>
          <div className="flex gap-2">
            <ShortlistButton slug={plan.slug} />
            <Link href="/visit" className="pill pill-brass">{tp("requestPricing")}</Link>
          </div>
        </div>
      </section>
      <section className="panel panel-travertine container-x section-y" aria-label={t(plan.name, locale)}>
        <RegistrationGate
          consentText={settings.consentText[locale]}
          preview={
            <div className="card relative overflow-hidden p-6" data-testid="locked-card">
              <div className="frame bg-bone" style={{ aspectRatio: "4/3" }}>
                <div className="absolute inset-0 grid place-items-center">
                  <span className="inline-flex items-center gap-2 rounded-full bg-bone-deep px-4 py-2 text-[14px] font-semibold text-brass-ink"><Lock /> {tp("title")}</span>
                </div>
              </div>
              <p className="small mt-4 text-charcoal-soft">{locale === "es" ? "El detalle completo del plano está disponible tras el registro" : "Full plan detail is available after registration"}</p>
            </div>
          }
        >
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <ZoomImage image={plan.image} locale={locale} />
              {plan.placeholder && <p className="small mt-3 text-brass-ink">{tc("placeholderPlan")}</p>}
            </div>
            <aside className="grid content-start gap-4 lg:col-span-4">
              <div className="card p-5">
                <p className="label mb-3">{tp("keyplan")}</p>
                {plan.keyplan && (
                  <div className="frame relative bg-bone" style={{ aspectRatio: "1/1" }}>
                    <Image src={plan.keyplan.src} alt={plan.keyplan.alt[locale]} fill sizes="(max-width: 1024px) 92vw, 30vw" unoptimized className="object-contain" />
                    {kp && <span aria-hidden className="absolute rounded-sm bg-brass/40 ring-2 ring-brass" style={{ left: `${kp.x}%`, top: `${kp.y}%`, width: `${kp.w}%`, height: `${kp.h}%` }} />}
                  </div>
                )}
              </div>
              <dl className="card tabular grid grid-cols-2 gap-3 p-5 text-[15px]">
                <dt className="text-charcoal-soft">{tp("interior")}</dt><dd className="font-semibold">{plan.interiorSqFt ? `${plan.interiorSqFt.toLocaleString()} sq ft` : <Tbc />}</dd>
                <dt className="text-charcoal-soft">{tp("exterior")}</dt><dd className="font-semibold">{plan.exteriorSqFt ? `${plan.exteriorSqFt.toLocaleString()} sq ft` : <Tbc />}</dd>
                <dt className="text-charcoal-soft">{tp("bedrooms")}</dt><dd className="font-semibold">{plan.bedrooms}</dd>
                <dt className="text-charcoal-soft">{tp("bath")}</dt><dd className="font-semibold">{plan.bathrooms}{plan.powder ? ` + ${plan.powder} ${tp("powderShort")}` : ""}</dd>
                <dt className="text-charcoal-soft">{tp("building")}</dt><dd className="font-semibold">{plan.building}{plan.floors ? ` · ${tp("floors")} ${plan.floors}` : ""}</dd>
                <dt className="text-charcoal-soft">{locale === "es" ? "Estado" : "Status"}</dt><dd className="font-semibold">{tp(`status.${plan.status}`)}</dd>
              </dl>
              <ul className="card grid gap-2 p-5 text-[15px]">
                {plan.highlights.map((h) => (
                  <li key={h.en} className="flex items-center gap-2"><Check className="text-brass-ink" />{t(h, locale)}</li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                {plan.pdf ? <a href={plan.pdf} className="pill pill-basalt">{tp("download")}</a> : <span className="pill pill-ghost cursor-default opacity-70">{tp("noPdf")}</span>}
                <Link href="/visit" className="pill pill-brass">{tp("requestPricing")}</Link>
              </div>
              {collection && (
                <Link href={`/residences/${collection.slug}`} className="card lift block overflow-hidden">
                  <Picture image={collection.image} locale={locale} ratio="16/10" rounded="none" sizes="(max-width: 1024px) 92vw, 30vw" />
                  <span className="block p-4 font-semibold">{t(collection.name, locale)}</span>
                </Link>
              )}
            </aside>
          </div>
        </RegistrationGate>
        <ShortlistBar />
      </section>
    </div>
  );
}
