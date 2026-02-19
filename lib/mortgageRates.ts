const OPTIMAL_BLUE_HOME_URL = "https://www.optimalblue.com/";
const MND_RATES_URL = "https://www.mortgagenewsdaily.com/mortgage-rates";
const DEFAULT_REVALIDATE_SECONDS = 60 * 60 * 6;
const HISTORY_POINTS = 124;

type ProductKey =
  | "30 Yr. Fixed"
  | "15 Yr. Fixed"
  | "30 Yr. Jumbo"
  | "7/6 SOFR ARM"
  | "30 Yr. FHA"
  | "30 Yr. VA";

export type ProductRate = {
  key: ProductKey;
  rate: number;
  change: number;
};

export type RatePoint = {
  dateLabel: string;
  isoDate: string;
  rate: number;
  change: number;
};

export type MortgageRatesSnapshot = {
  sourceUrl: string;
  updatedLabel: string | null;
  fetchedAtEtLabel: string;
  products: ProductRate[];
  history30YrFixed: RatePoint[];
  historyByProduct: Record<ProductKey, RatePoint[]>;
  umbs30Yr: {
    coupon: string | null;
    current: number;
    change: number;
    history: Array<{ isoDate: string; value: number }>;
    sourceUrl: string;
  };
};

const PRODUCT_KEYS: ProductKey[] = [
  "30 Yr. Fixed",
  "15 Yr. Fixed",
  "30 Yr. Jumbo",
  "7/6 SOFR ARM",
  "30 Yr. FHA",
  "30 Yr. VA"
];

const PRODUCT_PATTERNS: Record<ProductKey, string[]> = {
  "30 Yr. Fixed": ["30yrfixed", "30yearfixed", "30fixed", "conventional30"],
  "15 Yr. Fixed": ["15yrfixed", "15yearfixed", "15fixed", "conventional15"],
  "30 Yr. Jumbo": ["30yrjumbo", "30yearjumbo", "jumbo30"],
  "7/6 SOFR ARM": ["76sofrarm", "sofrarm", "arm"],
  "30 Yr. FHA": ["30yrfha", "30yearfha", "fha30"],
  "30 Yr. VA": ["30yrva", "30yearva", "va30"]
};

const PRODUCT_ROW_ALIASES: Record<ProductKey, string[]> = {
  "30 Yr. Fixed": ["30 Yr. Fixed", "30 Year Fixed", "Conventional 30", "thirtyYearFixed", "fixed30"],
  "15 Yr. Fixed": ["15 Yr. Fixed", "15 Year Fixed", "Conventional 15", "fifteenYearFixed", "fixed15"],
  "30 Yr. Jumbo": ["30 Yr. Jumbo", "30 Year Jumbo", "jumbo30"],
  "7/6 SOFR ARM": ["7/6 SOFR ARM", "SOFR ARM", "arm76", "sofr"],
  "30 Yr. FHA": ["30 Yr. FHA", "FHA 30", "fha30"],
  "30 Yr. VA": ["30 Yr. VA", "VA 30", "va30"]
};

type JsonRecord = Record<string, unknown>;

function normalizeToken(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function stripTags(value: string) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function asObject(value: unknown): JsonRecord | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as JsonRecord;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function asString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const v = value.trim();
  return v ? v : null;
}

function asTimestamp(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && /^\d{10,13}$/.test(value.trim())) {
    const n = Number(value.trim());
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function parseNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return 0;

  const cleaned = value.replace(/,/g, "").replace(/%/g, "").trim();
  if (!cleaned) return 0;
  const match = cleaned.match(/[+\-]?\d+(?:\.\d+)?/);
  if (!match) return 0;
  const n = Number(match[0]);
  return Number.isFinite(n) ? n : 0;
}

function parseRateAndChange(value: string) {
  const normalized = value.replace("âˆ’", "-");
  const rateMatch = normalized.match(/([0-9]+(?:\.[0-9]+)?)\s*%?/);
  const changeMatch = normalized.match(/([+\-][0-9]+(?:\.[0-9]+)?(?:\/[0-9]+)?)\s*%?/);

  const toNumber = (input: string) => {
    if (input.includes("/")) {
      const sign = input.startsWith("-") ? -1 : 1;
      const unsigned = input.replace(/^[+\-]/, "");
      const [numRaw, denRaw] = unsigned.split("/");
      const num = Number(numRaw);
      const den = Number(denRaw);
      if (!Number.isFinite(num) || !Number.isFinite(den) || den === 0) return 0;
      return sign * (num / den);
    }
    const n = Number(input);
    return Number.isFinite(n) ? n : 0;
  };

  const rate = rateMatch ? toNumber(rateMatch[1]) : 0;
  const change = changeMatch ? toNumber(changeMatch[1]) : 0;
  return {
    rate: rate >= 1 && rate <= 15 ? rate : 0,
    change
  };
}

