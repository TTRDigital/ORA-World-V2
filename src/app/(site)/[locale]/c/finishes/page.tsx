import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import type { L, Locale } from "@/content/types";
import { tdm } from "@/content/seed/images";
import { CHAPTERS } from "@/content/seed/finishChapters";
import { FinishPalette } from "@/components/finishes/FinishPalette";
import { ProductGrid } from "@/components/finishes/ProductGrid";
import { SelectionTray } from "@/components/finishes/SelectionTray";
import { CHeading, CFrame, CSection, CEyebrow, CButton, Ornament } from "@/components/v3/C";
import { cn } from "@/lib/utils";

/** Version C · Finishes: a contents list, then each chapter centred and plainly titled, as in a printed catalogue. */
const clip = (n: string) => ({ video: `/videos/clips/${n}.mp4`, poster: `/videos/clips/${n}-poster.jpg` });

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "es" ? "Acabados · Versión C" : "Finishes · Version C", robots: { index: false, follow: false } };
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
      <section aria-labelledby="c-fin" className="px-5 pt-16 pb-20 md:px-10 md:pt-20 md:pb-28">
        <div className="mx-auto max-w-[1200px]">
          <CHeading level={1} id="c-fin" eyebrow={es ? "Acabados" : "Finishes"} title={es ? "Cada línea fluye con propósito." : "Every line flows with purpose."} intro={es ? "De los gabinetes italianos a la casa inteligente: todo lo que puede elegir." : "From Italian cabinetry to the smart home: everything you can choose."} ornament={false} />
          <CFrame image={{ ...tdm.kitchenWine, ...clip("p16-apartment-kitchen") }} locale={locale} sizes="(max-width: 1199px) calc(100vw - 40px), 1200px" ratio="aspect-[4/3] md:aspect-[21/9]" caption={es ? "La cocina, con gabinetes Scavolini." : "The kitchen, with Scavolini cabinetry."} className="mt-14" />
          {/* Contents. */}
          <nav aria-label={es ? "Contenido" : "Contents"} className="mx-auto mt-16 max-w-[720px]">
            <CEyebrow className="text-center">{es ? "Contenido" : "Contents"}</CEyebrow>
            <ol className="mt-6 border-t-[3px] border-double border-brass/50">
              {CHAPTERS.map((c, i) => (
                <li key={c.id} className="border-b border-travertine-deep">
                  <a href={`#${c.id}`} className="grid min-h-14 grid-cols-[3rem_minmax(0,1fr)_auto] items-center gap-x-4 py-3 text-[18px] text-charcoal hover:text-brass-ink">
                    <span className="font-[family-name:var(--font-display)] text-[22px] text-brass-ink">{i + 1}.</span>
                    <span>
                      {x(c.label)}
                      {x(c.group) !== x(c.label) && <span className="text-charcoal-soft"> · {x(c.group)}</span>}
                    </span>
                    <span className="text-[14px] tracking-[0.08em] text-charcoal-soft">{c.brands}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </section>

      {CHAPTERS.map((c, i) => (
        <CSection key={c.id} id={c.id} tone={i % 2 ? "bone" : "paper"} labelledBy={`c-${c.id}`}>
          <CHeading id={`c-${c.id}`} eyebrow={`${i + 1} · ${x(c.group)}${x(c.group) !== x(c.label) ? ` · ${x(c.label)}` : ""}`} title={x(c.title)} intro={x(c.intro)} />
          <p className="mt-5 text-center text-[14px] font-semibold tracking-[0.2em] text-brass-ink uppercase">{c.brands}</p>
          <div className="mt-12 grid gap-10">
            {c.wide && (
              <div className="border border-travertine-deep bg-white p-2 md:p-3">
                <Image src={c.wide.src} alt={x(c.board.alt)} width={c.wide.w} height={c.wide.h} sizes="(max-width: 1199px) calc(100vw - 40px), 1200px" quality={88} className="h-auto w-full" />
              </div>
            )}
            {c.photos && (
              <div className={cn("grid gap-4", c.photos.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2")}>
                {c.photos.map((src) => (
                  <div key={src} className="border border-travertine-deep bg-white p-2">
                    <div className="relative aspect-[4/3] overflow-hidden bg-travertine">
                      <Image src={src} alt="" fill unoptimized className="object-cover" style={{ objectPosition: "50% 50%" }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {c.products && <ProductGrid items={c.products.map((p) => ({ name: x(p.name), maker: p.maker, spec: p.spec && x(p.spec), src: p.src, photo: p.photo }))} close={es ? "Cerrar" : "Close"} />}
            {c.swatches && <FinishPalette chips={c.swatches} category={x(c.label)} dense={c.swatches.length > 8} groups={c.swatches.length > 8 ? paletteGroups : undefined} labels={{ ...paletteLabels, preview: c.swatchLabel ? x(c.swatchLabel) : paletteLabels.preview }} />}
            {!c.products && (
              <ul className="mx-auto grid w-full max-w-[880px] border-t border-travertine-deep md:grid-cols-2 md:gap-x-12">
                {c.items.map((it) => (
                  <li key={it.en} className="grid grid-cols-[1.75rem_minmax(0,1fr)] items-baseline border-b border-travertine-deep py-4 text-[17px] text-charcoal">
                    <span aria-hidden className="text-brass-ink">—</span>
                    {x(it)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CSection>
      ))}

      <SelectionTray labels={{ mine: es ? "Mi selección" : "My selection", send: es ? "Enviar con mi consulta" : "Send with my inquiry", clear: es ? "Borrar" : "Clear", remove: es ? "Quitar" : "Remove", show: es ? "Ver" : "Show", hide: es ? "Ocultar" : "Hide" }} />

      <section aria-label={es ? "Consultar" : "Inquire"} className="bg-bone-deep px-5 py-20 text-center md:px-10 md:py-24">
        <Ornament />
        <p className="mx-auto mt-8 max-w-[26ch] font-[family-name:var(--font-display)] text-[30px] leading-snug text-charcoal md:text-[40px]">{es ? "Elija sus acabados con nosotros." : "Choose your finishes with us."}</p>
        <div className="mt-10">
          <CButton href="/c#inquire">{es ? "Consultar" : "Inquire"}</CButton>
        </div>
      </section>
    </>
  );
}
