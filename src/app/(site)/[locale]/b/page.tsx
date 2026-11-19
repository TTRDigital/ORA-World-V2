import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import type { ImageRef, L, Locale } from "@/content/types";
import { getSiteSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { t } from "@/lib/localize";
import { cip } from "@/content/seed/homeCip";
import { tdm } from "@/content/seed/images";
import { pointsOfInterest } from "@/content/seed/places";
import { ClipOverlay } from "@/components/ui/ClipOverlay";
import { LocationExplorer } from "@/components/cip/LocationExplorer";
import { FloorExplorer } from "@/components/cip/FloorExplorer";
import { LeadFormLazy } from "@/components/forms/LeadFormLazy";
import { Link } from "@/i18n/navigation";
import { ScrollStatement } from "@/components/v2/ScrollStatement";
import { BHeroFilm } from "@/components/v2/BHeroFilm";
import { InteriorsGallery } from "@/components/cip/InteriorsGallery";
import { interiorSlides } from "@/content/seed/interiorSlides";

/**
 * Version B (client, 18 Nov: "a second version of the site, like parksidebrickell.com, with ORA World's content and
 * films, so the client can choose"). One long page in that manner: a film with a giant wordmark, a cream statement band,
 * deep green chapters, full-bleed photographs with words over them, and an inquiry form. Same facts and approved copy as
 * Version A (Act 60 wording per the audit brief); none of Version A changes.
 */
const clip = (n: string) => ({ video: `/videos/clips/${n}.mp4`, poster: `/videos/clips/${n}-poster.jpg` });
const still = (src: string, w: number, h: number, en: string, es: string): ImageRef => ({ src, width: w, height: h, focal: "50% 50%", alt: { en, es }, rendering: true });

function Media({ image, locale, sizes, className = "", video = true }: { image: ImageRef; locale: Locale; sizes: string; className?: string; video?: boolean }) {
  return (
    <div className={`relative overflow-hidden bg-[var(--v2-green-2)] ${className}`}>
      <Image src={image.src} alt={image.alt[locale] || image.alt.en} fill sizes={sizes} quality={80} className="object-cover" style={{ objectPosition: image.focal }} />
      {video && image.video && <ClipOverlay src={image.video} poster={image.poster} focal={image.focal} />}
    </div>
  );
}

const Eyebrow = ({ children, light = false }: { children: React.ReactNode; light?: boolean }) => (
  <p className={`text-[11px] tracking-[0.32em] uppercase ${light ? "text-brass-light" : "text-brass-ink"}`}>{children}</p>
);

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const meta = pageMetadata({ locale, path: "/b", title: locale === "es" ? "Tesoro del Mar · Versión B" : "Tesoro del Mar · Version B", description: locale === "es" ? "ORA World en Dorado, Puerto Rico: donde vive la longevidad." : "ORA World in Dorado, Puerto Rico: where longevity lives." });
  return { ...meta, robots: { index: false, follow: false } };
}

