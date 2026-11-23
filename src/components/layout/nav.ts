/** Primary navigation. Keys map to messages.nav.* */
export const primaryNav = [
  { key: "residences", href: "/residences" },
  { key: "plans", href: "/residences/plans" },
  // Client, 18 Nov: a page all about the finishes.
  { key: "finishes", href: "/finishes" },
  { key: "longevity", href: "/longevity" },
  // Client, 18 Nov: a page all about Act 60.
  { key: "act60", href: "/act-60" },
  { key: "living", href: "/living" },
] as const;

export const footerGroups = [
  { key: "residences", links: [{ key: "residences", href: "/residences" }, { key: "plans", href: "/residences/plans" }, { key: "finishes", href: "/finishes" }, { key: "compare", href: "/residences/compare" }] },
  { key: "living", links: [{ key: "longevity", href: "/longevity" }, { key: "act60", href: "/act-60" }, { key: "living", href: "/living" }] },
  { key: "place", links: [{ key: "living", href: "/living" }, { key: "tour", href: "/place/tour" }] },
  { key: "company", links: [{ key: "hotel", href: "/hotel-development" }, { key: "careers", href: "/careers" }, { key: "visit", href: "/#inquire" }, { key: "brokers", href: "/brokers" }, { key: "faq", href: "/faq" }] },
] as const;
