import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getHome, getSiteSettings } from "@/lib/content";
import { pageMetadata, JsonLd, breadcrumbLd } from "@/lib/seo";
import type { ImageRef, L, Locale } from "@/content/types";
import { t } from "@/lib/localize";
import { cip } from "@/content/seed/homeCip";
import { tdm, life } from "@/content/seed/images";
import { pointsOfInterest } from "@/content/seed/places";
import { PageHero } from "@/components/ui/PageHero";
import { CipShowcase } from "@/components/cip/CipShowcase";
import { CardRail, type RailCard } from "@/components/cip/CardRail";
import { LocationExplorer } from "@/components/cip/LocationExplorer";
import { Link } from "@/i18n/navigation";
import { ClipOverlay } from "@/components/ui/ClipOverlay";
import { ArrowRight, ArrowUpRight } from "@/components/ui/Icons";

/**
 * Living (client, 18 Nov: "mix Living and Place in one clean, nice page, like the homepage"): life at Tesoro del Mar
 * and the place around it, in the homepage's layout. The amenities and the clubhouse are drawn from the Tesoro del Mar
 * presentation, reworded and grouped for the site (18 Nov: "not just copy and paste from the brochure"); the island
 * and the family and pet lists are the published ORA World content. /place redirects here.
 */
const clip = (name: string) => ({
  video: `/videos/clips/${name}.mp4`,
  poster: `/videos/clips/${name}-poster.jpg`,
});

const COPY = {
  label: { en: "Living", es: "Vivir" },
  headline: { en: "A life, *by the sea*", es: "Una vida *junto al mar*" },
  intro: {
    en: "10.6 coastal acres on Puerto Rico's north shore: the beach below, gardens all around, and everything you need a short walk from your door.",
    es: "10.6 acres costeros en la costa norte de Puerto Rico: la playa abajo, jardines alrededor y todo lo que necesita a pocos pasos de su puerta.",
  },
  dayLabel: { en: "A day here", es: "Un día aquí" },
  dayTitle: { en: "Over 65,000 sq ft of ease", es: "Más de 65,000 pies² de comodidad" },
  dayIntro: {
    en: "Indoors and out, the amenities are built around how you actually spend a day: the water in the morning, the gardens at noon, friends at night.",
    es: "Dentro y fuera, las amenidades se piensan según cómo pasa usted el día: el agua por la mañana, los jardines al mediodía, los amigos por la noche.",
  },
  dayCards: [
    {
      label: { en: "By the water", es: "Junto al agua" },
      items: [
        { en: "A private beach club", es: "Un club de playa privado" },
        { en: "A boat slipway", es: "Una rampa para embarcaciones" },
        { en: "The resort-style pool and pool bar", es: "La piscina estilo resort y su bar" },
      ],
    },
    {
      label: { en: "In the gardens", es: "En los jardines" },
      items: [
        { en: "An 18-hole putting course", es: "Un campo de putting de 18 hoyos" },
        { en: "A two-mile garden path", es: "Un sendero de dos millas entre jardines" },
        {
          en: "Tennis, beach volleyball and an outdoor yoga terrace",
          es: "Tenis, vóleibol de playa y una terraza de yoga al aire libre",
        },
      ],
    },
  ],
  clubLabel: { en: "The clubhouse", es: "El club" },
  clubTitle: { en: "Your club, 14,000 sq ft of it", es: "Su club, de 14,000 pies²" },
  clubIntro: {
    en: "Members only. Coffee in the morning, a quiet desk for work, a golf simulator after lunch, and cocktails on the roof under the stars.",
    es: "Solo para miembros. Café por la mañana, un escritorio tranquilo para trabajar, un simulador de golf después del almuerzo y cócteles en la azotea bajo las estrellas.",
  },
  clubCards: [
    {
      label: { en: "Inside", es: "Dentro" },
      items: [
        { en: "Café and lounge", es: "Café y salón" },
        { en: "Spaces for focused work", es: "Espacios para trabajar con calma" },
        { en: "A golf simulator lounge", es: "Un salón con simulador de golf" },
      ],
    },
    {
      label: { en: "For everyone", es: "Para todos" },
      items: [
        { en: "A fitness center and Pilates studio", es: "Un gimnasio y estudio de pilates" },
        { en: "Spa and salon", es: "Spa y salón de belleza" },
        { en: "A teen lounge and kids' play", es: "Un salón para adolescentes y juegos infantiles" },
      ],
    },
  ],
  familyLabel: { en: "Family and pets", es: "Familia y mascotas" },
  familyTitle: { en: "Room for everyone you love", es: "Espacio para todos los que quiere" },
  familyIntro: {
    en: "Camps and pools for the children, parks and care for the dog: the whole household is looked after.",
    es: "Campamentos y piscinas para los niños, parques y cuidados para el perro: todo el hogar está atendido.",
  },
  placeLabel: { en: "Location", es: "Ubicación" },
  placeTitle: { en: "Dorado, on the *north* coast", es: "Dorado, en la costa *norte*" },
  islandLabel: { en: "The island", es: "La isla" },
  islandTitle: { en: "Puerto Rico, within reach", es: "Puerto Rico, al alcance" },
  islandIntro: {
    en: "Beaches, rainforest, glowing bays and Old San Juan: the island's best days start from your door.",
    es: "Playas, bosque tropical, bahías luminosas y el Viejo San Juan: los mejores días de la isla empiezan en su puerta.",
  },
  closing: { en: "Come and see it for yourself", es: "Venga a verlo usted mismo" },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/living",
    title: locale === "es" ? "Vivir en Tesoro del Mar" : "Living at Tesoro del Mar",
    description: t(COPY.intro, locale),
  });
}

