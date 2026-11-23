import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/layout/Logo";
import type { L, Locale, SiteSettings } from "@/content/types";
import { t } from "@/lib/localize";
import { cip } from "@/content/seed/homeCip";

/** Version E footer (in the manner of ciprianiresidencesmiami.com): sand, the logo centred, three columns between hairlines, a faint tree. */
export function EFooter({ locale, settings }: { locale: Locale; settings: SiteSettings }) {
  const es = locale === "es";
  const x = (l: L) => t(l, locale);
  const link = "inline-flex min-h-9 items-center underline-offset-4 hover:underline";
  return (
    <footer className="relative isolate overflow-hidden bg-bone-deep px-5 pt-16 pb-10 text-basalt md:px-10">
      {/* eslint-disable-next-line @next/next/no-img-element -- decorative tree watermark */}
      <img src="/brand/ora-world-tree.png" alt="" aria-hidden width={420} height={420} className="pointer-events-none absolute -bottom-24 -left-20 -z-10 w-[360px] opacity-[0.07] md:w-[460px]" />
      <div className="mx-auto max-w-[1200px]">
        <Logo variant="header" height={110} responsive className="mx-auto h-[86px] w-auto" />
        <div className="mt-12 grid gap-8 text-center text-[13.5px] leading-relaxed md:grid-cols-3 md:gap-0">
          <p className="md:px-8">{es ? "Presentaciones privadas con cita previa, en persona o por videollamada." : "Private presentations by appointment, in person or by video call."}</p>
          <p className="md:border-x md:border-basalt/40 md:px-8">{x(cip.location.address)}</p>
          <p className="md:px-8">
            {settings.phone && (
              <a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`} className={link}>
                {settings.phone}
              </a>
            )}
          </p>
        </div>
        <ul className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-1 text-[12.5px]">
          {[
            ["/e/floor-plans", es ? "Residencias" : "Residences"],
            ["/e/longevity", es ? "Longevidad" : "Longevity"],
            ["/e/act-60", es ? "Ley 60" : "Act 60"],
            ["/e/finishes", es ? "Acabados" : "Finishes"],
            ["/e#inquire", es ? "Agende una presentación privada" : "Schedule a private preview"],
          ].map(([h, l]) => (
            <li key={h}>
              <Link href={h} className={`${link} underline`}>
                {l}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-center text-[12px] text-charcoal-soft">
          {(["/", "/b", "/c", "/d"] as const).map((h, k) => (
            <span key={h}>
              {k > 0 && " · "}
              <Link href={h} data-keep="" className="hover:underline">
                {es ? "Versión" : "Version"} {"ABCD"[k]}
              </Link>
            </span>
          ))}
        </p>
        <p className="mx-auto mt-8 max-w-[90ch] text-center text-[11.5px] leading-relaxed text-charcoal-soft">
          {es
            ? "Las imágenes son representaciones conceptuales del artista. La información está sujeta a cambios; consulte el Plan de Oferta. © 2026 ORA World Puerto Rico."
            : "Images are artist's conceptual renderings. Information is subject to change; see the Offering Plan. © 2026 ORA World Puerto Rico."}
        </p>
      </div>
    </footer>
  );
}
