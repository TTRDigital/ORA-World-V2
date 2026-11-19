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
import { LeadFormLazy } from "@/components/forms/LeadFormLazy";
import { BHeroFilm } from "@/components/v2/BHeroFilm";
import { CTitle, CEyebrow, CHeading, CList, CLink, CButton, CStats, CQuote } from "@/components/v3/C";
import { CSlider } from "@/components/v3/CSlider";
import { CReel } from "@/components/v3/CReel";

/**
 * Version C (client, 19 Nov: "build version 3 like ciprianiresidences-brickell.com; just the homepage banner with
 * video and the rest images I shared"). The reference's grammar in ORA's palette: a film banner with the title at the
 * bottom left, a figures strip, an introduction with an index and two offset photographs, a quote band, a residences
 * slider, amenity cards, a full-bleed band, location with travel times, and a split private-presentation form. Same
 * facts and approved copy as Version A (Act 60 per the audit brief).
 */
export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const meta = pageMetadata({ locale, path: "/c", title: locale === "es" ? "Tesoro del Mar · Versión C" : "Tesoro del Mar · Version C", description: locale === "es" ? "ORA World en Dorado, Puerto Rico: una vida para atesorar." : "ORA World in Dorado, Puerto Rico: a life to treasure." });
  return { ...meta, robots: { index: false, follow: false } };
}

