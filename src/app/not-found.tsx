import Link from "next/link";
import "@/styles/globals.css";

/** Root not-found for paths outside a locale (the proxy normally redirects first). */
export default function RootNotFound() {
  return (
    <html lang="en">
      <body>
        <section className="panel panel-bone container-x section-y text-center">
          <h1 className="display-l">This page has moved or never existed</h1>
          <p className="lead mx-auto mt-4">Go back to the homepage.</p>
          <Link href="/en" className="pill pill-basalt mt-8">Homepage</Link>
        </section>
      </body>
    </html>
  );
}
