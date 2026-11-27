import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/content/types";
import { pageMetadata } from "@/lib/seo";
import { CHome } from "@/components/v3/CHome";

/** Version D (client, 20 Nov: "a version like Version C, but with the films we have instead of the images"). */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = pageMetadata({
    locale,
    path: "/d",
    title: locale === "es" ? "Tesoro del Mar · Versión D" : "Tesoro del Mar · Version D",
    description:
      locale === "es"
        ? "ORA World en Dorado, Puerto Rico: una vida para atesorar."
        : "ORA World in Dorado, Puerto Rico: a life to treasure.",
  });
  return { ...meta, robots: { index: false, follow: false } };
}

export default async function VersionD({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CHome locale={locale} films />;
}
