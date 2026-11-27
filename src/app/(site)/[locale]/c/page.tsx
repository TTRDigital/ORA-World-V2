import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/content/types";
import { pageMetadata } from "@/lib/seo";
import { CHome } from "@/components/v3/CHome";

/** Version C: the homepage in the manner of ciprianiresidences-brickell.com, photographs below the banner. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = pageMetadata({
    locale,
    path: "/c",
    title: locale === "es" ? "Tesoro del Mar · Versión C" : "Tesoro del Mar · Version C",
    description:
      locale === "es"
        ? "ORA World en Dorado, Puerto Rico: una vida para atesorar."
        : "ORA World in Dorado, Puerto Rico: a life to treasure.",
  });
  return { ...meta, robots: { index: false, follow: false } };
}

export default async function VersionC({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CHome locale={locale} />;
}
