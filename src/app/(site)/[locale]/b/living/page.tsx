import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { L, Locale } from "@/content/types";
import { getHome, getSiteSettings } from "@/lib/content";
import { t } from "@/lib/localize";
import { cip } from "@/content/seed/homeCip";
import { tdm, life } from "@/content/seed/images";
import { pointsOfInterest } from "@/content/seed/places";
import { LocationExplorer } from "@/components/cip/LocationExplorer";
import { BHero, BStatement, BChapter, BGrid, BFullBleed, BMedia, BClose, Eyebrow } from "@/components/v2/B";

/** Version B · Living: its own layout (client, 18 Nov: "different from Version A"), the same facts as the Living page. */
const clip = (n: string) => ({ video: `/videos/clips/${n}.mp4`, poster: `/videos/clips/${n}-poster.jpg` });

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "es" ? "Vivir · Versión B" : "Living · Version B", robots: { index: false, follow: false } };
}

const List = ({ title, items, dark }: { title: string; items: string[]; dark?: boolean }) => (
  <div>
    <Eyebrow light={dark}>{title}</Eyebrow>
    <ul className={`mt-4 border-t ${dark ? "border-white/25" : "border-basalt/15"}`}>
      {items.map((it) => (
        <li key={it} className={`border-b py-3 text-[15px] ${dark ? "border-white/25" : "border-basalt/15"}`}>
          {it}
        </li>
      ))}
    </ul>
  </div>
);

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const es = locale === "es";
  const x = (l: L) => t(l, locale);
  const [home, settings] = await Promise.all([getHome(), getSiteSettings()]);
  const spa = { ...life.spa, src: "/videos/clips/spa-ocean-poster.jpg", width: 1248, height: 704, focal: "50% 50%" };
  return (
    <>
      <BHero
        image={{ ...tdm.exteriorPull, ...clip("p10-pool-cabana") }}
        locale={locale}
        eyebrow={es ? "Vivir · Tesoro del Mar" : "Living · Tesoro del Mar"}
        title={es ? "Una vida junto al mar" : "A life by the sea"}
        line={es ? "En la costa norte de Puerto Rico: la playa abajo, jardines alrededor." : "On Puerto Rico's north shore: the beach below, gardens all around."}
        cue={es ? "Desplácese" : "Scroll to explore"}
      />
      <BStatement text={es ? "Todo lo que necesita, a pocos pasos de su puerta." : "Everything you need, a short walk from your door."} sub={es ? "Más de 65,000 pies² de amenidades, pensadas según cómo pasa usted el día." : "Over 65,000 sq ft of amenities, built around how you actually spend a day."} />

      <BChapter eyebrow={es ? "Un día aquí" : "A day here"} title={es ? "De la mañana a la noche." : "From morning to night."} intro={es ? "El agua por la mañana, los jardines al mediodía, los amigos por la noche." : "The water in the morning, the gardens at noon, friends at night."}>
        <BGrid
          locale={locale}
          items={[
            { kicker: es ? "Mañana" : "Morning", title: es ? "La piscina" : "The pool", text: es ? "Estilo resort, con solárium y bar." : "Resort-style, with sundeck and pool bar.", image: { ...tdm.exteriorPull, ...clip("p10-pool-cabana") } },
            { kicker: es ? "Mediodía" : "Midday", title: es ? "Campo de putting" : "Putting course", text: es ? "Dieciocho hoyos entre las torres." : "Eighteen holes between the towers.", image: { ...tdm.exteriorGolf, ...clip("p11-putting-green") } },
            { kicker: es ? "Tarde" : "Afternoon", title: es ? "Gimnasio" : "Fitness", text: es ? "Con vista al jardín." : "With garden views.", image: { ...tdm.gym, ...clip("p14-gym") } },
            { kicker: es ? "Atardecer" : "Sunset", title: "Spa", text: es ? "Tratamientos frente al mar." : "Treatments facing the sea.", image: { ...spa, ...clip("spa-ocean") } },
          ]}
        />
      </BChapter>

      <BFullBleed image={tdm.foyerLounge} locale={locale} eyebrow={es ? "El club" : "The clubhouse"} title={es ? "Su club, de 14,000 pies²." : "Your club, 14,000 sq ft of it."}>
        <p className="mt-6 max-w-[50ch] text-[16px] leading-relaxed text-white/85">
          {es ? "Solo para miembros. Café por la mañana, un escritorio tranquilo, un simulador de golf y cócteles en la azotea bajo las estrellas." : "Members only. Coffee in the morning, a quiet desk, a golf simulator, and cocktails on the roof under the stars."}
        </p>
        <div className="mt-10 grid max-w-[720px] gap-8 sm:grid-cols-2">
          <List dark title={es ? "Dentro" : "Inside"} items={es ? ["Café y salón", "Espacios para trabajar con calma", "Simulador de golf"] : ["Café and lounge", "Spaces for focused work", "Golf simulator lounge"]} />
          <List dark title={es ? "Para todos" : "For everyone"} items={es ? ["Gimnasio y pilates", "Spa y salón de belleza", "Salón de adolescentes y juegos infantiles"] : ["Fitness and pilates", "Spa and salon", "Teen lounge and kids' play"]} />
        </div>
      </BFullBleed>

      <BChapter tone="light" eyebrow={es ? "Familia y mascotas" : "Family and pets"} title={es ? "Espacio para todos los que quiere." : "Room for everyone you love."}>
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-center md:gap-16">
          <BMedia image={{ ...life.motherChild, focal: "60% 50%" }} locale={locale} sizes="(max-width: 767px) calc(100vw - 40px), 680px" className="aspect-[4/5]" />
          <div className="grid gap-10">
            <List title={es ? "Familia" : "Family"} items={home.living.familyItems.map(x)} />
            <List title={es ? "Mascotas" : "Pets"} items={home.living.petItems.map(x)} />
          </div>
        </div>
      </BChapter>

      <BChapter id="location" tone="sand" eyebrow={es ? "Ubicación" : "Location"} title={es ? "Dorado, en la costa norte." : "Dorado, on the north coast."} intro={x(cip.location.intro)}>
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
        <p className="mt-6 text-[13px] text-charcoal-soft">{x(cip.location.address)}</p>
      </BChapter>

      <BChapter eyebrow={es ? "La isla" : "The island"} title={es ? "Puerto Rico, al alcance." : "Puerto Rico, within reach."} intro={es ? "Playas, bosque tropical, bahías luminosas y el Viejo San Juan." : "Beaches, rainforest, glowing bays and Old San Juan."}>
        <BGrid locale={locale} cols={3} ratio="aspect-[4/5]" items={home.island.places.map((p) => ({ title: x(p.name), text: x(p.text), image: p.image }))} />
      </BChapter>

      <BClose image={tdm.aerialCoast} locale={locale} eyebrow="Tesoro del Mar" title={es ? "Venga a verlo usted mismo." : "Come and see it for yourself."} inquire={es ? "Consultar" : "Inquire"} second={{ href: "/b/longevity", label: es ? "Longevidad" : "Longevity" }} />
    </>
  );
}
