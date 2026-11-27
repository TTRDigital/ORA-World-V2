import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/content/types";
import { CFinishes } from "@/components/v3/pages/CFinishes";
import { redirect } from "next/navigation";
import { SHOW_FINISHES } from "@/lib/features";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "es" ? "Acabados · Versión C" : "Finishes · Version C",
    robots: { index: false, follow: false },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  // Client, 27 Nov: Finishes hidden for now (src/lib/features.ts); the page sends visitors to the homepage.
  if (!SHOW_FINISHES) redirect(`/${locale}/c`);
  return <CFinishes locale={locale} />;
}
