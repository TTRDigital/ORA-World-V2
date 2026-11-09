import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getPress } from "@/lib/content";
import { t, tp } from "@/lib/localize";
import type { Locale } from "@/content/types";
import { PageHero } from "@/components/ui/PageHero";

export default async function PressArticle({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const article = (await getPress()).find((a) => a.slug === slug);
  if (!article) notFound();
  return (
    <div className="flex flex-col">
      <PageHero locale={locale} label={`${article.outlet} · ${article.date}`} headline={t(article.title, locale)} intro={t(article.excerpt, locale)} image={article.image ?? undefined} />
      <section className="panel panel-travertine container-x section-y">
        <div className="card mx-auto max-w-3xl p-6 md:p-10">
          {tp(article.body, locale).map((p, i) => (
            <p key={i} className="body mb-4 text-charcoal-soft">{p}</p>
          ))}
          {article.url && (
            <a href={article.url} target="_blank" rel="noopener" className="pill pill-basalt mt-4">{article.outlet}</a>
          )}
        </div>
      </section>
    </div>
  );
}
