import type { Locale } from "@/content/types";
import { getFloorPlans, getHome, getSiteSettings } from "@/lib/content";
import { t } from "@/lib/localize";
import { cip } from "@/content/seed/homeCip";
import { tdm, life } from "@/content/seed/images";
import { Link } from "@/i18n/navigation";
import { CipSection } from "@/components/cip/CipSection";
import { CardRail, type RailCard } from "@/components/cip/CardRail";
import { StackCards } from "@/components/cip/StackCards";
import { CipShowcase } from "@/components/cip/CipShowcase";
import { LoopVideo } from "@/components/cip/LoopVideo";
import { TaxStats } from "@/components/cip/TaxStats";
import { LeadFormLazy } from "@/components/forms/LeadFormLazy";
import { ArrowRight, ArrowUpRight } from "@/components/ui/Icons";
import { HomeTourStage } from "./HomeTourStage";
import { Logo } from "@/components/layout/Logo";

/** A quiet text link in tracked capitals (the page keeps one gold button: "Inquire"). */
function TextLink({ href, children, dark = false, external = false }: { href: string; children: React.ReactNode; dark?: boolean; external?: boolean }) {
  const cls = `inline-flex min-h-11 items-center gap-2 text-[11px] font-semibold tracking-[0.22em] uppercase ${dark ? "text-brass-light hover:text-bone" : "text-brass-ink hover:text-charcoal"}`;
  if (external)
    return (
      <a href={href} target="_blank" rel="noopener" className={cls}>
        {children} <ArrowUpRight width={13} height={13} />
      </a>
    );
  return href.startsWith("#") ? (
    <a href={href} className={cls}>
      {children} <ArrowRight width={13} height={13} />
    </a>
  ) : (
    <Link href={href} className={cls}>
      {children} <ArrowRight width={13} height={13} />
    </Link>
  );
}

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
 * amenities & features (everything ORA World offers) → why ORA World (how it is different) → longevity
 * and preventive health → fitness and nutrition → why Puerto
 * Rico (Act 60 and its tax benefits) → step inside (360° tour and film, full width) → residences → amenities (the
 * full list, ORA health services and the ghost kitchen) → private charters → floor plans and pricing → three steps →
 * location → Inquire. One layout throughout, after theresidencesatcipriani.com; one gold button, "Inquire".
 */