function toIsoDate(value: string) {
  const us = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (us) {
    const month = Number(us[1]);
    const day = Number(us[2]);
    let year = Number(us[3]);
    if (us[3].length === 2) year += 2000;
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  const iso = value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (iso) {
    return `${iso[1]}-${String(Number(iso[2])).padStart(2, "0")}-${String(Number(iso[3])).padStart(2, "0")}`;
  }

  return value;
}

function toUsDateLabel(value: string) {
  const iso = value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T ].*)?$/);
  if (iso) {
    const month = Number(iso[2]);
    const day = Number(iso[3]);
    const year = iso[1].slice(-2);
    return `${month}/${day}/${year}`;
  }

  const us = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (us) {
    const month = Number(us[1]);
    const day = Number(us[2]);
    const year = us[3].length === 4 ? us[3].slice(-2) : us[3];
    return `${month}/${day}/${year}`;
  }

  return value;
}

function toUsDateLabelFromTimestamp(input: number) {
  const millis = input > 1_000_000_000_000 ? input : input * 1000;
  const d = new Date(millis);
  if (Number.isNaN(d.getTime())) return null;
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const year = String(d.getFullYear()).slice(-2);
  return `${month}/${day}/${year}`;
}

function normalizeProductKey(value: string | null): ProductKey | null {
  if (!value) return null;
  const token = normalizeToken(value);
  for (const key of PRODUCT_KEYS) {
    if (PRODUCT_PATTERNS[key].some((pattern) => token.includes(pattern))) return key;
  }
  return null;
}

function emptyHistoryByProduct() {
  return PRODUCT_KEYS.reduce<Record<ProductKey, RatePoint[]>>((acc, key) => {
    acc[key] = [];
    return acc;
  }, {} as Record<ProductKey, RatePoint[]>);
}

function fallbackSnapshot(sourceUrl?: string): MortgageRatesSnapshot {
  return {
    sourceUrl: sourceUrl || OPTIMAL_BLUE_HOME_URL,
    updatedLabel: null,
    fetchedAtEtLabel: formatEtTimestamp(),
    products: PRODUCT_KEYS.map((key) => ({ key, rate: 0, change: 0 })),
    history30YrFixed: [],
    historyByProduct: emptyHistoryByProduct(),
    umbs30Yr: {
      coupon: null,
      current: 0,
      change: 0,
      history: [],
      sourceUrl: sourceUrl || OPTIMAL_BLUE_HOME_URL
    }
  };
}

function getRevalidateSeconds() {
  const raw = Number(process.env.MORTGAGE_RATES_REVALIDATE_SECONDS ?? DEFAULT_REVALIDATE_SECONDS);
  if (!Number.isFinite(raw)) return DEFAULT_REVALIDATE_SECONDS;
  // Limit cache interval to 1-4 pulls/day (24h to 6h).
  return Math.min(86_400, Math.max(21_600, Math.floor(raw)));
}

function formatEtTimestamp(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  }).formatToParts(date);

  const read = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  const month = read("month");
  const day = read("day");
  const year = read("year");
  const hour = read("hour");
  const minute = read("minute");
  const dayPeriod = read("dayPeriod").toLowerCase();
  return `${month} ${day}, ${year} ${hour}:${minute}${dayPeriod} ET`;
}

function readField(record: JsonRecord, keys: string[]) {
  const normalizedRecord = new Map<string, unknown>();
  for (const [k, v] of Object.entries(record)) {
    normalizedRecord.set(normalizeToken(k), v);
  }

  for (const key of keys) {
    if (key in record) return record[key];
    const normalizedKey = normalizeToken(key);
    if (normalizedRecord.has(normalizedKey)) return normalizedRecord.get(normalizedKey);
  }
  return undefined;
}

function extractDateLabel(point: JsonRecord) {
  const raw = readField(point, ["dateLabel", "date", "asOfDate", "effectiveDate", "timestamp"]);
  const ts = asTimestamp(raw);
  if (ts !== null) return toUsDateLabelFromTimestamp(ts);
  const s = asString(raw);
  if (!s) return null;
  return toUsDateLabel(s);
}

