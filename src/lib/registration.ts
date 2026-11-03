const COOKIE = "ora2_registered";
const YEAR = 60 * 60 * 24 * 365;

/** One-step registration gate for full plan detail, remembered for a year. */
export function isRegistered(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split("; ").some((c) => c.startsWith(`${COOKIE}=1`));
}
export function setRegistered() {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE}=1; max-age=${YEAR}; path=/; samesite=lax${location.protocol === "https:" ? "; secure" : ""}`;
  window.dispatchEvent(new Event("ora2:registered"));
}
export const REGISTRATION_COOKIE = COOKIE;
