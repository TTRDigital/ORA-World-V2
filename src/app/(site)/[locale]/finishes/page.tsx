import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ImageRef, L, Locale } from "@/content/types";
import { pageMetadata, JsonLd, breadcrumbLd } from "@/lib/seo";
import { PageHero } from "@/components/ui/PageHero";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { FinishPalette } from "@/components/finishes/FinishPalette";
import { ProductGrid } from "@/components/finishes/ProductGrid";
import Image from "next/image";
import { SelectionTray } from "@/components/finishes/SelectionTray";

/**
 * Finishes (client, 18 Nov: "a page all about the finishes in the presentation, really nice and clean, divided like the
 * presentation: kitchen finishes, kitchen appliances, counters, closets..."). Every brand, product and finish name is
 * as printed on the presentation's finish boards; selections are subject to the Offering Plan.
 */
import { CHAPTERS } from "@/content/seed/finishChapters";
import { tdm } from "@/content/seed/images";
import { redirect } from "next/navigation";
import { SHOW_FINISHES } from "@/lib/features";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/finishes",
    title: locale === "es" ? "Acabados" : "Finishes",
    description:
      locale === "es"
        ? "Los acabados de Tesoro del Mar: gabinetes Scavolini, encimeras Neolith, electrodomésticos Gaggenau, grifería Dornbracht, vestidores Rimadesio, Lutron y Crestron."
        : "The Tesoro del Mar finishes: Scavolini cabinetry, Neolith counters, Gaggenau appliances, Dornbracht fixtures, Rimadesio closets, Lutron and Crestron.",
  });
}

