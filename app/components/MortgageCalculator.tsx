"use client";

import { useMemo, useState } from "react";
import { formatNumericInput, parseFormattedNumber } from "@/lib/numberFormat";

type Program = "Conventional" | "FHA" | "VA" | "USDA";
type DownPaymentMode = "percent" | "amount";
type FrequencyMode = "yearly" | "monthly";

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
  const [purchasePrice, setPurchasePrice] = useState("450,000");
  const [termYears, setTermYears] = useState("30");
  const [downPaymentMode, setDownPaymentMode] = useState<DownPaymentMode>("percent");
  const [downPaymentInput, setDownPaymentInput] = useState("10");
  const [interestRate, setInterestRate] = useState("6.75");
  const [taxesInput, setTaxesInput] = useState("4,200");
  const [taxesMode, setTaxesMode] = useState<FrequencyMode>("yearly");
  const [insuranceInput, setInsuranceInput] = useState("1,650");
  const [insuranceMode, setInsuranceMode] = useState<FrequencyMode>("yearly");
  const [monthlyPmi, setMonthlyPmi] = useState("0");
  const [monthlyHoa, setMonthlyHoa] = useState("120");
  const [closingCosts, setClosingCosts] = useState("8,500");
  const [fhaUfMIPRate, setFhaUfMIPRate] = useState("1.75");
  const [vaFundingFeeRate, setVaFundingFeeRate] = useState("2.15");
  const [financeProgramFee, setFinanceProgramFee] = useState(true);

  const onNumericChange = (setter: (value: string) => void) => (value: string) => {
    setter(formatNumericInput(value));
  };

  const result = useMemo(() => {
    const price = Math.max(parseFormattedNumber(purchasePrice), 0);
    const years = Math.max(parseFormattedNumber(termYears), 1);
    const rate = Math.max(parseFormattedNumber(interestRate), 0);
    const taxes = Math.max(parseFormattedNumber(taxesInput), 0);
    const insurance = Math.max(parseFormattedNumber(insuranceInput), 0);
    const pmi = Math.max(parseFormattedNumber(monthlyPmi), 0);
    const hoa = Math.max(parseFormattedNumber(monthlyHoa), 0);
    const closing = Math.max(parseFormattedNumber(closingCosts), 0);

    const downPaymentAmount =
      downPaymentMode === "percent"
        ? (price * Math.max(parseFormattedNumber(downPaymentInput), 0)) / 100
        : Math.max(parseFormattedNumber(downPaymentInput), 0);

    const cappedDownPayment = Math.min(downPaymentAmount, price);
    const baseLoanAmount = Math.max(price - cappedDownPayment, 0);

    let programFee = 0;

    if (program === "FHA") {
      programFee = baseLoanAmount * (Math.max(parseFormattedNumber(fhaUfMIPRate), 0) / 100);
    }

    if (program === "VA") {
      programFee = baseLoanAmount * (Math.max(parseFormattedNumber(vaFundingFeeRate), 0) / 100);
    }

    const financedLoanAmount = financeProgramFee
      ? baseLoanAmount + programFee
      : baseLoanAmount;

    const monthlyPI = monthlyPrincipalAndInterest(financedLoanAmount, rate, years);
    const monthlyTaxes = taxesMode === "monthly" ? taxes : taxes / 12;
    const monthlyInsurancePayment = insuranceMode === "monthly" ? insurance : insurance / 12;

    const monthlyPmiPayment = program === "Conventional" || program === "FHA" ? pmi : 0;

    const estimatedMonthlyPayment =
      monthlyPI + monthlyTaxes + monthlyInsurancePayment + monthlyPmiPayment + hoa;

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
      monthlyPmiPayment,
      hoa,
      estimatedMonthlyPayment,
      cashToClose
    };
  }, [
    closingCosts,
    downPaymentInput,
    downPaymentMode,
    fhaUfMIPRate,
    financeProgramFee,
    insuranceInput,
    insuranceMode,
    interestRate,
    monthlyPmi,
    monthlyHoa,
    program,
    purchasePrice,
    taxesInput,
    taxesMode,
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
              <input value={purchasePrice} onChange={(e) => onNumericChange(setPurchasePrice)(e.target.value)} />
            </label>
            <label>
              Mortgage Term (Years)
              <input value={termYears} onChange={(e) => onNumericChange(setTermYears)(e.target.value)} />
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
                onChange={(e) => onNumericChange(setDownPaymentInput)(e.target.value)}
              />
            </div>
            <label>
              Interest Rate (%)
              <input value={interestRate} onChange={(e) => onNumericChange(setInterestRate)(e.target.value)} />
            </label>
            <label>
              Property Taxes ($)
              <div className="calc-toggle-row calc-toggle-row-choice">
                <button
                  type="button"
                  className={`calc-mini-toggle calc-mini-toggle-choice ${taxesMode === "yearly" ? "is-active" : ""}`}
                  onClick={() => setTaxesMode("yearly")}
                >
                  Yearly
                </button>
                <button
                  type="button"
                  className={`calc-mini-toggle calc-mini-toggle-choice ${taxesMode === "monthly" ? "is-active" : ""}`}
                  onClick={() => setTaxesMode("monthly")}
                >
                  Monthly
                </button>
              </div>
              <input value={taxesInput} onChange={(e) => onNumericChange(setTaxesInput)(e.target.value)} />
            </label>
            <label>
              Home Insurance ($)
              <div className="calc-toggle-row calc-toggle-row-choice">
                <button
                  type="button"
                  className={`calc-mini-toggle calc-mini-toggle-choice ${insuranceMode === "yearly" ? "is-active" : ""}`}
                  onClick={() => setInsuranceMode("yearly")}
                >
                  Yearly
                </button>
                <button
                  type="button"
                  className={`calc-mini-toggle calc-mini-toggle-choice ${insuranceMode === "monthly" ? "is-active" : ""}`}
                  onClick={() => setInsuranceMode("monthly")}
                >
                  Monthly
                </button>
              </div>
              <input value={insuranceInput} onChange={(e) => onNumericChange(setInsuranceInput)(e.target.value)} />
            </label>
            {program === "Conventional" || program === "FHA" ? (
              <label>
                Monthly PMI ($)
                <input value={monthlyPmi} onChange={(e) => onNumericChange(setMonthlyPmi)(e.target.value)} />
              </label>
            ) : null}
            <label>
              Monthly HOA ($)
              <input value={monthlyHoa} onChange={(e) => onNumericChange(setMonthlyHoa)(e.target.value)} />
            </label>
            <label>
              Est. Closing Costs ($)
              <input value={closingCosts} onChange={(e) => onNumericChange(setClosingCosts)(e.target.value)} />
            </label>
          </div>

          {program === "FHA" ? (
            <div className="calc-program-box">
              <label>
                FHA Up-Front MIP (%)
                <input value={fhaUfMIPRate} onChange={(e) => onNumericChange(setFhaUfMIPRate)(e.target.value)} />
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
                <input value={vaFundingFeeRate} onChange={(e) => onNumericChange(setVaFundingFeeRate)(e.target.value)} />
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
            {program === "Conventional" || program === "FHA" ? (
              <div><span>PMI</span><strong>{formatCurrency(result.monthlyPmiPayment)}</strong></div>
            ) : null}
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
