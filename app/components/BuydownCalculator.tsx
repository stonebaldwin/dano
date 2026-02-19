"use client";

import { useMemo, useState } from "react";
import { formatNumericInput, parseFormattedNumber } from "@/lib/numberFormat";

type BuydownType = "2-1" | "1-1";

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

export default function BuydownCalculator() {
  const [buydownType, setBuydownType] = useState<BuydownType>("2-1");
  const [loanTermYears, setLoanTermYears] = useState("30");
  const [loanAmount, setLoanAmount] = useState("450,000");
  const [interestRate, setInterestRate] = useState("6.75");
  const [totalFees, setTotalFees] = useState("4,500");

  const onNumericChange = (setter: (value: string) => void) => (value: string) => {
    setter(formatNumericInput(value));
  };

  const result = useMemo(() => {
    const years = Math.max(parseFormattedNumber(loanTermYears), 1);
    const principal = Math.max(parseFormattedNumber(loanAmount), 0);
    const noteRate = Math.max(parseFormattedNumber(interestRate), 0);
    const fees = Math.max(parseFormattedNumber(totalFees), 0);

    const notePayment = monthlyPrincipalAndInterest(principal, noteRate, years);

    const yearOneRate = Math.max(noteRate - (buydownType === "2-1" ? 2 : 1), 0);
    const yearTwoRate = Math.max(noteRate - 1, 0);

    const yearOnePayment = monthlyPrincipalAndInterest(principal, yearOneRate, years);
    const yearTwoPayment = monthlyPrincipalAndInterest(principal, yearTwoRate, years);

    const yearOneMonthlySavings = Math.max(notePayment - yearOnePayment, 0);
    const yearTwoMonthlySavings = Math.max(notePayment - yearTwoPayment, 0);

    const yearOneTotalSavings = yearOneMonthlySavings * 12;
    const yearTwoTotalSavings = yearTwoMonthlySavings * 12;
    const buydownFundsRequired = yearOneTotalSavings + yearTwoTotalSavings;

    return {
      years,
      principal,
      noteRate,
      fees,
      yearOneRate,
      yearTwoRate,
      notePayment,
      yearOnePayment,
      yearTwoPayment,
      yearOneMonthlySavings,
      yearTwoMonthlySavings,
      yearOneTotalSavings,
      yearTwoTotalSavings,
      buydownFundsRequired,
      totalUpfrontCost: buydownFundsRequired + fees
    };
  }, [buydownType, interestRate, loanAmount, loanTermYears, totalFees]);

  return (
    <div className="calculator-wrap">
      <div className="calculator-tabs" role="tablist" aria-label="Buydown Type Tabs">
        {(["2-1", "1-1"] as BuydownType[]).map((type) => (
          <button
            key={type}
            type="button"
            className={`calc-tab ${buydownType === type ? "is-active" : ""}`}
            onClick={() => setBuydownType(type)}
          >
            {type} Buydown
          </button>
        ))}
      </div>

      <div className="calculator-grid">
        <div className="card">
          <div className="calc-field-grid">
            <label>
              Buydown Type
              <select value={buydownType} onChange={(e) => setBuydownType(e.target.value as BuydownType)}>
                <option value="2-1">2-1</option>
                <option value="1-1">1-1</option>
              </select>
            </label>
            <label>
              Loan Term (Years)
              <input
                value={loanTermYears}
                onChange={(e) => onNumericChange(setLoanTermYears)(e.target.value)}
              />
            </label>
            <label>
              Total Loan Amount ($)
              <input
                value={loanAmount}
                onChange={(e) => onNumericChange(setLoanAmount)(e.target.value)}
              />
            </label>
            <label>
              Interest Rate (%)
              <input
                value={interestRate}
                onChange={(e) => onNumericChange(setInterestRate)(e.target.value)}
              />
            </label>
            <label>
              Total Fees ($)
              <input
                value={totalFees}
                onChange={(e) => onNumericChange(setTotalFees)(e.target.value)}
              />
            </label>
          </div>
        </div>

        <aside className="card card-soft calc-results">
          <div className="kicker">Buydown Results</div>
          <h2>{formatCurrency(result.notePayment)} / month at note rate</h2>

          <div className="calc-breakdown">
            <div><span>Year 1 Rate</span><strong>{result.yearOneRate.toFixed(2)}%</strong></div>
            <div><span>Year 1 Payment</span><strong>{formatCurrency(result.yearOnePayment)}</strong></div>
            <div><span>Year 1 Savings / Month</span><strong>{formatCurrency(result.yearOneMonthlySavings)}</strong></div>
            <div><span>Year 1 Total Savings</span><strong>{formatCurrency(result.yearOneTotalSavings)}</strong></div>
          </div>

          <hr />

          <div className="calc-breakdown">
            <div><span>Year 2 Rate</span><strong>{result.yearTwoRate.toFixed(2)}%</strong></div>
            <div><span>Year 2 Payment</span><strong>{formatCurrency(result.yearTwoPayment)}</strong></div>
            <div><span>Year 2 Savings / Month</span><strong>{formatCurrency(result.yearTwoMonthlySavings)}</strong></div>
            <div><span>Year 2 Total Savings</span><strong>{formatCurrency(result.yearTwoTotalSavings)}</strong></div>
          </div>

          <hr />

          <div className="calc-breakdown">
            <div><span>Year 3+ Payment (Note Rate)</span><strong>{formatCurrency(result.notePayment)}</strong></div>
            <div><span>Estimated Buydown Funds Required</span><strong>{formatCurrency(result.buydownFundsRequired)}</strong></div>
            <div><span>Total Fees</span><strong>{formatCurrency(result.fees)}</strong></div>
            <div><span>Total Upfront Cost</span><strong>{formatCurrency(result.totalUpfrontCost)}</strong></div>
          </div>

          <p className="muted-meta">
            Illustrative estimate based on principal and interest only. Final buydown terms,
            qualifying payment, and fees are set by lender guidelines and disclosures.
          </p>
        </aside>
      </div>
    </div>
  );
}
