# ORA World v2 — structure and the v1 → v2 map

## Navigation

A floating pill bar: logo · Residences · Living · Place · Invest · Portfolio · EN | ES · "Book a visit". On scroll
down it compacts to logo, menu and "Book a visit". Mobile: a bottom sheet with render tiles. A persistent
"Ask ORA" pill opens a slide-over with Quick questions (searchable FAQ), Call / WhatsApp (hidden until numbers
exist) and Book a visit.

## URL map (under /en and /es)

```
/                          Home: 12 modules + footer (see below)
/residences                Residence explorer (tower stack + collections) and the collection cards
/residences/[collection]   penthouses · residences · villas · hotel-suites: gallery with view toggle, features, finishes, specs
/residences/plans          Floor plan library: filters (collection, bedrooms, size, orientation, building), grid/list, shortlist
/residences/plans/[plan]   Plan detail behind the one-step registration gate (remembered a year): zoom, keyplan, PDF, request pricing
/residences/compare        Compare up to 3 shortlisted plans
/living                    Amenities bento (filterable), family | pets toggle, activities as tabs
/place                     Dorado and the island: drag rail, proximity list, map, the two projects, gallery and tour links
/place/[project]           tesoro-del-mar · dorado-waterfalls: hero frame, facts bento, render carousel, sections, map
/place/gallery             Masonry gallery with filters and a keyboard lightbox
/place/tour                Click-to-load Kuula 360° tour and the film with controls
/invest                    Act 60 orientation (three questions), the explainer as tabs, deposit steps, estimator, resilience dial
/portfolio                 The 12 locations: stylised island map with municipality pins + cards
/visit                     Booking journey: gallery or video call → time → details → what happens next; contact facts
/brokers                   Broker registration
/press  /press/[slug]      Hidden (404 and out of navigation) until a real article exists
/careers                   Open positions (none published) + résumé form
/hotel-development         Hospitality at the hub
/faq                       Searchable FAQ with topic chips and FAQPage JSON-LD
/privacy /terms /accessibility /legal-disclaimer   Legal pages with a sticky scroll-spy index
/studio                    Sanity Studio (ORA2_ project only)
/api/lead /api/newsletter /api/revalidate /api/og /api/draft-mode/{enable,disable}
```

## Homepage modules, in order

1. Hero: split stage (basalt panel + 16:10 film frame + four render thumbnails)
2. Tesoro Del Mar in numbers: bento grid with counters
3. Residence explorer: SVG tower stack, filters, side card
4. Room by room: hotspot tour
5. Built to endure: dial (pinned on desktop, sticky bar on mobile)
6. Living: filterable bento with FLIP + Family | Pets toggle card
7. The island: drag rail + proximity list + lazy MapLibre map
8. Two projects, side by side: comparison table
9. Invest with clarity: three-question Act 60 orientation + deposit stepper + disclaimer
10. Portfolio: stylised Puerto Rico map + 12 cards
11. FAQ: search + two columns + FAQPage JSON-LD
12. Book a visit: CTA over the golf render with a floating form card
13. Footer: basalt rounded panel

## Where every v1 content item now lives

| v1 | v2 |
| --- | --- |
| Hero stats bar (10 acres · 129 · 42 · 65,500) | Hero stat chips and the Numbers bento |
| Manifesto / mission text | Footer and the Hotel development / team sponsor bio; the mission's facts drive the hero line |
| "The Place" chapters (shore, rainforest, sea, table, horizon) | Island drag rail places |
| Residences preview + collection tabs | Residence explorer (home) and /residences |
| Resilience checklist / signature board | Built to endure dial (home) and /invest resilience |
| Amenities mosaic, Family and Pets sections | Living bento with the Family \| Pets toggle card; /living |
| Prosperous environment (Act 60) | Invest with clarity orientation; /invest explainer tabs |
| Location map + POIs | Island module proximity list + map; /place |
| VR tour teaser | /place/tour (click-to-load) |
| Team (Collaboratory) with placeholders | Removed from navigation; only the sponsor appears (no silhouettes) |
| Press strip with placeholders | Hidden until real press exists |
| Journey / walkthrough steps | Room by room hotspot tour |
| Glance checklist | Numbers bento and the comparison table |
| Portfolio grid | Portfolio map + cards; /portfolio |
| FAQ | FAQ module with search; /faq; Ask ORA quick questions |
| Presentation CTA + lead form | Book a visit CTA; /visit booking journey |
| Floor plan library, gate, shortlist, compare | /residences/plans, /residences/plans/[plan], /residences/compare |
| Gallery + lightbox | /place/gallery |
| Investment page (deposit steps, estimator) | /invest |
| Legal pages | /privacy /terms /accessibility /legal-disclaimer |
| Direction switcher (A/B/C) | Removed: one direction, no staging-only UI |

## Redirects (src/content/seed/redirects.ts)

Old oraworld.com and v1 paths redirect permanently: /our-residences → /residences, /our-amenities → /living,
/activities → /living, /tesoro-del-mar → /place/tesoro-del-mar, /dorado-waterfalls → /place/dorado-waterfalls,
/tax-incentive → /invest, /contact-us → /visit, /gallery → /place/gallery, /virtual-tour → /place/tour,
/floor-plans → /residences/plans, /location → /place, /the-team → /portfolio.
