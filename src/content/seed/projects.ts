import type { Project, GalleryImage } from "../types";
import { tdm, dw, life, places } from "./images";

export const projects: Project[] = [
  {
    slug: "tesoro-del-mar",
    flagship: true,
    name: { en: "Tesoro Del Mar", es: "Tesoro Del Mar" },
    tagline: { en: "Harmony in modernity and nature", es: "Armonía entre modernidad y naturaleza" },
    location: { en: "Dorado, Vega Alta, Puerto Rico 00692", es: "Dorado, Vega Alta, Puerto Rico 00692" },
    lat: 18.4542,
    lng: -66.3178,
    summary: {
      en: [
        "Tesoro Del Mar is an ambitious 10-acre development designed to embody the themes of rejuvenation and community. Situated near a national park with panoramic ocean views, it blends nature and modernity with sensory gardens and scenic walking paths, the gentle sea breeze and beautiful sunsets.",
      ],
      es: [
        "Tesoro Del Mar es un ambicioso desarrollo de 10 acres concebido en torno a la renovación y la comunidad. Situado junto a un parque nacional con vistas panorámicas al mar, integra naturaleza y modernidad con jardines sensoriales y paseos escénicos, la brisa marina y atardeceres memorables.",
      ],
    },
    facts: [
      { label: { en: "Location", es: "Ubicación" }, value: { en: "Dorado, Vega Alta", es: "Dorado, Vega Alta" }, confirmed: true },
      { label: { en: "Land", es: "Terreno" }, value: { en: "10 acres · 335,995 sq ft", es: "10 acres · 335,995 pies²" }, confirmed: true },
      { label: { en: "Residences", es: "Residencias" }, value: { en: "129 contemporary apartments and luxurious villas", es: "129 apartamentos contemporáneos y villas de lujo" }, confirmed: true },
      { label: { en: "Hotel", es: "Hotel" }, value: { en: "Boutique hotel, 42 suites", es: "Hotel boutique, 42 suites" }, confirmed: true },
      { label: { en: "Amenities", es: "Amenidades" }, value: { en: "65,500 sq ft: clubhouse, tennis and basketball courts, fitness center, jogging paths, playgrounds, sensory gardens", es: "65,500 pies²: clubhouse, canchas de tenis y baloncesto, gimnasio, senderos para correr, parques infantiles, jardines sensoriales" }, confirmed: true },
      { label: { en: "Beach", es: "Playa" }, value: { en: "Walking distance to Balneario Cerro Gordo", es: "A pasos del Balneario Cerro Gordo" }, confirmed: true },
      { label: { en: "Airport", es: "Aeropuerto" }, value: { en: "30 minutes", es: "30 minutos" }, confirmed: true },
      { label: { en: "Nature", es: "Naturaleza" }, value: { en: "Near a national park", es: "Junto a un parque nacional" }, confirmed: true },
      { label: { en: "Retail and offices", es: "Comercio y oficinas" }, value: null, confirmed: false },
      { label: { en: "Delivery", es: "Entrega" }, value: null, confirmed: false },
    ],
    sections: [
      {
        title: { en: "Architectural concept", es: "Concepto arquitectónico" },
        body: {
          en: [
            "The architectural concept draws inspiration from the graceful flight of birds, creating structures that evoke a sense of freedom and movement. The buildings feature sleek, aerodynamic forms with curved facades, expansive glass surfaces and light, airy elements that appear to soar above the landscape.",
            "Cantilevered terraces and balconies extend outward like wings, offering panoramic views while being thoughtfully landscaped with native plants and flowers. The open design promotes natural ventilation and daylight, contributing to both beauty and sustainability.",
          ],
          es: [
            "El concepto arquitectónico se inspira en el vuelo elegante de las aves, creando estructuras que evocan libertad y movimiento. Los edificios presentan formas aerodinámicas con fachadas curvas, amplias superficies de cristal y elementos ligeros que parecen elevarse sobre el paisaje.",
            "Terrazas y balcones en voladizo se extienden como alas, ofreciendo vistas panorámicas, ajardinados con plantas y flores nativas. El diseño abierto favorece la ventilación natural y la luz de día, aportando belleza y sostenibilidad.",
          ],
        },
        image: tdm.exteriorRoad,
      },
      {
        title: { en: "Community highlights", es: "Lo mejor de la comunidad" },
        body: {
          en: [
            "Contemporary apartments and luxurious villas ensure a variety of high-quality living options, with easy access to Balneario Cerro Gordo Beach. The community hub includes a state-of-the-art clubhouse and a boutique hotel.",
            "Emphasizing active and healthy living, Tesoro Del Mar features tennis courts, basketball courts and a fitness center. Scenic jogging and walking paths wind through the adjacent national park, and playgrounds provide a stimulating environment for children.",
          ],
          es: [
            "Apartamentos contemporáneos y villas de lujo ofrecen opciones de vida de alta calidad, con fácil acceso al Balneario Cerro Gordo. El centro de la comunidad incluye un clubhouse de última generación y un hotel boutique.",
            "Con énfasis en una vida activa y saludable, Tesoro Del Mar cuenta con canchas de tenis y baloncesto y un gimnasio. Senderos para correr y caminar recorren el parque nacional adyacente, y los parques infantiles ofrecen un entorno estimulante para los niños.",
          ],
        },
        image: tdm.exteriorGolf,
      },
      {
        title: { en: "Interiors", es: "Interiores" },
        body: {
          en: [
            "Inside each residence, cutting-edge design meets timeless quality. High-end finishes, custom detailing and a palette inspired by the natural surroundings create a living experience that is both sophisticated and serene.",
            "Open-concept layouts encourage flow and connection, while expansive windows frame sweeping views and bathe the interiors in natural light. Premium materials, stone, wood and brushed metals, contribute to an atmosphere of modern elegance.",
          ],
          es: [
            "En cada residencia, el diseño de vanguardia se une a la calidad atemporal. Acabados de alta gama, detalles a medida y una paleta inspirada en el entorno natural crean una experiencia sofisticada y serena.",
            "Las distribuciones abiertas favorecen el flujo y la conexión, mientras amplios ventanales enmarcan vistas panorámicas y bañan los interiores de luz natural. Materiales premium, piedra, madera y metales cepillados, aportan una atmósfera de elegancia moderna.",
          ],
        },
        image: tdm.aptLiving,
      },
    ],
    hero: tdm.exteriorPull,
    gallery: [tdm.aerialCoast, tdm.aerialTowers, tdm.exteriorRoad, tdm.exteriorPull, tdm.exteriorGolf, tdm.foyerSignage, tdm.foyerAtrium, tdm.aptLiving, tdm.aptBedroom, tdm.aptBath2, tdm.penthouseDining, tdm.hotelSuite],
  },
  {
    slug: "dorado-waterfalls",
    name: { en: "Dorado Waterfalls", es: "Dorado Waterfalls" },
    tagline: { en: "A sustainable community that harmonizes modern living with nature", es: "Una comunidad sostenible que armoniza la vida moderna con la naturaleza" },
    location: { en: "Dorado, Puerto Rico", es: "Dorado, Puerto Rico" },
    lat: null,
    lng: null,
    summary: {
      en: [
        "Dorado Waterfalls is an ambitious and visionary project designed to harmonize human living spaces with the natural environment. Nestled amidst majestic mountains and diverse topography, the project is centered around a vibrant river that weaves through the terrain.",
      ],
      es: [
        "Dorado Waterfalls es un proyecto ambicioso y visionario diseñado para armonizar los espacios de vida con el entorno natural. Enclavado entre montañas majestuosas y una topografía diversa, el proyecto gira en torno a un río vibrante que serpentea por el terreno.",
      ],
    },
    facts: [
      { label: { en: "Location", es: "Ubicación" }, value: { en: "Dorado", es: "Dorado" }, confirmed: true },
      { label: { en: "Land", es: "Terreno" }, value: { en: "Over 10 million sq ft", es: "Más de 10 millones de pies²" }, confirmed: true },
      { label: { en: "Residences", es: "Residencias" }, value: { en: "1,518 apartments and 18 villas", es: "1,518 apartamentos y 18 villas" }, confirmed: true },
      { label: { en: "Hotel", es: "Hotel" }, value: { en: "Hotel, 60 suites", es: "Hotel, 60 suites" }, confirmed: true },
      { label: { en: "Amenities", es: "Amenidades" }, value: { en: "120,000 sq ft, clubhouse, sports facilities, playgrounds, walking trails, helipad", es: "120,000 pies², clubhouse, instalaciones deportivas, parques infantiles, senderos, helipuerto" }, confirmed: true },
      { label: { en: "Beach", es: "Playa" }, value: null, confirmed: false },
      { label: { en: "Airport", es: "Aeropuerto" }, value: { en: "16 miles from San Juan's airport · 25–30 minutes to San Juan", es: "A 16 millas del aeropuerto de San Juan · 25–30 minutos a San Juan" }, confirmed: true },
      { label: { en: "Nature", es: "Naturaleza" }, value: { en: "Eco park with jogging and hiking paths", es: "Ecoparque con senderos para correr y caminar" }, confirmed: true },
      { label: { en: "Retail and offices", es: "Comercio y oficinas" }, value: { en: "88,000 sq ft retail · 66,000 sq ft offices and medical clinics", es: "88,000 pies² comerciales · 66,000 pies² de oficinas y clínicas" }, confirmed: true },
      { label: { en: "Delivery", es: "Entrega" }, value: null, confirmed: false },
    ],
    sections: [
      {
        title: { en: "Architectural concept", es: "Concepto arquitectónico" },
        body: {
          en: [
            "Buildings resemble cascading waterfalls: fluid, multi-tiered designs with glass facades, green terraces and flowing water elements. Native plants, flowers and trees on every terrace extend the natural landscape and give residents private outdoor space.",
            "Cascading water walls, reflective pools and small streams wind through the terraces and common areas, creating a soothing ambiance.",
          ],
          es: [
            "Los edificios evocan cascadas: diseños fluidos y escalonados con fachadas de cristal, terrazas verdes y elementos de agua. Plantas, flores y árboles nativos en cada terraza prolongan el paisaje natural y ofrecen espacio exterior privado.",
            "Muros de agua, espejos reflectantes y pequeños arroyos recorren terrazas y áreas comunes, creando un ambiente sereno.",
          ],
        },
        image: dw.waterWall,
      },
      {
        title: { en: "Community highlights", es: "Lo mejor de la comunidad" },
        body: {
          en: [
            "A mix of residential towers, luxurious villas and retail spaces. The community hub includes a clubhouse and a hotel, with sports facilities, playgrounds and walking trails that meander through the lush landscape. A helipad ensures convenient accessibility.",
            "With a total floor area of nearly 2.4 million square feet, the development offers 1,518 apartments, 18 villas and 60 hotel suites, 120,000 square feet of amenities, 88,000 square feet of retail and 66,000 square feet of offices and medical clinics.",
          ],
          es: [
            "Una mezcla de torres residenciales, villas de lujo y espacios comerciales. El centro de la comunidad incluye un clubhouse y un hotel, con instalaciones deportivas, parques infantiles y senderos que serpentean por el paisaje. Un helipuerto garantiza una accesibilidad cómoda.",
            "Con un área de construcción de casi 2.4 millones de pies cuadrados, el desarrollo ofrece 1,518 apartamentos, 18 villas y 60 suites de hotel, 120,000 pies² de amenidades, 88,000 pies² comerciales y 66,000 pies² de oficinas y clínicas médicas.",
          ],
        },
        image: dw.masterplan,
      },
      {
        title: { en: "Lifestyle", es: "Estilo de vida" },
        body: {
          en: [
            "Open-concept layouts, expansive windows that flood the interiors with natural light and premium materials create an atmosphere of timeless beauty, from the spacious dining area to the private sanctuary of the master suite.",
          ],
          es: [
            "Distribuciones de concepto abierto, amplios ventanales que inundan los interiores de luz natural y materiales premium crean una atmósfera de belleza atemporal, desde el comedor espacioso hasta el santuario privado de la suite principal.",
          ],
        },
        image: dw.living,
      },
    ],
    hero: dw.avenue,
    gallery: [dw.avenue, dw.masterplan, dw.valley, dw.terraces, dw.lobby, dw.waterWall, dw.living, dw.dining, dw.lounge, dw.bar, dw.suite],
  },
];

