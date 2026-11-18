/** Primary navigation. Keys map to messages.nav.* */
export const primaryNav = [
  { key: "residences", href: "/residences" },
  { key: "plans", href: "/residences/plans" },
  { key: "longevity", href: "/longevity" },
  // Client, 18 Nov: a page all about Act 60.
  { key: "act60", href: "/act-60" },
  { key: "living", href: "/living" },
  { key: "place", href: "/place" },
  // Client, 17 Nov: the gallery in the top navigation.
  { key: "gallery", href: "/gallery" },
] as const;

export const footerGroups = [
  { key: "residences", links: [{ key: "residences", href: "/residences" }, { key: "plans", href: "/residences/plans" }, { key: "compare", href: "/residences/compare" }] },
  { key: "living", links: [{ key: "longevity", href: "/longevity" }, { key: "act60", href: "/act-60" }, { key: "living", href: "/living" }] },
  { key: "place", links: [{ key: "place", href: "/place" }, { key: "gallery", href: "/gallery" }, { key: "tour", href: "/place/tour" }] },
  { key: "company", links: [{ key: "hotel", href: "/hotel-development" }, { key: "careers", href: "/careers" }, { key: "visit", href: "/visit" }, { key: "brokers", href: "/brokers" }, { key: "faq", href: "/faq" }] },
] as const;
