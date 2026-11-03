import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

export const { GET } = defineEnableDraftMode({
  client: createClient({ projectId: projectId || "placeholder", dataset, apiVersion, useCdn: false, token: process.env.ORA2_SANITY_WRITE_TOKEN }),
});
