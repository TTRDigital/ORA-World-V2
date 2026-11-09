/**
 * Content model shared by the Sanity schemas, the typed local seed and the data layer.
 * Every user-visible string is localized ({ en, es }) and both languages are required.
 * Numbers the client has not published are null and render as "To be confirmed".
 */
export type Locale = "en" | "es";
export type L = { en: string; es: string };
export type LP = { en: string[]; es: string[] };

export interface ImageRef {
  src: string;
  alt: L;
  width: number;
  height: number;
  /** CSS object-position focal point. Required: tower exteriors "50% 10–20%", aerials "50% 40%", interiors "50% 50%". */
  focal: string;
  caption?: L;
  /** Artist's conceptual rendering label. */
  rendering?: boolean;
  /** Clearly marked placeholder, listed in CONTENT-TODO.md. A module whose content is still a placeholder stays hidden. */
  placeholder?: boolean;
  credit?: string;
}

export interface SiteSettings {
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  salesGalleryName: L;
  salesGalleryAddress: L | null;
  hours: L | null;
  social: { label: string; href: string }[];
  legalNotice: string;
  renderingNotice: L;
  sponsor: L;
  bookingUrl: string | null;
  vrTourUrl: string;
  filmYoutubeId: string | null;
  /** Short ORA World film the sales team sends to prospects. */
  introFilmYoutubeId: string | null;
  /** Self-hosted loop that replaces YouTube when set. */
  filmMp4: string | null;
  filmWebm: string | null;
  filmPoster: ImageRef;
  brochureUrl: string | null;
  /** Phase 1 floor plans PDF (subject to change), as sent to prospects by the sales team. */
  floorPlansUrl: string | null;
  brokerKitUrl: string | null;
  consentText: L;
  siteLat: number;
  siteLng: number;
}

export interface Stat {
  value: number | null;
  prefix?: string;
  suffix?: string;
  label: L;
  /** Formatted display when the raw value should not be counted (e.g. "Cat. 5"). */
  display?: string;
}

export interface Collection {
  slug: string;
  name: L;
  tagline: L;
  description: LP;
  bedrooms: string | null;
  sizeRange: string | null;
  fromPrice: number | null;
  image: ImageRef;
  gallery: ImageRef[];
  features: L[];
  finishes: { group: L; items: L[] }[];
  specs: { label: L; value: L | null }[];
  /** Illustrative floor bands on the tower stack (top → bottom), until the client confirms the mapping. */
  bands: number[];
  views: ("ocean" | "garden" | "mountain")[];
  bedroomOptions: number[];
}

export type Orientation = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW";
export type PlanStatus = "available" | "reserved" | "sold" | "inquire";

export interface FloorPlan {
  slug: string;
  name: L;
  collection: string;
  bedrooms: number;
  bathrooms: number;
  /** Half baths, printed as "POWDER" on the Phase 1 plans. */
  powder?: number;
  interiorSqFt: number | null;
  exteriorSqFt: number | null;
  orientation: Orientation | null;
  view: L | null;
  building: string;
  floors: string | null;
  status: PlanStatus;
  fromPrice: number | null;
  image: ImageRef;
  keyplan: ImageRef | null;
  keyplanPosition: { x: number; y: number; w: number; h: number } | null;
  pdf: string | null;
  highlights: L[];
  placeholder?: boolean;
  /** Unit numbers sharing this layout, as printed on the Phase 1 plans. */
  units?: string[];
}

export type AmenityCategory = "wellness" | "family" | "pets" | "resort" | "eco";

export interface Amenity {
  slug: string;
  name: L;
  description: L;
  category: AmenityCategory;
  image: ImageRef;
  featured?: boolean;
  /** Bento tile size hint. */
  size?: "lg" | "md" | "sm";
}

export interface Activity {
  slug: string;
  group: L;
  items: { name: L; description: L }[];
  image: ImageRef;
}

export type GalleryCategory = "exteriors" | "interiors" | "amenities" | "lifestyle" | "dorado-waterfalls";

export interface GalleryImage {
  id: string;
  image: ImageRef;
  category: GalleryCategory;
  caption: L;
}