export default async function LivingPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const es = locale === "es";
  const x = (l: L) => t(l, locale);
  const [home, settings, tn] = await Promise.all([
    getHome(),
    getSiteSettings(),
    getTranslations({ locale, namespace: "nav" }),
  ]);
  const inquire = { href: "/#inquire", label: es ? "Consultar" : "Inquire", track: "cta_inquire" };
  const accent = (s: string) =>
    s.split("*").map((part, k) =>
      k % 2 ? (
        <em key={k} className="text-brass-ink italic">
          {part}
        </em>
      ) : (
        <span key={k}>{part}</span>
      ),
    );

  // Client, 24 Nov: the banner is just the ocean, clear turquoise water.
  const hero: ImageRef = {
    ...life.beach,
    video: "/videos/clips/ocean-calm.mp4",
    poster: "/videos/clips/ocean-calm-poster.jpg",
  }; // the calm ocean film
  const dayCards: RailCard[] = [
    {
      key: "pool",
      kicker: es ? "Mañana" : "Morning",
      title: es ? "La piscina" : "The pool",
      text: es ? "Estilo resort, con solárium y bar." : "Resort-style, with sundeck and pool bar.",
      image: tdm.exteriorPull,
      ...clip("p10-pool-cabana"),
    },
    {
      key: "putting",
      kicker: es ? "Mediodía" : "Midday",
      title: es ? "Campo de putting" : "Putting course",
      text: es ? "Dieciocho hoyos entre las torres." : "Eighteen holes between the towers.",
      image: tdm.exteriorGolf,
      ...clip("p11-putting-green"),
    },
    {
      key: "gym",
      kicker: es ? "Tarde" : "Afternoon",
      title: es ? "Gimnasio" : "Fitness",
      text: es ? "Con vista al jardín." : "With garden views.",
      image: tdm.gym,
      ...clip("p14-gym"),
    },
    {
      key: "spa",
      kicker: es ? "Atardecer" : "Sunset",
      title: "Spa",
      text: es ? "Tratamientos frente al mar." : "Treatments facing the sea.",
      image: {
        ...life.spa,
        src: "/videos/clips/spa-ocean-poster.jpg",
        width: 1248,
        height: 704,
        focal: "50% 50%",
      },
      ...clip("spa-ocean"),
    },
    {
      key: "lobby",
      kicker: es ? "Noche" : "Evening",
      title: es ? "Vestíbulo" : "Lobby",
      text: es
        ? "Un vestíbulo de doble altura, con conserje de día y de noche."
        : "A double-height lobby, with a concierge day and night.",
      image: tdm.foyerAtrium,
      ...clip("lobby-combined"),
    },
  ];
  const islandCards: RailCard[] = home.island.places.map((p) => ({
    key: p.slug,
    kicker: x(COPY.islandLabel),
    title: x(p.name),
    text: x(p.text),
    image: p.image,
  }));

  return (
    <div className="flex flex-col">
      <JsonLd
        data={breadcrumbLd(locale, [
          { name: "ORA World", path: "/" },
          { name: tn("living"), path: "/living" },
        ])}
      />
      <PageHero
        locale={locale}
        label={x(COPY.label)}
        headline={x(COPY.headline)}
        intro={x(COPY.intro)}
        image={hero}
      />

      <CipShowcase
        id="day"
        n=""
        eyebrow={x(COPY.dayLabel)}
        title={x(COPY.dayTitle)}
        intro={x(COPY.dayIntro)}
        cards={COPY.dayCards.map((c) => ({ label: x(c.label), items: c.items.map(x) }))}
        cta={inquire}
      >
        <CardRail cards={dayCards} label={x(COPY.dayLabel)} locale={locale} ratio="5/4" />
      </CipShowcase>

      <CipShowcase
        id="clubhouse"
        n=""
        dark
        eyebrow={x(COPY.clubLabel)}
        title={x(COPY.clubTitle)}
        intro={x(COPY.clubIntro)}
        cards={COPY.clubCards.map((c) => ({ label: x(c.label), items: c.items.map(x) }))}
      >
        <figure
          className="relative overflow-hidden rounded-[22px] bg-basalt-soft"
          style={{ aspectRatio: "4/5" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- the clubhouse lounge render */}
          <img
            src={tdm.foyerLounge.src}
            alt={tdm.foyerLounge.alt[locale] || tdm.foyerLounge.alt.en}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: tdm.foyerLounge.focal }}
          />
          {/* Client, 24 Nov: the clubhouse film. */}
          <ClipOverlay
            src="/videos/clips/clubhouse-lounge.mp4"
            poster="/videos/clips/clubhouse-lounge-poster.jpg"
            focal={tdm.foyerLounge.focal}
          />
        </figure>
      </CipShowcase>

      <CipShowcase
        id="family"
        n=""
        tone="pale"
        eyebrow={x(COPY.familyLabel)}
        title={x(COPY.familyTitle)}
        intro={x(COPY.familyIntro)}
        cards={[
          { label: es ? "Familia" : "Family", items: home.living.familyItems.map(x) },
          { label: es ? "Mascotas" : "Pets", items: home.living.petItems.map(x) },
        ]}
      >
        <figure
          className="relative overflow-hidden rounded-[22px] bg-travertine"
          style={{ aspectRatio: "4/5" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- the family photograph (sharp at this size) */}
          <img
            src={life.motherChild.src}
            alt={life.motherChild.alt[locale] || life.motherChild.alt.en}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: "60% 50%" }}
          />
        </figure>
      </CipShowcase>

      {/* The place: the same map and travel times as the homepage. */}
      <section
        id="location"
        aria-labelledby="living-location"
        className="border-b border-travertine-deep/60 bg-white px-5 py-16 md:px-10 md:py-24"
      >
        <div className="mx-auto max-w-[1280px]">
          <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end md:gap-12">
            <div>
              <p className="eyebrow">
                <span className="rule" aria-hidden />
                {x(COPY.placeLabel)}
              </p>
              <h2
                id="living-location"
                className="mt-5 font-[family-name:var(--font-display)] text-[36px] leading-[1.08] font-normal text-charcoal md:text-[52px]"
              >
                {accent(x(COPY.placeTitle))}
              </h2>
            </div>
            <p className="max-w-[46ch] text-[16px] leading-relaxed text-charcoal-soft md:text-[17px]">
              {x(cip.location.intro)}
            </p>
          </div>
          <div className="mt-10 md:mt-12">
            <LocationExplorer
              site={{ lat: settings.siteLat, lng: settings.siteLng, name: "ORA World · Tesoro Del Mar" }}
              mapLabel={x(cip.location.mapLabel)}
              note={x(cip.location.note)}
              places={cip.location.places.map((slug) => {
                const p = pointsOfInterest.find((q) => q.slug === slug)!;
                const walk = p.walkMinutes != null;
                return {
                  slug,
                  name: x(p.name),
                  lat: p.lat,
                  lng: p.lng,
                  time: `${walk ? p.walkMinutes : p.driveMinutes} ${x(walk ? cip.location.walk : cip.location.drive)}${p.confirmed ? "" : "*"}`,
                };
              })}
            />
          </div>
          <p className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-charcoal-soft">
            {x(cip.location.address)}
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${settings.siteLat},${settings.siteLng}`}
              target="_blank"
              rel="noopener"
              className="inline-flex min-h-11 items-center gap-2 text-[11px] font-semibold tracking-[0.22em] text-brass-ink uppercase hover:text-charcoal"
            >
              {x(cip.location.openMap)} <ArrowUpRight width={13} height={13} />
            </a>
          </p>
        </div>
      </section>

      <CipShowcase
        id="island"
        n=""
        tone="pale"
        eyebrow={x(COPY.islandLabel)}
        title={x(COPY.islandTitle)}
        intro={x(COPY.islandIntro)}
        cards={[]}
      >
        <CardRail cards={islandCards} label={x(COPY.islandLabel)} locale={locale} ratio="5/4" />
      </CipShowcase>

      <section
        aria-labelledby="living-close"
        data-tone="dark"
        className="on-dark bg-basalt px-5 py-16 text-center text-bone md:px-10 md:py-20"
      >
        <div className="mx-auto max-w-[880px]">
          <h2
            id="living-close"
            className="font-[family-name:var(--font-display)] text-[30px] leading-tight font-normal md:text-[42px]"
          >
            {x(COPY.closing)}
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/#inquire"
              className="cta inline-flex min-h-[52px] px-8"
              data-track="cta_inquire"
              data-track-label="living"
            >
              {inquire.label} <ArrowRight width={14} height={14} />
            </Link>
            <Link
              href="/place/tour"
              className="inline-flex min-h-[52px] items-center rounded-full px-7 text-[12px] font-semibold tracking-[0.2em] text-bone uppercase ring-1 ring-bone/40 hover:bg-bone hover:text-basalt"
            >
              {es ? "Recorrido 360°" : "360° tour"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