function parseHistoryPoints(input: unknown) {
  const points: RatePoint[] = [];

  for (const value of asArray(input)) {
    const row = asObject(value);
    if (!row) continue;
    const dateLabel = extractDateLabel(row);
    if (!dateLabel) continue;
    const rate = parseNumber(
      readField(row, ["rate", "value", "noteRate", "current", "interestRate", "avgRate", "closeRate"])
    );
    const change = parseNumber(readField(row, ["change", "delta", "dailyChange", "rateChange"]));
    points.push({
      dateLabel,
      isoDate: toIsoDate(dateLabel),
      rate: rate >= 1 && rate <= 15 ? rate : 0,
      change
    });
  }

  return points.sort((a, b) => a.isoDate.localeCompare(b.isoDate));
}

function parseProductEntry(item: JsonRecord) {
  const rawName = asString(readField(item, ["key", "name", "label", "product", "program", "type", "title"]));
  const key = normalizeProductKey(rawName);
  if (!key) return null;

  const rate = parseNumber(
    readField(item, ["rate", "value", "current", "noteRate", "interestRate", "avgRate", "closeRate"])
  );
  const change = parseNumber(readField(item, ["change", "delta", "dailyChange", "rateChange"]));
  const historyInput = readField(item, ["history", "series", "trend", "points", "data", "historyPoints"]);
  const history = parseHistoryPoints(historyInput);

  return {
    key,
    rate: rate >= 1 && rate <= 15 ? rate : 0,
    change,
    history
  };
}

function deriveUpdatedLabel(payload: JsonRecord, products: ProductRate[], historyByProduct: Record<ProductKey, RatePoint[]>) {
  const raw = readField(payload, ["updatedLabel", "updatedAt", "lastUpdated", "asOfDate", "date"]);
  const rawDate = asString(raw);
  if (rawDate) {
    return toUsDateLabel(rawDate);
  }

  if (products.some((p) => p.rate > 0)) {
    for (const key of PRODUCT_KEYS) {
      const history = historyByProduct[key];
      if (history.length > 0) return history[history.length - 1].dateLabel;
    }
  }

  return null;
}

function pickPayloadObject(input: unknown): JsonRecord | null {
  const root = asObject(input);
  if (!root) return null;

  const nestedData = asObject(root.data);
  if (nestedData) return nestedData;

  const nestedResult = asObject(root.result);
  if (nestedResult) return nestedResult;

  return root;
}

function collectProductEntries(payload: JsonRecord) {
  const candidates = [
    payload.products,
    payload.rates,
    payload.indices,
    payload.items,
    asObject(payload.rateIndex)?.products,
    asObject(payload.marketRates)?.products
  ];
  const arrayEntries = candidates
    .flatMap((candidate) => asArray(candidate))
    .map((entry) => asObject(entry))
    .filter((entry): entry is JsonRecord => Boolean(entry));

  const objectMapCandidates = [
    asObject(payload.productsByType),
    asObject(payload.currentRates),
    asObject(payload.rateMap)
  ].filter((v): v is JsonRecord => Boolean(v));

  const objectMapEntries = objectMapCandidates.flatMap((mapObj) =>
    Object.entries(mapObj).flatMap(([rawKey, rawValue]) => {
      const rowObj = asObject(rawValue);
      if (rowObj) return [{ ...rowObj, name: asString(rowObj.name) ?? rawKey }];
      const rate = parseNumber(rawValue);
      if (rate > 0) return [{ name: rawKey, rate }];
      return [];
    })
  );

  return [...arrayEntries, ...objectMapEntries];
}

function collectRootHistory(payload: JsonRecord) {
  const candidates = [payload.history, payload.rateHistory, payload.trends, payload.series];
  return candidates.flatMap((candidate) => asArray(candidate)).map((entry) => asObject(entry)).filter((entry): entry is JsonRecord => Boolean(entry));
}

function parseUmbs(payload: JsonRecord, sourceUrl: string) {
  const direct = asObject(payload.umbs30Yr) ?? asObject(payload.umbs30year) ?? asObject(payload.umbs);
  if (!direct) {
    return {
      coupon: null,
      current: 0,
      change: 0,
      history: [],
      sourceUrl
    };
  }

  const history = asArray(readField(direct, ["history", "series", "points"]))
    .map((entry) => asObject(entry))
    .filter((entry): entry is JsonRecord => Boolean(entry))
    .map((point) => {
      const rawDate = asString(readField(point, ["isoDate", "date", "asOfDate"]));
      const rawValue = parseNumber(readField(point, ["value", "price", "current"]));
      if (!rawDate || rawValue <= 0) return null;
      return { isoDate: toIsoDate(rawDate), value: rawValue };
    })
    .filter((entry): entry is { isoDate: string; value: number } => Boolean(entry))
    .sort((a, b) => a.isoDate.localeCompare(b.isoDate));

  return {
    coupon: asString(readField(direct, ["coupon", "couponRate"])),
    current: parseNumber(readField(direct, ["current", "value", "price"])),
    change: parseNumber(readField(direct, ["change", "delta", "dailyChange"])),
    history,
    sourceUrl
  };
}

