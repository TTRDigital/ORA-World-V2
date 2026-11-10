import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Logo } from "./Logo";
import { LanguageToggle } from "./LanguageToggle";
import { footerGroups } from "./nav";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import type { SiteSettings } from "@/content/types";
import { Headline } from "@/components/ui/Headline";
import { BackToTop } from "./FooterActions";

/** Basalt rounded panel: white logo, newsletter, five nav groups, language, legal notice at 11px, EHO, sponsor. */
export function Footer({ settings, showPress }: { settings: SiteSettings; showPress: boolean }) {
  const t = useTranslations();
  const locale = useLocale() as "en" | "es";
  return (
    <footer data-tone="dark" className="panel panel-basalt on-dark container-x mt-3 py-12 md:py-16">
      {/* Closing band: the client's published line, the address, and the two ways to continue. */}
      <div className="footer-band relative mb-12 grid gap-6 overflow-hidden rounded-[24px] bg-basalt-soft p-6 md:mb-14 md:p-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <Headline as="p" text={t("footer.closing")} size="l" className="text-bone" />
          <p className="mt-4 max-w-[52ch] text-[17px] leading-relaxed text-bone/75">{t("footer.closingLine")}</p>
          <p className="mt-5 flex items-center gap-2 text-[13px] font-semibold text-brass-light">
            <span aria-hidden className="inline-block size-1.5 rounded-full bg-brass-light" />
            {t("footer.address")}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
          <Link href="/#contact" className="cta" data-track="cta_price_list" data-track-label="footer">
            {t("nav.priceList")}
          </Link>
        </div>
      </div>
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo variant="white" height={150} responsive className="h-[120px] md:h-[136px] lg:h-[150px]" />
          <p className="label mt-8">{t("footer.newsletter")}</p>
          <p className="small mt-1 mb-4 max-w-sm text-bone/70">{t("footer.newsletterText")}</p>
          <NewsletterForm dark />
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8 lg:grid-cols-5">
          {footerGroups.map((g) => (
            <div key={g.key}>
              <p className="label mb-3">{t(`footer.groups.${g.key}`)}</p>
              <ul className="space-y-2 text-[15px]">
                {g.links.map((l) => (
                  <li key={l.key}>
                    <Link href={l.href} className="text-bone/80 transition-colors hover:text-bone">
                      {t(`nav.${l.key}`)}
                    </Link>
                  </li>
                ))}
                {g.key === "company" && showPress && (
                  <li>
                    <Link href="/press" className="text-bone/80 transition-colors hover:text-bone">
                      {t("nav.press")}
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="rule mt-10 mb-6" />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-bone/70">
          <li><Link href="/privacy" className="hover:text-bone">{t("footer.privacy")}</Link></li>
          <li><Link href="/terms" className="hover:text-bone">{t("footer.terms")}</Link></li>
          <li><Link href="/accessibility" className="hover:text-bone">{t("footer.accessibility")}</Link></li>
          <li><Link href="/legal-disclaimer" className="hover:text-bone">{t("footer.disclaimer")}</Link></li>
        </ul>
        <div className="flex items-center gap-4">
          <LanguageToggle dark />
          <BackToTop label={t("footer.top")} />
        </div>
      </div>
      <p className="legal mt-6 max-w-5xl text-bone/60">{settings.legalNotice}</p>
      <p className="legal mt-2 text-bone/60">{settings.renderingNotice[locale]}</p>
      <div className="mt-6 flex flex-wrap items-center gap-4 text-[12px] text-bone/60">
        <span className="inline-flex items-center gap-2">
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 11 12 4l9 7" />
            <path d="M5 10v10h14V10" />
            <path d="M9 14h6M9 17h6" />
          </svg>
          {t("footer.equalHousing")}
        </span>
        <span>{settings.sponsor[locale]}</span>
        <span>© {new Date().getFullYear()} ORA World. {t("footer.rights")}</span>
      </div>
    </footer>
  );
}
