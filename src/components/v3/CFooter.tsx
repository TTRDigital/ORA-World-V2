import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/layout/Logo";
import type { L, Locale, SiteSettings } from "@/content/types";
import { t } from "@/lib/localize";
import { cip } from "@/content/seed/homeCip";

/** Version C footer: Deep Earth, four columns (address, explore, versions, the number), then the notice. */
export function CFooter({ locale, settings }: { locale: Locale; settings: SiteSettings }) {
  const es = locale === "es";
  const x = (l: L) => t(l, locale);
  const head = "text-[11px] font-semibold tracking-[0.3em] text-brass-light uppercase";
  const link = "inline-flex min-h-9 items-center text-[14.5px] text-bone/85 hover:text-white hover:underline";
  return (
    <footer className="bg-basalt px-5 pt-20 pb-10 text-bone md:px-10">
      <div className="mx-auto grid max-w-[1200px] gap-12 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <Logo variant="white" height={110} responsive className="h-[96px] w-auto" />
          <p className="mt-6 text-[14.5px] leading-relaxed text-bone/85">{x(cip.location.address)}</p>
          <a href={`https://www.google.com/maps/search/?api=1&query=${settings.siteLat},${settings.siteLng}`} target="_blank" rel="noopener noreferrer" className={`${link} underline`}>
            {es ? "Ver en Google Maps" : "View on Google Maps"}
          </a>
        </div>
        <div>
          <p className={head}>{es ? "Explorar" : "Explore"}</p>
          <ul className="mt-5">
            {[
              ["/c/floor-plans", es ? "Residencias" : "Residences"],
              ["/c/longevity", es ? "Longevidad" : "Longevity"],
              ["/c/act-60", es ? "Ley 60" : "Act 60"],
              ["/c/finishes", es ? "Acabados" : "Finishes"],
            ].map(([h, l]) => (
              <li key={h}>
                <Link href={h} className={link}>
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className={head}>{es ? "Visítenos" : "Visit"}</p>
          <ul className="mt-5">
            <li>
              <Link href="/c#inquire" className={link}>
                {es ? "Agende una presentación" : "Schedule a presentation"}
              </Link>
            </li>
            {settings.phone && (
              <li>
                <a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`} className={link}>
                  {settings.phone}
                </a>
              </li>
            )}
          </ul>
        </div>
        <div>
          <p className={head}>{es ? "Versiones" : "Versions"}</p>
          <ul className="mt-5">
            <li>
              <Link href="/" data-keep="" className={link}>
                {es ? "Versión A" : "Version A"}
              </Link>
            </li>
            <li>
              <Link href="/b" data-keep="" className={link}>
                {es ? "Versión B" : "Version B"}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-16 max-w-[1200px] border-t border-bone/15 pt-6 text-[12.5px] leading-relaxed text-bone/65">
        {es
          ? "Las imágenes son representaciones conceptuales del artista. La información está sujeta a cambios; consulte el Plan de Oferta. © 2026 ORA World Puerto Rico."
          : "Images are artist's conceptual renderings. Information is subject to change; see the Offering Plan. © 2026 ORA World Puerto Rico."}
      </p>
    </footer>
  );
}
