# ORA World v2 — Design system

Same colours and the same official logos as v1, so the brand is unmistakably ORA. Everything else is new:
typography, shape language, motion and every module. This document fixes the system the code implements
in `src/styles/globals.css`.

## 1. Why v2 looks the way it does (client feedback, designed against)

| Feedback | What v2 does |
| --- | --- |
| "Sections are very simple" | Every module is an interactive, data-driven panel with at least one thing to do: drag, tab, filter, toggle, hover a hotspot or scroll to drive it. No module is heading + paragraph + image. |
| "No image cutting from the top, especially the towers" | Every image carries a focal point (CSS `object-position`) in the seed and in the CMS (the Sanity hotspot is required). Tower exteriors sit at 50% 10–20%, aerials at 50% 40%, interiors at centre. Frames are 16:9, 16:10, 3:2 or 4:3. No tower ever enters a 21:9 strip. Parallax is not used; the only image motion is a 1.04 → 1 settle inside its own frame. |
| "No blurry images" | No blur or LQIP anywhere (the image pipeline writes no blur data, the Sanity figure requests no LQIP, the audit test fails the build on any `data:image` placeholder). Images appear only when sharp, over a travertine ground. WebP only at quality 80. Every `sizes` matches the real rendered width and the audit fails any source narrower than 1.5× its displayed width. |
| "Use the correct logo and assets" | Only the official 2026 lockup (trimmed, gold on transparent, PNG + WebP at 1200px), the white lockup SVG and the favicon, downloaded from oraworld.com and never redrawn. Only the client's own renders. |
| No walls of giant type | Statement paragraphs cap at 30px (`--text-statement`), display headlines cap at 72px and three lines, and no module is text only. |
| No captions or controls on the hero film | YouTube IFrame API handshake, captions unloaded for 20s after play, chrome hidden by oversizing the iframe 130% inside the rounded frame, `pointer-events: none`. |
| Nothing unfinished visible | No portrait silhouettes (the team shows only the sponsor), no "headline to be supplied" strips (press is hidden until a real article exists), no staging switcher, placeholder modules stay hidden, unknown numbers read "To be confirmed". |

## 2. Palette (identical to v1, WCAG-checked)

| Token | Hex | Use |
| --- | --- | --- |
| bone | #F7F3EC | page ground |
| bone-deep | #EFE9DF | alternate ground, card ground |
| travertine | #E3D9C8 | surfaces, image ground while loading |
| travertine-deep | #C9B99E | strong rules, disabled |
| sand | #A39174 | decorative only, never text |
| basalt | #1C1B19 | dark panels, footer |
| basalt-soft | #242321 | dark cards |
| charcoal | #2A2825 | body text |
| charcoal-soft | #5A5650 | secondary text |
| brass | #A8864F | hairlines, icons, numerals 32px+ only |
| brass-ink | #684D25 | small brass text, focus ring, links on light |
| brass-light | #D4B987 | accent text on basalt |
| sea / sea-ink | #3F7F98 / #2C6A82 | map water, map labels |
| palm / palm-light | #4A5A3A / #9AA685 | eco and nature tags |

### Contrast table (computed from the hex values above, WCAG 2.2)

| Foreground | Background | Ratio | AA (4.5 text / 3 large) | Use |
|---|---|---|---|---|
| charcoal #2A2825 | bone #F7F3EC | 13.29:1 | pass | Body text |
| charcoal #2A2825 | bone-deep #EFE9DF | 12.17:1 | pass | Body on card ground |
| charcoal #2A2825 | travertine #E3D9C8 | 10.52:1 | pass | Body on travertine |
| charcoal-soft #5A5650 | bone #F7F3EC | 6.59:1 | pass | Secondary text |
| charcoal-soft #5A5650 | travertine #E3D9C8 | 5.21:1 | pass | Secondary on travertine |
| brass-ink #684D25 | bone #F7F3EC | 7.09:1 | pass | Labels, links, focus ring |
| brass-ink #684D25 | travertine #E3D9C8 | 5.61:1 | pass | Labels on travertine |
| brass #A8864F | bone #F7F3EC | 3.07:1 | large only | Hairlines, 32px+ numerals only |
| bone #F7F3EC | basalt #1C1B19 | 15.56:1 | pass | Text on dark panels |
| bone #F7F3EC | basalt-soft #242321 | 14.20:1 | pass | Text on dark cards |
| brass-light #D4B987 | basalt #1C1B19 | 9.09:1 | pass | Accent text on dark |
| brass-light #D4B987 | basalt-soft #242321 | 8.29:1 | pass | Accent on dark cards |
| basalt #1C1B19 | brass #A8864F | 5.07:1 | pass | Text on brass pill |
| sea-ink #2C6A82 | bone #F7F3EC | 5.44:1 | pass | Map labels |
| palm #4A5A3A | bone #F7F3EC | 6.75:1 | pass | Eco tags |
| sand #A39174 | bone #F7F3EC | 2.77:1 | fail | Decorative only (fails for text) |

