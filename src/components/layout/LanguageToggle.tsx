"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

/** EN | ES. Keeps the current page; the choice is remembered by the locale cookie. */
export function LanguageToggle({ className, dark }: { className?: string; dark?: boolean }) {
  const locale = useLocale();
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const go = (l: "en" | "es") => {
    if (l === locale) return;
    router.replace({ pathname, params: params as never } as never, { locale: l });
  };
  return (
    <div role="group" aria-label={t("language")} className={cn("flex items-center gap-1 text-[13px] font-semibold", className)}>
      {(["en", "es"] as const).map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && <span aria-hidden className={cn("mx-1", dark ? "text-bone/40" : "text-travertine-deep")}>|</span>}
          <button
            type="button"
            onClick={() => go(l)}
            aria-current={l === locale ? "true" : undefined}
            className={cn("hairline min-h-6 px-1 uppercase", l === locale && "is-active", l === locale ? (dark ? "text-bone" : "text-charcoal") : dark ? "text-bone/60 hover:text-bone" : "text-charcoal-soft hover:text-charcoal")}
          >
            {l}
          </button>
        </span>
      ))}
    </div>
  );
}
