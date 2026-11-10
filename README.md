# ORA World v2

A second, fully revamped website for ORA World: luxury, eco-conscious residences in Dorado, Puerto Rico.
Same palette and the same official 2026 logos as v1. Everything else is new: structure, navigation,
typography (Urbanist, sized to the client's reference), shape language and twelve interactive homepage modules.

- Design system, contrast table and the per-section wow checklist: [`DESIGN.md`](./DESIGN.md)
- Sitemap and where every v1 item now lives: [`docs/STRUCTURE.md`](./docs/STRUCTURE.md)
- Everything still needing real data from the client: [`CONTENT-TODO.md`](./CONTENT-TODO.md)
- Screenshots of every homepage module and every page at 1440 and 390: [`reports/screenshots/`](./reports/screenshots/)

Next.js 16 App Router (TypeScript strict) · Tailwind v4 tokens · next-intl EN/ES (`/en`, `/es`) · Sanity with an
embedded Studio at `/studio` · GSAP ScrollTrigger + Lenis · MapLibre GL (OpenFreeMap) · React Hook Form + Zod.

## Quick start

```bash
pnpm install
```

```bash
pnpm images:fetch && pnpm images:build
```

```bash
pnpm dev
```

Without a Sanity project the whole site renders from the typed seed in `src/content/seed/`.
`pnpm images:fetch` downloads the client's renders from oraworld.com into `assets-source/` (git-ignored);
the optimised files in `public/images/client/` are committed, so the fetch is only needed to rebuild them.

## Client decisions in force (November 2026)

- **Only Tesoro Del Mar is on sale.** `ON_SALE` in `src/lib/content.ts` filters every project list; `/portfolio`
  redirects to `/place/tesoro-del-mar`; the other projects' data and components stay in the repo for later.
- **Sales facts** (pricing per sq ft, what every residence includes, private charters) come from the sales team's
  prospect email and live in `src/content/seed/sales.ts`. The floor plan PDF, project presentation PDF and booking
  page are linked by their direct URLs (`src/content/seed/site.ts`). The email's own links are per-recipient
  tracked redirects and must never be published.
- **Layout after theresidencesatcipriani.com** (client: "simple will win"): a full-screen film banner, then eight
  sections in one repeated layout (`src/components/cip/CipSection.tsx`): numbered eyebrow, Cormorant Garamond
  capitals, a short line, a few bullets, one gold button, and a swipeable row of cards whose pictures slowly drift
  while on screen (`CardRail`, `AliveImage`; a card plays a looping clip if given a `video`). Dark floating header with
  the sales line and "Get price list"; phones get a fixed "Get brochure / Get floor plans" bar. Copy lives in
  `src/content/seed/homeCip.ts` (brochure and prospect email wording only).
- **The homepage tells the ORA World story** (client call, 10 Nov 2026), in this order: who ORA World is → why
  Puerto Rico (Act 60, with a not-tax-advice note) → longevity → step inside (360° tour and film) → residences and the
  penthouse → amenities → private charters → floor plans and Phase 1 pricing → three steps (Discover the island ·
  Choose your residence · Arrive in Dorado) → the inquiry form. Copy: `src/content/seed/homeCip.ts`, sourced only
  from oraworld.com, the brochure, the floor plans and the sales email.
- **One call to action, "Inquire"** (header, banner, menu, footer, inner pages, Ask ORA). The complete floor plans and
  the presentation are sent by the sales team after an inquiry. The banner film has a "Watch with sound" toggle
  (browsers never allow sound before a click, so the click restarts the film with sound).
- **Never on the site:** the owner's name; helicopter, helipad or airport-pickup promises.
- **Real Phase 1 floor plans:** 15 layouts (60 residences, floors 5–18) transcribed from the floor plan PDF, each with
  its page image and a link to that page of the PDF (`src/content/seed/collections.ts`).

## Third-party UI components (Skiper UI, Vengeance UI)

Some components come from two shadcn-style registries. They are vendored as source code in
`src/components/vendor/<library>/` with a `// Source:` header, restyled to the ORA palette, fonts and spacing, and fed
only real content and the client's renders. `npx shadcn init` is deliberately not used (it rewrites the global CSS
and theme tokens); instead:

```bash
node scripts/registry-add.mjs skiper-ui skiper47 skiper58
```

```bash
node scripts/registry-add.mjs vengeance-ui perspective-carousel stats-counter
```

The script prints each item's npm dependencies; they are installed with pnpm (`framer-motion`, `swiper`,
`lucide-react`, plus `tailwind-merge` so `cn` in `src/lib/utils.ts` matches what the components expect).

| Component | Library | File | Where it is used | Adaptations |
| --- | --- | --- | --- | --- |
| TextRoll (skiper58) | [Skiper UI](https://skiper-ui.com) | `vendor/skiper-ui/skiper58.tsx` | Header navigation links (desktop) | Demo nav removed; the roll is `aria-hidden` and the link carries the real text in `aria-label`; spaces kept |
| Carousel_001 (skiper47) | [Skiper UI](https://skiper-ui.com) | `vendor/skiper-ui/skiper47.tsx` | `/place/gallery`, "Featured renders" coverflow | Demo images removed; optimised URLs from `getImageProps`; A11y + Keyboard modules; restyled from `FeaturedCarousel.tsx` (rounded, borderless, 440px slides on desktop, landscape heights below) |
| PerspectiveCarousel | [Vengeance UI](https://www.vengeanceui.com) | `vendor/vengeance-ui/perspective-carousel.tsx` | Homepage "Walk through Tesoro Del Mar" module (`RenderGallery`) | Explicit-height wrapper (`h-[440px] md:h-[640px]`); opens on the middle slide; optimised URLs; 4:3 frames and focal points so towers never crop; 24px dot hit areas; localised labels |
| StatsCounter | [Vengeance UI](https://www.vengeanceui.com) | `vendor/vengeance-ui/stats-counter.tsx` | Hero stat chips, Tesoro Del Mar numbers bento | Real value server-rendered, reset to 0 before paint, digits written through a ref, `toLocaleString`, no negative in-view margin, skipped under reduced motion |

**Credit:** TextRoll and Carousel_001 are by [Skiper UI](https://skiper-ui.com) (author @gurvinder-singh02), used under the
Skiper UI free licence, which requires this attribution; the licence comment is kept in each file. PerspectiveCarousel
and StatsCounter are by [Vengeance UI](https://www.vengeanceui.com).

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` · `pnpm build` · `pnpm start` | Dev server, production build, production server |
| `pnpm typecheck` · `pnpm lint` · `pnpm format` | `tsc --noEmit`, ESLint, Prettier |
| `pnpm test:e2e` | Playwright at 1440 and 390: shell, image audit, axe accessibility (set `BASE_URL` or it starts `pnpm start`) |
| `pnpm lighthouse /en /en/residences` | Lighthouse mobile + desktop, JSON in `reports/lighthouse/` |
| `pnpm images:fetch` · `pnpm images:build` | Download the client's renders; optimise them (no blur data) and write `src/content/images.json` |
| `node scripts/brand-build.mjs` | Trim and export the official logos and icons |
| `node scripts/screenshots.mjs <dir> /en ...` | Full-page screenshots at 1440 and 390 |
| `node scripts/sections.mjs <dir> /en "#hero" ...` | Per-module screenshots at 1440 and 390 |
| `pnpm seed` | Push the seed into the ORA2 Sanity dataset (images uploaded once, stable ids) |
| `node scripts/registry-add.mjs <library> <name...>` | Vendor a Skiper UI or Vengeance UI component as source and print its dependencies |

## Environment

All keys are in `.env.example`; none are needed for a local build.

- **Sanity uses the `ORA2_` prefix on purpose.** The build environment also holds `NEXT_PUBLIC_SANITY_*` for an
  unrelated site; v2 never reads or writes it. Set `NEXT_PUBLIC_ORA2_SANITY_PROJECT_ID`, `NEXT_PUBLIC_ORA2_SANITY_DATASET`,
  `ORA2_SANITY_WRITE_TOKEN` and `ORA2_SANITY_REVALIDATE_SECRET`, then run `pnpm seed`.
- `NEXT_PUBLIC_SITE_ENV=staging` (default) sends `X-Robots-Tag: noindex` and disallows crawling. Set `production` to index.
  No staging-only UI exists on the page.
- Contact channels (`NEXT_PUBLIC_ORA2_PHONE`, `_WHATSAPP`, `_EMAIL`) and the booking link stay hidden until set.
- Leads: `CRM_WEBHOOK_URL` (+ `CRM_WEBHOOK_SECRET`), Turnstile keys, Resend behind `EMAIL_ENABLED`, optional Upstash.
- Analytics: `NEXT_PUBLIC_GTM_ID` or `NEXT_PUBLIC_GA4_ID`, loaded only after consent (Consent Mode v2).

## Deploy (Vercel)

1. Import the repository into the TTR Vercel team as its own project; `vercel.json` pins pnpm and cache headers.
2. Add the environment variables above. Keep `NEXT_PUBLIC_SITE_ENV=staging` on staging.
3. Deploy. For production set `NEXT_PUBLIC_SITE_ENV=production` and the real `NEXT_PUBLIC_SITE_URL`.

No Vercel token was available in the build environment, so the Vercel project and the staging deployment are a
manual step for the TTR team.

## How the client's feedback is enforced in code

- **Interactive modules:** every homepage module has something to do. See the wow checklist in `DESIGN.md`.
- **No tower cropping:** every `ImageRef` requires a `focal` (CSS object-position); the Sanity figure requires a hotspot.
- **No blur:** no LQIP anywhere; WebP only at quality 80. The image audit fails on any `data:image`, any cover image
  without a focal point, any original narrower than 1.5× its displayed width, and any `sizes` slot smaller than the
  real rendered width.
- **Hero film:** poster first with high fetch priority; YouTube mounts after load + idle on desktop and on the
  visitor's first touch on phones (the player is about 1.1 MB); captions unloaded for 20 s after play; chrome hidden
  by a 130% oversized, pointer-less iframe; a self-hosted loop replaces YouTube when set.
- **Nothing unfinished:** unknown numbers read "To be confirmed"; press, unnamed team members and placeholder
  modules stay hidden.

## QA status (production build, 5 November 2026)

- `pnpm typecheck`, `pnpm lint` and `pnpm build` are clean.
- Playwright: **66 passed, 2 skipped** (device-specific tests skip on the other viewport), desktop 1440 and mobile 390.
  Covers the nav pill compacting, the bottom sheet, the language switch and its remembered choice, Ask ORA tabs by keyboard,
  the home staying at the top after load, redirects, robots, sitemap, noindex and CSP headers, the lead and
  newsletter APIs, the image audit on thirteen pages and axe on thirteen pages (zero serious or critical violations).
- Lighthouse 13, simulated throttling, local production server. SEO reads 69 only because staging deliberately
  sends `noindex`; it is not a defect.

| Page | Mobile perf | Desktop perf | Accessibility | Best practices | CLS |
| --- | --- | --- | --- | --- | --- |
| `/en` | 67 | 97 | 100 | 100 / 96 | 0 |
| `/en/residences` | 81 | 99 | 100 | 100 | 0 |
| `/en/living` | 78 | 99 | 100 | 100 | 0 |
| `/en/place/tesoro-del-mar` | 80 | 96 | 100 | 100 | 0 |
| `/en/invest` | 81 | 99 | 99 | 100 | 0 |
| `/en/visit` | 82 | 99 | 100 | 100 | 0 |

Desktop beats the 85 target on every page. **Mobile misses the 90 target** (67–82). The observed LCP on the
simulated phone is about 1.3 s (hero poster: 21 ms first byte, 206 ms load), but Lighthouse's slow-4G model charges
the variable Fraunces files (two files, about 270 KB, required by the opsz and SOFT type spec) and the twelve-module
homepage's JavaScript against it. The remaining levers are client decisions: drop Fraunces' variable axes for static
weights (roughly +8–10 points), or split the homepage into fewer modules above the fold.
