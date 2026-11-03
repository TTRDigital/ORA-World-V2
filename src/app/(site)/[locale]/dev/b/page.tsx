import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/content/types";
import { Explorer } from "@/components/home/Explorer";
import { RoomTour } from "@/components/home/RoomTour";
import { ResilienceDial } from "@/components/home/ResilienceDial";

export default async function DevB({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="flex flex-col gap-3">
      <Explorer locale={locale} />
      <RoomTour locale={locale} />
      <ResilienceDial locale={locale} />
    </div>
  );
}
