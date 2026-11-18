import type { Locale } from "@/content/types";
import { getHome, getSiteSettings } from "@/lib/content";
import { t } from "@/lib/localize";
import { cip } from "@/content/seed/homeCip";
import { tdm, life } from "@/content/seed/images";
import { CipSection } from "@/components/cip/CipSection";
import { CardRail, type RailCard } from "@/components/cip/CardRail";
import { CipShowcase } from "@/components/cip/CipShowcase";
import { StackCards } from "@/components/cip/StackCards";
import { InteriorsGallery } from "@/components/cip/InteriorsGallery";
import { LocationExplorer } from "@/components/cip/LocationExplorer";
import { pointsOfInterest } from "@/content/seed/places";
import { LeadFormLazy } from "@/components/forms/LeadFormLazy";
import { ArrowUpRight } from "@/components/ui/Icons";
import { HomeTourStage } from "./HomeTourStage";
import { Explorer } from "./Explorer";
import { Logo } from "@/components/layout/Logo";

/** Numbered eyebrow + serif capitals heading, for the full-width sections. */
function SectionHead({ eyebrow, title, id, intro, dark = false, children }: { eyebrow: string; title: string; id: string; intro?: string; dark?: boolean; children?: React.ReactNode }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end lg:gap-14">
      <div>
        <p className="eyebrow" data-reveal>
          <span className="rule" aria-hidden />
          {eyebrow}
        </p>
        <h2 id={id} className={`display-l mt-5 ${dark ? "text-bone" : "text-charcoal"}`} data-reveal>
          {title}
        </h2>
      </div>
      <div>
        {intro && (
          <p className={`max-w-[58ch] text-[16px] leading-relaxed ${dark ? "text-bone/80" : "text-charcoal-soft"}`} data-reveal>
            {intro}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}

/**
 * The homepage story, following the owner's content brief and the client call (Nov 2026):
 * amenities & features (everything ORA World offers) → why ORA World
 * and preventive health → fitness and nutrition → why Puerto
 * Rico (Act 60 and its tax benefits) → step inside (360° tour and film, full width) → residences → amenities (the
 * full list, ORA health services and the ghost kitchen) → private charters → floor plans and pricing → three steps →
 * location → Inquire. One layout throughout, after theresidencesatcipriani.com; one gold button, "Inquire".
 */
export async function CipHome({ locale }: { locale: Locale }) {
  const [settings, home] = await Promise.all([getSiteSettings(), getHome()]);
  const x = (l: Parameters<typeof t>[0]) => t(l, locale);
  const es = locale === "es";
  const inquire = { href: "#inquire", label: es ? "Consultar" : "Inquire", track: "cta_inquire" };

  // Section 01 gallery: the amenities (client, 16 Nov: like Cipriani's amenity gallery). Captions from this page.
  // Client's clips (16 Nov): the pool cabana, the lobby, the gym, the entrance and the cove play as films.
  const v = (n: string) => ({ video: `/videos/amenity-${n}.mp4`, poster: `/videos/amenity-${n}-poster.jpg` });
  // Client, 17 Nov: the new short films made from each render.
  const c = (n: string) => ({ video: `/videos/clips/${n}.mp4`, poster: `/videos/clips/${n}-poster.jpg` });
  const jetArrival = {
    src: "/videos/clips/jet-arrival-poster.jpg",
    width: 1632,
    height: 544,
    focal: "24% 60%",
    alt: { en: "The ORA World jet on the apron, guests stepping down to the tarmac", es: "El jet de ORA World en la plataforma, con huéspedes bajando a la pista" },
    rendering: true,
    ...c("jet-arrival"),
  };
  // Client, 17 Nov: the gallery tells the story of a stay: arrive, the view, step inside, the things to do, then
  // your place. The word over each title carries the story.
  const whoCards: RailCard[] = [
    { key: "arrival", kicker: es ? "Llegar" : "Arrive", title: es ? "Llegada" : "Arrival", text: es ? "Jet privado chárter y el auto de la casa esperándole." : "Private jet charters and a house car waiting.", image: jetArrival, ...c("jet-arrival"), videoFocal: jetArrival.focal },
    { key: "view", kicker: es ? "Contemplar" : "Take in the view", title: es ? "Vista al mar en cada unidad" : "Waterfront view for every unit", text: es ? "Sobre una cala turquesa de la costa norte." : "Above a turquoise cove on the north coast.", image: tdm.aerialCoast, ...c("p08-aerial-cove") },
    { key: "lobby", kicker: es ? "Entrar" : "Step inside", title: es ? "Vestíbulo" : "Lobby", text: es ? "Doble altura, atendido 24/7." : "Double height, attended 24/7.", image: tdm.foyerAtrium, ...c("lobby-combined") },
    { key: "pool", kicker: es ? "Relajarse" : "Unwind", title: es ? "Piscina" : "Pool deck", text: es ? "Estilo resort, con solárium y bar." : "Resort-style, with sundeck and poolside bar.", image: tdm.exteriorPull, ...c("p10-pool-cabana") },
    { key: "putting", kicker: es ? "Jugar" : "Play", title: es ? "Campo de putting" : "Putting course", text: es ? "Dieciocho hoyos junto a la piscina." : "Eighteen holes beside the pool.", image: tdm.exteriorGolf, ...c("p11-putting-green") },
    { key: "fitness", kicker: es ? "Moverse" : "Move", title: es ? "Gimnasio" : "Fitness", text: es ? "Gimnasio y estudio de pilates con vista al jardín." : "Fitness center and pilates studio with garden views.", image: tdm.gym, ...c("p14-gym") },
    // Client, 18 Nov: the ocean-view spa film.
    { key: "spa", kicker: es ? "Renovarse" : "Restore", title: "Spa", text: es ? "Masajes, tratamientos y salón." : "Massage, treatments and salon services.", image: { ...life.spa, src: "/videos/clips/spa-ocean-poster.jpg", width: 1248, height: 704, focal: "50% 50%", alt: { en: "An ocean-view treatment room at the spa", es: "Una sala de tratamientos con vista al mar en el spa" } }, ...c("spa-ocean") },
    { key: "clubhouse", kicker: es ? "Reunirse" : "Gather", title: "Clubhouse", text: es ? "Club privado de 14,000 pies²." : "A members-only club of 14,000 sq ft.", image: tdm.foyerLounge },
    { key: "luxury", kicker: es ? "Volver a casa" : "Come home", title: es ? "Vida de lujo" : "Luxury Living", text: es ? "Fachadas de vidrio y terrazas envolventes, pensadas para vivir dentro y fuera." : "Glass façades and wraparound terraces, designed for indoor and outdoor living.", image: { ...tdm.penthouseLiving, alt: { en: "A double-height living room with a floating marble stair", es: "Un salón de doble altura con escalera flotante de mármol" } }, ...v("penthouse"), playlist: ["/videos/luxury-suite.mp4", "/videos/luxury-kitchen.mp4"] },
  ];







  return (
    <div className="flex flex-col">
      {/* 01 Amenities & features (client, 16 Nov: "like Cipriani, talking about everything ORA World offers"): one line,
          two cards (amenities, features), the property specs, the button, and the amenity gallery on the right. */}
      <CipShowcase
        id="who"
        n=""
        eyebrow={x(cip.who.label)}
        title={x(cip.who.offerTitle)}
        intro={x(cip.who.offerIntro)}
        // Client, 16 Nov: no Amenities / Features cards here ("too busy"); the line, the specs and the gallery say it.
        cards={[]}
        // Tesoro Del Mar property specs, as published on oraworld.com (the huddle's "property specs").
        facts={home.hero.stats.map((st) => ({ value: st.value == null ? "" : st.value.toLocaleString("en-US"), label: x(st.label) }))}
        cta={inquire}
      >
        {/* Client, 16 Nov: no numbered label and no "use arrows" hint in this section. */}
        <CardRail cards={whoCards} label={x(cip.who.galleryKicker)} locale={locale} ratio="5/4" />
      </CipShowcase>

      {/* 02 Why ORA World: how it is different */}
      <section id="why-ora-world" aria-labelledby="why-ora-world-title" className="border-b border-travertine-deep/60 bg-bone px-5 pt-12 pb-16 md:px-10 md:pt-16 md:pb-24">
        <div className="mx-auto max-w-[1280px]">
          {/* Client, 16 Nov: no eyebrow, title or intro here; the script line heads the section, then the cards. */}
          {/* Client, 17 Nov: one line on wide screens (wraps on tablets and phones). */}
          {/* Client, 17 Nov: the "Thoughtfully crafted" line, set to the brand guideline (DESIGN.md §4–5): the display
              serif in Deep Earth, sentence case, a fine brass hairline above, and one italic accent in brass-ink. */}
          <p className="eyebrow mb-5 justify-center md:mb-6" data-reveal>
            <span className="rule" aria-hidden />
            {x(cip.different.eyebrow)}
            <span className="rule" aria-hidden />
          </p>
          {(() => {
            const line = x(cip.different.script);
            const acc = es ? "en perfecta armonía." : "in perfect harmony.";
            const head = line.endsWith(acc) ? line.slice(0, -acc.length) : line;
            return (
              <h2 id="why-ora-world-title" className="mx-auto max-w-[28ch] text-center font-[family-name:var(--font-display)] text-[22px] leading-[1.3] font-normal text-balance text-charcoal md:max-w-[40ch] md:text-[28px] md:leading-[1.28] xl:max-w-none xl:text-[27px] xl:whitespace-nowrap" data-reveal>
                
                {head}
                {head !== line && <em className="text-brass-ink italic">{acc}</em>}
              </h2>
            );
          })()}
          {/* Client, 15 Nov: cards that stack on top of each other as you scroll, with more than plain text. */}
          <StackCards
            locale={locale}
            cards={cip.different.items.map((item) => ({
              title: x(item.title),
              text: x(item.text),
              tags: item.tags.map((tag) => x(tag)),
              href: item.href,
              // Client, 17 Nov: full-card pictures with their films: the ORA World jet arriving (the client's film, its
              // first frame as the still); the gym; the aerial cove behind the Act 60 calculator; the towers (Built to endure).
              image: { travel: jetArrival, health: tdm.gym, tax: tdm.aerialCoast, resilience: tdm.exteriorRoad, finishes: tdm.kitchenWine }[item.kind],
              kind: item.kind,
            }))}
          />
        </div>
      </section>

      {/* 03 Interiors (client, 16 Nov: copied from the ORA World · Tesoro del Mar presentation): heading and line on
          the left, a counter between round arrows on the right, wide 16:9 slides running off the right edge, then two
          feature lists. Living and kitchen play as films. */}
      <section id="residences" aria-labelledby="residences-title" className="overflow-hidden border-b border-travertine-deep/60 bg-bone py-16 md:py-24">
        <div className="mx-auto grid max-w-[1280px] gap-x-8 gap-y-6 px-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:px-10 xl:px-0">
          <div className="grid gap-4">
            {/* Client, 17 Nov: the label without a number, like Location. */}
            <p className="eyebrow" data-reveal>
              <span className="rule" aria-hidden />
              {x(cip.interiors.eyebrow)}
            </p>
            <h2 id="residences-title" className="font-[family-name:var(--font-display)] text-[38px] leading-[1.08] font-semibold text-charcoal md:text-[54px]" data-reveal>
              {x(cip.interiors.title)}
            </h2>
            <p className="max-w-[60ch] text-[16px] leading-relaxed text-charcoal-soft" data-reveal>
              {x(cip.interiors.intro)}
            </p>
          </div>
          <InteriorsGallery
            locale={locale}
            label={x(cip.interiors.title)}
            prevLabel={es ? "Imagen anterior" : "Previous image"}
            nextLabel={es ? "Imagen siguiente" : "Next image"}
            slides={[
              // Client, 17 Nov: the penthouse living room first.
              { title: "Penthouse", note: es ? "Piso 18, dos niveles" : "Floor 18, two levels", image: tdm.penthouseLiving, ...c("p24-penthouse-living") },
              { title: es ? "Sala y comedor" : "Living & dining", note: es ? "Interior de residencia" : "Residence interior", image: tdm.kitchenDining, ...c("p15-apartment-living") },
              { title: es ? "Cocina gourmet" : "Gourmet kitchen", note: es ? "Gabinetes italianos" : "Italian cabinetry", image: tdm.kitchenWine, ...c("p16-apartment-kitchen") },
              { title: es ? "Suite principal" : "Primary suite", note: es ? "Interior de residencia" : "Residence interior", image: tdm.masterSuite, ...c("p17-primary-suite") },
              { title: es ? "Dormitorio de invitados" : "Guest bedroom", note: es ? "Interior de residencia" : "Residence interior", image: tdm.aptBedroom, ...c("p18-guest-bedroom") },
              { title: es ? "Dormitorio" : "Bedroom", note: es ? "Vista al mar" : "Ocean view", image: tdm.bedroomOcean, ...c("p21-bedroom-ocean") },
              { title: es ? "Baño principal" : "Primary bath", note: "Dornbracht", image: tdm.aptBath2, ...c("p20-bathroom-tub") },
              // Client, 17 Nov: the vanity film, after the primary bath.
              { title: es ? "Lavabo doble" : "Double vanity", note: es ? "Mármol" : "Marble", image: tdm.vanity, ...c("p19-bathroom-vanity") },
              { title: es ? "Medio baño" : "Powder room", note: es ? "Madera y piedra" : "Wood and stone", image: tdm.powderRoom, ...c("p22-bathroom-amber") },
              { title: es ? "Estudio" : "Study", note: es ? "Interior de residencia" : "Residence interior", image: tdm.aptStudy, ...c("p23-study") },
              // Client, 17 Nov: the second penthouse film last (no matching still: its first frame is the picture).
              {
                title: es ? "Salón del penthouse" : "Penthouse living",
                note: es ? "Piso 18, dos niveles" : "Floor 18, two levels",
                image: {
                  src: "/videos/clips/p25-penthouse-living-a-poster.jpg",
                  width: 1248,
                  height: 704,
                  focal: "50% 50%",
                  alt: { en: "The two-level penthouse living room with its floating stair", es: "El salón de dos niveles del penthouse con su escalera flotante" },
                  rendering: true,
                },
                ...c("p25-penthouse-living-a"),
              },
            ]}
          />
        </div>
        {/* Client, 17 Nov: the two feature lists (living spaces, kitchens) and the Inquire button under them removed. */}
      </section>

      {/* 04 Step inside: the 360° tour and the film, full width so people can see it big */}
      {/* Client, 17 Nov: the tour wider on screen: the heading keeps the page column, the frame runs nearly edge to edge. */}
      <section id="virtual-tour" aria-labelledby="virtual-tour-title" data-tone="dark" className="on-dark border-b border-basalt bg-basalt py-16 text-bone md:py-24">
        <div className="mx-auto max-w-[1280px] px-5 md:px-10 xl:px-0">
          <SectionHead id="virtual-tour-title" eyebrow={x(cip.tour.eyebrow)} title={x(cip.tour.title)} intro={x(cip.tour.intro)} dark />
        </div>
        <div className="mx-auto max-w-[1840px] px-3 md:px-6">
          <div className="mt-10 md:mt-12">
            <HomeTourStage vrUrl={settings.vrTourUrl} filmId={null /* client, 17 Nov: the "Welcome to ORA World" film tab removed; the 360° tour only */} poster={tdm.penthouseDining} filmPoster={tdm.aerialCoast} locale={locale} wide />
          </div>
        </div>
      </section>

      {/* Residence explorer (client, 17 Nov: "this section instead of the floor plans"; the floor-plan explorer moved to
          the Floor plans page): the tower drawing whose bands choose a collection. */}
      <Explorer locale={locale} />

      {/* 07 Location (client, 17 Nov: like the other site's location, but short and clean): the title and one line,
          then the map with five places and their travel times. */}
      <section id="location" aria-labelledby="location-title" className="border-b border-travertine-deep/60 bg-bone px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1280px]">
          <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end md:gap-12">
            <div>
              <p className="eyebrow" data-reveal>
                <span className="rule" aria-hidden />
                {x(cip.location.eyebrow)}
              </p>
              <h2 id="location-title" className="mt-5 font-[family-name:var(--font-display)] text-[36px] leading-[1.08] font-normal text-charcoal md:text-[52px]" data-reveal>
                {x(cip.location.title)
                  .split("*")
                  .map((part, k) => (k % 2 ? <em key={k} className="text-brass-ink italic">{part}</em> : <span key={k}>{part}</span>))}
              </h2>
            </div>
            <p className="max-w-[46ch] text-[16px] leading-relaxed text-charcoal-soft md:text-[17px]" data-reveal>
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

      {/* Our mission (client, 17 Nov: at the end, before the form; "do better with the design, add our logo icon"): the
          gold tree with its moving leaves, the label between hairlines, the statement in the display serif with one
          brass italic phrase, the three commitments as numbered pillars, and the closing line; a faint tree behind. */}
      <section id="mission" aria-labelledby="mission-title" className="relative isolate overflow-hidden border-b border-travertine-deep/60 bg-bone px-5 py-16 md:px-10 md:py-24">
        {/* eslint-disable-next-line @next/next/no-img-element -- decorative watermark, the animated SVG as is */}
        <img src="/brand/ora-world-tree-leaves.svg" alt="" aria-hidden width={252} height={248} className="pointer-events-none absolute top-1/2 -right-24 -z-10 w-[520px] max-w-none -translate-y-1/2 opacity-[0.06] md:-right-16 md:w-[680px]" />
        <div className="mx-auto max-w-[980px] text-center">
          <picture>
            <source media="(prefers-reduced-motion: reduce)" srcSet="/brand/ora-world-tree.png" />
            <img src="/brand/ora-world-tree-leaves.svg" alt="ORA World" width={252} height={248} className="mx-auto h-[84px] w-auto md:h-[104px]" data-reveal />
          </picture>
          <p className="mt-8 flex items-center justify-center gap-4 text-[11px] font-semibold tracking-[0.3em] text-brass-ink uppercase" data-reveal>
            <span aria-hidden className="h-px w-10 bg-brass/70" />
            {x(cip.mission.label)}
            <span aria-hidden className="h-px w-10 bg-brass/70" />
          </p>
          <h2 id="mission-title" className="mx-auto mt-8 max-w-[22ch] font-[family-name:var(--font-display)] text-[34px] leading-[1.12] font-normal text-balance text-charcoal md:text-[56px] md:leading-[1.06]" data-reveal>
            {x(cip.mission.lead)
              .split("*")
              .map((part, k) => (k % 2 ? <em key={k} className="text-brass-ink italic">{part}</em> : <span key={k}>{part}</span>))}
          </h2>
          <p className="mx-auto mt-8 max-w-[58ch] text-[17px] leading-8 text-charcoal md:mt-10 md:text-[19px]" data-reveal>
            {x(cip.mission.body)}
          </p>
          <span aria-hidden className="mx-auto mt-8 block h-px w-14 bg-brass md:mt-10" />
          <p className="mx-auto mt-8 max-w-[52ch] font-[family-name:var(--font-display)] text-[21px] leading-snug text-charcoal-soft italic md:mt-10 md:text-[25px]" data-reveal>
            {x(cip.mission.close)}
          </p>
        </div>
      </section>

      {/* 08 Inquire, in the Cipriani "Request pricing" layout: the form on a white card with the logo at the top. */}
      <CipSection
        id="inquire"
        n=""
        tone="dark"
        eyebrow={x(cip.inquire.eyebrow)}
        title={x(cip.inquire.title)}
        intro={x(cip.inquire.intro)}
        bullets={cip.inquire.bullets.map(x)}
        wideVisual={false}
        cta={
          settings.phone ? (
            <a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`} className="text-[15px] font-semibold tracking-[0.08em] text-bone hover:text-brass-light">
              {settings.phone}
            </a>
          ) : undefined
        }
      >
        <div data-tone="light" className="light-card rounded-[22px] bg-white p-6 text-charcoal shadow-lift md:p-8">
          <div className="mb-6 border-b border-travertine-deep/60 pb-5">
            <Logo variant="header" height={64} className="h-[56px]" />
          </div>
          <LeadFormLazy variant="full" consentText={settings.consentText[locale]} submitLabel={es ? "Consultar" : "Inquire"} />
        </div>
      </CipSection>
    </div>
  );
}
