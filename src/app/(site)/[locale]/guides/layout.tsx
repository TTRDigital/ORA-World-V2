import type { Locale } from "@/content/types";
import { getSiteSettings } from "@/lib/content";
import { V2Header } from "@/components/v2/V2Header";
import { V2Footer } from "@/components/v2/V2Footer";
import { LinkRewriter } from "@/components/v2/LinkRewriter";

/**
 * Buyer guides (TTR-2508): framed like Version B (the version the client reviews), with its header, footer and links,
 * at clean /guides/<slug> addresses.
 */
export default async function GuidesLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale: l } = await params;
  const locale = (l === "es" ? "es" : "en") as Locale;
  const es = locale === "es";
  const settings = await getSiteSettings();
  const links = [
    { href: "/b#about", label: es ? "Nosotros" : "About" },
    { href: "/b/living", label: es ? "Vivir" : "Living" },
    { href: "/b/floor-plans", label: es ? "Planos" : "Floor plans" },
    { href: "/b/finishes", label: es ? "Acabados" : "Finishes" },
    { href: "/guides/oceanfront-condos-dorado-puerto-rico", label: es ? "Guías" : "Guides" },
    { href: "/b#location", label: es ? "Ubicación" : "Location" },
  ];
  return (
    <div data-version-b id="top" className="bg-[var(--v2-cream)] text-[var(--v2-green)]">
      <V2Header links={links} inquire={es ? "Consultar" : "Inquire"} otherLocale={es ? "en" : "es"} otherLabel={es ? "English" : "Español"} />
      {children}
      <V2Footer locale={locale} settings={settings} />
      <LinkRewriter />
    </div>
  );
}
