import type { Locale } from "@/content/types";
import { getSiteSettings } from "@/lib/content";
import { CHeader } from "@/components/v3/CHeader";
import { CFooter } from "@/components/v3/CFooter";
import { LinkRewriter } from "@/components/v2/LinkRewriter";

/** Version C frame (client, 19 Nov: a third version, "old money", simple and high end, for an older audience). */
export default async function VersionCLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale: l } = await params;
  const locale = (l === "es" ? "es" : "en") as Locale;
  const es = locale === "es";
  const settings = await getSiteSettings();
  const links = [
    { href: "/c/longevity", label: es ? "Longevidad" : "Longevity" },
    { href: "/c/act-60", label: es ? "Ley 60" : "Act 60" },
    { href: "/c/floor-plans", label: es ? "Residencias" : "Residences" },
    { href: "/c/finishes", label: es ? "Acabados" : "Finishes" },
    { href: "/c#setting", label: es ? "El entorno" : "The setting" },
  ];
  return (
    <div data-version-c id="top" className="bg-bone text-charcoal">
      <CHeader
        links={links}
        inquire={es ? "Consultar" : "Inquire"}
        phone={settings.phone ?? ""}
        place={es ? "Tesoro del Mar · Dorado, Puerto Rico" : "Tesoro del Mar · Dorado, Puerto Rico"}
        otherLocale={es ? "en" : "es"}
        otherLabel={es ? "English" : "Español"}
        menu={es ? "Menú" : "Menu"}
        close={es ? "Cerrar" : "Close"}
      />
      {children}
      <CFooter locale={locale} settings={settings} />
      <LinkRewriter v="c" />
    </div>
  );
}