export default async function VersionC({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const es = locale === "es";
  const x = (l: L) => t(l, locale);
  const settings = await getSiteSettings();
  // Photographs only below the banner: the stills, never their films.
  const still = (i: ImageRef): ImageRef => ({ src: i.src, width: i.width, height: i.height, focal: i.focal, alt: i.alt, rendering: i.rendering });
  const spa: ImageRef = { ...still(life.spa), src: "/videos/clips/spa-ocean-poster.jpg", width: 1248, height: 704, focal: "50% 50%", alt: { en: "An ocean-view treatment room at the spa", es: "Una sala de tratamientos con vista al mar en el spa" } };
  const tel = settings.phone ? `tel:${settings.phone.replace(/[^\d+]/g, "")}` : undefined;

  const stats = [
    { value: "14,000", unit: es ? "pies²" : "sf", label: es ? "Club privado" : "Private clubhouse" },
    { value: "18", label: es ? "Hoyos de putting" : "Hole putting course" },
    { value: "3", label: es ? "Piscinas de nado" : "Lap pools" },
    { value: "2", unit: es ? "mi" : "mi", label: es ? "Sendero entre jardines" : "Garden walking path" },
    { value: "30", unit: "min", label: es ? "A San Juan y su aeropuerto" : "To San Juan and its airport" },
  ];
  const reel = [
    { href: "/c/floor-plans", label: es ? "Las residencias" : "The residences", title: es ? "Espacios de doble altura frente al mar" : "Double-height rooms facing the sea", image: cImg.diningPiano },
    { href: "/c/longevity", label: es ? "Longevidad" : "Longevity", title: es ? "Una vida más larga y mejor" : "A longer, better life", image: spa },
    { href: "/c/longevity", label: es ? "Ejercicio" : "Fitness", title: es ? "Un programa que lo hace fácil" : "A program that makes it easy", image: { ...still(tdm.gym), focal: "70% 50%" } },
    { href: "/c/act-60", label: es ? "Ley 60" : "Act 60", title: es ? "Conserve más de lo que gana" : "Keep more of what you earn", image: cImg.aerialCove },
    { href: "/c/finishes", label: es ? "Acabados" : "Finishes", title: es ? "Gabinetes italianos, grifería Dornbracht" : "Italian cabinetry, Dornbracht fixtures", image: cImg.kitchenWine },
  ];
  const R = es ? "Residencias" : "Residences";
  const PH = "Penthouse";
  const slides = [
    { image: cImg.diningPiano, caption: es ? "Un comedor de doble altura frente al mar" : "A double-height dining room facing the sea", tag: PH },
    { image: cImg.livingStair, caption: es ? "El salón de dos niveles, con escalera flotante" : "The two-level living room, with its floating stair", tag: PH },
    { image: cImg.kitchenWine, caption: es ? "Una cocina con gabinetes italianos y cava de vidrio" : "A kitchen with Italian cabinetry and a glass wine wall", tag: R },
    { image: cImg.livingView, caption: es ? "Un salón abierto, de piso a techo en vidrio" : "An open living room, glass from floor to ceiling", tag: R },
    { image: cImg.bedroom, caption: es ? "Un dormitorio que se abre a la terraza" : "A bedroom opening onto the terrace", tag: R },
    { image: cImg.kitchenIsland, caption: es ? "Una cocina con isla de mármol" : "A kitchen with a marble island", tag: R },
    { image: cImg.livingSofa, caption: es ? "Un salón con cava de vidrio" : "A living room with a glass wine room", tag: R },
    { image: cImg.bar, caption: es ? "Una barra de mármol junto a la escalera" : "A marble bar beside the stair", tag: PH },
    { image: still(tdm.masterSuite), caption: es ? "La suite principal" : "The primary suite", tag: R },
    { image: still(tdm.aptBath2), caption: es ? "El baño principal, con grifería Dornbracht" : "The primary bath, with Dornbracht fixtures", tag: R },
  ];
  const cards = [
    { image: cImg.clubhousePool, label: es ? "Salón, café, simulador de golf" : "Lounge, café, golf simulator", title: es ? "El club" : "The clubhouse" },
    { image: cImg.poolDeck, label: es ? "Piscinas, cabañas, bar" : "Lap pools, cabanas, pool bar", title: es ? "La terraza de la piscina" : "Resort deck" },
    { image: spa, label: es ? "Spa, sauna, tratamientos" : "Spa, sauna, treatments", title: es ? "Bienestar" : "Wellness" },
    { image: still(tdm.gym), label: es ? "Gimnasio y pilates" : "Fitness center and pilates", title: es ? "Ejercicio" : "Fitness" },
    { image: still(tdm.exteriorGolf), label: es ? "Dieciocho hoyos entre las torres" : "Eighteen holes among the towers", title: es ? "Campo de putting" : "Putting course" },
  ];
  const lists = [
    {
      title: es ? "Amenidades" : "Amenities",
      items: es
        ? ["Tenis", "Pickleball", "Vóleibol", "Baloncesto", "Golf", "Simulador de golf", "Piscinas estilo resort", "Solárium con sombra", "Cabañas de playa", "Paseos de madera", "Deportes acuáticos"]
        : ["Tennis", "Pickleball", "Volleyball", "Basketball", "Golf", "Golf simulator", "Resort-style pools", "Shaded sundecks", "Beach cabanas", "Boardwalks", "Watersports"],
    },
    {
      title: es ? "Centro para una vida óptima" : "Center for Optimal Living",
      items: es ? ["Gimnasio de última generación", "Spa y sauna", "Piscinas de hidroterapia", "Jardines paisajísticos", "Espacios del club", "Centro de negocios"] : ["State-of-the-art fitness", "Spa and sauna", "Hydrotherapy pools", "Landscaped gardens", "Clubhouse spaces", "Business center"],
    },
  ];
  const places = cip.location.places.map((slug) => {
    const p = pointsOfInterest.find((q) => q.slug === slug)!;
    const walk = p.walkMinutes != null;
    return { label: x(p.name), value: `${walk ? p.walkMinutes : p.driveMinutes} ${x(walk ? cip.location.walk : cip.location.drive)}${p.confirmed ? "" : "*"}` };
  });
  const photo = (i: ImageRef, sizes: string, cls: string) => (
    <div className={`relative overflow-hidden bg-travertine ${cls}`}>
      <Image src={i.src} alt={i.alt[locale] || i.alt.en} fill sizes={sizes} quality={82} className="object-cover" style={{ objectPosition: i.focal }} />
    </div>
  );

  return (
    <>
      {/* The banner: the v4 film (the only film on Version C), the title at the bottom left, three buttons. */}
      <section aria-label="Tesoro del Mar" className="relative isolate flex min-h-[100svh] items-end overflow-hidden px-5 pt-40 pb-16 text-white md:px-10 md:pb-20">
        <BHeroFilm alt={es ? "El jet de ORA World a su llegada, la primera escena de la película de Tesoro del Mar" : "The ORA World jet on arrival, the opening scene of the Tesoro del Mar film"} pauseLabel={es ? "Pausar la película" : "Pause the film"} playLabel={es ? "Reproducir la película" : "Play the film"} />
        <span aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(28_24_18/0.4),transparent_28%,transparent_45%,rgb(28_24_18/0.72))]" />
        <div className="mx-auto w-full max-w-[1440px]">
          <p className="text-[11.5px] font-semibold tracking-[0.3em] uppercase opacity-90">Vega Alta · Dorado, Puerto Rico</p>
          <h1 className="mt-4 [text-shadow:0_2px_24px_rgb(28_24_18/0.3)]">
            <span className="block font-[family-name:var(--font-sans)] text-[44px] leading-[1.02] font-extralight tracking-[0.1em] uppercase md:text-[84px]">Tesoro del Mar</span>
            <em className="mt-1 block font-[family-name:var(--font-display)] text-[30px] leading-tight font-medium italic md:text-[44px]">{es ? "Una vida para atesorar" : "A life to treasure"}</em>
          </h1>
          <div className="mt-8 flex flex-wrap gap-3">
            <CButton href="/c#inquire" variant="white">
              {es ? "Agende una presentación" : "Schedule a presentation"} <span aria-hidden>→</span>
            </CButton>
            <CButton href="/c/floor-plans" variant="outline-light">
              {es ? "Planos" : "Floor plans"}
            </CButton>
            <CButton href="/c/act-60" variant="outline-light">
              {es ? "Ley 60" : "Act 60"}
            </CButton>
          </div>
        </div>
      </section>

      {/* The figures. */}
      <section aria-label={es ? "En cifras" : "In figures"} className="bg-white px-5 md:px-10">
        <CStats items={stats} />
      </section>

      {/* Introduction (client, 19 Nov: "on the right, a slice that goes by itself every two seconds, like flashcards"):
          the words, then the index beside a panel that slides through its cards on its own. */}
      <section aria-labelledby="c-intro" className="bg-white px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1200px]">
          <div className="max-w-[760px]">
            <CEyebrow>Tesoro del Mar</CEyebrow>
            <CTitle id="c-intro" caps={es ? "Donde vive" : "Where longevity"} accent={es ? "la longevidad" : "lives"} className="mt-5 text-[34px] leading-[1.15] md:text-[46px]" />
            <p className="mt-6 text-[16px] leading-[1.75] text-charcoal-soft md:text-[17px]">{x(cip.who.intro)}</p>
            <p className="mt-4 text-[16px] leading-[1.75] text-charcoal-soft md:text-[17px]">{x(cip.who.body)}</p>
          </div>
          <div className="mt-12">
            <CReel locale={locale} items={reel} />
          </div>
        </div>
      </section>

      <CQuote text={es ? "La salud no es un lujo: es la base de todo." : "Health isn't a luxury. It's the foundation of everything."} by={es ? "Bienestar total · ORA World" : "Total well-living · ORA World"} />

      {/* The residences: the slider. */}
      <section aria-labelledby="c-res" className="overflow-hidden bg-white px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1200px]">
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <CHeading id="c-res" eyebrow={es ? "Residencias" : "Residences"} caps={es ? "Espacios" : "Inspired"} accent={es ? "inspirados" : "living spaces"} intro={x(cip.interiors.intro)} />
          </div>
          <div className="mt-10">
            <CSlider slides={slides} locale={locale} label={x(cip.interiors.title)} prev={es ? "Imagen anterior" : "Previous image"} next={es ? "Imagen siguiente" : "Next image"} />
          </div>
          <div className="mt-10">
            <CButton href="/c/floor-plans" variant="outline">
              {es ? "Descubra las residencias" : "Discover the residences"} <span aria-hidden>→</span>
            </CButton>
          </div>
        </div>
      </section>

      {/* Amenities: two offset photographs and the words, then five cards. */}
      <section id="amenities" aria-labelledby="c-amen" className="scroll-mt-24 bg-bone px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1200px]">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-20">
            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] items-end gap-4">
              {photo(cImg.entrance, "(max-width: 1023px) 52vw, 320px", "aspect-[4/5]")}
              {photo(cImg.lobbyGarden, "(max-width: 1023px) 44vw, 260px", "mb-[-3rem] aspect-[3/4]")}
            </div>
            <div>
              <CEyebrow>{es ? "Amenidades" : "Amenities"}</CEyebrow>
              <CTitle id="c-amen" caps={es ? "Amenidades excepcionales" : "Exceptional amenities"} accent={es ? "y experiencias a medida" : "& bespoke experiences"} className="mt-5 text-[34px] leading-[1.15] md:text-[44px]" />
              <p className="mt-6 text-[16px] leading-[1.75] text-charcoal-soft md:text-[17px]">
                {es ? "ORA World se centra en la longevidad y la calidad de vida, con amenidades modernas, atención médica, educación y entretenimiento a mano." : "ORA World focuses on longevity and quality of life, with modern amenities, healthcare, education and entertainment close at hand."}
              </p>
              <p className="mt-4 text-[16px] leading-[1.75] text-charcoal-soft md:text-[17px]">
                {es ? "En su centro, un club privado de 14,000 pies² con café, restaurante, spa de bienestar, gimnasio y bar en la azotea." : "At its heart, a 14,000 sq ft private clubhouse with a café, restaurant, wellness spa, gym and rooftop bar."}
              </p>
              <CLink href="/c/longevity" className="mt-8">
                {es ? "Explore la longevidad" : "Explore longevity"}
              </CLink>
            </div>
          </div>
          <ul className="mt-24 grid gap-4 md:grid-cols-6">
            {cards.map((c, k) => (
              <li key={c.title} className={k < 2 ? "md:col-span-3" : "md:col-span-2"}>
                <div className={`relative isolate overflow-hidden bg-travertine ${k < 2 ? "aspect-[4/3]" : "aspect-[4/5]"}`}>
                  <Image src={c.image.src} alt={c.image.alt[locale] || c.image.alt.en} fill sizes={k < 2 ? "(max-width: 767px) calc(100vw - 40px), 590px" : "(max-width: 767px) calc(100vw - 40px), 390px"} quality={82} className="-z-10 object-cover" style={{ objectPosition: c.image.focal }} />
                  <span aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,transparent_50%,rgb(28_24_18/0.75))]" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white md:p-6">
                    <p className="text-[10.5px] font-semibold tracking-[0.24em] uppercase opacity-90">{c.label}</p>
                    <h3 className="mt-1 font-[family-name:var(--font-display)] text-[26px] leading-tight font-medium md:text-[30px]">{c.title}</h3>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Bespoke experiences: the presentation's lists beside its lifestyle photographs. */}
      <section aria-labelledby="c-life" className="bg-white px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-[1200px] gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-20">
          <div>
            <CEyebrow>{es ? "Experiencias" : "Experiences"}</CEyebrow>
            <CTitle id="c-life" caps={es ? "La vida," : "Life,"} accent={es ? "más allá de la residencia" : "beyond the residence"} className="mt-5 text-[34px] leading-[1.15] md:text-[44px]" />
            <div className="mt-10 grid gap-10 sm:grid-cols-2">
              {lists.map((l) => (
                <div key={l.title}>
                  <p className="text-[12px] font-semibold tracking-[0.22em] text-brass-ink uppercase">{l.title}</p>
                  <ul className="mt-4 border-t border-travertine-deep">
                    {l.items.map((it) => (
                      <li key={it} className="border-b border-travertine-deep py-2.5 text-[15.5px] text-charcoal">
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,0.75fr)] items-start gap-4">
            {photo(cImg.lobbyMarble, "(max-width: 1023px) 54vw, 360px", "aspect-[3/4]")}
            {photo(cImg.poolDeck, "(max-width: 1023px) 40vw, 270px", "mt-16 aspect-[3/4]")}
          </div>
        </div>
      </section>

      {/* Longevity: a full-bleed band. */}
      <section aria-labelledby="c-long" className="relative isolate overflow-hidden px-5 py-28 text-white md:px-10 md:py-40">
        <Image src={tdm.gym.src} alt={tdm.gym.alt[locale] || tdm.gym.alt.en} fill sizes="100vw" quality={80} className="-z-10 object-cover" style={{ objectPosition: "50% 50%" }} />
        <span aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(28_24_18/0.85),rgb(28_24_18/0.55)_55%,rgb(28_24_18/0.25))]" />
        <div className="mx-auto max-w-[1200px]">
          <div className="max-w-[560px]">
            <CEyebrow light>{es ? "Longevidad" : "Longevity"}</CEyebrow>
            <CTitle id="c-long" caps={es ? "Una vida más larga." : "A longer life."} accent={es ? "Una vida mejor." : "A better life."} light className="mt-5 text-[34px] leading-[1.15] md:text-[46px]" />
            <p className="mt-6 text-[16px] leading-[1.75] text-white/85 md:text-[17px]">
              {es ? "Escaneos corporales completos, diagnósticos y atención preventiva para adelantarse a lo que viene, con nutrición personalizada, comida fresca y un programa de ejercicio fácil." : "Full-body scans, diagnostics and proactive care to help you stay ahead of the curve, with individual nutrition, fresh food and an easy fitness program."}
            </p>
            <div className="mt-8">
              <CButton href="/c/longevity" variant="outline-light">
                {es ? "El programa ORA" : "The ORA program"} <span aria-hidden>→</span>
              </CButton>
            </div>
          </div>
        </div>
      </section>

      {/* Act 60: a photograph and the figures. */}
      <section aria-labelledby="c-act" className="bg-white px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
          {photo(cImg.livingView, "(max-width: 1023px) calc(100vw - 40px), 620px", "aspect-[3/2]")}
          <div>
            <CEyebrow>{es ? "Ley 60 · Puerto Rico" : "Act 60 · Puerto Rico"}</CEyebrow>
            <h2 id="c-act" className="mt-5 font-[family-name:var(--font-display)] text-[34px] leading-[1.15] font-medium text-charcoal md:text-[42px]">
              {es ? "Conserve más de lo que gana." : "Keep more of what you earn."}
            </h2>
            <p className="mt-5 text-[16px] leading-[1.75] text-charcoal-soft">{x(cip.why.short)}</p>
            <dl className="mt-8 grid grid-cols-3 border-y border-travertine-deep">
              {cip.why.stats.map((st, k) => (
                <div key={st.value} className={`py-5 ${k ? "border-l border-travertine-deep pl-4" : "pr-4"}`}>
                  <dt className="sr-only">{x(st.label)}</dt>
                  <dd className="font-[family-name:var(--font-display)] text-[34px] leading-none font-medium text-charcoal md:text-[42px]">{st.value}</dd>
                  <dd aria-hidden className="mt-2 text-[11.5px] leading-snug text-charcoal-soft">{x(st.label)}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-[12.5px] leading-relaxed text-charcoal-soft">
              {es ? "Tasas de Puerto Rico bajo un decreto aprobado, no tasas federales de EE. UU. Información general, no asesoría fiscal ni legal." : "Puerto Rico rates under an approved decree, not US federal rates. General information, not tax or legal advice."}
            </p>
            <CLink href="/c/act-60" className="mt-6">
              {es ? "La Ley 60, explicada" : "Act 60, explained"}
            </CLink>
          </div>
        </div>
      </section>

      {/* Location: the words and travel times, a tall photograph. */}
      <section id="location" aria-labelledby="c-loc" className="scroll-mt-24 bg-bone px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-[1200px] gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center lg:gap-20">
          <div>
            <CEyebrow>{es ? "Ubicación" : "Location"}</CEyebrow>
            <CTitle id="c-loc" caps={es ? "Dorado," : "Dorado,"} accent={es ? "en la costa norte" : "on the north coast"} className="mt-5 text-[34px] leading-[1.15] md:text-[46px]" />
            <p className="mt-6 text-[16px] leading-[1.75] text-charcoal-soft md:text-[17px]">{x(cip.location.intro)}</p>
            <div className="mt-8">
              <CList rows={places} />
              <p className="mt-3 text-[12.5px] text-charcoal-soft">{x(cip.location.note)}</p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <CButton href={`https://www.google.com/maps/search/?api=1&query=${settings.siteLat},${settings.siteLng}`} external>
                {es ? "Ver en Google Maps" : "View on Google Maps"} <span aria-hidden>→</span>
              </CButton>
              <CButton href="/c#inquire" variant="outline">
                {es ? "Agende una presentación" : "Schedule a presentation"}
              </CButton>
            </div>
          </div>
          {photo(cImg.aerialTowers, "(max-width: 1023px) calc(100vw - 40px), 540px", "aspect-[4/5]")}
        </div>
      </section>

      {/* Inquire: a dark photograph with the words on the left, the form on the right. */}
      <section id="inquire" aria-labelledby="c-inq" className="grid scroll-mt-24 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="relative isolate flex min-h-[520px] items-end overflow-hidden px-5 py-14 text-white md:px-10 md:py-16">
          <Image src={cImg.lobbyGarden.src} alt={cImg.lobbyGarden.alt[locale] || cImg.lobbyGarden.alt.en} fill sizes="(max-width: 1023px) 100vw, 45vw" quality={80} className="-z-10 object-cover" style={{ objectPosition: cImg.lobbyGarden.focal }} />
          <span aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(28_24_18/0.35),rgb(28_24_18/0.85))]" />
          <div className="max-w-[460px]">
            <CEyebrow light>{es ? "Consultar" : "Inquire"}</CEyebrow>
            <CTitle id="c-inq" caps={es ? "Agende una" : "Schedule a"} accent={es ? "presentación privada" : "private presentation"} light className="mt-5 text-[34px] leading-[1.15] md:text-[44px]" />
            <p className="mt-6 text-[16px] leading-[1.75] text-white/85">
              {es ? "Presentaciones privadas en persona o por videollamada. Consulte por planos, precios y una introducción a esta oportunidad." : "Private presentations are available in person and by video call. Inquire for floor plans, pricing and an introduction to this opportunity."}
            </p>
            <p className="mt-5 text-[14.5px] text-white/80">{x(cip.location.address)}</p>
            {tel && (
              <a href={tel} className="mt-2 inline-block text-[18px] font-semibold hover:underline">
                {settings.phone}
              </a>
            )}
          </div>
        </div>
        <div className="bg-bone px-5 py-14 md:px-12 md:py-16">
          <LeadFormLazy variant="full" consentText={settings.consentText[locale]} submitLabel={es ? "Solicitar una presentación" : "Request a presentation"} />
        </div>
      </section>
    </>
  );
}
