import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/layout/Logo";
import type { L, Locale, SiteSettings } from "@/content/types";
import { t } from "@/lib/localize";
import { cip } from "@/content/seed/homeCip";
import { SHOW_FINISHES } from "@/lib/features";

/** Version B footer: Deep Earth, the white logo, visit details and the Version B pages (plus a way back to Version A). */
export function V2Footer({ locale, settings }: { locale: Locale; settings: SiteSettings }) {
  const es = locale === "es";
  const x = (l: L) => t(l, locale);
  return (
    <footer className="bg-basalt px-5 py-16 text-[var(--v2-cream)] md:px-10">
      <div className="mx-auto grid max-w-[1440px] gap-12 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <Logo variant="white" height={110} className="h-[100px] w-auto" />
          <p className="mt-6 text-[11px] tracking-[0.3em] uppercase opacity-70">
            {es ? "Más allá de lo esperado" : "Beyond expectations"}
          </p>
        </div>
        <div>
          <p className="text-[11px] tracking-[0.28em] text-brass-light uppercase">
            {es ? "Visite y consulte" : "Visit & inquire"}
          </p>
          <p className="mt-4 text-[14px] leading-relaxed opacity-80">{x(cip.location.address)}</p>
          {settings.phone && <p className="mt-2 text-[14px] opacity-80">{settings.phone}</p>}
        </div>
        <div>
          <p className="text-[11px] tracking-[0.28em] text-brass-light uppercase">
            {es ? "Explorar" : "Explore"}
          </p>
          <ul className="mt-4 grid gap-2 text-[14px] opacity-85">
            {[
              ["/b/living", es ? "Vivir" : "Living"],
              ["/b/longevity", es ? "Longevidad" : "Longevity"],
              ["/b/floor-plans", es ? "Planos" : "Floor plans"],
              ...(SHOW_FINISHES ? [["/b/finishes", es ? "Acabados" : "Finishes"]] : []),
              ["/b/act-60", es ? "Ley 60" : "Act 60"],
              ["/", es ? "Versión A del sitio" : "Version A of the site"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link
                  href={href}
                  data-keep={href === "/" ? "" : undefined}
                  className="hover:underline hover:opacity-100"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-14 max-w-[1440px] border-t border-[var(--v2-cream)]/15 pt-6 text-[11.5px] leading-relaxed opacity-55">
        {es
          ? "Las imágenes son representaciones conceptuales del artista. La información está sujeta a cambios; consulte el Plan de Oferta. © 2026 ORA World Puerto Rico."
          : "Images are artist's conceptual renderings. Information is subject to change; see the Offering Plan. © 2026 ORA World Puerto Rico."}
      </p>
    </footer>
  );
}