function parseMndRows(html: string) {
  const rows: Array<{ dateLabel: string; products: ProductRate[] }> = [];
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  const parsedRows = [...html.matchAll(rowRegex)].map((match) => match[1]);

  let columnByKey: Partial<Record<ProductKey, number>> = {};
  for (const rowHtml of parsedRows) {
    const cells = [...rowHtml.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((m) => stripTags(m[1]));
    if (cells.length < 3) continue;

    if (Object.keys(columnByKey).length < PRODUCT_KEYS.length) {
      const normalizedCells = cells.map((cell) => normalizeToken(cell));
      for (const key of PRODUCT_KEYS) {
        if (typeof columnByKey[key] === "number") continue;
        const aliases = PRODUCT_PATTERNS[key];
        const idx = normalizedCells.findIndex((cell) => aliases.some((alias) => cell.includes(alias)));
        if (idx >= 0) columnByKey[key] = idx;
      }
    }

    const firstDateIdx = cells.findIndex((cell) => /^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(cell));
    if (firstDateIdx === -1) continue;
    const dateLabel = cells[firstDateIdx];

    const products = PRODUCT_KEYS.map((key, index) => {
      const mappedIdx = columnByKey[key];
      const fallbackIdx = firstDateIdx + 1 + index;
      const cellText = typeof mappedIdx === "number" ? cells[mappedIdx] ?? "" : cells[fallbackIdx] ?? "";
      const parsed = parseRateAndChange(cellText);
      return { key, rate: parsed.rate, change: parsed.change };
    });

    rows.push({ dateLabel, products });
  }

  return rows;
}

async function getMndFallbackSnapshot(): Promise<MortgageRatesSnapshot> {
  try {
    const response = await fetch(MND_RATES_URL, {
      next: { revalidate: getRevalidateSeconds() },
      headers: {
        Accept: "text/html,application/xhtml+xml"
      }
    });
    if (!response.ok) return fallbackSnapshot(MND_RATES_URL);
    const html = await response.text();
    const rows = parseMndRows(html);
    if (rows.length === 0) return fallbackSnapshot(MND_RATES_URL);

    const updatedLabelMatch = html.match(/Last Updated:\s*([0-9/]+)/i);
    const updatedLabel = updatedLabelMatch ? updatedLabelMatch[1] : rows[0].dateLabel;
    const latest = rows[0];
    const historyRows = rows.slice(0, HISTORY_POINTS);

    const historyByProduct = PRODUCT_KEYS.reduce<Record<ProductKey, RatePoint[]>>((acc, key) => {
      acc[key] = historyRows
        .map((row) => {
          const p = row.products.find((item) => item.key === key);
          return {
            dateLabel: row.dateLabel,
            isoDate: toIsoDate(row.dateLabel),
            rate: p?.rate ?? 0,
            change: p?.change ?? 0
          };
        })
        .filter((p) => p.rate > 0)
        .reverse();
      return acc;
    }, emptyHistoryByProduct());

    const products = PRODUCT_KEYS.map((key) => {
      const current = latest.products.find((p) => p.key === key);
      if (current && current.rate > 0) return current;
      const hist = historyByProduct[key];
      const fallback = hist[hist.length - 1];
      return fallback ? { key, rate: fallback.rate, change: fallback.change } : { key, rate: 0, change: 0 };
    });

    return {
      sourceUrl: MND_RATES_URL,
      updatedLabel,
      fetchedAtEtLabel: formatEtTimestamp(),
      products,
      history30YrFixed: historyByProduct["30 Yr. Fixed"],
      historyByProduct,
      umbs30Yr: {
        coupon: null,
        current: 0,
        change: 0,
        history: [],
        sourceUrl: MND_RATES_URL
      }
    };
  } catch {
    return fallbackSnapshot(MND_RATES_URL);
  }
}

function normalizeSnapshot(payload: JsonRecord, sourceUrl: string): MortgageRatesSnapshot {
  const productMap = new Map<ProductKey, ProductRate>();
  const historyByProduct = emptyHistoryByProduct();

  const productEntries = collectProductEntries(payload);
  for (const entry of productEntries) {
    const parsed = parseProductEntry(entry);
    if (!parsed) continue;
    productMap.set(parsed.key, { key: parsed.key, rate: parsed.rate, change: parsed.change });
    if (parsed.history.length > 0) {
      historyByProduct[parsed.key] = parsed.history.slice(-HISTORY_POINTS);
    }
  }

  const rootHistory = collectRootHistory(payload);
  const historyByProductMap = asObject(payload.historyByProduct) ?? asObject(payload.historiesByProduct);
  if (historyByProductMap) {
    for (const [rawKey, rows] of Object.entries(historyByProductMap)) {
      const key = normalizeProductKey(rawKey);
      if (!key) continue;
      const parsed = parseHistoryPoints(rows);
      if (parsed.length > 0) {
        historyByProduct[key] = [...historyByProduct[key], ...parsed]
          .sort((a, b) => a.isoDate.localeCompare(b.isoDate))
          .slice(-HISTORY_POINTS);
      }
    }
  }

  for (const row of rootHistory) {
    const productKey = normalizeProductKey(asString(readField(row, ["product", "name", "label", "key"])));
    if (productKey) {
      const list = parseHistoryPoints([row]);
      if (list.length > 0) {
        historyByProduct[productKey] = [...historyByProduct[productKey], ...list]
          .sort((a, b) => a.isoDate.localeCompare(b.isoDate))
          .slice(-HISTORY_POINTS);
      }
      continue;
    }

    const dateLabel = extractDateLabel(row);
    if (!dateLabel) continue;
    const isoDate = toIsoDate(dateLabel);
    for (const key of PRODUCT_KEYS) {
      const aliasFields = PRODUCT_ROW_ALIASES[key].map((alias) => normalizeToken(alias));
      const raw = readField(row, [key, normalizeToken(key), ...PRODUCT_ROW_ALIASES[key], ...aliasFields]);
      const rate = parseNumber(raw);
      if (rate <= 0) continue;
      historyByProduct[key].push({
        dateLabel,
        isoDate,
        rate,
        change: 0
      });
    }
  }

  for (const key of PRODUCT_KEYS) {
    historyByProduct[key] = historyByProduct[key]
      .filter((point) => point.rate > 0)
      .sort((a, b) => a.isoDate.localeCompare(b.isoDate))
      .slice(-HISTORY_POINTS);

    if (!productMap.has(key) && historyByProduct[key].length > 0) {
      const latest = historyByProduct[key][historyByProduct[key].length - 1];
      productMap.set(key, { key, rate: latest.rate, change: latest.change });
    }
  }

  const products = PRODUCT_KEYS.map((key) => productMap.get(key) ?? { key, rate: 0, change: 0 });
  const updatedLabel = deriveUpdatedLabel(payload, products, historyByProduct);
  const history30YrFixed = historyByProduct["30 Yr. Fixed"];

  return {
    sourceUrl,
    updatedLabel,
    fetchedAtEtLabel: formatEtTimestamp(),
    products,
    history30YrFixed,
    historyByProduct,
    umbs30Yr: parseUmbs(payload, sourceUrl)
  };
}

function buildOptimalBlueHeaders() {
  const headers: Record<string, string> = {
    Accept: "application/json"
  };

  const apiKey = process.env.OPTIMAL_BLUE_API_KEY;
  if (apiKey) headers["x-api-key"] = apiKey;

  const bearer = process.env.OPTIMAL_BLUE_API_TOKEN;
  if (bearer) headers.Authorization = `Bearer ${bearer}`;

  const clientId = process.env.OPTIMAL_BLUE_CLIENT_ID;
  if (clientId) headers["x-client-id"] = clientId;

  const extraHeadersRaw = process.env.OPTIMAL_BLUE_EXTRA_HEADERS;
  if (extraHeadersRaw) {
    try {
      const extra = JSON.parse(extraHeadersRaw) as Record<string, string>;
      for (const [key, value] of Object.entries(extra)) {
        if (typeof value === "string" && value) headers[key] = value;
      }
    } catch {
      // Ignore malformed extra headers to avoid runtime failures.
    }
  }

  return headers;
}

export async function getMortgageRatesSnapshot(): Promise<MortgageRatesSnapshot> {
  return getMndFallbackSnapshot();
}
