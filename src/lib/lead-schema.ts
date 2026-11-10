import { z } from "zod";

export const leadVariants = ["short", "full", "broker", "gate", "visit", "quiz", "newsletter"] as const;
export type LeadVariant = (typeof leadVariants)[number];

const phone = z.string().trim().min(7).max(32).regex(/^[+()\d\s.-]+$/);

/** Shared by the client form and /api/lead. */
export const leadSchema = z.object({
  variant: z.enum(leadVariants),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: phone.or(z.literal("")).optional(),
  role: z.enum(["buyer", "broker"]).optional(),
  source: z.string().trim().max(80).optional(),
  /** "What matters most to you?" (owner's brief: a personal interview about each person's goals). */
  goal: z.string().trim().max(120).optional(),
  message: z.string().trim().max(2000).optional(),
  licence: z.string().trim().max(80).optional(),
  brokerage: z.string().trim().max(120).optional(),
  client: z.string().trim().max(120).optional(),
  visitMode: z.enum(["gallery", "video"]).optional(),
  preferred: z.string().trim().max(120).optional(),
  answers: z.record(z.string(), z.string()).optional(),
  consent: z.literal(true),
  locale: z.enum(["en", "es"]),
  page: z.string().max(300).optional(),
  /** Honeypot: must stay empty. */
  company: z.string().max(0).optional(),
  turnstileToken: z.string().optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;

export const newsletterSchema = z.object({
  email: z.string().trim().email().max(200),
  locale: z.enum(["en", "es"]),
  company: z.string().max(0).optional(),
});
