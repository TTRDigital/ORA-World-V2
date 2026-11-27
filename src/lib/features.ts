/**
 * Parts of the site that can be switched on and off without deleting them.
 *
 * Finishes (client, 27 Nov: "just hide it for now; see if the client wants it"): with SHOW_FINISHES false, the
 * Finishes links leave every menu and footer, the finishes sections leave the homepages, and the Finishes pages send
 * visitors to the version's homepage. Set it to true to bring everything back.
 */
export const SHOW_FINISHES = false;

/** Leaves out links to the Finishes pages while they are hidden. */
export const withoutFinishes = <T>(items: readonly T[], href: (item: T) => string): T[] =>
  SHOW_FINISHES ? [...items] : items.filter((item) => !/\/finishes(\/|$|#)/.test(href(item)));
