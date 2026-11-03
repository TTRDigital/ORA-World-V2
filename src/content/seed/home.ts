import type { HomeContent, ResilienceFeature } from "../types";
import { tdm, life } from "./images";

/** The nine published security and resilience features (oraworld.com/our-amenities, "Resilient By Design"). */
export const resilienceFeatures: ResilienceFeature[] = [
  {
    slug: "hurricane",
    title: { en: "Hurricane-resilient design", es: "Diseño resistente a huracanes" },
    short: { en: "Category 5", es: "Categoría 5" },
    points: [
      { en: "Structures engineered to withstand Category 5 hurricanes.", es: "Estructuras diseñadas para resistir huracanes de categoría 5." },
      { en: "Impact-resistant windows, reinforced walls and advanced drainage systems.", es: "Ventanas resistentes a impactos, muros reforzados y sistemas avanzados de drenaje." },
    ],
  },
  {
    slug: "seismic",
    title: { en: "Seismic resilience", es: "Resiliencia sísmica" },
    short: { en: "Seismic", es: "Sísmica" },
    points: [
      { en: "Advanced seismic engineering to ensure safety during earthquakes.", es: "Ingeniería sísmica avanzada para garantizar la seguridad durante terremotos." },
      { en: "Materials and construction techniques that exceed local building codes for seismic zones.", es: "Materiales y técnicas de construcción que superan los códigos locales para zonas sísmicas." },
    ],
  },
  {
    slug: "security",
    title: { en: "24/7 security services", es: "Seguridad 24/7" },
    short: { en: "24/7 security", es: "Seguridad 24/7" },
    points: [
      { en: "Professionally trained security teams on site.", es: "Equipos de seguridad profesionales en el lugar." },
      { en: "Regular patrols, secure perimeters and monitored access points.", es: "Patrullas regulares, perímetros seguros y accesos monitoreados." },
    ],
  },
  {
    slug: "smart",
    title: { en: "Smart security systems", es: "Sistemas inteligentes de seguridad" },
    short: { en: "Smart systems", es: "Sistemas inteligentes" },
    points: [
      { en: "State-of-the-art surveillance with AI-enhanced monitoring.", es: "Vigilancia de última generación con monitoreo asistido por IA." },
      { en: "Smart locks, motion detectors and remote-access security controls for residents.", es: "Cerraduras inteligentes, detectores de movimiento y controles de acceso remoto para residentes." },
    ],
  },
  {
    slug: "power",
    title: { en: "Backup power systems", es: "Sistemas de energía de respaldo" },
    short: { en: "Backup power", es: "Energía de respaldo" },
    points: [
      { en: "High-capacity generators to ensure uninterrupted power during outages.", es: "Generadores de alta capacidad para garantizar energía ininterrumpida durante apagones." },
      { en: "Solar panels and battery storage for sustainable, reliable energy backups.", es: "Paneles solares y almacenamiento en baterías para un respaldo energético sostenible y fiable." },
    ],
  },
  {
    slug: "flood",
    title: { en: "Flood and stormwater management", es: "Gestión de inundaciones y aguas pluviales" },
    short: { en: "Stormwater", es: "Aguas pluviales" },
    points: [
      { en: "Elevated foundations and landscape grading to prevent flooding.", es: "Cimientos elevados y nivelación del terreno para prevenir inundaciones." },
      { en: "Advanced stormwater management systems to reduce runoff and protect the property.", es: "Sistemas avanzados de manejo de aguas pluviales que reducen la escorrentía y protegen la propiedad." },
    ],
  },
  {
    slug: "safe-rooms",
    title: { en: "Private safe rooms", es: "Cuartos seguros privados" },
    short: { en: "Safe rooms", es: "Cuartos seguros" },
    points: [{ en: "Reinforced safe rooms in residences for additional peace of mind.", es: "Cuartos seguros reforzados en las residencias para mayor tranquilidad." }],
  },
  {
    slug: "preparedness",
    title: { en: "Emergency preparedness plans", es: "Planes de preparación para emergencias" },
    short: { en: "Preparedness", es: "Preparación" },
    points: [
      { en: "On-site emergency shelters equipped with supplies.", es: "Refugios de emergencia en el lugar, equipados con suministros." },
      { en: "Clear evacuation routes and communication systems for residents during emergencies.", es: "Rutas de evacuación claras y sistemas de comunicación para residentes durante emergencias." },
    ],
  },
  {
    slug: "training",
    title: { en: "Community resilience training", es: "Formación comunitaria en resiliencia" },
    short: { en: "Training", es: "Formación" },
    points: [{ en: "Workshops and resources to educate residents on emergency protocols and resilience planning.", es: "Talleres y recursos para formar a los residentes en protocolos de emergencia y planificación de resiliencia." }],
  },
];

