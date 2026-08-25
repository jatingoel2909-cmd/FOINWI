/**
 * Search metadata supplements the provider-backed currency catalogue.
 * ISO code and display name always come from the same-origin currency endpoint;
 * this map adds carefully chosen, unambiguous territory and common-name aliases.
 */
export const CURRENCY_SEARCH_METADATA = {
  AED: { territories: ["United Arab Emirates"], searchTerms: ["uae", "dirham"] },
  AUD: { territories: ["Australia"], searchTerms: ["australia"] },
  CAD: { territories: ["Canada"], searchTerms: ["canada"] },
  CHF: { territories: ["Switzerland"], searchTerms: ["swiss"] },
  CNY: { territories: ["China"], searchTerms: ["china", "renminbi", "yuan"] },
  EUR: { territories: ["Euro area"], searchTerms: ["europe", "eurozone"] },
  GBP: { territories: ["United Kingdom"], searchTerms: ["uk", "britain", "pound sterling"] },
  INR: { territories: ["India"], searchTerms: ["india", "rupee"] },
  JPY: { territories: ["Japan"], searchTerms: ["japan", "yen"] },
  NZD: { territories: ["New Zealand"], searchTerms: ["new zealand"] },
  SAR: { territories: ["Saudi Arabia"], searchTerms: ["saudi", "riyal"] },
  SGD: { territories: ["Singapore"], searchTerms: ["singapore"] },
  USD: { territories: ["United States"], searchTerms: ["usa", "us", "america", "dollar"] },
};

export const DEFAULT_CURRENCY_PAIR = { base: "INR", quote: "USD" };

export const QUICK_CURRENCY_PAIRS = [
  { base: "INR", quote: "USD", label: "INR / USD" },
  { base: "INR", quote: "AED", label: "INR / AED" },
  { base: "INR", quote: "GBP", label: "INR / GBP" },
  { base: "INR", quote: "EUR", label: "INR / EUR" },
  { base: "INR", quote: "CAD", label: "INR / CAD" },
  { base: "INR", quote: "AUD", label: "INR / AUD" },
];
