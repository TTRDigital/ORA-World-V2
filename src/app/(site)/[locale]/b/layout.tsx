import type { Locale } from "@/content/types";
import { getSiteSettings } from "@/lib/content";
import { V2Header } from "@/components/v2/V2Header";
import { V2Footer } from "@/components/v2/V2Footer";
import { LinkRewriter } from "@/components/v2/LinkRewriter";

/** Version B frame (client, 18 Nov): its own header and footer on every Version B page, in the ORA brand palette. */
export default async function VersionBLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale: l } = await params;
  const locale = (l === "es" ? "es" : "en") as Locale;
  const es = locale === "es";
  const settings = await getSiteSettings();
  const links = [
    { href: "/b/living", label: es ? "Vivir" : "Living" },
    { href: "/b/longevity", label: es ? "Longevidad" : "Longevity" },
    { href: "/b/floor-plans", label: es ? "Planos" : "Floor plans" },
    { href: "/b/finishes", label: es ? "Acabados" : "Finishes" },
    { href: "/b/act-60", label: es ? "Ley 60" : "Act 60" },
  ];
  return (
    <div data-version-b id="top" className="bg-[var(--v2-cream)] text-[var(--v2-green)]">
      <V2Header links={links} inquire={es ? "Consultar" : "Inquire"} versionA={es ? "Versión A" : "Version A"} otherLocale={es ? "en" : "es"} otherLabel={es ? "English" : "Español"} />
      {children}
      <V2Footer locale={locale} settings={settings} />
      <LinkRewriter />
    </div>
  );
}
