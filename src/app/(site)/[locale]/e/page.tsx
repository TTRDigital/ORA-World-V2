import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import type { ImageRef, L, Locale } from "@/content/types";
import { getSiteSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { t } from "@/lib/localize";
import { cip } from "@/content/seed/homeCip";
import { tdm, life } from "@/content/seed/images";
import { cImg } from "@/content/seed/imagesC";
import { pointsOfInterest } from "@/content/seed/places";
import { Logo } from "@/components/layout/Logo";
import { LeadFormLazy } from "@/components/forms/LeadFormLazy";
import { BHeroFilm } from "@/components/v2/BHeroFilm";
import { ClipOverlay } from "@/components/ui/ClipOverlay";
import { ETowerSketch } from "@/components/v5/ETowerSketch";
import { EGallery } from "@/components/v5/EGallery";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/**
 * Version E (client, 23 Nov: "another version like ciprianiresidencesmiami.com; I really like this page, the same
 * layout"). That page's sequence in ORA's palette and with ORA's content: a film with the logo large in the middle, a
 * pen sketch beside the introduction, the aerial with the logo, a dark figures band, "the art of" with a drawing, an
 * inset photograph, a quote, an interiors slideshow, a dark service split, "a life of" with three photographs, a dark
 * Act 60 band (in place of their press logos), a full-bleed location panel, a split call to action and the inquiry.
 */
export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const meta = pageMetadata({ locale, path: "/e", title: locale === "es" ? "Tesoro del Mar · Versión E" : "Tesoro del Mar · Version E", description: locale === "es" ? "ORA World en Dorado, Puerto Rico." : "ORA World in Dorado, Puerto Rico." });
  return { ...meta, robots: { index: false, follow: false } };
}

const H2 = ({ children, id, light, className }: { children: React.ReactNode; id?: string; light?: boolean; className?: string }) => (
  <h2 id={id} className={cn("font-[family-name:var(--font-sans)] text-[26px] leading-[1.25] font-light tracking-[0.1em] uppercase md:text-[32px]", light ? "text-bone" : "text-basalt", className)}>
    {children}
  </h2>
);
const TextLink = ({ href, children, light }: { href: string; children: React.ReactNode; light?: boolean }) => (
  <Link href={href} className={cn("mt-6 inline-flex min-h-11 items-center border-b text-[11.5px] font-semibold tracking-[0.2em] uppercase", light ? "border-bone/70 text-bone hover:border-bone" : "border-basalt/60 text-basalt hover:border-basalt")}>
    {children}
  </Link>
);

