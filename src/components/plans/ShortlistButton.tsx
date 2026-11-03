"use client";

import { useTranslations } from "next-intl";
import { useShortlist } from "@/lib/shortlist";
import { Heart } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

export function ShortlistButton({ slug, compact }: { slug: string; compact?: boolean }) {
  const t = useTranslations("plans");
  const { has, toggle, isFull } = useShortlist();
  const on = has(slug);
  const disabled = !on && isFull;
  return (
    <button type="button" onClick={() => toggle(slug)} aria-pressed={on} disabled={disabled} title={disabled ? t("full") : undefined} className={cn("chip", on && "is-active", compact && "size-11 justify-center px-0")} data-testid="shortlist-toggle">
      <Heart className={cn(on && "fill-current")} />
      {!compact && (on ? t("remove") : disabled ? t("full") : t("add"))}
      <span className="visually-hidden">{on ? t("remove") : t("add")}</span>
    </button>
  );
}
