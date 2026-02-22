import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Refinance Loans",
  description: "Refinance loan pathways for rate-term adjustments and cash-out strategies."
};

const pages = [
  {
    title: "Home Refinance Loans",
    body: "Rate-and-term refinance options focused on payment and timeline goals.",
    href: "/tools/refinance-calculator"
  },
  {
    title: "Cash-out Refinancing",
    body: "Access home equity through refinance structures when financial goals require liquidity.",
    href: "/tools/refinance-calculator"
  }
];

const conventionalFixedRateItems = [
  "Competitive interest rates",
  "Programs for primary and second homes, investment properties",
  "Cancellable mortgage insurance",
  "Flexible term options (from 10-30 years)"
];

const conventionalGreatIf = [
  "Plan to stay in your home for a longer period of time",
  "Have good credit",
  "Want to refinance out of another loan to benefit from more favorable terms",
  "Have an FHA loan and can eliminate your mortgage insurance with a refinance"
];

const fhaStreamlineItems = [
  "Lower your rate and monthly payment",
  "Reduce your mortgage insurance premium",
  "Refinance from an ARM to a fixed-rate home loan",
  "Skip the appraisal and income verification"
];

const fhaStreamlineGreatIf = [
  "Have an existing FHA home loan and want to take advantage of a lower rate",
  "Do not have the equity or credit score to benefit from a conventional loan refinance"
];

const usdaStreamlineItems = [
  "Lower your USDA mortgage rate with streamline refinancing",
  "Save with competitive fixed rates",
  "Skip the appraisal",
  "Enjoy relaxed FICO and debt-to-income requirements"
];

const usdaStreamlineGreatIf = [
  "Have an existing USDA loan",
  "Can lower your rate and payment with a refinance",
  "Made your payments on time for the past 12 months"
];

export default function RefinanceLoansPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="kicker">Loan Options</div>
        <h1>Refinance Loans</h1>
        <p className="section-intro">
          Compare refinance pathways based on payment reduction, term strategy,
          and equity-access objectives.
        </p>
        <div className="grid-2">
          {pages.map((page) => (
            <Link key={page.title} href={page.href} className="card">
              <h3>{page.title}</h3>
              <p>{page.body}</p>
              <span className="link-arrow">Learn more</span>
            </Link>
          ))}
        </div>

        <div className="fha-programs">
          <article className="card">
            <h2>Home Refinance Loans</h2>
            <h3>Conventional Fixed-Rate Mortgages</h3>
            <ul className="fha-info-list">
              {conventionalFixedRateItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <h3>Great if you</h3>
            <ul className="fha-info-list">
              {conventionalGreatIf.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="card">
            <h3>FHA Streamline Refinance</h3>
            <ul className="fha-info-list">
              {fhaStreamlineItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <h3>Great if you</h3>
            <ul className="fha-info-list">
              {fhaStreamlineGreatIf.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="card">
            <h3>USDA Streamline</h3>
            <ul className="fha-info-list">
              {usdaStreamlineItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <h3>Great if you</h3>
            <ul className="fha-info-list">
              {usdaStreamlineGreatIf.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
