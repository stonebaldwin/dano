"use client";

import { useMemo, useState } from "react";
import { formatNumericInput, parseFormattedNumber } from "@/lib/numberFormat";

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

function remainingBalance(
  originalLoanAmount: number,
  annualRate: number,
  originalTermYears: number,
  remainingTermYears: number
) {
  const totalMonths = Math.max(originalTermYears * 12, 1);
  const remainingMonths = Math.min(Math.max(remainingTermYears * 12, 0), totalMonths);
  const paidMonths = totalMonths - remainingMonths;
  const r = annualRate / 100 / 12;
  const payment = monthlyPrincipalAndInterest(originalLoanAmount, annualRate, originalTermYears);

  if (r === 0) {
    const principalPaid = Math.min((originalLoanAmount / totalMonths) * paidMonths, originalLoanAmount);
    return Math.max(originalLoanAmount - principalPaid, 0);
  }

  const growth = Math.pow(1 + r, paidMonths);
  const balance = originalLoanAmount * growth - payment * ((growth - 1) / r);
  return Math.max(balance, 0);
}

export default function RefinanceCalculator() {
  const [originalLoanAmount, setOriginalLoanAmount] = useState("450,000");
  const [originalLoanTermYears, setOriginalLoanTermYears] = useState("30");
  const [remainingTermYears, setRemainingTermYears] = useState("25");
  const [currentInterestRate, setCurrentInterestRate] = useState("6.75");

  const [newLoanTermYears, setNewLoanTermYears] = useState("30");
  const [newInterestRate, setNewInterestRate] = useState("6.00");
  const [points, setPoints] = useState("1");
  const [costsAndFees, setCostsAndFees] = useState("4,500");
  const [cashOutAmount, setCashOutAmount] = useState("0");

  const onNumericChange = (setter: (value: string) => void) => (value: string) => {
    setter(formatNumericInput(value));
  };

  const result = useMemo(() => {
    const originalAmount = Math.max(parseFormattedNumber(originalLoanAmount), 0);
    const originalTerm = Math.max(parseFormattedNumber(originalLoanTermYears), 1);
    const remainingTerm = Math.max(parseFormattedNumber(remainingTermYears), 0);
    const currentRate = Math.max(parseFormattedNumber(currentInterestRate), 0);

    const refiTerm = Math.max(parseFormattedNumber(newLoanTermYears), 1);
    const refiRate = Math.max(parseFormattedNumber(newInterestRate), 0);
    const pointsPct = Math.max(parseFormattedNumber(points), 0);
    const fees = Math.max(parseFormattedNumber(costsAndFees), 0);
    const cashOut = Math.max(parseFormattedNumber(cashOutAmount), 0);

    const currentMonthlyPayment = monthlyPrincipalAndInterest(originalAmount, currentRate, originalTerm);
    const currentBalance = remainingBalance(
      originalAmount,
      currentRate,
      originalTerm,
      remainingTerm
    );
    const remainingMonths = Math.max(Math.round(remainingTerm * 12), 0);
    const currentRemainingInterest = Math.max(
      currentMonthlyPayment * remainingMonths - currentBalance,
      0
    );

    const baseNewLoanAmount = currentBalance + cashOut;
    const pointsAmount = baseNewLoanAmount * (pointsPct / 100);
    const totalClosingCosts = fees + pointsAmount;
    const newLoanAmount = baseNewLoanAmount + totalClosingCosts;
    const newMonthlyPayment = monthlyPrincipalAndInterest(newLoanAmount, refiRate, refiTerm);
    const newMonths = refiTerm * 12;
    const newTotalInterest = Math.max(newMonthlyPayment * newMonths - newLoanAmount, 0);

    const monthlySavings = currentMonthlyPayment - newMonthlyPayment;
    const breakEvenMonths =
      monthlySavings > 0 ? totalClosingCosts / monthlySavings : null;

    return {
      currentMonthlyPayment,
      currentBalance,
      remainingMonths,
      currentRemainingInterest,
      baseNewLoanAmount,
      pointsAmount,
      totalClosingCosts,
      newLoanAmount,
      newMonthlyPayment,
      newTotalInterest,
      monthlySavings,
      breakEvenMonths
    };
  }, [
    cashOutAmount,
    costsAndFees,
    currentInterestRate,
    newInterestRate,
    newLoanTermYears,
    originalLoanAmount,
    originalLoanTermYears,
    points,
    remainingTermYears
  ]);

  return (
    <div className="calculator-wrap">
      <div className="calculator-grid">
        <div className="card">
          <h3>Current Loan</h3>
          <div className="calc-field-grid">
            <label>
              Original Loan Amount ($)
              <input
                value={originalLoanAmount}
                onChange={(e) => onNumericChange(setOriginalLoanAmount)(e.target.value)}
              />
            </label>
            <label>
              Original Loan Term (Years)
              <input
                value={originalLoanTermYears}
                onChange={(e) => onNumericChange(setOriginalLoanTermYears)(e.target.value)}
              />
            </label>
            <label>
              Remaining Term (Years)
              <input
                value={remainingTermYears}
                onChange={(e) => onNumericChange(setRemainingTermYears)(e.target.value)}
              />
            </label>
            <label>
              Interest Rate (%)
              <input
                value={currentInterestRate}
                onChange={(e) => onNumericChange(setCurrentInterestRate)(e.target.value)}
              />
            </label>
          </div>

          <div className="calc-program-box">
            <h3>New Loan</h3>
            <div className="calc-field-grid">
              <label>
                New Loan Term (Years)
                <input
                  value={newLoanTermYears}
                  onChange={(e) => onNumericChange(setNewLoanTermYears)(e.target.value)}
                />
              </label>
              <label>
                Interest Rate (%)
                <input
                  value={newInterestRate}
                  onChange={(e) => onNumericChange(setNewInterestRate)(e.target.value)}
                />
              </label>
              <label>
                Points (%)
                <input
                  value={points}
                  onChange={(e) => onNumericChange(setPoints)(e.target.value)}
                />
              </label>
              <label>
                Costs and Fees ($)
                <input
                  value={costsAndFees}
                  onChange={(e) => onNumericChange(setCostsAndFees)(e.target.value)}
                />
              </label>
              <label>
                Cash Out Amount ($)
                <input
                  value={cashOutAmount}
                  onChange={(e) => onNumericChange(setCashOutAmount)(e.target.value)}
                />
              </label>
            </div>
          </div>
        </div>

        <aside className="card card-soft calc-results">
          <div className="kicker">Refinance Results</div>
          <h2>{formatCurrency(result.newMonthlyPayment)} / month new payment</h2>

          <div className="calc-breakdown">
            <div><span>Current Monthly Payment</span><strong>{formatCurrency(result.currentMonthlyPayment)}</strong></div>
            <div><span>Estimated Current Balance</span><strong>{formatCurrency(result.currentBalance)}</strong></div>
            <div><span>New Monthly Payment</span><strong>{formatCurrency(result.newMonthlyPayment)}</strong></div>
            <div><span>Monthly Change</span><strong>{formatCurrency(result.monthlySavings)}</strong></div>
          </div>

          <hr />

          <div className="calc-breakdown">
            <div><span>Points Cost</span><strong>{formatCurrency(result.pointsAmount)}</strong></div>
            <div><span>Costs and Fees</span><strong>{formatCurrency(result.totalClosingCosts - result.pointsAmount)}</strong></div>
            <div><span>Total Closing Costs</span><strong>{formatCurrency(result.totalClosingCosts)}</strong></div>
            <div><span>New Loan Amount</span><strong>{formatCurrency(result.newLoanAmount)}</strong></div>
          </div>

          <hr />

          <div className="calc-breakdown">
            <div><span>Current Remaining Interest</span><strong>{formatCurrency(result.currentRemainingInterest)}</strong></div>
            <div><span>New Loan Total Interest</span><strong>{formatCurrency(result.newTotalInterest)}</strong></div>
            <div><span>Break-Even</span><strong>{result.breakEvenMonths ? `${Math.ceil(result.breakEvenMonths)} months` : "No payment savings"}</strong></div>
          </div>

          <p className="muted-meta">
            Estimate only. This model assumes points and fees are financed into the new loan amount.
          </p>
        </aside>
      </div>
    </div>
  );
}
