export type RateIndexProductKey =
  | "30 Yr. Fixed"
  | "15 Yr. Fixed"
  | "30 Yr. FHA"
  | "30 Yr. VA";

export type RateIndexPoint = {
  dateLabel: string;
  isoDate: string;
  rate: number;
  change: number;
};

export type RateIndexProduct = {
  key: RateIndexProductKey;
  rate: number;
  change: number;
};

export type OptimalBlueRateIndexSnapshot = {
  sourceLabel: string;
  updatedLabel: string | null;
  products: RateIndexProduct[];
  historyByProduct: Record<RateIndexProductKey, RateIndexPoint[]>;
};

const PRODUCT_KEYS: RateIndexProductKey[] = [
  "30 Yr. Fixed",
  "15 Yr. Fixed",
  "30 Yr. FHA",
  "30 Yr. VA"
];

const PRODUCT_ALIASES: Record<RateIndexProductKey, string[]> = {
  "30 Yr. Fixed": ["30 Yr. Fixed", "30 Year Fixed", "Conventional 30", "30yrfixed"],
  "15 Yr. Fixed": ["15 Yr. Fixed", "15 Year Fixed", "Conventional 15", "15yrfixed"],
  "30 Yr. FHA": ["30 Yr. FHA", "FHA 30", "30yrfha"],
  "30 Yr. VA": ["30 Yr. VA", "VA 30", "30yrva"]
};

function toNumber(value: unknown) {
  const n = typeof value === "string" ? Number(value.replace(/%/g, "")) : Number(value);
  return Number.isFinite(n) ? n : 0;
}

function toIsoDate(value: string) {
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
  const us = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (us) {
    const mm = String(Number(us[1])).padStart(2, "0");
    const dd = String(Number(us[2])).padStart(2, "0");
    let year = Number(us[3]);
    if (us[3].length === 2) year += 2000;
    return `${year}-${mm}-${dd}`;
  }
  return value;
}

function toDateLabel(value: string) {
  if (/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(value)) return value;
  const iso = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) {
    return `${Number(iso[2])}/${Number(iso[3])}/${iso[1]}`;
  }
  return value;
}

function normalizeKey(input: string): RateIndexProductKey | null {
  const token = input.toLowerCase().replace(/[^a-z0-9]/g, "");
  for (const key of PRODUCT_KEYS) {
    const aliases = PRODUCT_ALIASES[key];
    if (
      aliases.some(
        (alias) => alias.toLowerCase().replace(/[^a-z0-9]/g, "") === token
      )
    ) {
      return key;
    }
  }
  return null;
}

function emptySnapshot(note: string): OptimalBlueRateIndexSnapshot {
  const emptyHistory = PRODUCT_KEYS.reduce<Record<RateIndexProductKey, RateIndexPoint[]>>(
    (acc, key) => {
      acc[key] = [];
      return acc;
    },
    {} as Record<RateIndexProductKey, RateIndexPoint[]>
  );

  return {
    sourceLabel: note,
    updatedLabel: null,
    products: PRODUCT_KEYS.map((key) => ({ key, rate: 0, change: 0 })),
    historyByProduct: emptyHistory
  };
}

function mapProductsFromPayload(payload: any) {
  const out = new Map<RateIndexProductKey, RateIndexProduct>();

  const productRows: any[] = Array.isArray(payload?.products)
    ? payload.products
    : Array.isArray(payload?.rates)
      ? payload.rates
      : [];

  for (const row of productRows) {
    const rawLabel = String(
      row?.product ?? row?.name ?? row?.program ?? row?.rateType ?? ""
    );
    const key = normalizeKey(rawLabel);
    if (!key) continue;
    const rate = toNumber(row?.rate ?? row?.value ?? row?.currentRate);
    const change = toNumber(row?.change ?? row?.dailyChange ?? row?.delta);
    out.set(key, { key, rate, change });
  }

  return PRODUCT_KEYS.map((key) => out.get(key) ?? { key, rate: 0, change: 0 });
}

