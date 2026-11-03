/** Confirmation email via Resend, behind EMAIL_ENABLED. Silent no-op otherwise. */
export async function sendConfirmationEmail(opts: { to: string; name: string; locale: "en" | "es" }) {
  if (process.env.EMAIL_ENABLED !== "true" || !process.env.RESEND_API_KEY) return;
  const es = opts.locale === "es";
  const subject = es ? "Hemos recibido su solicitud · ORA World" : "We received your request · ORA World";
  const body = es
    ? `<p>Hola ${opts.name},</p><p>Gracias por su interés en ORA World. Un miembro del equipo de ventas se pondrá en contacto en breve.</p><p>Este anuncio no es una oferta. Es una solicitud de interés en la propiedad anunciada.</p>`
    : `<p>Hello ${opts.name},</p><p>Thank you for your interest in ORA World. A member of the sales team will be in touch shortly.</p><p>This advertisement is not an offering. It is a solicitation of interest in the advertised property.</p>`;
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || "ORA World <hello@example.com>",
      to: [opts.to],
      bcc: process.env.EMAIL_BCC ? [process.env.EMAIL_BCC] : undefined,
      subject,
      html: body,
    }),
  });
}
