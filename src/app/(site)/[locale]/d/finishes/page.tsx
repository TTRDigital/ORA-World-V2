import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/content/types";
import { CFinishes } from "@/components/v3/pages/CFinishes";
import { redirect } from "next/navigation";
import { SHOW_FINISHES } from "@/lib/features";

/** Version D · Finishes: Version C's page with films. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "es" ? "Acabados · Versión D" : "Finishes · Version D",
    robots: { index: false, follow: false },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  // Client, 27 Nov: Finishes hidden for now (src/lib/features.ts); the page sends visitors to the homepage.
  if (!SHOW_FINISHES) redirect(`/${locale}/d`);
  return <CFinishes locale={locale} films />;
}
