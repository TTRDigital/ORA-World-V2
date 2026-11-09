import type { Locale } from "@/content/types";
import { Hero } from "./Hero";
import { CipHome } from "./CipHome";

/**
 * The homepage (client direction, November 2026: "make it like Cipriani", simple and calm for the owner): the video
 * banner and eight sections in one repeated layout. The earlier interactive modules (explorer, room tour, resilience
 * dial, render carousel, Act 60 quiz, FAQ) stay in the codebase for the inner pages and are no longer on the home page.
 */
export function HomePage({ locale }: { locale: Locale }) {
  return (
    <div className="flex flex-col">
      <Hero locale={locale} />
      <CipHome locale={locale} />
    </div>
  );
}
