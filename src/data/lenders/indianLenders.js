/**
 * Illustrative Indian lender dataset for FOINWI EMI comparison.
 *
 * IMPORTANT:
 * - Values are development-only placeholders for UI and engine testing.
 * - They are NOT official, live, or guaranteed lender offers.
 * - Architecture supports later replacement via manual review, admin, n8n, or approved API.
 */

export const ILLUSTRATIVE_RATE_DISCLAIMER =
  "Illustrative rate for comparison. Verify the latest offer directly with the lender.";

export const LENDER_PROCESSING_STYLES = [
  "Digital-first",
  "Branch-assisted",
  "Hybrid",
  "Relationship-led",
];

/** Maps EMI loanType ids → illustrativeRates object keys */
export const LOAN_TYPE_RATE_KEYS = {
  home: "home",
  personal: "personal",
  car: "car",
  "two-wheeler": "twoWheeler",
  education: "education",
  lap: "loanAgainstProperty",
  business: "business",
  gold: "gold",
};

const DEV_SOURCE = {
  sourceLabel: "Development-only illustrative placeholder — not an official or live offer",
  sourceUrl: null,
  lastReviewed: "2026-08-02",
  isDevelopmentPlaceholder: true,
};

function band(min, max) {
  return { min, max };
}

function unsupported() {
  return { min: null, max: null };
}

/**
 * Small starter set for UI development.
 * Rate bands are clearly labelled development placeholders only.
 */
