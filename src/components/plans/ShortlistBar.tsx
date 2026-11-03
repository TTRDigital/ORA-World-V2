"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useShortlist, SHORTLIST_MAX } from "@/lib/shortlist";

/** Floating shortlist bar (bottom-left) once a plan is shortlisted. */
export function ShortlistBar() {
  const t = useTranslations("plans");
  const { items, clear } = useShortlist();
  if (items.length === 0) return null;
  return (
    <div className="sheet-up fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-[64] flex items-center gap-3 rounded-full bg-basalt px-4 py-2 text-bone shadow-lift sm:inset-x-auto sm:left-5 sm:bottom-5" role="status">
      <span className="text-[14px] font-semibold">{t("shortlist")} {items.length}/{SHORTLIST_MAX}</span>
      <Link href="/residences/compare" className="pill pill-brass min-h-10 px-4">{t("compare")}</Link>
      <button type="button" onClick={clear} className="text-[13px] text-bone/70 underline-offset-2 hover:underline">{t("clear")}</button>
    </div>
  );
}
