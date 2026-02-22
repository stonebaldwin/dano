import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conventional Loans",
  description:
    "Conventional loan matrix with minimum score, maximum LTV by occupancy and purpose, and maximum DTI guidance."
};

const ltvRows = [
  {
    characteristic: "Min Score",
    purpose: "-",
    primary: "620",
    secondHome: "620",
    investment: "620"
  },
  {
    characteristic: "Max LTV",
    purpose: "Purchase",
    primary: "97%",
    secondHome: "90%",
    investment: "85%"
  },
  {
    characteristic: "",
    purpose: "Rate Term/Limited Refinance",
    primary: "95%",
    secondHome: "90%",
    investment: "75% FNMA / 85% FHLMC"
  },
  {
    characteristic: "",
    purpose: "Cash Out Refinance",
    primary: "80%",
    secondHome: "75%",
    investment: "75%"
  },
  {
    characteristic: "Max DTI",
    purpose: "-",
    primary: "50%",
    secondHome: "50%",
    investment: "50%"
  }
];

export default function ConventionalPage() {
  return (
    <section className="section conventional-page">
      <div className="container">
        <article className="card conventional-hero">
          <h1>Conventional Loans</h1>
          <p className="section-intro">
            Conventional financing can offer strong flexibility across primary,
            second-home, and investment scenarios. Use this quick matrix as a
            guideline for minimum credit score, maximum LTV, and maximum DTI.
          </p>
          <h2 className="conventional-fit-title">
            A Conventional Loan May Be a Great Fit if You:
          </h2>
          <ul className="conventional-fit-list">
            <li>Have good to excellent credit</li>
            <li>Maintain a debt-to-income ratio (DTI) of 45% or lower</li>
            <li>
              Want to avoid mortgage insurance with a loan-to-value (LTV) of 80%
              or lower
            </li>
          </ul>
        </article>

        <article className="card conventional-card">
          <div className="conventional-matrix-wrap">
            <table className="conventional-matrix">
              <thead>
                <tr>
                  <th>Characteristic</th>
                  <th>Purpose</th>
                  <th>Primary</th>
                  <th>2nd Home</th>
                  <th>Investment</th>
                </tr>
              </thead>
              <tbody>
                {ltvRows.map((row, index) => (
                  <tr key={`${row.purpose}-${index}`}>
                    <td>{row.characteristic || "-"}</td>
                    <td>{row.purpose}</td>
                    <td>{row.primary}</td>
                    <td>{row.secondHome}</td>
                    <td>{row.investment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </div>
    </section>
  );
}
