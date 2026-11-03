import { useTranslations } from "next-intl";

export function SkipLink() {
  const t = useTranslations("nav");
  return (
    <a href="#main" className="pill pill-basalt fixed top-3 left-3 z-[100] -translate-y-24 focus-visible:translate-y-0">
      {t("skip")}
    </a>
  );
}