export default async function VersionB({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const es = locale === "es";
  const x = (l: L) => t(l, locale);
  const settings = await getSiteSettings();


  const jet = { ...still("/videos/clips/jet-arrival-poster.jpg", 1632, 544, "The ORA World jet on the apron", "El jet de ORA World en la plataforma"), focal: "24% 60%", ...clip("jet-arrival") };
  const spa = { ...still("/videos/clips/spa-ocean-poster.jpg", 1248, 704, "An ocean-view treatment room at the spa", "Una sala de tratamientos con vista al mar en el spa"), ...clip("spa-ocean") };
  const lobby = { ...tdm.foyerAtrium, ...clip("lobby-combined") };

  const pillars = [
    { title: es ? "Longevidad incluida" : "Longevity, built in", text: es ? "Escaneo corporal completo, nutricionistas, una cocina fantasma y un programa de ejercicio fácil." : "A total body scan, nutritionists, a ghost kitchen and an easy fitness program.", image: tdm.gym },
    { title: es ? "El mar a su puerta" : "The sea at your door", text: es ? "Sobre una cala turquesa de la costa norte de Puerto Rico." : "Above a turquoise cove on Puerto Rico's north coast.", image: tdm.aerialCoast },
    { title: es ? "Todo, resuelto" : "Everything, made easy", text: es ? "Un vestíbulo atendido 24/7, el auto de la casa y vuelos chárter privados." : "A lobby attended 24/7, a house car and private charter flights.", image: lobby },
  ];
  const amenities = [
    { title: es ? "La piscina" : "The pool deck", text: es ? "Estilo resort, con solárium y bar." : "Resort-style, with sundeck and pool bar.", image: tdm.exteriorPull },
    { title: es ? "Campo de putting" : "Putting course", text: es ? "Dieciocho hoyos entre las torres." : "Eighteen holes between the towers.", image: tdm.exteriorGolf },
    { title: es ? "Gimnasio" : "Fitness", text: es ? "Gimnasio y estudio de pilates con vista al jardín." : "Fitness center and pilates studio with garden views.", image: tdm.gym },
    { title: "Spa", text: es ? "Masajes, tratamientos y salón, frente al mar." : "Massage, treatments and salon, facing the sea.", image: spa },
    { title: es ? "Vestíbulo" : "The lobby", text: es ? "Doble altura, atendido 24/7." : "Double height, attended 24/7.", image: lobby },
    { title: es ? "Llegada privada" : "Private arrival", text: es ? "Vuelos chárter privados y el auto de la casa." : "Private charter flights and a house car.", image: jet },
    { title: es ? "El club" : "The clubhouse", text: es ? "Un club privado de 14,000 pies²." : "A members-only club of 14,000 sq ft.", image: tdm.foyerLounge },
    { title: es ? "La entrada" : "The entrance", text: es ? "Pórtico y valet bajo las torres." : "Porte-cochère and valet beneath the towers.", image: tdm.entrance },
  ];
  const facts = [
    { label: es ? "Ubicación" : "Location", value: "Dorado · Vega Alta" },
    { label: es ? "Residencias" : "Residences", value: "129" },
    { label: es ? "Suites de hotel" : "Hotel suites", value: "42" },
    { label: es ? "Amenidades" : "Amenities", value: es ? "65,500 pies²" : "65,500 sq ft" },
  ];

  return (
    <>

      {/* 1 · The film and the wordmark */}
      <section aria-label="Tesoro del Mar" className="relative isolate flex h-[100svh] min-h-[620px] flex-col items-center justify-center overflow-hidden text-white">
        <BHeroFilm alt={es ? "Tesoro del Mar desde el aire, sobre una cala de la costa norte de Puerto Rico" : "Tesoro del Mar from the air, above a cove on the north coast of Puerto Rico"} pauseLabel={es ? "Pausar la película" : "Pause the film"} playLabel={es ? "Reproducir la película" : "Play the film"} />
        {/* Client, 18 Nov: the film bright, as on Version A: only a soft shade behind the words and under the header. */}
        <span aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_40%_at_center,rgb(28_24_18/0.32),transparent_75%),linear-gradient(180deg,rgb(28_24_18/0.5),transparent_24%,transparent_82%,rgb(28_24_18/0.3))]" />
        <p className="hero-fade px-5 text-center text-[10px] tracking-[0.3em] uppercase opacity-90 md:text-[11px] md:tracking-[0.42em]">ORA World · Dorado, Puerto Rico</p>
        <h1 className="hero-fade mt-6 px-5 text-center [text-shadow:0_2px_30px_rgb(28_24_18/0.35)] font-[family-name:var(--font-display)] text-[64px] leading-[0.92] font-normal tracking-[0.02em] md:text-[120px] lg:text-[150px]" style={{ animationDelay: "200ms" }}>
          Tesoro del Mar
        </h1>
        <p className="hero-fade mt-6 text-[13px] tracking-[0.3em] uppercase opacity-90" style={{ animationDelay: "400ms" }}>
          {es ? "Donde vive la longevidad" : "Where longevity lives"}
        </p>
        <a href="#about" className="absolute bottom-8 flex flex-col items-center gap-2 text-[10px] tracking-[0.32em] uppercase opacity-85">
          {es ? "Desplácese" : "Scroll to explore"}
          <span aria-hidden className="scroll-cue-arrow">↓</span>
        </a>
      </section>

      {/* 2 · The statement band */}
      <section id="about" aria-label={es ? "Nosotros" : "About"} className="scroll-mt-24 lg:scroll-mt-28">
        <ScrollStatement lines={es ? ["Más allá de lo esperado.", "Donde vive la longevidad."] : ["Beyond expectations.", "Where longevity lives."]} />
      </section>

      {/* 3 · Why ORA World, on deep green */}
      <section aria-labelledby="b-why" className="bg-[var(--v2-green)] px-5 py-20 text-[var(--v2-cream)] md:px-10 md:py-28">
        <div className="mx-auto max-w-[1440px]">
          <Eyebrow light>{es ? "Por qué ORA World" : "Why ORA World"}</Eyebrow>
          <h2 id="b-why" className="mt-6 max-w-[16ch] font-[family-name:var(--font-display)] text-[40px] leading-[1.06] font-normal md:text-[64px]">
            {es ? "Creamos una vida más larga y mejor." : "We set out to create a longer, better life."}
          </h2>
          <p className="mt-6 max-w-[56ch] text-[16px] leading-relaxed text-[var(--v2-cream)]/75 md:text-[17px]">
            {es ? "Tres ideas guían cada detalle: la longevidad incluida, el mar a su puerta y una vida en la que todo es fácil." : "Three ideas shape every detail: longevity built in, the sea at your door, and a life where everything is made easy."}
          </p>
          <ul className="mt-12 grid gap-10 md:mt-14 md:grid-cols-3 md:gap-5">
            {pillars.map((p) => (
              <li key={p.title}>
                <Media image={p.image} locale={locale} sizes="(max-width: 767px) calc(100vw - 40px), 460px" className="aspect-[4/3] md:aspect-[4/5]" />
                <h3 className="mt-5 font-[family-name:var(--font-display)] text-[28px] leading-tight">{p.title}</h3>
                <p className="mt-2 max-w-[38ch] text-[14.5px] leading-relaxed text-[var(--v2-cream)]/70">{p.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4 · Life here feels different (polish, 19 Nov): one centred line over the penthouse film, no list (it repeated
          the amenities below). */}
      <section aria-labelledby="b-diff" className="relative isolate flex min-h-[78svh] items-center justify-center overflow-hidden px-5 py-24 text-center text-white md:px-10">
        <Media image={{ ...tdm.penthouseLiving, ...clip("p24-penthouse-living") }} locale={locale} sizes="100vw" className="!absolute inset-0 -z-10" />
        <span aria-hidden className="absolute inset-0 -z-10 bg-[rgb(28_24_18/0.55)]" />
        <div className="max-w-[900px] [text-shadow:0_2px_24px_rgb(28_24_18/0.4)]">
          <Eyebrow light>{es ? "La diferencia ORA" : "The ORA difference"}</Eyebrow>
          <h2 id="b-diff" className="mt-6 font-[family-name:var(--font-display)] text-[44px] leading-[1.05] font-normal md:text-[80px]">
            {es ? "Vivir aquí se siente distinto." : "Life here feels different."}
          </h2>
          <p className="mx-auto mt-6 max-w-[46ch] text-[16px] leading-relaxed text-white/85 md:text-[18px]">
            {es ? "Un vestíbulo atendido 24/7, una cocina que cocina para usted y un sendero de dos millas junto a un parque nacional." : "A lobby attended 24/7, a kitchen that cooks for you, and a two-mile garden path beside a national park."}
          </p>
        </div>
      </section>

      {/* 5 · Amenities, on deep green */}
      <section id="amenities" aria-labelledby="b-amen" className="scroll-mt-24 lg:scroll-mt-28 bg-bone px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1440px]">
          <Eyebrow>{es ? "Amenidades" : "Amenities"}</Eyebrow>
          <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end md:gap-16">
            <h2 id="b-amen" className="max-w-[16ch] font-[family-name:var(--font-display)] text-[40px] leading-[1.06] font-normal md:text-[64px]">
              {es ? "Cada amenidad, pensada para una vida más larga." : "Every amenity, designed for a longer life."}
            </h2>
            <p className="max-w-[48ch] text-[16px] leading-relaxed text-charcoal-soft md:text-[17px]">
              {es ? "Más de 65,000 pies² de amenidades, dentro y fuera, a pocos pasos de su puerta." : "Over 65,000 sq ft of amenities, indoors and out, a short walk from your door."}
            </p>
          </div>
          <ul className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-4">
            {amenities.map((a) => (
              <li key={a.title}>
                <Media image={a.image} locale={locale} sizes="(max-width: 1023px) calc(50vw - 28px), 340px" className="aspect-[3/4]" />
                <h3 className="mt-4 font-[family-name:var(--font-display)] text-[22px] leading-tight md:text-[26px]">{a.title}</h3>
                <p className="mt-1 text-[13.5px] leading-relaxed text-charcoal-soft md:text-[14.5px]">{a.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6 · Longevity, a full-bleed quote over the gym film */}
      <section id="longevity" aria-labelledby="b-long" className="relative isolate flex min-h-[86svh] scroll-mt-24 lg:scroll-mt-28 items-center justify-center overflow-hidden px-5 py-24 text-center text-white md:px-10">
        <Media image={{ ...tdm.gym, ...clip("p14-gym") }} locale={locale} sizes="100vw" className="!absolute inset-0 -z-10" />
        <span aria-hidden className="absolute inset-0 -z-10 bg-[rgb(28_24_18/0.55)]" />
        <div className="max-w-[920px]">
          <Eyebrow light>{es ? "La longevidad es una forma de vivir" : "Longevity is a way of living"}</Eyebrow>
          <h2 id="b-long" className="mt-6 font-[family-name:var(--font-display)] text-[40px] leading-[1.1] font-normal md:text-[64px]">
            {es ? "La longevidad es la base de nuestro mundo." : "Longevity is the foundation of our world."}
          </h2>
          <p className="mt-8 font-[family-name:var(--font-display)] text-[26px] text-brass-light italic md:text-[32px]">
            “{es ? "¿Cuánto valen para usted 10 años más?" : "What is the value of an extra 10 years for you?"}”
          </p>
          <Link href="/longevity" className="mt-10 inline-flex min-h-11 items-center border border-white/70 px-6 text-[11px] tracking-[0.26em] uppercase hover:bg-white hover:text-[var(--v2-green)]">
            {es ? "El programa ORA" : "The ORA program"}
          </Link>
        </div>
      </section>

      {/* 7 · Location, on cream */}
      <section id="location" aria-labelledby="b-loc" className="scroll-mt-24 lg:scroll-mt-28 bg-bone-deep px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1440px]">
          <Eyebrow>{es ? "La ubicación" : "The location"}</Eyebrow>
          <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end md:gap-16">
            <h2 id="b-loc" className="max-w-[14ch] font-[family-name:var(--font-display)] text-[40px] leading-[1.06] font-normal md:text-[64px]">
              {es ? <>Todo lo que ama de Dorado. <em className="italic">A pasos de casa.</em></> : <>Everything you love about Dorado. <em className="italic">Steps from home.</em></>}
            </h2>
            <div>
              <p className="text-[11px] tracking-[0.26em] uppercase opacity-70">{x(cip.location.address)}</p>
              <p className="mt-3 max-w-[48ch] text-[16px] leading-relaxed opacity-80 md:text-[17px]">{x(cip.location.intro)}</p>
            </div>
          </div>
          <div className="mt-12">
            <LocationExplorer
              site={{ lat: settings.siteLat, lng: settings.siteLng, name: "ORA World · Tesoro Del Mar" }}
              mapLabel={x(cip.location.mapLabel)}
              note={x(cip.location.note)}
              places={cip.location.places.map((slug) => {
                const p = pointsOfInterest.find((q) => q.slug === slug)!;
                const walk = p.walkMinutes != null;
                return { slug, name: x(p.name), lat: p.lat, lng: p.lng, time: `${walk ? p.walkMinutes : p.driveMinutes} ${x(walk ? cip.location.walk : cip.location.drive)}${p.confirmed ? "" : "*"}` };
              })}
            />
          </div>
        </div>
      </section>

      {/* 8 · Act 60, on deep green (the audit brief's approved wording) */}
      <section id="act-60" aria-labelledby="b-act" className="scroll-mt-24 lg:scroll-mt-28 bg-[var(--v2-green)] px-5 py-20 text-[var(--v2-cream)] md:px-10 md:py-28">
        <div className="mx-auto max-w-[1440px]">
          <Eyebrow light>{es ? "Ley 60 · Puerto Rico" : "Act 60 · Puerto Rico"}</Eyebrow>
          <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end md:gap-16">
            <h2 id="b-act" className="font-[family-name:var(--font-display)] text-[40px] leading-[1.06] font-normal md:text-[64px]">{es ? "Conserve más de lo que gana." : "Keep more of what you earn."}</h2>
            <p className="max-w-[52ch] text-[16px] leading-relaxed text-[var(--v2-cream)]/75">{x(cip.why.short)}</p>
          </div>
          <dl className="mt-14 grid gap-10 border-t border-[var(--v2-cream)]/20 pt-10 sm:grid-cols-3">
            {cip.why.stats.map((st) => (
              <div key={st.value}>
                <dt className="sr-only">{x(st.label)}</dt>
                <dd className="font-[family-name:var(--font-display)] text-[72px] leading-none text-brass-light [font-variant-numeric:lining-nums] md:text-[96px]">{st.value}</dd>
                <dd aria-hidden className="mt-3 max-w-[32ch] text-[14px] leading-relaxed text-[var(--v2-cream)]/70">{x(st.label)}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 max-w-[90ch] text-[12.5px] leading-relaxed text-[var(--v2-cream)]/55">{x(cip.why.statsNote)} {x(cip.why.note)}</p>
          <Link href="/act-60" className="mt-8 inline-flex min-h-11 items-center border border-[var(--v2-cream)]/60 px-6 text-[11px] tracking-[0.26em] uppercase hover:bg-[var(--v2-cream)] hover:text-[var(--v2-green)]">
            {es ? "La Ley 60, en detalle" : "Act 60, in detail"}
          </Link>
        </div>
      </section>

      {/* 9 · The residences (client, 18 Nov: "do this in Version B too"): the Inspired living spaces slides, with the
          Version B type: centred heading, the counter and arrows under it, the films running off the right edge. */}
      <section id="residences" aria-labelledby="b-res" className="scroll-mt-24 lg:scroll-mt-28 overflow-hidden py-20 md:py-28">
        <div className="mx-auto max-w-[1440px] px-5 text-center md:px-10">
          <Eyebrow>{x(cip.interiors.eyebrow)}</Eyebrow>
          <h2 id="b-res" className="mx-auto mt-6 max-w-[20ch] font-[family-name:var(--font-display)] text-[40px] leading-[1.08] font-normal md:text-[64px]">
            {x(cip.interiors.title)}
          </h2>
          <p className="mx-auto mt-6 max-w-[54ch] text-[16px] leading-relaxed opacity-80 md:text-[17px]">{x(cip.interiors.intro)}</p>
        </div>
        <div className="b-interiors mx-auto mt-12 grid max-w-[1440px] justify-items-center gap-8 pl-5 md:pl-10">
          <InteriorsGallery locale={locale} label={x(cip.interiors.title)} prevLabel={es ? "Imagen anterior" : "Previous image"} nextLabel={es ? "Imagen siguiente" : "Next image"} slides={interiorSlides(es)} />
        </div>
        <p className="mt-12 text-center">
          <Link href="/finishes" className="inline-flex min-h-11 items-center border-b border-current text-[11px] tracking-[0.26em] uppercase opacity-80 hover:opacity-100">
            {es ? "Descubra los acabados" : "Discover the finishes"}
          </Link>
        </p>
      </section>

      {/* Floor plans (client, 18 Nov: "put the floor plan like Version A"): the same explorer. */}
      <section id="floor-plans" aria-labelledby="b-plans" className="scroll-mt-24 lg:scroll-mt-28 bg-bone-deep px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1440px]">
          <Eyebrow>{es ? "Planos · Torre 1" : "Floor plans · Tower 1"}</Eyebrow>
          <div className="mt-6 mb-10 flex flex-wrap items-end justify-between gap-4">
            <h2 id="b-plans" className="font-[family-name:var(--font-display)] text-[40px] leading-[1.06] font-normal md:text-[64px]">{x(cip.explorer.title)}</h2>
            <p className="text-[12px] tracking-[0.24em] uppercase opacity-75">
              {x(cip.plans.startingFrom)} <span className="font-[family-name:var(--font-display)] text-[24px] tracking-normal normal-case">{cip.plans.tiers[0].value}</span> {x(cip.plans.perSqFt)}
            </p>
          </div>
          <FloorExplorer locale={locale} />
        </div>
      </section>

      {/* 10 · Inquire */}
      <section id="inquire" aria-labelledby="b-inq" className="scroll-mt-24 lg:scroll-mt-28 bg-bone px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <div>
            <Eyebrow>{es ? "Consultar" : "Inquire"}</Eyebrow>
            <h2 id="b-inq" className="mt-6 font-[family-name:var(--font-display)] text-[40px] leading-[1.06] font-normal md:text-[56px]">{es ? "Registre su interés." : "Register your interest."}</h2>
            <p className="mt-6 max-w-[40ch] text-[16px] leading-relaxed opacity-80">
              {es ? "Déjenos sus datos y nuestro equipo le contactará con disponibilidad, precios y visitas privadas." : "Leave your details and our team will be in touch with availability, pricing and private appointments."}
            </p>
          </div>
          <div className="bg-white p-6 shadow-[0_1px_0_rgb(44_36_22/0.06),0_24px_60px_-30px_rgb(44_36_22/0.25)] md:p-10">
            <LeadFormLazy variant="full" consentText={settings.consentText[locale]} submitLabel={es ? "Enviar" : "Send request"} />
          </div>
        </div>
      </section>

      {/* 11 · A quiet coast: the closing call */}
      <section aria-labelledby="b-close" className="relative isolate overflow-hidden px-5 pt-28 pb-12 text-center text-white md:px-10 md:pt-40">
        <Media image={tdm.exteriorRoad} locale={locale} sizes="100vw" className="!absolute inset-0 -z-10" />
        <span aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(28_24_18/0.35),rgb(28_24_18/0.7))]" />
        <Eyebrow light>{es ? "Venga a casa, a ORA World" : "Come home to ORA World"}</Eyebrow>
        <h2 id="b-close" className="mx-auto mt-6 max-w-[16ch] font-[family-name:var(--font-display)] text-[40px] leading-[1.08] font-normal md:text-[64px]">
          {es ? "Una costa tranquila. Una vida más larga." : "A quiet coast. A longer life."}
        </h2>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a href="#inquire" className="inline-flex min-h-11 items-center bg-brass px-6 text-[11px] tracking-[0.26em] text-[var(--v2-green)] uppercase hover:bg-brass-light">
            {es ? "Consultar" : "Inquire"}
          </a>
          <Link href="/residences/plans" className="inline-flex min-h-11 items-center border border-white/70 px-6 text-[11px] tracking-[0.26em] uppercase hover:bg-white hover:text-[var(--v2-green)]">
            {es ? "Ver planos" : "View floor plans"}
          </Link>
        </div>
        <dl className="mx-auto mt-20 grid max-w-[1100px] grid-cols-2 gap-6 border-t border-white/25 pt-8 md:grid-cols-4">
          {facts.map((f) => (
            <div key={f.label}>
              <dt className="text-[10.5px] tracking-[0.28em] text-white/70 uppercase">{f.label}</dt>
              <dd className="mt-2 font-[family-name:var(--font-display)] text-[22px]">{f.value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
