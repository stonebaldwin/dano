export const siteConfig = {
  name: "Dan Opirhory",
  domain: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.danohomeloans.com",
  defaultApplyNowUrl:
    process.env.NEXT_PUBLIC_APPLY_NOW_URL ?? "https://apply.alcova.com/dr/c/vrli1",
  phone: "(973) 710-8025",
  email: "dopirhory@alcova.com"
};

export const advisorProfile = {
  name: "Daniel Opirhory",
  title: "Mortgage Advisor",
  phone: siteConfig.phone,
  serving: "Serving North Carolina, Texas, Tennessee, Georgia",
  ratingLabel: "5.0 Customer Rating (Read Reviews)",
  ratingUrl: "https://www.experience.com/reviews/daniel-opirhory-384903",
  headshotPath: "/headshot.png",
  socials: [
    { label: "Facebook", href: "https://www.facebook.com/danopirhoryLO" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/daniel-opirhory/" },
    { label: "Instagram", href: "https://www.instagram.com/dan_opirhory_mlo/" }
  ]
} as const;

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
