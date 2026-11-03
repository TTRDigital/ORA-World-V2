import { createClient, type SanityClient } from "next-sanity";
import { apiVersion, dataset, projectId, sanityConfigured } from "./env";

let _client: SanityClient | null = null;

/** Read client (CDN, published content). Null when no ORA2 project is configured. */
export function readClient(): SanityClient | null {
  if (!sanityConfigured) return null;
  if (!_client) _client = createClient({ projectId, dataset, apiVersion, useCdn: true, perspective: "published" });
  return _client;
}

/** Server-only write client for leads, seeding and draft mode. */
export function writeClient(): SanityClient | null {
  const token = process.env.ORA2_SANITY_WRITE_TOKEN;
  if (!sanityConfigured || !token) return null;
  return createClient({ projectId, dataset, apiVersion, useCdn: false, token });
}