function mapHistoryFromPayload(payload: any) {
  const history = PRODUCT_KEYS.reduce<Record<RateIndexProductKey, RateIndexPoint[]>>(
    (acc, key) => {
      acc[key] = [];
      return acc;
    },
    {} as Record<RateIndexProductKey, RateIndexPoint[]>
  );

  // Shape A: historyByProduct { "30 Yr. Fixed": [{date,rate,change}] }
  if (payload?.historyByProduct && typeof payload.historyByProduct === "object") {
    for (const [rawKey, rows] of Object.entries(payload.historyByProduct as Record<string, any[]>)) {
      const key = normalizeKey(rawKey);
      if (!key || !Array.isArray(rows)) continue;
      history[key] = rows
        .map((row) => {
          const dateRaw = String(row?.date ?? row?.asOfDate ?? "");
          return {
            dateLabel: toDateLabel(dateRaw),
            isoDate: toIsoDate(dateRaw),
            rate: toNumber(row?.rate ?? row?.value),
            change: toNumber(row?.change ?? row?.dailyChange ?? 0)
          };
        })
        .filter((row) => row.rate > 0);
    }
  }

  // Shape B: product row includes embedded history.
  const productRows: any[] = Array.isArray(payload?.products)
    ? payload.products
    : Array.isArray(payload?.rates)
      ? payload.rates
      : [];

  for (const row of productRows) {
    const rawLabel = String(
      row?.product ?? row?.name ?? row?.program ?? row?.rateType ?? ""
    );
    const key = normalizeKey(rawLabel);
    if (!key) continue;

    const embedded: any[] = Array.isArray(row?.history) ? row.history : [];
    if (embedded.length === 0) continue;
    history[key] = embedded
      .map((point) => {
        const dateRaw = String(point?.date ?? point?.asOfDate ?? "");
        return {
          dateLabel: toDateLabel(dateRaw),
          isoDate: toIsoDate(dateRaw),
          rate: toNumber(point?.rate ?? point?.value),
          change: toNumber(point?.change ?? point?.dailyChange ?? 0)
        };
      })
      .filter((point) => point.rate > 0);
  }

  for (const key of PRODUCT_KEYS) {
    history[key] = history[key]
      .filter((point) => point.rate > 0)
      .sort((a, b) => a.isoDate.localeCompare(b.isoDate))
      .slice(-62);
  }

  return history;
}

export async function getOptimalBlueRateIndexSnapshot(): Promise<OptimalBlueRateIndexSnapshot> {
  const endpoint = process.env.OPTIMAL_BLUE_RATE_INDEX_URL;
  if (!endpoint) {
    return emptySnapshot("Optimal Blue API (missing OPTIMAL_BLUE_RATE_INDEX_URL)");
  }

  const headers: Record<string, string> = {
    Accept: "application/json"
  };
  if (process.env.OPTIMAL_BLUE_API_KEY) {
    headers["x-api-key"] = process.env.OPTIMAL_BLUE_API_KEY;
  }
  if (process.env.OPTIMAL_BLUE_API_TOKEN) {
    headers.Authorization = `Bearer ${process.env.OPTIMAL_BLUE_API_TOKEN}`;
  }
  if (process.env.OPTIMAL_BLUE_CLIENT_ID) {
    headers["x-client-id"] = process.env.OPTIMAL_BLUE_CLIENT_ID;
  }

  try {
    const response = await fetch(endpoint, {
      headers,
      next: { revalidate: 60 * 30 }
    });

    if (!response.ok) {
      return emptySnapshot(`Optimal Blue API (${response.status})`);
    }

    const payload = await response.json();
    const products = mapProductsFromPayload(payload);
    const historyByProduct = mapHistoryFromPayload(payload);
    const updatedRaw = String(payload?.updatedAt ?? payload?.asOf ?? payload?.date ?? "");
    const updatedLabel = updatedRaw ? toDateLabel(updatedRaw) : null;

    // Backfill missing current values from latest available history.
    for (const product of products) {
      if (product.rate > 0) continue;
      const history = historyByProduct[product.key];
      const latest = history[history.length - 1];
      if (latest) {
        product.rate = latest.rate;
        product.change = latest.change;
      }
    }

    return {
      sourceLabel: "Optimal Blue PPE/API",
      updatedLabel,
      products,
      historyByProduct
    };
  } catch {
    return emptySnapshot("Optimal Blue API (request failed)");
  }
}
