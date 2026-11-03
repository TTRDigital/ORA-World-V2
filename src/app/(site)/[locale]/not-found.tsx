import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <section className="panel panel-bone container-x section-y text-center">
      <h1 className="display-l">{t("title")}</h1>
      <p className="lead mx-auto mt-4">{t("text")}</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/" className="pill pill-basalt">{t("home")}</Link>
        <Link href="/visit" className="pill pill-brass">{t("home") === "Homepage" ? "Book a visit" : "Reserve una visita"}</Link>
      </div>
    </section>
  );
}
