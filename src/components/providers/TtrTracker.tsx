/**
 * TTR OS website tracker (TTR-2288): page views, phone taps and the source of each visit, reported to
 * portal.ttrdigitalmarketing.com. Nothing visible on the page. The site key is public (it ships in every page) but
 * lives in the NEXT_PUBLIC_TTR_SITE_KEY environment variable, from TTR OS (ORA WORLD > Connections > Tracking).
 * Without it nothing loads. Forms that hold personal details carry data-ttr-skip, so the tracker never reads them;
 * leads still go to the CRM through /api/lead.
 */
const TTR_OS = "https://portal.ttrdigitalmarketing.com";
/** The tracker's versioned address (cached for a year). An older version still gets today's script. */
const TRACKER_VERSION = "5a23a7758595";

export function TtrTracker() {
  const site = process.env.NEXT_PUBLIC_TTR_SITE_KEY;
  if (!site) return null;
  return <script src={`${TTR_OS}/api/site/script/${TRACKER_VERSION}`} data-site={site} defer />;
}
