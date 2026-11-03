import type { SiteSettings } from "../types";
import { tdm } from "./images";

/** Verbatim from oraworld.com, kept in English on both languages until counsel confirms a Spanish rendering. */
export const LEGAL_NOTICE =
  "This advertisement is not an offering. It is a solicitation of interest in the advertised property. No offering of the advertised units can be made and no deposits can be accepted, or reservations, binding or non - binding, can be made until an offering plan is filed with the New York State Department of Law. This advertisement is made pursuant to Cooperative Policy Statement No. 1, issued by the New York State Department of Law. Attorney General File No.: CP25-0047. Sponsor: TRPbuildco LLC Sponsor's Address: Tesoro Del Mar Dorado, Vega Alta, Puerto Rico 00692";

export const siteSettings: SiteSettings = {
  // Not published anywhere public. Read from env on the server when provided; the UI hides empty channels.
  phone: process.env.NEXT_PUBLIC_ORA2_PHONE || null,
  whatsapp: process.env.NEXT_PUBLIC_ORA2_WHATSAPP || null,
  email: process.env.NEXT_PUBLIC_ORA2_EMAIL || null,
  salesGalleryName: { en: "ORA World sales gallery", es: "Galería de ventas ORA World" },
  salesGalleryAddress: null, // To be confirmed: the sponsor address is Tesoro Del Mar, Dorado, Vega Alta, PR 00692
  hours: null,
  social: [],
  legalNotice: LEGAL_NOTICE,
  renderingNotice: {
    en: "All images on this page are artist renderings.",
    es: "Todas las imágenes de esta página son representaciones artísticas.",
  },
  sponsor: { en: "Sponsor: TRPbuildco LLC", es: "Patrocinador: TRPbuildco LLC" },
  bookingUrl: process.env.NEXT_PUBLIC_ORA2_BOOKING_URL || null,
  vrTourUrl: "https://kuula.co/share/collection/7Zt7D?logo=1&info=0&fs=1&vr=1&thumbs=2&margin=10&alpha=0.60",
  filmYoutubeId: "HkIPZ9pGezA",
  filmMp4: null,
  filmWebm: null,
  filmPoster: tdm.exteriorPull,
  brochureUrl: null,
  brokerKitUrl: null,
  consentText: {
    en: "By submitting this form you agree that ORA World and its sales representatives may contact you by phone, email and text message (including by automated means) about your inquiry. Consent is not a condition of purchase. Message and data rates may apply. Reply STOP to opt out at any time.",
    es: "Al enviar este formulario acepta que ORA World y sus representantes de ventas puedan contactarle por teléfono, correo electrónico y mensaje de texto (incluso por medios automatizados) sobre su consulta. El consentimiento no es condición de compra. Pueden aplicar tarifas de mensajes y datos. Responda STOP para cancelar en cualquier momento.",
  },
  siteLat: Number(process.env.NEXT_PUBLIC_ORA2_SITE_LAT || 18.4542),
  siteLng: Number(process.env.NEXT_PUBLIC_ORA2_SITE_LNG || -66.3178),
};