export default async function VersionE({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const es = locale === "es";
  const x = (l: L) => t(l, locale);
  const settings = await getSiteSettings();
  const still = (i: ImageRef): ImageRef => ({ src: i.src, width: i.width, height: i.height, focal: i.focal, alt: i.alt, rendering: i.rendering });
  const spa: ImageRef = { ...still(life.spa), src: "/videos/clips/spa-ocean-poster.jpg", width: 1248, height: 704, focal: "50% 50%", alt: { en: "A massage in an ocean-view treatment room at the spa", es: "Un masaje en una sala de tratamientos con vista al mar en el spa" } };
  const photo = (i: ImageRef, sizes: string, cls: string, imgCls = "") => (
    <div className={cn("relative overflow-hidden bg-travertine", cls)}>
      <Image src={i.src} alt={i.alt[locale] || i.alt.en} fill sizes={sizes} quality={82} className={cn("object-cover", imgCls)} style={{ objectPosition: i.focal }} />
    </div>
  );
  const facts = [
    { value: "10.6", label: es ? "Acres" : "Acres" },
    { value: "129", label: es ? "Residencias" : "Residences" },
    { value: "42", label: es ? "Suites de hotel" : "Hotel suites" },
    { value: "65,500", label: es ? "Pies² de amenidades" : "SF amenities" },
    { value: "30", label: es ? "Min al aeropuerto" : "Min to the airport" },
  ];
  const slides = [
    { image: cImg.diningPiano, caption: es ? "Comedor de doble altura" : "Double-height dining" },
    { image: cImg.livingStair, caption: es ? "Salón de dos niveles" : "Two-level living room" },
    { image: cImg.kitchenWine, caption: es ? "Cocina con gabinetes italianos" : "Kitchen with Italian cabinetry" },
    { image: cImg.bedroom, caption: es ? "Dormitorio y terraza" : "Bedroom and terrace" },
    { image: cImg.livingView, caption: es ? "Salón abierto" : "Open living room" },
    { image: cImg.lobbyMarble, caption: es ? "El vestíbulo" : "The lobby" },
  ];
  const places = cip.location.places.slice(0, 4).map((slug) => {
    const p = pointsOfInterest.find((q) => q.slug === slug)!;
    const walk = p.walkMinutes != null;
    return `${x(p.name)} · ${walk ? p.walkMinutes : p.driveMinutes} ${x(walk ? cip.location.walk : cip.location.drive)}`;
  });

  return (
    <>
      {/* 1 · The film, the logo large in the middle, "Schedule a private preview" at the bottom right. */}
      <section aria-label="ORA World · Tesoro del Mar" className="relative isolate flex h-[calc(100svh-33px)] min-h-[560px] items-center justify-center overflow-hidden text-white">
        <BHeroFilm alt={es ? "El jet de ORA World a su llegada, la primera escena de la película de Tesoro del Mar" : "The ORA World jet on arrival, the opening scene of the Tesoro del Mar film"} pauseLabel={es ? "Pausar la película" : "Pause the film"} playLabel={es ? "Reproducir la película" : "Play the film"} />
        <span aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_45%_40%_at_center,rgb(28_24_18/0.35),transparent_75%),linear-gradient(180deg,rgb(28_24_18/0.45),transparent_25%,transparent_80%,rgb(28_24_18/0.35))]" />
        <h1 className="flex flex-col items-center drop-shadow-[0_2px_18px_rgb(28_24_18/0.45)]">
          <Logo variant="white" height={240} responsive className="h-[150px] w-auto md:h-[220px]" />
          <span className="mt-6 text-[13px] font-semibold tracking-[0.34em] uppercase md:text-[15px]">Tesoro del Mar</span>
        </h1>
        <Link href="/e#inquire" className="absolute right-16 bottom-6 inline-flex min-h-11 items-center bg-basalt/90 px-5 text-[11px] font-semibold tracking-[0.2em] uppercase hover:bg-basalt md:right-20">
          {es ? "Agende una presentación privada" : "Schedule a private preview"}
        </Link>
      </section>

      {/* 2 · The sketch and the introduction. */}
      <section aria-label={es ? "Introducción" : "Introduction"} className="bg-bone px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-20">
          <ETowerSketch className="mx-auto w-full max-w-[340px] text-brass-ink" />
          <div className="text-[17px] leading-[1.75] md:text-[18px]">
            <p className="text-basalt">{es ? "Longevidad, lujo y naturaleza. Tres torres curvas sobre la costa norte de Puerto Rico." : "Longevity, luxury and nature. Three curved towers above Puerto Rico's north coast."}</p>
            <p className="mt-6 text-charcoal-soft">{x(cip.who.intro)} {x(cip.who.body)}</p>
          </div>
        </div>
      </section>

      {/* 3 · The aerial with the logo over it. */}
      <section aria-label={es ? "Tesoro del Mar desde el aire" : "Tesoro del Mar from the air"} className="relative isolate flex h-[82svh] min-h-[480px] items-center justify-center overflow-hidden text-white">
        <Image src={tdm.aerialCoast.src} alt={tdm.aerialCoast.alt[locale] || tdm.aerialCoast.alt.en} fill sizes="100vw" quality={82} className="-z-10 object-cover" style={{ objectPosition: tdm.aerialCoast.focal }} />
        <ClipOverlay src="/videos/clips/p08-aerial-cove.mp4" poster="/videos/clips/p08-aerial-cove-poster.jpg" className="-z-10" />
        <span aria-hidden className="absolute inset-0 -z-10 bg-[rgb(28_24_18/0.42)]" />
        <div className="flex flex-col items-center opacity-90">
          <Logo variant="white" height={200} responsive className="h-[120px] w-auto md:h-[170px]" />
        </div>
      </section>

      {/* 4 · The figures, on Deep Earth. */}
      <section aria-labelledby="e-figures" className="bg-basalt px-5 py-16 text-bone md:px-10 md:py-20">
        <p id="e-figures" className="text-center text-[13px] font-semibold tracking-[0.26em] uppercase">{es ? "Fase Uno · Torre 1" : "Phase One · Tower 1"}</p>
        <dl className="mx-auto mt-12 grid max-w-[1200px] grid-cols-2 gap-y-10 md:grid-cols-5">
          {facts.map((f, k) => (
            <div key={f.label} className={cn("text-center", k === 4 && "col-span-2 md:col-span-1")}>
              <dt className="sr-only">{f.label}</dt>
              <dd className="text-[30px] font-light [font-variant-numeric:lining-nums] md:text-[34px]">{f.value}</dd>
              <dd aria-hidden className="mt-2 text-[11.5px] tracking-[0.12em] text-bone/70">{f.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* 5 · The art of longevity, with the tree drawn large. */}
      <section aria-labelledby="e-art" className="bg-white px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-16">
          {/* eslint-disable-next-line @next/next/no-img-element -- the ORA tree, drawn large */}
          <img src="/brand/ora-world-tree.png" alt="" aria-hidden width={260} height={260} className="mx-auto w-[200px] opacity-90 md:w-[260px]" />
          <div className="text-center">
            <H2 id="e-art">{es ? "El arte de la longevidad" : "The art of longevity"}</H2>
            <p className="mx-auto mt-6 max-w-[56ch] text-[16.5px] leading-[1.75] text-charcoal-soft">
              {es
                ? "Un escaneo corporal completo, una entrevista sobre sus metas, nutricionistas en el equipo, una cocina que cocina para usted y un programa de ejercicio fácil. Todo pensado para que vivir más sea también vivir mejor."
                : "A total body scan, a personal interview about your goals, nutritionists on staff, a kitchen that cooks for you and an easy fitness program. Everything designed so that living longer also means living better."}
            </p>
            <TextLink href="/e/longevity">{es ? "Descubra el programa" : "Discover the program"}</TextLink>
          </div>
        </div>
      </section>

      {/* 6 · An inset photograph with words over it, then the quote. */}
      <section aria-labelledby="e-legacy" className="bg-bone px-5 pt-6 md:px-6">
        <div className="relative isolate flex min-h-[520px] items-center justify-center overflow-hidden px-5 py-20 text-center text-white md:min-h-[600px]">
          <Image src={spa.src} alt={spa.alt[locale] || spa.alt.en} fill sizes="100vw" quality={82} className="-z-10 object-cover grayscale" style={{ objectPosition: "50% 50%" }} />
          <span aria-hidden className="absolute inset-0 -z-10 bg-[rgb(28_24_18/0.45)]" />
          <div className="max-w-[560px]">
            <H2 id="e-legacy" light>{es ? "Longevidad incluida" : "Longevity, built in"}</H2>
            <p className="mt-5 text-[16px] leading-relaxed text-white/90">{x(cip.longevityPage.closing)} {es ? "ORA le revisa antes de que algo se rompa." : "ORA checks you before anything breaks."}</p>
            <TextLink href="/e/longevity" light>{es ? "Explore la longevidad" : "Explore longevity"}</TextLink>
          </div>
        </div>
        <figure className="mx-auto max-w-[900px] px-5 py-20 text-center md:py-24">
          <blockquote className="text-[22px] leading-[1.4] font-light tracking-[0.06em] text-basalt uppercase md:text-[30px]">
            “{es ? "¿Cuánto valen para usted 10 años más?" : "What is the value of an extra 10 years for you?"}”
          </blockquote>
          <figcaption className="mt-6 text-[11.5px] font-semibold tracking-[0.26em] uppercase">ORA World</figcaption>
        </figure>
      </section>

      {/* 7 · The residences: a full-width slideshow. */}
      <EGallery
        locale={locale}
        label={es ? "Las residencias" : "The residences"}
        slides={slides}
        text={es ? "Proporciones amplias, vistas sin interrupción y una paleta atemporal de materiales finos: gabinetes italianos, piedra sinterizada y grifería Dornbracht." : "Defined by generous proportions, uninterrupted views and a timeless palette of fine materials: Italian cabinetry, sintered stone and Dornbracht fixtures."}
      />

      {/* 8 · Signature service, on Deep Earth. */}
      <section aria-labelledby="e-service" className="bg-basalt px-5 py-20 text-bone md:px-10 md:py-24">
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] md:gap-20">
          <div>
            <H2 id="e-service" light>{es ? "Servicio de firma" : "Signature service"}</H2>
            <p className="mt-6 max-w-[56ch] text-[16.5px] leading-[1.75] text-bone/85">
              {es
                ? "Vuelos chárter privados entre Estados Unidos y su condominio, el auto de la casa esperándole, un vestíbulo con conserje de día y de noche, y un club privado de 14,000 pies². Cada llegada se siente personal."
                : "Private charter flights between the US and your condo, a house car waiting, a lobby with a concierge day and night, and a 14,000 sq ft private club. Every arrival feels personal."}
            </p>
            <TextLink href="/e#amenities" light>{es ? "Las amenidades" : "Experience the amenities"}</TextLink>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden bg-basalt-soft">
            <Image src={cImg.entrance.src} alt={cImg.entrance.alt[locale] || cImg.entrance.alt.en} fill sizes="(max-width: 767px) calc(100vw - 40px), 440px" quality={82} className="object-cover" style={{ objectPosition: "60% 50%" }} />
          </div>
        </div>
      </section>

      {/* 9 · A life of effortless ease: the title, a line, three photographs. */}
      <section id="amenities" aria-labelledby="e-life" className="scroll-mt-24 overflow-hidden bg-bone pt-20 md:pt-28">
        <div className="mx-auto grid max-w-[1200px] items-center gap-8 px-5 md:grid-cols-2 md:gap-20 md:px-10">
          <H2 id="e-life" className="md:text-center">{es ? "Una vida de elegancia sin esfuerzo" : "A life of effortless elegance"}</H2>
          <p className="max-w-[46ch] text-[16.5px] leading-[1.75] text-charcoal-soft">
            {es
              ? "Los días transcurren con calma. La piscina por la mañana, los jardines al mediodía, un masaje al atardecer y la cena frente al mar. Este es el ritmo de la vida en Tesoro del Mar."
              : "Days unfold with an ease that feels entirely natural. The pool in the morning, the gardens at noon, a massage at sunset and dinner facing the sea. This is the rhythm of life at Tesoro del Mar."}
          </p>
        </div>
        <div className="mt-16 grid grid-cols-[1fr_1.6fr_1fr] items-end gap-3 md:mt-20 md:gap-5">
          {photo(cImg.poolDeck, "33vw", "aspect-[4/3]")}
          {photo(cImg.towerPool, "50vw", "aspect-[4/3]")}
          {photo(spa, "33vw", "aspect-[4/3]")}
        </div>
      </section>

      {/* 10 · Act 60, on Deep Earth (in place of the press band). */}
      <section aria-labelledby="e-act" className="bg-basalt px-5 py-16 text-center text-bone md:px-10 md:py-20">
        <p id="e-act" className="text-[13px] font-semibold tracking-[0.26em] uppercase">{es ? "Ley 60 · Conserve más de lo que gana" : "Act 60 · Keep more of what you earn"}</p>
        <dl className="mx-auto mt-10 grid max-w-[1000px] gap-10 md:grid-cols-3">
          {cip.why.stats.map((st) => (
            <div key={st.value}>
              <dt className="sr-only">{x(st.label)}</dt>
              <dd className="text-[44px] font-light text-brass-light">{st.value}</dd>
              <dd aria-hidden className="mx-auto mt-2 max-w-[30ch] text-[13px] leading-relaxed text-bone/70">{x(st.label)}</dd>
            </div>
          ))}
        </dl>
        <p className="mx-auto mt-8 max-w-[80ch] text-[11.5px] text-bone/55">{es ? "Tasas de Puerto Rico bajo un decreto aprobado, no tasas federales de EE. UU. Información general, no asesoría fiscal ni legal." : "Puerto Rico rates under an approved decree, not US federal rates. General information, not tax or legal advice."}</p>
        <TextLink href="/e/act-60" light>{es ? "La Ley 60" : "Act 60"}</TextLink>
      </section>

      {/* 11 · The location, full bleed. */}
      <section id="location" aria-labelledby="e-loc" className="relative isolate flex min-h-[78svh] scroll-mt-24 items-center justify-center overflow-hidden px-5 py-24 text-center text-white md:px-10">
        <Image src={cImg.aerialTowers.src} alt={cImg.aerialTowers.alt[locale] || cImg.aerialTowers.alt.en} fill sizes="100vw" quality={82} className="-z-10 object-cover" style={{ objectPosition: "50% 50%" }} />
        <span aria-hidden className="absolute inset-0 -z-10 bg-[rgb(28_24_18/0.5)]" />
        <div className="max-w-[760px]">
          <h2 id="e-loc" className="font-[family-name:var(--font-sans)] text-[30px] leading-[1.2] font-light tracking-[0.1em] uppercase md:text-[44px]">{es ? "El tesoro de Dorado" : "The treasure of Dorado"}</h2>
          <p className="mt-6 text-[14px] leading-[1.8] tracking-[0.14em] uppercase md:text-[16px]">{x(cip.location.intro)}</p>
          <ul className="mt-8 grid gap-1 text-[13px] tracking-[0.08em] text-white/85">
            {places.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <TextLink href="/e#inquire" light>{es ? "Visítenos" : "Visit us"}</TextLink>
        </div>
      </section>

      {/* 12 · The split call: an appointment, a photograph, the longevity link. */}
      <section aria-label={es ? "Siguientes pasos" : "Next steps"} className="bg-white px-5 py-16 md:px-10 md:py-20">
        <div className="mx-auto grid max-w-[1200px] items-center gap-10 text-center md:grid-cols-3">
          <Link href="/e#inquire" className="mx-auto inline-block border-b border-basalt/60 pb-2 text-[20px] font-light tracking-[0.08em] uppercase hover:border-basalt md:text-[22px]">
            {es ? "Agende una cita privada" : "Schedule a private appointment"}
          </Link>
          {photo(cImg.bar, "(max-width: 767px) 70vw, 280px", "mx-auto aspect-square w-[70%] md:w-[240px]", "grayscale")}
          <Link href="/e/longevity" className="mx-auto inline-flex flex-col items-center gap-3 text-[20px] font-light tracking-[0.08em] uppercase md:text-[22px]">
            {es ? "Explore la longevidad" : "Explore longevity"} <span aria-hidden className="text-[26px]">→</span>
          </Link>
        </div>
      </section>

      {/* 13 · The inquiry. */}
      <section id="inquire" aria-labelledby="e-inq" className="scroll-mt-24 bg-bone px-5 py-20 md:px-10 md:py-24">
        <div className="mx-auto grid max-w-[1100px] gap-12 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-16">
          <div>
            <H2 id="e-inq">{es ? "Agende una presentación privada" : "Schedule a private preview"}</H2>
            <p className="mt-6 text-[16px] leading-[1.75] text-charcoal-soft">{es ? "En persona o por videollamada. Le enviaremos planos, precios y una introducción a Tesoro del Mar." : "In person or by video call. We will share floor plans, pricing and an introduction to Tesoro del Mar."}</p>
            {settings.phone && (
              <a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`} className="mt-6 inline-block text-[18px] tracking-[0.06em] hover:underline">
                {settings.phone}
              </a>
            )}
          </div>
          <div className="bg-white p-6 md:p-10">
            <LeadFormLazy variant="full" consentText={settings.consentText[locale]} submitLabel={es ? "Solicitar una presentación" : "Request a preview"} />
          </div>
        </div>
      </section>
    </>
  );
}
