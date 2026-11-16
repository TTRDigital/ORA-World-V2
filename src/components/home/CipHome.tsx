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
 * who we are (the core promise, the founder) → why ORA World (how it is different, why you can trust it) → longevity
 * and preventive health → fitness and nutrition → why Puerto
 * Rico (Act 60 and its tax benefits) → step inside (360° tour and film, full width) → residences → amenities (the
 * full list, ORA health services and the ghost kitchen) → private charters → floor plans and pricing → three steps →
 * Inquire. One layout throughout, after theresidencesatcipriani.com; one gold button, "Inquire".
 */
export async function CipHome({ locale }: { locale: Locale }) {
  const [settings, plans, home] = await Promise.all([getSiteSettings(), getFloorPlans(), getHome()]);
  const x = (l: Parameters<typeof t>[0]) => t(l, locale);
  const es = locale === "es";
  const hint = es ? "Use las flechas o deslice" : "Use arrows or swipe";

  // Who we are gallery (Cipriani layout). Captions from the image descriptions and the published specs.
  const whoCards: RailCard[] = [
    { key: "towers", kicker: x(cip.who.galleryKicker), title: es ? "Las torres" : "The towers", text: es ? "Tesoro Del Mar, en Dorado, es la primera comunidad ORA World." : "Tesoro Del Mar, in Dorado, is the first ORA World community.", image: tdm.aerialTowers },
    { key: "pool", kicker: x(cip.who.galleryKicker), title: es ? "La piscina" : "The pool", text: es ? "Las torres curvas sobre la piscina del resort." : "The curved towers above the resort pool.", image: tdm.exteriorPull },
    { key: "coast", kicker: x(cip.who.galleryKicker), title: es ? "La costa" : "The coast", text: es ? "Sobre una cala turquesa de la costa norte." : "Above a turquoise cove on the north coast.", image: tdm.aerialCoast },
    { key: "lobby", kicker: x(cip.who.galleryKicker), title: es ? "El vestíbulo" : "The lobby", text: es ? "Doble altura, atendido 24/7." : "Double height, attended 24/7.", image: tdm.foyerAtrium },
    { key: "penthouse", kicker: x(cip.who.galleryKicker), title: "Penthouse", text: es ? "Piso 18, en dos niveles." : "Floor 18, on two levels.", image: tdm.penthouseLiving },
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
      {/* 01 Who we are, in the Cipriani "Amenities & features" layout (client, 16 Nov): the promise and the property specs
          as two cards, one Inquire button, and a swipeable gallery of Tesoro Del Mar on the right. */}
      <CipShowcase
        id="who"
        n="01"
        eyebrow={x(cip.who.eyebrow)}
        title={x(cip.who.title)}
        intro={x(cip.who.intro)}
        cards={[
          { label: x(cip.who.promise.label), items: cip.who.promise.items.map(x) },
          // Tesoro Del Mar property specs, as published on oraworld.com (the huddle's "property specs").
          { label: x(cip.who.specsLabel), items: home.hero.stats.map((st) => `${st.value == null ? "" : st.value.toLocaleString("en-US")} ${x(st.label)}`) },
        ]}
        cta={{ href: "#inquire", label: es ? "Consultar" : "Inquire", track: "cta_inquire" }}
      >
        <CardRail cards={whoCards} label={x(cip.who.galleryKicker)} hint={hint} locale={locale} ratio="5/4" overlay />
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

      {/* 03 Longevity and preventive health */}
      <CipSection
        id="longevity"
        n="03"
        tone="dark"
        eyebrow={x(cip.prevention.eyebrow)}
        title={x(cip.prevention.title)}
        intro={x(cip.prevention.intro)}
        body={x(cip.prevention.body)}
        bullets={cip.prevention.bullets.map(x)}
        wideVisual={false}
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
      </CipSection>

      {/* 04 Fitness, nutrition and aging well */}
      <CipSection id="fitness" n="04" eyebrow={x(cip.fitness.eyebrow)} title={x(cip.fitness.title)} intro={x(cip.fitness.intro)} body={x(cip.fitness.body)} bullets={cip.fitness.bullets.map(x)}>
        <CardRail cards={fitnessCards} label={x(cip.fitness.eyebrow)} hint={hint} locale={locale} />
      </CipSection>

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

      {/* 07 Residences, with the penthouse */}
      <CipSection id="residences" n="07" eyebrow={x(cip.residences.eyebrow)} title={x(cip.residences.title)} intro={x(cip.residences.intro)} bullets={cip.residences.bullets.map(x)}>
        <CardRail cards={residenceCards} label={x(cip.residences.eyebrow)} hint={hint} locale={locale} />
      </CipSection>

      {/* 08 Amenities: the full list, with the ORA health services and the ghost kitchen */}
      <section id="amenities" aria-labelledby="amenities-title" className="border-b border-travertine-deep/60 bg-bone px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1280px]">
          <SectionHead n="08" id="amenities-title" eyebrow={x(cip.amenities.eyebrow)} title={x(cip.amenities.title)} intro={x(cip.amenities.intro)} />
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {cip.amenities.groups.map((g, i) => (
              <div key={i} className={i === 0 ? "rounded-[18px] bg-basalt p-6 text-bone" : "rounded-[18px] bg-white p-6 ring-1 ring-travertine-deep/60"} data-reveal style={{ "--reveal-delay": `${i * 70}ms` } as React.CSSProperties}>
                <p className={i === 0 ? "text-[11px] font-semibold tracking-[0.22em] text-brass-light uppercase" : "text-[11px] font-semibold tracking-[0.22em] text-brass-ink uppercase"}>{x(g.label)}</p>
                <ul className="mt-4 space-y-2.5">
                  {g.items.map((it, k) => (
                    <li key={k} className={i === 0 ? "flex gap-2.5 text-[14px] leading-snug text-bone/90" : "flex gap-2.5 text-[14px] leading-snug text-charcoal-soft"}>
                      <span aria-hidden className="mt-[7px] size-1 shrink-0 rounded-full bg-brass" />
                      {x(it)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <CardRail cards={amenityCards} label={x(cip.amenities.eyebrow)} hint={hint} locale={locale} />
          </div>
        </div>
      </section>

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
        cta={{ href: "#inquire", label: es ? "Consultar" : "Inquire", track: "cta_inquire" }}
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

      {/* 10 Floor plans and pricing */}
      <CipSection
        id="floor-plans"
        n="10"
        eyebrow={x(cip.plans.eyebrow)}
        title={x(cip.plans.title)}
        intro={x(cip.plans.intro)}
        body={x(cip.plans.plansNote)}
        cta={<TextLink href="/residences/plans">{es ? "Biblioteca de planos" : "Floor plan library"}</TextLink>}
      >
        <div>
          <dl className="mb-6 grid grid-cols-3 gap-2 sm:gap-3">
            {cip.plans.tiers.map((tier, i) => (
              <div key={tier.value} className={i === 1 ? "rounded-[16px] bg-basalt px-3 py-4 text-bone sm:p-5" : "rounded-[16px] bg-bone px-3 py-4 ring-1 ring-travertine-deep/70 sm:p-5"}>
                <dt className={i === 1 ? "text-[10.5px] font-semibold tracking-[0.22em] text-brass-light uppercase" : "text-[10.5px] font-semibold tracking-[0.22em] text-brass-ink uppercase"}>{x(tier.label)}</dt>
                <dd className="mt-2 font-[family-name:var(--font-display)] text-[26px] leading-none sm:text-[34px]">{tier.value}</dd>
                <dd className={i === 1 ? "mt-1 text-[12px] text-bone/75" : "mt-1 text-[12px] text-charcoal-soft"}>{es ? "por pie²" : "per sq ft"}</dd>
              </div>
            ))}
          </dl>
          <CardRail cards={planCards} label={x(cip.plans.eyebrow)} hint={hint} locale={locale} ratio="22/17" fit="contain" />
        </div>
      </CipSection>

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

      {/* 12 Inquire */}
      <CipSection
        id="inquire"
        n="12"
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
          <LeadFormLazy variant="full" consentText={settings.consentText[locale]} submitLabel={es ? "Consultar" : "Inquire"} />
        </div>
      </CipSection>
    </div>
  );
}
