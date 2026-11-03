import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("ORA World v2")
    .items([
      S.listItem().title("Site settings").id("siteSettings").child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.listItem().title("Homepage").id("homePage").child(S.document().schemaType("homePage").documentId("homePage")),
      S.divider(),
      S.documentTypeListItem("project").title("Projects"),
      S.documentTypeListItem("collection").title("Collections"),
      S.documentTypeListItem("floorPlan").title("Floor plans"),
      S.documentTypeListItem("portfolioLocation").title("Portfolio"),
      S.divider(),
      S.documentTypeListItem("amenity").title("Amenities"),
      S.documentTypeListItem("activity").title("Activities"),
      S.documentTypeListItem("galleryImage").title("Gallery"),
      S.documentTypeListItem("pointOfInterest").title("Points of interest"),
      S.divider(),
      S.documentTypeListItem("incentive").title("Act 60 sections"),
      S.documentTypeListItem("investmentStep").title("Deposit steps"),
      S.documentTypeListItem("faq").title("FAQ"),
      S.documentTypeListItem("pressArticle").title("Press"),
      S.documentTypeListItem("teamMember").title("Team"),
      S.documentTypeListItem("page").title("Pages"),
      S.documentTypeListItem("redirect").title("Redirects"),
      S.divider(),
      S.documentTypeListItem("lead").title("Leads (read-only)"),
    ]);
