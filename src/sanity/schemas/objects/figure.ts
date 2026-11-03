import { defineField, defineType } from "sanity";

/**
 * Image with required alt text and a required focal point. The hotspot is the focal point; the data layer
 * converts it to CSS object-position so tower tops never crop. "Rendering" adds the legal label, "placeholder"
 * hides the module until real content exists. No LQIP metadata is requested: no blur anywhere.
 */
export const figure = defineType({
  name: "figure",
  title: "Image",
  type: "image",
  options: { hotspot: true, metadata: ["palette"] },
  validation: (r) => r.required().custom((v) => ((v as { hotspot?: unknown })?.hotspot ? true : "Set the focal point (hotspot)")),
  fields: [
    defineField({ name: "alt", title: "Alt text", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "caption", title: "Caption", type: "localeString" }),
    defineField({ name: "rendering", title: "Artist's conceptual rendering", type: "boolean", initialValue: true }),
    defineField({ name: "placeholder", title: "Placeholder image", type: "boolean", initialValue: false, description: "Hidden from the site until replaced." }),
    defineField({ name: "credit", title: "Credit / licence", type: "string" }),
  ],
  preview: { select: { title: "alt.en", media: "asset" } },
});
