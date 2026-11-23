/**
 * TTR-3011: for a buyer lead, ORA World OS answers the website-lead call with a link to book a call.
 * The exact field is set by the ORA World OS side (TTR-3011 part 1). Change BOOKING_FIELD here once it is posted.
 * Anything that is not a plain https link is ignored, so the buyer then sees the fixed thank-you line.
 */
export const BOOKING_FIELD = "bookingUrl";

export function bookingLinkFrom(answer: unknown): string | null {
  if (!answer || typeof answer !== "object") return null;
  const raw = (answer as Record<string, unknown>)[BOOKING_FIELD];
  if (typeof raw !== "string" || raw.length > 2000) return null;
  try {
    const url = new URL(raw);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}
