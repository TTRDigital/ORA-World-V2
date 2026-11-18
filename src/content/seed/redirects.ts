import type { Redirect } from "../types";

/** Old oraworld.com paths and v1 paths → v2 URLs (locale-agnostic; the proxy keeps the active locale). */
export const redirects: Redirect[] = [
  { from: "/our-residences", to: "/residences", permanent: true },
  { from: "/our-amenities", to: "/living", permanent: true },
  { from: "/amenities", to: "/living", permanent: true },
  { from: "/activities", to: "/living", permanent: true },
  { from: "/lifestyle", to: "/living", permanent: true },
  { from: "/tesoro-del-mar", to: "/place/tesoro-del-mar", permanent: true },
  { from: "/projects/dorado-waterfalls", to: "/place/dorado-waterfalls", permanent: true },
  { from: "/dorado-waterfalls", to: "/place/dorado-waterfalls", permanent: true },
  // The Invest page was removed (client, 15 Nov): its old addresses open the FAQ (its Act 60 answers).
  { from: "/invest", to: "/faq", permanent: false },
  { from: "/tax-incentive", to: "/act-60", permanent: true },
  { from: "/incentives", to: "/act-60", permanent: true },
  { from: "/investment", to: "/act-60", permanent: true },
  { from: "/resilience", to: "/faq", permanent: true },
  { from: "/contact-us", to: "/visit", permanent: true },
  { from: "/contact", to: "/visit", permanent: true },
  { from: "/location", to: "/place", permanent: true },
  // Client, 17 Nov: the gallery is a top-level page now.
  { from: "/place/gallery", to: "/", permanent: true },
  // Client, 18 Nov: the gallery page removed.
  { from: "/gallery", to: "/", permanent: true },
  { from: "/virtual-tour", to: "/place/tour", permanent: true },
  { from: "/floor-plans", to: "/residences/plans", permanent: true },
  { from: "/the-team", to: "/portfolio", permanent: true },
];
