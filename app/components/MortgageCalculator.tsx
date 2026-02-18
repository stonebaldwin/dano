"use client";

import { useMemo, useState } from "react";

type Program = "Conventional" | "FHA" | "VA" | "USDA";
type DownPaymentMode = "percent" | "amount";

function toNumber(value: string) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

function monthlyPrincipalAndInterest(
  loanAmount: number,
  annualRate: number,
  years: number
) {
  const n = years * 12;
  if (n <= 0) return 0;

  const r = annualRate / 100 / 12;
  if (r === 0) return loanAmount / n;

  return (loanAmount * r) / (1 - Math.pow(1 + r, -n));
}

export default function MortgageCalculator() {
  const [program, setProgram] = useState<Program>("Conventional");
  const [purchasePrice, setPurchasePrice] = useState("450000");
  const [termYears, setTermYears] = useState("30");
  const [downPaymentMode, setDownPaymentMode] = useState<DownPaymentMode>("percent");
  const [downPaymentInput, setDownPaymentInput] = useState("10");
  const [interestRate, setInterestRate] = useState("6.75");
  const [annualTaxes, setAnnualTaxes] = useState("4200");
  const [annualInsurance, setAnnualInsurance] = useState("1650");
  const [monthlyHoa, setMonthlyHoa] = useState("120");
  const [closingCosts, setClosingCosts] = useState("8500");
  const [fhaUfMIPRate, setFhaUfMIPRate] = useState("1.75");
  const [vaFundingFeeRate, setVaFundingFeeRate] = useState("2.15");
  const [financeProgramFee, setFinanceProgramFee] = useState(true);

  const result = useMemo(() => {
    const price = Math.max(toNumber(purchasePrice), 0);
    const years = Math.max(toNumber(termYears), 1);
    const rate = Math.max(toNumber(interestRate), 0);
    const taxes = Math.max(toNumber(annualTaxes), 0);
    const insurance = Math.max(toNumber(annualInsurance), 0);
    const hoa = Math.max(toNumber(monthlyHoa), 0);
    const closing = Math.max(toNumber(closingCosts), 0);

    const downPaymentAmount =
      downPaymentMode === "percent"
        ? (price * Math.max(toNumber(downPaymentInput), 0)) / 100
        : Math.max(toNumber(downPaymentInput), 0);

    const cappedDownPayment = Math.min(downPaymentAmount, price);
    const baseLoanAmount = Math.max(price - cappedDownPayment, 0);

    let programFee = 0;

    if (program === "FHA") {
      programFee = baseLoanAmount * (Math.max(toNumber(fhaUfMIPRate), 0) / 100);
    }

    if (program === "VA") {
      programFee = baseLoanAmount * (Math.max(toNumber(vaFundingFeeRate), 0) / 100);
    }

    const financedLoanAmount = financeProgramFee
      ? baseLoanAmount + programFee
      : baseLoanAmount;

    const monthlyPI = monthlyPrincipalAndInterest(financedLoanAmount, rate, years);
    const monthlyTaxes = taxes / 12;
    const monthlyInsurancePayment = insurance / 12;

    const estimatedMonthlyPayment = monthlyPI + monthlyTaxes + monthlyInsurancePayment + hoa;

    const cashToClose =
      cappedDownPayment +
      closing +
      (financeProgramFee ? 0 : programFee);

    return {
      downPaymentAmount: cappedDownPayment,
      baseLoanAmount,
      programFee,
      financedLoanAmount,
      monthlyPI,
      monthlyTaxes,
      monthlyInsurancePayment,
      hoa,
      estimatedMonthlyPayment,
      cashToClose
    };
  }, [
    annualInsurance,
    annualTaxes,
    closingCosts,
    downPaymentInput,
    downPaymentMode,
    fhaUfMIPRate,
    financeProgramFee,
    interestRate,
    monthlyHoa,
    program,
    purchasePrice,
    termYears,
    vaFundingFeeRate
  ]);

  const showProgramFeeOptions = program === "FHA" || program === "VA";

  return (
    <div className="calculator-wrap">
      <div className="calculator-tabs" role="tablist" aria-label="Loan Program Tabs">
        {(["Conventional", "FHA", "VA", "USDA"] as Program[]).map((tab) => (
          <button
            key={tab}
            type="button"
            className={`calc-tab ${program === tab ? "is-active" : ""}`}
            onClick={() => setProgram(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="calculator-grid">
        <div className="card">
          <div className="calc-field-grid">
            <label>
              Purchase Price
              <input value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} />
            </label>
            <label>
              Mortgage Term (Years)
              <input value={termYears} onChange={(e) => setTermYears(e.target.value)} />
            </label>
            <div>
              <span className="calc-label">Down Payment</span>
              <div className="calc-toggle-row">
                <button
                  type="button"
                  className={`calc-mini-toggle ${downPaymentMode === "percent" ? "is-active" : ""}`}
                  onClick={() => setDownPaymentMode("percent")}
                >
                  %
                </button>
                <button
                  type="button"
                  className={`calc-mini-toggle ${downPaymentMode === "amount" ? "is-active" : ""}`}
                  onClick={() => setDownPaymentMode("amount")}
                >
                  $
                </button>
              </div>
              <input
                value={downPaymentInput}
                onChange={(e) => setDownPaymentInput(e.target.value)}
              />
            </div>
            <label>
              Interest Rate (%)
              <input value={interestRate} onChange={(e) => setInterestRate(e.target.value)} />
            </label>
            <label>
              Annual Taxes ($)
              <input value={annualTaxes} onChange={(e) => setAnnualTaxes(e.target.value)} />
            </label>
            <label>
              Annual Insurance ($)
              <input value={annualInsurance} onChange={(e) => setAnnualInsurance(e.target.value)} />
            </label>
            <label>
              Monthly HOA ($)
              <input value={monthlyHoa} onChange={(e) => setMonthlyHoa(e.target.value)} />
            </label>
            <label>
              Est. Closing Costs ($)
              <input value={closingCosts} onChange={(e) => setClosingCosts(e.target.value)} />
            </label>
          </div>

          {program === "FHA" ? (
            <div className="calc-program-box">
              <label>
                FHA Up-Front MIP (%)
                <input value={fhaUfMIPRate} onChange={(e) => setFhaUfMIPRate(e.target.value)} />
              </label>
              <label className="calc-check-row">
                <input
                  type="checkbox"
                  checked={financeProgramFee}
                  onChange={(e) => setFinanceProgramFee(e.target.checked)}
                />
                Finance UFMIP into loan amount
              </label>
            </div>
          ) : null}

          {program === "VA" ? (
            <div className="calc-program-box">
              <label>
                VA First-Time Funding Fee (%)
                <input value={vaFundingFeeRate} onChange={(e) => setVaFundingFeeRate(e.target.value)} />
              </label>
              <label className="calc-check-row">
                <input
                  type="checkbox"
                  checked={financeProgramFee}
                  onChange={(e) => setFinanceProgramFee(e.target.checked)}
                />
                Finance funding fee into loan amount
              </label>
            </div>
          ) : null}
        </div>

        <aside className="card card-soft calc-results">
          <div className="kicker">Estimated Payment</div>
          <h2>{formatCurrency(result.estimatedMonthlyPayment)} / month</h2>

          <div className="calc-breakdown">
            <div><span>Principal + Interest</span><strong>{formatCurrency(result.monthlyPI)}</strong></div>
            <div><span>Property Taxes</span><strong>{formatCurrency(result.monthlyTaxes)}</strong></div>
            <div><span>Home Insurance</span><strong>{formatCurrency(result.monthlyInsurancePayment)}</strong></div>
            <div><span>HOA</span><strong>{formatCurrency(result.hoa)}</strong></div>
          </div>

          <hr />

          <div className="calc-breakdown">
            <div><span>Down Payment</span><strong>{formatCurrency(result.downPaymentAmount)}</strong></div>
            <div><span>Base Loan Amount</span><strong>{formatCurrency(result.baseLoanAmount)}</strong></div>
            {showProgramFeeOptions ? (
              <div>
                <span>{program === "FHA" ? "FHA UFMIP" : "VA Funding Fee"}</span>
                <strong>{formatCurrency(result.programFee)}</strong>
              </div>
            ) : null}
            <div><span>Financed Loan Amount</span><strong>{formatCurrency(result.financedLoanAmount)}</strong></div>
            <div><span>Estimated Cash to Close</span><strong>{formatCurrency(result.cashToClose)}</strong></div>
          </div>

          <p className="muted-meta">
            Estimate only. Final qualification, APR, mortgage insurance, escrows,
            and closing figures are determined by full underwriting and lender disclosures.
          </p>
        </aside>
      </div>
    </div>
  );
}
