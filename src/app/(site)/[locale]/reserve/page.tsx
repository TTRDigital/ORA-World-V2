import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata, JsonLd, breadcrumbLd } from "@/lib/seo";
import type { Locale } from "@/content/types";
import { PageHero } from "@/components/ui/PageHero";
import { PillLink } from "@/components/ui/Pill";
import { LeadFormLazy } from "@/components/forms/LeadFormLazy";
import { getSiteSettings } from "@/lib/content";
import { tdm } from "@/content/seed/images";

/**
 * Reserve (client meeting, 24 Nov: "Reserve your spot in paradise"; the whole buyer journey digital, from the
 * reservation and deposit to the agreement, an attorney if wanted, and DocuSign). The site takes the reservation
 * request; the sales team sends the deposit request and the agreement from the CRM, a person pressing Send. No payment
 * is taken on the website.
 */
const COPY = {
  title: { en: "Reserve your residence", es: "Reserve su residencia" },
  label: { en: "Reservations", es: "Reservas" },
  headline: { en: "Reserve your place in paradise.", es: "Reserve su lugar en el paraíso." },
  intro: {
    en: "The first 50 founding residences at Tesoro del Mar are offered by application. Choose a residence, send your request, and the ORA World team reviews each one personally. Everything that follows happens online, with your attorney if you wish.",
    es: "Las primeras 50 residencias fundadoras de Tesoro del Mar se ofrecen por solicitud. Elija una residencia, envíe su solicitud y el equipo de ORA World revisará cada una personalmente. Todo lo demás sucede en línea, con su abogado si lo desea.",
  },
  stepsTitle: { en: "From request to signature, online", es: "De la solicitud a la firma, en línea" },
  steps: [
    {
      en: [
        "Choose your residence",
        "Explore Tower 1 floor by floor and pick the residence you want, or ask the team to suggest one.",
      ],
      es: [
        "Elija su residencia",
        "Recorra la Torre 1 piso por piso y elija la residencia que desea, o pida al equipo que le sugiera una.",
      ],
    },
    {
      en: [
        "Send your reservation request",
        "Tell us who you are and which residence you have in mind. Every request is reviewed personally, and the team replies to you directly.",
      ],
      es: [
        "Envíe su solicitud de reserva",
        "Cuéntenos quién es y qué residencia tiene en mente. Cada solicitud se revisa personalmente y el equipo le responde directamente.",
      ],
    },
    {
      en: [
        "Secure it with a refundable deposit",
        "Once your request is accepted, you receive a secure link to pay a refundable reservation deposit online. The amount, the refund window and the terms are set out before you pay.",
      ],
      es: [
        "Asegúrela con un depósito reembolsable",
        "Una vez aceptada su solicitud, recibe un enlace seguro para pagar en línea un depósito de reserva reembolsable. El monto, el plazo de reembolso y los términos se indican antes de pagar.",
      ],
    },
    {
      en: [
        "Review the agreement",
        "Your reservation agreement arrives by email to read online. Invite your attorney to review it with you and ask the team anything along the way; ORA World's attorney reviews it too.",
      ],
      es: [
        "Revise el acuerdo",
        "Su acuerdo de reserva llega por correo para leerlo en línea. Invite a su abogado a revisarlo con usted y pregunte al equipo lo que necesite; el abogado de ORA World también lo revisa.",
      ],
    },
    {
      en: ["Sign with DocuSign", "Sign from any device with DocuSign. Every party receives a signed copy."],
      es: [
        "Firme con DocuSign",
        "Firme desde cualquier dispositivo con DocuSign. Cada parte recibe una copia firmada.",
      ],
    },
    {
      en: [
        "Your reservation is confirmed",
        "Your deposit is transferred to the account named in your agreement, and you receive written confirmation of your reservation.",
      ],
      es: [
        "Su reserva queda confirmada",
        "Su depósito se transfiere a la cuenta indicada en su acuerdo y usted recibe la confirmación por escrito de su reserva.",
      ],
    },
  ],
  formTitle: { en: "Request your reservation", es: "Solicite su reserva" },
  formText: {
    en: "Send the form and a member of the team will contact you to review your request and the next steps. Nothing is charged here.",
    es: "Envíe el formulario y un miembro del equipo le contactará para revisar su solicitud y los próximos pasos. Aquí no se cobra nada.",
  },
  legal: {
    en: "Reservations and deposits are subject to the offering terms. No offering can be made and no deposits or reservations can be accepted until an offering plan is filed with the New York State Department of Law.",
    es: "Las reservas y los depósitos están sujetos a los términos de la oferta. No se puede realizar ninguna oferta ni aceptar depósitos o reservas hasta que se presente un plan de oferta ante el Departamento de Justicia del Estado de Nueva York.",
  },
};

