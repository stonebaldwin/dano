"use client";

import { FormEvent, useState } from "react";

type LoanTypeKey = "purchase" | "refinance" | "homeEquity";
type ContactPreference = "businessHours" | "scheduleCall";

const creditScoreOptions = [
  "Excellent (Above 720)",
  "Good (680-719)",
  "Fair (620-679)",
  "Needs improvement (under 620)"
] as const;

const propertyTypeOptions = [
  "Single Family",
  "Townhouse or Condo",
  "Manufactured",
  "Other"
] as const;

const propertyUseOptions = [
  "Primary residence (owner occupied)",
  "Second home",
  "Investment property"
] as const;

const cashUseOptions = [
  "Unplanned Expenses",
  "Debt Consolidation",
  "Home Improvement",
  "Other"
] as const;

const states = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming"
] as const;

export default function LoanApplicationWidget() {
  const [selectedLoanType, setSelectedLoanType] = useState<LoanTypeKey | null>(null);
  const [cashUse, setCashUse] = useState<string | null>(null);
  const [creditScore, setCreditScore] = useState<string | null>(null);
  const [propertyType, setPropertyType] = useState<string | null>(null);
  const [propertyUse, setPropertyUse] = useState<string | null>(null);
  const [state, setState] = useState("");
  const [contactPreference, setContactPreference] = useState<ContactPreference | null>(null);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const selectLoanType = (loanType: LoanTypeKey) => {
    setSelectedLoanType(loanType);
    setCashUse(null);
    setCreditScore(null);
    setPropertyType(null);
    setPropertyUse(null);
    setState("");
    setContactPreference(null);
    setSubmitError("");
    setIsSubmitting(false);
    setIsSubmitted(false);
  };

  const currentStep = !selectedLoanType
    ? "loanType"
    : selectedLoanType === "homeEquity" && !cashUse
      ? "cashUse"
    : !creditScore
      ? "creditScore"
      : !propertyType
        ? "propertyType"
        : !propertyUse
          ? "propertyUse"
          : !state
            ? "state"
            : "contact";

  const resetFlow = () => {
    setSelectedLoanType(null);
    setCashUse(null);
    setCreditScore(null);
    setPropertyType(null);
    setPropertyUse(null);
    setState("");
    setContactPreference(null);
    setSubmitError("");
    setIsSubmitting(false);
    setIsSubmitted(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedLoanType || !creditScore || !propertyType || !propertyUse || !state || !contactPreference) {
      setSubmitError("Please complete all fields before submitting.");
      return;
    }
    const formData = new FormData(event.currentTarget);
    const callbackDate = formData.get("callbackDate");
    const callbackTime = formData.get("callbackTime");

    setSubmitError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/loan-application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          loanType: selectedLoanType,
          cashUse,
          creditScore,
          propertyType,
          propertyUse,
          propertyState: state,
          contact: {
            firstName: String(formData.get("firstName") ?? ""),
            lastName: String(formData.get("lastName") ?? ""),
            email: String(formData.get("email") ?? ""),
            phone: String(formData.get("phone") ?? ""),
            preference: contactPreference,
            callbackDate: contactPreference === "scheduleCall" ? String(callbackDate ?? "") : "",
            callbackTime: contactPreference === "scheduleCall" ? String(callbackTime ?? "") : ""
          }
        })
      });

      const payload = (await response.json()) as { error?: string; ok?: boolean };
      if (!response.ok || !payload.ok) {
        setSubmitError(payload.error ?? "Something went wrong. Please try again.");
        return;
      }

      setIsSubmitted(true);
    } catch {
      setSubmitError("Unable to submit right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (currentStep === "loanType") {
    return (
      <div className="loan-type-buttons" role="group" aria-label="Loan type selection">
        <button type="button" className="loan-type-btn" onClick={() => selectLoanType("purchase")}>
          Purchase
        </button>
        <button type="button" className="loan-type-btn" onClick={() => selectLoanType("refinance")}>
          Refinance
        </button>
        <button type="button" className="loan-type-btn" onClick={() => selectLoanType("homeEquity")}>
          Home Equity Loan
        </button>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="loan-step-widget">
        <p className="loan-step-question">Thanks, your request was submitted.</p>
        <button type="button" className="loan-step-back" onClick={resetFlow}>
          Start Over
        </button>
      </div>
    );
  }

  return (
    <div className="loan-step-widget">
      {currentStep === "creditScore" && (
        <>
          <p className="loan-step-question">How would you rate your credit score?</p>
          <div className="loan-step-options" role="group" aria-label="Credit score">
            {creditScoreOptions.map((option) => (
              <button key={option} type="button" className="loan-type-btn" onClick={() => setCreditScore(option)}>
                {option}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="loan-step-back"
            onClick={() => {
              if (selectedLoanType === "homeEquity") {
                setCashUse(null);
              } else {
                setSelectedLoanType(null);
              }
            }}
          >
            Back
          </button>
        </>
      )}

      {currentStep === "cashUse" && (
        <>
          <p className="loan-step-question">How will you use your cash?</p>
          <div className="loan-step-options" role="group" aria-label="Cash use">
            {cashUseOptions.map((option) => (
              <button key={option} type="button" className="loan-type-btn" onClick={() => setCashUse(option)}>
                {option}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="loan-step-back"
            onClick={() => {
              setSelectedLoanType(null);
              setCashUse(null);
            }}
          >
            Back
          </button>
        </>
      )}

      {currentStep === "propertyType" && (
        <>
          <p className="loan-step-question">What type of home is this for?</p>
          <div className="loan-step-options" role="group" aria-label="Home type">
            {propertyTypeOptions.map((option) => (
              <button key={option} type="button" className="loan-type-btn" onClick={() => setPropertyType(option)}>
                {option}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="loan-step-back"
            onClick={() => {
              setCreditScore(null);
            }}
          >
            Back
          </button>
        </>
      )}

      {currentStep === "propertyUse" && (
        <>
          <p className="loan-step-question">How do you plan to use this property?</p>
          <div className="loan-step-options" role="group" aria-label="Property use">
            {propertyUseOptions.map((option) => (
              <button key={option} type="button" className="loan-type-btn" onClick={() => setPropertyUse(option)}>
                {option}
              </button>
            ))}
          </div>
          <button type="button" className="loan-step-back" onClick={() => setPropertyType(null)}>
            Back
          </button>
        </>
      )}

      {currentStep === "state" && (
        <>
          <p className="loan-step-question">In what state are you planning to buy a home?</p>
          <label className="loan-input-group">
            State
            <select value={state} onChange={(event) => setState(event.target.value)} className="loan-input">
              <option value="">Select a state</option>
              {states.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <button type="button" className="loan-step-back" onClick={() => setPropertyUse(null)}>
            Back
          </button>
        </>
      )}

      {currentStep === "contact" && (
        <form className="loan-contact-form" onSubmit={handleSubmit}>
          <p className="loan-step-question">Contact info</p>
          <div className="loan-contact-grid">
            <label className="loan-input-group">
              First Name
              <input className="loan-input" type="text" name="firstName" required />
            </label>
            <label className="loan-input-group">
              Last Name
              <input className="loan-input" type="text" name="lastName" required />
            </label>
          </div>
          <label className="loan-input-group">
            Email Address
            <input className="loan-input" type="email" name="email" required />
          </label>
          <label className="loan-input-group">
            Phone Number
            <input className="loan-input" type="tel" name="phone" required />
          </label>

          <fieldset className="loan-contact-preference">
            <legend>How should we reach you?</legend>
            <label className="loan-radio-row">
              <input
                type="radio"
                name="contactPreference"
                checked={contactPreference === "businessHours"}
                onChange={() => setContactPreference("businessHours")}
              />
              During business hours
            </label>
            <label className="loan-radio-row">
              <input
                type="radio"
                name="contactPreference"
                checked={contactPreference === "scheduleCall"}
                onChange={() => setContactPreference("scheduleCall")}
              />
              Schedule a call
            </label>
          </fieldset>

          {contactPreference === "scheduleCall" && (
            <div className="loan-schedule-grid">
              <label className="loan-input-group">
                Select a date
                <input className="loan-input" type="date" name="callbackDate" required />
              </label>
              <label className="loan-input-group">
                Select a time
                <input className="loan-input" type="time" name="callbackTime" required />
              </label>
            </div>
          )}

          {submitError && <p className="loan-form-message loan-form-message-error">{submitError}</p>}

          <button type="submit" className="apply-btn" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Let's Connect"}
          </button>
          <button type="button" className="loan-step-back" onClick={() => setState("")}>
            Back
          </button>
        </form>
      )}
    </div>
  );
}
