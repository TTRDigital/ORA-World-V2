import type { Locale } from "@/content/types";
import { Hero } from "./Hero";
import { HomeTour } from "./HomeTour";
import { Numbers } from "./Numbers";
import { PricingPlans } from "./PricingPlans";
import { PrivateCharters } from "./PrivateCharters";
import { Explorer } from "./Explorer";
import { RoomTour } from "./RoomTour";
import { ResilienceDial } from "./ResilienceDial";
import { RenderGallery } from "./RenderGallery";
import { LivingBento } from "./LivingBento";
import { Invest } from "./Invest";
import { HomeFaq } from "./HomeFaq";
import { VisitCta } from "./VisitCta";

/**
 * The homepage: thirteen modular, interactive panels in the brief's order (the footer is the thirteenth).
 * Each module reads its own content, hides itself when disabled or still a placeholder, and no two share a layout.
 */
export function HomePage({ locale }: { locale: Locale }) {
  return (
    <div className="flex flex-col gap-3">
      <Hero locale={locale} />
      <HomeTour locale={locale} />
      <Numbers locale={locale} />
      <PricingPlans locale={locale} />
      <PrivateCharters locale={locale} />
      <Explorer locale={locale} />
      <RoomTour locale={locale} />
      <ResilienceDial locale={locale} />
      <RenderGallery locale={locale} />
      <LivingBento locale={locale} />
      <Invest locale={locale} />
      <HomeFaq locale={locale} />
      <VisitCta locale={locale} />
    </div>
  );
}
