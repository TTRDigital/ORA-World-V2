import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/content/types";
import { LivingBento } from "@/components/home/LivingBento";
import { Island } from "@/components/home/Island";
import { CompareProjects } from "@/components/home/CompareProjects";

/** Dev harness for modules 6–8. Removed by the integrator. */
export default async function DevC({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="flex flex-col gap-3">
      <LivingBento locale={locale} />
      <Island locale={locale} />
      <CompareProjects locale={locale} />
    </div>
  );
}
