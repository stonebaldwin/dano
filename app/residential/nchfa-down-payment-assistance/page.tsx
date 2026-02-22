import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NCHFA Down Payment Assistance",
  description:
    "Overview of NC Home Advantage and NC 1st Home Advantage down payment assistance programs for eligible North Carolina homebuyers."
};

const eligibilityChecks = [
  "You are buying a home in North Carolina.",
  "Your income and home sales price do not exceed program limits.",
  "Your credit score is 640 or higher (660 if purchasing a manufactured home).",
  "You will occupy the home as your principal residence within 60 days of closing.",
  "You are a legal resident of the United States."
];

const homeAdvantageBullets = [
  "Open to both first-time and move-up home buyers.",
  "Down payment assistance up to 3% of the loan amount.",
  "0% interest, second mortgage forgivable in year 15.",
  "FHA, VA, USDA, and Conventional loan types are eligible."
];

const firstHomeBullets = [
  "For first-time home buyers and eligible military veterans.",
  "$15,000 in down payment assistance.",
  "0% interest, second mortgage forgivable in year 15.",
  "FHA, VA, USDA, and Conventional loan types are eligible."
];

export default function NchfaDownPaymentAssistancePage() {
  return (
    <section className="section">
      <div className="container">
        <h1>NCHFA Down Payment Assistance</h1>
        <p className="section-intro">
          The NC Home Advantage suite of products may provide the boost needed to
          make home ownership possible.
        </p>

        <div className="nchfa-grid">
          <article className="card nchfa-main-card">
            <h2>Am I Eligible?</h2>
            <ul className="nchfa-checklist">
              {eligibilityChecks.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <p className="nchfa-footnote">
              Income and sales price limits are available at{" "}
              <a
                href="https://www.nchfa.com/home-buyers/income-limits"
                target="_blank"
                rel="noreferrer"
              >
                www.nchfa.com/home-buyers/income-limits
              </a>
              .
            </p>
          </article>

          <aside className="nchfa-side-stack">
            <article className="card">
              <h3>NC Home Advantage Mortgage</h3>
              <ul className="nchfa-bullets">
                {homeAdvantageBullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>

            <article className="card">
              <h3>NC 1st Home Advantage Down Payment</h3>
              <ul className="nchfa-bullets">
                {firstHomeBullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>

          </aside>
        </div>

      </div>
    </section>
  );
}
