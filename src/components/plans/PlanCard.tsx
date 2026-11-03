import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { FloorPlan, Locale } from "@/content/types";
import { t } from "@/lib/localize";
import { Tbc } from "@/components/ui/Tbc";
import { ShortlistButton } from "./ShortlistButton";
import { cn } from "@/lib/utils";

export function PlanCard({ plan, locale, view = "grid", index = 0 }: { plan: FloorPlan; locale: Locale; view?: "grid" | "list"; index?: number }) {
  const tp = useTranslations("plans");
  const tc = useTranslations("common");
  return (
    <li className={cn("card lift overflow-hidden", view === "list" && "sm:grid sm:grid-cols-[200px_1fr] sm:items-center")} data-reveal style={{ "--reveal-delay": `${(index % 6) * 50}ms` } as React.CSSProperties} data-testid="plan-card">
      <Link href={`/residences/plans/${plan.slug}`} className="frame block bg-bone" style={{ aspectRatio: view === "list" ? "4/3" : "4/3" }} aria-label={t(plan.name, locale)}>
        <Image src={plan.image.src} alt={plan.image.alt[locale]} fill sizes={view === "list" ? "200px" : "(max-width: 640px) 92vw, (max-width: 1024px) 44vw, 22vw"} quality={80} unoptimized={plan.image.src.endsWith(".svg")} className="object-contain p-2" />
        {plan.placeholder && <span className="absolute top-3 left-3 rounded-full bg-bone-deep px-2 py-1 text-[11px] font-semibold text-brass-ink">{tc("illustrative")}</span>}
      </Link>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="display-s"><Link href={`/residences/plans/${plan.slug}`}>{t(plan.name, locale)}</Link></h3>
            <p className="small text-charcoal-soft">{plan.building} · {t(plan.view, locale)} · {plan.orientation}</p>
          </div>
          <ShortlistButton slug={plan.slug} compact />
        </div>
        <dl className="tabular mt-3 grid grid-cols-3 gap-2 text-[14px]">
          <div><dt className="text-charcoal-soft">{tp("bedrooms")}</dt><dd className="font-semibold">{plan.bedrooms}</dd></div>
          <div><dt className="text-charcoal-soft">{tp("bath")}</dt><dd className="font-semibold">{plan.bathrooms}</dd></div>
          <div><dt className="text-charcoal-soft">{tp("interior")}</dt><dd className="font-semibold">{plan.interiorSqFt ? `${plan.interiorSqFt.toLocaleString()} sq ft` : <Tbc />}</dd></div>
        </dl>
        <span className={cn("mt-3 inline-block rounded-full px-2 py-0.5 text-[12px] font-semibold", plan.status === "available" ? "bg-palm-light/40 text-palm" : "bg-travertine text-charcoal-soft")}>{tp(`status.${plan.status}`)}</span>
      </div>
    </li>
  );
}
