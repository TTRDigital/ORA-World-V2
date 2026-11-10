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
import { ArrowRight } from "@/components/ui/Icons";
import { HomeTourStage } from "./HomeTourStage";

const isEs = (locale: Locale) => locale === "es";

/** A quiet text link in tracked capitals (the page keeps one gold button: "Inquire"). */
function TextLink({ href, children, dark = false }: { href: string; children: React.ReactNode; dark?: boolean }) {
  const cls = `inline-flex min-h-11 items-center gap-2 text-[11px] font-semibold tracking-[0.22em] uppercase ${dark ? "text-brass-light hover:text-bone" : "text-brass-ink hover:text-charcoal"}`;
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

/**
 * The homepage story (client call, 10 Nov 2026): who ORA World is → why Puerto Rico (Act 60) → longevity → what ORA
 * World offers (tour and film, residences, amenities, private charters) → how ORA World helps (floor plans and pricing,
 * three steps) → Inquire. One layout throughout, after theresidencesatcipriani.com; one gold button, "Inquire".
 */
export async function CipHome({ locale }: { locale: Locale }) {
  const [settings, plans] = await Promise.all([getSiteSettings(), getFloorPlans()]);
  const x = (l: Parameters<typeof t>[0]) => t(l, locale);
  const es = isEs(locale);
  const hint = es ? "Use las flechas o deslice" : "Use arrows or swipe";

  const longevityCards: RailCard[] = [
    { key: "gym", kicker: es ? "Bienestar" : "Wellness", title: es ? "Gimnasio y pilates" : "Fitness and pilates", text: es ? "Un gimnasio de última generación." : "A state-of-the-art fitness center.", image: tdm.gym },
    { key: "spa", kicker: es ? "Bienestar" : "Wellness", title: "Spa", text: es ? "Masajes, tratamientos y salón." : "Massage, treatments and salon services.", image: life.spa },
    { key: "walk", kicker: es ? "Naturaleza" : "Nature", title: es ? "Sendero de dos millas" : "Two-mile walking path", text: es ? "Entre jardines, cerca del parque nacional." : "Through gardens, beside a national park.", image: tdm.aerialForest },
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
      {/* 01 Who is ORA World */}
      <CipSection id="who" n="01" eyebrow={x(cip.who.eyebrow)} title={x(cip.who.title)} intro={x(cip.who.intro)} body={x(cip.who.body)} wideVisual={false}>
        <div>
          <AliveImage image={tdm.aerialTowers} locale={locale} ratio="4/3" sizes="(max-width: 1023px) calc(100vw - 40px), 620px" />
          <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {cip.who.facts.map((f) => (
              <div key={f.value} className="rounded-[14px] bg-bone px-4 py-3.5 ring-1 ring-travertine-deep/70">
                <dt className="sr-only">{x(f.label)}</dt>
                <dd className="font-[family-name:var(--font-display)] text-[28px] leading-none text-charcoal">{f.value}</dd>
                <dd aria-hidden className="mt-1.5 text-[12px] leading-snug text-charcoal-soft">{x(f.label)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </CipSection>

      {/* 02 Why Puerto Rico: taxes */}
      <CipSection
        id="why-puerto-rico"
        n="02"
        tone="dark"
        eyebrow={x(cip.why.eyebrow)}
        title={x(cip.why.title)}
        intro={x(cip.why.intro)}
        bullets={cip.why.bullets.map(x)}
        cta={<TextLink href="/invest" dark>{x(cip.why.link)}</TextLink>}
        note={x(cip.why.note)}
        wideVisual={false}
      >
        <dl className="grid gap-3">
          {cip.why.stats.map((st) => (
            <div key={st.value} className="flex items-baseline gap-5 rounded-[18px] bg-white/5 px-6 py-5 ring-1 ring-white/10 md:px-8 md:py-6">
              <dt className="sr-only">{x(st.label)}</dt>
              <dd className="w-[3.2ch] shrink-0 font-[family-name:var(--font-display)] text-[52px] leading-none text-brass-light md:text-[64px]">{st.value}</dd>
              <dd aria-hidden className="text-[15px] leading-snug text-bone/85 md:text-[17px]">{x(st.label)}</dd>
            </div>
          ))}
        </dl>
      </CipSection>

      {/* 03 Longevity */}
      <CipSection id="longevity" n="03" eyebrow={x(cip.longevity.eyebrow)} title={x(cip.longevity.title)} intro={x(cip.longevity.intro)} bullets={cip.longevity.bullets.map(x)}>
        <CardRail cards={longevityCards} label={x(cip.longevity.eyebrow)} hint={hint} locale={locale} />
      </CipSection>

      {/* 04 Step inside: tour and film */}
      <CipSection id="virtual-tour" n="04" tone="dark" eyebrow={x(cip.tour.eyebrow)} title={x(cip.tour.title)} intro={x(cip.tour.intro)}>
        <HomeTourStage vrUrl={settings.vrTourUrl} filmId={settings.introFilmYoutubeId} poster={tdm.penthouseDining} filmPoster={tdm.aerialCoast} locale={locale} />
      </CipSection>

      {/* 05 Residences, with the penthouse */}
      <CipSection id="residences" n="05" tone="pale" eyebrow={x(cip.residences.eyebrow)} title={x(cip.residences.title)} intro={x(cip.residences.intro)} bullets={cip.residences.bullets.map(x)}>
        <CardRail cards={residenceCards} label={x(cip.residences.eyebrow)} hint={hint} locale={locale} />
      </CipSection>

      {/* 06 Amenities */}
      <CipSection
        id="amenities"
        n="06"
        eyebrow={x(cip.amenities.eyebrow)}
        title={x(cip.amenities.title)}
        intro={x(cip.amenities.intro)}
        groups={cip.amenities.groups.map((g) => ({ label: x(g.label), items: g.items.map(x) }))}
      >
        <CardRail cards={amenityCards} label={x(cip.amenities.eyebrow)} hint={hint} locale={locale} />
      </CipSection>

      {/* 07 Private charters */}
      <CipSection id="charters" n="07" tone="dark" eyebrow={x(cip.charters.eyebrow)} title={x(cip.charters.title)} intro={x(cip.charters.intro)} bullets={cip.charters.bullets.map(x)} wideVisual={false}>
        <AliveImage image={life.jet} locale={locale} ratio="4/5" sizes="(max-width: 1023px) calc(100vw - 40px), 600px" />
      </CipSection>

      {/* 08 Floor plans and pricing */}
      <CipSection
        id="floor-plans"
        n="08"
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

      {/* 09 Three steps */}
      <section id="steps" aria-labelledby="steps-title" className="border-b border-travertine-deep/60 bg-bone px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1280px]">
          <p className="eyebrow" data-n="09" data-reveal>
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

      {/* 10 Inquire */}
      <CipSection
        id="inquire"
        n="10"
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
