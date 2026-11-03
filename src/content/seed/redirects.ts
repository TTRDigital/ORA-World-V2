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
  { from: "/tax-incentive", to: "/invest", permanent: true },
  { from: "/incentives", to: "/invest", permanent: true },
  { from: "/investment", to: "/invest", permanent: true },
  { from: "/resilience", to: "/invest", permanent: true },
  { from: "/contact-us", to: "/visit", permanent: true },
  { from: "/contact", to: "/visit", permanent: true },
  { from: "/location", to: "/place", permanent: true },
  { from: "/gallery", to: "/place/gallery", permanent: true },
  { from: "/virtual-tour", to: "/place/tour", permanent: true },
  { from: "/floor-plans", to: "/residences/plans", permanent: true },
  { from: "/the-team", to: "/portfolio", permanent: true },
];
