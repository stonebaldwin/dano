import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FHA Loans",
  description:
    "FHA loan matrix with minimum score, maximum LTV by purpose, and maximum DTI guidance."
};

const fhaRows = [
  {
    characteristic: "Min Score",
    purpose: "-",
    primary: "600",
    overlays: "580"
  },
  {
    characteristic: "Max LTV",
    purpose: "Purchase",
    primary: "96.50%",
    overlays: "-"
  },
  {
    characteristic: "",
    purpose: "Rate Term/Limited Refinance",
    primary: "97.75%",
    overlays: "-"
  },
  {
    characteristic: "",
    purpose: "Cash Out Refinance",
    primary: "80.00%",
    overlays: "-"
  },
  {
    characteristic: "Max DTI",
    purpose: "-",
    primary: "per AUS",
    overlays: "45%"
  }
];

const fhaPurchaseInfo = [
  "Down payment options as low as 3.5%",
  "Allows a broader range of income, debt, and credit history than conventional mortgages",
  "Access to streamlined refinance programs"
];

const fhaStreamlineInfo = [
  "Options to lower your payment without extending the length of your loan",
  "Reduced income and credit documentation",
  "No appraisal",
  "Low or no-cost options available"
];

const fhaCashOutInfo = [
  "Pay off higher interest rate debt, such as credit cards",
  "Make value-adding improvements to your home",
  "The Cash-Out Refinance Loan can also be used to refinance a non-FHA loan into an FHA loan",
  "Pennymac will lend up to 80% of the value of your home*"
];

export default function FhaPage() {
  return (
    <section className="section fha-page">
      <div className="container">
        <article className="card fha-hero">
          <h1>FHA Loans</h1>
          <p className="section-intro">
            FHA financing can offer flexible qualification and higher LTV options
            for many buyers and refinancers. Use this matrix for quick FHA
            guideline reference.
          </p>
          <p>
            A popular choice for first-time homeowners, FHA loans are a great
            way to secure financing for borrowers who have less money to put down
            on a new house and lack the credit history to qualify for a
            conventional loan.
          </p>
          <ul className="fha-info-list">
            <li>Broader qualification requirements</li>
            <li>Flexible down payment options below 20%</li>
            <li>Eligible for Streamline refinancing</li>
          </ul>
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
                {fhaRows.map((row, index) => (
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

        <div className="fha-programs">
          <article className="card">
            <h2>FHA Purchase Loan</h2>
            <p>
              An FHA loan can be easier to qualify for than some conventional
              mortgage programs, making it a great option for many first-time
              homebuyers. The flexibility of having lower down payment
              requirements, tolerance for a wider range of credit histories and
              the potential for easier future refinancing makes FHA loans a
              better match for buyers that may not have the right financial
              profile for other types of home loans.
            </p>
            <h3>Rates &amp; More Info</h3>
            <ul className="fha-info-list">
              {fhaPurchaseInfo.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="card">
            <h2>FHA Streamline Refinance</h2>
            <p>
              The FHA Streamline Refinance is a special mortgage product
              reserved for borrowers with existing FHA loans.* The program
              allows homeowners to bypass many of the traditional underwriting
              requirements. This means far less documentation will be required,
              and you do not have to get another appraisal (simplicity meets
              affordability).
            </p>
            <h3>Rates &amp; More Info</h3>
            <ul className="fha-info-list">
              {fhaStreamlineInfo.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="fha-note">
              *By refinancing your existing loan, your total finance charges may
              be higher over the life of the loan.
            </p>
          </article>

          <article className="card">
            <h2>FHA Cash-Out Refinance</h2>
            <p>
              The FHA&apos;s Cash-Out Refinance Loan is for homeowners who want to
              take cash out of their home equity to pay off debt, fund school
              tuition, make home improvements or any number of purposes. As home
              values continue to rise across the country and interest rates
              remain incredibly low, now may be a great time to consider an FHA
              Cash-Out Refinance.
            </p>
            <h3>Rates &amp; More Info</h3>
            <ul className="fha-info-list">
              {fhaCashOutInfo.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="fha-note">
              *Loan limits are established by the FHA and can vary by county.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
