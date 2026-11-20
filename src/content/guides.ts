import type { ImageRef } from "./types";
import { tdm, life } from "./seed/images";

/**
 * Buyer guides (TTR-2508, Nov 21 2026): five English pages for people looking at oceanfront and luxury condos in
 * Dorado and Puerto Rico. Each targets one search query (keyword research notes on each guide).
 *
 * Facts come only from ORA World's own documents already in this repo: the TDM brochure and the sales team's prospect
 * email (seed/sales.ts), the Phase 1 floor plans (seed/collections.ts), oraworld.com's published copy (seed/projects.ts,
 * amenities.ts, home.ts, places.ts, faq.ts) and the site's legal notice (seed/site.ts).
 *
 * Hard rules (Kia, Nov 20): never mention, name or describe the owner or founder; no tax numbers, Act 60 savings or
 * deadlines; no health or longevity promises; no investment returns; no prices.
 *
 * Inline links in body text use [label](/path). "@book" is the booking page for a call with Reza.
 */

export type GuideSection = {
  id: string;
  h2: string;
  body: string[];
  list?: string[];
  steps?: { title: string; text: string }[];
  image?: { ref: ImageRef; caption: string };
  quote?: { text: string; cite: string };
};

export type Guide = {
  slug: string;
  /** Keyword research (internal: shown to TTR and Kia in TTR OS, not on the page). */
  seo: { query: string; secondary: string[]; why: string };
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  deck: string;
  hero: ImageRef;
  /** Short card title for the "keep reading" row. */
  cardTitle: string;
  facts: { value: string; label: string }[];
  lede: string;
  /** A 2 to 3 sentence answer shown at the top of the article, under the lede. */
  answer?: string;
  sections: GuideSection[];
  /** The mid-page call band appears after this many sections. */
  ctaAfter: number;
  faqs: { q: string; a: string }[];
  /** Primary sources for facts that are not ORA World's own (shown as a "Sources" list at the end of the article). */
  sources?: { label: string; href: string }[];
};

export const GUIDE_PUBLISHED = "2026-11-21";

const projectFacts = [
  { value: "10 acres", label: "On Puerto Rico's north coast, in Dorado" },
  { value: "129", label: "Contemporary residences" },
  { value: "42", label: "Suites in the boutique hotel" },
  { value: "65,500", label: "Square feet of amenities" },
];

