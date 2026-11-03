import { groq } from "next-sanity";

/** Figures are expanded with asset metadata so the data layer can build ImageRefs with real dimensions. */
const fig = `{ ..., asset->{ _id, url, metadata { dimensions } } }`;
const figs = (name: string) => `${name}[]${fig}`;

export const siteSettingsQ = groq`*[_type == "siteSettings"][0]{ ..., filmPoster ${fig}, "filmMp4": filmMp4.asset->url, "filmWebm": filmWebm.asset->url, "brochureUrl": brochureUrl.asset->url, "brokerKitUrl": brokerKitUrl.asset->url }`;

export const homePageQ = groq`*[_type == "homePage"][0]{
  ...,
  hero { ..., thumbnails[]{ ..., image ${fig} } },
  numbers { ..., aerial ${fig}, beach ${fig} },
  rooms { ..., rooms[]{ ..., image ${fig} } },
  resilience { ..., image ${fig} },
  island { ..., places[]{ ..., image ${fig} } },
  visit { ..., image ${fig} }
}`;

export const projectsQ = groq`*[_type == "project"] | order(flagship desc, name.en asc){ ..., "slug": slug.current, hero ${fig}, ${figs("gallery")}, sections[]{ ..., image ${fig} } }`;
export const collectionsQ = groq`*[_type == "collection"] | order(_createdAt asc){ ..., "slug": slug.current, image ${fig}, ${figs("gallery")} }`;
export const floorPlansQ = groq`*[_type == "floorPlan"] | order(name.en asc){ ..., "slug": slug.current, image ${fig}, keyplan ${fig}, "pdf": pdf.asset->url }`;
export const amenitiesQ = groq`*[_type == "amenity"] | order(_createdAt asc){ ..., "slug": slug.current, image ${fig} }`;
export const activitiesQ = groq`*[_type == "activity"] | order(_createdAt asc){ ..., "slug": slug.current, image ${fig} }`;
export const galleryQ = groq`*[_type == "galleryImage"] | order(_createdAt asc){ ..., "id": _id, image ${fig} }`;
export const teamQ = groq`*[_type == "teamMember" && placeholder != true]{ ..., "slug": slug.current, portrait ${fig} }`;
export const poisQ = groq`*[_type == "pointOfInterest"]{ ..., "slug": slug.current }`;
export const faqsQ = groq`*[_type == "faq"] | order(_createdAt asc){ ..., "slug": slug.current }`;
export const pressQ = groq`*[_type == "pressArticle" && placeholder != true] | order(date desc){ ..., "slug": slug.current, image ${fig} }`;
export const stepsQ = groq`*[_type == "investmentStep"] | order(order asc)`;
export const incentivesQ = groq`*[_type == "incentive"] | order(_createdAt asc){ ..., "slug": slug.current }`;
export const portfolioQ = groq`*[_type == "portfolioLocation"] | order(order asc){ ..., "slug": slug.current, image ${fig} }`;
export const pagesQ = groq`*[_type == "page"]{ ..., "slug": slug.current, hero ${fig}, sections[]{ ..., image ${fig} } }`;
export const redirectsQ = groq`*[_type == "redirect"]{ from, to, permanent }`;
