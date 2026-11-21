/**
 * Demo passcode gate (client, 21 Nov: "the site on oraworld.net behind a passcode, for the demo call").
 *
 * On when ORA2_DEMO_PASSCODE is set, and only on the hosts in ORA2_GATE_HOSTS (comma-separated; default
 * oraworld.net and www.oraworld.net), so the vercel.app address stays open for the team. A visitor who enters the
 * passcode gets an httpOnly cookie holding a hash of it: changing the passcode signs everyone out.
 */
export const GATE_COOKIE = "ora2_gate";

export function gateHosts(): string[] {
  return (process.env.ORA2_GATE_HOSTS || "oraworld.net,www.oraworld.net")
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);
}

export function gateOn(host: string | null): boolean {
  if (!process.env.ORA2_DEMO_PASSCODE) return false;
  const h = (host || "").split(":")[0].toLowerCase();
  return gateHosts().includes(h);
}

export async function gateToken(): Promise<string> {
  const data = new TextEncoder().encode(`ora2-demo:${process.env.ORA2_DEMO_PASSCODE}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Same length, every character compared: no early exit to time. */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Only a path on this site ("/en/b"), never another address. */
export function safeNext(next: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return "/";
  return next.slice(0, 300);
}
