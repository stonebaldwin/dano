export type NavSubItem = {
  label: string;
  href: string;
  children?: Array<{ label: string; href: string }>;
};

export type NavItem = {
  label: string;
  href: string;
  description?: string;
  sublinks: NavSubItem[];
};

export const navigation: NavItem[] = [
  {
    label: "Rates",
    href: "/mortgage-rates",
    description:
      "View current mortgage market rates and trend movements sourced from daily index data.",
    sublinks: []
  },
  {
    label: "Refinancing",
    href: "/residential",
    description:
      "Explore refinance pathways for rate-term changes, cash-out access, and equity-based lending options.",
    sublinks: [
      { label: "Home Refinance Loans", href: "/residential" },
      { label: "Cash-out Refinancing", href: "/residential" },
      { label: "Home Equity Loans", href: "/commercial/specialty-lending/helocs" }
    ]
  },
  {
    label: "Loan Options",
    href: "/residential",
    description:
      "Explore residential, investment, and specialty loan options across primary homes, second homes, and investment properties.",
    sublinks: [
      { label: "Purchase Loans", href: "/residential" },
      { label: "Refinance Loans", href: "/residential/refinance" },
      { label: "Home Equity Loans", href: "/commercial/specialty-lending/helocs" },
      { label: "NCHFA Down Payment Assistance", href: "/residential/nchfa-down-payment-assistance" },
      { label: "Specialty Lending", href: "/commercial/specialty-lending" }
    ]
  },
  {
    label: "Resources and Calculators",
    href: "/mortgage-guides",
    description:
      "Educational resources, guides, articles, and calculator tools to support borrower decision-making.",
    sublinks: [
      { label: "Mortgage Calculators", href: "/tools" },
      { label: "Mortgage Guides", href: "/mortgage-guides" },
      { label: "All Articles", href: "/blog/articles" }
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
