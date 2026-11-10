import { ImageResponse } from "next/og";

export const runtime = "edge";

/** Dynamic Open Graph image: bone ground, basalt panel, brass rule, the page title in a serif. */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") || "ORA World").slice(0, 90);
  const locale = searchParams.get("locale") === "es" ? "es" : "en";
  const sub = locale === "es" ? "Residencias de lujo y conciencia ecológica · Dorado, Puerto Rico" : "Luxury, eco-conscious residences · Dorado, Puerto Rico";
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#F7F3EC", padding: 40 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#2C2416", borderRadius: 40, padding: 64, color: "#F7F3EC" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 26, color: "#D4B987", fontWeight: 600 }}>
            <div style={{ width: 14, height: 14, borderRadius: 14, background: "#A8864F" }} />
            ORA WORLD · PUERTO RICO
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ fontSize: 72, lineHeight: 1.05, fontFamily: "serif", letterSpacing: -1, maxWidth: 1000 }}>{title}</div>
            <div style={{ width: 160, height: 2, background: "#A8864F" }} />
            <div style={{ fontSize: 28, color: "rgba(247,243,236,0.75)" }}>{sub}</div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
