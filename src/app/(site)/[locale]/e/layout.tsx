import type { Locale } from "@/content/types";
import { getSiteSettings } from "@/lib/content";
import { EHeader } from "@/components/v5/EHeader";
import { EFooter } from "@/components/v5/EFooter";
import { LinkRewriter } from "@/components/v2/LinkRewriter";

/** Version E frame (client, 23 Nov: "another version like ciprianiresidencesmiami.com, the same layout"). */
export default async function VersionELayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: l } = await params;
  const locale = (l === "es" ? "es" : "en") as Locale;
  const es = locale === "es";
  const settings = await getSiteSettings();
  const links = [
    { href: "/e", label: es ? "Inicio" : "Home" },
    { href: "/e/floor-plans", label: es ? "Residencias" : "Residences" },
    { href: "/e/longevity", label: es ? "Longevidad" : "Longevity" },
    { href: "/e/act-60", label: es ? "Ley 60" : "Act 60" },
    { href: "/e/finishes", label: es ? "Acabados" : "Finishes" },
    { href: "/e#location", label: es ? "Ubicación" : "Location" },
    { href: "/e#inquire", label: es ? "Consultar" : "Inquire" },
  ];
  return (
    <div data-version-e id="top" className="bg-bone text-basalt">
      <EHeader
        links={links}
        inquire={es ? "Consultar" : "Inquire"}
        phone={settings.phone ?? ""}
        otherLocale={es ? "en" : "es"}
        otherLabel={es ? "English" : "Español"}
        menu={es ? "Menú" : "Menu"}
        close={es ? "Cerrar" : "Close"}
      />
      {children}
      <EFooter locale={locale} settings={settings} />
      <LinkRewriter v="e" />
    </div>
  );
}
