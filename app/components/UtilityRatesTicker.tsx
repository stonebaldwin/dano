import { getMortgageRatesSnapshot } from "@/lib/mortgageRates";
import UtilityRatesCarousel from "@/app/components/UtilityRatesCarousel";

export default async function UtilityRatesTicker() {
  const snapshot = await getMortgageRatesSnapshot();
  const current30Yr = snapshot.products.find((p) => p.key === "30 Yr. Fixed");
  const fixedRate = current30Yr?.rate ?? 0;
  const fixedChange = current30Yr?.change ?? 0;
  const umbsCurrent = snapshot.umbs30Yr.current;
  const umbsChange = snapshot.umbs30Yr.change;

  const normalizedFixedSeries = snapshot.history30YrFixed
    .map((point) => point.rate)
    .filter((value) => value > 0);
  if (fixedRate > 0) {
    if (normalizedFixedSeries.length === 0 || normalizedFixedSeries[normalizedFixedSeries.length - 1] !== fixedRate) {
      normalizedFixedSeries.push(fixedRate);
    }
  }

  const normalizedUmbsSeries = snapshot.umbs30Yr.history
    .map((point) => point.value)
    .filter((value) => value > 0);
  if (umbsCurrent > 0) {
    if (normalizedUmbsSeries.length === 0 || normalizedUmbsSeries[normalizedUmbsSeries.length - 1] !== umbsCurrent) {
      normalizedUmbsSeries.push(umbsCurrent);
    }
  }

  const slides = [
    {
      key: "fixed-30",
      label: "30Y Fixed",
      valueLabel: fixedRate > 0 ? `${fixedRate.toFixed(2)}%` : "--",
      changeLabel: fixedRate > 0 ? `${fixedChange > 0 ? "+" : ""}${fixedChange.toFixed(2)}%` : "N/A",
      changeDirection: fixedChange > 0 ? "up" : fixedChange < 0 ? "down" : "flat",
      points: normalizedFixedSeries,
      href: "/mortgage-rates"
    },
    {
      key: "umbs-30",
      label: "UMBS 30YR",
      valueLabel: umbsCurrent > 0 ? umbsCurrent.toFixed(2) : "--",
      changeLabel: umbsCurrent > 0 ? `${umbsChange > 0 ? "+" : ""}${umbsChange.toFixed(2)}` : "N/A",
      changeDirection: umbsChange > 0 ? "up" : umbsChange < 0 ? "down" : "flat",
      points: normalizedUmbsSeries,
      href: "/mortgage-rates"
    }
  ] as const;

  return <UtilityRatesCarousel slides={[...slides]} />;
}
