"use client";

/**
 * "My selection" (client, 18 Nov: "make it easier to show and pull for the user"): the finishes a visitor picks on the
 * Finishes page, kept in this browser and carried into the inquiry message. Every storage call is guarded.
 */
export type Pick = { name: string; group: string };
const KEY = "ora2_finishes";
const EVENT = "ora2:finishes";

export function readPicks(): Pick[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(v) ? v.filter((p) => p && typeof p.name === "string") : [];
  } catch {
    return [];
  }
}

export function writePicks(list: Pick[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {}
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function togglePick(p: Pick) {
  const list = readPicks();
  const has = list.some((q) => q.name === p.name && q.group === p.group);
  writePicks(has ? list.filter((q) => !(q.name === p.name && q.group === p.group)) : [...list, p]);
}

export function onPicks(cb: () => void) {
  const fn = () => cb();
  window.addEventListener(EVENT, fn);
  window.addEventListener("storage", fn);
  return () => {
    window.removeEventListener(EVENT, fn);
    window.removeEventListener("storage", fn);
  };
}

export function picksMessage(list: Pick[], es: boolean) {
  if (!list.length) return "";
  const head = es ? "Mi selección de acabados:" : "My finish selection:";
  return `${head}\n${list.map((p) => `- ${p.group}: ${p.name}`).join("\n")}`;
}
