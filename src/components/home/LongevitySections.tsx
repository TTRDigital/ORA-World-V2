import type { Locale } from "@/content/types";
import { t } from "@/lib/localize";
import { cip } from "@/content/seed/homeCip";
import { tdm, life } from "@/content/seed/images";
import { CipShowcase } from "@/components/cip/CipShowcase";
import { CardRail, type RailCard } from "@/components/cip/CardRail";
import { LoopVideo } from "@/components/cip/LoopVideo";

/**
 * The Longevity page's two sections (client, 16 Nov: moved from the homepage to their own page): preventive health
 * ("Planes don't fall from the sky", with the gym film) and fitness and nutrition ("Your body is self-made", with the
 * film gallery), in the Cipriani layout.
 */
export function LongevitySections({ locale }: { locale: Locale }) {
  const x = (l: Parameters<typeof t>[0]) => t(l, locale);
  const es = locale === "es";
  const inquire = { href: "/#inquire", label: es ? "Consultar" : "Inquire", track: "cta_inquire" };
  const hint = es ? "Use las flechas o deslice horizontalmente" : "Use arrows or swipe horizontally";
  // Client, 15 Nov: each card plays a short film (a camera move made from its picture), not a still.
  const fitnessCards: RailCard[] = [
    { key: "gym", kicker: es ? "Entrenamiento" : "Training", title: es ? "Gimnasio y pilates" : "Fitness and pilates", text: es ? "Un programa pensado para que sea fácil." : "A program designed to make it easy.", image: tdm.gym, video: "/videos/fitness-gym.mp4", poster: "/videos/fitness-gym-poster.jpg" },
    { key: "spa", kicker: es ? "Recuperación" : "Recovery", title: "Spa", text: es ? "Masajes, tratamientos y salón." : "Massage, treatments and salon services.", image: life.spa, video: "/videos/fitness-spa.mp4", poster: "/videos/fitness-spa-poster.jpg" },
    { key: "walk", kicker: es ? "Movimiento" : "Movement", title: es ? "Sendero de dos millas" : "Two-mile walking path", text: es ? "Entre jardines, cerca del parque nacional." : "Through gardens, beside a national park.", image: tdm.aerialForest, video: "/videos/fitness-walk.mp4", poster: "/videos/fitness-walk-poster.jpg" },
    { key: "putting", kicker: es ? "Movimiento" : "Movement", title: es ? "Campo de putting" : "Putting course", text: es ? "Dieciocho hoyos junto a la piscina." : "Eighteen holes beside the pool.", image: tdm.exteriorGolf, video: "/videos/fitness-putting.mp4", poster: "/videos/fitness-putting-poster.jpg" },
  ];

  return (
    <div className="flex flex-col">
      {/* 01 Longevity and preventive health, in the Cipriani layout (client, 16 Nov): the services as two cards, the gym
          film on the right. */}
      <CipShowcase
        id="longevity"
        n="01"
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

      {/* 02 Fitness, nutrition and aging well, in the Cipriani layout: two cards and the film gallery. */}
      <CipShowcase
        id="fitness"
        n="02"
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

    </div>
  );
}
