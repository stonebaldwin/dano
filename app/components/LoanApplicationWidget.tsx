"use client";

import { useMemo, useState } from "react";

type LoanTypeKey = "purchase" | "refinance" | "homeEquity";

type LoanStep = {
  question: string;
  options: string[];
};

const loanSteps: Record<LoanTypeKey, LoanStep> = {
  purchase: {
    question: "Where are you in the home buying process?",
    options: [
      "Signing a Purchase Agreement",
      "Going to Open Houses",
      "Making Offers",
      "Researching"
    ]
  },
  refinance: {
    question: "What is your main refinance goal?",
    options: [
      "Lower My Monthly Payment",
      "Reduce My Loan Term",
      "Cash Out Equity",
      "Remove Mortgage Insurance"
    ]
  },
  homeEquity: {
    question: "How would you like to use your home equity loan?",
    options: [
      "Home Improvements",
      "Debt Consolidation",
      "Major Purchase",
      "Other Expenses"
    ]
  }
};

export default function LoanApplicationWidget() {
  const [selectedLoanType, setSelectedLoanType] = useState<LoanTypeKey | null>(null);

  const activeStep = useMemo(
    () => (selectedLoanType ? loanSteps[selectedLoanType] : null),
    [selectedLoanType]
  );

  if (!selectedLoanType || !activeStep) {
    return (
      <div className="loan-type-buttons" role="group" aria-label="Loan type selection">
        <button type="button" className="loan-type-btn" onClick={() => setSelectedLoanType("purchase")}>
          Purchase
        </button>
        <button type="button" className="loan-type-btn" onClick={() => setSelectedLoanType("refinance")}>
          Refinance
        </button>
        <button type="button" className="loan-type-btn" onClick={() => setSelectedLoanType("homeEquity")}>
          Home Equity Loan
        </button>
      </div>
    );
  }

  return (
    <div className="loan-step-widget">
      <p className="loan-step-question">{activeStep.question}</p>
      <div className="loan-step-options" role="group" aria-label={activeStep.question}>
        {activeStep.options.map((option) => (
          <button key={option} type="button" className="loan-type-btn">
            {option}
          </button>
        ))}
      </div>
      <button type="button" className="loan-step-back" onClick={() => setSelectedLoanType(null)}>
        Back
      </button>
    </div>
  );
}