export interface TeamMember {
  slug: string;
  name: string;
  role: L;
  bio: LP;
  portrait: ImageRef | null;
  website: string | null;
  placeholder?: boolean;
}

export type PoiCategory = "beach" | "golf" | "school" | "healthcare" | "airport" | "dining" | "culture" | "nature";

export interface PointOfInterest {
  slug: string;
  name: L;
  category: PoiCategory;
  lat: number;
  lng: number;
  driveMinutes: number | null;
  walkMinutes: number | null;
  /** Only "30 minutes to the airport" and "walking distance to Cerro Gordo" are published; all else is approximate. */
  confirmed: boolean;
  note: L | null;
}

export interface IslandPlace {
  slug: string;
  name: L;
  text: L;
  image: ImageRef;
  poi: string | null;
}

export interface Faq {
  slug: string;
  topic: string;
  question: L;
  answer: LP;
}

export interface PressArticle {
  slug: string;
  title: L;
  outlet: string;
  date: string;
  excerpt: L;
  body: LP;
  url: string | null;
  image: ImageRef | null;
  placeholder?: boolean;
}

export interface InvestmentStep {
  order: number;
  title: L;
  detail: L;
  percent: number | null;
  when: L;
  placeholder?: boolean;
}

export interface Incentive {
  slug: string;
  title: L;
  summary: L;
  body: LP;
  /** Which quiz answers surface this section. */
  tags: ("relocating" | "business" | "residence" | "general")[];
}

export interface ResilienceFeature {
  slug: string;
  title: L;
  short: L;
  points: L[];
}

export interface Project {
  slug: string;
  name: L;
  tagline: L;
  location: L;
  summary: LP;
  facts: { label: L; value: L | null; confirmed: boolean }[];
  sections: { title: L; body: LP; image?: ImageRef }[];
  hero: ImageRef;
  gallery: ImageRef[];
  flagship?: boolean;
  lat: number | null;
  lng: number | null;
}

export interface PortfolioLocation {
  slug: string;
  name: string;
  tagline: L;
  image: ImageRef | null;
  href: string | null;
  /** Municipality pin on the stylised island, only when the municipality is in the published name or tagline. */
  pin: { x: number; y: number; municipality: string } | null;
  revealed: boolean;
}

export interface GenericPage {
  slug: string;
  title: L;
  intro: L;
  hero?: ImageRef;
  sections: { title: L; body: LP; image?: ImageRef }[];
  seoDescription: L;
}

export interface Redirect {
  from: string;
  to: string;
  permanent: boolean;
}

/** Homepage: one object per module, in page order. `enabled` lets editors hide a module. */
export interface HomeContent {
  hero: {
    enabled: boolean;
    headline: L; // wrap one word in *asterisks* for the italic accent
    line: L;
    ctaPrimary: L;
    ctaFilm: L;
    statsLabel: L;
    stats: Stat[];
    thumbnails: { label: L; image: ImageRef }[];
  };
  numbers: { enabled: boolean; label: L; headline: L; aerial: ImageRef; beach: ImageRef; stats: Stat[] };
  explorer: { enabled: boolean; label: L; headline: L; intro: L; note: L };
  rooms: {
    enabled: boolean;
    label: L;
    headline: L;
    rooms: {
      slug: string;
      name: L;
      image: ImageRef;
      hotspots: { x: number; y: number; title: L; text: L }[];
    }[];
  };
  resilience: { enabled: boolean; label: L; headline: L; intro: L; features: ResilienceFeature[]; image: ImageRef };
  living: { enabled: boolean; label: L; headline: L; intro: L; familyItems: L[]; petItems: L[] };
  island: { enabled: boolean; label: L; headline: L; intro: L; places: IslandPlace[] };
  compare: { enabled: boolean; label: L; headline: L; intro: L };
  invest: { enabled: boolean; label: L; headline: L; intro: L; disclaimer: L };
  portfolio: { enabled: boolean; label: L; headline: L; intro: L };
  faq: { enabled: boolean; label: L; headline: L; slugs: string[] };
  visit: { enabled: boolean; label: L; headline: L; text: L; image: ImageRef };
}
