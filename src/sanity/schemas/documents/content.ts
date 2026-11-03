import { defineField, defineType } from "sanity";

const L = (name: string, title: string, required = true) =>
  defineField({ name, title, type: "localeString", validation: required ? (r) => r.required() : undefined });
const P = (name: string, title: string) => defineField({ name, title, type: "localeParagraphs", validation: (r) => r.required() });
const slug = defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name.en" }, validation: (r) => r.required() });
const img = (name: string, title: string, required = true) =>
  defineField({ name, title, type: "figure", validation: required ? (r) => r.required() : undefined });

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    L("name", "Name"),
    slug,
    defineField({ name: "flagship", title: "Flagship", type: "boolean", initialValue: false }),
    L("tagline", "Tagline (verbatim from the client)"),
    L("location", "Location"),
    defineField({ name: "lat", type: "number", title: "Latitude" }),
    defineField({ name: "lng", type: "number", title: "Longitude" }),
    P("summary", "Summary"),
    defineField({ name: "facts", title: "Facts", type: "array", of: [{ type: "factRow" }] }),
    defineField({ name: "sections", title: "Sections", type: "array", of: [{ type: "section" }] }),
    img("hero", "Hero render"),
    defineField({ name: "gallery", title: "Gallery", type: "array", of: [{ type: "figure" }] }),
  ],
  preview: { select: { title: "name.en", media: "hero" } },
});

export const collection = defineType({
  name: "collection",
  title: "Collection",
  type: "document",
  fields: [
    L("name", "Name"),
    slug,
    L("tagline", "Tagline"),
    P("description", "Description"),
    defineField({ name: "bedrooms", title: "Bedrooms (empty = To be confirmed)", type: "string" }),
    defineField({ name: "sizeRange", title: "Size range", type: "string" }),
    defineField({ name: "fromPrice", title: "From price (USD)", type: "number" }),
    img("image", "Render"),
    defineField({ name: "gallery", title: "Gallery", type: "array", of: [{ type: "figure" }] }),
    defineField({ name: "features", title: "Three features", type: "array", of: [{ type: "localeString" }] }),
    defineField({ name: "finishes", title: "Finishes", type: "array", of: [{ type: "object", fields: [L("group", "Group"), { name: "items", type: "array", of: [{ type: "localeString" }] }] }] }),
    defineField({ name: "specs", title: "Specs", type: "array", of: [{ type: "factRow" }] }),
    defineField({ name: "bands", title: "Tower bands (0 = top)", type: "array", of: [{ type: "number" }] }),
    defineField({ name: "views", title: "Views", type: "array", of: [{ type: "string" }], options: { list: ["ocean", "garden", "mountain"] } }),
    defineField({ name: "bedroomOptions", title: "Bedroom options", type: "array", of: [{ type: "number" }] }),
  ],
  preview: { select: { title: "name.en", media: "image" } },
});

