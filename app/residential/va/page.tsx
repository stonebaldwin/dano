import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VA Loans",
  description:
    "VA loan matrix with minimum score, maximum LTV by purpose, and maximum DTI guidance."
};

const vaRows = [
  {
    characteristic: "Min Score",
    purpose: "-",
    primary: "600",
    overlays: "580"
  },
  {
    characteristic: "Max LTV",
    purpose: "Purchase",
    primary: "100%",
    overlays: "100%"
  },
  {
    characteristic: "",
    purpose: "Rate Term/Limited Refinance",
    primary: "100%",
    overlays: "100%"
  },
  {
    characteristic: "",
    purpose: "Cash Out Refinance",
    primary: "100%",
    overlays: "100%"
  },
  {
    characteristic: "Max DTI",
    purpose: "-",
    primary: "per AUS",
    overlays: "per AUS"
  }
];

export default function VaPage() {
  return (
    <section className="section fha-page">
      <div className="container">
        <article className="card fha-hero">
          <h1>VA Loans</h1>
          <p className="section-intro">
            VA financing can provide strong benefits for eligible service
            members, veterans, and surviving spouses. Use this matrix for quick
            program guideline reference.
          </p>
        </article>

        <article className="card conventional-card">
          <div className="conventional-matrix-wrap">
            <table className="conventional-matrix fha-matrix">
              <thead>
                <tr>
                  <th>Characteristic</th>
                  <th>Purpose</th>
                  <th>Primary*</th>
                  <th>With Overlays</th>
                </tr>
              </thead>
              <tbody>
                {vaRows.map((row, index) => (
                  <tr key={`${row.purpose}-${index}`}>
                    <td>{row.characteristic || "-"}</td>
                    <td>{row.purpose}</td>
                    <td>{row.primary}</td>
                    <td>{row.overlays}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="card" style={{ marginTop: "1rem" }}>
          <h2>VA Purchase Loan</h2>
          <ul className="fha-info-list">
            <li>Skip the down payment, unlike conventional or FHA loans*</li>
            <li>Be free from mortgage insurance</li>
            <li>Save with lower interest rates than other loans</li>
            <li>Finance the funding fee into the loan, if desired</li>
          </ul>
          <h3>Great for</h3>
          <ul className="fha-info-list">
            <li>
              Qualifying active duty or former service members and surviving
              spouses buying a primary residence
            </li>
          </ul>
        </article>
      </div>
    </section>
  );
}
