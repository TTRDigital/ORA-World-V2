import { defineField, defineType } from "sanity";

export const stat = defineType({
  name: "stat",
  title: "Stat",
  type: "object",
  fields: [
    defineField({ name: "value", title: "Value (leave empty for To be confirmed)", type: "number" }),
    defineField({ name: "prefix", title: "Prefix", type: "string" }),
    defineField({ name: "suffix", title: "Suffix", type: "string" }),
    defineField({ name: "label", title: "Label", type: "localeString", validation: (r) => r.required() }),
  ],
  preview: { select: { title: "label.en", subtitle: "value" } },
});

export const hotspot = defineType({
  name: "hotspot",
  title: "Hotspot",
  type: "object",
  fields: [
    defineField({ name: "x", title: "X (%)", type: "number", validation: (r) => r.required().min(0).max(100) }),
    defineField({ name: "y", title: "Y (%)", type: "number", validation: (r) => r.required().min(0).max(100) }),
    defineField({ name: "title", title: "Title", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "text", title: "Text (published facts only)", type: "localeText", validation: (r) => r.required() }),
  ],
  preview: { select: { title: "title.en" } },
});

export const room = defineType({
  name: "room",
  title: "Room",
  type: "object",
  fields: [
    defineField({ name: "slug", title: "Key", type: "string", validation: (r) => r.required() }),
    defineField({ name: "name", title: "Name", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "image", title: "Render", type: "figure" }),
    defineField({ name: "hotspots", title: "Hotspots", type: "array", of: [{ type: "hotspot" }] }),
  ],
  preview: { select: { title: "name.en", media: "image" } },
});

export const factRow = defineType({
  name: "factRow",
  title: "Fact",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Label", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "value", title: "Value (empty = To be confirmed)", type: "localeString" }),
    defineField({ name: "confirmed", title: "Published by the client", type: "boolean", initialValue: true }),
  ],
  preview: { select: { title: "label.en", subtitle: "value.en" } },
});

export const section = defineType({
  name: "section",
  title: "Section",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Title", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "body", title: "Body", type: "localeParagraphs", validation: (r) => r.required() }),
    defineField({ name: "image", title: "Image", type: "figure" }),
  ],
  preview: { select: { title: "title.en", media: "image" } },
});

export const islandPlace = defineType({
  name: "islandPlace",
  title: "Island place",
  type: "object",
  fields: [
    defineField({ name: "slug", title: "Key", type: "string", validation: (r) => r.required() }),
    defineField({ name: "name", title: "Name", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "text", title: "Text", type: "localeText", validation: (r) => r.required() }),
    defineField({ name: "image", title: "Image", type: "figure" }),
    defineField({ name: "poi", title: "Point of interest slug", type: "string" }),
  ],
  preview: { select: { title: "name.en", media: "image" } },
});
