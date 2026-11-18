import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { display, sans, script } from "@/lib/fonts";
import { SITE_URL, IS_PROD } from "@/lib/utils";
import { getFaqs, getPress, getSiteSettings } from "@/lib/content";
import { tdm, life } from "@/content/seed/images";
import { ChromeGate } from "@/components/v2/ChromeGate";
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
    { key: "plans" as const, href: "/residences/plans", image: tdm.kitchenDining },
    { key: "finishes" as const, href: "/finishes", image: tdm.kitchenWine },
    { key: "longevity" as const, href: "/longevity", image: tdm.gym },
    { key: "act60" as const, href: "/act-60", image: tdm.aerialCoast },
    { key: "living" as const, href: "/living", image: life.poolTerrace },
  ];
  return (
    <html lang={locale} className={`${display.variable} ${sans.variable} ${script.variable} no-js`} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider>
          <SkipLink />
          <ChromeGate><Header tiles={tiles} /></ChromeGate>
          <main id="main" className="pt-[80px] lg:pt-[96px]">
            <PageTransition>{children}</PageTransition>
          </main>
          <ChromeGate><Footer settings={settings} showPress={press.length > 0} /></ChromeGate>
          <ChromeGate><AskOra faqs={faqs} phone={settings.phone} whatsapp={settings.whatsapp} consentText={settings.consentText[locale as "en" | "es"]} /></ChromeGate>
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
