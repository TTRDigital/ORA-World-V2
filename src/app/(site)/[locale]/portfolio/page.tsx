import { redirect } from "next/navigation";
import type { Locale } from "@/content/types";

/**
 * Client decision (sales): only Tesoro Del Mar is on sale, so the multi-project portfolio is off the site for now.
 * Old links land on the Tesoro Del Mar page instead of a 404. The portfolio data and components stay in the repo.
 */
export default async function PortfolioPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  redirect(`/${locale}/place/tesoro-del-mar`);
}