export const floorPlan = defineType({
  name: "floorPlan",
  title: "Floor plan",
  type: "document",
  fields: [
    L("name", "Name"),
    slug,
    defineField({ name: "collection", title: "Collection slug", type: "string", validation: (r) => r.required() }),
    defineField({ name: "bedrooms", type: "number", validation: (r) => r.required() }),
    defineField({ name: "bathrooms", type: "number", validation: (r) => r.required() }),
    defineField({ name: "interiorSqFt", type: "number" }),
    defineField({ name: "exteriorSqFt", type: "number" }),
    defineField({ name: "orientation", type: "string", options: { list: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"] } }),
    L("view", "View"),
    defineField({ name: "building", type: "string" }),
    defineField({ name: "floors", type: "string" }),
    defineField({ name: "status", type: "string", options: { list: ["available", "reserved", "sold"] }, initialValue: "available" }),
    defineField({ name: "fromPrice", type: "number" }),
    img("image", "Plan image"),
    img("keyplan", "Keyplan", false),
    defineField({ name: "keyplanPosition", type: "object", fields: [{ name: "x", type: "number" }, { name: "y", type: "number" }, { name: "w", type: "number" }, { name: "h", type: "number" }] }),
    defineField({ name: "pdf", title: "PDF", type: "file" }),
    defineField({ name: "highlights", type: "array", of: [{ type: "localeString" }] }),
    defineField({ name: "placeholder", title: "Illustrative placeholder", type: "boolean", initialValue: true }),
  ],
  preview: { select: { title: "name.en", subtitle: "collection", media: "image" } },
});

export const amenity = defineType({
  name: "amenity",
  title: "Amenity",
  type: "document",
  fields: [
    L("name", "Name"),
    slug,
    defineField({ name: "category", type: "string", options: { list: ["wellness", "family", "pets", "resort", "eco"] }, validation: (r) => r.required() }),
    defineField({ name: "description", type: "localeText", validation: (r) => r.required() }),
    img("image", "Image"),
    defineField({ name: "featured", type: "boolean", initialValue: false }),
    defineField({ name: "size", type: "string", options: { list: ["lg", "md", "sm"] }, initialValue: "md" }),
  ],
  preview: { select: { title: "name.en", subtitle: "category", media: "image" } },
});

export const activity = defineType({
  name: "activity",
  title: "Activity group",
  type: "document",
  fields: [
    L("group", "Group name"),
    defineField({ name: "slug", type: "slug", options: { source: "group.en" }, validation: (r) => r.required() }),
    img("image", "Image"),
    defineField({ name: "items", type: "array", of: [{ type: "object", fields: [L("name", "Name"), defineField({ name: "description", type: "localeText" })] }] }),
  ],
  preview: { select: { title: "group.en", media: "image" } },
});

export const galleryImage = defineType({
  name: "galleryImage",
  title: "Gallery image",
  type: "document",
  fields: [
    img("image", "Image"),
    defineField({ name: "category", type: "string", options: { list: ["exteriors", "interiors", "amenities", "lifestyle", "dorado-waterfalls"] }, validation: (r) => r.required() }),
    L("caption", "Caption"),
  ],
  preview: { select: { title: "caption.en", subtitle: "category", media: "image" } },
});

export const teamMember = defineType({
  name: "teamMember",
  title: "Team member",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "name" } }),
    L("role", "Role"),
    P("bio", "Bio"),
    img("portrait", "Portrait", false),
    defineField({ name: "website", type: "url" }),
    defineField({ name: "placeholder", title: "Placeholder (hidden on the site)", type: "boolean", initialValue: false }),
  ],
});

export const pointOfInterest = defineType({
  name: "pointOfInterest",
  title: "Point of interest",
  type: "document",
  fields: [
    L("name", "Name"),
    slug,
    defineField({ name: "category", type: "string", options: { list: ["beach", "golf", "school", "healthcare", "airport", "dining", "culture", "nature"] } }),
    defineField({ name: "lat", type: "number", validation: (r) => r.required() }),
    defineField({ name: "lng", type: "number", validation: (r) => r.required() }),
    defineField({ name: "driveMinutes", type: "number" }),
    defineField({ name: "walkMinutes", type: "number" }),
    defineField({ name: "confirmed", title: "Published by the client (otherwise shown as approximate)", type: "boolean", initialValue: false }),
    L("note", "Note", false),
  ],
  preview: { select: { title: "name.en", subtitle: "category" } },
});

export const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  fields: [
    L("question", "Question"),
    defineField({ name: "slug", type: "slug", options: { source: "question.en" }, validation: (r) => r.required() }),
    defineField({ name: "topic", type: "string", options: { list: ["general", "residences", "resilience", "tax", "buying"] }, validation: (r) => r.required() }),
    P("answer", "Answer"),
  ],
  preview: { select: { title: "question.en", subtitle: "topic" } },
});

