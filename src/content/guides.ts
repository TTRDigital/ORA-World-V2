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
  sections: GuideSection[];
  /** The mid-page call band appears after this many sections. */
  ctaAfter: number;
  faqs: { q: string; a: string }[];
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
      "What living in Dorado, Puerto Rico is like: beaches, nature, getting around, family life, working from home and weekends on the island, from Tesoro Del Mar.",
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
        id: "families-and-pets",
        h2: "Families, and the whole household",
        body: [
          "Tesoro Del Mar was designed with children in mind: playgrounds, children's play areas and a teen lounge sit within the community, along with tennis, a half basketball court and beach volleyball for every age.",
          "Pets are part of the plan too. ORA World's communities are designed around “Happy Homes for All”: secure dog parks, grooming stations, daycare, open play areas, on-demand veterinary care and pet-friendly events.",
        ],
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
        q: "Is Tesoro Del Mar family and pet friendly?",
        a: "Yes. There are playgrounds, children's play areas and a teen lounge, and ORA World's communities include secure dog parks, grooming stations, pet daycare and on-demand veterinary care.",
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
        a: "Fifteen layouts across 60 residences on floors 5 to 18 of Tower 1, from one bedroom with a den to a two-level penthouse with a private elevator.",
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
          "Playgrounds, children's play areas and a teen lounge",
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
        ],
        image: { ref: life.surf, caption: "A surfer on a turquoise wave." },
      },
      {
        id: "with-children",
        h2: "With children",
        body: [
          "Families can choose kids' adventure camps, interactive marine encounters, craft workshops with local themes and treasure hunts. At home, playgrounds, children's play areas and a teen lounge are part of the community.",
          "Thinking about staying longer? Read about [living in Dorado](/guides/living-in-dorado-puerto-rico), or [book a call with Reza](@book) to plan a visit.",
        ],
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
];

export const getGuide = (slug: string) => guides.find((g) => g.slug === slug);
