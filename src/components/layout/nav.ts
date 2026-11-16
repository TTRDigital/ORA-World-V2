/** Primary navigation. Keys map to messages.nav.* */
export const primaryNav = [
  { key: "residences", href: "/residences" },
  { key: "plans", href: "/residences/plans" },
  { key: "longevity", href: "/longevity" },
  { key: "living", href: "/living" },
  { key: "place", href: "/place" },
] as const;

export const footerGroups = [
  { key: "residences", links: [{ key: "residences", href: "/residences" }, { key: "plans", href: "/residences/plans" }, { key: "compare", href: "/residences/compare" }] },
  { key: "living", links: [{ key: "longevity", href: "/longevity" }, { key: "living", href: "/living" }] },
  { key: "place", links: [{ key: "place", href: "/place" }, { key: "gallery", href: "/place/gallery" }, { key: "tour", href: "/place/tour" }] },
  { key: "company", links: [{ key: "hotel", href: "/hotel-development" }, { key: "careers", href: "/careers" }, { key: "visit", href: "/visit" }, { key: "brokers", href: "/brokers" }, { key: "faq", href: "/faq" }] },
] as const;
