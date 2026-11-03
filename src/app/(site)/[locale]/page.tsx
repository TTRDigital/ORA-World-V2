import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { pageMetadata, JsonLd, organizationLd } from "@/lib/seo";
import type { Locale } from "@/content/types";
import { HomePage } from "@/components/home/HomePage";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({ locale, path: "/", title: t("home.title"), description: t("home.description") });
}

export default async function Home({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <JsonLd data={organizationLd(locale)} />
      <HomePage locale={locale} />
    </>
  );
}
