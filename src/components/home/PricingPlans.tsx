import { getTranslations } from "next-intl/server";
import type { Locale } from "@/content/types";
import { getSiteSettings } from "@/lib/content";
import { t } from "@/lib/localize";
import { pricing, ownerHighlights } from "@/content/seed/sales";
import { Module } from "@/components/ui/Module";
import { Check, ArrowRight } from "@/components/ui/Icons";

const usd = (n: number, locale: Locale) => new Intl.NumberFormat(locale === "es" ? "es-PR" : "en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

/**
 * Phase 1 pricing and documents, from the sales team's prospect email: average price per sq ft with the lower- and
 * higher-floor figures, what every residence includes, and the floor plans, presentation and booking link.
 */
export async function PricingPlans({ locale }: { locale: Locale }) {
  const [settings, tx] = await Promise.all([getSiteSettings(), getTranslations({ locale, namespace: "pricing" })]);
  const tiers = [
    { label: tx("lower"), value: pricing.lowerPerSqFt },
    { label: tx("average"), value: pricing.averagePerSqFt, featured: true },
    { label: tx("higher"), value: pricing.higherPerSqFt },
  ];
  return (
    <Module id="pricing" tone="bone" label={t(pricing.phase, locale)} headline={tx("headline")} intro={tx("intro")}>
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <ul className="grid grid-cols-3 gap-2 sm:gap-3" aria-label={tx("tiers")}>
            {tiers.map((tier) => (
              <li
                key={tier.label}
                className={tier.featured ? "rounded-[18px] bg-basalt px-3 py-4 text-bone sm:p-5 md:p-6" : "rounded-[18px] bg-bone px-3 py-4 ring-1 ring-travertine-deep sm:p-5 md:p-6"}
                data-reveal
              >
                <p className={tier.featured ? "text-[13px] font-semibold text-brass-light sm:text-[14px]" : "text-[13px] font-semibold text-brass-ink sm:text-[14px]"}>{tier.label}</p>
                <p className="numeral mt-2 text-[21px] sm:mt-3 sm:text-[30px] md:text-[34px]">{usd(tier.value, locale)}</p>
                <p className={tier.featured ? "mt-1 text-[12px] text-bone/80 sm:text-[14px]" : "mt-1 text-[12px] text-charcoal-soft sm:text-[14px]"}>{tx("perSqFt")}</p>
              </li>
            ))}
          </ul>
          <p className="small mt-4 text-charcoal-soft">{t(pricing.note, locale)}</p>
        </div>
        <div className="lg:col-span-5">
          <p className="label">{tx("included")}</p>
          <ul className="mt-3 space-y-3">
            {ownerHighlights.map((h, i) => (
              <li key={i} className="flex items-start gap-3 text-[16px]">
                <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-brass text-basalt">
                  <Check width={13} height={13} strokeWidth={2.5} />
                </span>
                {t(h, locale)}
              </li>
            ))}
          </ul>
          <div className="mt-7 flex flex-wrap gap-3">
            {settings.floorPlansUrl && (
              <a href={settings.floorPlansUrl} target="_blank" rel="noopener" className="pill pill-basalt min-h-12 px-5" data-track="floor_plans_pdf">
                {tx("plans")} <ArrowRight width={16} height={16} />
              </a>
            )}
            {settings.brochureUrl && (
              <a href={settings.brochureUrl} target="_blank" rel="noopener" className="pill pill-ghost min-h-12 px-5" data-track="presentation_pdf">
                {tx("presentation")}
              </a>
            )}
          </div>
          <p className="small mt-3 text-charcoal-soft">{t(pricing.plansNote, locale)} {tx("pdfNote")}</p>
          {settings.bookingUrl && (
            <a href={settings.bookingUrl} target="_blank" rel="noopener" className="mt-5 inline-flex items-center gap-2 text-[15px] font-semibold text-brass-ink hover:text-charcoal" data-track="book_call_reza">
              {tx("book")} <ArrowRight width={16} height={16} />
            </a>
          )}
        </div>
      </div>
    </Module>
  );
}
