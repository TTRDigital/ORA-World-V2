import type { Locale } from "@/content/types";
import { t } from "@/lib/localize";
import { cip } from "@/content/seed/homeCip";
import { tdm, life } from "@/content/seed/images";
import { CipShowcase } from "@/components/cip/CipShowcase";
import { CardRail, type RailCard } from "@/components/cip/CardRail";
import { LoopVideo } from "@/components/cip/LoopVideo";
import { ArrowRight } from "@/components/ui/Icons";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

/**
 * The Longevity page's two sections (client, 16 Nov: moved from the homepage to their own page): preventive health
 * ("Planes don't fall from the sky", with the gym film) and fitness and nutrition ("Your body is self-made", with the
 * film gallery), in the Cipriani layout.
 */
export function LongevitySections({ locale }: { locale: Locale }) {
  const x = (l: Parameters<typeof t>[0]) => t(l, locale);
  const es = locale === "es";
  const inquire = { href: "/#inquire", label: es ? "Consultar" : "Inquire", track: "cta_inquire" };
  // Client, 15 Nov: each card plays a short film (a camera move made from its picture), not a still.
  const fitnessCards: RailCard[] = [
    { key: "gym", kicker: es ? "Entrenamiento" : "Training", title: es ? "Gimnasio y pilates" : "Fitness and pilates", text: es ? "Un programa pensado para que sea fácil." : "A program designed to make it easy.", image: tdm.gym, video: "/videos/fitness-gym.mp4", poster: "/videos/fitness-gym-poster.jpg" },
    { key: "spa", kicker: es ? "Recuperación" : "Recovery", title: "Spa", text: es ? "Masajes, tratamientos y salón." : "Massage, treatments and salon services.", image: life.spa, video: "/videos/fitness-spa.mp4", poster: "/videos/fitness-spa-poster.jpg" },
    { key: "walk", kicker: es ? "Movimiento" : "Movement", title: es ? "Sendero de dos millas" : "Two-mile walking path", text: es ? "Entre jardines, cerca del parque nacional." : "Through gardens, beside a national park.", image: tdm.aerialForest, video: "/videos/fitness-walk.mp4", poster: "/videos/fitness-walk-poster.jpg" },
    { key: "putting", kicker: es ? "Movimiento" : "Movement", title: es ? "Campo de putting" : "Putting course", text: es ? "Dieciocho hoyos junto a la piscina." : "Eighteen holes beside the pool.", image: tdm.exteriorGolf, video: "/videos/fitness-putting.mp4", poster: "/videos/fitness-putting-poster.jpg" },
  ];

  const lp = cip.longevityPage;
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="flex flex-col">
      {/* The promise (client, 18 Nov, from the owner's brief §1): four steps, one leading to the next. */}
      <section id="promise" aria-labelledby="promise-title" className="border-b border-travertine-deep/60 bg-bone px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1280px]">
          <p className="eyebrow" data-reveal>
            <span className="rule" aria-hidden />
            {x(lp.promiseLabel)}
          </p>
          <h2 id="promise-title" className="mt-5 font-[family-name:var(--font-display)] text-[36px] leading-[1.08] font-normal text-charcoal md:text-[52px]" data-reveal>
            {x(lp.promiseTitle)}
          </h2>
          <ol className="relative mt-12 grid gap-10 md:mt-16 md:grid-cols-4 md:gap-8">
            <span aria-hidden className="absolute top-[22px] right-[12%] left-[12%] hidden h-px bg-brass/50 md:block" />
            {lp.steps.map((st, k) => (
              <li key={k} className="relative" data-reveal>
                <span className="relative grid size-11 place-items-center rounded-full bg-bone font-[family-name:var(--font-display)] text-[18px] text-brass-ink ring-1 ring-brass [font-variant-numeric:lining-nums]">{k + 1}</span>
                <h3 className="mt-5 font-[family-name:var(--font-display)] text-[26px] leading-tight text-charcoal">{x(st.title)}</h3>
                <p className="mt-2 max-w-[30ch] text-[15px] leading-relaxed text-charcoal-soft">{x(st.text)}</p>
              </li>
            ))}
          </ol>
          <p className="mx-auto mt-14 max-w-[40ch] text-center font-[family-name:var(--font-display)] text-[24px] leading-snug text-charcoal italic md:mt-20 md:text-[30px]" data-reveal>
            “{x(lp.promiseQuote)}”
          </p>
        </div>
      </section>

      {/* 01 Longevity and preventive health, in the Cipriani layout (client, 16 Nov): the services as two cards, the gym
          film on the right. */}
      <CipShowcase
        id="longevity"
        n=""
        dark
        eyebrow={x(cip.prevention.eyebrow)}
        title={x(cip.prevention.title)}
        // The owner's core promise (brief §1) opens the section; the redundancy lines and the check-up paragraph follow.
        intro={x(cip.who.intro)}
        body={`${x(cip.prevention.intro)} ${x(cip.prevention.body)}`}
        cards={[
          { label: x(cip.prevention.cardLabels[0]), items: cip.prevention.bullets.slice(0, 2).map(x) },
          { label: x(cip.prevention.cardLabels[1]), items: cip.prevention.bullets.slice(2).map(x) },
        ]}
        cta={inquire}
      >
        <figure className="relative overflow-hidden rounded-[22px]">
          {/* Client, 18 Nov: the gym film with the woman walking on the treadmill, framed on her. */}
          <LoopVideo
            src="/videos/clips/p14-gym.mp4"
            poster="/videos/clips/p14-gym-poster.jpg"
            ratio="4/5"
            focal="72% 50%"
            label={es ? "Una residente camina en la cinta del gimnasio de Tesoro Del Mar, con vista al jardín" : "A resident walking on a treadmill in the Tesoro Del Mar fitness center, with garden views"}
          />
          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-basalt via-basalt/80 to-transparent p-6 pt-24 md:p-9 md:pt-32">
            <p className="font-[family-name:var(--font-display)] text-[28px] leading-tight text-bone md:text-[36px]">“{x(cip.prevention.question)}”</p>
            <p className="mt-3 max-w-[48ch] text-[14px] leading-relaxed text-bone/80">{x(cip.prevention.questionSub)}</p>
          </figcaption>
        </figure>
      </CipShowcase>

      {/* Your ORA program (client, 18 Nov, from the owner's brief §4: "the full list of amenities shown"): the seven
          services as a numbered journey, with the ghost kitchen pictured. */}
      <section id="program" aria-labelledby="program-title" className="border-b border-travertine-deep/60 bg-white px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1280px]">
          <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end md:gap-12">
            <div>
              <p className="eyebrow" data-reveal>
                <span className="rule" aria-hidden />
                {x(lp.programLabel)}
              </p>
              <h2 id="program-title" className="mt-5 font-[family-name:var(--font-display)] text-[36px] leading-[1.08] font-normal text-charcoal md:text-[52px]" data-reveal>
                {x(lp.programTitle)}
              </h2>
            </div>
            <p className="max-w-[46ch] text-[16px] leading-relaxed text-charcoal-soft md:text-[17px]" data-reveal>
              {x(lp.programIntro)}
            </p>
          </div>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-12 lg:grid-cols-4">
            {lp.program.map((it, k) => (
              <li key={k} className="flex min-h-[200px] flex-col rounded-[20px] bg-bone p-6 ring-1 ring-travertine-deep/70" data-reveal>
                <span className="font-[family-name:var(--font-display)] text-[34px] leading-none text-brass [font-variant-numeric:lining-nums]">{pad(k + 1)}</span>
                <h3 className="mt-auto pt-8 font-[family-name:var(--font-display)] text-[23px] leading-tight text-charcoal">{x(it.title)}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-charcoal-soft">{x(it.text)}</p>
              </li>
            ))}
            <li className="relative min-h-[200px] overflow-hidden rounded-[20px] bg-travertine" data-reveal>
              <Image src={tdm.kitchenWine.src} alt={tdm.kitchenWine.alt[locale] || tdm.kitchenWine.alt.en} fill sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) 50vw, 310px" quality={80} className="object-cover" style={{ objectPosition: tdm.kitchenWine.focal }} />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-basalt/80 to-transparent p-5 pt-16 text-[13px] font-semibold tracking-[0.16em] text-bone uppercase">{x(lp.program[4].title)}</span>
            </li>
          </ol>
        </div>
      </section>

      {/* 02 Fitness, nutrition and aging well, in the Cipriani layout: two cards and the film gallery. */}
      <CipShowcase
        id="fitness"
        n=""
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
        <CardRail cards={fitnessCards} label={x(cip.fitness.eyebrow)} locale={locale} ratio="5/4" />
      </CipShowcase>

      {/* Closing (client, 18 Nov): the owner's line, the moving tree, and Inquire. */}
      <section aria-labelledby="longevity-close" className="on-dark bg-basalt px-5 py-16 text-center text-bone md:px-10 md:py-24" data-tone="dark">
        <div className="mx-auto max-w-[880px]">
          {/* eslint-disable-next-line @next/next/no-img-element -- the animated SVG, served as is */}
          <img src="/brand/ora-world-tree-leaves.svg" alt="" aria-hidden width={252} height={248} className="mx-auto h-[72px] w-auto opacity-90 md:h-[88px]" />
          <h2 id="longevity-close" className="mt-8 font-[family-name:var(--font-display)] text-[30px] leading-tight font-normal text-bone md:text-[44px]" data-reveal>
            {x(lp.closing)}
          </h2>
          <p className="mx-auto mt-4 max-w-[46ch] text-[16px] leading-relaxed text-bone/80" data-reveal>{x(lp.closingSub)}</p>
          <Link href="/#inquire" className="cta mt-8 inline-flex min-h-[52px] px-8" data-track="cta_inquire" data-track-label="longevity-close">
            {inquire.label} <ArrowRight width={14} height={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
