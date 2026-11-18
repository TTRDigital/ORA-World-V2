import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import type { L, Locale } from "@/content/types";
import { tdm } from "@/content/seed/images";
import { CHAPTERS } from "@/content/seed/finishChapters";
import { FinishPalette } from "@/components/finishes/FinishPalette";
import { ProductGrid } from "@/components/finishes/ProductGrid";
import { SelectionTray } from "@/components/finishes/SelectionTray";
import { BHero, BStatement, BClose, Eyebrow } from "@/components/v2/B";
import { cn } from "@/lib/utils";

/**
 * Version B · Finishes: its own layout (client, 18 Nov: "different from Version A"): each chapter as a split page, a
 * sticky column with a giant numeral, the title and brands on the left, the products or photographs on the right.
 */
const clip = (n: string) => ({ video: `/videos/clips/${n}.mp4`, poster: `/videos/clips/${n}-poster.jpg` });

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "es" ? "Acabados · Versión B" : "Finishes · Version B", robots: { index: false, follow: false } };
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const es = locale === "es";
  const x = (l: L) => l[locale] || l.en;
  const paletteLabels = { all: es ? "Todos" : "All", add: es ? "Añadir a mi selección" : "Add to my selection", added: es ? "En mi selección" : "In my selection", preview: es ? "Vista previa" : "Preview" };
  const paletteGroups: [string, string][] = [
    ["wood", es ? "Maderas" : "Woods"],
    ["lacquer", es ? "Lacados" : "Lacquers"],
    ["texture", es ? "Texturas" : "Textures"],
    ["colour", es ? "Colores suaves" : "Soft colours"],
  ];
  return (
    <>
      <BHero
        image={{ ...tdm.kitchenWine, ...clip("p16-apartment-kitchen") }}
        locale={locale}
        eyebrow={es ? "Acabados · Tesoro del Mar" : "Finishes · Tesoro del Mar"}
        title={es ? "Cada línea fluye con propósito" : "Every line flows with purpose"}
        line={es ? "De los gabinetes italianos a la casa inteligente: todo lo que puede elegir." : "From Italian cabinetry to the smart home: everything you can choose."}
        cue={es ? "Desplácese" : "Scroll to explore"}
      />
      <BStatement text={es ? "Scavolini. Gaggenau. Dornbracht. Rimadesio." : "Scavolini. Gaggenau. Dornbracht. Rimadesio."} sub={es ? "Las marcas que eligen los mejores hogares del mundo, en cada residencia." : "The names the world's finest homes choose, in every residence."} />

      {CHAPTERS.map((c, i) => (
        <section key={c.id} id={c.id} aria-labelledby={`b-${c.id}`} className={cn("scroll-mt-20 px-5 py-20 md:px-10 md:py-28", i % 2 ? "bg-bone-deep" : "bg-bone")}>
          <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)] lg:gap-16">
            <div className="lg:sticky lg:top-[110px] lg:self-start">
              <span aria-hidden className={cn("block font-[family-name:var(--font-display)] text-[88px] leading-none [font-variant-numeric:lining-nums] md:text-[120px]", i % 2 ? "text-brass-ink" : "text-brass")}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <Eyebrow className="mt-6">
                {x(c.group)}
                {x(c.group) !== x(c.label) && <> · {x(c.label)}</>}
              </Eyebrow>
              <h2 id={`b-${c.id}`} className="mt-4 max-w-[14ch] font-[family-name:var(--font-display)] text-[38px] leading-[1.06] font-normal text-basalt md:text-[54px]">
                {x(c.title)}
              </h2>
              <p className="mt-5 text-[11px] tracking-[0.28em] text-brass-ink uppercase">{c.brands}</p>
              <p className="mt-4 max-w-[44ch] text-[16px] leading-relaxed text-charcoal-soft">{x(c.intro)}</p>
              {!c.products && (
                <ul className="mt-8 grid gap-2 text-[14.5px] text-charcoal">
                  {c.items.map((it) => (
                    <li key={it.en} className="flex gap-3">
                      <span aria-hidden className="text-brass">—</span>
                      {x(it)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="grid content-start gap-10">
              {c.wide && (
                <div className="overflow-hidden bg-travertine">
                  <Image src={c.wide.src} alt={x(c.board.alt)} width={c.wide.w} height={c.wide.h} sizes="(max-width: 1023px) calc(100vw - 40px), 860px" quality={88} className="h-auto w-full" />
                </div>
              )}
              {c.photos && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {c.photos.map((src, k) => (
                    <div key={src} className={cn("relative min-h-[240px] overflow-hidden bg-travertine", k === 0 && "sm:col-span-2 sm:min-h-[420px]")}>
                      <Image src={src} alt="" fill unoptimized className="object-cover" style={{ objectPosition: "50% 50%" }} />
                    </div>
                  ))}
                </div>
              )}
              {c.products && <ProductGrid items={c.products.map((p) => ({ name: x(p.name), maker: p.maker, spec: p.spec && x(p.spec), src: p.src, photo: p.photo }))} close={es ? "Cerrar" : "Close"} />}
              {c.swatches && (
                <FinishPalette chips={c.swatches} category={x(c.label)} dense={c.swatches.length > 8} groups={c.swatches.length > 8 ? paletteGroups : undefined} labels={{ ...paletteLabels, preview: c.swatchLabel ? x(c.swatchLabel) : paletteLabels.preview }} />
              )}
            </div>
          </div>
        </section>
      ))}

      <SelectionTray labels={{ mine: es ? "Mi selección" : "My selection", send: es ? "Enviar con mi consulta" : "Send with my inquiry", clear: es ? "Borrar" : "Clear", remove: es ? "Quitar" : "Remove", show: es ? "Ver" : "Show", hide: es ? "Ocultar" : "Hide" }} />

      <BClose image={tdm.masterSuite} locale={locale} eyebrow={es ? "Sus acabados" : "Your finishes"} title={es ? "Elija sus acabados con nosotros." : "Choose your finishes with us."} inquire={es ? "Consultar" : "Inquire"} second={{ href: "/b/floor-plans", label: es ? "Ver planos" : "View floor plans" }} />
    </>
  );
}
