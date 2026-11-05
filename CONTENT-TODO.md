# CONTENT-TODO — everything still needing real data from the client

Nothing on the site is invented. Every fact traces to oraworld.com (captured in the v1 repository's
`docs/source/oraworld-com/` and re-read for v2). Unknown numbers inside real modules read "To be confirmed";
modules whose content is still a placeholder stay hidden.

## 1. Facts and numbers

| Item | Where it shows | Status |
| --- | --- | --- |
| Prices, unit mix, bedroom counts, sizes | Explorer specs, collection pages, plan library, compare | "To be confirmed". Supply per collection and per plan. |
| Real floor plans (architect drawings, PDFs, keyplans, unit positions, orientations, floors, status) | Plan library, plan detail, compare | Six illustrative SVG plans labelled "Illustrative placeholder plan". |
| Tower floor mapping (which floors each collection occupies) | Residence explorer tower stack | Illustrative, noted on the module. |
| Delivery dates, deposit schedule (percentages and timing) | Invest deposit stepper | Placeholders with the offering-plan notice. |
| Drive times other than "30 minutes to the airport" and "walking distance to Balneario Cerro Gordo" | Island proximity list, map popups | Marked approximate. |
| Site coordinates (18.4542, −66.3178) | Map pin | Approximate, near Cerro Gordo, Vega Alta 00692. Confirm the parcel. |
| Dorado Waterfalls coordinates | Project page map | Not shown until confirmed. |
| Hotel suites ownership model; hotel operator, brand, investment structure | Hotel suites collection, Hotel development page | To be confirmed. |
| Retail and office space at Tesoro Del Mar | Comparison table | To be confirmed (published only for Dorado Waterfalls). |

## 2. People, partners, press

| Item | Status |
| --- | --- |
| Architect, interior designer, landscape architect | Not named anywhere on the site (no placeholders, no silhouettes). Supply names, bios and portraits to add a team section. |
| Press articles | None public. The press section is hidden from navigation and returns 404 until a real article is added in Sanity. |
| Careers: open positions | None published; the page says so and offers the résumé form. |
| Broker co-op terms, commission schedule, broker kit PDF | To be confirmed on /brokers. |

## 3. Contact and commerce

| Item | Status |
| --- | --- |
| Phone, WhatsApp, email | Not published. Hidden until set (env `NEXT_PUBLIC_ORA2_*` or Site settings). The Ask ORA "Call / WhatsApp" tab appears automatically. |
| Sales gallery address and opening hours | "To be confirmed" on /visit. |
| Booking URL (Calendly / Cal.com) | Empty; the booking journey shows the request note and the form. |
| Social links | None published on the live site beyond network home pages; omitted. |
| CRM webhook, Turnstile, Resend, Upstash, GTM/GA4 | Environment variables, see README. |
| Sanity project | Create a dedicated ORA2 project (never the agency's `NEXT_PUBLIC_SANITY_*` project), set `NEXT_PUBLIC_ORA2_SANITY_PROJECT_ID` and `ORA2_SANITY_WRITE_TOKEN`, run `pnpm seed`. Until then the site renders entirely from the seed. |

## 4. Media

| Item | Status |
| --- | --- |
| Hero film | YouTube id HkIPZ9pGezA from the ORA World channel (captions off, chrome hidden). A self-hosted MP4/WebM loop replaces it when set in Site settings. |
| Brochure PDF, broker kit, floor plan PDFs | Missing. |
| Renders for Dorado Ocean View Estates and AquaMaria | None published; their portfolio cards show the gold lockup on travertine. |
| Dorado Waterfalls: more renders exist on oraworld.com (DoradoWaterfalls5–16, Interior2–20) | Eleven are in use; add more via Sanity if wanted. |

### Lifestyle photography licences

These files came from oraworld.com and appear to be stock imagery (one is literally `iStock-2231329012.jpg`).
Confirm the client's licences cover reuse on the new site: life-pets (010pet-1), life-toast (015discover),
life-reception (027entertaiment), life-jet (030transportation), life-atv (031cultural), life-family-pool (032family),
life-rainforest (033sustainability), life-gym (035sport), life-spa (042spa), life-pool-terrace (049discover),
life-running (055fitness), life-surf (056watersport), life-culinary (057culinary), life-waterpark (058entertainment),
life-adventure (059adventure), life-beach (05theplace-1), life-kite (060family), life-graduation (062educational),
life-shopping (063shopping), life-mother-child (064additional), life-sailing (iStock-2231329012).

## 5. Copy to review

- Headlines are new for v2 in English and Spanish; copy under them is factual and traces to the live site.
- Spanish is neutral Caribbean Spanish in the usted form; a native Puerto Rican reviewer should pass over
  `messages/es.json` and the `es` fields in `src/content/seed/*`.
- The legal notice is verbatim from the live site and intentionally in English on the Spanish site; confirm with counsel.
- Privacy, terms and accessibility statements are drafts for counsel.
- Act 60 content reproduces the live explainer with "not advice" disclaimers; the orientation never says anyone qualifies. A tax professional should review.

## 6. Open questions for the client

1. Confirm the Tesoro Del Mar figures are the ones to lead the brand homepage (they are the only published numbers).
2. Confirm or correct the illustrative tower floor mapping (penthouses top, residences, villas, hotel podium).
3. Which lifestyle photographs are licensed for the new site.
4. Sales gallery address, hours, phone, WhatsApp, email and the booking calendar link.
5. The Sanity project for v2 (dedicated project recommended) and who edits it.
6. The Vercel project: no Vercel token was available in the build environment, so the import and the environment
   variables are a manual step for the TTR team (see README).
