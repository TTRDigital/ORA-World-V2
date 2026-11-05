import { getTranslations } from "next-intl/server";
import type { Locale } from "@/content/types";
import { getHome, getPois } from "@/lib/content";
import { t as tr } from "@/lib/localize";
import { formatNumber, cn } from "@/lib/utils";
import { Module } from "@/components/ui/Module";
import { Picture } from "@/components/ui/Picture";
import "./numbers-bento.css";

const areas = ["nb-land", "nb-apts", "nb-suites", "nb-amen"] as const;

/**
 * Module 2, Tesoro Del Mar in numbers: a bento grid. Aerial render, four counters that animate once,
 * a beach card (walking distance to Balneario Cerro Gordo), an airport card with a drawn route line,
 * and a national-park card. Every figure is published on oraworld.com/tesoro-del-mar.
 */
export async function Numbers({ locale }: { locale: Locale }) {
  const [home, pois] = await Promise.all([getHome(), getPois()]);
  const n = home.numbers;
  if (!n.enabled) return null;
  const t = await getTranslations({ locale, namespace: "numbers" });
  const tc = await getTranslations({ locale, namespace: "common" });
  const airport = pois.find((p) => p.slug === "sju");
  const beach = pois.find((p) => p.slug === "cerro-gordo");
  const delay = (i: number) => ({ "--reveal-delay": `${i * 90}ms` }) as React.CSSProperties;

  return (
    <Module id="numbers" tone="travertine" label={tr(n.label, locale)} headline={tr(n.headline, locale)}>
      <div className="nb-grid">
        {/* (a) Aerial render */}
        <div
          className={cn("nb-aerial", "card lift ambient-zoom overflow-hidden")}
          data-reveal
          style={delay(0)}
        >
          <Picture
            image={n.aerial}
            locale={locale}
            ratio="16/10"
            sizes="(max-width: 767px) calc(100vw - 48px), (max-width: 1279px) 48vw, 640px"
            rounded="sm"
            className="h-full"
          />
        </div>

        {/* (b) Counters */}
        {n.stats.map((s, i) => (
          <div
            key={areas[i]}
            className={cn(areas[i], "card lift flex min-h-[132px] flex-col justify-between p-5")}
            data-reveal
            style={delay(1 + i)}
          >
            <span
              className="numeral text-[34px] text-brass-ink md:text-[40px] xl:text-[52px]"
              data-counter={s.value ?? undefined}
              data-prefix={s.prefix}
              data-suffix={s.suffix}
            >
              {s.value == null
                ? tc("tbc")
                : `${s.prefix ?? ""}${formatNumber(s.value, locale)}${s.suffix ?? ""}`}
            </span>
            <span className="mt-3 block text-[14px] leading-snug text-charcoal-soft">
              {tr(s.label, locale)}
            </span>
          </div>
        ))}

        {/* (c) Beach */}
        <div className={cn("nb-beach", "card lift relative overflow-hidden")} data-reveal style={delay(5)}>
          <div className="relative" style={{ aspectRatio: "16/7" }}>
            <Picture
              image={n.beach}
              locale={locale}
              fill
              ratio="16/7"
              sizes="(max-width: 767px) calc(100vw - 48px), (max-width: 1279px) 48vw, 640px"
              rounded="none"
              reveal={false}
              className="absolute inset-0 h-full rounded-none"
            />
            <div
              className="absolute inset-0 bg-gradient-to-r from-basalt/70 via-basalt/30 to-transparent"
              aria-hidden
            />
            <div className="absolute inset-0 flex items-end p-5 text-bone">
              <div className="flex items-end gap-4">
                <svg
                  className="nb-walker"
                  width="34"
                  height="40"
                  viewBox="0 0 34 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="19" cy="6" r="3.5" />
                  <path d="M17 12l-5 9 4 3-3 13M17 12l5 2 4 7M13 21l-7 5M21 26l5 11" />
                </svg>
                <div>
                  <p className="display-s text-bone">{t("walk")}</p>
                  <p className="text-[14px] text-bone/85">
                    {t("walkTo")}
                    {beach?.confirmed && (
                      <span className="ml-2 rounded-full bg-bone/15 px-2 py-0.5 text-[11px] font-semibold">
                        {tc("published")}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* (d) Airport with route line */}
        <div
          className={cn("nb-airport", "card lift relative flex flex-col justify-between overflow-hidden p-5")}
          data-reveal
          style={delay(6)}
        >
          <svg
            className="absolute inset-x-0 top-0 h-[70px] w-full"
            viewBox="0 0 220 70"
            fill="none"
            aria-hidden="true"
            preserveAspectRatio="none"
          >
            <circle cx="18" cy="52" r="4" fill="var(--color-brass)" />
            <path
              className="nb-route"
              d="M18 52 C 60 50, 110 22, 196 18"
              stroke="var(--color-brass)"
              strokeWidth="1.5"
              strokeLinecap="round"
              pathLength="320"
            />
            <g transform="translate(190 6)">
              <g className="nb-plane">
                <path d="M0 12 L22 4 L15 12 L22 20 Z" fill="var(--color-brass-ink)" />
              </g>
            </g>
          </svg>
          <span className="mt-[60px] flex items-baseline gap-2">
            <span
              className="numeral text-[34px] text-brass-ink md:text-[40px]"
              data-counter={airport?.driveMinutes ?? 30}
            >
              {formatNumber(airport?.driveMinutes ?? 30, locale)}
            </span>
          </span>
          <span className="mt-1 block text-[14px] leading-snug text-charcoal-soft">
            {t("airport")}
            <span className="block text-[12px] text-charcoal-soft">{t("airportNote")}</span>
          </span>
        </div>

        {/* (e) National park */}
        <div
          className={cn(
            "nb-park",
            "card lift relative flex flex-col justify-between overflow-hidden p-5 text-bone",
          )}
          style={{ ...delay(7), background: "var(--color-palm)" }}
          data-reveal
        >
          <svg
            className="absolute -top-2 -right-3 h-[88px] w-[88px] text-palm-light"
            viewBox="0 0 88 88"
            fill="currentColor"
            aria-hidden="true"
          >
            <path className="nb-leaf" d="M44 80c-2-30 8-50 36-60-4 28-16 46-36 60z" opacity=".9" />
            <path className="nb-leaf nb-leaf2" d="M40 82C26 60 24 38 36 12c14 22 14 46 4 70z" opacity=".55" />
            <path className="nb-leaf nb-leaf3" d="M48 78C30 68 14 54 8 30c22 6 36 22 40 48z" opacity=".4" />
          </svg>
          <span className="display-s relative text-bone">{t("park")}</span>
          <span className="relative mt-3 block text-[13px] leading-snug text-bone/80">{t("parkNote")}</span>
        </div>
      </div>
      <p className="small mt-4 text-charcoal-soft">{t("published")} · oraworld.com/tesoro-del-mar</p>
    </Module>
  );
}
