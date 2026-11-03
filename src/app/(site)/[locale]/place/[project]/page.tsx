import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getProject, getProjects } from "@/lib/content";
import { pageMetadata, JsonLd, breadcrumbLd, placeLd } from "@/lib/seo";
import { t, tp } from "@/lib/localize";
import { SITE_URL } from "@/lib/utils";
import type { Locale } from "@/content/types";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { Picture } from "@/components/ui/Picture";
import { RenderCarousel } from "@/components/place/RenderCarousel";
import { MapLoader } from "@/components/map/MapLoader";
import { Tbc } from "@/components/ui/Tbc";
import { Check } from "@/components/ui/Icons";
import { Headline } from "@/components/ui/Headline";

export async function generateStaticParams() {
  const projects = await getProjects();
  return routing.locales.flatMap((locale) => projects.map((p) => ({ locale, project: p.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; project: string }> }): Promise<Metadata> {
  const { locale, project } = await params;
  const p = await getProject(project);
  if (!p) return {};
  return pageMetadata({ locale, path: `/place/${project}`, title: t(p.name, locale), description: t(p.tagline, locale), image: `${SITE_URL}${p.hero.src}` });
}

export default async function ProjectPage({ params }: { params: Promise<{ locale: Locale; project: string }> }) {
  const { locale, project: slug } = await params;
  setRequestLocale(locale);
  const project = await getProject(slug);
  if (!project) notFound();
  const [tn, tc] = await Promise.all([getTranslations({ locale, namespace: "nav" }), getTranslations({ locale, namespace: "common" })]);
  const crumbs = [{ name: "ORA World", path: "/" }, { name: tn("place"), path: "/place" }, { name: t(project.name, locale), path: `/place/${project.slug}` }];
  return (
    <div className="flex flex-col gap-3">
      <JsonLd data={[breadcrumbLd(locale, crumbs), placeLd(locale, t(project.name, locale), t(project.tagline, locale), `/place/${project.slug}`, `${SITE_URL}${project.hero.src}`, project.lat, project.lng)]} />
      <PageHero locale={locale} label={t(project.location, locale)} headline={t(project.name, locale)} intro={t(project.tagline, locale)} image={project.hero}>
        <Link href="/visit" className="pill pill-brass">{tc("bookVisit")}</Link>
        <Link href="/place/gallery" className="pill pill-ghost">{tn("gallery")}</Link>
      </PageHero>
      <section className="panel panel-travertine container-x section-y" aria-label={locale === "es" ? "Datos" : "Facts"}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {tp(project.summary, locale).map((p, i) => (
            <p key={i} className="statement md:col-span-2 lg:col-span-4" data-reveal>{p}</p>
          ))}
          {project.facts.map((f, i) => (
            <div key={f.label.en} className="card lift p-5" data-reveal style={{ "--reveal-delay": `${i * 50}ms` } as React.CSSProperties}>
              <p className="label mb-2">{t(f.label, locale)}</p>
              <p className="text-[17px] font-semibold">{f.value ? t(f.value, locale) : <Tbc />}</p>
              {f.confirmed && f.value && <span className="small mt-2 inline-flex items-center gap-1 text-palm"><Check width={14} height={14} />{tc("published")}</span>}
            </div>
          ))}
        </div>
      </section>
      <section className="panel panel-bone container-x section-y" aria-label={locale === "es" ? "Renders" : "Renders"}>
        <RenderCarousel images={project.gallery} locale={locale} label={t(project.name, locale)} />
      </section>
      {project.sections.map((s, i) => (
        <section key={s.title.en} className={`panel container-x section-y ${i % 2 === 0 ? "panel-travertine" : "panel-bone"}`} aria-labelledby={`sec-${i}`}>
          <div className={`grid gap-8 lg:grid-cols-12 lg:items-center ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}>
            {s.image && (
              <div className="lg:col-span-6">
                <Picture image={s.image} locale={locale} ratio="16/10" rounded="lg" sizes="(max-width: 1024px) 92vw, 46vw" />
              </div>
            )}
            <div className={s.image ? "lg:col-span-6" : "lg:col-span-8"}>
              <div data-reveal><Headline id={`sec-${i}`} text={t(s.title, locale)} size="m" /></div>
              {tp(s.body, locale).map((p, j) => (
                <p key={j} className="body mt-4 text-charcoal-soft" data-reveal style={{ "--reveal-delay": `${(j + 1) * 80}ms` } as React.CSSProperties}>{p}</p>
              ))}
            </div>
          </div>
        </section>
      ))}
      {project.lat && project.lng && (
        <section className="panel panel-travertine container-x section-y" aria-label={tn("place")}>
          <p className="label mb-3">{t(project.location, locale)}</p>
          <MapLoader lat={project.lat} lng={project.lng} ratio="16/9" />
        </section>
      )}
    </div>
  );
}
