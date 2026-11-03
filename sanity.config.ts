"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { presentationTool } from "sanity/presentation";
import { schemaTypes } from "./src/sanity/schemas";
import { structure } from "./src/sanity/structure";
import { apiVersion, dataset, projectId, studioBasePath } from "./src/sanity/env";

const SINGLETONS = new Set(["siteSettings", "homePage"]);

export default defineConfig({
  name: "ora-world-v2",
  title: "ORA World v2",
  projectId: projectId || "placeholder",
  dataset,
  basePath: studioBasePath,
  plugins: [
    structureTool({ structure }),
    presentationTool({ previewUrl: { previewMode: { enable: "/api/draft-mode/enable" } } }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter((t) => !SINGLETONS.has(t.schemaType)),
  },
  document: {
    actions: (input, context) =>
      SINGLETONS.has(context.schemaType)
        ? input.filter(({ action }) => action && ["publish", "discardChanges", "restore"].includes(action))
        : input,
  },
});