Rules: brass on bone is reserved for hairlines and numerals of 32px and above; every small brass text uses
brass-ink. Sand is never used for text. Dark panels use bone for text and brass-light for accents.

## 3. Logos

- Primary lockup: `public/brand/ora-world-logo-gold.{png,webp}`, trimmed from the official 2026 file, 1200px wide.
- White lockup for imagery and dark panels: `public/brand/ora-world-logo-white.svg`, as published.
- Favicon and app icon: `src/app/icon.png` (512) and `src/app/apple-icon.png` (180) from the official favicon.
- Never redrawn, recoloured or retyped. Clear space equal to the tree's height. 44px tall in the header pill,
  96px in the footer.

## 4. Typography (new)

- Display: Fraunces variable (opsz 72–144, weight 300–400). The single italic accent word per headline uses
  SOFT 50 and WONK 1 for the warm "wonk" italic, in brass-ink on light and brass-light on dark.
- UI and body: Plus Jakarta Sans 400/500/600, 16–17px, line-height 1.6.
- Numerals: Fraunces lining figures (`.numeral`) for stats and counters; Plus Jakarta tabular figures for
  tables and forms.
- No Didone faces, no uppercase tracked eyebrows. Labels are sentence case, 13px, 600, brass-ink (`.label`).

| Class | Size (390 → 1440) | Use |
| --- | --- | --- |
| display-xl | 40 → 72px | page and hero headlines, max three lines |
| display-l | 32 → 56px | module headlines |
| display-m | 26 → 40px | sub-sections |
| display-s | 20 → 26px | card titles, questions |
| statement | 20 → 30px | statement paragraphs (never larger) |
| lead | 17 → 20px | intros |
| body | 17px | body |
| label | 13px / 600 | labels |
| legal | 11px | legal notice |

## 5. Shape language (new)

Soft, product-like luxury: 20–28px radius cards and media frames, pill buttons and chips, 8px grid. The page
ground is bone with a 12px inner gutter frame; content sits in rounded panels that alternate bone-deep,
travertine and basalt. Elevation appears on hover only (`0 24px 48px -24px rgb(28 27 25 / .25)`). One ornament:
a fine brass hairline that draws under the active tab, step or chip (`.hairline`).

Panel rhythm on the homepage: hero (basalt + frame) · numbers (travertine) · explorer (bone) · rooms (basalt) ·
resilience (travertine) · living (bone) · island (travertine) · compare (basalt) · invest (bone) · portfolio
(travertine) · FAQ (bone) · visit (image) · footer (basalt).

## 6. Motion

- Lenis smooth scroll on desktop pointers only; off on touch and under reduced motion.
- GSAP ScrollTrigger only for the pinned dial on desktop; killed under reduced motion and below 1024px.
- Reveals: opacity + 16px rise, 600–900ms, `cubic-bezier(0.22, 1, 0.36, 1)`, driven by IntersectionObserver with
  a 2.5s safety net. Pre-hide with opacity only, never clip-path. Images settle from scale 1.04 to 1 inside their frame.
- Page transitions: the incoming panel slides up 24px with a fade. No preloader.
- Under reduced motion: no pinning, no pulses, no autoplay film, everything visible.

## 7. The wow checklist (every section, desktop and mobile)

Each module must have all three, verified in screenshots at 1440 and 390:

| Module | Scroll entrance | Hover / touch response | Dwell detail |
| --- | --- | --- | --- |
| Hero | staggered words, frame settle, stat counters | thumbnail crossfade, hairline under the active render | the film plays silently behind the poster handshake |
| Numbers | counters tick once, cards stagger | card lift | route line draws to the plane |
| Explorer | tower bands light up from the ground | band highlight and glow, card crossfade | selected collection pulses |
| Room tour | image lands, hotspots appear after it | hotspot cards, drag with follow | pulsing rings, room counter ticks |
| Dial | segments fill one by one | card rule fills when active | completed dial pulses once |
| Living | tiles stagger, chip counts tick | FLIP reflow, tile lift, sheet | ambient zoom |
| Island | cards tilt as they pass centre | drag with momentum, row highlight | sketch fades into the live map |
| Compare | rows in sequence, checks draw | differences toggle animates height | hairline slides |
| Invest | step slides, connector line draws | answer chips collapse into a summary | the "Not sure" path never claims eligibility |
| Portfolio | island outline draws, pins drop | pin ↔ card highlight | selected pin ripples |
| FAQ | items stagger | hairline draws under the open item | count announces |
| Visit | frame settle, card rises | segmented control slides | the form is one card away |

Mobile parity: every module has a dedicated 390px layout (film first, sticky progress bars where desktop pins,
bottom sheets instead of side cards, horizontal rails with snap, 44px targets), never a shrunken desktop.
