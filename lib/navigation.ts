export type NavItem = {
  label: string;
  href: string;
  description: string;
  sublinks: Array<{ label: string; href: string }>;
};

export const navigation: NavItem[] = [
  {
    label: "Residential",
    href: "/residential",
    description:
      "Explore home loan paths for primary residences, first-time buyers, and move-up borrowers.",
    sublinks: [
      { label: "Conventional", href: "/residential/conventional" },
      { label: "USDA", href: "/residential/usda" },
      { label: "FHA", href: "/residential/fha" },
      { label: "VA", href: "/residential/va" }
    ]
  },
  {
    label: "Investment",
    href: "/investment",
    description:
      "Financing strategies for rental properties and portfolio growth in North Carolina markets.",
    sublinks: [
      { label: "DSCR", href: "/investment/dscr" },
      { label: "Rental Property", href: "/investment/rental-property" },
      { label: "Portfolio Loans", href: "/investment/portfolio-loans" },
      { label: "Bridge Loans", href: "/investment/bridge-loans" }
    ]
  },
  {
    label: "Commercial",
    href: "/commercial",
    description:
      "Commercial lending guidance for mixed-use, office, retail, and owner-occupied projects.",
    sublinks: [
      { label: "SBA 7(a)", href: "/commercial/sba-7a" },
      { label: "SBA 504", href: "/commercial/sba-504" },
      { label: "Multi-Unit", href: "/commercial/multi-unit" },
      { label: "Owner-Occupied", href: "/commercial/owner-occupied" }
    ]
  },
  {
    label: "Tools",
    href: "/tools",
    description:
      "Rate, payment, and affordability tools that help borrowers make data-informed decisions.",
    sublinks: [
      { label: "Mortgage Calculator", href: "/tools/mortgage-calculator" },
      { label: "Affordability", href: "/tools/affordability" },
      { label: "Refinance Savings", href: "/tools/refinance-savings" },
      { label: "Closing Cost Estimator", href: "/tools/closing-cost-estimator" }
    ]
  },
  {
    label: "Insights",
    href: "/blog",
    description:
      "Educational market commentary and mortgage strategy updates for Wilmington, Southern Pines, and Raleigh.",
    sublinks: [
      { label: "Articles", href: "/blog/articles" },
      { label: "Market Updates", href: "/blog/market-updates" },
      { label: "Buying Guides", href: "/blog/buying-guides" },
      { label: "Refinance", href: "/blog/refinance" },
      { label: "Local Trends", href: "/blog/local-trends" }
    ]
  }
];
