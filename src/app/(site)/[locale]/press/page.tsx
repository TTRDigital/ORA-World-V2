import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPress } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { t } from "@/lib/localize";
import type { Locale } from "@/content/types";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { Picture } from "@/components/ui/Picture";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const tn = await getTranslations({ locale, namespace: "pages.press" });
  return pageMetadata({ locale, path: "/press", title: tn("title"), description: tn("intro") });
}

/** Hidden until real articles exist: with no real press, the route is a 404 and is left out of navigation. */
export default async function PressPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [press, tn] = await Promise.all([getPress(), getTranslations({ locale, namespace: "pages.press" })]);
  if (press.length === 0) notFound();
  return (
    <div className="flex flex-col">
      <PageHero locale={locale} label="ORA World" headline={tn("title")} intro={tn("intro")} compact />
      <section className="panel panel-travertine container-x section-y">
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {press.map((a, i) => (
            <li key={a.slug} className="card lift overflow-hidden" data-reveal style={{ "--reveal-delay": `${i * 60}ms` } as React.CSSProperties}>
              <Link href={`/press/${a.slug}`} className="block">
                {a.image && <Picture image={a.image} locale={locale} ratio="16/10" rounded="none" sizes="(max-width: 768px) 92vw, 30vw" />}
                <div className="p-5">
                  <p className="label">{a.outlet} · {a.date}</p>
                  <h2 className="display-s mt-2">{t(a.title, locale)}</h2>
                  <p className="small mt-2 text-charcoal-soft">{t(a.excerpt, locale)}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
