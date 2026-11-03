import { defineField, defineType } from "sanity";

const L = (name: string, title: string, required = true) =>
  defineField({ name, title, type: "localeString", validation: required ? (r) => r.required() : undefined });
const T = (name: string, title: string) => defineField({ name, title, type: "localeText", validation: (r) => r.required() });
const img = (name: string, title: string) => defineField({ name, title, type: "figure" });
const enabled = defineField({ name: "enabled", title: "Show module", type: "boolean", initialValue: true });

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({ name: "phone", title: "Phone (hidden until set)", type: "string" }),
    defineField({ name: "whatsapp", title: "WhatsApp number (hidden until set)", type: "string" }),
    defineField({ name: "email", title: "Email (hidden until set)", type: "string" }),
    L("salesGalleryName", "Sales gallery name"),
    L("salesGalleryAddress", "Sales gallery address", false),
    L("hours", "Opening hours", false),
    defineField({ name: "social", title: "Social links", type: "array", of: [{ type: "object", fields: [{ name: "label", type: "string" }, { name: "href", type: "url" }] }] }),
    defineField({ name: "legalNotice", title: "Legal notice (verbatim, English)", type: "text", rows: 6, validation: (r) => r.required() }),
    L("renderingNotice", "Rendering notice"),
    L("sponsor", "Sponsor line"),
    defineField({ name: "bookingUrl", title: "Calendly / Cal.com URL", type: "url" }),
    defineField({ name: "vrTourUrl", title: "Kuula VR tour URL", type: "url", validation: (r) => r.required() }),
    defineField({ name: "filmYoutubeId", title: "Hero film YouTube id", type: "string" }),
    defineField({ name: "filmMp4", title: "Self-hosted loop (MP4)", type: "file" }),
    defineField({ name: "filmWebm", title: "Self-hosted loop (WebM)", type: "file" }),
    img("filmPoster", "Film poster render"),
    defineField({ name: "brochureUrl", title: "Brochure PDF", type: "file" }),
    defineField({ name: "brokerKitUrl", title: "Broker kit PDF", type: "file" }),
    T("consentText", "Form consent text"),
    defineField({ name: "siteLat", title: "Site latitude", type: "number" }),
    defineField({ name: "siteLng", title: "Site longitude", type: "number" }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});

export const homePage = defineType({
  name: "homePage",
  title: "Homepage",
  type: "document",
  groups: [
    { name: "hero", title: "1 Hero" },
    { name: "numbers", title: "2 Numbers" },
    { name: "explorer", title: "3 Explorer" },
    { name: "rooms", title: "4 Rooms" },
    { name: "resilience", title: "5 Resilience" },
    { name: "living", title: "6 Living" },
    { name: "island", title: "7 Island" },
    { name: "compare", title: "8 Compare" },
    { name: "invest", title: "9 Invest" },
    { name: "portfolio", title: "10 Portfolio" },
    { name: "faq", title: "11 FAQ" },
    { name: "visit", title: "12 Visit" },
  ],
  fields: [
    defineField({
      name: "hero",
      title: "Hero: split stage",
      type: "object",
      group: "hero",
      fields: [
        enabled,
        L("headline", "Headline (wrap one word in *asterisks* for the italic accent)"),
        T("line", "One factual line"),
        L("ctaPrimary", "Primary button"),
        L("ctaFilm", "Film button"),
        L("statsLabel", "Stats label"),
        defineField({ name: "stats", title: "Four stat chips", type: "array", of: [{ type: "stat" }], validation: (r) => r.max(4) }),
        defineField({ name: "thumbnails", title: "Four render thumbnails", type: "array", of: [{ type: "object", fields: [L("label", "Label"), img("image", "Render")] }], validation: (r) => r.max(4) }),
      ],
    }),
    defineField({ name: "numbers", title: "Tesoro Del Mar in numbers: bento", type: "object", group: "numbers", fields: [enabled, L("label", "Label"), L("headline", "Headline"), img("aerial", "Aerial render"), img("beach", "Beach photo"), defineField({ name: "stats", title: "Counters", type: "array", of: [{ type: "stat" }] })] }),
    defineField({ name: "explorer", title: "Residence explorer", type: "object", group: "explorer", fields: [enabled, L("label", "Label"), L("headline", "Headline"), T("intro", "Intro"), T("note", "Illustrative mapping note")] }),
    defineField({ name: "rooms", title: "Room by room: hotspot tour", type: "object", group: "rooms", fields: [enabled, L("label", "Label"), L("headline", "Headline"), defineField({ name: "rooms", title: "Rooms", type: "array", of: [{ type: "room" }] })] }),
    defineField({ name: "resilience", title: "Built to endure: dial", type: "object", group: "resilience", fields: [enabled, L("label", "Label"), L("headline", "Headline"), T("intro", "Intro"), img("image", "Render"), defineField({ name: "features", title: "Nine features", type: "array", of: [{ type: "object", fields: [{ name: "slug", type: "string" }, L("title", "Title"), L("short", "Dial label"), { name: "points", type: "array", of: [{ type: "localeString" }] }] }], validation: (r) => r.max(9) })] }),
    defineField({ name: "living", title: "Living: filterable bento", type: "object", group: "living", fields: [enabled, L("label", "Label"), L("headline", "Headline"), T("intro", "Intro"), { name: "familyItems", title: "Family amenities", type: "array", of: [{ type: "localeString" }] }, { name: "petItems", title: "Pet amenities", type: "array", of: [{ type: "localeString" }] }] }),
    defineField({ name: "island", title: "The island: drag rail", type: "object", group: "island", fields: [enabled, L("label", "Label"), L("headline", "Headline"), T("intro", "Intro"), { name: "places", title: "Places", type: "array", of: [{ type: "islandPlace" }] }] }),
    defineField({ name: "compare", title: "Two projects: comparison table", type: "object", group: "compare", fields: [enabled, L("label", "Label"), L("headline", "Headline"), T("intro", "Intro")] }),
    defineField({ name: "invest", title: "Invest with clarity", type: "object", group: "invest", fields: [enabled, L("label", "Label"), L("headline", "Headline"), T("intro", "Intro"), T("disclaimer", "Tax disclaimer")] }),
    defineField({ name: "portfolio", title: "Portfolio: map and cards", type: "object", group: "portfolio", fields: [enabled, L("label", "Label"), L("headline", "Headline"), T("intro", "Intro")] }),
    defineField({ name: "faq", title: "FAQ", type: "object", group: "faq", fields: [enabled, L("label", "Label"), L("headline", "Headline"), { name: "slugs", title: "Eight question slugs", type: "array", of: [{ type: "string" }], validation: (r) => r.max(8) }] }),
    defineField({ name: "visit", title: "Book a visit CTA", type: "object", group: "visit", fields: [enabled, L("label", "Label"), L("headline", "Headline"), T("text", "Text"), img("image", "Golf exterior render")] }),
  ],
  preview: { prepare: () => ({ title: "Homepage" }) },
});
