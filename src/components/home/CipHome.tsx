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
import { FloorExplorer } from "@/components/cip/FloorExplorer";
import { LeadFormLazy } from "@/components/forms/LeadFormLazy";
import { ArrowRight, ArrowUpRight } from "@/components/ui/Icons";
import { HomeTourStage } from "./HomeTourStage";
import { Logo } from "@/components/layout/Logo";

/** Numbered eyebrow + serif capitals heading, for the full-width sections. */
function SectionHead({ n, eyebrow, title, id, intro, dark = false, children }: { n: string; eyebrow: string; title: string; id: string; intro?: string; dark?: boolean; children?: React.ReactNode }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end lg:gap-14">
      <div>
        <p className="eyebrow" data-n={n} data-reveal>
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
  const inquireBtn = (
    <a href="#inquire" className="cta min-h-[52px] px-8" data-track="cta_inquire">
      {inquire.label} <ArrowRight width={14} height={14} />
    </a>
  );

  // Section 01 gallery: the amenities (client, 16 Nov: like Cipriani's amenity gallery). Captions from this page.
  const k = ""; // client, 17 Nov: no "Amenity gallery" label on each card (the carousel keeps it as its accessible name)
  // Client's clips (16 Nov): the pool cabana, the lobby, the gym, the entrance and the cove play as films.
  const v = (n: string) => ({ video: `/videos/amenity-${n}.mp4`, poster: `/videos/amenity-${n}-poster.jpg` });
  // Client, 17 Nov: the new short films made from each render.
  const c = (n: string) => ({ video: `/videos/clips/${n}.mp4`, poster: `/videos/clips/${n}-poster.jpg` });
  const whoCards: RailCard[] = [
    // Client, 16 Nov: the aerial cove film first, titled "View".
    { key: "view", kicker: k, title: es ? "Vista al mar en cada unidad" : "Waterfront view for every unit", text: es ? "Sobre una cala turquesa de la costa norte." : "Above a turquoise cove on the north coast.", image: tdm.aerialCoast, ...c("p08-aerial-cove") },
    // Client, 16 Nov: "Luxury Living" second: the penthouse living film, then the primary suite, then the kitchen.
    { key: "luxury", kicker: k, title: es ? "Vida de lujo" : "Luxury Living", text: es ? "El salón del penthouse, piso 18." : "The penthouse living room, floor 18.", image: tdm.penthouseLiving, ...v("penthouse"), playlist: ["/videos/luxury-suite.mp4", "/videos/luxury-kitchen.mp4"] },
    { key: "pool", kicker: k, title: es ? "Piscina" : "Pool deck", text: es ? "Estilo resort, con solárium y bar." : "Resort-style, with sundeck and poolside bar.", image: tdm.exteriorPull, ...c("p10-pool-cabana") },
    { key: "lobby", kicker: k, title: es ? "Vestíbulo" : "Lobby", text: es ? "Doble altura, atendido 24/7." : "Double height, attended 24/7.", image: tdm.foyerAtrium, ...c("p13-foyer") },
    { key: "fitness", kicker: k, title: es ? "Gimnasio" : "Fitness", text: es ? "Gimnasio y estudio de pilates con vista al jardín." : "Fitness center and pilates studio with garden views.", image: tdm.gym, ...c("p14-gym") },
    { key: "arrival", kicker: k, title: es ? "Llegada" : "Arrival", text: es ? "Pórtico, valet y auto de la casa." : "Porte-cochère, valet and the house car.", image: tdm.entrance, ...c("p12-entrance") },
    { key: "clubhouse", kicker: k, title: "Clubhouse", text: es ? "Club privado de 14,000 pies²." : "A members-only club of 14,000 sq ft.", image: tdm.foyerLounge },
    { key: "spa", kicker: k, title: "Spa", text: es ? "Masajes, tratamientos y salón." : "Massage, treatments and salon services.", image: life.spa },
    { key: "putting", kicker: k, title: es ? "Campo de putting" : "Putting course", text: es ? "Dieciocho hoyos junto a la piscina." : "Eighteen holes beside the pool.", image: tdm.exteriorGolf, ...c("p11-putting-green") },
  ];







  return (
    <div className="flex flex-col">
      {/* 01 Amenities & features (client, 16 Nov: "like Cipriani, talking about everything ORA World offers"): one line,
          two cards (amenities, features), the property specs, the button, and the amenity gallery on the right. */}
      <CipShowcase
        id="who"
        n="01"
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
      <section id="why-ora-world" aria-labelledby="why-ora-world-title" className="border-b border-travertine-deep/60 bg-bone px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1280px]">
          {/* Client, 16 Nov: no eyebrow, title or intro here; the script line heads the section, then the cards. */}
          {/* Client, 17 Nov: the "Thoughtfully crafted" line, set to the brand guideline (DESIGN.md §4–5): the display
              serif in Deep Earth, sentence case, a fine brass hairline above, and one italic accent in brass-ink. */}
          {(() => {
            const line = x(cip.different.script);
            const acc = es ? "en perfecta armonía." : "in perfect harmony.";
            const head = line.endsWith(acc) ? line.slice(0, -acc.length) : line;
            return (
              <h2 id="why-ora-world-title" className="mx-auto max-w-[28ch] text-center font-[family-name:var(--font-display)] text-[22px] leading-[1.3] font-normal text-balance text-charcoal md:max-w-[40ch] md:text-[30px] md:leading-[1.28]" data-reveal>
                <span aria-hidden className="mx-auto mb-7 block h-px w-14 bg-brass md:mb-9" />
                {head}
                {head !== line && <em className="text-brass-ink italic">{acc}</em>}
              </h2>
            );
          })()}
          {/* Client, 15 Nov: cards that stack on top of each other as you scroll, with more than plain text. */}
          <StackCards
            locale={locale}
            cards={cip.different.items.map((item, i) => ({
              title: x(item.title),
              text: x(item.text),
              tags: item.tags.map((tag) => x(tag)),
              href: item.href,
              linkLabel: item.href === "#inquire" ? inquire.label : es ? "Leer más" : "Read more",
              // Client, 17 Nov: full-card pictures, so sharp renders with their films (the gym; the aerial cove behind the
              // Act 60 calculator; the arrival).
              image: [tdm.gym, tdm.aerialCoast, tdm.entrance][i],
              kind: (["health", "tax", "travel"] as const)[i],
            }))}
          />
        </div>
      </section>

      {/* 03 Interiors (client, 16 Nov: copied from the ORA World · Tesoro del Mar presentation): heading and line on
          the left, a counter between round arrows on the right, wide 16:9 slides running off the right edge, then two
          feature lists. Living and kitchen play as films. */}
      <section id="residences" aria-labelledby="residences-title" className="overflow-hidden border-b border-travertine-deep/60 bg-bone py-16 md:py-24">
        <div className="mx-auto grid max-w-[1280px] gap-8 px-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:px-10 xl:px-0">
          <div className="grid gap-4">
            <p className="eyebrow" data-n="03" data-reveal>
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
              { title: es ? "Sala y comedor" : "Living & dining", note: es ? "Interior de residencia" : "Residence interior", image: tdm.kitchenDining, ...c("p15-apartment-living") },
              { title: es ? "Cocina gourmet" : "Gourmet kitchen", note: es ? "Gabinetes italianos" : "Italian cabinetry", image: tdm.kitchenWine, ...c("p16-apartment-kitchen") },
              { title: es ? "Suite principal" : "Primary suite", note: es ? "Interior de residencia" : "Residence interior", image: tdm.masterSuite, ...c("p17-primary-suite") },
              { title: es ? "Dormitorio de invitados" : "Guest bedroom", note: es ? "Interior de residencia" : "Residence interior", image: tdm.aptBedroom, ...c("p18-guest-bedroom") },
              { title: es ? "Dormitorio" : "Bedroom", note: es ? "Vista al mar" : "Ocean view", image: tdm.bedroomOcean, ...c("p21-bedroom-ocean") },
              { title: es ? "Baño principal" : "Primary bath", note: "Dornbracht", image: tdm.aptBath2, ...c("p20-bathroom-tub") },
              { title: es ? "Medio baño" : "Powder room", note: es ? "Madera y piedra" : "Wood and stone", image: tdm.powderRoom, ...c("p22-bathroom-amber") },
              { title: es ? "Estudio" : "Study", note: es ? "Interior de residencia" : "Residence interior", image: tdm.aptStudy, ...c("p23-study") },
              { title: "Penthouse", note: es ? "Piso 18, dos niveles" : "Floor 18, two levels", image: tdm.penthouseLiving, ...c("p24-penthouse-living") },
            ]}
          />
        </div>
        {/* Client, 17 Nov: the two feature lists (living spaces, kitchens) and the Inquire button under them removed. */}
      </section>

      {/* 04 Step inside: the 360° tour and the film, full width so people can see it big */}
      <section id="virtual-tour" aria-labelledby="virtual-tour-title" data-tone="dark" className="on-dark border-b border-basalt bg-basalt px-3 py-16 text-bone md:px-6 md:py-24">
        <div className="mx-auto max-w-[1400px]">
          <div className="px-2 md:px-4">
            <SectionHead n="04" id="virtual-tour-title" eyebrow={x(cip.tour.eyebrow)} title={x(cip.tour.title)} intro={x(cip.tour.intro)} dark />
          </div>
          <div className="mt-10 md:mt-12">
            <HomeTourStage vrUrl={settings.vrTourUrl} filmId={null /* client, 17 Nov: the "Welcome to ORA World" film tab removed; the 360° tour only */} poster={tdm.penthouseDining} filmPoster={tdm.aerialCoast} locale={locale} wide />
          </div>
        </div>
      </section>

      {/* 05 Floor plans (client, 16 Nov: copied from the ORA World · Tesoro del Mar presentation): bedroom filters,
          the tower, the level's residences and the plan with its figures. */}
      <section id="floor-plans" aria-labelledby="floor-plans-title" className="border-b border-travertine-deep/60 bg-travertine/40 px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1280px]">
          <p className="eyebrow" data-n="05" data-reveal>
            <span className="rule" aria-hidden />
            {x(cip.explorer.eyebrow)}
          </p>
          <div className="mt-5 mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2 id="floor-plans-title" className="font-[family-name:var(--font-display)] text-[38px] leading-[1.08] font-semibold text-charcoal md:text-[54px]" data-reveal>
              {x(cip.explorer.title)}
            </h2>
            <p className="text-[12px] font-semibold tracking-[0.24em] text-charcoal-soft uppercase">
              {x(cip.plans.title)} · {x(cip.plans.startingFrom)} <span className="font-[family-name:var(--font-display)] text-[24px] tracking-normal text-charcoal normal-case">{cip.plans.tiers[0].value}</span> {x(cip.plans.perSqFt)}
            </p>
          </div>
          <FloorExplorer locale={locale} />
        </div>
      </section>

      {/* 07 Location, in the Cipriani "A branded address" layout: the map on the left; on the right the title, the
          address card, the facts and one centred button. */}
      <section id="location" aria-labelledby="location-title" className="border-b border-travertine-deep/60 bg-white px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
          <div className="relative overflow-hidden rounded-[20px] bg-travertine shadow-[0_24px_50px_-30px_rgb(44_36_22/0.5)] ring-1 ring-travertine-deep/60" style={{ aspectRatio: "4/3" }}>
            <iframe
              title={es ? "Mapa de Tesoro Del Mar" : "Map of Tesoro Del Mar"}
              src={`https://www.google.com/maps?q=${settings.siteLat},${settings.siteLng}&z=13&output=embed&hl=${locale}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
          <div className="min-w-0">
            <p className="eyebrow" data-n="07" data-reveal>
              <span className="rule" aria-hidden />
              {x(cip.location.eyebrow)}
            </p>
            <h2 id="location-title" className="display-l mt-5 text-charcoal" data-reveal>
              {x(cip.location.title)}
            </h2>
            <p className="mt-5 text-[16px] leading-relaxed text-charcoal" data-reveal>{x(cip.location.intro)}</p>
            <div className="mt-7 rounded-[16px] bg-white px-6 py-5 ring-1 ring-travertine-deep/70" data-reveal>
              <p className="text-[11px] font-semibold tracking-[0.26em] text-brass-ink uppercase">{x(cip.location.addressLabel)}</p>
              <p className="mt-2 text-[17px] text-charcoal">{x(cip.location.address)}</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${settings.siteLat},${settings.siteLng}`}
                target="_blank"
                rel="noopener"
                className="mt-3 inline-flex min-h-11 items-center gap-2 text-[11px] font-semibold tracking-[0.22em] text-brass-ink uppercase hover:text-charcoal"
              >
                {x(cip.location.openMap)} <ArrowUpRight width={13} height={13} />
              </a>
            </div>
            <ul className="mt-6 space-y-3" data-reveal>
              {cip.location.bullets.map((b) => (
                <li key={x(b)} className="flex gap-2.5 text-[15px] leading-snug text-charcoal">
                  <span aria-hidden className="mt-[0.55em] size-1 shrink-0 rounded-full bg-brass" />
                  {x(b)}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 flex justify-center" data-reveal>
          {inquireBtn}
        </div>
      </section>

      {/* Our mission (client, 17 Nov: "have it at the end, before the form"), set to the brand guideline: a label, a
          brass hairline, the first sentence in the display serif, the rest in body text. */}
      <section id="mission" aria-labelledby="mission-title" className="border-b border-travertine-deep/60 bg-bone px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[880px] text-center" data-reveal>
          <p className="text-[11px] font-semibold tracking-[0.28em] text-brass-ink uppercase">{x(cip.mission.label)}</p>
          <span aria-hidden className="mx-auto mt-6 mb-8 block h-px w-14 bg-brass md:mb-10" />
          <h2 id="mission-title" className="font-[family-name:var(--font-display)] text-[24px] leading-[1.32] font-normal text-balance text-charcoal md:text-[32px] md:leading-[1.3]">
            {x(cip.mission.lead)}
          </h2>
          <p className="mx-auto mt-7 max-w-[60ch] text-[16px] leading-8 text-charcoal-soft md:mt-9 md:text-[17px]">{x(cip.mission.body)}</p>
        </div>
      </section>

      {/* 08 Inquire, in the Cipriani "Request pricing" layout: the form on a white card with the logo at the top. */}
      <CipSection
        id="inquire"
        n="08"
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
