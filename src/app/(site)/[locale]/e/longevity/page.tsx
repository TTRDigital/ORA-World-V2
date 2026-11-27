import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/content/types";
import { CLongevity } from "@/components/v3/pages/CLongevity";

/** Version E · Longevity: Version C's page inside the Version E frame (its /c links point to /e). */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "es" ? "Longevidad · Versión E" : "Longevity · Version E",
    robots: { index: false, follow: false },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CLongevity locale={locale} />;
}
