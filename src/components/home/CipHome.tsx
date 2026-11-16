import type { Locale } from "@/content/types";
import { getHome, getSiteSettings } from "@/lib/content";
import { t } from "@/lib/localize";
import { cip } from "@/content/seed/homeCip";
import { tdm, life } from "@/content/seed/images";
import { Link } from "@/i18n/navigation";
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
  const k = x(cip.who.galleryKicker);
  // Client's clips (16 Nov): the pool cabana, the lobby, the gym, the entrance and the cove play as films.
  const v = (n: string) => ({ video: `/videos/amenity-${n}.mp4`, poster: `/videos/amenity-${n}-poster.jpg` });
  const whoCards: RailCard[] = [
    // Client, 16 Nov: the aerial cove film first, titled "View".
    { key: "view", kicker: k, title: es ? "Vista" : "View", text: es ? "Sobre una cala turquesa de la costa norte." : "Above a turquoise cove on the north coast.", image: tdm.aerialCoast, ...v("cove") },
    // Client, 16 Nov: the penthouse living film second, titled "Luxury Living".
    { key: "luxury", kicker: k, title: es ? "Vida de lujo" : "Luxury Living", text: es ? "El salón del penthouse, piso 18." : "The penthouse living room, floor 18.", image: tdm.penthouseLiving, ...v("penthouse") },
    { key: "pool", kicker: k, title: es ? "Piscina" : "Pool deck", text: es ? "Estilo resort, con solárium y bar." : "Resort-style, with sundeck and poolside bar.", image: tdm.exteriorPull, ...v("pool") },
    { key: "lobby", kicker: k, title: es ? "Vestíbulo" : "Lobby", text: es ? "Doble altura, atendido 24/7." : "Double height, attended 24/7.", image: tdm.foyerAtrium, ...v("lobby") },
    { key: "fitness", kicker: k, title: es ? "Gimnasio" : "Fitness", text: es ? "Gimnasio y estudio de pilates con vista al jardín." : "Fitness center and pilates studio with garden views.", image: tdm.gym, ...v("gym") },
    { key: "arrival", kicker: k, title: es ? "Llegada" : "Arrival", text: es ? "Pórtico, valet y auto de la casa." : "Porte-cochère, valet and the house car.", image: tdm.entrance, ...v("entrance") },
    { key: "clubhouse", kicker: k, title: "Clubhouse", text: es ? "Club privado de 14,000 pies²." : "A members-only club of 14,000 sq ft.", image: tdm.foyerLounge },
    { key: "spa", kicker: k, title: "Spa", text: es ? "Masajes, tratamientos y salón." : "Massage, treatments and salon services.", image: life.spa },
    { key: "putting", kicker: k, title: es ? "Campo de putting" : "Putting course", text: es ? "Dieciocho hoyos junto a la piscina." : "Eighteen holes beside the pool.", image: tdm.exteriorGolf },
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
          <h2 id="why-ora-world-title" className="text-center font-[family-name:var(--font-script)] text-[30px] leading-snug font-normal text-charcoal md:text-[44px]" data-reveal>
            {x(cip.different.script)}
          </h2>
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
              { title: es ? "Sala y comedor" : "Living & dining", note: es ? "Interior de residencia" : "Residence interior", image: tdm.kitchenDining, video: "/videos/interior-living.mp4", poster: "/videos/interior-living-poster.jpg" },
              { title: es ? "Cocina gourmet" : "Gourmet kitchen", note: es ? "Gabinetes italianos" : "Italian cabinetry", image: tdm.kitchenWine, video: "/videos/interior-kitchen.mp4", poster: "/videos/interior-kitchen-poster.jpg" },
              { title: es ? "Suite principal" : "Primary suite", note: es ? "Interior de residencia" : "Residence interior", image: tdm.masterSuite },
              { title: es ? "Dormitorio" : "Bedroom", note: es ? "Vista al mar" : "Ocean view", image: tdm.bedroomOcean },
              { title: es ? "Baño principal" : "Primary bath", note: "Dornbracht", image: tdm.vanity },
              { title: es ? "Medio baño" : "Powder room", note: es ? "Madera y piedra" : "Wood and stone", image: tdm.powderRoom },
              { title: es ? "Estudio" : "Study", note: es ? "Interior de residencia" : "Residence interior", image: tdm.aptStudy },
              { title: "Penthouse", note: es ? "Piso 18, dos niveles" : "Floor 18, two levels", image: tdm.penthouseLiving },
            ]}
          />
        </div>
        <div className="mx-auto mt-14 grid max-w-[1280px] gap-10 px-5 md:mt-20 md:grid-cols-2 md:gap-16 md:px-10 xl:px-0">
          {cip.interiors.lists.map((l) => (
            <div key={x(l.title)} data-reveal>
              <h3 className="mb-4 font-[family-name:var(--font-display)] text-[28px] font-medium text-charcoal italic md:text-[32px]">{x(l.title)}</h3>
              <ul className="border-t border-travertine-deep">
                {l.items.map((it) => (
                  <li key={x(it)} className="grid grid-cols-[2rem_minmax(0,1fr)] items-baseline border-b border-travertine-deep py-3.5 text-[15px] text-charcoal">
                    <span aria-hidden className="text-brass">—</span>
                    {x(it)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex justify-center" data-reveal>
          {inquireBtn}
        </div>
      </section>

      {/* 04 Step inside: the 360° tour and the film, full width so people can see it big */}
      <section id="virtual-tour" aria-labelledby="virtual-tour-title" data-tone="dark" className="on-dark border-b border-basalt bg-basalt px-3 py-16 text-bone md:px-6 md:py-24">
        <div className="mx-auto max-w-[1400px]">
          <div className="px-2 md:px-4">
            <SectionHead n="04" id="virtual-tour-title" eyebrow={x(cip.tour.eyebrow)} title={x(cip.tour.title)} intro={x(cip.tour.intro)} dark />
          </div>
          <div className="mt-10 md:mt-12">
            <HomeTourStage vrUrl={settings.vrTourUrl} filmId={settings.introFilmYoutubeId} poster={tdm.penthouseDining} filmPoster={tdm.aerialCoast} locale={locale} wide />
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

      {/* 06 Three steps */}
      <section id="steps" aria-labelledby="steps-title" className="border-b border-travertine-deep/60 bg-bone px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1280px]">
          <p className="eyebrow" data-n="06" data-reveal>
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
