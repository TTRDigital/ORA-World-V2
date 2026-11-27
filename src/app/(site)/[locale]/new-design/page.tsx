import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/content/types";
import { PageHero } from "@/components/ui/PageHero";
import { PillLink } from "@/components/ui/Pill";
import { Picture } from "@/components/ui/Picture";
import { tdmV18 } from "@/content/seed/images";

/**
 * The new tower design on its own link (client, 24 Nov: "update on the new link"; the rest of the site stays as it
 * is). Source: Forma Nova Architects, "Site Plan V2 w/ Towers V18", schematic design, 23 Nov 2026 (work in progress).
 * Not in the navigation and not indexed: it is shared with the client for review.
 */
type L = { en: string; es: string };

const FACTS: { value: string; label: L }[] = [
  { value: "2", label: { en: "Towers", es: "Torres" } },
  { value: "29", label: { en: "Levels each", es: "Niveles cada una" } },
  {
    value: "5",
    label: { en: "Podium levels with garden terraces", es: "Niveles de podio con terrazas ajardinadas" },
  },
  {
    value: "3",
    label: { en: "Levels of parking below ground", es: "Niveles de estacionamiento subterráneo" },
  },
  { value: "10.57", label: { en: "Acres", es: "Acres" } },
];

const PARCELS: { name: L; acres: string; m2: string }[] = [
  { name: { en: "Parcel A", es: "Parcela A" }, acres: "6.23", m2: "25,230" },
  { name: { en: "Parcel B", es: "Parcela B" }, acres: "1.48", m2: "5,985" },
  {
    name: { en: "Highway Authority parcel", es: "Parcela de la Autoridad de Carreteras" },
    acres: "2.86",
    m2: "11,574",
  },
];

const AREAS: { name: L; sqft: string; total?: boolean }[] = [
  { name: { en: "Residences", es: "Residencias" }, sqft: "541,228" },
  { name: { en: "Hotel", es: "Hotel" }, sqft: "132,600" },
  { name: { en: "Residential amenities", es: "Amenidades residenciales" }, sqft: "30,269" },
  { name: { en: "Hotel back of house", es: "Servicios internos del hotel" }, sqft: "16,000" },
  { name: { en: "Total counted area", es: "Área computable total" }, sqft: "720,097", total: true },
  {
    name: { en: "Hotel amenities (not counted)", es: "Amenidades del hotel (no computables)" },
    sqft: "100,567",
  },
  { name: { en: "Parking (not counted)", es: "Estacionamiento (no computable)" }, sqft: "328,002" },
  { name: { en: "Gross area", es: "Área bruta" }, sqft: "1,148,666", total: true },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "es" ? "El nuevo diseño · Tesoro del Mar" : "The new design · Tesoro del Mar",
    robots: { index: false, follow: false },
  };
}

