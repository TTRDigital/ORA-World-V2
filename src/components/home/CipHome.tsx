import type { Locale } from "@/content/types";
import { getFloorPlans, getSiteSettings } from "@/lib/content";
import { t } from "@/lib/localize";
import { cip } from "@/content/seed/homeCip";
import { charters as chartersCopy } from "@/content/seed/sales";
import { tdm, life } from "@/content/seed/images";
import { Link } from "@/i18n/navigation";
import { CipSection } from "@/components/cip/CipSection";
import { CardRail, type RailCard } from "@/components/cip/CardRail";
import { LeadFormLazy } from "@/components/forms/LeadFormLazy";
import { ArrowRight } from "@/components/ui/Icons";
import { HomeTourStage } from "./HomeTourStage";
import { AliveImage } from "@/components/cip/AliveImage";

const es = (locale: Locale) => locale === "es";

/**
 * The homepage after the client's Cipriani Residences reference: a video banner, then eight calm sections in one
 * repeated layout (numbered eyebrow, serif capitals, a short line, a few bullets, one gold button, and a row of
 * living pictures). Tesoro Del Mar only.
 */
export async function CipHome({ locale }: { locale: Locale }) {
  const [settings, plans] = await Promise.all([getSiteSettings(), getFloorPlans()]);
  const x = (l: Parameters<typeof t>[0]) => t(l, locale);
  const requestCta = (
    <a href="#contact" className="cta" data-track="cta_request_pricing">
      {es(locale) ? "Solicitar precios y planos" : "Request pricing & floor plans"} <ArrowRight width={14} height={14} />
    </a>
  );
  const hint = es(locale) ? "Use las flechas o deslice" : "Use arrows or swipe";

  const amenityCards: RailCard[] = [
    { key: "club", kicker: es(locale) ? "Clubhouse" : "Clubhouse", title: es(locale) ? "El Clubhouse" : "The Clubhouse", text: es(locale) ? "Club privado de 14,000 pies² con restaurante y bar." : "A members-only club of 14,000 sq ft with dining and a bar.", image: tdm.foyerLounge },
    { key: "gym", kicker: es(locale) ? "Bienestar" : "Wellness", title: es(locale) ? "Gimnasio" : "Fitness", text: es(locale) ? "Gimnasio de última generación y estudio de pilates." : "A state-of-the-art fitness center and pilates studio.", image: tdm.gym },
    { key: "pool", kicker: es(locale) ? "Piscina" : "Pool", title: es(locale) ? "Piscina y cabañas" : "Pool and cabanas", text: es(locale) ? "Piscina estilo resort con solárium y bar." : "A resort-style pool with sundeck and poolside bar.", image: tdm.exteriorPull },
    { key: "putting", kicker: es(locale) ? "Golf" : "Golf", title: es(locale) ? "Campo de putting" : "Putting course", text: es(locale) ? "Campo de putting de 18 hoyos de nueva generación." : "A next-generation 18-hole putting course.", image: tdm.exteriorGolf },
    { key: "beach", kicker: es(locale) ? "Costa" : "Coast", title: es(locale) ? "Club de playa" : "Beach club", text: es(locale) ? "Servicio de comida y bebida y rampa para botes." : "Food and beverage service and a boat slipway.", image: tdm.aerialCoast },
    { key: "arrival", kicker: es(locale) ? "Llegada" : "Arrival", title: es(locale) ? "Vestíbulo 24/7" : "Lobby, attended 24/7", text: es(locale) ? "Pórtico, valet y auto de la casa." : "Porte-cochère, valet and a house car.", image: tdm.entrance },
  ];

  const residenceCards: RailCard[] = [
    { key: "foyer", kicker: es(locale) ? "Llegada" : "Arrival", title: es(locale) ? "El vestíbulo" : "The foyer", text: es(locale) ? "Vestíbulo de doble altura." : "A double-height lobby.", image: tdm.foyerAtrium },
    { key: "living", kicker: es(locale) ? "Residencia" : "Residence", title: es(locale) ? "Sala y comedor" : "Living and dining", text: es(locale) ? "Ventanales y acceso a la terraza." : "Floor-to-ceiling glass and terrace access.", image: tdm.kitchenDining },
    { key: "kitchen", kicker: es(locale) ? "Cocina" : "Kitchen", title: es(locale) ? "Cocina italiana" : "Italian kitchen", text: es(locale) ? "Gabinetes Scavolini y electrodomésticos Gaggenau." : "Scavolini cabinetry and Gaggenau appliances.", image: tdm.kitchenWine },
    { key: "suite", kicker: es(locale) ? "Dormitorio" : "Bedroom", title: es(locale) ? "Suite principal" : "Primary suite", text: es(locale) ? "Vista al mar a través del vidrio." : "Ocean views through floor-to-ceiling glass.", image: tdm.masterSuite },
    { key: "bath", kicker: es(locale) ? "Baño" : "Bath", title: es(locale) ? "Baño principal" : "Primary bath", text: es(locale) ? "Mármol y grifería Dornbracht." : "Marble and Dornbracht fittings.", image: tdm.vanity },
    { key: "ocean", kicker: es(locale) ? "Dormitorio" : "Bedroom", title: es(locale) ? "Frente al mar" : "Facing the ocean", text: es(locale) ? "Cortinas motorizadas en cada habitación." : "Motorized shades in every room.", image: tdm.bedroomOcean },
  ];

  const penthouseCards: RailCard[] = [
    { key: "ph-living", kicker: "Penthouse", title: es(locale) ? "Salón de doble altura" : "Double-height salon", image: tdm.penthouseLiving },
    { key: "ph-dining", kicker: "Penthouse", title: es(locale) ? "Comedor" : "Dining", image: tdm.penthouseDining },
    { key: "ph-piano", kicker: "Penthouse", title: es(locale) ? "Salón con piano" : "Piano salon", image: tdm.penthousePiano },
  ];

  const planCards: RailCard[] = plans.map((p) => ({
    key: p.slug,
    kicker: `${es(locale) ? "Pisos" : "Floors"} ${p.floors ?? ""}`,
    title: t(p.name, locale),
    meta: `${p.bedrooms} ${es(locale) ? "dorm." : "bed"} · ${p.bathrooms} ${es(locale) ? "baños" : "bath"}${p.powder ? ` + ${p.powder} ${es(locale) ? "medio baño" : "powder"}` : ""} · ${p.interiorSqFt?.toLocaleString("en-US")} ${es(locale) ? "pies² int." : "sq ft interior"}`,
    image: p.image,
    href: `/${locale}/residences/plans/${p.slug}`,
    cta: es(locale) ? "Ver el plano" : "View floor plan",
  }));

  return (
    <div className="flex flex-col">
      <CipSection id="virtual-tour" n="01" eyebrow={x(cip.tour.eyebrow)} title={x(cip.tour.title)} intro={x(cip.tour.intro)} tone="dark" cta={requestCta}>
        <HomeTourStage vrUrl={settings.vrTourUrl} filmId={settings.introFilmYoutubeId} poster={tdm.penthouseDining} filmPoster={tdm.aerialCoast} locale={locale} />
      </CipSection>

      <CipSection
        id="amenities"
        n="02"
        eyebrow={x(cip.amenities.eyebrow)}
        title={x(cip.amenities.title)}
        intro={x(cip.amenities.intro)}
        groups={cip.amenities.groups.map((g) => ({ label: x(g.label), items: g.items.map(x) }))}
        cta={requestCta}
      >
        <CardRail cards={amenityCards} label={x(cip.amenities.eyebrow)} hint={hint} locale={locale} />
      </CipSection>

      <CipSection id="residences" n="03" tone="pale" eyebrow={x(cip.residences.eyebrow)} title={x(cip.residences.title)} intro={x(cip.residences.intro)} bullets={cip.residences.bullets.map(x)} cta={requestCta}>
        <CardRail cards={residenceCards} label={x(cip.residences.eyebrow)} hint={hint} locale={locale} />
      </CipSection>

      <CipSection id="penthouse" n="04" tone="dark" eyebrow={x(cip.penthouse.eyebrow)} title={x(cip.penthouse.title)} intro={x(cip.penthouse.intro)} bullets={cip.penthouse.bullets.map(x)} cta={requestCta}>
        <CardRail cards={penthouseCards} label={x(cip.penthouse.eyebrow)} hint={hint} locale={locale} dark />
      </CipSection>

      <CipSection
        id="floor-plans"
        n="05"
        eyebrow={x(cip.plans.eyebrow)}
        title={x(cip.plans.title)}
        intro={x(cip.plans.intro)}
        cta={
          <>
            {settings.floorPlansUrl && (
              <a href={settings.floorPlansUrl} target="_blank" rel="noopener" className="cta" data-track="floor_plans_pdf">
                {es(locale) ? "Planos completos (PDF)" : "Full floor plans (PDF)"} <ArrowRight width={14} height={14} />
              </a>
            )}
            <Link href="/residences/plans" className="cta cta-ghost text-charcoal">
              {es(locale) ? "Biblioteca de planos" : "Floor plan library"}
            </Link>
          </>
        }
      >
        <div>
          <dl className="mb-6 grid grid-cols-3 gap-2 sm:gap-3">
            {cip.plans.tiers.map((tier, i) => (
              <div key={tier.value} className={i === 1 ? "rounded-[16px] bg-basalt px-3 py-4 text-bone sm:p-5" : "rounded-[16px] bg-bone px-3 py-4 ring-1 ring-travertine-deep/70 sm:p-5"}>
                <dt className={i === 1 ? "text-[10.5px] font-semibold tracking-[0.22em] text-brass-light uppercase" : "text-[10.5px] font-semibold tracking-[0.22em] text-brass-ink uppercase"}>{x(tier.label)}</dt>
                <dd className="mt-2 font-[family-name:var(--font-display)] text-[26px] leading-none sm:text-[34px]">{tier.value}</dd>
                <dd className={i === 1 ? "mt-1 text-[12px] text-bone/75" : "mt-1 text-[12px] text-charcoal-soft"}>{es(locale) ? "por pie²" : "per sq ft"}</dd>
              </div>
            ))}
          </dl>
          <CardRail cards={planCards} label={x(cip.plans.eyebrow)} hint={hint} locale={locale} ratio="22/17" fit="contain" />
        </div>
      </CipSection>

      <CipSection id="charters" n="06" tone="pale" eyebrow={x(cip.charters.eyebrow)} title={x(cip.charters.title)} intro={x(chartersCopy.body)} bullets={cip.charters.bullets.map(x)} cta={requestCta} wideVisual={false}>
        <AliveImage image={life.jet} locale={locale} ratio="4/5" sizes="(max-width: 1023px) calc(100vw - 40px), 600px" />
      </CipSection>

      <CipSection id="location" n="07" eyebrow={x(cip.location.eyebrow)} title={x(cip.location.title)} intro={x(cip.location.intro)} bullets={cip.location.bullets.map(x)} cta={requestCta} wideVisual={false}>
        <div>
          <AliveImage image={tdm.aerialCoast} locale={locale} ratio="4/3" sizes="(max-width: 1023px) calc(100vw - 40px), 600px" />
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[16px] bg-bone p-5 ring-1 ring-travertine-deep/70">
            <div>
              <p className="text-[10.5px] font-semibold tracking-[0.24em] text-brass-ink uppercase">{es(locale) ? "Dirección" : "Address"}</p>
              <p className="mt-1 text-[16px]">{x(cip.location.address)}</p>
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${settings.siteLat},${settings.siteLng}`}
              target="_blank"
              rel="noopener"
              className="text-[11px] font-semibold tracking-[0.22em] text-brass-ink uppercase hover:text-charcoal"
            >
              {es(locale) ? "Abrir en Google Maps" : "Open in Google Maps"} →
            </a>
          </div>
        </div>
      </CipSection>

      <CipSection
        id="contact"
        n="08"
        tone="dark"
        eyebrow={x(cip.contact.eyebrow)}
        title={x(cip.contact.title)}
        intro={x(cip.contact.intro)}
        bullets={cip.contact.bullets.map(x)}
        wideVisual={false}
        cta={
          settings.phone ? (
            <a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`} className="cta cta-ghost text-bone">
              {settings.phone}
            </a>
          ) : undefined
        }
      >
        <div data-tone="light" className="light-card rounded-[22px] bg-white p-6 text-charcoal shadow-lift md:p-8">
          <LeadFormLazy variant="full" consentText={settings.consentText[locale]} submitLabel={es(locale) ? "Solicitar precios y planos" : "Request pricing & floor plans"} />
        </div>
      </CipSection>
    </div>
  );
}
