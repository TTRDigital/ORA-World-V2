import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPage, getSiteSettings } from "@/lib/content";
import { pageMetadata, JsonLd, breadcrumbLd } from "@/lib/seo";
import { t, tp } from "@/lib/localize";
import type { Locale } from "@/content/types";
import { PageHero } from "@/components/ui/PageHero";
import { LeadFormLazy } from "@/components/forms/LeadFormLazy";
import { Check } from "@/components/ui/Icons";
import { Tbc } from "@/components/ui/Tbc";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const doc = await getPage("brokers");
  return pageMetadata({ locale, path: "/brokers", title: t(doc?.title, locale), description: t(doc?.seoDescription, locale) });
}

export default async function BrokersPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [doc, settings, tf, tn] = await Promise.all([getPage("brokers"), getSiteSettings(), getTranslations({ locale, namespace: "form" }), getTranslations({ locale, namespace: "nav" })]);
  if (!doc) return null;
  const steps = locale === "es" ? ["Registre su licencia y a su cliente", "El equipo de ventas confirma por correo", "Reciba precios y planos en primicia"] : ["Register your licence and your client", "The sales team confirms by email", "Receive pricing and plans first"];
  return (
    <div className="flex flex-col">
      <JsonLd data={breadcrumbLd(locale, [{ name: "ORA World", path: "/" }, { name: tn("brokers"), path: "/brokers" }])} />
      <PageHero locale={locale} label={tn("brokers")} headline={t(doc.title, locale)} intro={t(doc.intro, locale)} image={doc.hero} />
      <section className="panel panel-travertine container-x section-y" aria-label={t(doc.title, locale)}>
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="grid gap-6 lg:col-span-5">
            <ol className="grid gap-3">
              {steps.map((s, i) => (
                <li key={s} className="card flex items-center gap-4 p-4" data-reveal style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}>
                  <span className="numeral text-brass text-[32px]">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-semibold">{s}</span>
                </li>
              ))}
            </ol>
            {doc.sections.map((s) => (
              <div key={t(s.title, locale)} className="card p-6" data-reveal>
                <h2 className="display-s mb-3">{t(s.title, locale)}</h2>
                {tp(s.body, locale).map((p, j) => (
                  <p key={j} className="body text-charcoal-soft">{p}</p>
                ))}
                <dl className="mt-4 grid grid-cols-2 gap-3 text-[15px]">
                  <dt className="text-charcoal-soft">{locale === "es" ? "Comisión" : "Commission"}</dt><dd><Tbc /></dd>
                  <dt className="text-charcoal-soft">{locale === "es" ? "Kit para corredores" : "Broker kit"}</dt><dd><Tbc /></dd>
                  <dt className="text-charcoal-soft">{locale === "es" ? "Registro válido" : "Registration validity"}</dt><dd><Tbc /></dd>
                </dl>
              </div>
            ))}
            <ul className="grid gap-2 text-[15px]">
              {(locale === "es" ? ["Confirmación por correo en un día hábil", "Precios y planos para clientes registrados primero"] : ["Email confirmation within one business day", "Pricing and plans to registered clients first"]).map((x) => (
                <li key={x} className="flex items-center gap-2"><Check className="text-brass-ink" />{x}</li>
              ))}
            </ul>
          </div>
          <div className="card p-6 md:p-8 lg:col-span-7" data-reveal>
            <h2 className="display-s mb-4">{tf("register")}</h2>
            <LeadFormLazy variant="broker" consentText={settings.consentText[locale]} defaults={{ role: "broker" }} submitLabel={tf("register")} />
          </div>
        </div>
      </section>
    </div>
  );
}
