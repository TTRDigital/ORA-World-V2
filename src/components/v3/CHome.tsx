import Image from "next/image";
import type { ImageRef, L, Locale } from "@/content/types";
import { getSiteSettings } from "@/lib/content";
import { t } from "@/lib/localize";
import { cip } from "@/content/seed/homeCip";
import { tdm, life } from "@/content/seed/images";
import { cImg } from "@/content/seed/imagesC";
import { pointsOfInterest } from "@/content/seed/places";
import { LeadFormLazy } from "@/components/forms/LeadFormLazy";
import { BHeroFilm } from "@/components/v2/BHeroFilm";
import { CTitle, CEyebrow, CHeading, CList, CLink, CButton, CQuote } from "@/components/v3/C";
import { CSlider } from "@/components/v3/CSlider";
import { CReel } from "@/components/v3/CReel";
import { FloorExplorer } from "@/components/cip/FloorExplorer";
import { HomeTourStage } from "@/components/home/HomeTourStage";

import { ClipOverlay } from "@/components/ui/ClipOverlay";
import { interiorSlides } from "@/content/seed/interiorSlides";

/**
 * The Version C homepage (client, 19 Nov: "build version 3 like ciprianiresidences-brickell.com; just the homepage
 * banner with video and the rest images I shared"), shared with Version D (client, 20 Nov: "the same, but with the
 * films instead of the images"): `films` swaps each picture for a film of Versions A and B. Same facts and approved copy
 * as Version A (Act 60 per the audit brief).
 */
