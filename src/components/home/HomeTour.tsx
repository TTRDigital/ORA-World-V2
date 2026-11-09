import { getTranslations } from "next-intl/server";
import type { Locale } from "@/content/types";
import { getSiteSettings } from "@/lib/content";
import { Link } from "@/i18n/navigation";
import { Module } from "@/components/ui/Module";
import { tdm } from "@/content/seed/images";
import { ArrowRight } from "@/components/ui/Icons";
import { HomeTourStage } from "./HomeTourStage";

/** Virtual tour, high on the homepage (client feedback): the ORA World 360° collection right under the banner. */
export async function HomeTour({ locale }: { locale: Locale }) {
  const settings = await getSiteSettings();
  if (!settings.vrTourUrl) return null;
  const t = await getTranslations({ locale, namespace: "homeTour" });
  return (
    <Module id="virtual-tour" tone="basalt" label={t("label")} headline={t("headline")} intro={t("intro")}>
      <HomeTourStage vrUrl={settings.vrTourUrl} filmId={settings.introFilmYoutubeId} poster={tdm.penthouseDining} filmPoster={tdm.aerialCoast} locale={locale} />
      <Link href="/place/tour" className="mt-5 inline-flex items-center gap-2 text-[15px] font-semibold text-brass-light hover:text-bone">
        {t("more")} <ArrowRight width={16} height={16} />
      </Link>
    </Module>
  );
}
