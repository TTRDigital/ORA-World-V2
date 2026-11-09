import type { GenericPage, TeamMember, PressArticle } from "../types";
import { tdm, life } from "./images";

export const pages: GenericPage[] = [
  {
    slug: "hotel-development",
    title: { en: "Hotel development", es: "Desarrollo hotelero" },
    intro: { en: "Boutique hospitality at the heart of every ORA World community.", es: "Hospitalidad boutique en el corazón de cada comunidad ORA World." },
    hero: tdm.foyerAtrium,
    seoDescription: { en: "Hotel development with ORA World in Puerto Rico.", es: "Desarrollo hotelero con ORA World en Puerto Rico." },
    sections: [
      {
        title: { en: "Hospitality at the hub", es: "Hospitalidad en el centro" },
        body: {
          en: ["Tesoro Del Mar's community hub includes a state-of-the-art clubhouse and a boutique hotel with 42 suites, ensuring exceptional hospitality and recreational facilities.", "Hotel operator, brand partnership and investment structure: to be confirmed by ORA World."],
          es: ["El centro de Tesoro Del Mar incluye un clubhouse de última generación y un hotel boutique con 42 suites, garantizando hospitalidad y espacios recreativos excepcionales.", "Operador hotelero, alianza de marca y estructura de inversión: por confirmar por ORA World."],
        },
        image: tdm.hotelSuite,
      },
    ],
  },
  {
    slug: "careers",
    title: { en: "Careers", es: "Carreras" },
    intro: { en: "Help shape Puerto Rico's most resilient, nature-led communities.", es: "Ayude a dar forma a las comunidades más resilientes y naturales de Puerto Rico." },
    hero: life.adventure,
    seoDescription: { en: "Careers at ORA World.", es: "Carreras en ORA World." },
    sections: [
      {
        title: { en: "Open positions", es: "Posiciones abiertas" },
        body: {
          en: ["No open positions have been published yet. Send your résumé through the contact form and we will keep it on file."],
          es: ["Aún no se han publicado posiciones abiertas. Envíe su currículum a través del formulario de contacto y lo mantendremos en archivo."],
        },
      },
    ],
  },
  {
    slug: "privacy",
    title: { en: "Privacy policy", es: "Política de privacidad" },
    intro: { en: "How ORA World collects, uses and protects your information.", es: "Cómo ORA World recopila, usa y protege su información." },
    seoDescription: { en: "ORA World privacy policy.", es: "Política de privacidad de ORA World." },
    sections: [
      { title: { en: "Information we collect", es: "Información que recopilamos" }, body: { en: ["When you submit an inquiry, register to view floor plans or book a visit, we collect the details you provide (name, email, phone, whether you are a buyer or broker, and your message) together with the page you were on and the campaign that brought you to the site.", "With your consent, we use analytics cookies to understand how the site is used. Essential cookies that remember your language and registration are always on."], es: ["Cuando envía una consulta, se registra para ver planos o reserva una visita, recopilamos los datos que proporciona (nombre, correo, teléfono, si es comprador o corredor y su mensaje) junto con la página en la que estaba y la campaña que le trajo al sitio.", "Con su consentimiento, usamos cookies analíticas para entender cómo se usa el sitio. Las cookies esenciales que recuerdan su idioma y registro siempre están activas."] } },
      { title: { en: "How we use it", es: "Cómo la usamos" }, body: { en: ["To respond to your inquiry, arrange visits and send the updates you asked for. Your details are shared with ORA World's sales team and its CRM provider, and never sold.", "Full policy to be reviewed by ORA World counsel before launch."], es: ["Para responder a su consulta, organizar visitas y enviarle las novedades que solicitó. Sus datos se comparten con el equipo de ventas de ORA World y su proveedor de CRM, y nunca se venden.", "Política completa por revisar por los abogados de ORA World antes del lanzamiento."] } },
      { title: { en: "Your rights", es: "Sus derechos" }, body: { en: ["You may ask us to access, correct or delete your information, or to stop contacting you, at any time through the contact page or by replying STOP to any text message."], es: ["Puede solicitar acceso, corrección o eliminación de su información, o pedir que dejemos de contactarle, en cualquier momento a través de la página de contacto o respondiendo STOP a cualquier mensaje de texto."] } },
    ],
  },
  {
    slug: "terms",
    title: { en: "Terms of use", es: "Términos de uso" },
    intro: { en: "Terms governing the use of this website.", es: "Términos que rigen el uso de este sitio web." },
    seoDescription: { en: "ORA World terms of use.", es: "Términos de uso de ORA World." },
    sections: [
      { title: { en: "Not an offering", es: "No es una oferta" }, body: { en: ["This website is an advertisement and a solicitation of interest only. No offering of the advertised units can be made and no deposits can be accepted, or reservations, binding or non-binding, can be made until an offering plan is filed with the New York State Department of Law. All images are artist's conceptual renderings. Plans, dimensions, views, finishes, pricing and availability are preliminary and subject to change without notice."], es: ["Este sitio web es un anuncio y una solicitud de interés únicamente. No se puede realizar ninguna oferta de las unidades anunciadas ni aceptar depósitos o reservas, vinculantes o no, hasta que se presente un plan de oferta ante el Departamento de Justicia del Estado de Nueva York. Todas las imágenes son representaciones conceptuales del artista. Los planos, dimensiones, vistas, acabados, precios y disponibilidad son preliminares y están sujetos a cambios sin previo aviso."] } },
      { title: { en: "Use of content", es: "Uso del contenido" }, body: { en: ["All content is the property of ORA World and its licensors and may not be reproduced without permission. Full terms to be reviewed by counsel."], es: ["Todo el contenido es propiedad de ORA World y sus licenciantes y no puede reproducirse sin permiso. Términos completos por revisar por los abogados."] } },
    ],
  },
  {
    slug: "accessibility",
    title: { en: "Accessibility statement", es: "Declaración de accesibilidad" },
    intro: { en: "ORA World is committed to a website that everyone can use.", es: "ORA World se compromete a ofrecer un sitio web que todos puedan usar." },
    seoDescription: { en: "ORA World accessibility statement.", es: "Declaración de accesibilidad de ORA World." },
    sections: [
      { title: { en: "Our standard", es: "Nuestro estándar" }, body: { en: ["This site is built to conform to the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA: semantic structure, full keyboard navigation (every tab set, hotspot, dial, carousel, accordion, menu, lightbox and map), visible focus states, descriptive alternative text, sufficient color contrast, politely announced progress states and respect for reduced-motion preferences."], es: ["Este sitio está construido para cumplir las Pautas de Accesibilidad para el Contenido Web (WCAG) 2.2 en el nivel AA: estructura semántica, navegación completa por teclado (cada conjunto de pestañas, punto interactivo, dial, carrusel, acordeón, menú, galería y mapa), estados de foco visibles, textos alternativos descriptivos, contraste suficiente, estados de progreso anunciados y respeto por la preferencia de movimiento reducido."] } },
      { title: { en: "Feedback", es: "Comentarios" }, body: { en: ["If you encounter a barrier, please tell us through the booking page's contact form. We aim to respond within five business days."], es: ["Si encuentra una barrera, indíquenoslo a través del formulario de contacto de la página de reservas. Procuramos responder en un plazo de cinco días hábiles."] } },
    ],
  },
  {
    slug: "legal-disclaimer",
    title: { en: "Legal disclaimer", es: "Aviso legal" },
    intro: { en: "Required notices for this advertisement.", es: "Avisos requeridos para este anuncio." },
    seoDescription: { en: "ORA World legal disclaimer.", es: "Aviso legal de ORA World." },
    sections: [
      { title: { en: "Offering plan", es: "Plan de oferta" }, body: { en: ["This advertisement is not an offering. It is a solicitation of interest in the advertised property. No offering of the advertised units can be made and no deposits can be accepted, or reservations, binding or non - binding, can be made until an offering plan is filed with the New York State Department of Law. This advertisement is made pursuant to Cooperative Policy Statement No. 1, issued by the New York State Department of Law. Attorney General File No.: CP25-0047. Sponsor: TRPbuildco LLC Sponsor's Address: Tesoro Del Mar Dorado, Vega Alta, Puerto Rico 00692", "All images on this website are artist renderings."], es: ["This advertisement is not an offering. It is a solicitation of interest in the advertised property. No offering of the advertised units can be made and no deposits can be accepted, or reservations, binding or non - binding, can be made until an offering plan is filed with the New York State Department of Law. This advertisement is made pursuant to Cooperative Policy Statement No. 1, issued by the New York State Department of Law. Attorney General File No.: CP25-0047. Sponsor: TRPbuildco LLC Sponsor's Address: Tesoro Del Mar Dorado, Vega Alta, Puerto Rico 00692", "Todas las imágenes de este sitio web son representaciones artísticas."] } },
      { title: { en: "Equal Housing Opportunity", es: "Igualdad de oportunidades de vivienda" }, body: { en: ["ORA World supports the Fair Housing Act and the Equal Housing Opportunity principles."], es: ["ORA World apoya la Ley de Vivienda Justa y los principios de igualdad de oportunidades de vivienda."] } },
    ],
  },
  {
    slug: "brokers",
    title: { en: "Brokers", es: "Corredores" },
    intro: { en: "Register your clients and receive pricing and floor plans as soon as they are released.", es: "Registre a sus clientes y reciba precios y planos en cuanto se publiquen." },
    hero: tdm.foyerReception,
    seoDescription: { en: "Broker registration for ORA World, Puerto Rico.", es: "Registro de corredores para ORA World, Puerto Rico." },
    sections: [
      { title: { en: "How it works", es: "Cómo funciona" }, body: { en: ["Complete the registration with your licence number and your client's details. The sales team confirms the registration by email. Co-op terms, the broker kit and the commission schedule will be published once the offering plan is filed: to be confirmed."], es: ["Complete el registro con su número de licencia y los datos de su cliente. El equipo de ventas confirma el registro por correo. Los términos de cooperación, el kit para corredores y el esquema de comisiones se publicarán una vez presentado el plan de oferta: por confirmar."] } },
    ],
  },
];

/** Only the sponsor is public. Design partners are unnamed, so they are not shown anywhere (no silhouettes). */
export const team: TeamMember[] = [
  {
    slug: "ora-world",
    name: "ORA World · TRPbuildco LLC",
    role: { en: "Developer and sponsor", es: "Desarrollador y patrocinador" },
    bio: {
      en: ["Our mission is to revolutionize Puerto Rico's real estate landscape by creating luxurious, eco-friendly developments that seamlessly blend modern elegance with the island's natural beauty. We are committed to delivering exceptional quality, innovative design and unparalleled comfort in every project."],
      es: ["Nuestra misión es revolucionar el panorama inmobiliario de Puerto Rico creando desarrollos de lujo y ecológicos que integran la elegancia moderna con la belleza natural de la isla. Nos comprometemos a ofrecer calidad excepcional, diseño innovador y un confort sin igual en cada proyecto."],
    },
    portrait: tdm.foyerSignage,
    website: "https://www.oraworld.com",
  },
];

/** No press coverage is public yet. The press section stays hidden from navigation until a real article exists. */
export const press: PressArticle[] = [];
