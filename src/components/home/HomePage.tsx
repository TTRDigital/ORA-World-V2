import type { Locale } from "@/content/types";
import { getHome } from "@/lib/content";
import { Headline } from "@/components/ui/Headline";
import { t } from "@/lib/localize";

/** Placeholder assembly until the thirteen modules land (replaced in the homepage phase). */
export async function HomePage({ locale }: { locale: Locale }) {
  const home = await getHome();
  return (
    <section className="panel panel-bone container-x section-y">
      <Headline as="h1" size="xl" text={t(home.hero.headline, locale)} />
      <p className="statement mt-6">{t(home.hero.line, locale)}</p>
    </section>
  );
}
