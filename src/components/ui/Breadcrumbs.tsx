import { Link } from "@/i18n/navigation";
import { JsonLd, breadcrumbLd } from "@/lib/seo";
import type { Locale } from "@/content/types";

export function Breadcrumbs({ locale, items }: { locale: Locale; items: { name: string; path: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="container-x pt-2 pb-3">
      <JsonLd data={breadcrumbLd(locale, items)} />
      <ol className="flex flex-wrap items-center gap-2 text-[13px] text-charcoal-soft">
        {items.map((it, i) => (
          <li key={it.path} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden>·</span>}
            {i === items.length - 1 ? (
              <span aria-current="page" className="text-charcoal">{it.name}</span>
            ) : (
              <Link href={it.path} className="hover:text-brass-ink">{it.name}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
