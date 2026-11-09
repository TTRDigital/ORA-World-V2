/**
 * Phones only: a fixed bar with the two documents buyers ask for first (client reference: Cipriani's "Get brochure /
 * Get floorplans" bar). A spacer keeps the footer clear of it.
 */
export function MobileBar({ brochureUrl, floorPlansUrl, locale }: { brochureUrl: string | null; floorPlansUrl: string | null; locale: "en" | "es" }) {
  if (!brochureUrl && !floorPlansUrl) return null;
  const es = locale === "es";
  return (
    <>
      <div aria-hidden className="h-[72px] lg:hidden" />
      <nav aria-label={es ? "Documentos" : "Documents"} className="fixed inset-x-0 bottom-0 z-[64] grid grid-cols-2 gap-2 bg-basalt/95 px-3 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">
        {brochureUrl && (
          <a href={brochureUrl} target="_blank" rel="noopener" className="cta min-h-11 px-3 text-[11px]" data-track="brochure_pdf" data-track-label="mobile-bar">
            {es ? "Folleto" : "Get brochure"}
          </a>
        )}
        {floorPlansUrl && (
          <a href={floorPlansUrl} target="_blank" rel="noopener" className="cta cta-ghost min-h-11 px-3 text-[11px] text-bone" data-track="floor_plans_pdf" data-track-label="mobile-bar">
            {es ? "Planos" : "Get floor plans"}
          </a>
        )}
      </nav>
    </>
  );
}
