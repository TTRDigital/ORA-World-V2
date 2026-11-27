import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { L, Locale } from "@/content/types";
import { t } from "@/lib/localize";
import { cip } from "@/content/seed/homeCip";
import { tdm, life } from "@/content/seed/images";
import { BHero, BStatement, BChapter, BGrid, BFullBleed, BNumbered, BMedia, BClose } from "@/components/v2/B";

/** Version B · Longevity: its own layout (client, 18 Nov: "different from Version A"), same approved content. */
const clip = (n: string) => ({ video: `/videos/clips/${n}.mp4`, poster: `/videos/clips/${n}-poster.jpg` });

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "es" ? "Longevidad · Versión B" : "Longevity · Version B",
    robots: { index: false, follow: false },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const es = locale === "es";
  const x = (l: L) => t(l, locale);
  const lp = cip.longevityPage;
  const spa = {
    ...life.spa,
    src: "/videos/clips/spa-ocean-poster.jpg",
    width: 1248,
    height: 704,
    focal: "50% 50%",
    ...clip("spa-ocean"),
  };
  return (
    <>
      <BHero
        image={spa}
        locale={locale}
        eyebrow={es ? "Longevidad · ORA World" : "Longevity · ORA World"}
        title={x(lp.promiseTitle)}
        line={x(cip.who.intro)}
        cue={es ? "Desplácese" : "Scroll to explore"}
      />
      <BStatement text={x(lp.closing)} sub={`“${x(lp.promiseQuote)}”`} />
      <BChapter
        eyebrow={x(lp.promiseLabel)}
        title={es ? "Paso a paso, una vida mejor." : "Step by step, a better life."}
      >
        <ul className="grid gap-px overflow-hidden bg-bone/15 sm:grid-cols-2 lg:grid-cols-4">
          {lp.steps.map((st, k) => (
            <li key={k} className="bg-basalt p-8 md:p-10">
              <span className="font-[family-name:var(--font-display)] text-[72px] leading-none text-brass-light [font-variant-numeric:lining-nums]">
                {k + 1}
              </span>
              <h3 className="mt-8 font-[family-name:var(--font-display)] text-[28px] leading-tight">
                {x(st.title)}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-bone/70">{x(st.text)}</p>
            </li>
          ))}
        </ul>
      </BChapter>
      <BFullBleed
        image={{ ...tdm.gym, focal: "78% 50%", ...clip("p14-gym") }}
        locale={locale}
        eyebrow={x(cip.prevention.eyebrow)}
        title={x(cip.prevention.title)}
      >
        <p className="mt-6 max-w-[48ch] text-[16px] leading-relaxed text-white/85 md:text-[18px]">
          {x(cip.prevention.intro)}
        </p>
        <p className="mt-10 max-w-[24ch] font-[family-name:var(--font-display)] text-[28px] leading-snug text-brass-light italic md:text-[36px]">
          “{x(cip.prevention.question)}”
        </p>
      </BFullBleed>
      <BChapter
        tone="light"
        eyebrow={x(lp.programLabel)}
        title={x(lp.programTitle)}
        intro={x(lp.programIntro)}
      >
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
          <BNumbered items={lp.program.map((it) => ({ title: x(it.title), text: x(it.text) }))} />
          <div className="grid content-start gap-4 lg:sticky lg:top-[128px]">
            <BMedia
              image={{ ...tdm.kitchenWine, ...clip("p16-apartment-kitchen") }}
              locale={locale}
              sizes="(max-width: 1023px) calc(100vw - 40px), 620px"
              className="aspect-[4/5]"
            />
            <p className="text-[12px] tracking-[0.22em] text-charcoal-soft uppercase">
              {x(lp.program[4].title)} · {x(lp.program[4].text).replace(/\.$/, "")}
            </p>
          </div>
        </div>
      </BChapter>
      <BChapter
        eyebrow={x(cip.fitness.eyebrow)}
        title={x(cip.fitness.title)}
        intro={
          es
            ? "Algunos aparentan 60 a los 80. Su cuerpo se hace a sí mismo: ORA le ayuda a ser uno de ellos."
            : "Some people look 60 at 80, and ORA helps you be one of them. Your body is self-made."
        }
      >
        <BGrid
          locale={locale}
          items={[
            {
              kicker: es ? "Entrenamiento" : "Training",
              title: es ? "Gimnasio y pilates" : "Fitness and Pilates",
              text: es ? "Un programa pensado para que sea fácil." : "A program designed to make it easy.",
              image: { ...tdm.gym, focal: "78% 50%", ...clip("p14-gym") },
            },
            {
              kicker: es ? "Recuperación" : "Recovery",
              title: "Spa",
              text: es ? "Masajes, tratamientos y salón." : "Massage, treatments and salon services.",
              image: spa,
            },
            {
              kicker: es ? "Movimiento" : "Movement",
              title: es ? "Sendero de dos millas" : "Two-mile walking path",
              text: es
                ? "Entre jardines, cerca del parque nacional."
                : "Through gardens, beside a national park.",
              image: {
                ...tdm.aerialForest,
                video: "/videos/fitness-walk.mp4",
                poster: "/videos/fitness-walk-poster.jpg",
              },
            },
            {
              kicker: es ? "Movimiento" : "Movement",
              title: es ? "Campo de putting" : "Putting course",
              text: es ? "Dieciocho hoyos entre las torres." : "Eighteen holes between the towers.",
              image: { ...tdm.exteriorGolf, ...clip("p11-putting-green") },
            },
          ]}
        />
      </BChapter>
      <BClose
        image={{ ...tdm.exteriorRoad }}
        locale={locale}
        eyebrow={es ? "Su programa ORA" : "Your ORA program"}
        title={es ? "Cuéntenos sus metas." : "Tell us your goals."}
        inquire={es ? "Consultar" : "Inquire"}
        second={{ href: "/b/living", label: es ? "Vivir aquí" : "Living here" }}
      />
    </>
  );
}