export const guides: Guide[] = [
  /* ------------------------------------------------------------------ 1 · Oceanfront condos */
  {
    slug: "oceanfront-condos-dorado-puerto-rico",
    seo: {
      query: "oceanfront condos Dorado Puerto Rico",
      secondary: ["luxury condos Dorado Puerto Rico", "Dorado Puerto Rico condos for sale", "new condos in Dorado"],
      why: "Buyer-intent query. Page one is listing portals and vacation rentals (Zillow, NestSeekers, Airbnb, VRBO): nobody explains what to look for in a new oceanfront condo in Dorado. A guide built on Tesoro Del Mar's facts can rank for the head term and its long tail, and turns researchers into calls.",
    },
    metaTitle: "Oceanfront Condos in Dorado, Puerto Rico: What to Look For",
    metaDescription:
      "A buyer's guide to oceanfront and luxury condos in Dorado, Puerto Rico: views, balconies, beach access, storm-ready building and service at Tesoro Del Mar.",
    eyebrow: "Buyer's guide · Dorado, Puerto Rico",
    title: "Oceanfront condos in Dorado, Puerto Rico: what to look for",
    deck: "Views, balconies, the walk to the sand and a building made for the coast. How to judge an oceanfront residence on Puerto Rico's north coast, and how Tesoro Del Mar answers each point.",
    hero: tdm.exteriorPull,
    cardTitle: "Oceanfront condos in Dorado: what to look for",
    facts: projectFacts,
    lede: "On the north coast, “oceanfront” can mean a lot of things. The residences worth your time are the ones where the sea is part of every day: from the bedroom, from the balcony and a short walk from the door.",
    sections: [
      {
        id: "why-dorado",
        h2: "Why Dorado's north coast",
        body: [
          "Dorado sits on Puerto Rico's north coast, where turquoise coves meet tropical forest, and close to the island's main gateway: Tesoro Del Mar is about 30 minutes from Luis Muñoz Marín International Airport in San Juan.",
          "Tesoro Del Mar is a 10-acre community in Dorado, Vega Alta, set near a national park with panoramic ocean views. It brings together 129 contemporary residences, a boutique hotel with 42 suites, a clubhouse and 65,500 square feet of amenities. For a wider look at the area, read our guide to [living in Dorado](/guides/living-in-dorado-puerto-rico).",
        ],
        image: { ref: tdm.aerialCoast, caption: "Tesoro Del Mar above a turquoise cove on the north coast. Artist rendering." },
      },
      {
        id: "truly-oceanfront",
        h2: "What makes a condo truly oceanfront",
        body: [
          "Start with the view from the rooms you live in, not the lobby. Ask which rooms face the water, how the view changes by floor, and whether the balcony is deep enough to use every day. Then check the walk: how far is the nearest beach on foot?",
          "At Tesoro Del Mar, ORA World's sales team describes every residence as having water views and an oversized balcony. Floor-to-ceiling glass frames the ocean or the gardens from the principal rooms, and cantilevered terraces reach out like wings, landscaped with native plants and flowers. Balneario Cerro Gordo is within walking distance.",
        ],
        list: [
          "Water views from every residence",
          "Oversized balconies for outdoor living",
          "Floor-to-ceiling glass in the principal rooms",
          "Walking distance to Balneario Cerro Gordo",
        ],
        quote: { text: "All the units in Tesoro Del Mar have nice water views and come with oversized balconies.", cite: "ORA World sales team" },
      },
      {
        id: "built-for-the-coast",
        h2: "Built for the coast",
        body: [
          "Living by the sea in the Caribbean means asking how a building handles storms. ORA World engineers its structures to withstand Category 5 hurricanes, with impact-resistant windows, reinforced walls and advanced drainage. Its seismic engineering exceeds local building codes for seismic zones.",
          "Developments include backup generators with solar and battery storage, elevated foundations, stormwater management and private safe rooms. Security teams are on site 24/7, with monitored access points, smart locks and gated, monitored parking.",
        ],
      },
      {
        id: "inside-the-residences",
        h2: "Inside the residences",
        body: [
          "Phase 1 is 60 residences on floors 5 to 18 of Tower 1, in 15 layouts that run from one bedroom with a den to a two-level penthouse on the 18th floor with its own elevator. Residences range from about 942 to 4,666 square feet inside. You can study every layout on the [floor plans page](/b/floor-plans).",
          "Interiors are open-plan, with 10-foot ceilings and motorized shades in every room. Kitchens pair Italian cabinetry by Scavolini with an integrated Gaggenau appliance suite; bathrooms carry Dornbracht fixtures; Crestron Home and Lutron run the home. See the full palette on the [finishes page](/b/finishes).",
        ],
        image: { ref: tdm.bedroomOcean, caption: "A bedroom with floor-to-ceiling glass facing the ocean. Artist rendering." },
      },
      {
        id: "service",
        h2: "Service that makes the coast easy",
        body: [
          "An oceanfront home is easier to enjoy when someone else handles the details. Tesoro Del Mar has a porte-cochère and a private residential lobby attended 24/7, valet and self-parking, and a luxury house car and golf cart service. A beach club with food and drinks is reached by the walking path or by golf cart.",
          "For owners who split their year, ORA World offers private charter flights between the United States and their condo in Puerto Rico. Discover everything else on site in our guide to [amenities and daily life at Tesoro Del Mar](/guides/tesoro-del-mar-amenities).",
        ],
      },
      {
        id: "questions-to-ask",
        h2: "Questions to ask any oceanfront developer",
        body: ["Whichever building you are considering, these questions separate a beautiful render from a home you will enjoy for years:"],
        list: [
          "Which rooms face the water, and how does the view change by floor?",
          "How deep are the balconies, and are they covered?",
          "How far is the nearest beach on foot?",
          "What hurricane and seismic standards is the building engineered to?",
          "What keeps the power on in a storm?",
          "What is included in the finishes, and what can you choose?",
          "Has the offering plan been filed, and when can deposits be accepted?",
        ],
      },
      {
        id: "see-it",
        h2: "See Tesoro Del Mar for yourself",
        body: [
          "Take the [360° tour](/place/tour) or watch the film, then [book a call with Reza](@book), ORA World's agent. Reza can walk you through the views from each layout, send the brochure and the Phase 1 floor plans, and arrange a visit or a video call.",
        ],
      },
    ],
    ctaAfter: 3,
    faqs: [
      {
        q: "Do all residences at Tesoro Del Mar have ocean views?",
        a: "ORA World's sales team describes every residence at Tesoro Del Mar as having water views and an oversized balcony. Principal rooms look out to the ocean or the gardens through floor-to-ceiling glass.",
      },
      {
        q: "How far is Tesoro Del Mar from the beach?",
        a: "Balneario Cerro Gordo is within walking distance of Tesoro Del Mar. A beach club with food and drinks is reached by the walking path or by golf cart.",
      },
      {
        q: "How far is Tesoro Del Mar from the airport?",
        a: "About 30 minutes from Luis Muñoz Marín International Airport in San Juan.",
      },
      {
        q: "How many residences are there?",
        a: "Tesoro Del Mar has 129 contemporary residences and a boutique hotel with 42 suites. Phase 1 is 60 residences on floors 5 to 18 of Tower 1, in 15 layouts.",
      },
      {
        q: "Are the buildings designed for hurricanes?",
        a: "Yes. ORA World engineers its structures to withstand Category 5 hurricanes, with impact-resistant windows, reinforced walls, advanced drainage, backup generators with solar and battery storage, and private safe rooms.",
      },
      {
        q: "Can I reserve a residence today?",
        a: "Not yet. This is a solicitation of interest: no offering can be made and no deposits or reservations can be accepted until an offering plan is filed with the New York State Department of Law. You can inquire now and book a call with Reza to receive the brochure and floor plans.",
      },
    ],
  },

  /* ------------------------------------------------------------------ 2 · Living in Dorado */
  {
    slug: "living-in-dorado-puerto-rico",
    seo: {
      query: "living in Dorado Puerto Rico",
      secondary: ["moving to Dorado Puerto Rico", "is Dorado a good place to live", "Dorado Puerto Rico lifestyle"],
      why: "Relocation research query, early in the buying journey. Page one is mostly expat forum threads (expat.com) and thin profiles (Niche): a structured, well-designed guide to daily life can outrank them and introduce Tesoro Del Mar to people deciding where on the island to live.",
    },
    metaTitle: "Living in Dorado, Puerto Rico: Daily Life on the North Coast",
    metaDescription:
      "What living in Dorado, Puerto Rico is like: beaches, nature, getting around, working from home and weekends on the island, from Tesoro Del Mar.",
    eyebrow: "Living guide · Dorado, Puerto Rico",
    title: "Living in Dorado, Puerto Rico: daily life on the north coast",
    deck: "Mornings by the sea, a short drive to San Juan, forest trails next door and an island of weekends. What a year in Dorado can look like.",
    hero: life.beach,
    cardTitle: "Living in Dorado: daily life on the north coast",
    facts: [
      { value: "30 min", label: "To San Juan's international airport" },
      { value: "On foot", label: "To Balneario Cerro Gordo beach" },
      { value: "2 miles", label: "Of garden walking path at Tesoro Del Mar" },
      { value: "24/7", label: "Attended lobby and on-site security" },
    ],
    lede: "From sun-kissed beaches to emerald mountains, Puerto Rico is a place of extraordinary contrasts. Dorado puts you between the two: the sea at the end of the path, the forest at the edge of the garden.",
    sections: [
      {
        id: "where",
        h2: "Where Dorado is",
        body: [
          "Dorado lies on Puerto Rico's north coast. From Tesoro Del Mar, Luis Muñoz Marín International Airport in San Juan is about 30 minutes away, which keeps the mainland close and puts a day in Old San Juan within easy reach.",
          "Close to home, Balneario Cerro Gordo beach is within walking distance and a national park sits beside the community, with scenic walking and jogging paths winding through it.",
        ],
        image: { ref: tdm.aerialForest, caption: "Tesoro Del Mar rising from the forest canopy near the coast. Artist rendering." },
      },
      {
        id: "a-day",
        h2: "A day at home on the coast",
        body: [
          "Mornings can start on the two-mile walking path through landscaped gardens, or with a class on the outdoor yoga terrace. By mid-morning, head to the beach club for a swim; the walk is short, and a golf cart can take you if you prefer.",
          "Afternoons are for the resort-style pool and its sundeck, a round on the 18-hole putting course or a match on the tennis courts. In the evening the clubhouse fills: a fine-dining restaurant, a rooftop pool bar and a café and bakery for the next morning's coffee.",
        ],
        quote: { text: "From sun-kissed beaches to emerald mountains, the island is a place of extraordinary contrasts.", cite: "ORA World" },
      },
      {
        id: "getting-around",
        h2: "Getting around, and getting home",
        body: [
          "Most trips start at the porte-cochère: valet and self-parking are on site, and a luxury house car and golf cart service handle the short journeys. San Juan's international airport is about 30 minutes away.",
          "For owners who split their year between Puerto Rico and the mainland, ORA World offers private charter flights between the United States and their condo, so the trip home is as considered as the home itself.",
        ],
        image: { ref: tdm.exteriorRoad, caption: "The palm-lined arrival road to Tesoro Del Mar. Artist rendering." },
      },
      {
        id: "working",
        h2: "Working from Dorado",
        body: [
          "If your work travels with you, the clubhouse has a business center with conference rooms, reservable private offices, a coffee bar, high-speed Wi-Fi and IT services available 24/7. Inside the residences, open layouts and a dedicated study in several plans make room for a home office; compare them on the [floor plans page](/b/floor-plans).",
        ],
      },
      {
        id: "weekends",
        h2: "Food, culture and island weekends",
        body: [
          "Puerto Rico's table is a reason to stay: the aromas of mofongo and lechón, the rhythms of salsa and bomba, farm-to-table dinners and rum tastings. Old San Juan's cobblestone streets and colorful colonial architecture make an easy day out.",
          "Further afield, hike the trails of El Yunque National Forest beneath its canopy and hidden waterfalls, or paddle through the island's bioluminescent bays. Our guide to [things to do in Dorado](/guides/things-to-do-in-dorado-puerto-rico) has more.",
        ],
        image: { ref: life.culinary, caption: "Friends sharing a table of island dishes." },
      },
      {
        id: "peace-of-mind",
        h2: "Peace of mind",
        body: [
          "Professionally trained security teams are on site 24/7, with regular patrols, monitored access points, smart locks and gated, monitored parking. The buildings are engineered for Category 5 hurricanes, with solar and battery backup, so daily life on the coast stays calm.",
          "Want to see how it feels? [Book a call with Reza](@book) to plan a visit to Dorado, or take the [360° tour](/place/tour) first.",
        ],
      },
    ],
    ctaAfter: 3,
    faqs: [
      {
        q: "How far is Dorado from San Juan?",
        a: "Tesoro Del Mar, in Dorado, is about 30 minutes from Luis Muñoz Marín International Airport in San Juan.",
      },
      {
        q: "Which beach is closest to Tesoro Del Mar?",
        a: "Balneario Cerro Gordo is within walking distance. Residents also have a beach club with food and drinks, reached by the walking path or by golf cart.",
      },
      {
        q: "Can I work remotely from Tesoro Del Mar?",
        a: "Yes. The clubhouse business center has conference rooms, reservable private offices, a coffee bar, high-speed Wi-Fi and IT services available 24/7.",
      },
      {
        q: "Are pets welcome at Tesoro Del Mar?",
        a: "Yes. ORA World's communities include secure dog parks, grooming stations, pet daycare and on-demand veterinary care.",
      },
      {
        q: "Is it safe to live by the coast in Dorado?",
        a: "ORA World engineers its buildings to withstand Category 5 hurricanes, with impact-resistant windows, solar and battery backup and private safe rooms, and security teams are on site 24/7.",
      },
      {
        q: "How can I visit?",
        a: "Book a call with Reza, ORA World's agent, to arrange a visit to Dorado or a video call with the sales team.",
      },
    ],
  },

  /* ------------------------------------------------------------------ 3 · Buying pre-construction */
  {
    slug: "buying-pre-construction-condo-puerto-rico",
    seo: {
      query: "buying a pre-construction condo in Puerto Rico",
      secondary: ["pre-construction condos Puerto Rico", "how to buy a pre-construction condo", "new development condos Puerto Rico"],
      why: "High-intent, under-served query: the results page has no Puerto Rico-specific step-by-step guide (it shows Puerto Vallarta, Dominican Republic and Miami guides instead). A clear, honest process page fills the gap and answers the questions buyers ask before they call.",
    },
    metaTitle: "Buying a Pre-Construction Condo in Puerto Rico, Step by Step",
    metaDescription:
      "How buying a pre-construction condo in Puerto Rico works, step by step: the offering plan, floor plans, finishes, visits and what to ask, with Tesoro Del Mar.",
    eyebrow: "Buyer's guide · Pre-construction",
    title: "Buying a pre-construction condo in Puerto Rico, step by step",
    deck: "From the first film to the offering plan: how buying from plans works at Tesoro Del Mar in Dorado, what you choose along the way, and what to ask before you commit.",
    hero: tdm.aerialTowers,
    cardTitle: "Buying pre-construction in Puerto Rico, step by step",
    facts: [
      { value: "60", label: "Phase 1 residences in Tower 1" },
      { value: "15", label: "Layouts to choose from" },
      { value: "5 to 18", label: "The floors of Phase 1" },
      { value: "71", label: "Cabinetry finishes to choose from" },
    ],
    lede: "Buying before a building is finished means choosing early: the layout, the floor, the view and the finishes. Done well, it is the most personal way to buy a home. Here is how it works at Tesoro Del Mar.",
    sections: [
      {
        id: "what-it-means",
        h2: "What “pre-construction” means",
        body: [
          "A pre-construction purchase is made from plans, renders and specifications before the building is complete. In return you choose from the full range of layouts and floors, and you shape the interiors to your taste.",
          "Because you are buying something not yet built, the documents matter more than usual: the floor plans, the specifications, the finishes and, above all, the offering plan that sets out the terms.",
        ],
      },
      {
        id: "offering-plan",
        h2: "First, the offering plan",
        body: [
          "Tesoro Del Mar is currently a solicitation of interest. No offering of the residences can be made, and no deposits or reservations, binding or non-binding, can be accepted until an offering plan is filed with the New York State Department of Law (Attorney General File No. CP25-0047). The sponsor is TRPbuildco LLC.",
          "That means today is the time to learn, compare and shortlist. When the offering plan is filed, read it carefully with your own attorney before you sign or pay anything.",
        ],
        image: { ref: tdm.foyerSignage, caption: "The Tesoro Del Mar foyer. Artist rendering." },
      },
      {
        id: "the-steps",
        h2: "The steps, in order",
        body: ["Every buyer's path is a little different, but most follow these seven steps:"],
        steps: [
          { title: "Explore online", text: "Watch the film and take the 360° tour to see the towers, the lobby and the residences." },
          { title: "Book a call with Reza", text: "Tell ORA World's agent what you are looking for: size, views, timing and how you will use the home." },
          { title: "Receive the brochure and floor plans", text: "The sales team sends the brochure and the complete Phase 1 floor plans after you inquire." },
          { title: "Shortlist your residence", text: "Compare the 15 Phase 1 layouts across floors 5 to 18, from one bedroom with a den to the two-level penthouse." },
          { title: "Visit, or meet by video", text: "See Dorado in person, or walk through the plans with the sales team on a video call." },
          { title: "Choose your finishes", text: "Pick cabinetry, counters and fixtures from the finish palette, with the team's help." },
          { title: "Review the offering plan", text: "Once it is filed, review the terms with your attorney. Reservation, contract and schedule details are set out there." },
        ],
      },
      {
        id: "choosing",
        h2: "Choosing your residence",
        body: [
          "Phase 1 is 60 residences on floors 5 to 18 of Tower 1, in 15 layouts. Interiors range from about 942 to 4,666 square feet, and ORA World's sales team describes every residence as having water views and an oversized balcony. At the top, the penthouse spans two levels on the 18th floor with a private elevator.",
          "Use the [floor plans page](/b/floor-plans) to compare layouts by bedrooms, size and orientation, and ask Reza which floors give you the view you want.",
        ],
        image: { ref: tdm.aptLiving, caption: "Open living and dining in a Tesoro Del Mar residence. Artist rendering." },
      },
      {
        id: "finishes",
        h2: "Making it yours: the finishes",
        body: [
          "Buying early means choosing the details. Italian cabinetry comes in 71 finishes, with sintered-stone counters, a Gaggenau kitchen and Dornbracht fixtures in brushed champagne. Crestron Home, Lutron motorized shades and Rimadesio walk-in closets complete the specification.",
          "Explore the palette and save your selection on the [finishes page](/b/finishes).",
        ],
        quote: { text: "Italian cabinetry in 71 finishes, sintered-stone counters, a Gaggenau kitchen. You choose; we help.", cite: "ORA World" },
      },
      {
        id: "compare",
        h2: "What to compare between projects",
        body: ["If you are weighing more than one new development on the island, compare them on the same points:"],
        list: [
          "Whether the offering plan has been filed, and what it says about deposits and schedule",
          "The developer's hurricane and seismic engineering standards",
          "Views by floor and orientation, not just from the top",
          "What the finishes include as standard, and what you can choose",
          "Amenities that are part of the community, not nearby",
          "Service: lobby hours, parking, security and how owners travel",
        ],
      },
      {
        id: "brokers",
        h2: "Working with a broker",
        body: [
          "ORA World works with brokers. If you already have one, they can register you through the [brokers page](/brokers), and the sales team confirms the registration by email.",
          "Ready for the first step? [Book a call with Reza](@book).",
        ],
      },
    ],
    ctaAfter: 3,
    faqs: [
      {
        q: "Can I reserve a residence at Tesoro Del Mar now?",
        a: "Not yet. No offering can be made and no deposits or reservations, binding or non-binding, can be accepted until an offering plan is filed with the New York State Department of Law. You can inquire, receive the brochure and floor plans and shortlist a residence now.",
      },
      {
        q: "What do I receive after I inquire?",
        a: "The sales team sends the brochure and the complete Phase 1 floor plans, and Reza, ORA World's agent, follows up personally to talk about your goals, availability and a visit.",
      },
      {
        q: "How many layouts are in Phase 1?",
        a: "There are 15 layouts across 60 residences on floors 5 to 18 of Tower 1, from one bedroom with a den to a two-level penthouse with a private elevator.",
      },
      {
        q: "Can I choose my finishes?",
        a: "Yes. Italian cabinetry comes in 71 finishes, with sintered-stone counters, a Gaggenau kitchen and Dornbracht fixtures, and the team helps you choose.",
      },
      {
        q: "Do I have to visit Puerto Rico before buying?",
        a: "You can start online with the film, the 360° tour and a video call with the sales team. A visit to Dorado can be arranged whenever you are ready.",
      },
      {
        q: "Does ORA World work with brokers?",
        a: "Yes. Brokers can register their clients through the brokers page, and the sales team confirms each registration by email.",
      },
    ],
  },

  /* ------------------------------------------------------------------ 4 · Amenities and lifestyle */
  {
    slug: "tesoro-del-mar-amenities",
    seo: {
      query: "luxury condos with resort amenities in Puerto Rico",
      secondary: ["Tesoro Del Mar amenities", "Dorado condo amenities", "resort-style condos Dorado Puerto Rico"],
      why: "Comparison query from buyers weighing branded resort residences (Ritz-Carlton Reserve, Four Seasons, Palmas del Mar); page one is rentals and brand pages with thin amenity detail. A complete, specific amenity guide competes on depth and also captures the branded 'Tesoro Del Mar amenities' searches that ads and emails create.",
    },
    metaTitle: "Resort Amenities at Tesoro Del Mar, Dorado, Puerto Rico",
    metaDescription:
      "Every amenity at Tesoro Del Mar in Dorado: a members-only clubhouse, pool and putting course, fitness and spa, beach club, business center and 24/7 service.",
    eyebrow: "Amenities · Tesoro Del Mar",
    title: "Resort-style amenities and daily life at Tesoro Del Mar",
    deck: "A members-only clubhouse, a resort pool, a putting course, a beach club and a lobby that never closes: 65,500 square feet of amenities, and how a day uses them.",
    hero: tdm.exteriorGolf,
    cardTitle: "Resort amenities and daily life at Tesoro Del Mar",
    facts: [
      { value: "65,500", label: "Square feet of amenities" },
      { value: "14,000", label: "Square feet of members-only clubhouse" },
      { value: "18", label: "Holes on the putting course" },
      { value: "24/7", label: "Attended residential lobby" },
    ],
    lede: "The best amenities are the ones you actually use. At Tesoro Del Mar they sit within the community, a short walk or golf-cart ride from your door, so a resort day is simply an ordinary one.",
    sections: [
      {
        id: "clubhouse",
        h2: "The Clubhouse",
        body: [
          "At the heart of the community is an on-premises, members-only club with 14,000 square feet of social and productivity spaces. Start the day at the café, bakery and corner store; end it at the fine-dining restaurant or the rooftop pool bar. Indoor and outdoor event spaces host everything from dinners to celebrations.",
        ],
        image: { ref: tdm.foyerLounge, caption: "A lounge in travertine and warm wood. Artist rendering." },
        quote: { text: "An on-premises, members-only club with 14,000 sq ft of social and productivity spaces.", cite: "Tesoro Del Mar brochure" },
      },
      {
        id: "pool-and-putting",
        h2: "Pool and putting course",
        body: [
          "An outdoor resort-style pool with a sundeck and poolside bar sits beside a next-generation 18-hole putting course. For practice on any day, a programmable golf simulator and lounge are part of the clubhouse, and Dorado's championship golf is close by.",
        ],
        image: { ref: tdm.exteriorPull, caption: "The towers above the resort pool, framed by palms. Artist rendering." },
      },
      {
        id: "fitness-and-spa",
        h2: "Fitness and the spa",
        body: [
          "A state-of-the-art fitness center and Pilates studio look out over the gardens. The spa offers massage, treatments and salon services, and an outdoor yoga terrace makes the most of the morning air.",
          "Members also have a nutritionist on staff and a kitchen on the premises with many meal options, so eating well at home is simple. Learn more on the [living page](/b/living).",
        ],
        image: { ref: tdm.gym, caption: "The fitness center with garden views. Artist rendering." },
      },
      {
        id: "sport",
        h2: "Courts and play",
        body: ["For those who like to compete, or simply to move:"],
        list: [
          "Tennis courts",
          "A half basketball court",
          "Beach volleyball and beach tennis",
          "A programmable golf simulator and lounge",
        ],
      },
      {
        id: "beach-club",
        h2: "The beach club and slipway",
        body: [
          "A beach club with food and beverage service is reached by the walking path or by golf cart, and a slipway makes launching a boat easy. Balneario Cerro Gordo is within walking distance. For more days on the water, see our guide to [things to do in Dorado](/guides/things-to-do-in-dorado-puerto-rico).",
        ],
        image: { ref: life.beach, caption: "A turquoise cove on Puerto Rico's north coast." },
      },
      {
        id: "work",
        h2: "Room to work",
        body: [
          "The business center has conference rooms, reservable private offices, a coffee bar, high-speed Wi-Fi and IT services available 24/7, so a working week in Dorado feels no different from one in the city, except for the view.",
        ],
      },
      {
        id: "arrival-and-service",
        h2: "Arrival and everyday service",
        body: [
          "Arrive under a porte-cochère to a private residential lobby attended 24/7. Valet and self-parking, a luxury house car and golf cart service, a resident lounge with curated art and bar service, and private, secure climate-controlled storage take care of the rest.",
          "Between the United States and Puerto Rico, owners have private charter flights to their condo and back.",
        ],
        image: { ref: tdm.entrance, caption: "The arrival drive and canopy entrance. Artist rendering." },
      },
      {
        id: "nature",
        h2: "Gardens and nature",
        body: [
          "A two-mile walking path winds through landscaped gardens, past sensory gardens and native plants, and scenic jogging paths continue into the adjacent national park. Solar panels and battery storage, natural ventilation and daylight are part of the design.",
          "See how the residences connect to all of this on the [floor plans page](/b/floor-plans), or [book a call with Reza](@book) to ask about anything on this list.",
        ],
      },
    ],
    ctaAfter: 4,
    faqs: [
      {
        q: "How large is the amenity area at Tesoro Del Mar?",
        a: "Tesoro Del Mar has 65,500 square feet of indoor and outdoor amenities, including a 14,000-square-foot members-only clubhouse.",
      },
      {
        q: "What is in the clubhouse?",
        a: "A café, bakery and corner store, a fine-dining restaurant, a rooftop pool bar, indoor and outdoor event spaces, a business center, a golf simulator and lounge, and a fitness center and wellness spa.",
      },
      {
        q: "Is there a beach club?",
        a: "Yes. A beach club with food and beverage service is reached by the walking path or by golf cart, and there is a slipway for launching boats.",
      },
      {
        q: "Is there a gym and a spa?",
        a: "Yes: a state-of-the-art fitness center and Pilates studio, a spa for massage, treatments and salon services, and an outdoor yoga terrace.",
      },
      {
        q: "Can I work from the community?",
        a: "Yes. The business center has conference rooms, reservable private offices, a coffee bar, high-speed Wi-Fi and IT services available 24/7.",
      },
      {
        q: "What service is included at arrival?",
        a: "A porte-cochère, a private residential lobby attended 24/7, valet and self-parking, and a luxury house car and golf cart service.",
      },
    ],
  },

  /* ------------------------------------------------------------------ 5 · The area */
  {
    slug: "things-to-do-in-dorado-puerto-rico",
    seo: {
      query: "things to do in Dorado Puerto Rico",
      secondary: ["Dorado Puerto Rico beaches", "Dorado Puerto Rico activities", "day trips from Dorado"],
      why: "The largest-volume query in the set (informational). Page one is the tourism board and booking sites (Discover Puerto Rico, Expedia, TripAdvisor), so the head term is a stretch, but the long tail (beaches near Dorado, Dorado activities) is winnable, and the page builds Dorado topical authority and links visitors to the buyer guides.",
    },
    metaTitle: "Things to Do in Dorado, Puerto Rico: Beaches and Nature",
    metaDescription:
      "The best things to do in Dorado, Puerto Rico: beaches, sailing and snorkeling, golf, forest trails, island food and day trips to Old San Juan and El Yunque.",
    eyebrow: "Area guide · Dorado, Puerto Rico",
    title: "Things to do in Dorado, Puerto Rico: beaches, nature and island days",
    deck: "Turquoise coves, championship golf, rainforest trails and the island's table. A local's list of how to spend your days in and around Dorado.",
    hero: tdm.aerialCoast,
    cardTitle: "Things to do in Dorado: beaches, nature and island days",
    facts: [
      { value: "On foot", label: "To Balneario Cerro Gordo from Tesoro Del Mar" },
      { value: "Next door", label: "A national park with walking trails" },
      { value: "30 min", label: "To San Juan's international airport" },
      { value: "North coast", label: "Of Puerto Rico, between sea and forest" },
    ],
    lede: "Sparkling turquoise water against soft sand, forest trails a few steps away and a capital city within easy reach: Dorado makes every kind of day easy to plan.",
    sections: [
      {
        id: "beaches",
        h2: "On the beach",
        body: [
          "Balneario Cerro Gordo is the beach on Tesoro Del Mar's doorstep, within walking distance: sparkling turquoise water lapping against soft sand. Dorado Beach lies along the same stretch of coast.",
          "Residents of Tesoro Del Mar also have a private beach club with food and drinks, reached by the walking path or by golf cart.",
        ],
        quote: { text: "Sparkling turquoise waters lap against soft sandy shores, a walk from Tesoro Del Mar at Balneario Cerro Gordo.", cite: "ORA World" },
      },
      {
        id: "on-the-water",
        h2: "On the water",
        body: ["The north coast is made for days at sea. Around the island you can:"],
        list: [
          "Snorkel or dive coral reefs with certified guides",
          "Charter a yacht for a day trip or a sunset cruise",
          "Kayak or paddleboard calm lagoons and coastlines",
          "Surf, windsurf or kiteboard, with lessons for beginners",
          "Head out deep-sea fishing with a guide",
          "Take an eco-friendly boat tour through mangroves and marine reserves",
        ],
        image: { ref: life.sailing, caption: "A sailboat on open Caribbean water." },
      },
      {
        id: "golf-and-courts",
        h2: "Golf and the courts",
        body: [
          "Dorado is known for championship golf, with lessons from PGA professionals. At home, Tesoro Del Mar adds an 18-hole putting course, a programmable golf simulator, tennis courts, a half basketball court and beach volleyball.",
        ],
        image: { ref: tdm.exteriorGolf, caption: "Tesoro Del Mar seen across the landscaped green. Artist rendering." },
      },
      {
        id: "nature",
        h2: "Into the green",
        body: [
          "A national park sits beside Tesoro Del Mar, with scenic jogging and walking paths through it. Further afield, hike the trails of El Yunque National Forest beneath its canopy and hidden waterfalls.",
          "For more adventure, the island offers guided hikes through rainforest and mountain terrain, ziplining through the tropical canopy, and guided tours of natural caves.",
        ],
        image: { ref: life.rainforest, caption: "Hikers beneath the canopy of a tropical rainforest." },
      },
      {
        id: "food-and-culture",
        h2: "At the table, and on the dance floor",
        body: [
          "Puerto Rico's food is a reason to explore: the aromas of mofongo and lechón, farm-to-table dinners and rum tastings. Take a cooking class in Caribbean dishes, then learn salsa or bachata, and catch live music and the rhythms of bomba.",
          "Back at Tesoro Del Mar, the clubhouse has a fine-dining restaurant and a rooftop pool bar. See the full list in our guide to [amenities at Tesoro Del Mar](/guides/tesoro-del-mar-amenities).",
        ],
      },
      {
        id: "day-trips",
        h2: "Day trips from Dorado",
        body: [
          "Old San Juan is the classic day out: cobblestone streets and colorful colonial architecture, with San Juan's international airport about 30 minutes from Tesoro Del Mar. After dark, paddle through one of the island's bioluminescent bays or sail into the sunset.",
          "Thinking about staying longer? Read about [living in Dorado](/guides/living-in-dorado-puerto-rico), or [book a call with Reza](@book) to plan a visit.",
        ],
        image: { ref: life.surf, caption: "A surfer on a turquoise wave." },
      },
    ],
    ctaAfter: 4,
    faqs: [
      {
        q: "What is the closest beach to Tesoro Del Mar?",
        a: "Balneario Cerro Gordo is within walking distance of Tesoro Del Mar. Residents also have a private beach club reached by the walking path or by golf cart.",
      },
      {
        q: "Is there golf in Dorado?",
        a: "Yes. Dorado is known for championship golf with lessons from PGA professionals, and Tesoro Del Mar has its own 18-hole putting course and golf simulator.",
      },
      {
        q: "What water activities are there near Dorado?",
        a: "Snorkeling and diving with certified guides, yacht charters and sunset cruises, kayaking and paddleboarding, surfing and kiteboarding, deep-sea fishing and eco-friendly boat tours.",
      },
      {
        q: "Can I visit El Yunque from Dorado?",
        a: "Yes. El Yunque National Forest, with its trails and hidden waterfalls, makes a memorable day trip from Dorado.",
      },
      {
        q: "How far is Old San Juan?",
        a: "Old San Juan makes an easy day out from Dorado; San Juan's international airport is about 30 minutes from Tesoro Del Mar.",
      },
      {
        q: "Are there nature trails near Tesoro Del Mar?",
        a: "Yes. A national park sits beside Tesoro Del Mar with scenic jogging and walking paths, and the community has its own two-mile walking path through landscaped gardens.",
      },
    ],
  },
  /* ------------------------------------------------------------------ 6 · Moving checklist (TTR-2596) */
  {
    slug: "moving-to-puerto-rico-checklist",
    seo: {
      query: "moving to Puerto Rico from the US checklist",
      secondary: ["do I need a passport to go to Puerto Rico", "shipping a car to Puerto Rico", "Puerto Rico driver's license transfer", "how to move to Puerto Rico"],
      why: "Planning query from people at the start of a move. Page one is relocation blogs and moving companies; few pages bring the official steps (CBP, TSA, CESCO, Hacienda, LUMA, AAA, Medicare) together in one plain checklist. It brings researchers who are serious about living on the island to ORA World early.",
    },
    metaTitle: "Moving to Puerto Rico from the US: A Practical Checklist",
    metaDescription:
      "Moving to Puerto Rico from the mainland: no passport, flights from Miami and New York, shipping a car, your license, banking, utilities, healthcare and buying a home.",
    eyebrow: "Relocation guide · Puerto Rico",
    title: "Moving to Puerto Rico from the mainland US: a practical checklist",
    deck: "Flights, your car, your license, the bank, the power and water accounts, Medicare and the home itself. The official steps, in plain words and in the order you will need them.",
    hero: tdm.exteriorRoad,
    cardTitle: "Moving to Puerto Rico: a practical checklist",
    facts: [
      { value: "No passport", label: "Needed by US citizens on a direct flight from the mainland" },
      { value: "30 min", label: "From San Juan's airport to Tesoro Del Mar, about" },
      { value: "30 days", label: "Oldest your state driving record can be for a Puerto Rico license" },
      { value: "Part B", label: "Medicare you must sign up for yourself in Puerto Rico" },
    ],
    lede: "Moving to Puerto Rico feels like moving abroad, but on paper it is closer to moving between states. The trick is knowing which office handles what.",
    answer:
      "US citizens can move to Puerto Rico without a passport or visa, because it is a US territory. The main jobs are shipping and registering your car, swapping your driver's license at CESCO, opening power and water accounts with LUMA and AAA, and signing up for Medicare Part B if you are eligible. Buying a home works through a Puerto Rico notary, who is also a lawyer.",
    sections: [
      {
        id: "passport",
        h2: "Do I need a passport to move to Puerto Rico?",
        body: [
          "No. Puerto Rico is a US territory, so a flight from the mainland is a domestic flight. US Customs and Border Protection explains that travelers coming directly from a US territory are not considered to have left the country. The one catch: if your trip stops at a foreign airport on the way, the passport rules for that country apply.",
          "You still go through TSA screening like any domestic flight. Since May 7, 2025, travelers 18 and over need a REAL ID compliant license (it usually has a star in the top corner) or another accepted ID, such as a passport. Check your license before moving day, because you will want it for flights back and forth until your Puerto Rico license arrives.",
        ],
      },
      {
        id: "flights",
        h2: "How do I fly in from Miami or New York?",
        body: [
          "Luis Muñoz Marín International Airport (SJU) in San Juan is the island's main gateway. JetBlue says it runs daily flights between San Juan and all three New York area airports: JFK, LaGuardia and Newark. American Airlines flies between Miami and San Juan, and also sells flights from New York. The airport's own airline page lists every carrier that serves it.",
          "Schedules change by season, so check the airline before you book. From SJU, Tesoro Del Mar in Dorado is about 30 minutes by car. ORA World also offers owners private charter flights between the United States and their home in Puerto Rico, which is worth asking about if you plan to split the year.",
        ],
      },
      {
        id: "car",
        h2: "How do I ship my car to Puerto Rico?",
        body: [
          "Cars travel by ship, most often from Jacksonville, Florida. TOTE Maritime, Crowley and Trailer Bridge all publish vehicle shipping instructions. Book early in busy months, and remove personal items before drop-off unless the carrier says otherwise.",
          "Many people price the trip against selling the car and buying one on the island. Either way, here is what shipping looks like:",
        ],
        steps: [
          { title: "Gather the papers", text: "Your title, front and back, and your registration. If the car is financed, you need a written authorization from your lender. TOTE's Jacksonville packet lists the exact documents." },
          { title: "Drop it at the port", text: "The carrier gives you a bill of lading. Keep the original, because you will need it in San Juan." },
          { title: "Clear it with Hacienda", text: "Puerto Rico's Treasury (Hacienda) inspects the car and assesses the excise tax, called arbitrios. You pay it online in SURI, Hacienda's portal, which also has an estimator by VIN or by make, model and year." },
          { title: "Pick it up", text: "The car stays at the port until the arbitrios are paid. Then you are ready to register it." },
        ],
      },
      {
        id: "register",
        h2: "How do I register my car once it arrives?",
        body: [
          "Registration runs through DTOP, the Department of Transportation and Public Works, and its CESCO offices. You will receive a Puerto Rico plate and a marbete, the yearly registration tag. Under the digital marbete program, vehicles more than two years past their manufacture date must pass an inspection.",
          "DTOP does not publish a single checklist for imported cars, so call or visit CESCO first and bring your title, the Hacienda payment receipt, the bill of lading and your ID. Your mainland plates only cover you for a limited time once you live on the island, so put this near the top of your list.",
        ],
        image: { ref: tdm.entrance, caption: "The arrival drive and canopy entrance at Tesoro Del Mar. Artist rendering." },
      },
      {
        id: "license",
        h2: "How do I switch my driver's license?",
        body: [
          "Puerto Rico gives full reciprocity to licenses from US states and territories. If yours is valid, you swap it at CESCO without a written or road test. CESCO keeps your state license when it issues the new one.",
          "Ask CESCO how long you may drive on your state license after you become a resident, because the official form does not say. Then bring:",
        ],
        list: [
          "Your valid state license and form DTOP-DIS-257, the reciprocity application",
          "A driving record from your home state, issued no more than 30 days before your visit",
          "A medical certificate (form DTOP-DIS-260) signed by a doctor authorized in Puerto Rico",
          "Photo ID, your Social Security number and an original birth certificate or passport",
          "Recent proof of your Puerto Rico address, and the fees",
        ],
      },
      {
        id: "banking",
        h2: "Can I keep my bank, and how does mail work?",
        body: [
          "Yes. Puerto Rico uses the US dollar, and the FDIC's deposit insurance works the same way at insured banks in Puerto Rico as on the mainland. Many people keep their mainland accounts and open a local one for utilities and day-to-day bills.",
          "The US Postal Service delivers across the island, and Puerto Rico ZIP codes start with 006 to 009. One local habit: many addresses include an urbanization name (URB), because the same street name can appear more than once in a ZIP code. Use it on every form. Tesoro Del Mar's address is in Dorado, Vega Alta, PR 00692.",
        ],
        image: { ref: tdm.aptStudy, caption: "A study with built-in shelving in a Tesoro Del Mar residence. Artist rendering." },
      },
      {
        id: "utilities",
        h2: "How do I set up power, water and internet?",
        body: [
          "Electricity is delivered by LUMA Energy. To open a home account, LUMA asks for a government photo ID, your Social Security number, an electrical installation certification, a use permit for the property and proof you can live there, such as a deed, lease or purchase contract. You can apply online through Mi LUMA.",
          "Water comes from the Puerto Rico Aqueduct and Sewer Authority, known as AAA or PRASA. For new service, AAA asks for your details, the use permit, proof of your right to the property and a deposit, and you can request it online through MiAcueductos. In a new building, the developer or the association usually handles the permits, so ask which papers they will give you at closing.",
          "For internet, ask your building which cable, fiber and wireless providers are already wired in. If you work from home, that answer matters as much as the view.",
        ],
      },
      {
        id: "healthcare",
        h2: "What about healthcare and Medicare?",
        body: [
          "Medicare covers people in Puerto Rico. There is one important difference: Part A starts automatically for eligible people, but in Puerto Rico you must sign up for Part B yourself. The Social Security Administration warns that missing it can mean a late penalty for as long as you have Part B. Puerto Rico residents also cannot buy plans on the ACA Marketplace, so plan your coverage before you move.",
          "Dorado is within driving distance of San Juan and its hospitals. Veterans are served by the VA Caribbean Healthcare System, whose San Juan VA Medical Center has an emergency room open 24/7. Before you go, ask your current doctors for copies of your records and prescriptions, and check which local doctors and hospitals your plan includes.",
        ],
      },
      {
        id: "buying",
        h2: "How does buying a home work in Puerto Rico?",
        body: [
          "Buying property works much as it does on the mainland, with a few local steps. The deed is signed before a Puerto Rico notary. Unlike a mainland notary public, a notary here is a lawyer with a public role, and the deed must carry the property's cadastre number. The deed is then recorded in the Property Registry, part of the Puerto Rico Department of Justice. Yearly property tax is managed by CRIM, the municipal revenue center.",
          "If you are looking at a new building, the order of steps is different again. At Tesoro Del Mar, this is a solicitation of interest only: no offering can be made and no deposits or reservations can be accepted until an offering plan is filed with the New York State Department of Law. Our guide to [buying a pre-construction condo](/guides/buying-pre-construction-condo-puerto-rico) walks through it step by step.",
          "Start by comparing the [residences](/residences) and the Phase 1 [floor plans](/b/floor-plans), and read about [daily life at Tesoro Del Mar](/b/living). For the island's tax incentive program, see our [Act 60 page](/b/act-60).",
        ],
        image: { ref: tdm.kitchenDining, caption: "An open kitchen and dining room in a Tesoro Del Mar residence. Artist rendering." },
      },
      {
        id: "checklist",
        h2: "What goes on my moving checklist?",
        body: ["Print this, or save it to your phone. Most people work through it over two or three months:"],
        list: [
          "Check that your license is REAL ID compliant, or carry your passport",
          "Book flights and compare nonstop options from Miami and New York",
          "Decide whether to ship your car or buy on the island, and book the carrier",
          "Get a lender letter if the car is financed, and keep the bill of lading",
          "Pay the arbitrios in SURI, then register the car and get your marbete",
          "Order your state driving record within 30 days of your CESCO visit",
          "Get the DTOP-DIS-260 medical certificate and swap your license",
          "Open LUMA and AAA accounts, and line up internet",
          "Sign up for Medicare Part B if you are eligible, and transfer your records",
          "Add the urbanization name to your new address everywhere",
          "Read up on storm season, which runs June 1 to November 30, in our guide to [hurricane-ready homes](/guides/hurricane-ready-homes-puerto-rico)",
        ],
      },
      {
        id: "talk-to-ora",
        h2: "Talk to ORA World",
        body: [
          "If Dorado is on your list, we would love to help you plan. [Send an inquiry](/b#inquire) and ORA World's team will share the brochure and the Phase 1 floor plans, or [plan a visit](/visit) to see the coast for yourself. You can also [book a call with Reza](@book), ORA World's agent, to talk through your timing.",
        ],
      },
    ],
    ctaAfter: 5,
    faqs: [
      {
        q: "Do I need a passport to fly to Puerto Rico?",
        a: "No, not as a US citizen flying directly from the mainland. Puerto Rico is a US territory, so it is a domestic flight. You need a REAL ID compliant license or another accepted ID, such as a passport, to pass TSA screening. If your trip stops in a foreign country, that country's passport rules apply.",
      },
      {
        q: "Which airlines fly nonstop to San Juan from Miami and New York?",
        a: "JetBlue says it flies daily between San Juan and JFK, LaGuardia and Newark, and American Airlines flies between Miami and San Juan. Routes change by season, so check the airline and the San Juan airport's airline page before you book.",
      },
      {
        q: "How do I bring my car to Puerto Rico?",
        a: "Ship it with an ocean carrier, most often from Jacksonville. Bring your title and registration, plus a lender authorization if the car is financed. In San Juan, Hacienda assesses the excise tax (arbitrios), which you pay online in SURI before the car leaves the port. Then you register it with DTOP through CESCO.",
      },
      {
        q: "Can I use my state driver's license in Puerto Rico?",
        a: "Puerto Rico gives full reciprocity to licenses from US states, so you can swap a valid license at CESCO without a test. You need a medical certificate, a driving record from your home state no older than 30 days, proof of address and ID. Ask CESCO how long you may drive on your state license after you become a resident.",
      },
      {
        q: "Does Medicare work in Puerto Rico?",
        a: "Yes. Part A starts automatically for eligible people, but in Puerto Rico you must sign up for Part B yourself, or you may face a late penalty. Puerto Rico residents cannot use the ACA Marketplace.",
      },
      {
        q: "Who handles electricity and water?",
        a: "LUMA Energy delivers electricity and the Puerto Rico Aqueduct and Sewer Authority (AAA) provides water. Both let you request new service online, with ID, a use permit for the property and proof you can live there.",
      },
      {
        q: "Can I reserve a residence at Tesoro Del Mar now?",
        a: "Not yet. This is a solicitation of interest: no offering can be made and no deposits or reservations can be accepted until an offering plan is filed with the New York State Department of Law. You can inquire now to receive the brochure and the Phase 1 floor plans.",
      },
    ],
    sources: [
      { label: "USA.gov: Travel to US territories", href: "https://www.usa.gov/visit-territories" },
      { label: "US Customs and Border Protection: Western Hemisphere Travel Initiative FAQs", href: "https://www.cbp.gov/travel/us-citizens/western-hemisphere-travel-initiative/faqs" },
      { label: "TSA: Acceptable identification at the checkpoint", href: "https://www.tsa.gov/travel/security-screening/identification" },
      { label: "TSA: REAL ID enforcement continues (May 21, 2025)", href: "https://www.tsa.gov/news/press/releases/2025/05/21/tsa-reminds-public-real-id-enforcement-continues" },
      { label: "Luis Muñoz Marín International Airport: Airlines", href: "https://aeropuertosju.com/en/airlines/" },
      { label: "JetBlue: Flights to San Juan", href: "https://www.jetblue.com/en/flights-to-san-juan" },
      { label: "American Airlines: Flights to San Juan", href: "https://www.aa.com/en-us/flights-to-san-juan" },
      { label: "TOTE Maritime: Jacksonville to San Juan vehicle packet (PDF)", href: "https://www.totemaritime.com/wp-content/uploads/JAX-SJU-VEHICLE-PACKET-ENGLISH-APRIL-2026.pdf" },
      { label: "Crowley: Shipping your car to Puerto Rico", href: "https://www.crowley.com/shipping-your-car-to-puerto-rico/" },
      { label: "Puerto Rico Department of the Treasury (Hacienda): SURI", href: "https://suri.hacienda.pr.gov" },
      { label: "DTOP: Digital marbete FAQ", href: "https://www.smarttransportation.pr.gov/faq-marbete-digital" },
      { label: "CESCO: Applications and forms", href: "https://www.cesco.pr.gov/solicitudes-y-formularios" },
      { label: "DTOP-DIS-257: License by reciprocity application (PDF)", href: "https://docs.pr.gov/files/cesco/Solicitud%20de%20Licencias/DTOP-DIS-257%20Solicitud%20para%20%20Certificado%20de%20Licencia%20para%20Conducir%20Vehiculos%20de%20Motor%20POR%20RECIPROCIDAD%20%20Rev.%2017feb2025.pdf" },
      { label: "FDIC: Your insured deposits", href: "https://www.fdic.gov/resources/deposit-insurance/brochures/insured-deposits" },
      { label: "USPS Publication 28: Urbanization", href: "https://pe.usps.com/text/pub28/28c2_042.htm" },
      { label: "LUMA Energy: Request a service", href: "https://lumapr.com/residential/request-a-service/?lang=en" },
      { label: "Puerto Rico Aqueduct and Sewer Authority: MiAcueductos", href: "https://miacueductos.acueductospr.com/register" },
      { label: "Social Security Administration: Medicare in Puerto Rico (PDF)", href: "https://www.ssa.gov/pubs/EN-05-10521.pdf" },
      { label: "CMS: Original Medicare Part A and B enrollment", href: "https://www.cms.gov/medicare/enrollment-renewal/original-part-a-b" },
      { label: "VA Caribbean Healthcare System: San Juan VA Medical Center", href: "https://www.va.gov/caribbean-health-care/locations/san-juan-va-medical-center/" },
      { label: "Puerto Rico Notarial Law, Act 75-1987 (PDF)", href: "https://bvirtualogp.pr.gov/ogp/Bvirtual/leyesreferencia/PDF/75-1987.pdf" },
      { label: "Puerto Rico Department of Justice: Property Registry", href: "https://www.justicia.pr.gov/secretarias-y-oficinas/registro-de-la-propiedad/" },
      { label: "CRIM: Municipal Revenue Collection Center", href: "https://crimpr.net/" },
      { label: "NOAA National Hurricane Center: Tropical cyclone climatology", href: "https://www.nhc.noaa.gov/climo/" },
    ],
  },
  /* ------------------------------------------------------------------ 7 · Hurricane-ready homes (TTR-2596) */
  {
    slug: "hurricane-ready-homes-puerto-rico",
    seo: {
      query: "hurricane proof condos Puerto Rico",
      secondary: ["Puerto Rico building code hurricane", "what to ask a developer about hurricanes", "condo hurricane insurance Puerto Rico", "impact windows Puerto Rico"],
      why: "A worry almost every mainland buyer has, and page one is insurers and news stories. A calm checklist built on FEMA, NOAA and the Puerto Rico building code answers it honestly and shows how Tesoro Del Mar is designed, which builds trust before the first call.",
    },
    metaTitle: "Hurricane-Ready Homes in Puerto Rico: What to Ask a Developer",
    metaDescription:
      "What to ask any new development in Puerto Rico about hurricanes: the building code, wind design, impact glass, backup power and water, flood zones and insurance.",
    eyebrow: "Buyer's guide · Puerto Rico",
    title: "Hurricane-ready homes in Puerto Rico: what to ask any new development",
    deck: "The building code, the wind design, the windows, the power and water plan, the flood map and the insurance. The questions that tell you how a new building is made for the coast.",
    hero: tdm.aerialVillas,
    cardTitle: "Hurricane-ready homes: what to ask a developer",
    facts: [
      { value: "2018", label: "Puerto Rico Building Code, based on the 2018 International Codes" },
      { value: "157 mph+", label: "Sustained winds of a Category 5 hurricane" },
      { value: "Jun 1 to Nov 30", label: "The Atlantic hurricane season" },
      { value: "30 days", label: "The usual wait before a new flood policy starts" },
    ],
    lede: "Every home on a Caribbean coast should be built for storms. The difference between buildings is in the details, and the details are easy to ask about.",
    answer:
      "A new building in Puerto Rico should be designed to the 2018 Puerto Rico Building Code, with impact-rated windows and doors, backup power and water for the systems that matter, and a site that sits above the flood map. Ask every developer for the design wind speed, the window product approvals, the generator and water plan, the flood zone, and what the association's insurance covers.",
    sections: [
      {
        id: "building-code",
        h2: "What building code applies to new homes in Puerto Rico?",
        body: [
          "After Hurricanes Irma and Maria, Puerto Rico adopted a new building code. The Puerto Rico Building Code 2018 took effect on November 15, 2018. It is based on the 2018 International Codes, with local changes, and it applies in all 78 municipalities. FEMA helped Puerto Rico's Office of Permit Management (OGPe) develop it, and the code points to the ASCE 7-16 standard for wind loads. The law asks for the code to be reviewed at least every three years.",
          "The first question for any developer is simple: which code edition was the building permitted under? A building permitted under the current code was designed for today's wind, flood and earthquake rules.",
        ],
      },
      {
        id: "wind",
        h2: "What wind speed is the building designed for?",
        body: [
          "Puerto Rico's code includes its own microzone wind maps. They account for the way the island's hills and mountains speed up the wind, and FEMA notes there are 316 of them, municipality by municipality. The design wind speed also depends on the building's risk category, so two buildings in the same town can have different numbers.",
          "Don't compare a code number straight to a hurricane category. The Saffir-Simpson scale used by the National Hurricane Center rates storms by one-minute sustained winds, with Category 5 starting at 157 mph. Building codes use a different measure, a three-second gust. That is why the best question is a specific one: what is the design wind speed and risk category, and who is the structural engineer of record?",
        ],
        quote: { text: "Structures engineered to withstand Category 5 hurricanes.", cite: "ORA World, Resilient by Design" },
      },
      {
        id: "windows",
        h2: "Are the windows and doors impact-rated?",
        body: [
          "FEMA lists Puerto Rico as a hurricane-prone region. In wind-borne debris areas, the code requires glazing that is impact-resistant or protected by an impact-resistant covering. Approved products carry a permanent label naming the manufacturer, the product, its performance and the agency that approved it. Testing follows the large-missile standards ASTM E1886 and E1996, and FEMA points buyers to the Miami-Dade and Florida product approval programs.",
          "Ask to see the product approvals for the windows and for the balcony doors, which are often the largest openings in the home. Ask, too, who maintains the seals and frames over time. At Tesoro Del Mar, ORA World's published materials describe impact-resistant windows and reinforced walls, with floor-to-ceiling glass in the principal rooms.",
        ],
        image: { ref: tdm.penthousePiano, caption: "Floor-to-ceiling glass in a Tesoro Del Mar penthouse. Artist rendering." },
      },
      {
        id: "power",
        h2: "What keeps the lights on after a storm?",
        body: [
          "Hurricane Maria showed why this matters. FEMA reports that about 80 percent of Puerto Rico's residents lost power and water. Ninety days later, power was back for 65 percent of customers, and the US Department of Energy notes that some residents went almost a year without electricity.",
          "So ask exactly what the backup power covers. Is it the common areas only, or the residences too? Does it run the elevators and the water pumps? How much fuel is stored on site, and for how many days? Is the equipment placed above flood level? ORA World's published plans for its developments, Tesoro Del Mar included, list high-capacity generators, plus solar panels and battery storage for backup energy.",
        ],
      },
      {
        id: "water",
        h2: "Will there be water if the mains go down?",
        body: [
          "After Maria, FEMA reports that water service was 69 percent operational at 30 days. Ready.gov advises storing at least one gallon of water per person per day for several days, with at least three days in your home kit.",
          "In a tower, water reaches the upper floors by pumps, so water and power go together. Ask whether the building has water storage, how much, and whether the pumps run on backup power. ORA World's published materials do not detail water storage at Tesoro Del Mar yet, so this is a good question to put to Reza, ORA World's agent.",
        ],
      },
      {
        id: "flood",
        h2: "Is the site high enough, and how does it drain?",
        body: [
          "Start with the flood map. FEMA's Flood Map Service Center shows the official flood zones. After Maria, FEMA also produced Advisory Base Flood Elevation maps, which Puerto Rico's Planning Board adopted in March 2018 as the best available data. The Planning Board's flood zone rule, Regulation 13, uses both. For storm surge, the National Hurricane Center publishes surge risk maps that include Puerto Rico.",
          "Then ask the developer: which flood zone is the site in, how high is the lowest floor, and where do the electrical and mechanical rooms sit? ORA World's published plans list elevated foundations, landscape grading to prevent flooding, advanced drainage and stormwater management to reduce runoff.",
        ],
        image: { ref: tdm.aerialForest, caption: "Tesoro Del Mar rising from the forest canopy near the coast. Artist rendering." },
      },
      {
        id: "insurance",
        h2: "What should I ask about insurance?",
        body: [
          "Flood is not part of a standard homeowners policy. FEMA's National Flood Insurance Program covers all of Puerto Rico, and policies can be bought online through FloodSmart. There is usually a 30-day wait before a new flood policy starts, so don't leave it until a storm is on the map.",
          "In a condo, the association insures the building, and you insure your own unit. Under the flood program, the association's policy covers the building, and owners can add their own policy for contents. Windstorm deductibles are often a percentage of the insured value rather than a set amount, so read the declarations page closely. Ask the association:",
        ],
        list: [
          "What does the master policy cover, and where does my unit coverage begin?",
          "What is the windstorm deductible, and how would it be shared among owners?",
          "Does the association carry flood insurance for the building?",
          "What should my own policy cover for contents and improvements?",
        ],
      },
      {
        id: "storm-day",
        h2: "Where do I go on storm day, and what about earthquakes?",
        body: [
          "For the strongest protection, FEMA's safe room guides (FEMA P-320 and P-361) and the ICC 500 standard set the bar. If a developer offers safe rooms, ask which standard they are built to. Ask, too, about the plan: who stays on site, how residents are told what to do, and where supplies are kept.",
          "Puerto Rico also sits in an earthquake zone. In January 2020, the USGS recorded a magnitude 6.4 earthquake in the island's southwest. Ask how the structure was designed for seismic loads, not only for wind.",
        ],
      },
      {
        id: "tesoro-del-mar",
        h2: "What do Tesoro Del Mar's own documents say?",
        body: [
          "ORA World publishes its approach under the name Resilient by Design. Here is what its published materials state about how it builds, Tesoro Del Mar included, in its own words where possible. Use this list as a starting point, and ask for the engineering documents behind it as the project moves forward.",
        ],
        list: [
          "Structures engineered to withstand Category 5 hurricanes",
          "Impact-resistant windows, reinforced walls and advanced drainage systems",
          "Seismic engineering, with materials and methods that exceed local building codes for seismic zones",
          "High-capacity generators, plus solar panels and battery storage",
          "Elevated foundations, landscape grading and stormwater management",
          "Reinforced safe rooms in the residences",
          "On-site emergency shelters with supplies, clear evacuation routes and communication systems",
          "Professional security teams on site 24/7, and resilience training for residents",
        ],
      },
      {
        id: "checklist",
        h2: "What should I ask on a site visit?",
        body: ["Take this list to any new development in Puerto Rico. A good developer will be glad you asked:"],
        list: [
          "Which building code edition was the project permitted under?",
          "What are the design wind speed and risk category?",
          "May I see the product approvals for the windows and balcony doors?",
          "What does backup power run, and for how many days?",
          "Is there water storage, and do the pumps run on backup power?",
          "Which flood zone is the site in, and how high is the lowest floor?",
          "What does the master insurance policy cover, and what is the deductible?",
          "Is there a safe room or shelter, and which standard is it built to?",
        ],
      },
      {
        id: "talk-to-ora",
        h2: "Talk to ORA World",
        body: [
          "Want to go through these questions for Tesoro Del Mar? [Send an inquiry](/b#inquire) and ORA World's team will share the brochure, or [plan a visit](/visit) to walk the site in Dorado. You can also [book a call with Reza](@book), ORA World's agent.",
          "Compare the [residences](/residences) and the Phase 1 [floor plans](/b/floor-plans), see [daily life at Tesoro Del Mar](/b/living), and read our guide to [oceanfront condos in Dorado](/guides/oceanfront-condos-dorado-puerto-rico). Planning a full move? Start with our [moving checklist](/guides/moving-to-puerto-rico-checklist) and the [Act 60 page](/b/act-60).",
        ],
      },
    ],
    ctaAfter: 5,
    faqs: [
      {
        q: "What building code is used in Puerto Rico?",
        a: "The Puerto Rico Building Code 2018, which took effect on November 15, 2018. It is based on the 2018 International Codes with local changes, applies in all 78 municipalities and points to the ASCE 7-16 standard for wind loads.",
      },
      {
        q: "Is a Category 5 hurricane the same as a building's wind rating?",
        a: "No. The Saffir-Simpson scale rates storms by one-minute sustained winds, with Category 5 starting at 157 mph. Building codes use a three-second gust and set the design speed by location and risk category. Ask the developer for the design wind speed and the engineer of record.",
      },
      {
        q: "Do new homes in Puerto Rico need impact windows?",
        a: "Puerto Rico is a hurricane-prone region. In wind-borne debris areas the code requires glazing that is impact-resistant or protected by an impact-resistant covering, tested to ASTM E1886 and E1996 and labeled with its approval.",
      },
      {
        q: "Can I get flood insurance in Puerto Rico?",
        a: "Yes. FEMA's National Flood Insurance Program covers all of Puerto Rico, and policies can be bought online through FloodSmart. A new policy usually has a 30-day waiting period before it starts.",
      },
      {
        q: "How is Tesoro Del Mar designed for hurricanes?",
        a: "ORA World states that its structures are engineered to withstand Category 5 hurricanes, with impact-resistant windows, reinforced walls and advanced drainage. Its published plans include high-capacity generators with solar and battery storage, elevated foundations, stormwater management and reinforced safe rooms in the residences.",
      },
      {
        q: "When is hurricane season in Puerto Rico?",
        a: "The Atlantic hurricane season runs from June 1 to November 30, according to NOAA.",
      },
      {
        q: "Can I reserve a residence at Tesoro Del Mar now?",
        a: "Not yet. This is a solicitation of interest: no offering can be made and no deposits or reservations can be accepted until an offering plan is filed with the New York State Department of Law. You can inquire now to receive the brochure and the Phase 1 floor plans.",
      },
    ],
    sources: [
      { label: "FEMA: New building codes support Puerto Rico in building back stronger", href: "https://www.fema.gov/print/pdf/node/342028" },
      { label: "Puerto Rico Act 109-2018 (PDF)", href: "https://bvirtualogp.pr.gov/ogp/Bvirtual/leyesreferencia/PDF/2-ingles/0109-2018.pdf" },
      { label: "FEMA: 2018 IBC wind-resistant provisions (PDF)", href: "https://www.fema.gov/sites/default/files/2020-07/2018-ibc-compliation-wind-resistant-provisions.pdf" },
      { label: "Puerto Rico Building Code 2018, Appendix P: Microzone wind maps", href: "https://up.codes/viewer/puerto_rico/ibc-2018/chapter/new_P/microzone-wind-maps-for-puerto-rico" },
      { label: "FEMA P-2020: Mitigation Assessment Team report, Hurricanes Irma and Maria in Puerto Rico (PDF)", href: "https://www.fema.gov/sites/default/files/2020-07/mat-report_hurricane-irma-maria-puerto-rico_2.pdf" },
      { label: "National Hurricane Center: Saffir-Simpson Hurricane Wind Scale", href: "https://www.nhc.noaa.gov/aboutsshws.php" },
      { label: "FEMA glossary: Hurricane-prone region", href: "https://www.fema.gov/about/glossary/hurricane-prone-region" },
      { label: "FEMA: 2021 IBC wind-resistant provisions (PDF)", href: "https://www.fema.gov/sites/default/files/documents/fema_international-building-code_10152021.pdf" },
      { label: "FEMA: Hurricane Maria, one year later", href: "https://www.fema.gov/print/txt/node/335544" },
      { label: "US Department of Energy: 2023 year in review, Puerto Rico's grid", href: "https://www.energy.gov/articles/2023-year-review-advancing-puerto-ricos-grid-recovery-and-modernization" },
      { label: "Ready.gov: Water", href: "https://www.ready.gov/water" },
      { label: "FEMA Flood Map Service Center", href: "https://msc.fema.gov/portal/home" },
      { label: "Puerto Rico Planning Board: Flood maps portal", href: "https://portaldeinundacion.jp.pr.gov/mapas/mapas-interactivos-jp/" },
      { label: "Puerto Rico Planning Board: Regulation 13, eighth revision (PDF)", href: "https://jp.pr.gov/wp-content/uploads/2021/06/Reglamento-Num-13-Octava-Revision-Vigencia-9-Enero-2021-1.pdf" },
      { label: "National Hurricane Center: National Storm Surge Risk Maps", href: "https://www.nhc.noaa.gov/nationalsurge/" },
      { label: "FEMA Community Status Book: Puerto Rico", href: "https://www.fema.gov/cis/PR.html" },
      { label: "FEMA: Waiting period for a flood policy", href: "https://www.fema.gov/fema-common-faq/waiting-period-activating-flood-policy" },
      { label: "FEMA: Flood insurance forms and underwriting", href: "https://www.fema.gov/flood-insurance/find-form/underwriting" },
      { label: "FEMA: Safe rooms", href: "https://www.fema.gov/emergency-managers/risk-management/building-science/safe-rooms" },
      { label: "USGS: Magnitude 6.4 earthquake in Puerto Rico", href: "https://www.usgs.gov/news/featured-story/magnitude-64-earthquake-puerto-rico" },
      { label: "NOAA: Tropical cyclone climatology", href: "https://www.noaa.gov/tropical-cyclone-climatology" },
    ],
  },
];

export const getGuide = (slug: string) => guides.find((g) => g.slug === slug);