type L = { en: string; es: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/reserve",
    title: COPY.title[locale],
    description: COPY.intro[locale],
  });
}

export default async function ReservePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ residence?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { residence } = await searchParams;
  const es = locale === "es";
  const x = (l: L) => l[locale];
  const [settings, tf] = await Promise.all([
    getSiteSettings(),
    getTranslations({ locale, namespace: "form" }),
  ]);
  // Only a residence number from the floor plans (e.g. "1002" or "PH") is carried into the form.
  const unit = residence && /^(PH|\d{3,4})$/.test(residence) ? residence : undefined;

  return (
    <div className="flex flex-col">
      <JsonLd
        data={breadcrumbLd(locale, [
          { name: "ORA World", path: "/" },
          { name: x(COPY.title), path: "/reserve" },
        ])}
      />
      <PageHero
        locale={locale}
        label={x(COPY.label)}
        headline={x(COPY.headline)}
        intro={x(COPY.intro)}
        image={tdm.exteriorPull}
        compact
      >
        <PillLink href="#reserve-form" tone="brass">
          {tf("reserveSubmit")}
        </PillLink>
        <PillLink href="/residences/plans">{es ? "Ver los planos" : "See the floor plans"}</PillLink>
      </PageHero>

      <section
        aria-labelledby="steps-title"
        className="border-b border-travertine-deep/60 bg-bone px-5 py-16 md:px-10 md:py-24"
      >
        <div className="mx-auto max-w-[1280px]">
          <h2
            id="steps-title"
            className="font-[family-name:var(--font-display)] text-[36px] leading-[1.08] font-semibold text-charcoal md:text-[52px]"
          >
            {x(COPY.stepsTitle)}
          </h2>
          <ol className="mt-10 grid gap-px overflow-hidden border border-travertine-deep/70 bg-travertine-deep/70 md:grid-cols-2 lg:grid-cols-3">
            {COPY.steps.map((s, i) => {
              const [head, body] = s[locale];
              return (
                <li key={head} className="bg-bone p-6 md:p-8">
                  <span className="font-[family-name:var(--font-display)] text-[40px] leading-none text-brass-ink tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-5 text-[13px] font-semibold tracking-[0.2em] text-charcoal uppercase">
                    {head}
                  </h3>
                  <p className="mt-3 text-[16px] leading-relaxed text-charcoal-soft">{body}</p>
                </li>
              );
            })}
          </ol>
          <p className="mt-6 max-w-[90ch] text-[12.5px] leading-relaxed text-charcoal-soft">
            {x(COPY.legal)}
          </p>
        </div>
      </section>

      <section
        id="reserve-form"
        aria-labelledby="reserve-form-title"
        className="scroll-mt-28 bg-white px-5 py-16 md:px-10 md:py-24"
      >
        <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <h2
              id="reserve-form-title"
              className="font-[family-name:var(--font-display)] text-[36px] leading-[1.08] font-semibold text-charcoal md:text-[52px]"
            >
              {x(COPY.formTitle)}
            </h2>
            <p className="mt-5 max-w-[46ch] text-[16px] leading-relaxed text-charcoal-soft md:text-[17px]">
              {x(COPY.formText)}
            </p>
          </div>
          <LeadFormLazy
            variant="reserve"
            consentText={settings.consentText[locale]}
            defaults={{ residence: unit, source: "reserve" }}
            submitLabel={tf("reserveSubmit")}
          />
        </div>
      </section>
    </div>
  );
}
