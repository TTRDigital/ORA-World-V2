import type { Metadata } from "next";
import type { Locale } from "@/content/types";
import VersionAPage from "@/app/(site)/[locale]/longevity/page";

/** Version B · Longevity (client, 18 Nov: "create the other pages as well"): the same content as Version A, in Version B's frame. */
export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "es" ? "Longevidad · Versión B" : "Longevity · Version B", robots: { index: false, follow: false } };
}

export default function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  return <VersionAPage params={params} />;
}
