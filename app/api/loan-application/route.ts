import { NextRequest, NextResponse } from "next/server";

type LoanTypeKey = "purchase" | "refinance" | "homeEquity";
type ContactPreference = "businessHours" | "scheduleCall";

type ApplicationPayload = {
  loanType?: LoanTypeKey;
  cashUse?: string | null;
  creditScore?: string;
  propertyType?: string;
  propertyUse?: string;
  propertyState?: string;
  contact?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    preference?: ContactPreference;
    callbackDate?: string;
    callbackTime?: string;
  };
};

const RESEND_API_URL = "https://api.resend.com/emails";
const RECIPIENT_EMAIL = "dopirhory@alcova.com";

function isNonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function normalize(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function labelForLoanType(loanType: LoanTypeKey): string {
  if (loanType === "homeEquity") {
    return "Home Equity Loan";
  }
  if (loanType === "refinance") {
    return "Refinance";
  }
  return "Purchase";
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function POST(request: NextRequest) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!resendApiKey || !fromEmail) {
    return NextResponse.json(
      { ok: false, error: "Server is missing RESEND_API_KEY or RESEND_FROM_EMAIL." },
      { status: 500 }
    );
  }

  let body: ApplicationPayload;
  try {
    body = (await request.json()) as ApplicationPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request payload." }, { status: 400 });
  }

  const loanType = body.loanType;
  const contact = body.contact ?? {};
  const creditScore = normalize(body.creditScore);
  const propertyType = normalize(body.propertyType);
  const propertyUse = normalize(body.propertyUse);
  const propertyState = normalize(body.propertyState);
  const firstName = normalize(contact.firstName);
  const lastName = normalize(contact.lastName);
  const email = normalize(contact.email);
  const phone = normalize(contact.phone);
  const preference = contact.preference;
  const callbackDate = normalize(contact.callbackDate);
  const callbackTime = normalize(contact.callbackTime);
  const cashUse = normalize(body.cashUse);

  if (!loanType || !["purchase", "refinance", "homeEquity"].includes(loanType)) {
    return NextResponse.json({ ok: false, error: "Invalid loan type." }, { status: 400 });
  }
  if (!isNonEmpty(creditScore) || !isNonEmpty(propertyType) || !isNonEmpty(propertyUse) || !isNonEmpty(propertyState)) {
    return NextResponse.json({ ok: false, error: "Missing questionnaire fields." }, { status: 400 });
  }
  if (loanType === "homeEquity" && !isNonEmpty(cashUse)) {
    return NextResponse.json({ ok: false, error: "Missing cash use field." }, { status: 400 });
  }
  if (!isNonEmpty(firstName) || !isNonEmpty(lastName) || !isNonEmpty(email) || !isNonEmpty(phone)) {
    return NextResponse.json({ ok: false, error: "Missing contact fields." }, { status: 400 });
  }
  if (!preference || !["businessHours", "scheduleCall"].includes(preference)) {
    return NextResponse.json({ ok: false, error: "Select a contact preference." }, { status: 400 });
  }
  if (preference === "scheduleCall" && (!isNonEmpty(callbackDate) || !isNonEmpty(callbackTime))) {
    return NextResponse.json({ ok: false, error: "Select callback date and time." }, { status: 400 });
  }
  const loanTypeLabel = labelForLoanType(loanType);
  const contactPreferenceLabel = preference === "scheduleCall" ? "Schedule a call" : "During business hours";
  const scheduleLine =
    preference === "scheduleCall" ? `\nScheduled Date: ${callbackDate}\nScheduled Time: ${callbackTime}` : "";
  const cashUseLine = loanType === "homeEquity" ? `\nCash Use: ${cashUse}` : "";

  const text = `New loan inquiry submitted from website

Loan Type: ${loanTypeLabel}${cashUseLine}
Credit Score: ${creditScore}
Property Type: ${propertyType}
Property Use: ${propertyUse}
State: ${propertyState}

First Name: ${firstName}
Last Name: ${lastName}
Email: ${email}
Phone: ${phone}
Contact Preference: ${contactPreferenceLabel}${scheduleLine}
`;

  const loanTypeLabelEscaped = escapeHtml(loanTypeLabel);
  const cashUseEscaped = escapeHtml(cashUse);
  const creditScoreEscaped = escapeHtml(creditScore);
  const propertyTypeEscaped = escapeHtml(propertyType);
  const propertyUseEscaped = escapeHtml(propertyUse);
  const propertyStateEscaped = escapeHtml(propertyState);
  const firstNameEscaped = escapeHtml(firstName);
  const lastNameEscaped = escapeHtml(lastName);
  const emailEscaped = escapeHtml(email);
  const phoneEscaped = escapeHtml(phone);
  const contactPreferenceEscaped = escapeHtml(contactPreferenceLabel);
  const callbackDateEscaped = escapeHtml(callbackDate);
  const callbackTimeEscaped = escapeHtml(callbackTime);

  const html = `
    <h2>New Loan Inquiry</h2>
    <p><strong>Loan Type:</strong> ${loanTypeLabelEscaped}</p>
    ${loanType === "homeEquity" ? `<p><strong>Cash Use:</strong> ${cashUseEscaped}</p>` : ""}
    <p><strong>Credit Score:</strong> ${creditScoreEscaped}</p>
    <p><strong>Property Type:</strong> ${propertyTypeEscaped}</p>
    <p><strong>Property Use:</strong> ${propertyUseEscaped}</p>
    <p><strong>State:</strong> ${propertyStateEscaped}</p>
    <hr />
    <p><strong>First Name:</strong> ${firstNameEscaped}</p>
    <p><strong>Last Name:</strong> ${lastNameEscaped}</p>
    <p><strong>Email:</strong> ${emailEscaped}</p>
    <p><strong>Phone:</strong> ${phoneEscaped}</p>
    <p><strong>Contact Preference:</strong> ${contactPreferenceEscaped}</p>
    ${preference === "scheduleCall" ? `<p><strong>Scheduled Date:</strong> ${callbackDateEscaped}</p>` : ""}
    ${preference === "scheduleCall" ? `<p><strong>Scheduled Time:</strong> ${callbackTimeEscaped}</p>` : ""}
  `;

  const emailResponse = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${resendApiKey}`
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [RECIPIENT_EMAIL],
      reply_to: email,
      subject: `Website Lead: ${loanTypeLabel} - ${firstName} ${lastName}`,
      text,
      html
    })
  });

  if (!emailResponse.ok) {
    return NextResponse.json({ ok: false, error: "Failed to send email." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
