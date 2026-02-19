export const siteConfig = {
  name: "Dan O Home Loans",
  domain: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.danohomeloans.com",
  defaultApplyNowUrl:
    process.env.NEXT_PUBLIC_APPLY_NOW_URL ?? "https://apply.alcova.com/dr/c/vrli1",
  phone: "(973) 710-8025",
  email: "team@danohomeloans.com"
};

export const targetLocations = [
  {
    slug: "wilmington-nc",
    city: "Wilmington",
    state: "NC",
    title: "Mortgage Lender in Wilmington, NC",
    description:
      "Home loan options, local market guidance, and quick pre-approval support for Wilmington buyers and refinancers.",
    neighborhoods: ["Downtown", "Ogden", "Myrtle Grove", "Porters Neck"]
  },
  {
    slug: "southern-pines-nc",
    city: "Southern Pines",
    state: "NC",
    title: "Mortgage Lender in Southern Pines, NC",
    description:
      "Loan strategies for first-time buyers, military families, and move-up buyers in Southern Pines.",
    neighborhoods: ["Weymouth Heights", "Downtown", "Midland Road Corridor"]
  },
  {
    slug: "raleigh-nc",
    city: "Raleigh",
    state: "NC",
    title: "Mortgage Lender in Raleigh, NC",
    description:
      "Mortgage education and competitive financing options for Raleigh homebuyers and homeowners.",
    neighborhoods: ["North Hills", "Five Points", "Brier Creek", "Apex / Cary Area"]
  }
] as const;
