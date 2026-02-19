"use client";

import { useMemo, useState } from "react";
import { formatNumericInput, parseFormattedNumber } from "@/lib/numberFormat";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
] as const;

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

function formatMonthYear(date: Date) {
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(date);
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

type Row = {
  paymentNumber: number;
  date: Date;
  payment: number;
  interest: number;
  principal: number;
  extraPrincipal: number;
  endingBalance: number;
};

function buildSchedule(
  principal: number,
  annualRate: number,
  termYears: number,
  extraPrincipal: number,
  purchaseMonthIndex: number,
  purchaseYear: number
) {
  const totalMonths = Math.max(termYears * 12, 1);
  const monthlyRate = Math.max(annualRate, 0) / 100 / 12;
  const basePayment = monthlyPrincipalAndInterest(principal, annualRate, termYears);

  let balance = Math.max(principal, 0);
  let month = 0;
  let totalInterest = 0;
  let totalPaid = 0;
  const rows: Row[] = [];

  while (balance > 0.01 && month < totalMonths * 2) {
    const date = new Date(purchaseYear, purchaseMonthIndex + month, 1);
    const interest = monthlyRate === 0 ? 0 : balance * monthlyRate;
    const scheduledPrincipal = Math.max(basePayment - interest, 0);
    const cappedPrincipal = Math.min(scheduledPrincipal, balance);
    const extra = Math.min(Math.max(extraPrincipal, 0), Math.max(balance - cappedPrincipal, 0));
    const principalPaid = cappedPrincipal + extra;
    const payment = interest + principalPaid;
    const endingBalance = Math.max(balance - principalPaid, 0);

    rows.push({
      paymentNumber: month + 1,
      date,
      payment,
      interest,
      principal: cappedPrincipal,
      extraPrincipal: extra,
      endingBalance
    });

    totalInterest += interest;
    totalPaid += payment;
    balance = endingBalance;
    month += 1;
  }

  return {
    rows,
    basePayment,
    totalInterest,
    totalPaid,
    monthsToPayoff: rows.length,
    payoffDate: rows.length ? rows[rows.length - 1].date : null
  };
}

export default function AmortizationCalculator() {
  const now = new Date();
  const [loanAmount, setLoanAmount] = useState("450,000");
  const [loanTermYears, setLoanTermYears] = useState("30");
  const [annualInterestRate, setAnnualInterestRate] = useState("6.75");
  const [apr, setApr] = useState("6.98");
  const [additionalMonthlyPrincipal, setAdditionalMonthlyPrincipal] = useState("0");
  const [purchaseMonth, setPurchaseMonth] = useState(String(now.getMonth()));
  const [purchaseYear, setPurchaseYear] = useState(String(now.getFullYear()));

  const onNumericChange = (setter: (value: string) => void) => (value: string) => {
    setter(formatNumericInput(value));
  };

  const result = useMemo(() => {
    const principal = Math.max(parseFormattedNumber(loanAmount), 0);
    const years = Math.max(parseFormattedNumber(loanTermYears), 1);
    const rate = Math.max(parseFormattedNumber(annualInterestRate), 0);
    const aprRate = Math.max(parseFormattedNumber(apr), 0);
    const extra = Math.max(parseFormattedNumber(additionalMonthlyPrincipal), 0);
    const monthIndex = Math.min(Math.max(parseFormattedNumber(purchaseMonth), 0), 11);
    const year = Math.max(parseFormattedNumber(purchaseYear), 1900);

    const withExtra = buildSchedule(principal, rate, years, extra, monthIndex, year);
    const withoutExtra = buildSchedule(principal, rate, years, 0, monthIndex, year);

    const aprMonthlyPayment = monthlyPrincipalAndInterest(principal, aprRate, years);
    const aprTotalPaid = aprMonthlyPayment * years * 12;
    const aprTotalInterest = Math.max(aprTotalPaid - principal, 0);

    const yearlySummary = withExtra.rows.reduce<
      Array<{
        year: number;
        payment: number;
        principal: number;
        interest: number;
        extraPrincipal: number;
        endingBalance: number;
      }>
    >((acc, row) => {
      const yearKey = row.date.getFullYear();
      const existing = acc.find((item) => item.year === yearKey);
      if (existing) {
        existing.payment += row.payment;
        existing.principal += row.principal;
        existing.interest += row.interest;
        existing.extraPrincipal += row.extraPrincipal;
        existing.endingBalance = row.endingBalance;
        return acc;
      }
      acc.push({
        year: yearKey,
        payment: row.payment,
        principal: row.principal,
        interest: row.interest,
        extraPrincipal: row.extraPrincipal,
        endingBalance: row.endingBalance
      });
      return acc;
    }, []);

    return {
      principal,
      years,
      withExtra,
      withoutExtra,
      aprRate,
      aprMonthlyPayment,
      aprTotalInterest,
      monthsSaved: Math.max(withoutExtra.monthsToPayoff - withExtra.monthsToPayoff, 0),
      interestSaved: Math.max(withoutExtra.totalInterest - withExtra.totalInterest, 0),
      yearlySummary
    };
  }, [
    additionalMonthlyPrincipal,
    annualInterestRate,
    apr,
    loanAmount,
    loanTermYears,
    purchaseMonth,
    purchaseYear
  ]);

  const first24Rows = result.withExtra.rows.slice(0, 24);

  return (
    <div className="calculator-wrap">
      <div className="calculator-grid">
        <div className="card">
          <div className="calc-field-grid">
            <label>
              Loan Amount ($)
              <input
                value={loanAmount}
                onChange={(e) => onNumericChange(setLoanAmount)(e.target.value)}
              />
            </label>
            <label>
              Term (Years)
              <input
                value={loanTermYears}
                onChange={(e) => onNumericChange(setLoanTermYears)(e.target.value)}
              />
            </label>
            <label>
              Annual Interest Rate (%)
              <input
                value={annualInterestRate}
                onChange={(e) => onNumericChange(setAnnualInterestRate)(e.target.value)}
              />
            </label>
            <label>
              APR (%)
              <input
                value={apr}
                onChange={(e) => onNumericChange(setApr)(e.target.value)}
              />
            </label>
            <label>
              Additional Monthly Principal ($)
              <input
                value={additionalMonthlyPrincipal}
                onChange={(e) => onNumericChange(setAdditionalMonthlyPrincipal)(e.target.value)}
              />
            </label>
            <label>
              Purchase Month
              <select value={purchaseMonth} onChange={(e) => setPurchaseMonth(e.target.value)}>
                {MONTHS.map((month, index) => (
                  <option key={month} value={index}>
                    {month}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Purchase Year
              <input
                value={purchaseYear}
                onChange={(e) => onNumericChange(setPurchaseYear)(e.target.value)}
              />
            </label>
          </div>
        </div>

        <aside className="card card-soft calc-results">
          <div className="kicker">Repayment Results</div>
          <h2>{formatCurrency(result.withExtra.basePayment)} / month</h2>

          <div className="calc-breakdown">
            <div><span>Base P&I Payment</span><strong>{formatCurrency(result.withExtra.basePayment)}</strong></div>
            <div><span>APR-Based Payment</span><strong>{formatCurrency(result.aprMonthlyPayment)}</strong></div>
            <div><span>Months to Payoff</span><strong>{result.withExtra.monthsToPayoff}</strong></div>
            <div><span>Payoff Date</span><strong>{result.withExtra.payoffDate ? formatMonthYear(result.withExtra.payoffDate) : "N/A"}</strong></div>
          </div>

          <hr />

          <div className="calc-breakdown">
            <div><span>Total Interest (With Extra)</span><strong>{formatCurrency(result.withExtra.totalInterest)}</strong></div>
            <div><span>Total Interest (No Extra)</span><strong>{formatCurrency(result.withoutExtra.totalInterest)}</strong></div>
            <div><span>Interest Saved</span><strong>{formatCurrency(result.interestSaved)}</strong></div>
            <div><span>Time Saved</span><strong>{result.monthsSaved} months</strong></div>
          </div>

          <hr />

          <div className="calc-breakdown">
            <div><span>APR Total Interest (Term)</span><strong>{formatCurrency(result.aprTotalInterest)}</strong></div>
          </div>

          <p className="muted-meta">
            Estimate only. APR comparison is illustrative and does not replace lender disclosures.
          </p>
        </aside>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Repayment Schedule (First 24 Payments)</h3>
        <div className="calc-table-wrap">
          <table className="calc-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Month</th>
                <th>Payment</th>
                <th>Principal</th>
                <th>Interest</th>
                <th>Extra Principal</th>
                <th>Ending Balance</th>
              </tr>
            </thead>
            <tbody>
              {first24Rows.map((row) => (
                <tr key={row.paymentNumber}>
                  <td>{row.paymentNumber}</td>
                  <td>{formatMonthYear(row.date)}</td>
                  <td>{formatCurrency(row.payment)}</td>
                  <td>{formatCurrency(row.principal)}</td>
                  <td>{formatCurrency(row.interest)}</td>
                  <td>{formatCurrency(row.extraPrincipal)}</td>
                  <td>{formatCurrency(row.endingBalance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Annual Summary</h3>
        <div className="calc-table-wrap">
          <table className="calc-table">
            <thead>
              <tr>
                <th>Year</th>
                <th>Total Payment</th>
                <th>Principal</th>
                <th>Interest</th>
                <th>Extra Principal</th>
                <th>Ending Balance</th>
              </tr>
            </thead>
            <tbody>
              {result.yearlySummary.map((year) => (
                <tr key={year.year}>
                  <td>{year.year}</td>
                  <td>{formatCurrency(year.payment)}</td>
                  <td>{formatCurrency(year.principal)}</td>
                  <td>{formatCurrency(year.interest)}</td>
                  <td>{formatCurrency(year.extraPrincipal)}</td>
                  <td>{formatCurrency(year.endingBalance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