export async function CHome({ locale, films = false }: { locale: Locale; films?: boolean }) {
  const es = locale === "es";
  const x = (l: L) => t(l, locale);
  const settings = await getSiteSettings();
  // Photographs only below the banner: the stills, never their films.
  const still = (i: ImageRef): ImageRef => ({ src: i.src, width: i.width, height: i.height, focal: i.focal, alt: i.alt, rendering: i.rendering });
  const spa: ImageRef = { ...still(life.spa), src: "/videos/clips/spa-ocean-poster.jpg", width: 1248, height: 704, focal: "50% 50%", alt: { en: "An ocean-view treatment room at the spa", es: "Una sala de tratamientos con vista al mar en el spa" } };
  // Version D (client, 20 Nov: "like Version C, but the homepage images replaced with the films we have"): the same
  // page, each picture swapped for a film of Versions A and B where one exists.
  const pick = (photoImg: ImageRef, filmImg: ImageRef): ImageRef => (films ? filmImg : photoImg);
  const tel = settings.phone ? `tel:${settings.phone.replace(/[^\d+]/g, "")}` : undefined;

  // Client, 20 Nov: the cards play films (the clips of Versions A and B).
  const film = (n: string) => `/videos/clips/${n}.mp4`;
  const reel = [
    { href: "/c/floor-plans", label: es ? "Las residencias" : "The residences", title: es ? "Espacios de doble altura frente al mar" : "Double-height rooms facing the sea", image: still(tdm.penthouseLiving), video: film("p24-penthouse-living") },
    { href: "/c/longevity", label: es ? "Longevidad" : "Longevity", title: es ? "Una vida más larga y mejor" : "A longer, better life", image: spa, video: film("spa-ocean") },
    { href: "/c/act-60", label: es ? "Ley 60" : "Act 60", title: es ? "Conserve más de lo que gana" : "Keep more of what you earn", image: still(tdm.aerialCoast), video: film("p08-aerial-cove") },
    { href: "/c/finishes", label: es ? "Acabados" : "Finishes", title: es ? "Gabinetes italianos, grifería Dornbracht" : "Italian cabinetry, Dornbracht fixtures", image: still(tdm.kitchenWine), video: film("p16-apartment-kitchen") },
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
  const filmSlides = interiorSlides(es).map((sl) => ({ image: { ...sl.image, video: sl.video, poster: sl.poster }, caption: sl.title, tag: sl.note }));
  const cards = [
    { image: cImg.clubhousePool, label: es ? "Salón, café, simulador de golf" : "Lounge, café, golf simulator", title: es ? "El club" : "The clubhouse" },
    { image: cImg.poolDeck, label: es ? "Piscinas, cabañas, bar" : "Lap pools, cabanas, pool bar", title: es ? "La terraza de la piscina" : "Resort deck" },
    { image: spa, label: es ? "Spa, sauna, tratamientos" : "Spa, sauna, treatments", title: es ? "Bienestar" : "Wellness" },
    { image: still(tdm.gym), label: es ? "Gimnasio y pilates" : "Fitness center and Pilates", title: es ? "Ejercicio" : "Fitness" },
    { image: still(tdm.exteriorGolf), label: es ? "Dieciocho hoyos entre las torres" : "Eighteen holes among the towers", title: es ? "Campo de putting" : "Putting course" },
  ];
  const filmCards = [
    { image: { src: "/videos/clips/restaurant-poster.jpg", width: 1280, height: 720, focal: "50% 50%", alt: { en: "An oceanfront dining room, a couple raising a glass by the window", es: "Un comedor frente al mar, una pareja brindando junto a la ventana" }, rendering: true, video: "/videos/clips/restaurant.mp4", poster: "/videos/clips/restaurant-poster.jpg" } as ImageRef, label: es ? "Cenas frente al mar y cocina fantasma" : "Oceanfront dining and a ghost kitchen", title: es ? "El restaurante" : "The restaurant" },
    { image: tdm.exteriorPull, label: es ? "Piscinas, cabañas, bar" : "Lap pools, cabanas, pool bar", title: es ? "La terraza de la piscina" : "Resort deck" },
    { image: { ...spa, video: "/videos/clips/spa-ocean.mp4", poster: "/videos/clips/spa-ocean-poster.jpg" }, label: es ? "Spa, sauna, tratamientos" : "Spa, sauna, treatments", title: es ? "Bienestar" : "Wellness" },
    { image: { ...tdm.gym, focal: "78% 50%" }, label: es ? "Gimnasio y pilates" : "Fitness center and Pilates", title: es ? "Ejercicio" : "Fitness" },
    { image: tdm.exteriorGolf, label: es ? "Dieciocho hoyos entre las torres" : "Eighteen holes among the towers", title: es ? "Campo de putting" : "Putting course" },
  ];
  const places = cip.location.places.map((slug) => {
    const p = pointsOfInterest.find((q) => q.slug === slug)!;
    const walk = p.walkMinutes != null;
    return { label: x(p.name), value: `${walk ? p.walkMinutes : p.driveMinutes} ${x(walk ? cip.location.walk : cip.location.drive)}${p.confirmed ? "" : "*"}` };
  });
  const photo = (i: ImageRef, sizes: string, cls: string) => (
    <div className={`relative overflow-hidden bg-travertine ${cls}`}>
      <Image src={i.src} alt={i.alt[locale] || i.alt.en} fill sizes={sizes} quality={82} className="object-cover" style={{ objectPosition: i.focal }} />
      {i.video && <ClipOverlay src={i.video} poster={i.poster} focal={i.focal} />}
    </div>
  );

  return (
    <>
      {/* The banner: the v4 film, the title at the bottom left, three buttons. */}
      <section aria-label="Tesoro del Mar" className="relative isolate flex h-[calc(84px+66.667vw)] items-end overflow-hidden bg-basalt pt-[84px] pb-6 text-white md:h-auto md:min-h-[100svh] md:bg-transparent md:px-10 md:pt-40 md:pb-20">
        <BHeroFilm alt={es ? "El jet de ORA World a su llegada, la primera escena de la película de Tesoro del Mar" : "The ORA World jet on arrival, the opening scene of the Tesoro del Mar film"} pauseLabel={es ? "Pausar la película" : "Pause the film"} playLabel={es ? "Reproducir la película" : "Play the film"} frame="absolute inset-x-0 bottom-0 top-[84px] -z-10 md:top-0" />
        <span aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(28_24_18/0.4),transparent_28%,transparent_45%,rgb(28_24_18/0.72))]" />
        <div className="mx-auto w-full max-w-[1440px] px-5 md:px-0">
          <p className="text-[10px] font-semibold tracking-[0.3em] uppercase opacity-90 md:text-[11.5px]">Vega Alta · Dorado, Puerto Rico</p>
          <h1 className="mt-4 [text-shadow:0_2px_24px_rgb(28_24_18/0.3)]">
            <span className="block font-[family-name:var(--font-sans)] text-[32px] leading-[1.02] font-extralight tracking-[0.1em] uppercase md:text-[84px]">Tesoro del Mar</span>
            <em className="mt-1 block font-[family-name:var(--font-display)] text-[22px] leading-tight font-medium italic md:text-[44px]">{es ? "Una vida para atesorar" : "A life to treasure"}</em>
          </h1>
          <div className="mt-8 hidden flex-wrap gap-3 md:flex">
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


      {/* Introduction (client, 19 Nov: "on the right, a slice that goes by itself every two seconds, like flashcards"):
          the words and the index on the left, a small card on the right that changes on its own (19 Nov: "very small, one clean section"). */}
      <section aria-labelledby="c-intro" className="bg-white px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1200px]">
          <CReel locale={locale} items={reel}>
            <CEyebrow>Tesoro del Mar</CEyebrow>
            <CTitle id="c-intro" caps={es ? "Donde vive" : "Where longevity"} accent={es ? "la longevidad" : "lives"} className="mt-5 text-[34px] leading-[1.15] md:text-[46px]" />
            <p className="mt-6 text-[16px] leading-[1.75] text-charcoal-soft md:text-[17px]">{x(cip.who.intro)}</p>
            <p className="mt-4 text-[16px] leading-[1.75] text-charcoal-soft md:text-[17px]">{x(cip.who.body)}</p>
          </CReel>
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
            <CSlider slides={films ? filmSlides : slides} locale={locale} label={x(cip.interiors.title)} prev={es ? "Imagen anterior" : "Previous image"} next={es ? "Imagen siguiente" : "Next image"} />
          </div>
          <div className="mt-10">
            <CButton href="/c/floor-plans" variant="outline">
              {es ? "Descubra las residencias" : "Discover the residences"} <span aria-hidden>→</span>
            </CButton>
          </div>
        </div>
      </section>

      {/* Step inside (client, 23 Nov: "the 360° tour from Version 1, very important to show"). */}
      <section id="virtual-tour" aria-labelledby="c-tour" data-tone="dark" className="on-dark scroll-mt-24 bg-basalt py-20 text-bone md:py-28">
        <div className="mx-auto max-w-[1200px] px-5 md:px-10">
          <CHeading id="c-tour" light eyebrow={x(cip.tour.eyebrow)} caps={es ? "Véalo" : "See it"} accent={es ? "usted mismo" : "for yourself"} intro={x(cip.tour.intro)} />
        </div>
        <div className="mx-auto mt-12 max-w-[1840px] px-3 md:px-6">
          <HomeTourStage vrUrl={settings.vrTourUrl} filmId={null} poster={tdm.penthouseDining} filmPoster={tdm.aerialCoast} locale={locale} wide />
        </div>
      </section>

      {/* Floor plans (client, 23 Nov: "the floor plan also on Version 3"): the floor-by-floor explorer, as on Version A's
          Floor plans page. */}
      <section id="floor-plans" aria-labelledby="c-plans" className="scroll-mt-24 bg-white px-5 pb-20 md:px-10 md:pb-28">
        <div className="mx-auto max-w-[1200px] border-t border-travertine-deep pt-20 md:pt-28">
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <CHeading id="c-plans" eyebrow={es ? "Planos · Torre 1" : "Floor plans · Tower 1"} caps={es ? "Encuentre" : "Find your"} accent={es ? "su residencia" : "residence"} intro={x(cip.plans.intro)} />
            <p className="text-[12px] font-semibold tracking-[0.22em] text-charcoal-soft uppercase md:pb-2">
              {x(cip.plans.startingFrom)} <span className="font-[family-name:var(--font-display)] text-[26px] tracking-normal text-charcoal normal-case">{cip.plans.tiers[0].value}</span> {x(cip.plans.perSqFt)}
            </p>
          </div>
          <div className="mt-12">
            <FloorExplorer locale={locale} />
          </div>
        </div>
      </section>

      {/* Amenities (client, 23 Nov: "remove the photographs, text on top, cleaner"): the words centred, then the cards. */}
      <section id="amenities" aria-labelledby="c-amen" className="scroll-mt-24 bg-bone px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1200px]">
          <div className="mx-auto max-w-[760px] text-center">
            <CEyebrow className="justify-center">{es ? "Amenidades" : "Amenities"}</CEyebrow>
            <CTitle id="c-amen" caps={es ? "Amenidades excepcionales" : "Exceptional amenities"} accent={es ? "y experiencias a medida" : "and bespoke experiences"} className="mt-5 text-[32px] leading-[1.15] md:text-[44px]" />
            <p className="mx-auto mt-6 max-w-[60ch] text-[16px] leading-[1.75] text-charcoal-soft md:text-[17px]">
              {es
                ? "En su centro, un club privado de 14,000 pies² con café, restaurante, spa de bienestar, gimnasio y bar en la azotea."
                : "At its heart, a 14,000 sq ft private clubhouse with a café, restaurant, wellness spa, gym and rooftop bar."}
            </p>
          </div>
          <ul className="mt-14 grid gap-4 md:grid-cols-6">
            {(films ? filmCards : cards).map((c, k) => (
              <li key={c.title} className={k < 2 ? "md:col-span-3" : "md:col-span-2"}>
                <div className={`relative isolate overflow-hidden bg-travertine ${k < 2 ? "aspect-[4/3]" : "aspect-[4/5]"}`}>
                  <Image src={c.image.src} alt={c.image.alt[locale] || c.image.alt.en} fill sizes={k < 2 ? "(max-width: 767px) calc(100vw - 40px), 590px" : "(max-width: 767px) calc(100vw - 40px), 390px"} quality={82} className="-z-10 object-cover" style={{ objectPosition: c.image.focal }} />
                  {c.image.video && <ClipOverlay src={c.image.video} poster={c.image.poster} focal={c.image.focal} className="-z-10" />}
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

      {/* Longevity: a full-bleed band. */}
      <section aria-labelledby="c-long" className="relative isolate overflow-hidden px-5 py-28 text-white md:px-10 md:py-40">
        <Image src={tdm.gym.src} alt={tdm.gym.alt[locale] || tdm.gym.alt.en} fill sizes="100vw" quality={80} className="-z-10 object-cover" style={{ objectPosition: "50% 50%" }} />
        {films && <ClipOverlay src="/videos/clips/p14-gym.mp4" poster="/videos/clips/p14-gym-poster.jpg" focal="70% 50%" className="-z-10" />}
        <span aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(28_24_18/0.85),rgb(28_24_18/0.55)_55%,rgb(28_24_18/0.25))]" />
        <div className="mx-auto max-w-[1200px]">
          <div className="max-w-[560px]">
            <CEyebrow light>{es ? "Longevidad" : "Longevity"}</CEyebrow>
            <CTitle id="c-long" caps={es ? "Una vida más larga." : "A longer life."} accent={es ? "Una vida mejor." : "A better life."} light className="mt-5 text-[34px] leading-[1.15] md:text-[46px]" />
            <p className="mt-6 text-[16px] leading-[1.75] text-white/85 md:text-[17px]">
              {es ? "Escaneos corporales completos, diagnósticos y atención preventiva para adelantarse a lo que viene, con nutrición personalizada, comida fresca y un programa de ejercicio fácil." : "Full-body scans, diagnostics and proactive care to help you stay ahead of the curve, with personalized nutrition, fresh food and an easy fitness program."}
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
          {photo(pick(cImg.aerialCove, tdm.aerialCoast), "(max-width: 1023px) calc(100vw - 40px), 620px", "aspect-[3/2]")}
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

      {/* Living (client, 24 Nov: "don't have Location, say Living"): a life by the sea, the travel times, and a link to the
          Living page. */}
      <section id="living" aria-labelledby="c-loc" className="scroll-mt-24 bg-bone px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-[1200px] gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center lg:gap-20">
          <div>
            <CEyebrow>{es ? "Vivir" : "Living"}</CEyebrow>
            <CTitle id="c-loc" caps={es ? "Una vida" : "A life,"} accent={es ? "junto al mar" : "by the sea"} className="mt-5 text-[34px] leading-[1.15] md:text-[46px]" />
            <p className="mt-6 text-[16px] leading-[1.75] text-charcoal-soft md:text-[17px]">
              {es
                ? "En Dorado, en la costa norte: la playa abajo, jardines alrededor, un parque nacional al lado y San Juan a unos 30 minutos."
                : "In Dorado, on the north coast: the beach below, gardens all around, a national park next door and San Juan about 30 minutes away."}
            </p>
            <div className="mt-8">
              <CList rows={places} />
              <p className="mt-3 text-[12.5px] text-charcoal-soft">{x(cip.location.note)}</p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <CButton href="/c/living">
                {es ? "Descubra la vida aquí" : "Discover living here"} <span aria-hidden>→</span>
              </CButton>
              <CButton href="/c#inquire" variant="outline">
                {es ? "Agende una presentación" : "Schedule a presentation"}
              </CButton>
            </div>
          </div>
          {photo(pick(cImg.poolDeck, tdm.exteriorPull), "(max-width: 1023px) calc(100vw - 40px), 540px", "aspect-[4/5]")}
        </div>
      </section>

      {/* Inquire: a dark photograph with the words on the left, the form on the right. */}
      <section id="inquire" aria-labelledby="c-inq" className="grid scroll-mt-24 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="relative isolate flex min-h-[520px] items-end overflow-hidden px-5 py-14 text-white md:px-10 md:py-16">
          <Image src={cImg.lobbyGarden.src} alt={cImg.lobbyGarden.alt[locale] || cImg.lobbyGarden.alt.en} fill sizes="(max-width: 1023px) 100vw, 45vw" quality={80} className="-z-10 object-cover" style={{ objectPosition: cImg.lobbyGarden.focal }} />
          {films && <ClipOverlay src="/videos/clips/lobby-combined.mp4" poster="/videos/clips/lobby-combined-poster.jpg" className="-z-10" />}
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
