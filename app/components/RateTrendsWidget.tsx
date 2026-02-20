"use client";

import { useMemo, useState, type MouseEvent } from "react";

type TrendPoint = {
  isoDate: string;
  rate: number;
};

type TrendSeries = {
  key: string;
  label: string;
  color: string;
  currentRate?: number;
  currentChange?: number;
  points: TrendPoint[];
};

type Props = {
  series: TrendSeries[];
  updatedLabel: string | null;
  fetchedAtEtLabel: string;
};

type HoveredPoint = {
  x: number;
  y: number;
  label: string;
  color: string;
  date: Date;
  rate: number;
};

const RANGE_OPTIONS = [30, 90, 180];

const CHART = {
  width: 620,
  height: 320,
  marginTop: 14,
  marginRight: 20,
  marginBottom: 44,
  marginLeft: 62
};

const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric"
});

function toDate(value: string) {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatRate(value: number) {
  return `${value.toFixed(3).replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1")}%`;
}

function buildPath(values: Array<{ x: number; y: number }>) {
  if (values.length < 2) return "";

  let path = `M ${values[0].x.toFixed(2)} ${values[0].y.toFixed(2)}`;
  for (let index = 1; index < values.length; index += 1) {
    const prev = values[index - 1];
    const current = values[index];
    const midX = (prev.x + current.x) / 2;
    const midY = (prev.y + current.y) / 2;
    path += ` Q ${prev.x.toFixed(2)} ${prev.y.toFixed(2)}, ${midX.toFixed(2)} ${midY.toFixed(2)}`;
  }
  const last = values[values.length - 1];
  path += ` T ${last.x.toFixed(2)} ${last.y.toFixed(2)}`;
  return path;
}

export default function RateTrendsWidget({ series, updatedLabel, fetchedAtEtLabel }: Props) {
  const [rangeDays, setRangeDays] = useState<number>(30);
  const [enabledKeys, setEnabledKeys] = useState<string[]>(() => series.map((line) => line.key));
  const [hoveredPoint, setHoveredPoint] = useState<HoveredPoint | null>(null);

  const toggleSeries = (key: string) => {
    setEnabledKeys((current) => {
      if (current.includes(key)) {
        return current.length <= 1 ? current : current.filter((item) => item !== key);
      }
      return [...current, key];
    });
  };

  const visibleSeries = useMemo(() => series.filter((line) => enabledKeys.includes(line.key)), [series, enabledKeys]);

  const parsedSeries = useMemo(
    () =>
      visibleSeries.map((line) => ({
        ...line,
        points: line.points
          .map((point) => {
            const date = toDate(point.isoDate);
            return date ? { rate: point.rate, date } : null;
          })
          .filter((point): point is { rate: number; date: Date } => point !== null)
      })),
    [visibleSeries]
  );

  const chartData = useMemo(() => {
    const allDates = parsedSeries.flatMap((line) => line.points.map((point) => point.date.getTime()));
    if (allDates.length === 0) return null;

    const endTs = Math.max(...allDates);
    const startTs = endTs - rangeDays * 24 * 60 * 60 * 1000;
    const safeEnd = endTs;
    const safeStart = Math.min(startTs, endTs - 1);

    const inRange = parsedSeries
      .map((line) => ({
        ...line,
        points: line.points.filter((point) => point.date.getTime() >= safeStart && point.date.getTime() <= safeEnd)
      }))
      .filter((line) => line.points.length >= 2);

    if (inRange.length === 0) return null;

    const allRates = inRange.flatMap((line) => line.points.map((point) => point.rate));
    const minRateRaw = Math.min(...allRates);
    const maxRateRaw = Math.max(...allRates);
    const minRate = Math.floor((minRateRaw - 0.05) * 10) / 10;
    const maxRate = Math.ceil((maxRateRaw + 0.05) * 10) / 10;
    const rateRange = Math.max(0.1, maxRate - minRate);
    const timeRange = Math.max(1, safeEnd - safeStart);
    const plotWidth = CHART.width - CHART.marginLeft - CHART.marginRight;
    const plotHeight = CHART.height - CHART.marginTop - CHART.marginBottom;

    const lines = inRange.map((line) => {
      const points = line.points.map((point) => {
        const ts = point.date.getTime();
        const x = CHART.marginLeft + ((ts - safeStart) / timeRange) * plotWidth;
        const y = CHART.marginTop + plotHeight - ((point.rate - minRate) / rateRange) * plotHeight;
        return { x, y, rate: point.rate, date: point.date };
      });
      return {
        ...line,
        path: buildPath(points),
        points
      };
    });

    const yTicks = Array.from({ length: 5 }, (_, index) => {
      const ratio = index / 4;
      const rate = maxRate - ratio * rateRange;
      const y = CHART.marginTop + ratio * plotHeight;
      return { y, label: `${rate.toFixed(3)}%` };
    });

    const xTicks = Array.from({ length: 4 }, (_, index) => {
      const ratio = index / 3;
      const ts = safeStart + ratio * timeRange;
      const x = CHART.marginLeft + ratio * plotWidth;
      const date = new Date(ts);
      const label = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric"
      }).format(date);
      return { x, label };
    });

    return {
      lines,
      yTicks,
      xTicks
    };
  }, [parsedSeries, rangeDays]);

  const handleLineHover = (
    line: { label: string; color: string; points: Array<{ x: number; y: number; rate: number; date: Date }> },
    event: MouseEvent<SVGPathElement>
  ) => {
    const svg = event.currentTarget.ownerSVGElement;
    if (!svg || line.points.length === 0) return;

    const rect = svg.getBoundingClientRect();
    if (!rect.width) return;
    const viewX = ((event.clientX - rect.left) / rect.width) * CHART.width;

    let nearest = line.points[0];
    let nearestDistance = Math.abs(nearest.x - viewX);
    for (let index = 1; index < line.points.length; index += 1) {
      const point = line.points[index];
      const distance = Math.abs(point.x - viewX);
      if (distance < nearestDistance) {
        nearest = point;
        nearestDistance = distance;
      }
    }

    setHoveredPoint({
      x: nearest.x,
      y: nearest.y,
      label: line.label,
      color: line.color,
      date: nearest.date,
      rate: nearest.rate
    });
  };

  const tooltipPosition = hoveredPoint
    ? {
        left: `${(hoveredPoint.x / CHART.width) * 100}%`,
        top: `${(hoveredPoint.y / CHART.height) * 100}%`
      }
    : null;
  const tooltipClassName = (() => {
    if (!hoveredPoint) return "rate-trend-tooltip";
    const xPct = (hoveredPoint.x / CHART.width) * 100;
    const yPct = (hoveredPoint.y / CHART.height) * 100;
    const horizontal = xPct < 18 ? "is-left" : xPct > 82 ? "is-right" : "is-center";
    const vertical = yPct < 20 ? "is-below" : "is-above";
    return `rate-trend-tooltip ${horizontal} ${vertical}`;
  })();

  return (
    <>
      <div className="rate-chart-subtitle">Mortgage Rates: Daily Index</div>
      <div className="rate-trend-controls" role="tablist" aria-label="Rate trend range">
        {RANGE_OPTIONS.map((days) => (
          <button
            key={days}
            type="button"
            className={days === rangeDays ? "is-active" : ""}
            onClick={() => {
              setRangeDays(days);
              setHoveredPoint(null);
            }}
            aria-pressed={days === rangeDays}
          >
            {days}
          </button>
        ))}
      </div>
      <div className="rate-trend-plot-wrap">
        {chartData ? (
          <svg
            className="rate-trend-plot"
            viewBox={`0 0 ${CHART.width} ${CHART.height}`}
            aria-hidden="true"
            onMouseLeave={() => setHoveredPoint(null)}
          >
            {chartData.yTicks.map((tick) => (
              <g key={tick.label}>
                <line x1={CHART.marginLeft} y1={tick.y} x2={CHART.width - CHART.marginRight} y2={tick.y} />
                <text x={8} y={tick.y + 4} className="rate-axis-label">
                  {tick.label}
                </text>
              </g>
            ))}
            {chartData.xTicks.map((tick) => (
              <g key={`${tick.label}-${tick.x}`}>
                <line
                  x1={tick.x}
                  y1={CHART.marginTop}
                  x2={tick.x}
                  y2={CHART.height - CHART.marginBottom}
                  className="rate-axis-vertical"
                />
                <text x={tick.x} y={CHART.height - 14} textAnchor="middle" className="rate-axis-label rate-axis-date">
                  {tick.label}
                </text>
              </g>
            ))}
            {chartData.lines.map((line) => (
              <g key={line.key}>
                <path d={line.path} stroke={line.color} className="rate-trend-line" />
                <path
                  d={line.path}
                  className="rate-trend-line-hit"
                  onMouseMove={(event) => handleLineHover(line, event)}
                  onMouseEnter={(event) => handleLineHover(line, event)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              </g>
            ))}
            {hoveredPoint ? <circle cx={hoveredPoint.x} cy={hoveredPoint.y} r={4} fill={hoveredPoint.color} className="rate-hover-dot" /> : null}
          </svg>
        ) : (
          <div className="rate-trend-empty">Trend data unavailable.</div>
        )}

        {hoveredPoint && tooltipPosition ? (
          <div className={tooltipClassName} style={tooltipPosition}>
            <div className="rate-trend-tooltip-date">{DATE_FORMATTER.format(hoveredPoint.date)}</div>
            <div className="rate-trend-tooltip-detail">
              {hoveredPoint.label} : {formatRate(hoveredPoint.rate)}
            </div>
          </div>
        ) : null}
      </div>
      <ul className="rate-trend-legend" aria-label="Rate trend series">
        {series.map((line) => (
          <li key={line.key}>
            <button
              type="button"
              className={enabledKeys.includes(line.key) ? "is-on" : "is-off"}
              onClick={() => {
                toggleSeries(line.key);
                setHoveredPoint(null);
              }}
              aria-pressed={enabledKeys.includes(line.key)}
            >
              <span className="rate-loan-color" style={{ backgroundColor: line.color }} aria-hidden="true" />
              <span className="rate-loan-label">{line.label}</span>
              <strong className="rate-loan-rate">
                {line.currentRate && line.currentRate > 0 ? `${line.currentRate.toFixed(3)}%` : "--"}
              </strong>
              <em
                className={
                  typeof line.currentChange === "number"
                    ? line.currentChange > 0
                      ? "rate-loan-change is-up"
                      : line.currentChange < 0
                        ? "rate-loan-change is-down"
                        : "rate-loan-change"
                    : "rate-loan-change"
                }
              >
                {typeof line.currentChange === "number" && line.currentRate && line.currentRate > 0
                  ? `${line.currentChange > 0 ? "+" : ""}${line.currentChange.toFixed(3)}%`
                  : "--"}
              </em>
            </button>
          </li>
        ))}
      </ul>
      <p className="rate-disclaimer">Last Updated: {updatedLabel ?? "N/A"} | Snapshot: {fetchedAtEtLabel}</p>
      <p className="rate-bottom-disclaimer">
        Rates shown are market indices for informational purposes only and do not constitute a quote, rate lock, or lending commitment.
      </p>
    </>
  );
}
