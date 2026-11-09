import { getTranslations } from "next-intl/server";
import type { Locale } from "@/content/types";
import { t } from "@/lib/localize";
import { charters } from "@/content/seed/sales";
import { life } from "@/content/seed/images";
import { Link } from "@/i18n/navigation";
import { Picture } from "@/components/ui/Picture";
import { ArrowRight } from "@/components/ui/Icons";

/** Private charters, its own section (client request): image left, the promise and three points right. */
export async function PrivateCharters({ locale }: { locale: Locale }) {
  const tx = await getTranslations({ locale, namespace: "charters" });
  return (
    <section id="charters" aria-labelledby="charters-title" data-tone="dark" className="panel panel-basalt on-dark container-x section-y">
      <div className="mx-auto grid max-w-[1200px] items-center gap-8 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <Picture image={life.jet} locale={locale} ratio="4/5" sizes="(max-width: 1023px) calc(100vw - 56px), 520px" />
        </div>
        <div className="lg:col-span-7">
          <p className="label mb-3" data-reveal>{tx("label")}</p>
          <h2 id="charters-title" className="display-l text-bone" data-reveal>{tx("headline")}</h2>
          <p className="lead mt-5 text-bone/85" data-reveal>{t(charters.body, locale)}</p>
          <ul className="mt-8 divide-y divide-bone/15 border-y border-bone/15">
            {charters.points.map((p, i) => (
              <li key={i} className="flex items-baseline gap-4 py-4 text-[16px] text-bone/90" data-reveal>
                <span className="numeral text-[15px] text-brass-light">{String(i + 1).padStart(2, "0")}</span>
                {t(p, locale)}
              </li>
            ))}
          </ul>
          <Link href="/visit" className="pill pill-brass mt-8 min-h-12 px-6" data-track="charters_ask">
            {tx("cta")} <ArrowRight width={16} height={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
