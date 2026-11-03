import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/content/types";
import { Hero } from "@/components/home/Hero";
import { Numbers } from "@/components/home/Numbers";
import { VisitCta } from "@/components/home/VisitCta";

export default async function DevA({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="flex flex-col gap-3">
      <Hero locale={locale} />
      <Numbers locale={locale} />
      <VisitCta locale={locale} />
    </div>
  );
}