export async function CipHome({ locale }: { locale: Locale }) {
  const [settings, plans, home] = await Promise.all([getSiteSettings(), getFloorPlans(), getHome()]);
  const x = (l: Parameters<typeof t>[0]) => t(l, locale);
  const es = locale === "es";
  const inquire = { href: "#inquire", label: es ? "Consultar" : "Inquire", track: "cta_inquire" };
  const inquireBtn = (
    <a href="#inquire" className="cta min-h-[52px] px-8" data-track="cta_inquire">
      {inquire.label} <ArrowRight width={14} height={14} />
    </a>
  );
  const hint = es ? "Use las flechas o deslice horizontalmente" : "Use arrows or swipe horizontally";

  // Section 01 gallery: the amenities (client, 16 Nov: like Cipriani's amenity gallery). Captions from this page.
  const k = x(cip.who.galleryKicker);
  // Client's clips (16 Nov): the pool cabana, the lobby, the gym, the entrance and the cove play as films.
  const v = (n: string) => ({ video: `/videos/amenity-${n}.mp4`, poster: `/videos/amenity-${n}-poster.jpg` });
  const whoCards: RailCard[] = [
    { key: "pool", kicker: k, title: es ? "Piscina" : "Pool deck", text: es ? "Estilo resort, con solárium y bar." : "Resort-style, with sundeck and poolside bar.", image: tdm.exteriorPull, ...v("pool") },
    { key: "lobby", kicker: k, title: es ? "Vestíbulo" : "Lobby", text: es ? "Doble altura, atendido 24/7." : "Double height, attended 24/7.", image: tdm.foyerAtrium, ...v("lobby") },
    { key: "fitness", kicker: k, title: es ? "Gimnasio" : "Fitness", text: es ? "Gimnasio y estudio de pilates con vista al jardín." : "Fitness center and pilates studio with garden views.", image: tdm.gym, ...v("gym") },
    { key: "arrival", kicker: k, title: es ? "Llegada" : "Arrival", text: es ? "Pórtico, valet y auto de la casa." : "Porte-cochère, valet and the house car.", image: tdm.entrance, ...v("entrance") },
    { key: "beach", kicker: k, title: es ? "Club de playa" : "Beach club", text: es ? "Sobre una cala turquesa de la costa norte." : "Above a turquoise cove on the north coast.", image: tdm.aerialCoast, ...v("cove") },
    { key: "clubhouse", kicker: k, title: "Clubhouse", text: es ? "Club privado de 14,000 pies²." : "A members-only club of 14,000 sq ft.", image: tdm.foyerLounge },
    { key: "spa", kicker: k, title: "Spa", text: es ? "Masajes, tratamientos y salón." : "Massage, treatments and salon services.", image: life.spa },
    { key: "putting", kicker: k, title: es ? "Campo de putting" : "Putting course", text: es ? "Dieciocho hoyos junto a la piscina." : "Eighteen holes beside the pool.", image: tdm.exteriorGolf },
  ];

  // Client, 15 Nov: each card plays a short film (a camera move made from its picture), not a still.
  const fitnessCards: RailCard[] = [
    { key: "gym", kicker: es ? "Entrenamiento" : "Training", title: es ? "Gimnasio y pilates" : "Fitness and pilates", text: es ? "Un programa pensado para que sea fácil." : "A program designed to make it easy.", image: tdm.gym, video: "/videos/fitness-gym.mp4", poster: "/videos/fitness-gym-poster.jpg" },
    { key: "spa", kicker: es ? "Recuperación" : "Recovery", title: "Spa", text: es ? "Masajes, tratamientos y salón." : "Massage, treatments and salon services.", image: life.spa, video: "/videos/fitness-spa.mp4", poster: "/videos/fitness-spa-poster.jpg" },
    { key: "walk", kicker: es ? "Movimiento" : "Movement", title: es ? "Sendero de dos millas" : "Two-mile walking path", text: es ? "Entre jardines, cerca del parque nacional." : "Through gardens, beside a national park.", image: tdm.aerialForest, video: "/videos/fitness-walk.mp4", poster: "/videos/fitness-walk-poster.jpg" },
    { key: "putting", kicker: es ? "Movimiento" : "Movement", title: es ? "Campo de putting" : "Putting course", text: es ? "Dieciocho hoyos junto a la piscina." : "Eighteen holes beside the pool.", image: tdm.exteriorGolf, video: "/videos/fitness-putting.mp4", poster: "/videos/fitness-putting-poster.jpg" },
  ];

  const residenceCards: RailCard[] = [
    { key: "living", kicker: es ? "Residencia" : "Residence", title: es ? "Sala y comedor" : "Living and dining", text: es ? "Ventanales y acceso a la terraza." : "Floor-to-ceiling glass and terrace access.", image: tdm.kitchenDining },
    { key: "kitchen", kicker: es ? "Cocina" : "Kitchen", title: es ? "Cocina italiana" : "Italian kitchen", text: es ? "Gabinetes Scavolini y electrodomésticos Gaggenau." : "Scavolini cabinetry and Gaggenau appliances.", image: tdm.kitchenWine },
    { key: "suite", kicker: es ? "Dormitorio" : "Bedroom", title: es ? "Suite principal" : "Primary suite", text: es ? "Vista al mar a través del vidrio." : "Ocean views through floor-to-ceiling glass.", image: tdm.masterSuite },
    { key: "bath", kicker: es ? "Baño" : "Bath", title: es ? "Baño principal" : "Primary bath", text: es ? "Mármol y grifería Dornbracht." : "Marble and Dornbracht fittings.", image: tdm.vanity },
    { key: "ph-living", kicker: "Penthouse", title: es ? "Salón de doble altura" : "Double-height salon", text: es ? "Piso 18, en dos niveles." : "Floor 18, on two levels.", image: tdm.penthouseLiving },
    { key: "ph-piano", kicker: "Penthouse", title: es ? "Salón con piano" : "Piano salon", text: es ? "9,807 pies² interiores." : "9,807 sq ft inside.", image: tdm.penthousePiano },
  ];

  const amenityCards: RailCard[] = [
    { key: "club", kicker: "Clubhouse", title: es ? "El Clubhouse" : "The Clubhouse", text: es ? "Club privado de 14,000 pies²." : "A members-only club of 14,000 sq ft.", image: tdm.foyerLounge },
    { key: "pool", kicker: "Resort", title: es ? "La piscina" : "The pool", text: es ? "Estilo resort, con solárium y bar." : "Resort-style, with sundeck and poolside bar.", image: tdm.exteriorPull },
    { key: "beach", kicker: es ? "Costa" : "Coast", title: es ? "Club de playa" : "Beach club", text: es ? "Comida y bebida, y rampa para botes." : "Food and drink service, and a boat slipway.", image: tdm.aerialCoast },
    { key: "arrival", kicker: es ? "Llegada" : "Arrival", title: es ? "El vestíbulo" : "The lobby", text: es ? "Vestíbulo de doble altura atendido 24/7." : "A double-height lobby attended 24/7.", image: tdm.foyerAtrium },
  ];

  const planCards: RailCard[] = plans.map((p) => ({
    key: p.slug,
    kicker: `${es ? "Pisos" : "Floors"} ${p.floors ?? ""}`,
    title: t(p.name, locale),
    meta: `${p.bedrooms} ${es ? "dorm." : "bed"} · ${p.bathrooms} ${es ? "baños" : "bath"}${p.powder ? ` + ${p.powder} ${es ? "medio baño" : "powder"}` : ""} · ${p.interiorSqFt?.toLocaleString("en-US")} ${es ? "pies² int." : "sq ft interior"}`,
    image: p.image,
    href: `/${locale}/residences/plans/${p.slug}`,
    cta: es ? "Ver el plano" : "View floor plan",
  }));

  return (
    <div className="flex flex-col">
      {/* 01 Amenities & features (client, 16 Nov: "like Cipriani, talking about everything ORA World offers"): one line,
          two cards (amenities, features), the property specs, the button, and the amenity gallery on the right. */}
      <CipShowcase
        id="who"
        n="01"
        eyebrow={x(cip.who.offerEyebrow)}
        title={x(cip.who.offerTitle)}
        intro={x(cip.who.offerIntro)}
        cards={cip.who.offerCards.map((c) => ({ label: x(c.label), items: c.items.map(x) }))}
        // Tesoro Del Mar property specs, as published on oraworld.com (the huddle's "property specs").
        facts={home.hero.stats.map((st) => ({ value: st.value == null ? "" : st.value.toLocaleString("en-US"), label: x(st.label) }))}
        cta={inquire}
      >
        <CardRail cards={whoCards} label={x(cip.who.galleryKicker)} hint={hint} locale={locale} ratio="5/4" />
      </CipShowcase>

      {/* 02 Why ORA World: how it is different */}
      <section id="why-ora-world" aria-labelledby="why-ora-world-title" className="border-b border-travertine-deep/60 bg-bone px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1280px]">
          <SectionHead n="02" id="why-ora-world-title" eyebrow={x(cip.different.eyebrow)} title={x(cip.different.title)} intro={x(cip.different.intro)} />
          {/* Client, 15 Nov: cards that stack on top of each other as you scroll, with more than plain text. */}
          <StackCards
            locale={locale}
            cards={cip.different.items.map((item, i) => ({
              title: x(item.title),
              text: x(item.text),
              tags: item.tags.map((tag) => x(tag)),
              href: item.href,
              linkLabel: es ? "Leer más" : "Read more",
              image: [life.spa, tdm.exteriorRoad, life.jet][i],
            }))}
          />
        </div>
      </section>

      {/* 03 Longevity and preventive health, in the Cipriani layout (client, 16 Nov): the services as two cards, the gym
          film on the right. */}
      <CipShowcase
        id="longevity"
        n="03"
        dark
        eyebrow={x(cip.prevention.eyebrow)}
        title={x(cip.prevention.title)}
        intro={x(cip.prevention.intro)}
        body={x(cip.prevention.body)}
        cards={[
          { label: x(cip.prevention.cardLabels[0]), items: cip.prevention.bullets.slice(0, 2).map(x) },
          { label: x(cip.prevention.cardLabels[1]), items: cip.prevention.bullets.slice(2).map(x) },
        ]}
        cta={inquire}
      >
        <figure className="relative overflow-hidden rounded-[22px]">
          {/* Client, 15 Nov: a film that walks into the Tesoro Del Mar gym instead of the still picture (made from the
              gym rendering: a slow camera move from the entrance toward the window and the palms, looping). */}
          <LoopVideo
            src="/videos/longevity-gym.mp4"
            poster="/videos/longevity-gym-poster.jpg"
            ratio="4/5"
            label={es ? "Recorrido por el gimnasio de Tesoro Del Mar, hacia el ventanal y las palmeras" : "Moving through the Tesoro Del Mar fitness center toward the window and the palms"}
          />
          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-basalt via-basalt/80 to-transparent p-6 pt-24 md:p-9 md:pt-32">
            <p className="font-[family-name:var(--font-display)] text-[28px] leading-tight text-bone md:text-[36px]">“{x(cip.prevention.question)}”</p>
            <p className="mt-3 max-w-[48ch] text-[14px] leading-relaxed text-bone/80">{x(cip.prevention.questionSub)}</p>
          </figcaption>
        </figure>
      </CipShowcase>

      {/* 04 Fitness, nutrition and aging well, in the Cipriani layout: two cards and the film gallery. */}
      <CipShowcase
        id="fitness"
        n="04"
        eyebrow={x(cip.fitness.eyebrow)}
        title={x(cip.fitness.title)}
        intro={x(cip.fitness.intro)}
        body={x(cip.fitness.body)}
        cards={[
          { label: x(cip.fitness.cardLabels[0]), items: cip.fitness.bullets.slice(0, 3).map(x) },
          { label: x(cip.fitness.cardLabels[1]), items: cip.fitness.bullets.slice(3).map(x) },
        ]}
        cta={inquire}
      >
        <CardRail cards={fitnessCards} label={x(cip.fitness.eyebrow)} hint={hint} locale={locale} ratio="5/4" />
      </CipShowcase>

      {/* 05 Why Puerto Rico: Act 60 and its tax benefits for residents */}
      <CipSection
        id="why-puerto-rico"
        n="05"
        tone="pale"
        eyebrow={x(cip.why.eyebrow)}
        title={x(cip.why.title)}
        intro={x(cip.why.intro)}
        body={x(cip.why.body)}
        bullets={cip.why.bullets.map(x)}
        cta={inquireBtn}
        note={x(cip.why.note)}
        wideVisual={false}
      >
        {/* Client, 15 Nov: the figures as something to play with, not plain text. */}
        <TaxStats locale={locale} todayLabel={x(cip.why.stats[0].label)} janLabel={x(cip.why.stats[1].label)} decreeLabel={x(cip.why.stats[2].label)} />
      </CipSection>

      {/* 06 Step inside: the 360° tour and the film, full width so people can see it big */}
      <section id="virtual-tour" aria-labelledby="virtual-tour-title" data-tone="dark" className="on-dark border-b border-basalt bg-basalt px-3 py-16 text-bone md:px-6 md:py-24">
        <div className="mx-auto max-w-[1400px]">
          <div className="px-2 md:px-4">
            <SectionHead n="06" id="virtual-tour-title" eyebrow={x(cip.tour.eyebrow)} title={x(cip.tour.title)} intro={x(cip.tour.intro)} dark />
          </div>
          <div className="mt-10 md:mt-12">
            <HomeTourStage vrUrl={settings.vrTourUrl} filmId={settings.introFilmYoutubeId} poster={tdm.penthouseDining} filmPoster={tdm.aerialCoast} locale={locale} wide />
          </div>
        </div>
      </section>

      {/* 07 Residences, with the penthouse, in the Cipriani layout: two cards and the gallery. */}
      <CipShowcase
        id="residences"
        n="07"
        eyebrow={x(cip.residences.eyebrow)}
        title={x(cip.residences.title)}
        intro={x(cip.residences.intro)}
        cards={[
          { label: x(cip.residences.cardLabels[0]), items: cip.residences.bullets.slice(0, 4).map(x) },
          { label: x(cip.residences.cardLabels[1]), items: cip.residences.bullets.slice(4).map(x) },
        ]}
        cta={inquire}
      >
        <CardRail cards={residenceCards} label={x(cip.residences.eyebrow)} hint={hint} locale={locale} ratio="5/4" />
      </CipShowcase>

      {/* 08 Amenities, in the Cipriani "Amenities & features" layout: the four lists as cards on the left, the gallery on
          the right (the full list, with the ORA health services and the ghost kitchen). */}
      <CipShowcase
        id="amenities"
        n="08"
        tone="pale"
        eyebrow={x(cip.amenities.eyebrow)}
        title={x(cip.amenities.title)}
        intro={x(cip.amenities.intro)}
        cards={cip.amenities.groups.map((g) => ({ label: x(g.label), items: g.items.map(x) }))}
        cta={inquire}
      >
        <CardRail cards={amenityCards} label={x(cip.amenities.eyebrow)} hint={hint} locale={locale} ratio="5/4" />
      </CipShowcase>

      {/* 09 Private charters, in the same Cipriani layout (client, 16 Nov: "we can do a lot better here on design"):
          flights and arrival as two cards, and a film card on the right (a slow push-in on the jet and the car). */}
      <CipShowcase
        id="charters"
        n="09"
        dark
        eyebrow={x(cip.charters.eyebrow)}
        title={x(cip.charters.title)}
        intro={x(cip.charters.intro)}
        cards={[
          { label: x(cip.charters.cardLabels[0]), items: cip.charters.bullets.slice(0, 2).map(x) },
          { label: x(cip.charters.cardLabels[1]), items: cip.charters.bullets.slice(2).map(x) },
        ]}
        cta={inquire}
      >
        <div className="overflow-hidden rounded-[18px] bg-white shadow-[0_24px_60px_-30px_rgb(0_0_0/0.6)]">
          <LoopVideo
            src="/videos/charters-landscape.mp4"
            poster="/videos/charters-landscape-poster.jpg"
            ratio="5/4"
            flat
            label={es ? "Un jet privado y el auto de la casa al atardecer" : "A private jet and the house car at golden hour"}
          />
          <div className="p-6 md:p-7">
            <p className="text-[10.5px] font-semibold tracking-[0.26em] text-brass-ink uppercase">{x(cip.charters.film.kicker)}</p>
            <h3 className="display-s mt-2 text-charcoal">{x(cip.charters.film.title)}</h3>
            <p className="mt-1.5 text-[14px] leading-relaxed text-charcoal-soft">{x(cip.charters.film.text)}</p>
          </div>
        </div>
      </CipShowcase>

      {/* 10 Floor plans, in the Cipriani layout: "Starting from" centred, three plan cards across with the details on a
          dark band, and one centred button. */}
      <section id="floor-plans" aria-labelledby="floor-plans-title" className="border-b border-travertine-deep/60 bg-white px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1280px]">
          <p className="eyebrow" data-n="10" data-reveal>
            <span className="rule" aria-hidden />
            {x(cip.plans.eyebrow)}
          </p>
          <div className="mt-6 text-center" data-reveal>
            <h2 id="floor-plans-title" className="text-[12px] font-semibold tracking-[0.3em] text-charcoal-soft uppercase md:text-[13px]">
              {x(cip.plans.title)} · {x(cip.plans.startingFrom)}{" "}
              <span className="font-[family-name:var(--font-display)] text-[30px] tracking-normal text-charcoal normal-case md:text-[36px]">{cip.plans.tiers[0].value}</span>{" "}
              <span className="tracking-[0.2em]">{x(cip.plans.perSqFt)}</span>
            </h2>
            <p className="mx-auto mt-3 max-w-[60ch] text-[15px] leading-relaxed text-charcoal-soft">{x(cip.plans.intro)}</p>
          </div>
          <div className="mt-10">
            <CardRail cards={planCards} label={x(cip.plans.eyebrow)} hint={hint} locale={locale} ratio="4/3" variant="plan" />
          </div>
          <div className="mt-10 flex flex-col items-center gap-4 text-center" data-reveal>
            {inquireBtn}
            <p className="text-[13px] text-charcoal-soft">{x(cip.plans.plansNote)}</p>
          </div>
        </div>
      </section>

      {/* 11 Three steps */}
      <section id="steps" aria-labelledby="steps-title" className="border-b border-travertine-deep/60 bg-bone px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1280px]">
          <p className="eyebrow" data-n="11" data-reveal>
            <span className="rule" aria-hidden />
            {x(cip.steps.eyebrow)}
          </p>
          <h2 id="steps-title" className="display-l mt-5 text-charcoal" data-reveal>
            {x(cip.steps.title)}
          </h2>
          <ol className="mt-10 grid gap-4 md:grid-cols-3 md:gap-6">
            {cip.steps.items.map((step, i) => (
              <li key={step.href} className="flex flex-col rounded-[20px] bg-white p-6 ring-1 ring-travertine-deep/60 md:p-8" data-reveal style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}>
                <span className="font-[family-name:var(--font-display)] text-[44px] leading-none text-brass">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="display-s mt-4 text-charcoal">{x(step.title)}</h3>
                <p className="mt-2 flex-1 text-[15px] leading-relaxed text-charcoal-soft">{x(step.text)}</p>
                {i === 2 && <p className="mt-3 text-[13px] text-charcoal-soft">{x(cip.steps.address)}</p>}
                <div className="mt-4">
                  <TextLink href={step.href}>{x(step.link)}</TextLink>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 12 Location, in the Cipriani "A branded address" layout: the map on the left; on the right the title, the
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
            <p className="eyebrow" data-n="12" data-reveal>
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

      {/* 13 Inquire, in the Cipriani "Request pricing" layout: the form on a white card with the logo at the top. */}
      <CipSection
        id="inquire"
        n="13"
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