export const pressArticle = defineType({
  name: "pressArticle",
  title: "Press article",
  type: "document",
  fields: [
    L("title", "Title"),
    defineField({ name: "slug", type: "slug", options: { source: "title.en" }, validation: (r) => r.required() }),
    defineField({ name: "outlet", type: "string", validation: (r) => r.required() }),
    defineField({ name: "date", type: "date", validation: (r) => r.required() }),
    L("excerpt", "Excerpt"),
    P("body", "Body"),
    defineField({ name: "url", type: "url" }),
    img("image", "Image", false),
    defineField({ name: "placeholder", title: "Placeholder (hidden)", type: "boolean", initialValue: false }),
  ],
  preview: { select: { title: "title.en", subtitle: "outlet" } },
});

export const investmentStep = defineType({
  name: "investmentStep",
  title: "Deposit step",
  type: "document",
  fields: [
    defineField({ name: "order", type: "number", validation: (r) => r.required() }),
    L("title", "Title"),
    defineField({ name: "detail", type: "localeText", validation: (r) => r.required() }),
    defineField({ name: "percent", type: "number" }),
    L("when", "When"),
    defineField({ name: "placeholder", type: "boolean", initialValue: true }),
  ],
  preview: { select: { title: "title.en", subtitle: "order" } },
});

export const incentive = defineType({
  name: "incentive",
  title: "Act 60 section",
  type: "document",
  fields: [
    L("title", "Title"),
    defineField({ name: "slug", type: "slug", options: { source: "title.en" }, validation: (r) => r.required() }),
    defineField({ name: "summary", type: "localeText", validation: (r) => r.required() }),
    P("body", "Body"),
    defineField({ name: "tags", type: "array", of: [{ type: "string" }], options: { list: ["relocating", "business", "residence", "general"] } }),
  ],
  preview: { select: { title: "title.en" } },
});

export const portfolioLocation = defineType({
  name: "portfolioLocation",
  title: "Portfolio location",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "name" }, validation: (r) => r.required() }),
    L("tagline", "Tagline (verbatim)"),
    img("image", "Render", false),
    defineField({ name: "href", title: "Internal page path", type: "string" }),
    defineField({ name: "pin", type: "object", fields: [{ name: "x", type: "number" }, { name: "y", type: "number" }, { name: "municipality", type: "string" }] }),
    defineField({ name: "revealed", type: "boolean", initialValue: true }),
    defineField({ name: "order", type: "number" }),
  ],
  preview: { select: { title: "name", subtitle: "tagline.en", media: "image" } },
});

export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    L("title", "Title"),
    defineField({ name: "slug", type: "slug", options: { source: "title.en" }, validation: (r) => r.required() }),
    defineField({ name: "intro", type: "localeText", validation: (r) => r.required() }),
    img("hero", "Hero", false),
    defineField({ name: "sections", type: "array", of: [{ type: "section" }] }),
    L("seoDescription", "SEO description"),
  ],
  preview: { select: { title: "title.en" } },
});

export const lead = defineType({
  name: "lead",
  title: "Lead",
  type: "document",
  readOnly: true,
  fields: [
    defineField({ name: "name", type: "string" }),
    defineField({ name: "email", type: "string" }),
    defineField({ name: "phone", type: "string" }),
    defineField({ name: "role", type: "string" }),
    defineField({ name: "variant", type: "string" }),
    defineField({ name: "message", type: "text" }),
    defineField({ name: "locale", type: "string" }),
    defineField({ name: "page", type: "string" }),
    defineField({ name: "attribution", type: "text" }),
    defineField({ name: "answers", type: "text" }),
    defineField({ name: "submittedAt", type: "datetime" }),
    defineField({ name: "crmStatus", type: "string" }),
  ],
  preview: { select: { title: "name", subtitle: "email" } },
});

export const redirect = defineType({
  name: "redirect",
  title: "Redirect",
  type: "document",
  fields: [
    defineField({ name: "from", type: "string", validation: (r) => r.required() }),
    defineField({ name: "to", type: "string", validation: (r) => r.required() }),
    defineField({ name: "permanent", type: "boolean", initialValue: true }),
  ],
  preview: { select: { title: "from", subtitle: "to" } },
});
