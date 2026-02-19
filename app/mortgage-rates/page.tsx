import type { Metadata } from "next";
import { getMortgageRatesSnapshot } from "@/lib/mortgageRates";

export const metadata: Metadata = {
  title: "Mortgage Rates",
  description: "Today's mortgage rates sourced from Mortgage News Daily with current market updates."
};

export default async function MortgageRatesPage() {
  const snapshot = await getMortgageRatesSnapshot();

  return (
    <section className="section">
      <div className="container">
        <div className="kicker">Mortgage Rates</div>
        <h1>Today&apos;s Mortgage Rates</h1>
        <p className="section-intro">
          Daily market rates and trend data sourced from Mortgage News Daily.
          {snapshot.updatedLabel ? ` Last updated: ${snapshot.updatedLabel}.` : ""}
        </p>

        <div className="grid-2">
          <article className="card">
            <h3>Current Market Rates</h3>
            <div className="calc-breakdown">
              {snapshot.products.map((product) => (
                <div key={product.key}>
                  <span>{product.key}</span>
                  <strong>
                    {product.rate > 0 ? `${product.rate.toFixed(2)}%` : "--"}{" "}
                    <small style={{ color: "#6a655b", fontWeight: 600 }}>
                      {product.change > 0 ? "+" : ""}
                      {product.change.toFixed(2)}%
                    </small>
                  </strong>
                </div>
              ))}
            </div>
          </article>

          <article className="card card-soft">
            <h3>30 Year Fixed Trend (30 Days)</h3>
            <div className="calc-table-wrap">
              <table className="calc-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Rate</th>
                    <th>Change</th>
                  </tr>
                </thead>
                <tbody>
                  {[...snapshot.history30YrFixed].reverse().slice(0, 30).map((point) => (
                    <tr key={point.isoDate}>
                      <td>{point.dateLabel}</td>
                      <td>{point.rate > 0 ? `${point.rate.toFixed(2)}%` : "--"}</td>
                      <td>
                        {point.change > 0 ? "+" : ""}
                        {point.change.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="muted-meta">
              Source:{" "}
              <a href={snapshot.sourceUrl} target="_blank" rel="noreferrer">
                Mortgage News Daily
              </a>
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
