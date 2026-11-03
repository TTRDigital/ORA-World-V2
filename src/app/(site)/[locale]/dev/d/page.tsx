import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/content/types";
import { Invest } from "@/components/home/Invest";
import { Portfolio } from "@/components/home/Portfolio";
import { HomeFaq } from "@/components/home/HomeFaq";

/** Dev harness for modules 9–11 (removed before launch). */
export default async function DevD({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="flex flex-col gap-3">
      <Invest locale={locale} />
      <Portfolio locale={locale} />
      <HomeFaq locale={locale} />
    </div>
  );
}
