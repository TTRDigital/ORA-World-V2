/**
 * ORA2-prefixed on purpose: the build environment also carries NEXT_PUBLIC_SANITY_PROJECT_ID / DATASET for an
 * unrelated site, and this site must never read or write that project.
 */
export const projectId = process.env.NEXT_PUBLIC_ORA2_SANITY_PROJECT_ID || "";
export const dataset = process.env.NEXT_PUBLIC_ORA2_SANITY_DATASET || "production";
export const apiVersion = process.env.NEXT_PUBLIC_ORA2_SANITY_API_VERSION || "2025-10-01";
/** True only when a real project is configured; otherwise the site renders from the typed seed. */
export const sanityConfigured = /^[a-z0-9-]{6,}$/.test(projectId);
export const studioBasePath = "/studio";
