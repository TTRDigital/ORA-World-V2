import type { Locale } from "@/content/types";
import { getHome, getIncentives, getInvestmentSteps } from "@/lib/content";
import { t, tp } from "@/lib/localize";
import { Module } from "@/components/ui/Module";
import { Orientation } from "@/components/invest/Orientation";
import { DepositStepper } from "@/components/invest/DepositStepper";

/** Module 9: Invest with clarity. The Act 60 orientation beside the deposit stepper and the tax disclaimer. */
export async function Invest({ locale }: { locale: Locale }) {
  const [home, incentives, steps] = await Promise.all([getHome(), getIncentives(), getInvestmentSteps()]);
  const m = home.invest;
  if (!m.enabled) return null;
  const sections = incentives.map((s) => ({
    slug: s.slug,
    title: t(s.title, locale),
    summary: t(s.summary, locale),
    body: tp(s.body, locale),
    tags: s.tags as string[],
  }));
  return (
    <Module id="invest" tone="bone" label={t(m.label, locale)} headline={t(m.headline, locale)} intro={t(m.intro, locale)}>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7" data-reveal>
          <Orientation sections={sections} />
        </div>
        <div className="lg:col-span-5">
          <DepositStepper steps={steps} locale={locale} />
        </div>
      </div>
      <p className="legal mt-10 max-w-4xl text-charcoal-soft" data-reveal>
        {t(m.disclaimer, locale)}
      </p>
    </Module>
  );
}
