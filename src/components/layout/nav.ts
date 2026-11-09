/** Primary navigation. Keys map to messages.nav.* */
export const primaryNav = [
  { key: "residences", href: "/residences" },
  { key: "plans", href: "/residences/plans" },
  { key: "living", href: "/living" },
  { key: "place", href: "/place" },
  { key: "invest", href: "/invest" },
] as const;

export const footerGroups = [
  { key: "residences", links: [{ key: "residences", href: "/residences" }, { key: "plans", href: "/residences/plans" }, { key: "compare", href: "/residences/compare" }] },
  { key: "living", links: [{ key: "living", href: "/living" }] },
  { key: "place", links: [{ key: "place", href: "/place" }, { key: "gallery", href: "/place/gallery" }, { key: "tour", href: "/place/tour" }] },
  { key: "invest", links: [{ key: "invest", href: "/invest" }, { key: "brokers", href: "/brokers" }, { key: "faq", href: "/faq" }] },
  { key: "company", links: [{ key: "hotel", href: "/hotel-development" }, { key: "careers", href: "/careers" }, { key: "visit", href: "/visit" }] },
] as const;
