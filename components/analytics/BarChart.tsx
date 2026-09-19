interface BarChartDatum {
  label: string;
  value: number;
}

interface BarChartProps {
  data: BarChartDatum[];
  title: string;
  description?: string;
}

export function BarChart({ data, title, description }: BarChartProps) {
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
      <h2 className="text-sm font-semibold">{title}</h2>
      {description && (
        <p className="mt-1 text-xs text-[var(--muted)]">{description}</p>
      )}

      <div className="mt-6 flex items-end gap-4" style={{ height: 160 }}>
        {data.map((datum) => {
          const heightPct = (datum.value / max) * 100;

          return (
            <div
              key={datum.label}
              className="flex flex-1 flex-col items-center gap-2"
            >
              <span className="text-xs font-semibold text-[var(--foreground)]">
                {datum.value}
              </span>

              <div className="flex h-full w-full items-end">
                <div
                  className="w-full rounded-t-[4px] bg-[var(--primary)] transition-all duration-500"
                  style={{
                    height: `${Math.max(heightPct, datum.value > 0 ? 4 : 0)}%`,
                  }}
                />
              </div>

              <span className="text-[10px] capitalize text-[var(--muted)]">
                {datum.label.replace(/_/g, " ")}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
