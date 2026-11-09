import { useTranslations } from "next-intl";
import type { InvestmentStep, Locale } from "@/content/types";
import { t as tl } from "@/lib/localize";
import { Tbc } from "@/components/ui/Tbc";
import { Lock } from "@/components/ui/Icons";

/**
 * Deposit steps as a compact timeline with the offering-plan notice on top. The first step (register) is the only
 * one available now and is highlighted; placeholder steps state their unknown deposit once. The brass connector
 * line draws top-to-bottom when the list reveals.
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
      {/* Compact timeline: "To be confirmed" is said once per step, not three times. */}
      <ol className="group relative mt-5 pl-12" data-reveal data-testid="deposit-steps">
        <div
          aria-hidden
          className="absolute top-4 bottom-4 left-[15px] w-px origin-top scale-y-0 bg-brass transition-transform duration-[1600ms] [transition-timing-function:var(--ease-out)] group-[.is-revealed]:scale-y-100"
        />
        {sorted.map((s, i) => {
          const first = i === 0;
          return (
            <li key={s.order} className="relative pb-4 last:pb-0">
              <span
                className={
                  "numeral absolute top-0.5 -left-12 flex size-8 items-center justify-center rounded-full text-[13px] " +
                  (first ? "bg-brass text-basalt" : "bg-bone text-brass-ink shadow-[inset_0_0_0_1px_var(--color-travertine-deep)]")
                }
                aria-hidden
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className={first ? "card p-4" : "rounded-2xl px-1 py-1"}>
                <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                  <h3 className="font-display text-[19px] leading-tight md:text-[21px]">
                    <span className="visually-hidden">{`${i + 1}. `}</span>
                    {tl(s.title, locale)}
                  </h3>
                  <span className={"rounded-full px-2.5 py-1 text-[12px] font-semibold " + (first ? "bg-palm-light/40 text-palm" : "bg-bone-deep text-brass-ink")}>
                    {tl(s.when, locale)}
                  </span>
                </div>
                {s.placeholder ? (
                  <p className="small mt-1 text-charcoal-soft">
                    {t("depositShare")}: {s.percent == null ? <Tbc /> : `${s.percent}%`}
                  </p>
                ) : (
                  <p className="small mt-1.5 text-charcoal-soft">{tl(s.detail, locale)}</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
