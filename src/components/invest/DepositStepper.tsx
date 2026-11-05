import { useTranslations } from "next-intl";
import type { InvestmentStep, Locale } from "@/content/types";
import { t as tl } from "@/lib/localize";
import { Tbc } from "@/components/ui/Tbc";
import { Lock } from "@/components/ui/Icons";

/**
 * Deposit steps with the offering-plan notice on top. Placeholder steps render normally; their percent
 * reads "To be confirmed". The brass connector line draws top-to-bottom when the list reveals.
 */
export function DepositStepper({ steps, locale }: { steps: InvestmentStep[]; locale: Locale }) {
  const t = useTranslations("invest");
  const sorted = [...steps].sort((a, b) => a.order - b.order);
  return (
    <div>
      <p className="label mb-3">{t("depositTitle")}</p>
      <div className="flex items-start gap-3 rounded-2xl bg-bone-deep px-4 py-3" data-reveal>
        <Lock className="mt-0.5 shrink-0 text-brass-ink" />
        <p className="small text-charcoal-soft">{t("depositNote")}</p>
      </div>
      <ol className="group relative mt-6 pl-14" data-reveal data-testid="deposit-steps">
        <div
          aria-hidden
          className="absolute top-5 bottom-5 left-[19px] w-px origin-top scale-y-0 bg-brass transition-transform duration-[1600ms] [transition-timing-function:var(--ease-out)] group-[.is-revealed]:scale-y-100"
        />
        {sorted.map((s, i) => (
          <li key={s.order} className="relative pb-7 last:pb-0">
            <span
              className="numeral absolute top-0 -left-14 flex size-10 items-center justify-center rounded-full bg-bone text-[15px] text-brass-ink shadow-[inset_0_0_0_1px_var(--color-travertine-deep)]"
              aria-hidden
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="display-s">
                <span className="visually-hidden">{`${i + 1}. `}</span>
                {tl(s.title, locale)}
              </h3>
              {(s.placeholder || s.percent != null) && (
                <span className="tabular text-[15px] font-semibold text-brass-ink">{s.percent == null ? <Tbc /> : `${s.percent}%`}</span>
              )}
            </div>
            <p className="body mt-1 text-[15px] text-charcoal-soft">{tl(s.detail, locale)}</p>
            <p className="label mt-2">{tl(s.when, locale)}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