export default async function FinishesPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  // Client, 27 Nov: Finishes hidden for now (src/lib/features.ts); the page sends visitors to the homepage.
  if (!SHOW_FINISHES) redirect(`/${locale}`);
  const es = locale === "es";
  const x = (l: L) => l[locale] || l.en;
  const tn = await getTranslations({ locale, namespace: "nav" });
  const zoomLabels = { close: es ? "Cerrar" : "Close" };
  const paletteLabels = {
    all: es ? "Todos" : "All",
    add: es ? "Añadir a mi selección" : "Add to my selection",
    added: es ? "En mi selección" : "In my selection",
    preview: es ? "Vista previa" : "Preview",
  };
  const paletteGroups: [string, string][] = [
    ["wood", es ? "Maderas" : "Woods"],
    ["lacquer", es ? "Lacados" : "Lacquers"],
    ["texture", es ? "Texturas" : "Textures"],
    ["colour", es ? "Colores suaves" : "Soft colors"],
  ];
  // Client, 18 Nov: the banner plays the kitchen film, as on Version B.
  const hero: ImageRef = {
    ...tdm.kitchenWine,
    video: "/videos/clips/p16-apartment-kitchen.mp4",
    poster: "/videos/clips/p16-apartment-kitchen-poster.jpg",
  };
  return (
    <div className="flex flex-col">
      <JsonLd
        data={breadcrumbLd(locale, [
          { name: "ORA World", path: "/" },
          { name: tn("finishes"), path: "/finishes" },
        ])}
      />
      <PageHero
        locale={locale}
        label={tn("finishes")}
        headline={es ? "Cada línea fluye con propósito" : "Every line flows with purpose"}
        intro={
          es
            ? "Superficies y acabados seleccionados para elevar el día a día: de los gabinetes italianos a la casa inteligente, todo lo que puede elegir."
            : "Surfaces and finishes selected to elevate the everyday: from Italian cabinetry to the smart home, everything you can choose."
        }
        image={hero}
      />

      {/* Chapter index, sticky under the header. */}
      <nav
        aria-label={es ? "Capítulos" : "Chapters"}
        className="sticky top-[80px] z-30 border-y border-travertine-deep/60 bg-bone/95 backdrop-blur-sm lg:top-[96px]"
      >
        <ul className="no-scrollbar mx-auto flex max-w-[1280px] gap-2 overflow-x-auto px-5 py-3 md:px-10 xl:px-0">
          {CHAPTERS.map((c) => (
            <li key={c.id} className="shrink-0">
              <a
                href={`#${c.id}`}
                className="inline-flex min-h-10 items-center rounded-full px-4 text-[11px] font-semibold tracking-[0.18em] whitespace-nowrap text-charcoal uppercase ring-1 ring-travertine-deep transition-colors hover:bg-charcoal hover:text-bone hover:ring-charcoal"
              >
                {x(c.label)}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {CHAPTERS.map((c, i) => (
        <section
          key={c.id}
          id={c.id}
          aria-labelledby={`${c.id}-title`}
          className={cn(
            "scroll-mt-[150px] border-b border-travertine-deep/60 px-5 py-16 md:px-10 md:py-24 lg:scroll-mt-[170px]",
            i % 2 ? "bg-white" : "bg-bone",
          )}
        >
          <div className="mx-auto max-w-[1280px]">
            <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end md:gap-12">
              <div>
                <p className="eyebrow">
                  <span className="rule" aria-hidden />
                  {x(c.group)}
                  {x(c.group) !== x(c.label) && <> · {x(c.label)}</>}
                </p>
                <h2
                  id={`${c.id}-title`}
                  className="mt-5 font-[family-name:var(--font-display)] text-[34px] leading-[1.08] font-normal text-charcoal md:text-[48px]"
                >
                  {x(c.title)}
                </h2>
              </div>
              <div>
                <p className="text-[11px] font-semibold tracking-[0.24em] text-brass-ink uppercase">
                  {c.brands}
                </p>
                <p className="mt-3 max-w-[48ch] text-[16px] leading-relaxed text-charcoal-soft md:text-[17px]">
                  {x(c.intro)}
                </p>
              </div>
            </div>

            {/* Client, 18 Nov: the finishes as part of the site, not as brochure boards: lifestyle photos as a clean
                mosaic, each product on its own card (a card opens a pop-up). */}
            {c.wide && (
              <div className="mt-10 overflow-hidden rounded-[22px] bg-travertine md:mt-12">
                <Image
                  src={c.wide.src}
                  alt={x(c.board.alt)}
                  width={c.wide.w}
                  height={c.wide.h}
                  sizes="(max-width: 1279px) calc(100vw - 40px), 1280px"
                  quality={88}
                  className="h-auto w-full"
                />
              </div>
            )}
            {c.photos && (
              <div
                className={cn(
                  "mt-10 grid gap-3 md:mt-12 md:gap-4",
                  c.photos.length === 3
                    ? "md:grid-cols-[1.4fr_1fr] md:grid-rows-2"
                    : "md:grid-cols-[1.5fr_1fr]",
                )}
              >
                {c.photos.map((src, k) => (
                  <div
                    key={src}
                    className={cn(
                      "relative min-h-[240px] overflow-hidden rounded-[20px] bg-travertine md:min-h-[300px]",
                      c.photos!.length === 3 && k === 0 && "md:row-span-2 md:min-h-[520px]",
                    )}
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      unoptimized
                      className="object-cover"
                      style={{ objectPosition: "50% 50%" }}
                    />
                  </div>
                ))}
              </div>
            )}
            {c.products && (
              <div className="mt-10 md:mt-12">
                <ProductGrid
                  items={c.products.map((p) => ({
                    name: x(p.name),
                    maker: p.maker,
                    spec: p.spec && x(p.spec),
                    src: p.src,
                    photo: p.photo,
                  }))}
                  close={zoomLabels.close}
                />
              </div>
            )}

            {c.swatches && (
              <div className="mt-12 md:mt-14">
                <FinishPalette
                  chips={c.swatches}
                  category={x(c.label)}
                  dense={c.swatches.length > 8}
                  groups={c.swatches.length > 8 ? paletteGroups : undefined}
                  labels={{
                    ...paletteLabels,
                    preview: c.swatchLabel ? x(c.swatchLabel) : paletteLabels.preview,
                  }}
                />
              </div>
            )}

            {!c.products && (
              <ul className="mt-10 border-t border-travertine-deep md:mt-12 md:grid md:grid-cols-2 md:gap-x-12">
                {c.items.map((it) => (
                  <li
                    key={it.en}
                    className="grid grid-cols-[1.75rem_minmax(0,1fr)] items-baseline border-b border-travertine-deep py-3.5 text-[15px] text-charcoal"
                  >
                    <span aria-hidden className="text-brass">
                      —
                    </span>
                    {x(it)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      ))}

      <SelectionTray
        labels={{
          mine: es ? "Mi selección" : "My selection",
          send: es ? "Enviar con mi consulta" : "Send with my inquiry",
          clear: es ? "Borrar" : "Clear",
          remove: es ? "Quitar" : "Remove",
          show: es ? "Ver" : "Show",
          hide: es ? "Ocultar" : "Hide",
        }}
      />

      <section
        aria-labelledby="finishes-close"
        data-tone="dark"
        className="on-dark bg-basalt px-5 py-16 text-center text-bone md:px-10 md:py-20"
      >
        <div className="mx-auto max-w-[880px]">
          <h2
            id="finishes-close"
            className="font-[family-name:var(--font-display)] text-[30px] leading-tight font-normal md:text-[42px]"
          >
            {es ? "Elija sus acabados con nosotros" : "Choose your finishes with us"}
          </h2>
          <p className="mx-auto mt-4 max-w-[52ch] text-[16px] leading-relaxed text-bone/80">
            {es
              ? "Añada a su selección los acabados que le gusten y envíela con su consulta; le acompañamos en cada elección."
              : "Add the finishes you like to your selection and send it with your inquiry; we'll walk you through every choice."}
          </p>
          <Link
            href="/#inquire"
            className="cta mt-8 inline-flex min-h-[52px] px-8"
            data-track="cta_inquire"
            data-track-label="finishes"
          >
            {es ? "Consultar" : "Inquire"} <ArrowRight width={14} height={14} />
          </Link>
          <p className="mx-auto mt-8 max-w-[64ch] text-[12.5px] leading-relaxed text-bone/60">
            {es
              ? "Marcas, productos y acabados según la presentación de Tesoro del Mar; las selecciones y su disponibilidad están sujetas al Plan de Oferta."
              : "Brands, products and finishes as shown in the Tesoro del Mar presentation; selections and availability are subject to the Offering Plan."}
          </p>
        </div>
      </section>
    </div>
  );
}
