import Image from "next/image";
import type { ImageRef, L, Locale } from "@/content/types";
import { getHome, getSiteSettings } from "@/lib/content";
import { t } from "@/lib/localize";
import { cip } from "@/content/seed/homeCip";
import { tdm, life } from "@/content/seed/images";
import { pointsOfInterest } from "@/content/seed/places";
import { ClipOverlay } from "@/components/ui/ClipOverlay";
import { LocationExplorer } from "@/components/cip/LocationExplorer";
import { CPageHero, CHeading, CEyebrow, CTitle, CButton, CSection } from "@/components/v3/C";
import { cn } from "@/lib/utils";

/**
 * Living, in the Version C/D manner (client, 23 Nov: "a Living page like Version A's, on Versions 2 and 3; remove
 * Location"): a day here, the clubhouse, family and pets, the place with its map and travel times, and the island.
 * Same facts as Version A's Living page. `films` plays the clips (Version D).
 */
const clip = (n: string) => ({ video: `/videos/clips/${n}.mp4`, poster: `/videos/clips/${n}-poster.jpg` });

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-[12px] font-semibold tracking-[0.22em] text-brass-ink uppercase">{title}</p>
      <ul className="mt-4 border-t border-travertine-deep">
        {items.map((it) => (
          <li key={it} className="border-b border-travertine-deep py-3 text-[15.5px] text-charcoal">
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function CLiving({ locale, films = false }: { locale: Locale; films?: boolean }) {
  const es = locale === "es";
  const x = (l: L) => t(l, locale);
  const [home, settings] = await Promise.all([getHome(), getSiteSettings()]);
  const f = (i: ImageRef, n: string, focal?: string): ImageRef =>
    films
      ? { ...i, ...(focal ? { focal } : {}), ...clip(n) }
      : {
          src: i.src,
          width: i.width,
          height: i.height,
          focal: focal ?? i.focal,
          alt: i.alt,
          rendering: i.rendering,
        };
  const spa: ImageRef = {
    ...life.spa,
    src: "/videos/clips/spa-ocean-poster.jpg",
    width: 1248,
    height: 704,
    focal: "50% 50%",
    alt: {
      en: "A massage in an ocean-view treatment room at the spa",
      es: "Un masaje en una sala de tratamientos con vista al mar en el spa",
    },
  };
  const photo = (i: ImageRef, sizes: string, cls: string) => (
    <div className={cn("relative overflow-hidden bg-travertine", cls)}>
      <Image
        src={i.src}
        alt={i.alt[locale] || i.alt.en}
        fill
        sizes={sizes}
        quality={82}
        className="object-cover"
        style={{ objectPosition: i.focal }}
      />
      {i.video && <ClipOverlay src={i.video} poster={i.poster} focal={i.focal} />}
    </div>
  );
  const day = [
    {
      when: es ? "Mañana" : "Morning",
      title: es ? "La piscina" : "The pool",
      text: es ? "Estilo resort, con solárium y bar." : "Resort-style, with a sundeck and pool bar.",
      image: f(tdm.exteriorPull, "p10-pool-cabana"),
    },
    {
      when: es ? "Mediodía" : "Midday",
      title: es ? "Campo de putting" : "Putting course",
      text: es ? "Dieciocho hoyos entre las torres." : "Eighteen holes among the towers.",
      image: f(tdm.exteriorGolf, "p11-putting-green"),
    },
    {
      when: es ? "Tarde" : "Afternoon",
      title: es ? "Gimnasio" : "Fitness",
      text: es
        ? "Gimnasio y estudio de Pilates con vista al jardín."
        : "A fitness center and Pilates studio with garden views.",
      image: f(tdm.gym, "p14-gym", "78% 50%"),
    },
    {
      when: es ? "Atardecer" : "Sunset",
      title: "Spa",
      text: es ? "Masajes y tratamientos frente al mar." : "Massage and treatments facing the sea.",
      image: f(spa, "spa-ocean"),
    },
  ];
  const lists = [
    {
      title: es ? "Junto al agua" : "By the water",
      items: es
        ? ["Un club de playa privado", "Una rampa para embarcaciones", "La piscina estilo resort y su bar"]
        : ["A private beach club", "A boat slipway", "The resort-style pool and pool bar"],
    },
    {
      title: es ? "En los jardines" : "In the gardens",
      items: es
        ? [
            "Un campo de putting de 18 hoyos",
            "Un sendero de dos millas",
            "Tenis, vóleibol de playa y una terraza de yoga",
          ]
        : [
            "An 18-hole putting course",
            "A two-mile garden path",
            "Tennis, beach volleyball and an outdoor yoga terrace",
          ],
    },
    {
      title: es ? "El club" : "The clubhouse",
      items: es
        ? [
            "Café y salón",
            "Espacios para trabajar con calma",
            "Simulador de golf",
            "Gimnasio, Pilates, spa y salón de belleza",
          ]
        : [
            "Café and lounge",
            "Spaces for focused work",
            "A golf simulator lounge",
            "Fitness, Pilates, spa and salon",
          ],
    },
  ];
  return (
    <>
      <CPageHero
        image={f(tdm.exteriorPull, "p10-pool-cabana")}
        locale={locale}
        place={es ? "Vivir · Tesoro del Mar" : "Living · Tesoro del Mar"}
        caps={es ? "Una vida" : "A life,"}
        accent={es ? "junto al mar" : "by the sea"}
        line={
          es
            ? "10.6 acres en la costa norte de Puerto Rico: la playa abajo, jardines alrededor y todo lo que necesita a pocos pasos de su puerta."
            : "10.6 acres on Puerto Rico's north shore: the beach below, gardens all around, and everything you need a short walk from your door."
        }
      />

      {/* A day here. */}
      <CSection labelledBy="c-day">
        <CHeading
          id="c-day"
          eyebrow={es ? "Un día aquí" : "A day here"}
          caps={es ? "Más de 65,000 pies²" : "Over 65,000 sq ft"}
          accent={es ? "de comodidad" : "of ease"}
          intro={
            es
              ? "Dentro y fuera, las amenidades se piensan según cómo pasa usted el día: el agua por la mañana, los jardines al mediodía, los amigos por la noche."
              : "Indoors and out, the amenities are built around how you actually spend a day: the water in the morning, the gardens at noon, friends at night."
          }
        />
        <ul className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {day.map((d) => (
            <li key={d.title}>
              {photo(
                d.image,
                "(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) 45vw, 280px",
                "aspect-[4/5]",
              )}
              <p className="mt-4 text-[11px] font-semibold tracking-[0.24em] text-brass-ink uppercase">
                {d.when}
              </p>
              <h3 className="mt-1 font-[family-name:var(--font-display)] text-[26px] leading-tight font-medium text-charcoal">
                {d.title}
              </h3>
              <p className="mt-1 text-[15px] leading-relaxed text-charcoal-soft">{d.text}</p>
            </li>
          ))}
        </ul>
        <div className="mt-16 grid gap-10 md:grid-cols-3">
          {lists.map((l) => (
            <List key={l.title} {...l} />
          ))}
        </div>
      </CSection>

      {/* Family and pets. */}
      <CSection tone="bone" labelledBy="c-family">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-20">
          {photo(
            { ...life.motherChild, focal: "60% 50%" },
            "(max-width: 1023px) calc(100vw - 40px), 560px",
            "aspect-[4/5]",
          )}
          <div>
            <CEyebrow>{es ? "Familia y mascotas" : "Family and pets"}</CEyebrow>
            <CTitle
              id="c-family"
              caps={es ? "Espacio para" : "Room for"}
              accent={es ? "todos los que quiere" : "everyone you love"}
              className="mt-5 text-[34px] leading-[1.15] md:text-[44px]"
            />
            <div className="mt-10 grid gap-10 sm:grid-cols-2">
              <List title={es ? "Familia" : "Family"} items={home.living.familyItems.map(x)} />
              <List title={es ? "Mascotas" : "Pets"} items={home.living.petItems.map(x)} />
            </div>
          </div>
        </div>
      </CSection>

      {/* The place: the map and travel times. */}
      <CSection id="location" labelledBy="c-place">
        <CHeading
          id="c-place"
          eyebrow={es ? "Ubicación" : "Location"}
          caps={es ? "Dorado," : "Dorado,"}
          accent={es ? "en la costa norte" : "on the north coast"}
          intro={x(cip.location.intro)}
        />
        <div className="mt-12">
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
        <p className="mt-6 text-[14px] text-charcoal-soft">{x(cip.location.address)}</p>
      </CSection>

      {/* The island. */}
      <CSection tone="bone" labelledBy="c-island">
        <CHeading
          id="c-island"
          eyebrow={es ? "La isla" : "The island"}
          caps={es ? "Puerto Rico," : "Puerto Rico,"}
          accent={es ? "al alcance" : "within reach"}
          intro={
            es
              ? "Playas, bosque tropical, bahías luminosas y el Viejo San Juan: los mejores días de la isla empiezan en su puerta."
              : "Beaches, rainforest, glowing bays and Old San Juan: the island's best days start from your door."
          }
        />
        <ul className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {home.island.places.map((p) => (
            <li key={p.slug}>
              {photo(
                p.image,
                "(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) 45vw, 380px",
                "aspect-[4/3]",
              )}
              <h3 className="mt-4 font-[family-name:var(--font-display)] text-[24px] leading-tight font-medium text-charcoal">
                {x(p.name)}
              </h3>
              <p className="mt-1 text-[15px] leading-relaxed text-charcoal-soft">{x(p.text)}</p>
            </li>
          ))}
        </ul>
      </CSection>

      <CSection tone="sand" labelledBy="c-close">
        <div className="text-center">
          <CTitle
            id="c-close"
            caps={es ? "Venga a verlo" : "Come and see it"}
            accent={es ? "usted mismo" : "for yourself"}
            className="text-[34px] leading-[1.15] md:text-[44px]"
          />
          <div className="mt-8">
            <CButton href="/c#inquire">
              {es ? "Agende una presentación" : "Schedule a presentation"} <span aria-hidden>→</span>
            </CButton>
          </div>
        </div>
      </CSection>
    </>
  );
}
