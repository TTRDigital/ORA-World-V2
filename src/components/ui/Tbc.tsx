import { useTranslations } from "next-intl";

/** "To be confirmed" for unknown numbers inside real modules. */
export function Tbc({ className }: { className?: string }) {
  const t = useTranslations("common");
  return <span className={className ?? "text-charcoal-soft"}>{t("tbc")}</span>;
}
