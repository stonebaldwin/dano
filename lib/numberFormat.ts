export function parseFormattedNumber(value: string) {
  const n = Number(value.replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function formatNumericInput(value: string) {
  const cleaned = value.replace(/,/g, "").replace(/[^\d.]/g, "");
  if (!cleaned) return "";

  const firstDot = cleaned.indexOf(".");
  const normalized =
    firstDot === -1
      ? cleaned
      : `${cleaned.slice(0, firstDot)}.${cleaned.slice(firstDot + 1).replace(/\./g, "")}`;

  const hasTrailingDot = normalized.endsWith(".");
  const [rawInt, rawDec = ""] = normalized.split(".");
  const intPart = rawInt.replace(/^0+(?=\d)/, "");
  const formattedInt = intPart ? Number(intPart).toLocaleString("en-US") : "0";

  if (hasTrailingDot) return `${formattedInt}.`;
  if (normalized.includes(".")) return `${formattedInt}.${rawDec}`;
  return formattedInt;
}
