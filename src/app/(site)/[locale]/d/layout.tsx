import type { Locale } from "@/content/types";
import { getSiteSettings } from "@/lib/content";
import { CHeader } from "@/components/v3/CHeader";
import { CFooter } from "@/components/v3/CFooter";
import { LinkRewriter } from "@/components/v2/LinkRewriter";

/** Version D frame (client, 20 Nov: "like Version C, with the films instead of the images"): Version C's header and
 * footer; its /c links are pointed at /d by the link rewriter. */
export default async function VersionDLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale: l } = await params;
  const locale = (l === "es" ? "es" : "en") as Locale;
  const es = locale === "es";
  const settings = await getSiteSettings();
  const links = [
    { href: "/c/floor-plans", label: es ? "Residencias" : "Residences" },
    { href: "/c/longevity", label: es ? "Longevidad" : "Longevity" },
    { href: "/c/act-60", label: es ? "Ley 60" : "Act 60" },
    { href: "/c/finishes", label: es ? "Acabados" : "Finishes" },
    { href: "/c#location", label: es ? "Ubicación" : "Location" },
  ];
  return (
    <div data-version-d id="top" className="bg-white text-charcoal">
      <CHeader
        links={links}
        inquire={es ? "Consultar" : "Inquire"}
        phone={settings.phone ?? ""}
        otherLocale={es ? "en" : "es"}
        otherLabel={es ? "English" : "Español"}
        menu={es ? "Menú" : "Menu"}
        close={es ? "Cerrar" : "Close"}
      />
      {children}
      <CFooter locale={locale} settings={settings} v="d" />
      <LinkRewriter v="d" />
    </div>
  );
}
