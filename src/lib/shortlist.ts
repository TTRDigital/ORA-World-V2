"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const KEY = "ora2_shortlist";
export const SHORTLIST_MAX = 3;
const EVENT = "ora2:shortlist";

const subscribe = (cb: () => void) => {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
};
const getSnapshot = () => {
  try {
    return localStorage.getItem(KEY) || "[]";
  } catch {
    return "[]";
  }
};
const getServerSnapshot = () => "[]";

/** Plan shortlist (max 3) in localStorage, synced across components via a window event. */
export function useShortlist() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const items = useMemo<string[]>(() => {
    try {
      const v = JSON.parse(raw);
      return Array.isArray(v) ? v.filter((x) => typeof x === "string").slice(0, SHORTLIST_MAX) : [];
    } catch {
      return [];
    }
  }, [raw]);
  const write = useCallback((next: string[]) => {
    localStorage.setItem(KEY, JSON.stringify(next.slice(0, SHORTLIST_MAX)));
    window.dispatchEvent(new Event(EVENT));
  }, []);
  const toggle = useCallback(
    (slug: string) => {
      if (items.includes(slug)) write(items.filter((s) => s !== slug));
      else if (items.length < SHORTLIST_MAX) write([...items, slug]);
    },
    [items, write],
  );
  const clear = useCallback(() => write([]), [write]);
  return { items, toggle, clear, isFull: items.length >= SHORTLIST_MAX, has: (s: string) => items.includes(s) };
}