export const INDIAN_LENDERS = [
  {
    id: "sbi",
    name: "State Bank of India",
    lenderType: "Public Sector Bank",
    loanTypes: ["home", "personal", "car", "two-wheeler", "education", "lap", "business", "gold"],
    illustrativeRates: {
      home: band(8.3, 9.1),
      personal: band(11.0, 14.0),
      car: band(8.7, 10.2),
      twoWheeler: band(10.0, 12.5),
      education: band(9.0, 11.5),
      loanAgainstProperty: band(9.5, 11.5),
      business: band(11.5, 15.0),
      gold: band(9.5, 11.5),
    },
    processingStyle: "Branch-assisted",
    digitalApplication: true,
    notes: "Broad retail loan footprint with branch-assisted servicing.",
    ...DEV_SOURCE,
  },
  {
    id: "hdfc",
    name: "HDFC Bank",
    lenderType: "Private Sector Bank",
    loanTypes: ["home", "personal", "car", "two-wheeler", "education", "lap", "business", "gold"],
    illustrativeRates: {
      home: band(8.5, 9.4),
      personal: band(10.5, 13.5),
      car: band(8.9, 10.5),
      twoWheeler: band(10.5, 13.0),
      education: band(9.5, 12.0),
      loanAgainstProperty: band(9.8, 11.8),
      business: band(12.0, 15.5),
      gold: band(10.0, 12.0),
    },
    processingStyle: "Hybrid",
    digitalApplication: true,
    notes: "Retail lending with hybrid digital and branch channels.",
    ...DEV_SOURCE,
  },
  {
    id: "icici",
    name: "ICICI Bank",
    lenderType: "Private Sector Bank",
    loanTypes: ["home", "personal", "car", "two-wheeler", "education", "lap", "business", "gold"],
    illustrativeRates: {
      home: band(8.6, 9.5),
      personal: band(10.8, 14.0),
      car: band(9.0, 10.8),
      twoWheeler: band(10.8, 13.2),
      education: band(9.8, 12.2),
      loanAgainstProperty: band(10.0, 12.0),
      business: band(12.2, 15.8),
      gold: band(10.2, 12.2),
    },
    processingStyle: "Digital-first",
    digitalApplication: true,
    notes: "Strong digital application pathways for many retail products.",
    ...DEV_SOURCE,
  },
  {
    id: "axis",
    name: "Axis Bank",
    lenderType: "Private Sector Bank",
    loanTypes: ["home", "personal", "car", "two-wheeler", "education", "lap", "business", "gold"],
    illustrativeRates: {
      home: band(8.7, 9.6),
      personal: band(11.0, 14.5),
      car: band(9.1, 10.9),
      twoWheeler: band(11.0, 13.5),
      education: band(10.0, 12.5),
      loanAgainstProperty: band(10.2, 12.2),
      business: band(12.5, 16.0),
      gold: band(10.5, 12.5),
    },
    processingStyle: "Hybrid",
    digitalApplication: true,
    notes: "Hybrid servicing across digital and branch channels.",
    ...DEV_SOURCE,
  },
  {
    id: "pnb",
    name: "Punjab National Bank",
    lenderType: "Public Sector Bank",
    loanTypes: ["home", "personal", "car", "education", "lap", "business", "gold"],
    illustrativeRates: {
      home: band(8.4, 9.2),
      personal: band(11.2, 14.2),
      car: band(8.8, 10.4),
      twoWheeler: unsupported(),
      education: band(9.2, 11.8),
      loanAgainstProperty: band(9.6, 11.6),
      business: band(11.8, 15.2),
      gold: band(9.8, 11.8),
    },
    processingStyle: "Branch-assisted",
    digitalApplication: true,
    notes: "Public-sector retail lending with significant branch presence.",
    ...DEV_SOURCE,
  },
  {
    id: "bob",
    name: "Bank of Baroda",
    lenderType: "Public Sector Bank",
    loanTypes: ["home", "personal", "car", "education", "lap", "business", "gold"],
    illustrativeRates: {
      home: band(8.35, 9.15),
      personal: band(11.1, 14.1),
      car: band(8.75, 10.3),
      twoWheeler: unsupported(),
      education: band(9.1, 11.6),
      loanAgainstProperty: band(9.55, 11.55),
      business: band(11.6, 15.1),
      gold: band(9.7, 11.6),
    },
    processingStyle: "Branch-assisted",
    digitalApplication: true,
    notes: "Wide branch network supporting retail and MSME lending.",
    ...DEV_SOURCE,
  },
  {
    id: "canara",
    name: "Canara Bank",
    lenderType: "Public Sector Bank",
    loanTypes: ["home", "personal", "car", "education", "lap", "business", "gold"],
    illustrativeRates: {
      home: band(8.45, 9.25),
      personal: band(11.25, 14.25),
      car: band(8.85, 10.35),
      twoWheeler: unsupported(),
      education: band(9.15, 11.7),
      loanAgainstProperty: band(9.65, 11.65),
      business: band(11.7, 15.2),
      gold: band(9.75, 11.7),
    },
    processingStyle: "Branch-assisted",
    digitalApplication: true,
    notes: "Retail and education lending with branch-assisted processes.",
    ...DEV_SOURCE,
  },
  {
    id: "union",
    name: "Union Bank of India",
    lenderType: "Public Sector Bank",
    loanTypes: ["home", "personal", "car", "education", "lap", "business", "gold"],
    illustrativeRates: {
      home: band(8.4, 9.2),
      personal: band(11.3, 14.3),
      car: band(8.9, 10.4),
      twoWheeler: unsupported(),
      education: band(9.2, 11.8),
      loanAgainstProperty: band(9.7, 11.7),
      business: band(11.8, 15.3),
      gold: band(9.8, 11.8),
    },
    processingStyle: "Branch-assisted",
    digitalApplication: true,
    notes: "Public-sector lender with branch-led retail servicing.",
    ...DEV_SOURCE,
  },
  {
    id: "kotak",
    name: "Kotak Mahindra Bank",
    lenderType: "Private Sector Bank",
    loanTypes: ["home", "personal", "car", "education", "lap", "business"],
    illustrativeRates: {
      home: band(8.7, 9.7),
      personal: band(10.9, 14.2),
      car: band(9.2, 11.0),
      twoWheeler: unsupported(),
      education: band(10.2, 12.8),
      loanAgainstProperty: band(10.3, 12.4),
      business: band(12.8, 16.2),
      gold: unsupported(),
    },
    processingStyle: "Relationship-led",
    digitalApplication: true,
    notes: "Private bank with relationship-oriented lending workflows.",
    ...DEV_SOURCE,
  },
  {
    id: "idfc-first",
    name: "IDFC FIRST Bank",
    lenderType: "Private Sector Bank",
    loanTypes: ["home", "personal", "car", "education", "lap", "business"],
    illustrativeRates: {
      home: band(8.75, 9.75),
      personal: band(10.5, 13.8),
      car: band(9.0, 10.9),
      twoWheeler: unsupported(),
      education: band(10.0, 12.6),
      loanAgainstProperty: band(10.2, 12.3),
      business: band(12.4, 16.0),
      gold: unsupported(),
    },
    processingStyle: "Digital-first",
    digitalApplication: true,
    notes: "Digital-first retail focus with app-led application journeys.",
    ...DEV_SOURCE,
  },
  {
    id: "federal",
    name: "Federal Bank",
    lenderType: "Private Sector Bank",
    loanTypes: ["home", "personal", "car", "education", "lap", "gold"],
    illustrativeRates: {
      home: band(8.55, 9.45),
      personal: band(11.0, 14.0),
      car: band(8.95, 10.6),
      twoWheeler: unsupported(),
      education: band(9.6, 12.0),
      loanAgainstProperty: band(9.9, 11.9),
      business: unsupported(),
      gold: band(9.9, 11.9),
    },
    processingStyle: "Hybrid",
    digitalApplication: true,
    notes: "Hybrid digital and branch servicing for retail borrowers.",
    ...DEV_SOURCE,
  },
  {
    id: "lic-housing",
    name: "LIC Housing Finance",
    lenderType: "Housing Finance Company",
    loanTypes: ["home", "lap"],
    illustrativeRates: {
      home: band(8.5, 9.5),
      personal: unsupported(),
      car: unsupported(),
      twoWheeler: unsupported(),
      education: unsupported(),
      loanAgainstProperty: band(9.8, 11.8),
      business: unsupported(),
      gold: unsupported(),
    },
    processingStyle: "Relationship-led",
    digitalApplication: true,
    notes: "Housing-finance specialist focused on home and property-backed loans.",
    ...DEV_SOURCE,
  },
  {
    id: "bajaj-housing",
    name: "Bajaj Housing Finance",
    lenderType: "Housing Finance Company",
    loanTypes: ["home", "lap"],
    illustrativeRates: {
      home: band(8.6, 9.6),
      personal: unsupported(),
      car: unsupported(),
      twoWheeler: unsupported(),
      education: unsupported(),
      loanAgainstProperty: band(10.0, 12.0),
      business: unsupported(),
      gold: unsupported(),
    },
    processingStyle: "Digital-first",
    digitalApplication: true,
    notes: "Housing-finance lender with digital-first application emphasis.",
    ...DEV_SOURCE,
  },
];

export function getLenderById(id) {
  return INDIAN_LENDERS.find((lender) => lender.id === id) ?? null;
}

export function getLoanTypeRateKey(loanTypeId) {
  return LOAN_TYPE_RATE_KEYS[loanTypeId] ?? null;
}
