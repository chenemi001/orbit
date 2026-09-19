import Link from "next/link";
import { Clock3, Plus } from "lucide-react";

interface DashboardHeaderProps {
  userName: string;
}

function greeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function DashboardHeader({ userName }: DashboardHeaderProps) {
  const firstName = userName.trim().split(/\s+/)[0] ?? userName;
  const today = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <section className="relative mb-7 overflow-hidden rounded-[26px] bg-transparent">
      <div className="relative z-10 flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
        <div>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#344f49]">
            {greeting()}
          </p>

          <h1 className="text-[34px] font-semibold leading-[1.08] tracking-[-0.035em] text-[#0d1917] sm:text-[42px]">
            Welcome back,{" "}
            <span className="text-[#2ba386]">{firstName}.</span>
          </h1>

          <p className="mt-3 text-[16px] text-[#71837d]">
            Here&apos;s what&apos;s happening across your workspace today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-11 items-center gap-2 rounded-xl border border-[#dfe8e5] bg-white px-4 text-sm font-medium text-[#17211f] shadow-sm">
            <Clock3 size={16} />
            {today}
          </div>

          <Link
            href="/tasks?new=true"
            className="flex h-11 items-center gap-2 rounded-xl bg-[#092c26] px-5 text-sm font-semibold text-white shadow-lg shadow-[#092c26]/15 transition hover:bg-[#0d4037]"
          >
            <Plus size={18} />
            New task
          </Link>
        </div>
      </div>

      <div className="pointer-events-none absolute right-[18%] top-0 hidden h-40 w-40 rounded-full bg-gradient-to-br from-[#dffbf4] via-[#c7efe7] to-transparent blur-2xl xl:block" />
    </section>
  );
}
