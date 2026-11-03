import { defineField, defineType } from "sanity";

const langs = [
  { id: "en", title: "English" },
  { id: "es", title: "Español" },
];

/** { en, es } string. Both languages required so no page ever shows an empty field. */
export const localeString = defineType({
  name: "localeString",
  title: "Localized text",
  type: "object",
  options: { collapsible: false },
  fields: langs.map((l) => defineField({ name: l.id, title: l.title, type: "string", validation: (r) => r.required() })),
});

export const localeText = defineType({
  name: "localeText",
  title: "Localized paragraph",
  type: "object",
  fields: langs.map((l) => defineField({ name: l.id, title: l.title, type: "text", rows: 4, validation: (r) => r.required() })),
});

export const localeParagraphs = defineType({
  name: "localeParagraphs",
  title: "Localized paragraphs",
  type: "object",
  fields: langs.map((l) =>
    defineField({ name: l.id, title: l.title, type: "array", of: [{ type: "text", rows: 4 }], validation: (r) => r.required().min(1) }),
  ),
});
