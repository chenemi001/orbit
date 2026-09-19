import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
}

export function StatCard({
  label,
  value,
  description,
  icon: Icon,
}: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-[20px] border border-[#dfe9e5] bg-white p-5 shadow-[0_8px_30px_rgba(19,50,44,0.035)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[13px] font-medium text-[#687a75]">{label}</p>

          <p className="mt-2 text-[30px] font-semibold tracking-[-0.04em] text-[#101c19]">
            {value}
          </p>

          <p className="mt-2 text-xs text-[#71817c]">{description}</p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eff8f5] text-[#189879]">
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}