export const galleryImages: GalleryImage[] = [
  { id: "tdm-aerial-coast", category: "exteriors", image: tdm.aerialCoast, caption: { en: "Tesoro Del Mar above the north coast", es: "Tesoro Del Mar sobre la costa norte" } },
  { id: "tdm-pool", category: "exteriors", image: tdm.exteriorPull, caption: { en: "Tesoro Del Mar from the pool", es: "Tesoro Del Mar desde la piscina" } },
  { id: "tdm-road", category: "exteriors", image: tdm.exteriorRoad, caption: { en: "The arrival", es: "La llegada" } },
  { id: "tdm-aerial-towers", category: "exteriors", image: tdm.aerialTowers, caption: { en: "The towers in the forest", es: "Las torres en el bosque" } },
  { id: "tdm-golf", category: "exteriors", image: tdm.exteriorGolf, caption: { en: "The landscaped green", es: "Las áreas verdes ajardinadas" } },
  { id: "tdm-aerial-villas", category: "exteriors", image: tdm.aerialVillas, caption: { en: "Towers and villas", es: "Torres y villas" } },
  { id: "tdm-aerial-forest", category: "exteriors", image: tdm.aerialForest, caption: { en: "Above the canopy", es: "Sobre el dosel" } },
  { id: "tdm-foyer-sign", category: "interiors", image: tdm.foyerSignage, caption: { en: "The Tesoro Del Mar foyer", es: "El vestíbulo de Tesoro Del Mar" } },
  { id: "tdm-foyer-atrium", category: "interiors", image: tdm.foyerAtrium, caption: { en: "Double-height lobby", es: "Vestíbulo de doble altura" } },
  { id: "tdm-foyer-lounge", category: "interiors", image: tdm.foyerLounge, caption: { en: "Lobby lounge", es: "Salón del vestíbulo" } },
  { id: "tdm-reception", category: "interiors", image: tdm.foyerReception, caption: { en: "Reception", es: "Recepción" } },
  { id: "tdm-apt-living", category: "interiors", image: tdm.aptLiving, caption: { en: "Apartment 1403, living and dining", es: "Apartamento 1403, sala y comedor" } },
  { id: "tdm-apt-living-2", category: "interiors", image: tdm.aptLiving2, caption: { en: "Apartment 1403, living room", es: "Apartamento 1403, sala" } },
  { id: "tdm-apt-bedroom", category: "interiors", image: tdm.aptBedroom, caption: { en: "Apartment 1403, primary bedroom", es: "Apartamento 1403, dormitorio principal" } },
  { id: "tdm-apt-bedroom-2", category: "interiors", image: tdm.aptBedroom2, caption: { en: "Apartment 1403, second bedroom", es: "Apartamento 1403, segundo dormitorio" } },
  { id: "tdm-apt-bath", category: "interiors", image: tdm.aptBath, caption: { en: "Apartment 1403, primary bathroom", es: "Apartamento 1403, baño principal" } },
  { id: "tdm-apt-bath-2", category: "interiors", image: tdm.aptBath2, caption: { en: "Apartment 1403, bath", es: "Apartamento 1403, bañera" } },
  { id: "tdm-apt-study", category: "interiors", image: tdm.aptStudy, caption: { en: "Apartment 1403, study", es: "Apartamento 1403, estudio" } },
  { id: "tdm-penthouse-dining", category: "interiors", image: tdm.penthouseDining, caption: { en: "Penthouse dining room", es: "Comedor del penthouse" } },
  { id: "tdm-penthouse-living", category: "interiors", image: tdm.penthouseLiving, caption: { en: "Penthouse living room", es: "Sala del penthouse" } },
  { id: "tdm-penthouse-piano", category: "interiors", image: tdm.penthousePiano, caption: { en: "Penthouse salon", es: "Salón del penthouse" } },
  { id: "tdm-hotel-suite", category: "interiors", image: tdm.hotelSuite, caption: { en: "Hotel suite 210", es: "Suite de hotel 210" } },
  { id: "pool-terrace", category: "amenities", image: life.poolTerrace, caption: { en: "Pool terrace", es: "Terraza de la piscina" } },
  { id: "balcony-detail", category: "exteriors", image: places.balconyDetail, caption: { en: "Curved balconies", es: "Balcones curvos" } },
  { id: "dw-avenue", category: "dorado-waterfalls", image: dw.avenue, caption: { en: "Dorado Waterfalls", es: "Dorado Waterfalls" } },
  { id: "dw-masterplan", category: "dorado-waterfalls", image: dw.masterplan, caption: { en: "Dorado Waterfalls master plan", es: "Plan maestro de Dorado Waterfalls" } },
  { id: "dw-valley", category: "dorado-waterfalls", image: dw.valley, caption: { en: "Along the valley", es: "A lo largo del valle" } },
  { id: "dw-terraces", category: "dorado-waterfalls", image: dw.terraces, caption: { en: "Green terraces", es: "Terrazas verdes" } },
  { id: "dw-water-wall", category: "dorado-waterfalls", image: dw.waterWall, caption: { en: "Water wall", es: "Muro de agua" } },
  { id: "dw-lobby", category: "dorado-waterfalls", image: dw.lobby, caption: { en: "Lobby", es: "Vestíbulo" } },
  { id: "dw-living", category: "dorado-waterfalls", image: dw.living, caption: { en: "Living room", es: "Sala" } },
  { id: "dw-dining", category: "dorado-waterfalls", image: dw.dining, caption: { en: "Dining room", es: "Comedor" } },
  { id: "dw-bar", category: "dorado-waterfalls", image: dw.bar, caption: { en: "Lounge bar", es: "Bar lounge" } },
  { id: "beach", category: "lifestyle", image: life.beach, caption: { en: "The north coast", es: "La costa norte" } },
  { id: "family-pool", category: "lifestyle", image: life.familyPool, caption: { en: "Family pool", es: "Piscina familiar" } },
  { id: "pets", category: "lifestyle", image: life.pets, caption: { en: "Happy homes for all", es: "Hogares felices para todos" } },
  { id: "spa", category: "amenities", image: life.spa, caption: { en: "Spa", es: "Spa" } },
  { id: "sailing", category: "lifestyle", image: life.sailing, caption: { en: "Sailing", es: "Navegación" } },
  { id: "surf", category: "lifestyle", image: life.surf, caption: { en: "Surf", es: "Surf" } },
  { id: "rainforest", category: "lifestyle", image: life.rainforest, caption: { en: "The rainforest", es: "El bosque" } },
];
