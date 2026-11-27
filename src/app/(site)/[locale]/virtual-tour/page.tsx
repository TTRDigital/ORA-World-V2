import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/content/types";
import { getSiteSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/layout/Logo";

/**
 * The 360° virtual tour on its own link (client, 27 Nov: "the virtual tour on the homepage, on a link just showing
 * the tour"). Full screen, no site header or footer (see ChromeGate); only a small logo back to the site.
 * The tour is the same kuula.co collection as the homepage, loaded straight away since that is the page's purpose.
 */
export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/virtual-tour",
    title: locale === "es" ? "Recorrido virtual 360° · Tesoro del Mar" : "360° virtual tour · Tesoro del Mar",
    description: locale === "es" ? "Recorra Tesoro del Mar en 360°: residencias, penthouse y amenidades." : "Walk through Tesoro del Mar in 360°: the residences, the penthouse and the amenities.",
  });
}

export default async function VirtualTourPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const settings = await getSiteSettings();
  const es = locale === "es";
  return (
    <div className="fixed inset-0 z-[60] bg-basalt">
      <h1 className="sr-only">{es ? "Recorrido virtual 360° de Tesoro del Mar" : "Tesoro del Mar 360° virtual tour"}</h1>
      <iframe
        src={settings.vrTourUrl}
        title={es ? "Recorrido virtual 360° de Tesoro del Mar" : "Tesoro del Mar 360° virtual tour"}
        className="absolute inset-0 h-full w-full border-0"
        allow="xr-spatial-tracking; gyroscope; accelerometer; fullscreen"
        allowFullScreen
      />
      <Link href="/" aria-label={es ? "Ir a ORA World" : "Go to ORA World"} className="absolute top-3 left-3 rounded-xl bg-basalt/55 px-3 py-2 backdrop-blur-md md:top-5 md:left-5">
        <Logo variant="white" height={96} responsive className="h-[40px] w-auto md:h-[52px]" />
      </Link>
    </div>
  );
}