export const home: HomeContent = {
  hero: {
    enabled: true,
    headline: { en: "Where the island *breathes* with you", es: "Donde la isla *respira* con usted" },
    line: {
      en: "Luxury, eco-conscious residences in Dorado, Puerto Rico, a walk from Balneario Cerro Gordo and thirty minutes from the airport.",
      es: "Residencias de lujo y conciencia ecológica en Dorado, Puerto Rico, a pasos del Balneario Cerro Gordo y a treinta minutos del aeropuerto.",
    },
    ctaPrimary: { en: "Book a visit", es: "Reserve una visita" },
    ctaFilm: { en: "Watch the film", es: "Ver la película" },
    statsLabel: { en: "Tesoro Del Mar", es: "Tesoro Del Mar" },
    stats: [
      { value: 10, label: { en: "acres", es: "acres" } },
      { value: 129, label: { en: "residences", es: "residencias" } },
      { value: 42, label: { en: "hotel suites", es: "suites de hotel" } },
      { value: 65500, label: { en: "sq ft of amenities", es: "pies² de amenidades" } },
    ],
    thumbnails: [
      { label: { en: "Arrival", es: "Llegada" }, image: tdm.exteriorRoad },
      { label: { en: "Foyer", es: "Vestíbulo" }, image: tdm.foyerAtrium },
      { label: { en: "Residence", es: "Residencia" }, image: tdm.aptLiving },
      { label: { en: "Penthouse", es: "Penthouse" }, image: tdm.penthouseLiving },
    ],
  },
  numbers: {
    enabled: true,
    label: { en: "Tesoro Del Mar in numbers", es: "Tesoro Del Mar en cifras" },
    headline: { en: "Ten acres, *measured* in moments", es: "Diez acres, *medidos* en momentos" },
    aerial: tdm.aerialCoast,
    beach: life.beach,
    stats: [
      { value: 335995, label: { en: "sq ft of land", es: "pies² de terreno" } },
      { value: 129, label: { en: "contemporary apartments", es: "apartamentos contemporáneos" } },
      { value: 42, label: { en: "hotel suites", es: "suites de hotel" } },
      { value: 65500, label: { en: "sq ft of amenities", es: "pies² de amenidades" } },
    ],
  },
  explorer: {
    enabled: true,
    label: { en: "Residence explorer", es: "Explorador de residencias" },
    headline: { en: "Choose your *altitude*", es: "Elija su *altura*" },
    intro: {
      en: "Contemporary apartments and luxurious villas, a penthouse level and 42 hotel suites at the community hub. Hover or tap a band of the tower to explore each collection.",
      es: "Apartamentos contemporáneos y villas de lujo, un nivel de penthouse y 42 suites de hotel en el centro de la comunidad. Pase el cursor o toque una franja de la torre para explorar cada colección.",
    },
    note: {
      en: "The floor mapping is illustrative until the client confirms it. Bedrooms, sizes and prices read \"To be confirmed\" until published.",
      es: "La distribución por pisos es ilustrativa hasta que el cliente la confirme. Habitaciones, tamaños y precios aparecen como \"Por confirmar\" hasta su publicación.",
    },
  },
  rooms: {
    enabled: true,
    label: { en: "Room by room", es: "Espacio por espacio" },
    headline: { en: "Stone, wood and *light*", es: "Piedra, madera y *luz*" },
    rooms: [
      {
        slug: "foyer",
        name: { en: "Foyer", es: "Vestíbulo" },
        image: tdm.foyerAtrium,
        hotspots: [
          { x: 30, y: 45, title: { en: "Stone", es: "Piedra" }, text: { en: "Premium materials: stone, wood and brushed metals contribute to an atmosphere of modern elegance.", es: "Materiales premium: piedra, madera y metales cepillados aportan una atmósfera de elegancia moderna." } },
          { x: 70, y: 30, title: { en: "Double height", es: "Doble altura" }, text: { en: "Expansive glass surfaces and light, airy elements that appear to soar above the landscape.", es: "Amplias superficies de cristal y elementos ligeros que parecen elevarse sobre el paisaje." } },
        ],
      },
      {
        slug: "living",
        name: { en: "Living", es: "Sala" },
        image: tdm.aptLiving,
        hotspots: [
          { x: 50, y: 40, title: { en: "Open concept", es: "Concepto abierto" }, text: { en: "Open-concept layouts encourage flow and connection.", es: "Las distribuciones de concepto abierto favorecen el flujo y la conexión." } },
          { x: 78, y: 45, title: { en: "Floor-to-ceiling windows", es: "Ventanales de piso a techo" }, text: { en: "Floor-to-ceiling windows invite the outdoors in, filling each space with light, views and serenity.", es: "Los ventanales de piso a techo traen el exterior adentro y llenan cada espacio de luz, vistas y serenidad." } },
        ],
      },
      {
        slug: "bedroom",
        name: { en: "Primary bedroom", es: "Dormitorio principal" },
        image: tdm.aptBedroom,
        hotspots: [
          { x: 72, y: 40, title: { en: "Ocean or garden views", es: "Vistas al mar o al jardín" }, text: { en: "A private suite with ocean or garden views, designed to nurture both luxury and ease.", es: "Una suite privada con vistas al mar o al jardín, pensada para el lujo y la serenidad." } },
          { x: 35, y: 60, title: { en: "Curated finishes", es: "Acabados seleccionados" }, text: { en: "Organic materials, clean lines and curated finishes echo the natural surroundings.", es: "Materiales orgánicos, líneas limpias y acabados seleccionados hacen eco del entorno natural." } },
        ],
      },
      {
        slug: "bath",
        name: { en: "Bath", es: "Baño" },
        image: tdm.aptBath2,
        hotspots: [
          { x: 50, y: 50, title: { en: "Natural stone", es: "Piedra natural" }, text: { en: "High-end finishes and a palette inspired by the natural surroundings.", es: "Acabados de alta gama y una paleta inspirada en el entorno natural." } },
        ],
      },
      {
        slug: "study",
        name: { en: "Study", es: "Estudio" },
        image: tdm.aptStudy,
        hotspots: [
          { x: 40, y: 45, title: { en: "Intimate alcoves", es: "Rincones íntimos" }, text: { en: "Generous living spaces for entertaining and intimate alcoves for retreat.", es: "Espacios amplios para recibir y rincones íntimos para el retiro." } },
        ],
      },
      {
        slug: "penthouse",
        name: { en: "Penthouse", es: "Penthouse" },
        image: tdm.penthouseLiving,
        hotspots: [
          { x: 30, y: 35, title: { en: "Floating staircase", es: "Escalera flotante" }, text: { en: "Custom detailing and creative precision in every home.", es: "Detalles a medida y precisión creativa en cada hogar." } },
          { x: 75, y: 50, title: { en: "Private terrace", es: "Terraza privada" }, text: { en: "Private terraces that become daily sanctuaries, cantilevered like wings.", es: "Terrazas privadas que se convierten en santuarios diarios, en voladizo como alas." } },
        ],
      },
    ],
  },
  resilience: {
    enabled: true,
    label: { en: "Resilient by design", es: "Resiliente por diseño" },
    headline: { en: "Calm in every *season*", es: "Serenidad en cada *temporada*" },
    intro: {
      en: "Every ORA World development anticipates environmental challenges with future-forward structures and robust on-site security. Nine published features, one dial.",
      es: "Cada desarrollo de ORA World anticipa los retos del entorno con estructuras preparadas para el futuro y una seguridad sólida en el lugar. Nueve características publicadas, un solo dial.",
    },
    features: resilienceFeatures,
    image: tdm.aerialTowers,
  },
  living: {
    enabled: true,
    label: { en: "Living", es: "Vida diaria" },
    headline: { en: "A day, *curated*", es: "Un día a su *medida*" },
    intro: {
      en: "Thoughtfully curated amenities redefine modern luxury, offering spaces that inspire relaxation, connection and well-being. Filter by what matters to you.",
      es: "Amenidades cuidadosamente seleccionadas redefinen el lujo moderno con espacios que inspiran descanso, conexión y bienestar. Filtre por lo que más le importa.",
    },
    familyItems: [
      { en: "Kids' adventure camps", es: "Campamentos de aventura infantiles" },
      { en: "Family pools", es: "Piscinas familiares" },
      { en: "Interactive game rooms", es: "Salas de juego interactivas" },
      { en: "Private school partnerships and tutoring", es: "Alianzas con escuelas privadas y tutorías" },
      { en: "Family movie screenings and cultural nights", es: "Cine en familia y noches culturales" },
      { en: "Personalized healthcare clinics and concierge", es: "Clínicas de salud personalizadas y conserjería" },
    ],
    petItems: [
      { en: "Secure dog parks", es: "Parques caninos seguros" },
      { en: "Grooming stations", es: "Estaciones de aseo" },
      { en: "Daycare facilities", es: "Guardería" },
      { en: "Open play areas", es: "Áreas de juego abiertas" },
      { en: "On-demand veterinary care and training", es: "Atención veterinaria a demanda y adiestramiento" },
      { en: "Pet-friendly community events", es: "Eventos comunitarios para mascotas" },
    ],
  },
  island: {
    enabled: true,
    label: { en: "The island", es: "La isla" },
    headline: { en: "Puerto Rico, within *reach*", es: "Puerto Rico, al *alcance*" },
    intro: {
      en: "From sun-kissed beaches to emerald mountains, the island is a place of extraordinary contrasts. Drag through the places residents reach from Dorado.",
      es: "De playas doradas a montañas esmeralda, la isla es un lugar de contrastes extraordinarios. Deslice por los lugares a los que llegan los residentes desde Dorado.",
    },
    places: [
      { slug: "shore", name: { en: "The shore", es: "La costa" }, text: { en: "Sparkling turquoise waters lap against soft sandy shores, a walk from Tesoro Del Mar at Balneario Cerro Gordo.", es: "Aguas turquesa resplandecientes acarician suaves orillas de arena, a pasos de Tesoro Del Mar en el Balneario Cerro Gordo." }, image: life.beach, poi: "cerro-gordo" },
      { slug: "el-yunque", name: { en: "El Yunque", es: "El Yunque" }, text: { en: "Hike the trails of El Yunque National Forest beneath serene canopies and hidden waterfalls.", es: "Recorra los senderos del Bosque Nacional El Yunque bajo doseles serenos y cascadas escondidas." }, image: life.rainforest, poi: "el-yunque" },
      { slug: "bio-bays", name: { en: "Bioluminescent bays", es: "Bahías bioluminiscentes" }, text: { en: "Paddle through the bioluminescent bays or sail into the sunset.", es: "Reme por las bahías bioluminiscentes o navegue hacia el atardecer." }, image: life.sailing, poi: null },
      { slug: "old-san-juan", name: { en: "Old San Juan", es: "Viejo San Juan" }, text: { en: "Wander the cobblestone streets of Old San Juan with its colorful colonial architecture.", es: "Pasee por las calles adoquinadas del Viejo San Juan y su colorida arquitectura colonial." }, image: life.reception, poi: "old-san-juan" },
      { slug: "golf", name: { en: "Golf", es: "Golf" }, text: { en: "Access to championship golf courses with lessons from PGA professionals.", es: "Acceso a campos de golf de campeonato con clases de profesionales de la PGA." }, image: tdm.exteriorGolf, poi: "golf" },
      { slug: "culinary", name: { en: "Culinary", es: "Gastronomía" }, text: { en: "The aromas of mofongo and lechón, the rhythms of salsa and bomba, farm-to-table dinners and rum tastings.", es: "Los aromas del mofongo y el lechón, los ritmos de la salsa y la bomba, cenas de la huerta a la mesa y catas de ron." }, image: life.culinary, poi: null },
    ],
  },
  compare: {
    enabled: true,
    label: { en: "Two projects", es: "Dos proyectos" },
    headline: { en: "Tesoro Del Mar and Dorado Waterfalls, *side by side*", es: "Tesoro Del Mar y Dorado Waterfalls, *lado a lado*" },
    intro: {
      en: "Both in Dorado, both eco-luxury, each at its own scale. Toggle the rows to compare what is published.",
      es: "Ambos en Dorado, ambos de ecolujo, cada uno a su escala. Alterne las filas para comparar lo publicado.",
    },
  },
  invest: {
    enabled: true,
    label: { en: "Invest with clarity", es: "Invierta con claridad" },
    headline: { en: "Three questions before the *numbers*", es: "Tres preguntas antes de los *números*" },
    intro: {
      en: "Puerto Rico's Act 60 consolidates the island's incentive programs. Answer three questions to find the published sections that apply to your situation, then talk to an advisor.",
      es: "La Ley 60 de Puerto Rico consolida los programas de incentivos de la isla. Responda tres preguntas para encontrar las secciones publicadas que aplican a su situación y luego hable con un asesor.",
    },
    disclaimer: {
      en: "General information, not tax or legal advice. Nothing here determines eligibility. Incentives depend on individual circumstances and are subject to change. Consult a qualified tax attorney or CPA in Puerto Rico.",
      es: "Información general, no asesoría fiscal ni legal. Nada de lo aquí expuesto determina elegibilidad. Los incentivos dependen de cada caso y están sujetos a cambios. Consulte a un abogado tributario o CPA calificado en Puerto Rico.",
    },
  },
  portfolio: {
    enabled: true,
    label: { en: "Portfolio", es: "Portafolio" },
    headline: { en: "Twelve *addresses* across Puerto Rico", es: "Doce *direcciones* en Puerto Rico" },
    intro: {
      en: "From Dorado to Guayama, every ORA World community blends modern living with the nature around it. Tap a pin or a card.",
      es: "De Dorado a Guayama, cada comunidad de ORA World integra la vida moderna con la naturaleza que la rodea. Toque un pin o una tarjeta.",
    },
  },
  faq: {
    enabled: true,
    label: { en: "Questions", es: "Preguntas" },
    headline: { en: "Ask us *anything*", es: "Pregúntenos lo que *quiera*" },
    slugs: ["what-is-ora-world", "where-is-tesoro", "what-is-tesoro", "pricing", "hurricanes", "act-60", "pets", "brokers"],
  },
  visit: {
    enabled: true,
    label: { en: "Book a visit", es: "Reserve una visita" },
    headline: { en: "See it in *person*", es: "Véalo en *persona*" },
    text: {
      en: "Choose the sales gallery or a video call. A member of the sales team will confirm the time and walk you through every detail.",
      es: "Elija la galería de ventas o una videollamada. Un miembro del equipo de ventas confirmará la hora y le mostrará cada detalle.",
    },
    image: tdm.exteriorGolf,
  },
};
