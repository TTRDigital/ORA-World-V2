import type { L } from "../types";

/**
 * Homepage story. Sources, nothing invented:
 *  - the owner's content brief ("ORA World Content Brief", from his recorded conversation, Nov 2026): the core
 *    promise, preventive health, fitness and nutrition, ORA services, the founder, the nine-day week and the tax
 *    decree, the audience, and his ready-to-use lines (quoted verbatim where marked "brief");
 *  - oraworld.com (mission, "Beyond expectations", Act 60 explainer), the TDM Brochure, the Phase 1 floor plans and
 *    the sales team's prospect email.
 * Rules: never name the owner or the founder; no helicopter or pickup promises; no guaranteed health outcomes
 * (the brief's own note); tax wording to be confirmed by ORA's tax team before go-live (see CONTENT-TODO.md).
 */
export const cip = {
  hero: {
    title: { en: "A life to treasure", es: "Una vida para atesorar" } as L,
    sub: { en: "Tesoro Del Mar · Dorado, Puerto Rico", es: "Tesoro Del Mar · Dorado, Puerto Rico" } as L,
  },

  /* 01 The core promise and who we are (brief §1, §5; oraworld.com) */
  who: {
    eyebrow: { en: "Who we are", es: "Quiénes somos" } as L,
    title: { en: "A longer life. A better life.", es: "Una vida más larga. Una vida mejor." } as L,
    intro: {
      en: "Longevity is the foundation of our world. If you are going to live longer, you will want to live better; and to live better, you will want to be stronger and fitter, and to feel it. ORA World makes all of this easy.",
      es: "La longevidad es la base de nuestro mundo. Si va a vivir más, querrá vivir mejor; y para vivir mejor, querrá estar más fuerte y en forma, y sentirlo. ORA World lo hace fácil.",
    } as L,
    body: {
      en: "ORA World creates thoughtfully crafted communities in Puerto Rico where longevity, luxury and nature exist in perfect harmony. Tesoro Del Mar in Dorado is the first.",
      es: "ORA World crea comunidades concebidas con esmero en Puerto Rico, donde la longevidad, el lujo y la naturaleza conviven en perfecta armonía. Tesoro Del Mar, en Dorado, es la primera.",
    } as L,
    quote: { en: "Have you heard about anything like this? Never. That's ORA World.", es: "¿Ha oído hablar de algo así? Nunca. Eso es ORA World." } as L,
    founder: {
      label: { en: "The founder", es: "El fundador" } as L,
      text: {
        en: "ORA World was founded by a Harvard-trained heart surgeon whose clinics are within driving distance of about 65% of the US population. One of his focus areas is longevity.",
        es: "ORA World fue fundado por un cirujano cardiovascular formado en Harvard, cuyas clínicas están a distancia en auto de cerca del 65% de la población de Estados Unidos. Uno de sus enfoques es la longevidad.",
      } as L,
    },
  },

  /* Why ORA World: how it is different (client call: "How is ORA World better?", "not just another apartment
     building", "nobody knows ORA World, so we have to build trust"). Each point is backed elsewhere on the page. */
  different: {
    eyebrow: { en: "Why ORA World", es: "Por qué ORA World" } as L,
    title: { en: "Not another condo building", es: "No es otro edificio de condominios" } as L,
    intro: {
      en: "A residence at Tesoro Del Mar comes with three things no ordinary condo offers: care for your health, a better place to keep your income, and the travel to make it all easy.",
      es: "Una residencia en Tesoro Del Mar incluye tres cosas que ningún condominio común ofrece: cuidado para su salud, un mejor lugar para su ingreso y los viajes que lo hacen todo fácil.",
    } as L,
    items: [
      {
        title: { en: "Longevity, built in", es: "Longevidad incluida" } as L,
        text: {
          en: "A total body scan for every member, nutritionists on staff, a ghost kitchen that cooks for you and a fitness program that makes getting fit easy.",
          es: "Un escaneo corporal completo para cada miembro, nutricionistas en el equipo, una cocina fantasma que cocina para usted y un programa para ponerse en forma fácilmente.",
        } as L,
        href: "#longevity",
      },
      {
        title: { en: "Keep more of what you earn", es: "Conserve más de lo que gana" } as L,
        text: {
          en: "Puerto Rico's official incentive law, a government-approved decree for about 30 years, and our accountants to guide you through it.",
          es: "La ley oficial de incentivos de Puerto Rico, un decreto aprobado por el gobierno por unos 30 años y nuestros contadores para guiarle.",
        } as L,
        href: "#why-puerto-rico",
      },
      {
        title: { en: "Travel, taken care of", es: "Viajes resueltos" } as L,
        text: {
          en: "Private charter flights to your condo in Puerto Rico and back to the United States, a lobby attended 24/7 and a house car waiting.",
          es: "Vuelos chárter privados a su condominio en Puerto Rico y de regreso a Estados Unidos, un vestíbulo atendido 24/7 y el auto de la casa.",
        } as L,
        href: "#charters",
      },
    ],
    trust: [
      { en: "Founded by a Harvard-trained heart surgeon", es: "Fundado por un cirujano cardiovascular formado en Harvard" },
      { en: "An official government decree you can look up yourself", es: "Un decreto oficial del gobierno que puede verificar usted mismo" },
      { en: "Sponsor: TRPbuildco LLC, Dorado · Vega Alta, Puerto Rico", es: "Patrocinador: TRPbuildco LLC, Dorado · Vega Alta, Puerto Rico" },
    ] as L[],
  },

  /* 02 Longevity and preventive health (brief §2, §4, lines) */
  prevention: {
    eyebrow: { en: "Longevity", es: "Longevidad" } as L,
    title: { en: "Planes don't fall from the sky", es: "Los aviones no se caen del cielo" } as L,
    intro: {
      en: "Redundancy and preventive maintenance. You have two lungs, two kidneys: you have redundancy. But you don't have preventive maintenance.",
      es: "Redundancia y mantenimiento preventivo. Tiene dos pulmones y dos riñones: tiene redundancia. Pero no tiene mantenimiento preventivo.",
    } as L,
    body: {
      en: "Most people only see a doctor when something hurts, and by then something has often already broken. ORA checks you before something breaks, before you feel anything, so that what can be caught early, like heart issues or cancer, is caught early. Follow what the doctors recommend, and you give yourself the best chance at a longer life.",
      es: "La mayoría solo va al médico cuando algo duele, y para entonces algo suele haberse roto ya. ORA lo revisa antes de que algo se rompa, antes de que sienta nada, para detectar a tiempo lo que puede detectarse a tiempo, como problemas cardíacos o cáncer. Siga lo que recomiendan los médicos y se dará la mejor oportunidad de una vida más larga.",
    } as L,
    bullets: [
      { en: "A total body scan for every member", es: "Un escaneo corporal completo para cada miembro" },
      { en: "A personal interview to understand your goals", es: "Una entrevista personal para entender sus metas" },
      { en: "A connection to a list of cardiologists", es: "Conexión con una lista de cardiólogos" },
      { en: "Nutritionists on staff", es: "Nutricionistas en el equipo" },
    ] as L[],
    question: { en: "What is the value of an extra 10 years for you?", es: "¿Cuánto valen para usted 10 años más?" } as L,
    questionSub: {
      en: "Would you pay a million? Five million? Ten? You can't take anything with you, and your children are already taken care of. Time and health become the real investment.",
      es: "¿Pagaría un millón? ¿Cinco millones? ¿Diez? No puede llevarse nada, y sus hijos ya están cuidados. El tiempo y la salud se vuelven la verdadera inversión.",
    } as L,
  },

  /* 03 Fitness, nutrition and aging well (brief §3, §4) */
  fitness: {
    eyebrow: { en: "Fitness and nutrition", es: "Forma física y nutrición" } as L,
    title: { en: "Your body is self-made", es: "Su cuerpo se hace a sí mismo" } as L,
    intro: {
      en: "If you already have a longer life, don't you want to have a better life? Some people look 50 or 60 at age 80; others already look old at 60. ORA helps you be the first kind of person.",
      es: "Si ya tiene una vida más larga, ¿no quiere tener una vida mejor? Algunas personas aparentan 50 o 60 a los 80; otras ya se ven mayores a los 60. ORA le ayuda a ser del primer tipo.",
    } as L,
    body: {
      en: "The goal is the 95th to 98th percentile for your age: an outlier, stronger, fitter and better than anyone in your situation. Your body is absolutely self-made, so you can work on it in advance and make it better and stronger. Around 50 is the age to start: how do you make yourself at 50 feel like 30 or 35?",
      es: "La meta es el percentil 95 a 98 para su edad: un caso excepcional, más fuerte, más en forma y mejor que cualquiera en su situación. Su cuerpo se hace absolutamente a sí mismo, así que puede trabajarlo con anticipación y hacerlo mejor y más fuerte. Alrededor de los 50 es la edad para empezar: ¿cómo hacer que a los 50 se sienta como a los 30 o 35?",
    } as L,
    bullets: [
      { en: "Nutritionists who set specifics, like your daily protein target", es: "Nutricionistas que definen lo específico, como su meta diaria de proteína" },
      { en: "Many meal options, built around what you like", es: "Muchas opciones de comidas, según lo que le gusta" },
      { en: "A ghost kitchen on premises that cooks for you", es: "Una cocina fantasma en el lugar que cocina para usted" },
      { en: "A fitness program designed to make getting fit easy", es: "Un programa de entrenamiento pensado para que ponerse en forma sea fácil" },
      { en: "Help gaining muscle and losing weight", es: "Ayuda para ganar músculo y perder peso" },
    ] as L[],
  },

  /* 04 Why Puerto Rico: the nine-day week and the tax decree (brief §6, §7, lines) */
  why: {
    eyebrow: { en: "Why Puerto Rico", es: "Por qué Puerto Rico" } as L,
    title: { en: "The nine-day week", es: "La semana de nueve días" } as L,
    intro: {
      en: "Puerto Rico is the only place on earth with a nine-day week. Be in New York, in your office or anywhere you want, Monday through Thursday, from 9 or 10 am until 7 pm. You only need to be in Puerto Rico for about 30 weekends a year: thirty amazing weekends, in a great place, with great friends.",
      es: "Puerto Rico es el único lugar del mundo con una semana de nueve días. Esté en Nueva York, en su oficina o donde quiera, de lunes a jueves, de 9 o 10 de la mañana a 7 de la tarde. Solo necesita estar en Puerto Rico unos 30 fines de semana al año: treinta fines de semana increíbles, en un gran lugar, con grandes amigos.",
    } as L,
    body: {
      en: "If you are in your late 40s and making real money, running a big advertising or management business, for example, the question is simple: wouldn't it be good to figure out how to run your business from Puerto Rico?",
      es: "Si tiene cerca de 50 años y gana bien, dirigiendo por ejemplo una gran empresa de publicidad o de gestión, la pregunta es simple: ¿no sería bueno descubrir cómo dirigir su negocio desde Puerto Rico?",
    } as L,
    bullets: [
      { en: "An official Puerto Rico law: public and easy to verify", es: "Una ley oficial de Puerto Rico: pública y fácil de verificar" },
      { en: "A specific decree, approved by the government, that nobody can take away", es: "Un decreto específico, aprobado por el gobierno, que nadie puede quitarle" },
      { en: "15 years plus a 15-year extension: about 30 years in total", es: "15 años más una extensión de 15: unos 30 años en total" },
      { en: "You don't need to move now. You just need to apply.", es: "No necesita mudarse ahora. Solo necesita solicitar." },
      { en: "Applications in before January 1 are grandfathered, even if the process finishes next year", es: "Las solicitudes presentadas antes del 1 de enero mantienen los términos actuales, aunque el proceso termine el año siguiente" },
      { en: "Our team of accountants helps; every situation is specific", es: "Nuestro equipo de contadores le ayuda; cada situación es distinta" },
    ] as L[],
    stats: [
      { value: "0%", label: { en: "today, on capital gains and dividends", es: "hoy, sobre ganancias de capital y dividendos" } as L },
      { value: "4%", label: { en: "the rate from January 1", es: "la tasa a partir del 1 de enero" } as L },
      { value: "15+15", label: { en: "years: the decree and its extension", es: "años: el decreto y su extensión" } as L },
    ],
    note: {
      en: "General information, not tax or legal advice. Every situation is specific; ORA's accountants will confirm what applies to you.",
      es: "Información general, no asesoría fiscal ni legal. Cada situación es distinta; los contadores de ORA confirmarán lo que aplica a su caso.",
    } as L,
    verify: { en: "Look up the law yourself", es: "Consulte la ley usted mismo" } as L,
    verifyUrl: "https://www.desarrollo.pr.gov/",
    link: { en: "How the incentive works", es: "Cómo funciona el incentivo" } as L,
  },

  /* 05 Step inside: tour and film */
  tour: {
    eyebrow: { en: "Step inside", es: "Recorra" } as L,
    title: { en: "See it for yourself", es: "Véalo usted mismo" } as L,
    intro: {
      en: "Walk the ORA World 360° collection at your own pace, or watch the short film about the resort community.",
      es: "Recorra la colección 360° de ORA World a su ritmo, o vea la película corta sobre la comunidad.",
    } as L,
  },

  /* 06 Residences (with the penthouse) */
  residences: {
    eyebrow: { en: "Residences", es: "Residencias" } as L,
    title: { en: "Inspired by flight", es: "Inspiradas en el vuelo" } as L,
    intro: {
      en: "Curved towers arc like wings, spacious balconies stretch toward the sea and glass facades dissolve the boundary between home and horizon.",
      es: "Las torres curvas se arquean como alas, los amplios balcones se extienden hacia el mar y las fachadas de vidrio borran el límite entre hogar y horizonte.",
    } as L,
    bullets: [
      { en: "Water views from every residence", es: "Vista al agua desde cada residencia" },
      { en: "Oversized balconies and wrap-around terraces", es: "Balcones amplios y terrazas envolventes" },
      { en: "10' ceilings; private elevators in most residences", es: "Techos de 10 pies; ascensor privado en la mayoría de las residencias" },
      { en: "Scavolini kitchens with Gaggenau appliances", es: "Cocinas Scavolini con electrodomésticos Gaggenau" },
      { en: "60 residences in Phase One, 1 to 6 bedrooms", es: "60 residencias en la Fase Uno, de 1 a 6 dormitorios" },
      { en: "The Penthouse: floor 18, two levels, 9,807 sq ft", es: "El Penthouse: piso 18, dos niveles, 9,807 pies²" },
    ] as L[],
  },

  /* 07 Amenities: the full list, with the ORA health services and the ghost kitchen (brief §4; brochure p7) */
  amenities: {
    eyebrow: { en: "Amenities", es: "Amenidades" } as L,
    title: { en: "Ease, elevated", es: "La comodidad, elevada" } as L,
    intro: { en: "Over 65,000 sq ft of bespoke indoor and outdoor amenities, and the services that make a longer, better life easy.", es: "Más de 65,000 pies² de amenidades interiores y exteriores, y los servicios que hacen fácil una vida más larga y mejor." } as L,
    groups: [
      {
        label: { en: "ORA health and longevity", es: "Salud y longevidad ORA" } as L,
        items: [
          { en: "Total body scan for every member", es: "Escaneo corporal completo para cada miembro" },
          { en: "Personal interview to understand your goals", es: "Entrevista personal sobre sus metas" },
          { en: "Nutritionists on staff", es: "Nutricionistas en el equipo" },
          { en: "Many meal options, built around what you like", es: "Muchas opciones de comidas, a su gusto" },
          { en: "Ghost kitchen on premises that cooks for members", es: "Cocina fantasma que cocina para los miembros" },
          { en: "Fitness program designed to make getting fit easy", es: "Programa para ponerse en forma fácilmente" },
          { en: "Connection to a list of cardiologists", es: "Conexión con una lista de cardiólogos" },
        ] as L[],
      },
      {
        label: { en: "The Clubhouse · 14,000 sq ft, members only", es: "El Clubhouse · 14,000 pies², solo miembros" } as L,
        items: [
          { en: "Café, bakery and corner store", es: "Café, panadería y tienda" },
          { en: "Fine-dining restaurant", es: "Restaurante de alta cocina" },
          { en: "Indoor and outdoor spaces for hosting events", es: "Espacios interiores y exteriores para eventos" },
          { en: "Business center: conference rooms, private offices, coffee bar, IT 24/7", es: "Centro de negocios: salas, oficinas privadas, coffee bar, TI 24/7" },
          { en: "Programmable golf simulator and lounge", es: "Simulador de golf programable y salón" },
          { en: "Tennis, half basketball and beach volleyball courts", es: "Tenis, media cancha de baloncesto y voleibol de playa" },
          { en: "Rooftop resort-style pool, sundeck and pool bar", es: "Piscina en la azotea, solárium y bar" },
          { en: "Fitness center and wellness spa", es: "Gimnasio y spa de bienestar" },
        ] as L[],
      },
      {
        label: { en: "The tower", es: "La torre" } as L,
        items: [
          { en: "Next-generation 18-hole putting course", es: "Campo de putting de 18 hoyos" },
          { en: "Outdoor resort-style pool with sundeck and bar", es: "Piscina estilo resort con solárium y bar" },
          { en: "Fitness center and pilates studio", es: "Gimnasio y estudio de pilates" },
          { en: "Spa for massage, treatments and salon services", es: "Spa para masajes, tratamientos y salón" },
          { en: "Outdoor yoga terrace", es: "Terraza de yoga" },
          { en: "Business center with reservable private offices", es: "Centro de negocios con oficinas reservables" },
          { en: "Resident lounge with curated art and bar service", es: "Salón de residentes con arte y bar" },
          { en: "Children's play area, playgrounds and teen lounge", es: "Área infantil, parques y salón juvenil" },
          { en: "Private, secure climate-controlled storage", es: "Almacenamiento privado y climatizado" },
        ] as L[],
      },
      {
        label: { en: "Coast and service", es: "Costa y servicio" } as L,
        items: [
          { en: "Beach club with food and beverage service", es: "Club de playa con comida y bebida" },
          { en: "Slipway for easy boat launching", es: "Rampa para botar embarcaciones" },
          { en: "Two-mile walking path through landscaped gardens", es: "Sendero de dos millas entre jardines" },
          { en: "Porte-cochère and a lobby attended 24/7", es: "Pórtico y vestíbulo atendido 24/7" },
          { en: "Valet and self-parking", es: "Valet y estacionamiento propio" },
          { en: "Luxury house car and golf cart service", es: "Auto de la casa y carrito de golf" },
        ] as L[],
      },
    ],
  },

  /* 08 Private charters. No helicopter, helipad or pickup claims. */
  charters: {
    eyebrow: { en: "Private charters", es: "Vuelos chárter privados" } as L,
    title: { en: "Fly private to Puerto Rico", es: "Vuele privado a Puerto Rico" } as L,
    intro: {
      en: "Owners at Tesoro Del Mar have private charter flights to their condo in Puerto Rico and back to the United States: the nine-day week, made easy.",
      es: "Los propietarios de Tesoro Del Mar cuentan con vuelos chárter privados a su condominio en Puerto Rico y de regreso a Estados Unidos: la semana de nueve días, fácil.",
    } as L,
    bullets: [
      { en: "Private jet charters through ORA World Jet", es: "Vuelos privados con ORA World Jet" },
      { en: "About 30 minutes from San Juan's international airport", es: "A unos 30 minutos del aeropuerto internacional de San Juan" },
      { en: "A private lobby attended 24/7, with valet parking", es: "Vestíbulo privado atendido 24/7, con valet" },
      { en: "A luxury house car and golf cart service", es: "Auto de la casa y servicio de carrito de golf" },
    ] as L[],
  },

  /* 09 Floor plans and pricing */
  plans: {
    eyebrow: { en: "Floor plans and pricing", es: "Planos y precios" } as L,
    title: { en: "Phase One", es: "Fase Uno" } as L,
    intro: {
      en: "60 residences on floors 5 to 18 of Tower 1. Early pre-construction pricing averages $2,250 per sq ft; later units will likely be sold at higher rates.",
      es: "60 residencias en los pisos 5 al 18 de la Torre 1. Los precios iniciales de preconstrucción promedian $2,250 por pie²; es probable que las unidades posteriores se vendan a precios más altos.",
    } as L,
    tiers: [
      { label: { en: "Lower units", es: "Unidades bajas" } as L, value: "$2,000" },
      { label: { en: "Average", es: "Promedio" } as L, value: "$2,250" },
      { label: { en: "Higher units", es: "Unidades altas" } as L, value: "$2,500" },
    ],
    plansNote: {
      en: "Inquire to receive the complete Phase 1 floor plans and the brochure.",
      es: "Consulte para recibir los planos completos de la Fase 1 y el folleto.",
    } as L,
  },

  /* 10 Three steps (approved on the call) */
  steps: {
    eyebrow: { en: "How ORA World helps you", es: "Cómo le ayuda ORA World" } as L,
    title: { en: "Three steps to Tesoro Del Mar", es: "Tres pasos a Tesoro Del Mar" } as L,
    items: [
      {
        title: { en: "Discover the island", es: "Descubra la isla" } as L,
        text: {
          en: "Watch the film, walk the 360° tour and see how the nine-day week and Puerto Rico's incentive law fit your plans.",
          es: "Vea la película, recorra el tour 360° y descubra cómo la semana de nueve días y la ley de incentivos de Puerto Rico encajan en sus planes.",
        } as L,
        href: "#virtual-tour",
        link: { en: "Step inside", es: "Recorrer" } as L,
      },
      {
        title: { en: "Choose your residence", es: "Elija su residencia" } as L,
        text: {
          en: "Sixty residences on floors 5 to 18, from one bedroom with den to the two-level penthouse.",
          es: "Sesenta residencias en los pisos 5 al 18, de un dormitorio con estudio al penthouse de dos niveles.",
        } as L,
        href: "#floor-plans",
        link: { en: "See the floor plans", es: "Ver los planos" } as L,
      },
      {
        title: { en: "Arrive in Dorado", es: "Llegue a Dorado" } as L,
        text: {
          en: "Inquire, and our team will follow up with a personal conversation about your goals, pricing, availability and a visit.",
          es: "Consulte, y nuestro equipo le contactará para conversar sobre sus metas, precios, disponibilidad y una visita.",
        } as L,
        href: "#inquire",
        link: { en: "Inquire", es: "Consultar" } as L,
      },
    ],
    address: { en: "Tesoro Del Mar, Dorado · Vega Alta, Puerto Rico 00692", es: "Tesoro Del Mar, Dorado · Vega Alta, Puerto Rico 00692" } as L,
  },

  /* 11 Inquire (brief §7: who he is talking to) */
  inquire: {
    eyebrow: { en: "Inquire", es: "Consultar" } as L,
    title: { en: "Inquire about Tesoro Del Mar", es: "Consulte por Tesoro Del Mar" } as L,
    intro: {
      en: "For professionals, business owners and doctors who have built something, whose children are taken care of, and who now see time and health as the real investment. Tell us your goals; our team will follow up personally.",
      es: "Para profesionales, empresarios y médicos que han construido algo, cuyos hijos ya están cuidados y que ahora ven el tiempo y la salud como la verdadera inversión. Cuéntenos sus metas; nuestro equipo le responderá personalmente.",
    } as L,
    bullets: [
      { en: "A personal conversation about your goals", es: "Una conversación personal sobre sus metas" },
      { en: "The brochure, Phase 1 floor plans and pricing", es: "El folleto, los planos y los precios de la Fase 1" },
      { en: "How the incentive decree could apply to you", es: "Cómo podría aplicarle el decreto de incentivos" },
    ] as L[],
  },
};
