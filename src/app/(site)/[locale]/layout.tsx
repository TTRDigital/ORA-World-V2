import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { display, sans } from "@/lib/fonts";
import { SITE_URL, IS_PROD } from "@/lib/utils";
import { getFaqs, getPress, getSiteSettings } from "@/lib/content";
import { tdm, life } from "@/content/seed/images";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SkipLink } from "@/components/layout/SkipLink";
import { AskOra } from "@/components/layout/AskOra";
import { MotionInit } from "@/components/providers/MotionInit";
import { ScrollFx } from "@/components/providers/ScrollFx";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Consent } from "@/components/providers/Consent";
import { TrackClicks } from "@/components/providers/TrackClicks";
import { PageTransition } from "@/components/providers/PageTransition";
import "@/styles/globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t("home.title"), template: t("titleTemplate") },
    description: t("home.description"),
    applicationName: "ORA World",
    robots: IS_PROD ? { index: true, follow: true } : { index: false, follow: false },
  };
}

export const viewport: Viewport = { themeColor: "#F7F3EC", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [settings, faqs, press] = await Promise.all([getSiteSettings(), getFaqs(), getPress()]);
  const tiles = [
    { key: "residences" as const, href: "/residences", image: tdm.aptLiving },
    { key: "living" as const, href: "/living", image: life.poolTerrace },
    { key: "place" as const, href: "/place", image: tdm.aerialCoast },
    { key: "invest" as const, href: "/invest", image: tdm.exteriorGolf },
    { key: "portfolio" as const, href: "/portfolio", image: tdm.exteriorRoad },
  ];
  return (
    <html lang={locale} className={`${display.variable} ${sans.variable} no-js`} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider>
          <SkipLink />
          <Header tiles={tiles} />
          <main id="main" className="pt-[108px] md:pt-[120px] lg:pt-[128px]">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer settings={settings} showPress={press.length > 0} />
          <AskOra faqs={faqs} phone={settings.phone} whatsapp={settings.whatsapp} consentText={settings.consentText[locale as "en" | "es"]} />
          <Consent />
          <MotionInit />
          <ScrollFx />
          <SmoothScroll />
          <TrackClicks />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
