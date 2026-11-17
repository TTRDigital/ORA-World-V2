import type { L } from "../types";

/**
 * Homepage story. Sources, nothing invented:
 *  - the owner's content brief ("ORA World Content Brief", from his recorded conversation, Nov 2026): the core
 *    promise, preventive health, fitness and nutrition, ORA services, the tax decree (the nine-day week was dropped, client 15 Nov), the
 *    audience, and his ready-to-use lines (kept word for word: "Planes don't fall from the sky", "two lungs, two
 *    kidneys", "What is the value of an extra 10 years", "don't you want to have a better life", "an outlier");
 *  - oraworld.com (mission, "Beyond expectations", Act 60 explainer), the TDM Brochure, the Phase 1 floor plans and
 *    the sales team's prospect email.
 * Client, 15 Nov: shorter, cleaner copy throughout, same meaning.
 * Rules: never name the owner or the founder; no helicopter or pickup promises; no guaranteed health outcomes
 * (the brief's own note); tax wording to be confirmed by ORA's tax team before go-live (see CONTENT-TODO.md).
 */
export const cip = {
  hero: {
    // The banner carries just this one line (client, 11 Nov 2026). Client, 15 Nov: short, about longevity, with "ORA World"
    // in it. Worded as a place, not a promise (no guaranteed health outcomes).
    // Client, 16 Nov: only this line in the middle of the banner ("Beyond expectations", also oraworld.com's line).
    title: { en: "Beyond expectations", es: "Más allá de las expectativas" } as L,
    sub: { en: "Tesoro Del Mar · Dorado, Puerto Rico", es: "Tesoro Del Mar · Dorado, Puerto Rico" } as L,
  },

  /* 01 The core promise and who we are (brief §1, §5; oraworld.com) */
  who: {
    eyebrow: { en: "Who we are", es: "Quiénes somos" } as L,
    title: { en: "A longer life. A better life.", es: "Una vida más larga. Una vida mejor." } as L,
    intro: {
      en: "Longevity is the foundation of our world. If you live longer, you'll want to live better: stronger, fitter, and feeling it. ORA World makes it easy.",
      es: "La longevidad es la base de nuestro mundo. Si vive más, querrá vivir mejor: más fuerte, en forma y sintiéndolo. ORA World lo hace fácil.",
    } as L,
    body: {
      en: "Communities in Puerto Rico where longevity, luxury and nature meet. Tesoro Del Mar, in Dorado, is the first.",
      es: "Comunidades en Puerto Rico donde se unen la longevidad, el lujo y la naturaleza. Tesoro Del Mar, en Dorado, es la primera.",
    } as L,
    // Client, 16 Nov: section 01 says everything ORA World offers, like Cipriani's "Amenities & features" (all items
    // from the amenities list, the ORA services and the charters on this page).
    offerEyebrow: { en: "Amenities & features", es: "Amenidades y servicios" } as L,
    offerTitle: { en: "Longevity, luxury and nature, at home", es: "Longevidad, lujo y naturaleza, en casa" } as L,
    offerIntro: {
      en: "65,500 sq ft of pools, dining, wellness and social spaces, and the services that make a longer, better life easy.",
      es: "65,500 pies² de piscinas, gastronomía, bienestar y espacios sociales, y los servicios que facilitan una vida más larga y mejor.",
    } as L,
    offerCards: [
      {
        label: { en: "Amenities", es: "Amenidades" } as L,
        items: [
          { en: "Resort-style pools and a rooftop pool bar", es: "Piscinas estilo resort y bar en la azotea" },
          { en: "Members-only Clubhouse with fine dining", es: "Clubhouse solo para miembros, con alta cocina" },
          { en: "Spa, fitness center and pilates studio", es: "Spa, gimnasio y estudio de pilates" },
          { en: "Beach club and an 18-hole putting course", es: "Club de playa y campo de putting de 18 hoyos" },
          { en: "Two-mile garden walking path", es: "Sendero de dos millas entre jardines" },
        ] as L[],
      },
      {
        label: { en: "Features", es: "Servicios" } as L,
        items: [
          { en: "Total body scan and nutritionists for every member", es: "Escaneo corporal y nutricionistas para cada miembro" },
          { en: "A ghost kitchen that cooks for you", es: "Una cocina fantasma que cocina para usted" },
          { en: "Private charter flights through ORA World Jet", es: "Vuelos chárter privados con ORA World Jet" },
          { en: "Lobby attended 24/7, valet and house car", es: "Vestíbulo 24/7, valet y auto de la casa" },
        ] as L[],
      },
    ],
    galleryKicker: { en: "Amenity gallery", es: "Galería de amenidades" } as L,
  },

  /* Why ORA World: how it is different (client call: "How is ORA World better?", "not just another apartment
     building", "nobody knows ORA World, so we have to build trust"). Each point is backed elsewhere on the page. */
  different: {
    eyebrow: { en: "Why ORA World", es: "Por qué ORA World" } as L,
    // Client, 16 Nov: an accent line above the cards; 17 Nov: the "Thoughtfully crafted" line, in the brand serif.
    script: {
      en: "Thoughtfully crafted communities where longevity, luxury, and nature exist in perfect harmony.",
      es: "Comunidades concebidas con esmero donde la longevidad, el lujo y la naturaleza conviven en perfecta armonía.",
    } as L,
    // Client, 16 Nov: this sentence replaces "Not another condo building".
    title: {
      en: "Thoughtfully crafted communities where longevity, luxury, and nature exist in perfect harmony.",
      es: "Comunidades concebidas con esmero donde la longevidad, el lujo y la naturaleza conviven en perfecta armonía.",
    } as L,
    intro: {
      en: "Three things no ordinary condo offers: care for your health, a better place for your income, and easy travel.",
      es: "Tres cosas que ningún condominio común ofrece: cuidado de su salud, un mejor lugar para su ingreso y viajes fáciles.",
    } as L,
    items: [
      {
        title: { en: "Longevity, built in", es: "Longevidad incluida" } as L,
        text: {
          en: "A total body scan, nutritionists, a ghost kitchen that cooks for you and an easy fitness program.",
          es: "Escaneo corporal completo, nutricionistas, una cocina fantasma que cocina para usted y un programa de ejercicio fácil.",
        } as L,
        href: "/longevity",
        tags: [{ en: "Body scan", es: "Escaneo corporal" }, { en: "Nutritionists", es: "Nutricionistas" }, { en: "Ghost kitchen", es: "Cocina fantasma" }, { en: "Fitness program", es: "Ejercicio" }] as L[],
      },
      {
        // Client, 16 Nov: this card carries the Act 60 line; the tax section left the homepage.
        title: { en: "Act 60: the tax benefits of living here", es: "Ley 60: los beneficios fiscales de vivir aquí" } as L,
        text: {
          en: "Puerto Rico's Act 60: 0% or 4% on investment income for residents, with our accountants to guide you.",
          es: "La Ley 60 de Puerto Rico: 0% o 4% sobre ingresos de inversión para residentes, con nuestros contadores para guiarle.",
        } as L,
        href: "/faq",
        tags: [{ en: "Act 60", es: "Ley 60" }, { en: "0% or 4%", es: "0% o 4%" }, { en: "Accountants", es: "Contadores" }] as L[],
      },
      {
        title: { en: "Travel, taken care of", es: "Viajes resueltos" } as L,
        text: {
          en: "Private charter flights between the US and your condo, a lobby attended 24/7 and a house car waiting.",
          es: "Vuelos chárter privados entre Estados Unidos y su condominio, un vestíbulo atendido 24/7 y el auto de la casa.",
        } as L,
        href: "#charters",
        tags: [{ en: "Private charters", es: "Chárter privados" }, { en: "24/7 lobby", es: "Vestíbulo 24/7" }, { en: "House car", es: "Auto de la casa" }] as L[],
      },
    ],
  },

  /* 02 Longevity and preventive health (brief §2, §4, lines) */
  prevention: {
    eyebrow: { en: "Longevity", es: "Longevidad" } as L,
    title: { en: "Planes don't fall from the sky", es: "Los aviones no se caen del cielo" } as L,
    intro: {
      en: "You have two lungs, two kidneys: that's redundancy. What you don't have is preventive maintenance.",
      es: "Tiene dos pulmones y dos riñones: eso es redundancia. Lo que no tiene es mantenimiento preventivo.",
    } as L,
    body: {
      en: "Most people only see a doctor when something hurts. ORA checks you before anything breaks, so issues like heart problems or cancer can be caught early. Follow the doctors' advice and give yourself the best chance at a longer life.",
      es: "La mayoría solo va al médico cuando algo duele. ORA lo revisa antes de que algo se rompa, para detectar a tiempo problemas como los cardíacos o el cáncer. Siga el consejo médico y dese la mejor oportunidad de una vida más larga.",
    } as L,
    bullets: [
      { en: "A total body scan for every member", es: "Un escaneo corporal completo para cada miembro" },
      { en: "A personal interview about your goals", es: "Una entrevista personal sobre sus metas" },
      { en: "Access to a list of cardiologists", es: "Acceso a una lista de cardiólogos" },
      { en: "Nutritionists on staff", es: "Nutricionistas en el equipo" },
    ] as L[],
    question: { en: "What is the value of an extra 10 years for you?", es: "¿Cuánto valen para usted 10 años más?" } as L,
    // Cipriani layout (client, 16 Nov): the four services as two cards.
    cardLabels: [{ en: "Checked early", es: "Revisión a tiempo" }, { en: "Your team", es: "Su equipo" }] as L[],
    questionSub: {
      en: "A million? Five? Ten? You can't take it with you, and your children are taken care of. Time and health are the real investment.",
      es: "¿Un millón? ¿Cinco? ¿Diez? No puede llevárselo, y sus hijos ya están cuidados. El tiempo y la salud son la verdadera inversión.",
    } as L,
  },

  /* 03 Fitness, nutrition and aging well (brief §3, §4) */
  fitness: {
    eyebrow: { en: "Fitness and nutrition", es: "Forma física y nutrición" } as L,
    title: { en: "Your body is self-made", es: "Su cuerpo se hace a sí mismo" } as L,
    cardLabels: [{ en: "Nutrition", es: "Nutrición" }, { en: "Fitness", es: "Ejercicio" }] as L[],
    intro: {
      en: "If you're living longer, don't you want to have a better life? Some people look 50 or 60 at 80; others look old at 60. ORA helps you be the first.",
      es: "Si vive más, ¿no quiere tener una vida mejor? Algunos aparentan 50 o 60 a los 80; otros se ven mayores a los 60. ORA le ayuda a ser de los primeros.",
    } as L,
    body: {
      en: "Aim for the 95th to 98th percentile for your age: an outlier, stronger and fitter than anyone in your situation. Your body is self-made, so you can work on it in advance. Start around 50, and feel like 30 or 35.",
      es: "Apunte al percentil 95 a 98 para su edad: un caso excepcional, más fuerte y en forma que cualquiera en su situación. Su cuerpo se hace a sí mismo, así que puede trabajarlo con anticipación. Empiece alrededor de los 50 y siéntase como a los 30 o 35.",
    } as L,
    bullets: [
      { en: "Nutritionists who set specifics, like your daily protein", es: "Nutricionistas que fijan lo específico, como su proteína diaria" },
      { en: "Meals built around what you like", es: "Comidas según lo que le gusta" },
      { en: "A ghost kitchen that cooks for you", es: "Una cocina fantasma que cocina para usted" },
      { en: "A fitness program that makes it easy", es: "Un programa de ejercicio que lo hace fácil" },
      { en: "Help gaining muscle and losing weight", es: "Ayuda para ganar músculo y perder peso" },
    ] as L[],
  },

  /* 04 Why Puerto Rico: Act 60 and what residents get (client, 15 Nov: talk about Act 60 and its tax benefits for people
     who move to Puerto Rico and become residents, not the nine-day week). Checked 15 Nov 2026 against summaries of
     Act 38-2026 (signed 10 Mar 2026; incorp.com, thecfoassociates.com, procopio.com): resident-investor applications
     filed by 31 Dec 2026 keep 0% on interest, dividends and post-move capital gains, through 2035; filed from
     1 Jan 2027, 4%, with the program running to 2055. Tax team to confirm before go-live (CONTENT-TODO.md). */
  why: {
    eyebrow: { en: "Why Puerto Rico", es: "Por qué Puerto Rico" } as L,
    title: { en: "Act 60: the tax benefits of living here", es: "Ley 60: los beneficios fiscales de vivir aquí" } as L,
    intro: {
      en: "Move to Puerto Rico, become a resident, and Act 60 lets you keep more of what you earn. Interest, dividends and capital gains made after you move are taxed at 0% if you apply by December 31, 2026, or 4% if you apply from 2027. And it is part of the United States: same passport, same dollar.",
      es: "Múdese a Puerto Rico, hágase residente y la Ley 60 le permite conservar más de lo que gana. Los intereses, dividendos y ganancias de capital generados después de mudarse tributan al 0% si solicita hasta el 31 de diciembre de 2026, o al 4% si solicita desde 2027. Y es parte de Estados Unidos: el mismo pasaporte, el mismo dólar.",
    } as L,
    body: { en: "To qualify, you:", es: "Para calificar, usted:" } as L,
    bullets: [
      { en: "Become a bona fide resident (generally at least 183 days a year in Puerto Rico)", es: "Se convierte en residente bona fide (en general, al menos 183 días al año en Puerto Rico)" },
      { en: "Buy a home in Puerto Rico within two years of your decree, such as a residence at Tesoro Del Mar", es: "Compra una vivienda en Puerto Rico dentro de los dos años del decreto, como una residencia en Tesoro Del Mar" },
      { en: "Make a yearly donation to Puerto Rico nonprofits and file a yearly report", es: "Hace una donación anual a organizaciones sin fines de lucro de Puerto Rico y presenta un informe anual" },
      { en: "Apply for your decree, with ORA's accountants guiding you", es: "Solicita su decreto, con la guía de los contadores de ORA" },
    ] as L[],
    stats: [
      { value: "0%", label: { en: "on interest, dividends and capital gains, if you apply by December 31, 2026", es: "sobre intereses, dividendos y ganancias de capital, si solicita hasta el 31 de diciembre de 2026" } as L },
      { value: "4%", label: { en: "on the same income, if you apply from January 1, 2027", es: "sobre los mismos ingresos, si solicita desde el 1 de enero de 2027" } as L },
      { value: "2055", label: { en: "the year the program now runs to", es: "el año hasta el que ahora llega el programa" } as L },
    ],
    note: {
      en: "General information, not tax or legal advice. Based on Act 60 as amended by Act 38-2026; ORA's accountants will confirm what applies to you.",
      es: "Información general, no asesoría fiscal ni legal. Basado en la Ley 60, enmendada por la Ley 38-2026; los contadores de ORA confirmarán lo que aplica a su caso.",
    } as L,
  },

  /* 05 Step inside: tour and film */
  tour: {
    eyebrow: { en: "Step inside", es: "Recorra" } as L,
    title: { en: "See it for yourself", es: "Véalo usted mismo" } as L,
    intro: {
      en: "Walk the 360° collection at your own pace, or watch the short film.",
      es: "Recorra la colección 360° a su ritmo, o vea la película corta.",
    } as L,
  },

  /* 06 Residences (with the penthouse) */
  residences: {
    eyebrow: { en: "Residences", es: "Residencias" } as L,
    title: { en: "Inspired by flight", es: "Inspiradas en el vuelo" } as L,
    cardLabels: [{ en: "Residences", es: "Residencias" }, { en: "Phase One", es: "Fase Uno" }] as L[],
    intro: {
      en: "Curved towers arc like wings, balconies reach toward the sea, and glass blurs the line between home and horizon.",
      es: "Torres curvas como alas, balcones hacia el mar y vidrio que borra el límite entre hogar y horizonte.",
    } as L,
    bullets: [
      { en: "Water views from every residence", es: "Vista al agua desde cada residencia" },
      { en: "Oversized balconies and wrap-around terraces", es: "Balcones amplios y terrazas envolventes" },
      { en: "10' ceilings; private elevators in most residences", es: "Techos de 10 pies; ascensor privado en la mayoría" },
      { en: "Scavolini kitchens with Gaggenau appliances", es: "Cocinas Scavolini con electrodomésticos Gaggenau" },
      { en: "60 residences in Phase One, 1 to 6 bedrooms", es: "60 residencias en la Fase Uno, de 1 a 6 dormitorios" },
      { en: "The Penthouse: floor 18, two levels, 9,807 sq ft", es: "El Penthouse: piso 18, dos niveles, 9,807 pies²" },
    ] as L[],
  },

  /* Interiors (client, 16 Nov: copy the Interiors section of the ORA World · Tesoro del Mar presentation; its text and
     lists are from the brochure). */
  interiors: {
    eyebrow: { en: "Interiors", es: "Interiores" } as L,
    title: { en: "Inspired living spaces", es: "Espacios inspirados" } as L,
    intro: {
      en: "Designed for indoor and outdoor living, the residences welcome the salt air and breathe with the ocean breeze.",
      es: "Pensadas para vivir dentro y fuera, las residencias reciben el aire salino y respiran con la brisa del mar.",
    } as L,
    lists: [
      {
        title: { en: "Inspired living spaces", es: "Espacios inspirados" } as L,
        items: [
          { en: "Balconies and wrap-around terraces", es: "Balcones y terrazas envolventes" },
          { en: "Panoramic ocean views through an expansive glass façade", es: "Vistas panorámicas al mar a través de una amplia fachada de vidrio" },
          { en: "Large-format porcelain tile flooring throughout", es: "Pisos de porcelanato de gran formato en toda la residencia" },
          { en: "Motorized window shades in every room", es: "Cortinas motorizadas en cada habitación" },
          { en: "Mitsubishi Electric multi-split air conditioning", es: "Aire acondicionado multi-split Mitsubishi Electric" },
          { en: "Walk-in closets with custom built-ins", es: "Vestidores con muebles a medida" },
          { en: "Integrated smart home technology, pre-wired for high-speed Wi-Fi", es: "Tecnología de hogar inteligente, precableado para Wi-Fi de alta velocidad" },
        ] as L[],
      },
      {
        title: { en: "Elevated kitchens", es: "Cocinas elevadas" } as L,
        items: [
          { en: "Gourmet kitchen with custom Italian cabinetry", es: "Cocina gourmet con gabinetes italianos a medida" },
          { en: "Quartzite countertops and backsplashes", es: "Encimeras y salpicaderos de cuarcita" },
          { en: "Fully integrated Gaggenau appliance suite", es: "Electrodomésticos Gaggenau totalmente integrados" },
          { en: "Refrigerator and freezer columns", es: "Columnas de refrigerador y congelador" },
          { en: "Convection oven and dishwasher", es: "Horno de convección y lavavajillas" },
          { en: "Built-in coffee machine", es: "Cafetera integrada" },
          { en: "Optional wine refrigerator", es: "Vinoteca opcional" },
        ] as L[],
      },
    ],
  },

  /* Floor-plan explorer heading (client, 16 Nov: copy the presentation's floor-plan section). */
  explorer: {
    eyebrow: { en: "Floor plans · Tower 1", es: "Planos · Torre 1" } as L,
    title: { en: "Find your residence", es: "Encuentre su residencia" } as L,
  },

  /* 07 Amenities: the full list, with the ORA health services and the ghost kitchen (brief §4; brochure p7) */
  amenities: {
    eyebrow: { en: "Amenities", es: "Amenidades" } as L,
    title: { en: "Ease, elevated", es: "La comodidad, elevada" } as L,
    intro: { en: "Over 65,000 sq ft of indoor and outdoor amenities, and the services that make a better life easy.", es: "Más de 65,000 pies² de amenidades interiores y exteriores, y los servicios que facilitan una vida mejor." } as L,
    groups: [
      {
        label: { en: "ORA health and longevity", es: "Salud y longevidad ORA" } as L,
        items: [
          { en: "Total body scan for every member", es: "Escaneo corporal completo para cada miembro" },
          { en: "Personal interview about your goals", es: "Entrevista personal sobre sus metas" },
          { en: "Nutritionists on staff", es: "Nutricionistas en el equipo" },
          { en: "Meals built around what you like", es: "Comidas a su gusto" },
          { en: "Ghost kitchen that cooks for members", es: "Cocina fantasma para los miembros" },
          { en: "An easy fitness program", es: "Un programa de ejercicio fácil" },
          { en: "Access to a list of cardiologists", es: "Acceso a una lista de cardiólogos" },
        ] as L[],
      },
      {
        label: { en: "The Clubhouse · 14,000 sq ft, members only", es: "El Clubhouse · 14,000 pies², solo miembros" } as L,
        items: [
          { en: "Café, bakery and corner store", es: "Café, panadería y tienda" },
          { en: "Fine-dining restaurant", es: "Restaurante de alta cocina" },
          { en: "Indoor and outdoor event spaces", es: "Espacios para eventos, interiores y exteriores" },
          { en: "Business center with private offices and 24/7 IT", es: "Centro de negocios con oficinas privadas y TI 24/7" },
          { en: "Golf simulator and lounge", es: "Simulador de golf y salón" },
          { en: "Tennis, half-court basketball and beach volleyball", es: "Tenis, media cancha de baloncesto y voleibol de playa" },
          { en: "Rooftop pool, sundeck and pool bar", es: "Piscina en la azotea, solárium y bar" },
          { en: "Fitness center and wellness spa", es: "Gimnasio y spa de bienestar" },
        ] as L[],
      },
      {
        label: { en: "The tower", es: "La torre" } as L,
        items: [
          { en: "18-hole putting course", es: "Campo de putting de 18 hoyos" },
          { en: "Resort-style pool with sundeck and bar", es: "Piscina estilo resort con solárium y bar" },
          { en: "Fitness center and pilates studio", es: "Gimnasio y estudio de pilates" },
          { en: "Spa: massage, treatments and salon", es: "Spa: masajes, tratamientos y salón" },
          { en: "Outdoor yoga terrace", es: "Terraza de yoga" },
          { en: "Reservable private offices", es: "Oficinas privadas reservables" },
          { en: "Resident lounge with art and bar service", es: "Salón de residentes con arte y bar" },
          { en: "Children's play areas and teen lounge", es: "Áreas infantiles y salón juvenil" },
          { en: "Private climate-controlled storage", es: "Almacenamiento privado climatizado" },
        ] as L[],
      },
      {
        label: { en: "Coast and service", es: "Costa y servicio" } as L,
        items: [
          { en: "Beach club with food and drinks", es: "Club de playa con comida y bebida" },
          { en: "Slipway for boat launching", es: "Rampa para embarcaciones" },
          { en: "Two-mile garden walking path", es: "Sendero de dos millas entre jardines" },
          { en: "Porte-cochère and a 24/7 lobby", es: "Pórtico y vestíbulo 24/7" },
          { en: "Valet and self-parking", es: "Valet y estacionamiento propio" },
          { en: "House car and golf cart service", es: "Auto de la casa y carrito de golf" },
        ] as L[],
      },
    ],
  },

  /* 08 Private charters. No helicopter, helipad or pickup claims. */
  charters: {
    eyebrow: { en: "Private charters", es: "Vuelos chárter privados" } as L,
    title: { en: "Fly private to Puerto Rico", es: "Vuele privado a Puerto Rico" } as L,
    intro: {
      en: "Owners fly private between the United States and their condo in Puerto Rico.",
      es: "Los propietarios vuelan en privado entre Estados Unidos y su condominio en Puerto Rico.",
    } as L,
    cardLabels: [{ en: "Flights", es: "Vuelos" }, { en: "On arrival", es: "Al llegar" }] as L[],
    film: {
      kicker: { en: "ORA World Jet", es: "ORA World Jet" } as L,
      title: { en: "Private charters", es: "Vuelos chárter privados" } as L,
      text: { en: "Between the United States and your condo in Puerto Rico.", es: "Entre Estados Unidos y su condominio en Puerto Rico." } as L,
    },
    bullets: [
      { en: "Private jet charters through ORA World Jet", es: "Vuelos privados con ORA World Jet" },
      { en: "About 30 minutes from San Juan's airport", es: "A unos 30 minutos del aeropuerto de San Juan" },
      { en: "A private lobby attended 24/7, with valet", es: "Vestíbulo privado atendido 24/7, con valet" },
      { en: "House car and golf cart service", es: "Auto de la casa y carrito de golf" },
    ] as L[],
  },

  /* 09 Floor plans and pricing */
  plans: {
    eyebrow: { en: "Floor plans and pricing", es: "Planos y precios" } as L,
    title: { en: "Phase One", es: "Fase Uno" } as L,
    intro: {
      en: "60 residences on floors 5 to 18 of Tower 1. Early pricing averages $2,250 per sq ft; later units will likely cost more.",
      es: "60 residencias en los pisos 5 al 18 de la Torre 1. El precio inicial promedia $2,250 por pie²; las unidades posteriores probablemente costarán más.",
    } as L,
    tiers: [
      { label: { en: "Lower units", es: "Unidades bajas" } as L, value: "$2,000" },
      { label: { en: "Average", es: "Promedio" } as L, value: "$2,250" },
      { label: { en: "Higher units", es: "Unidades altas" } as L, value: "$2,500" },
    ],
    startingFrom: { en: "Starting from", es: "Desde" } as L,
    perSqFt: { en: "per sq ft", es: "por pie²" } as L,
    plansNote: {
      en: "Inquire for the full Phase 1 floor plans and brochure.",
      es: "Consulte para recibir los planos de la Fase 1 y el folleto.",
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
          en: "Watch the film, take the 360° tour, and see how Act 60 fits your plans.",
          es: "Vea la película, haga el tour 360° y descubra cómo la Ley 60 encaja en sus planes.",
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
          en: "Inquire, and our team will talk with you about your goals, pricing, availability and a visit.",
          es: "Consulte, y nuestro equipo hablará con usted sobre sus metas, precios, disponibilidad y una visita.",
        } as L,
        href: "#inquire",
        link: { en: "Inquire", es: "Consultar" } as L,
      },
    ],
    address: { en: "Tesoro Del Mar, Dorado · Vega Alta, Puerto Rico 00692", es: "Tesoro Del Mar, Dorado · Vega Alta, Puerto Rico 00692" } as L,
  },

  /* Location, in the Cipriani "A branded address" layout (client, 16 Nov). Facts already on the site: the address,
     30 minutes from San Juan's airport (published), Balneario Cerro Gordo within walking distance (places.ts), the
     cove on the north coast and the national park beside the walking path. */
  location: {
    eyebrow: { en: "Location", es: "Ubicación" } as L,
    title: { en: "Puerto Rico's north coast", es: "La costa norte de Puerto Rico" } as L,
    intro: { en: "Dorado · Vega Alta, above a turquoise cove.", es: "Dorado · Vega Alta, sobre una cala turquesa." } as L,
    addressLabel: { en: "Address", es: "Dirección" } as L,
    address: { en: "Tesoro Del Mar, Dorado · Vega Alta, Puerto Rico 00692", es: "Tesoro Del Mar, Dorado · Vega Alta, Puerto Rico 00692" } as L,
    bullets: [
      { en: "About 30 minutes from San Juan's airport", es: "A unos 30 minutos del aeropuerto de San Juan" },
      { en: "Balneario Cerro Gordo beach within walking distance", es: "La playa Balneario Cerro Gordo a pie" },
      { en: "A two-mile garden path beside a national park", es: "Un sendero de dos millas junto a un parque nacional" },
    ] as L[],
    openMap: { en: "Open in Maps", es: "Abrir en Mapas" } as L,
  },

  /* 11 Inquire (brief §7: who he is talking to) */
  inquire: {
    eyebrow: { en: "Inquire", es: "Consultar" } as L,
    title: { en: "Inquire about Tesoro Del Mar", es: "Consulte por Tesoro Del Mar" } as L,
    intro: {
      en: "For professionals, business owners and doctors who have built something, whose children are taken care of, and who see time and health as the real investment. Tell us your goals; we'll follow up personally.",
      es: "Para profesionales, empresarios y médicos que han construido algo, cuyos hijos ya están cuidados y que ven el tiempo y la salud como la verdadera inversión. Cuéntenos sus metas; le responderemos personalmente.",
    } as L,
    bullets: [
      { en: "A personal conversation about your goals", es: "Una conversación personal sobre sus metas" },
      { en: "The brochure, Phase 1 floor plans and pricing", es: "El folleto, los planos y los precios de la Fase 1" },
      { en: "How the decree could apply to you", es: "Cómo podría aplicarle el decreto" },
    ] as L[],
  },
};