export default async function NewDesignPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const es = locale === "es";
  const x = (l: L) => l[locale];
  const h2 =
    "font-[family-name:var(--font-display)] text-[36px] leading-[1.08] font-semibold text-charcoal md:text-[52px]";
  const eyebrow = "text-[11px] font-semibold tracking-[0.24em] text-brass-ink uppercase";

  return (
    <div className="flex flex-col">
      <PageHero
        locale={locale}
        label={es ? "Actualización del diseño · Noviembre 2026" : "Design update · November 2026"}
        headline={es ? "Dos torres, escalonadas en jardines." : "Two towers, terraced in gardens."}
        intro={
          es
            ? "El diseño esquemático más reciente de Tesoro del Mar: dos torres de 29 niveles que se elevan sobre un podio de terrazas ajardinadas curvas, con el hotel y las amenidades en su base y el estacionamiento bajo tierra."
            : "The latest schematic design for Tesoro del Mar: two 29-level towers rising from a podium of curving garden terraces, with the hotel and amenities at their base and parking below ground."
        }
        image={tdmV18.towers}
      >
        <PillLink href="/#inquire" tone="brass">
          {es ? "Consultar" : "Inquire"}
        </PillLink>
      </PageHero>

      <section
        aria-label={es ? "Datos del diseño" : "Design facts"}
        className="border-b border-travertine-deep/60 bg-bone px-5 py-12 md:px-10 md:py-16"
      >
        <dl className="mx-auto grid max-w-[1280px] grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-5">
          {FACTS.map((f) => (
            <div key={f.value + f.label.en} className="flex flex-col-reverse">
              <dt className="mt-3 text-[12px] font-semibold tracking-[0.18em] text-charcoal-soft uppercase">
                {x(f.label)}
              </dt>
              <dd className="font-[family-name:var(--font-display)] text-[48px] leading-none text-charcoal tabular-nums md:text-[64px]">
                {f.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="nd-renders" className="bg-white px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1280px]">
          <p className={eyebrow}>{es ? "Las renderizaciones" : "The renderings"}</p>
          <h2 id="nd-renders" className={`mt-4 ${h2}`}>
            {es
              ? "Terrazas que siguen la curva de la costa."
              : "Terraces that follow the curve of the coast."}
          </h2>
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              {
                image: tdmV18.entrance,
                caption: { en: "The ORA World entrance", es: "La entrada de ORA World" },
              },
              {
                image: tdmV18.terraces,
                caption: { en: "Garden terraces from above", es: "Las terrazas ajardinadas desde arriba" },
              },
              {
                image: tdmV18.terraceSea,
                caption: { en: "A terrace facing the sea", es: "Una terraza frente al mar" },
              },
            ].map((r) => (
              <li key={r.image.src}>
                <Picture
                  image={r.image}
                  locale={locale}
                  sizes="(max-width: 767px) 100vw, 400px"
                  ratio="3/2"
                />
                <p className="mt-3 text-[14px] text-charcoal-soft">{x(r.caption)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        aria-labelledby="nd-site"
        className="border-y border-travertine-deep/60 bg-bone px-5 py-16 md:px-10 md:py-24"
      >
        <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
          <Picture
            image={tdmV18.site}
            locale={locale}
            sizes="(max-width: 1023px) calc(100vw - 40px), 700px"
            ratio="2550/2190"
          />
          <div>
            <p className={eyebrow}>{es ? "El terreno" : "The land"}</p>
            <h2 id="nd-site" className={`mt-4 ${h2}`}>
              {es ? "10.57 acres en tres parcelas." : "10.57 acres across three parcels."}
            </h2>
            <table className="mt-8 w-full text-[15px] text-charcoal">
              <thead className="sr-only">
                <tr>
                  <th>{es ? "Parcela" : "Parcel"}</th>
                  <th>Acres</th>
                  <th>m²</th>
                </tr>
              </thead>
              <tbody>
                {PARCELS.map((p) => (
                  <tr key={p.name.en} className="border-b border-travertine-deep/70">
                    <td className="py-3">{x(p.name)}</td>
                    <td className="py-3 text-right tabular-nums">{p.acres} ac</td>
                    <td className="py-3 text-right text-charcoal-soft tabular-nums">{p.m2} m²</td>
                  </tr>
                ))}
                <tr className="font-semibold">
                  <td className="py-3">{es ? "Total" : "Total"}</td>
                  <td className="py-3 text-right tabular-nums">10.57 ac</td>
                  <td className="py-3 text-right text-charcoal-soft tabular-nums">42,789 m²</td>
                </tr>
              </tbody>
            </table>
            <p className="mt-4 text-[13px] text-charcoal-soft">
              {es ? "Zonificación RT-I. Vega Alta, Puerto Rico." : "Zoning RT-I. Vega Alta, Puerto Rico."}
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="nd-plan" className="bg-white px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1280px]">
          <p className={eyebrow}>{es ? "Plano del sitio" : "Site plan"}</p>
          <h2 id="nd-plan" className={`mt-4 ${h2}`}>
            {es ? "Las torres, el podio y los accesos." : "The towers, the podium and the drives."}
          </h2>
          <div className="mt-10">
            {/* Drawings show whole: natural size, no reveal zoom. */}
            <Picture
              image={tdmV18.sitePlan}
              locale={locale}
              sizes="(max-width: 1279px) calc(100vw - 40px), 1280px"
              fill={false}
              reveal={false}
              rounded="none"
              imgClassName="h-auto w-full"
            />
          </div>
        </div>
      </section>

      <section
        aria-labelledby="nd-areas"
        className="border-t border-travertine-deep/60 bg-bone px-5 py-16 md:px-10 md:py-24"
      >
        <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
          <Picture
            image={tdmV18.elevation}
            locale={locale}
            sizes="(max-width: 1023px) calc(100vw - 40px), 720px"
            fill={false}
            reveal={false}
            rounded="none"
            imgClassName="h-auto w-full"
          />
          <div>
            <p className={eyebrow}>{es ? "Programa de áreas" : "Area schedule"}</p>
            <h2 id="nd-areas" className={`mt-4 ${h2}`}>
              {es ? "Más de un millón de pies cuadrados." : "Over a million square feet."}
            </h2>
            <table className="mt-8 w-full text-[15px] text-charcoal">
              <thead className="sr-only">
                <tr>
                  <th>{es ? "Uso" : "Use"}</th>
                  <th>{es ? "Pies cuadrados" : "Square feet"}</th>
                </tr>
              </thead>
              <tbody>
                {AREAS.map((a) => (
                  <tr
                    key={a.name.en}
                    className={
                      a.total
                        ? "border-b border-charcoal/40 font-semibold"
                        : "border-b border-travertine-deep/70"
                    }
                  >
                    <td className="py-3">{x(a.name)}</td>
                    <td className="py-3 text-right tabular-nums">{a.sqft} sq ft</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="mx-auto mt-12 max-w-[1280px] text-[12.5px] leading-relaxed text-charcoal-soft">
          {es
            ? "Fuente: Forma Nova Architects, «Site Plan V2 w/ Towers V18», diseño esquemático, 23 de noviembre de 2026. Trabajo en curso: los planos, las áreas y las renderizaciones pueden cambiar. Todas las imágenes son representaciones del artista."
            : "Source: Forma Nova Architects, “Site Plan V2 w/ Towers V18”, schematic design, 23 November 2026. Work in progress: plans, areas and renderings may change. All images are artist renderings."}
        </p>
      </section>
    </div>
  );
}
