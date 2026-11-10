import type { Locale } from "@/content/types";
import { getFloorPlans, getSiteSettings } from "@/lib/content";
import { t } from "@/lib/localize";
import { cip } from "@/content/seed/homeCip";
import { tdm, life } from "@/content/seed/images";
import { Link } from "@/i18n/navigation";
import { CipSection } from "@/components/cip/CipSection";
import { CardRail, type RailCard } from "@/components/cip/CardRail";
import { AliveImage } from "@/components/cip/AliveImage";
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
 * Rico (the nine-day week, the tax decree) → step inside (360° tour and film, full width) → residences → amenities (the
 * full list, ORA health services and the ghost kitchen) → private charters → floor plans and pricing → three steps →
 * Inquire. One layout throughout, after theresidencesatcipriani.com; one gold button, "Inquire".
 */
export async function CipHome({ locale }: { locale: Locale }) {
  const [settings, plans] = await Promise.all([getSiteSettings(), getFloorPlans()]);
  const x = (l: Parameters<typeof t>[0]) => t(l, locale);
  const es = locale === "es";
  const hint = es ? "Use las flechas o deslice" : "Use arrows or swipe";

  const fitnessCards: RailCard[] = [
    { key: "gym", kicker: es ? "Entrenamiento" : "Training", title: es ? "Gimnasio y pilates" : "Fitness and pilates", text: es ? "Un programa pensado para que sea fácil." : "A program designed to make it easy.", image: tdm.gym },
    { key: "spa", kicker: es ? "Recuperación" : "Recovery", title: "Spa", text: es ? "Masajes, tratamientos y salón." : "Massage, treatments and salon services.", image: life.spa },
    { key: "walk", kicker: es ? "Movimiento" : "Movement", title: es ? "Sendero de dos millas" : "Two-mile walking path", text: es ? "Entre jardines, cerca del parque nacional." : "Through gardens, beside a national park.", image: tdm.aerialForest },
    { key: "putting", kicker: es ? "Movimiento" : "Movement", title: es ? "Campo de putting" : "Putting course", text: es ? "Dieciocho hoyos junto a la piscina." : "Eighteen holes beside the pool.", image: tdm.exteriorGolf },
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
      {/* 01 Who we are: the core promise and the founder */}
      <CipSection id="who" n="01" eyebrow={x(cip.who.eyebrow)} title={x(cip.who.title)} intro={x(cip.who.intro)} body={x(cip.who.body)} wideVisual={false}>
        <div className="grid gap-4">
          <AliveImage image={tdm.aerialTowers} locale={locale} ratio="16/10" sizes="(max-width: 1023px) calc(100vw - 40px), 620px" />
          <div className="rounded-[18px] bg-bone p-6 ring-1 ring-travertine-deep/70 md:p-7">
            <p className="text-[10.5px] font-semibold tracking-[0.26em] text-brass-ink uppercase">{x(cip.who.founder.label)}</p>
            <p className="mt-2 text-[16px] leading-relaxed text-charcoal">{x(cip.who.founder.text)}</p>
          </div>
          <blockquote className="border-l-2 border-brass pl-5 font-[family-name:var(--font-display)] text-[22px] leading-snug text-charcoal italic md:text-[24px]">
            “{x(cip.who.quote)}”
          </blockquote>
        </div>
      </CipSection>

      {/* 02 Why ORA World: how it is different, and why you can trust it */}
      <section id="why-ora-world" aria-labelledby="why-ora-world-title" className="border-b border-travertine-deep/60 bg-bone px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1280px]">
          <SectionHead n="02" id="why-ora-world-title" eyebrow={x(cip.different.eyebrow)} title={x(cip.different.title)} intro={x(cip.different.intro)} />
          <ol className="mt-10 grid gap-4 md:grid-cols-3 md:gap-6">
            {cip.different.items.map((item, i) => (
              <li key={item.href} className="flex flex-col rounded-[20px] bg-white p-6 ring-1 ring-travertine-deep/60 md:p-8" data-reveal style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}>
                <span aria-hidden className="h-px w-12 bg-brass" />
                <h3 className="display-s mt-5 text-charcoal">{x(item.title)}</h3>
                <p className="mt-2 flex-1 text-[15px] leading-relaxed text-charcoal-soft">{x(item.text)}</p>
                <div className="mt-4">
                  <TextLink href={item.href}>{es ? "Leer más" : "Read more"}</TextLink>
                </div>
              </li>
            ))}
          </ol>
          <ul className="mt-8 flex flex-col gap-3 border-t border-travertine-deep pt-6 text-[13px] text-charcoal-soft md:flex-row md:flex-wrap md:gap-x-10" aria-label={es ? "Confianza" : "Why you can trust it"}>
            {cip.different.trust.map((tr, i) => (
              <li key={i} className="flex items-center gap-2.5">
                <span aria-hidden className="size-1.5 rounded-full bg-brass" />
                {x(tr)}
              </li>
            ))}
          </ul>
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
          <AliveImage image={tdm.gym} locale={locale} ratio="4/5" sizes="(max-width: 1023px) calc(100vw - 40px), 600px" />
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

      {/* 05 Why Puerto Rico: the nine-day week and the decree */}
      <CipSection
        id="why-puerto-rico"
        n="05"
        tone="pale"
        eyebrow={x(cip.why.eyebrow)}
        title={x(cip.why.title)}
        intro={x(cip.why.intro)}
        body={x(cip.why.body)}
        bullets={cip.why.bullets.map(x)}
        cta={
          <>
            <TextLink href={cip.why.verifyUrl} external>{x(cip.why.verify)}</TextLink>
            <TextLink href="/invest">{x(cip.why.link)}</TextLink>
          </>
        }
        note={x(cip.why.note)}
        wideVisual={false}
      >
        <dl className="grid gap-3">
          {cip.why.stats.map((st) => (
            <div key={st.value} className="flex items-baseline gap-5 rounded-[18px] bg-white px-6 py-5 ring-1 ring-travertine-deep/70 md:px-8 md:py-6">
              <dt className="sr-only">{x(st.label)}</dt>
              <dd className="w-[3.6ch] shrink-0 font-[family-name:var(--font-display)] text-[46px] leading-none text-brass-ink md:text-[58px]">{st.value}</dd>
              <dd aria-hidden className="text-[15px] leading-snug text-charcoal md:text-[17px]">{x(st.label)}</dd>
            </div>
          ))}
        </dl>
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

      {/* 09 Private charters */}
      <CipSection id="charters" n="09" tone="dark" eyebrow={x(cip.charters.eyebrow)} title={x(cip.charters.title)} intro={x(cip.charters.intro)} bullets={cip.charters.bullets.map(x)} wideVisual={false}>
        <AliveImage image={life.jet} locale={locale} ratio="4/5" sizes="(max-width: 1023px) calc(100vw - 40px), 600px" />
      </CipSection>

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
