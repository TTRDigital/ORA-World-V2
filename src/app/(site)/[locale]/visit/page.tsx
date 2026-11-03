import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getSiteSettings } from "@/lib/content";
import { pageMetadata, JsonLd, breadcrumbLd } from "@/lib/seo";
import type { Locale } from "@/content/types";
import { PageHero } from "@/components/ui/PageHero";
import { VisitJourney } from "@/components/visit/VisitJourney";
import { tdm } from "@/content/seed/images";
import { Tbc } from "@/components/ui/Tbc";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const tv = await getTranslations({ locale, namespace: "pages.visit" });
  return pageMetadata({ locale, path: "/visit", title: tv("title"), description: tv("intro") });
}

export default async function VisitPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [settings, tv, tn] = await Promise.all([getSiteSettings(), getTranslations({ locale, namespace: "pages.visit" }), getTranslations({ locale, namespace: "nav" })]);
  const address = settings.salesGalleryAddress?.[locale] ?? null;
  return (
    <div className="flex flex-col gap-3">
      <JsonLd data={breadcrumbLd(locale, [{ name: "ORA World", path: "/" }, { name: tn("visit"), path: "/visit" }])} />
      <PageHero locale={locale} label={tn("contact")} headline={tv("title")} intro={tv("intro")} image={tdm.foyerReception} />
      <section className="panel panel-travertine container-x section-y" aria-label={tv("title")}>
        <VisitJourney bookingUrl={settings.bookingUrl} consentText={settings.consentText[locale]} galleryAddress={address} />
      </section>
      <section className="panel panel-bone container-x py-10" aria-label={tn("contact")}>
        <dl className="grid gap-4 sm:grid-cols-3 text-[15px]">
          <div className="card p-5"><dt className="label mb-1">{settings.salesGalleryName[locale]}</dt><dd>{address ?? <Tbc />}</dd></div>
          <div className="card p-5"><dt className="label mb-1">{locale === "es" ? "Horario" : "Hours"}</dt><dd>{settings.hours?.[locale] ?? <Tbc />}</dd></div>
          <div className="card p-5"><dt className="label mb-1">{locale === "es" ? "Teléfono y correo" : "Phone and email"}</dt><dd>{settings.phone || settings.email ? <>{settings.phone && <a href={`tel:${settings.phone}`} className="block">{settings.phone}</a>}{settings.email && <a href={`mailto:${settings.email}`} className="block">{settings.email}</a>}</> : <Tbc />}</dd></div>
        </dl>
      </section>
    </div>
  );
}
