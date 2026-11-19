import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/layout/Logo";
import type { L, Locale, SiteSettings } from "@/content/types";
import { t } from "@/lib/localize";
import { cip } from "@/content/seed/homeCip";

/** Version C footer: centred and quiet, on Deep Earth: the logo, the address and number, the pages, the notice. */
export function CFooter({ locale, settings }: { locale: Locale; settings: SiteSettings }) {
  const es = locale === "es";
  const x = (l: L) => t(l, locale);
  const links: [string, string][] = [
    ["/c/longevity", es ? "Longevidad" : "Longevity"],
    ["/c/act-60", es ? "Ley 60" : "Act 60"],
    ["/c/floor-plans", es ? "Residencias" : "Residences"],
    ["/c/finishes", es ? "Acabados" : "Finishes"],
    ["/c#inquire", es ? "Consultar" : "Inquire"],
  ];
  return (
    <footer className="bg-basalt px-5 py-20 text-center text-bone md:px-10">
      <Logo variant="white" height={120} responsive className="mx-auto h-[110px] w-auto" />
      <p className="mt-8 text-[17px] leading-relaxed text-bone/85">{x(cip.location.address)}</p>
      {settings.phone && (
        <a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`} className="mt-2 inline-block text-[20px] font-semibold hover:underline">
          {settings.phone}
        </a>
      )}
      <ul className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-2">
        {links.map(([href, label]) => (
          <li key={href}>
            <Link href={href} className="inline-flex min-h-11 items-center text-[14px] font-semibold tracking-[0.16em] uppercase hover:underline">
              {label}
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-[13px] text-bone/65">
        <Link href="/" data-keep="" className="hover:underline">
          {es ? "Versión A" : "Version A"}
        </Link>
        {" · "}
        <Link href="/b" data-keep="" className="hover:underline">
          {es ? "Versión B" : "Version B"}
        </Link>
      </p>
      <p className="mx-auto mt-12 max-w-[80ch] border-t border-bone/15 pt-6 text-[13px] leading-relaxed text-bone/65">
        {es
          ? "Las imágenes son representaciones conceptuales del artista. La información está sujeta a cambios; consulte el Plan de Oferta. © 2026 ORA World Puerto Rico."
          : "Images are artist's conceptual renderings. Information is subject to change; see the Offering Plan. © 2026 ORA World Puerto Rico."}
      </p>
    </footer>
  );
}
