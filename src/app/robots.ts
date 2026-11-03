import type { MetadataRoute } from "next";
import { SITE_URL, IS_PROD } from "@/lib/utils";

export default function robots(): MetadataRoute.Robots {
  return IS_PROD
    ? { rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/studio"] }], sitemap: `${SITE_URL}/sitemap.xml` }
    : { rules: [{ userAgent: "*", disallow: "/" }] };
}
