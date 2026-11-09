import { getTranslations } from "next-intl/server";
import type { ImageRef, Locale } from "@/content/types";
import { t } from "@/lib/localize";
import { amenityGroups, amenityExtras } from "@/content/seed/sales";
import { tdm } from "@/content/seed/images";
import { Link } from "@/i18n/navigation";
import { Module } from "@/components/ui/Module";
import { Picture } from "@/components/ui/Picture";
import { ArrowRight } from "@/components/ui/Icons";

const IMAGES: Record<(typeof amenityGroups)[number]["image"], ImageRef> = {
  gym: tdm.gym,
  golf: tdm.exteriorGolf,
  coast: tdm.aerialCoast,
  lounge: tdm.foyerLounge,
  study: tdm.aptStudy,
  entrance: tdm.entrance,
};

/** Amenities (replaces the 24-tile living bento on the homepage): six clean cards and one short list, all from the brochure. */
export async function HomeAmenities({ locale }: { locale: Locale }) {
  const tx = await getTranslations({ locale, namespace: "homeAmenities" });
  return (
    <Module id="amenities" tone="bone" label={tx("label")} headline={tx("headline")} intro={tx("intro")}>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {amenityGroups.map((g, i) => (
          <li key={g.key} className="overflow-hidden rounded-[20px] bg-white ring-1 ring-travertine-deep/60" data-reveal style={{ "--reveal-delay": `${(i % 3) * 70}ms` } as React.CSSProperties}>
            <Picture image={IMAGES[g.image]} locale={locale} ratio="16/10" rounded="none" sizes="(max-width: 639px) calc(100vw - 32px), (max-width: 1023px) 46vw, 390px" />
            <div className="p-5 md:p-6">
              <h3 className="display-s">{t(g.title, locale)}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-charcoal-soft">{t(g.text, locale)}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-10 border-t border-travertine-deep pt-8 text-center">
        <p className="label">{tx("also")}</p>
        <ul className="mx-auto mt-4 flex max-w-[900px] flex-wrap justify-center gap-2">
          {amenityExtras.map((x, i) => (
            <li key={i} className="rounded-full bg-bone-deep px-4 py-2 text-[14px]">{t(x, locale)}</li>
          ))}
        </ul>
        <Link href="/living" className="mt-8 inline-flex items-center gap-2 text-[15px] font-semibold text-brass-ink hover:text-charcoal">
          {tx("more")} <ArrowRight width={16} height={16} />
        </Link>
      </div>
    </Module>
  );
}
