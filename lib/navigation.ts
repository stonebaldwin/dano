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
    label: "Loan Programs",
    href: "/residential",
    description:
      "Explore residential, investment, and specialty loan options across primary homes, second homes, and investment properties.",
    sublinks: [
      { label: "Conventional", href: "/residential/conventional" },
      { label: "FHA", href: "/residential/fha" },
      { label: "VA", href: "/residential/va" },
      { label: "USDA", href: "/residential/usda" },
      { label: "NCHFA Down Payment Assistance", href: "/residential" },
      { label: "DSCR Investment", href: "/investment/dscr" },
      {
        label: "Construction",
        href: "/commercial/construction",
        children: [
          { label: "New Construction", href: "/commercial/construction/new-construction" },
          { label: "Renovation", href: "/commercial/construction/fix-and-flip-loans" }
        ]
      },
      { label: "Land Loans", href: "/investment/rental-property" },
      {
        label: "Specialty Lending",
        href: "/commercial/specialty-lending",
        children: [
          { label: "Commercial Loans", href: "/commercial" },
          { label: "HELOCs", href: "/commercial/specialty-lending/helocs" },
          { label: "Bank Statement Loans", href: "/commercial/specialty-lending" },
          { label: "1099 Loans", href: "/commercial/specialty-lending" },
          { label: "Jumbo Loans", href: "/commercial/specialty-lending" },
          { label: "Bridge Loans", href: "/investment/bridge-loans" },
          { label: "Reverse Mortgages", href: "/commercial/specialty-lending" },
          { label: "Buy Before You Sell Loans", href: "/commercial/specialty-lending" }
        ]
      }
    ]
  },
  {
    label: "Calculators",
    href: "/tools",
    description:
      "Rate and payment calculators that help borrowers make data-informed decisions.",
    sublinks: [
      { label: "Buydown Calculator", href: "/tools/buydown-calculator" },
      { label: "Refinance Calculator", href: "/tools/refinance-calculator" },
      { label: "Repayment Calculator", href: "/tools/repayment-calculator" }
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
  },
  {
    label: "Resources",
    href: "/mortgage-guides",
    description:
      "Educational resources, guides, and articles to support borrower decision-making.",
    sublinks: [
      { label: "Mortgage Guides", href: "/mortgage-guides" },
      { label: "All Articles", href: "/blog/articles" }
    ]
  }
];
