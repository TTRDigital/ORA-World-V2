import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/content/types";
import { CLiving } from "@/components/v3/pages/CLiving";

/** Version C · Living (client, 24 Nov: "don't have Location, say Living"). */
export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "es" ? "Vivir · Versión C" : "Living · Version C", robots: { index: false, follow: false } };
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CLiving locale={locale} />;
}
