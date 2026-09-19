"use client";

import { useState } from "react";

interface ActivityPoint {
  date: string;
  count: number;
}

interface ActivityChartProps {
  data: ActivityPoint[];
}

const WIDTH = 640;
const HEIGHT = 160;
const PADDING = 24;

export function ActivityChart({ data }: ActivityChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const max = Math.max(1, ...data.map((d) => d.count));
  const stepX =
    data.length > 1 ? (WIDTH - PADDING * 2) / (data.length - 1) : 0;

  const points = data.map((point, index) => {
    const x = PADDING + index * stepX;
    const y =
      HEIGHT - PADDING - (point.count / max) * (HEIGHT - PADDING * 2);
    return { x, y, ...point };
  });

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const areaPath = `${linePath} L ${points[points.length - 1]?.x ?? PADDING} ${HEIGHT - PADDING} L ${PADDING} ${HEIGHT - PADDING} Z`;

  const hovered = hoverIndex !== null ? points[hoverIndex] : null;

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
      <h2 className="text-sm font-semibold">Activity, last 14 days</h2>
      <p className="mt-1 text-xs text-[var(--muted)]">
        Actions logged across your projects
      </p>

      <div className="relative mt-6">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="w-full"
          role="img"
          aria-label="Activity over the last 14 days"
          onMouseLeave={() => setHoverIndex(null)}
        >
          <line
            x1={PADDING}
            y1={HEIGHT - PADDING}
            x2={WIDTH - PADDING}
            y2={HEIGHT - PADDING}
            stroke="var(--border)"
            strokeWidth={1}
          />

          <path
            d={areaPath}
            fill="var(--primary)"
            fillOpacity={0.08}
            stroke="none"
          />

          <path
            d={linePath}
            fill="none"
            stroke="var(--primary)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {points.map((point, index) => (
            <g key={point.date}>
              <rect
                x={point.x - stepX / 2}
                y={0}
                width={Math.max(stepX, 1)}
                height={HEIGHT}
                fill="transparent"
                onMouseEnter={() => setHoverIndex(index)}
              />

              {hoverIndex === index && (
                <>
                  <line
                    x1={point.x}
                    y1={0}
                    x2={point.x}
                    y2={HEIGHT - PADDING}
                    stroke="var(--border)"
                    strokeWidth={1}
                  />
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={4}
                    fill="var(--card)"
                    stroke="var(--primary)"
                    strokeWidth={2}
                  />
                </>
              )}
            </g>
          ))}
        </svg>

        {hovered && (
          <div
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-2.5 py-1.5 text-[11px] shadow-lg"
            style={{
              left: `${(hovered.x / WIDTH) * 100}%`,
              top: `${(hovered.y / HEIGHT) * 100}%`,
            }}
          >
            <p className="font-semibold">{hovered.count} actions</p>
            <p className="text-[var(--muted)]">
              {new Date(hovered.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
