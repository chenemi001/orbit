import Link from "next/link";

const tasks = [
  {
    title: "Design homepage",
    status: "In Progress",
    progress: 72,
    dot: "bg-amber-400",
  },
  {
    title: "Build authentication",
    status: "Completed",
    progress: 100,
    dot: "bg-emerald-400",
  },
  {
    title: "Connect project API",
    status: "In Review",
    progress: 84,
    dot: "bg-violet-400",
  },
  {
    title: "Mobile responsiveness",
    status: "Todo",
    progress: 28,
    dot: "bg-blue-400",
  },
];

const members = [
  { initials: "AO", name: "Alex", progress: 82 },
  { initials: "JS", name: "Jordan", progress: 67 },
  { initials: "MK", name: "Maya", progress: 54 },
  { initials: "RV", name: "Ryan", progress: 41 },
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#070a09] text-white">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-[22%] top-[-280px] h-[650px] w-[650px] rounded-full bg-[#20d9b0]/10 blur-[150px]" />

        <div className="absolute right-[-200px] top-[25%] h-[500px] w-[500px] rounded-full bg-[#285a48]/10 blur-[150px]" />

        <div className="absolute bottom-[-250px] left-[20%] h-[500px] w-[500px] rounded-full bg-[#65dcd5]/5 blur-[150px]" />
      </div>

      {/* ─────────────────────────────────────
          NAVBAR
      ───────────────────────────────────── */}

      <header className="relative z-50 border-b border-white/[0.07]">
        <div className="mx-auto flex h-[72px] max-w-[1500px] items-center justify-between px-5 lg:px-10">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-gradient-to-br from-[#55e5c5] to-[#238c74] text-[17px] font-bold text-[#07100d] shadow-[0_0_25px_rgba(65,220,185,0.18)]">
              O
            </span>

            <span className="text-[17px] font-semibold tracking-[-0.025em]">
              Orbit
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#product"
              className="text-[13px] text-white/55 transition hover:text-white"
            >
              Product
            </a>

            <a
              href="#features"
              className="text-[13px] text-white/55 transition hover:text-white"
            >
              Features
            </a>

            <a
              href="#workspace"
              className="text-[13px] text-white/55 transition hover:text-white"
            >
              Workspace
            </a>

            <a
              href="#pricing"
              className="text-[13px] text-white/55 transition hover:text-white"
            >
              Pricing
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden px-3 py-2 text-[13px] font-medium text-white/60 transition hover:text-white sm:block"
            >
              Sign in
            </Link>

            <Link
              href="/register"
              className="group flex items-center gap-2 rounded-[9px] bg-[#5ce8ca] px-5 py-2.5 text-[13px] font-bold text-[#07100d] shadow-[0_8px_30px_rgba(92,232,202,0.16)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#79f0d5] hover:shadow-[0_10px_35px_rgba(92,232,202,0.28)]"
            >
              Get started

              <span className="text-[16px] transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────
          HERO
      ───────────────────────────────────── */}

      <section
        id="product"
        className="relative mx-auto max-w-[1500px] px-5 pb-20 pt-16 lg:px-10 lg:pb-28 lg:pt-24"
      >
        <div className="grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
          {/* Hero copy */}
          <div className="relative z-10">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.025] px-3.5 py-2 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[#5ce8ca] shadow-[0_0_12px_rgba(92,232,202,0.8)]" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">
                Built for modern teams
              </span>
            </div>

            <h1 className="max-w-[720px] text-[54px] font-semibold leading-[0.96] tracking-[-0.06em] sm:text-[68px] lg:text-[78px] xl:text-[88px]">
              Plan together.
              <br />

              <span className="text-white">
                Build faster.
              </span>

              <br />

              <span className="bg-gradient-to-r from-[#5ce8ca] via-[#43d8bc] to-[#62cfc8] bg-clip-text text-transparent">
                Go further.
              </span>
            </h1>

            <p className="mt-7 max-w-[540px] text-[15px] leading-7 text-white/45 sm:text-[16px]">
              Orbit brings projects, tasks, people, and
              intelligent assistance into one focused
              workspace — so your team can move from
              ideas to impact.
            </p>

            {/* CTA */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="group flex h-[54px] items-center justify-center gap-3 rounded-[10px] bg-[#5ce8ca] px-7 text-[14px] font-bold text-[#07100d] shadow-[0_12px_40px_rgba(92,232,202,0.18)] transition-all duration-200 hover:-translate-y-1 hover:bg-[#7af0d7] hover:shadow-[0_18px_50px_rgba(92,232,202,0.3)]"
              >
                Get started

                <span className="text-[18px] transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <Link
                href="#workspace"
                className="flex h-[54px] items-center justify-center gap-3 rounded-[10px] border border-white/[0.13] bg-white/[0.025] px-7 text-[14px] font-semibold text-white/80 backdrop-blur transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/20 text-[9px]">
                  ▶
                </span>

                Watch demo
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 grid max-w-[560px] grid-cols-3 border-t border-white/[0.08] pt-6">
              <Stat
                value="10K+"
                label="Teams trust Orbit"
              />

              <Stat
                value="2M+"
                label="Tasks completed"
              />

              <Stat
                value="99.9%"
                label="Uptime"
              />
            </div>
          </div>

          {/* Dashboard */}
          <div
            id="workspace"
            className="relative min-w-0 lg:-mr-20"
          >
            {/* Glow behind dashboard */}
            <div className="absolute -inset-10 rounded-full bg-[#3fd8b7]/10 blur-[100px]" />

            <div className="relative overflow-hidden rounded-[14px] border border-white/[0.12] bg-[#0e1210] shadow-[0_50px_140px_rgba(0,0,0,0.6)]">
              {/* App chrome */}
              <div className="flex h-[43px] items-center border-b border-white/[0.07] bg-[#101411] px-4">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff6259]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd44]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                </div>

                <div className="mx-auto hidden h-6 w-[230px] items-center justify-center rounded-md border border-white/[0.05] bg-white/[0.02] sm:flex">
                  <span className="text-[9px] text-white/20">
                    app.orbit.workspace
                  </span>
                </div>

                <div className="h-6 w-6 rounded-full bg-white/[0.05]" />
              </div>

              <div className="grid min-h-[540px] grid-cols-[155px_1fr] sm:grid-cols-[180px_1fr]">
                {/* Sidebar */}
                <aside className="border-r border-white/[0.07] bg-[#0b0e0c] p-3.5">
                  <div className="flex items-center gap-2 px-1.5">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#285a48] text-[9px] font-bold">
                      O
                    </span>

                    <span className="text-[10px] font-semibold">
                      Orbit
                    </span>
                  </div>

                  <div className="mt-5 h-7 rounded-md border border-white/[0.06] bg-white/[0.02] px-2 text-[9px] leading-7 text-white/20">
                    Search...
                  </div>

                  <div className="mt-4 space-y-0.5">
                    <SidebarItem
                      icon="▣"
                      label="Inbox"
                      count="99+"
                      active
                    />

                    <SidebarItem
                      icon="◎"
                      label="My issues"
                    />

                    <SidebarItem
                      icon="✦"
                      label="Pulse"
                    />

                    <SidebarItem
                      icon="↗"
                      label="Reviews"
                    />

                    <SidebarItem
                      icon="□"
                      label="Drafts"
                      count="2"
                    />
                  </div>

                  <div className="mt-6 px-2 text-[8px] font-semibold uppercase tracking-[0.16em] text-white/20">
                    Workspace
                  </div>

                  <div className="mt-2 space-y-0.5">
                    <SidebarItem
                      icon="◇"
                      label="Projects"
                    />

                    <SidebarItem
                      icon="☷"
                      label="Tasks"
                    />

                    <SidebarItem
                      icon="♙"
                      label="Members"
                    />

                    <SidebarItem
                      icon="◫"
                      label="Views"
                    />
                  </div>

                  <div className="mt-6 px-2 text-[8px] font-semibold uppercase tracking-[0.16em] text-white/20">
                    Favorites
                  </div>

                  <div className="mt-2 space-y-0.5">
                    <Favorite
                      color="bg-violet-400"
                      label="Website"
                    />

                    <Favorite
                      color="bg-blue-400"
                      label="Mobile App"
                    />

                    <Favorite
                      color="bg-emerald-400"
                      label="Marketing"
                    />

                    <Favorite
                      color="bg-amber-400"
                      label="Research"
                    />
                  </div>

                  <div className="mt-8 flex items-center gap-2 border-t border-white/[0.06] pt-4">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2d3934] text-[7px] font-medium">
                      V
                    </div>

                    <div className="min-w-0">
                      <div className="truncate text-[8px] text-white/65">
                        Victoria
                      </div>

                      <div className="truncate text-[7px] text-white/20">
                        vicky@orbit.com
                      </div>
                    </div>
                  </div>
                </aside>

                {/* Workspace */}
                <div className="min-w-0 bg-[#101311]">
                  {/* Breadcrumb */}
                  <div className="flex h-[42px] items-center border-b border-white/[0.07] px-4 sm:px-5">
                    <span className="text-[9px] text-white/30">
                      Projects
                    </span>

                    <span className="mx-2 text-white/15">
                      ›
                    </span>

                    <span className="text-[9px] text-white/80">
                      Website
                    </span>

                    <span className="ml-2 text-white/30">
                      ☆
                    </span>

                    <div className="ml-auto flex gap-1.5">
                      <button className="hidden rounded-md border border-white/[0.07] px-2 py-1 text-[8px] text-white/40 sm:block">
                        Share
                      </button>

                      <button className="rounded-md border border-white/[0.07] px-2 py-1 text-[9px] text-white/40">
                        •••
                      </button>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 lg:p-6">
                    {/* Project tabs */}
                    <div className="mb-5 flex items-center gap-1 overflow-hidden">
                      {[
                        "Overview",
                        "Updates",
                        "Issues",
                        "Tasks",
                        "Roadmap",
                      ].map((tab, index) => (
                        <span
                          key={tab}
                          className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[8px] ${
                            index === 0
                              ? "bg-white/[0.09] text-white"
                              : "text-white/30"
                          }`}
                        >
                          {tab}
                        </span>
                      ))}
                    </div>

                    {/* Project / Progress */}
                    <div className="grid gap-3 lg:grid-cols-[1fr_0.82fr]">
                      <div className="rounded-[10px] border border-white/[0.07] bg-[#0d100e] p-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.05] text-sm">
                          ◇
                        </div>

                        <h3 className="mt-3 text-[20px] font-semibold tracking-[-0.035em]">
                          Website
                        </h3>

                        <p className="mt-1.5 max-w-[280px] text-[8px] leading-4 text-white/30">
                          Build and launch the next generation
                          of the Orbit marketing website.
                        </p>

                        <div className="mt-5 flex flex-wrap gap-2">
                          <SmallTag
                            dot="bg-[#5ce8ca]"
                            text="In Progress"
                          />

                          <SmallTag
                            icon="▮"
                            text="High"
                          />

                          <SmallTag
                            icon="●"
                            text="Alex"
                          />
                        </div>

                        <div className="mt-3 flex flex-wrap gap-4 text-[8px] text-white/30">
                          <span>◷ Jan 29th → Mar 16th</span>
                          <span>▣ Engineering</span>
                        </div>
                      </div>

                      {/* Chart */}
                      <div className="rounded-[10px] border border-white/[0.07] bg-[#0d100e] p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-medium text-white/70">
                            Progress
                          </span>

                          <span className="text-[8px] text-white/25">
                            This month⌄
                          </span>
                        </div>

                        <div className="mt-4 flex items-end gap-2">
                          <div className="text-[8px] text-white/30">
                            Scope
                            <div className="mt-1 text-[11px] text-white/70">
                              717
                            </div>
                          </div>

                          <div className="text-[8px] text-white/30">
                            Started
                            <div className="mt-1 text-[11px] text-white/70">
                              107
                            </div>
                          </div>

                          <div className="text-[8px] text-white/30">
                            Completed
                            <div className="mt-1 text-[11px] text-white/70">
                              456
                            </div>
                          </div>
                        </div>

                        <div className="relative mt-5 h-[85px] overflow-hidden">
                          <div className="absolute inset-x-0 top-[20px] border-t border-white/[0.05]" />
                          <div className="absolute inset-x-0 top-[45px] border-t border-white/[0.05]" />
                          <div className="absolute inset-x-0 top-[70px] border-t border-white/[0.05]" />

                          <svg
                            viewBox="0 0 300 90"
                            className="absolute inset-0 h-full w-full"
                            preserveAspectRatio="none"
                          >
                            <path
                              d="M0 80 C35 75, 55 77, 75 62 S115 45, 135 50 S165 45, 185 36 S215 28, 235 15 S270 13, 300 4"
                              fill="none"
                              stroke="#5ce8ca"
                              strokeWidth="2"
                              opacity="0.8"
                            />

                            <path
                              d="M0 84 C40 82, 65 75, 88 70 S130 65, 150 55 S190 50, 215 38 S260 30, 300 18"
                              fill="none"
                              stroke="#7281e8"
                              strokeWidth="1.5"
                              opacity="0.55"
                            />

                            <line
                              x1="235"
                              y1="0"
                              x2="235"
                              y2="90"
                              stroke="#ffffff"
                              strokeDasharray="3 3"
                              opacity="0.18"
                            />

                            <circle
                              cx="235"
                              cy="15"
                              r="3"
                              fill="#5ce8ca"
                            />
                          </svg>
                        </div>

                        <div className="flex justify-between text-[7px] text-white/20">
                          <span>Jan 29</span>
                          <span>Mar 16</span>
                          <span>Apr 6</span>
                        </div>
                      </div>
                    </div>

                    {/* Lower cards */}
                    <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_0.62fr]">
                      {/* Tasks */}
                      <div className="rounded-[10px] border border-white/[0.07] bg-[#0d100e]">
                        <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
                          <div>
                            <h3 className="text-[9px] font-medium text-white/80">
                              Recent tasks
                            </h3>

                            <p className="mt-0.5 text-[7px] text-white/20">
                              Active work in this project
                            </p>
                          </div>

                          <span className="text-[8px] text-white/30">
                            View all →
                          </span>
                        </div>

                        <div>
                          {tasks.map((task) => (
                            <div
                              key={task.title}
                              className="flex items-center gap-2.5 border-b border-white/[0.04] px-4 py-3 last:border-0"
                            >
                              <span
                                className={`h-2.5 w-2.5 shrink-0 rounded-full ${task.dot}`}
                              />

                              <span className="min-w-0 flex-1 truncate text-[8px] text-white/70">
                                {task.title}
                              </span>

                              <span className="hidden text-[7px] text-white/25 sm:block">
                                {task.status}
                              </span>

                              <div className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-white/[0.07] sm:block">
                                <div
                                  className="h-full rounded-full bg-[#5ce8ca]"
                                  style={{
                                    width: `${task.progress}%`,
                                  }}
                                />
                              </div>

                              <span className="w-5 text-right text-[7px] text-white/25">
                                {task.progress}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Assignees */}
                      <div className="rounded-[10px] border border-white/[0.07] bg-[#0d100e]">
                        <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
                          <h3 className="text-[9px] font-medium text-white/80">
                            Assignees
                          </h3>

                          <span className="text-[8px] text-white/30">
                            View all →
                          </span>
                        </div>

                        {members.map((member) => (
                          <div
                            key={member.name}
                            className="flex items-center gap-2 border-b border-white/[0.04] px-4 py-2.5 last:border-0"
                          >
                            <div className="flex h-6 w-6 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.05] text-[7px] text-white/60">
                              {member.initials}
                            </div>

                            <span className="flex-1 text-[8px] text-white/55">
                              {member.name}
                            </span>

                            <div className="h-1.5 w-10 overflow-hidden rounded-full bg-white/[0.06]">
                              <div
                                className="h-full rounded-full bg-[#5ce8ca]"
                                style={{
                                  width: `${member.progress}%`,
                                }}
                              />
                            </div>

                            <span className="text-[7px] text-white/20">
                              {member.progress}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────
          FEATURES
      ───────────────────────────────────── */}

      <section
        id="features"
        className="relative border-t border-white/[0.07]"
      >
        <div className="mx-auto max-w-[1500px] px-5 py-20 lg:px-10 lg:py-24">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            <Feature
              icon="◇"
              title="Projects"
              description="Organize, plan, and track progress with clarity."
            />

            <Feature
              icon="✓"
              title="Tasks"
              description="Turn ideas into actionable work your team can own."
            />

            <Feature
              icon="♙"
              title="Collaboration"
              description="Bring your team together and keep everyone aligned."
            />

            <Feature
              icon="✦"
              title="AI assistance"
              description="Get intelligent help to plan and move faster."
            />
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────
          CTA
      ───────────────────────────────────── */}

      <section
        id="pricing"
        className="relative border-t border-white/[0.07]"
      >
        <div className="mx-auto max-w-[1500px] px-5 py-28 text-center lg:px-10">
          <div className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-[#5ce8ca] to-transparent" />

          <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#5ce8ca]">
            Your team&apos;s next chapter
          </p>

          <h2 className="mx-auto mt-5 max-w-3xl text-5xl font-semibold tracking-[-0.055em] sm:text-7xl">
            Put your work
            <br />
            in{" "}
            <span className="text-[#5ce8ca]">
              Orbit.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-md text-sm leading-6 text-white/35">
            Everything you need to plan, build, collaborate,
            and ship better work.
          </p>

          <Link
            href="/register"
            className="group mt-9 inline-flex h-[54px] items-center gap-3 rounded-[10px] bg-[#5ce8ca] px-7 text-[14px] font-bold text-[#07100d] shadow-[0_12px_40px_rgba(92,232,202,0.18)] transition-all hover:-translate-y-1 hover:bg-[#7af0d7] hover:shadow-[0_18px_50px_rgba(92,232,202,0.3)]"
          >
            Get started

            <span className="text-[18px] transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </section>

      {/* ─────────────────────────────────────
          FOOTER
      ───────────────────────────────────── */}

      <footer className="border-t border-white/[0.07]">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-4 px-5 py-7 text-[11px] text-white/25 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#285a48] text-[10px] font-bold text-white">
              O
            </span>

            <span>Orbit</span>
          </div>

          <span>
            © {new Date().getFullYear()} Orbit. All rights reserved.
          </span>
        </div>
      </footer>
    </main>
  );
}

/* ─────────────────────────────────────────
   Components
───────────────────────────────────────── */

function Stat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="border-r border-white/[0.08] px-4 first:pl-0 last:border-0">
      <div className="text-[21px] font-semibold tracking-[-0.04em] text-white">
        {value}
      </div>

      <div className="mt-1 text-[9px] text-white/30 sm:text-[10px]">
        {label}
      </div>
    </div>
  );
}

function SidebarItem({
  icon,
  label,
  count,
  active = false,
}: {
  icon: string;
  label: string;
  count?: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex h-7 items-center gap-2 rounded-md px-2 text-[9px] ${
        active
          ? "bg-white/[0.06] text-white"
          : "text-white/35"
      }`}
    >
      <span className="w-3 text-center text-white/30">
        {icon}
      </span>

      <span className="flex-1 truncate">
        {label}
      </span>

      {count && (
        <span className="text-[7px] text-white/20">
          {count}
        </span>
      )}
    </div>
  );
}

function Favorite({
  color,
  label,
}: {
  color: string;
  label: string;
}) {
  return (
    <div className="flex h-7 items-center gap-2 px-2 text-[9px] text-white/35">
      <span
        className={`h-2 w-2 rounded-full ${color}`}
      />

      {label}
    </div>
  );
}

function SmallTag({
  dot,
  icon,
  text,
}: {
  dot?: string;
  icon?: string;
  text: string;
}) {
  return (
    <span className="flex items-center gap-1.5 rounded-md border border-white/[0.06] bg-white/[0.025] px-2 py-1 text-[7px] text-white/45">
      {dot && (
        <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      )}

      {icon && (
        <span className="text-white/25">
          {icon}
        </span>
      )}

      {text}
    </span>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <article className="border-l border-white/[0.08] pl-6">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.025] text-sm text-[#5ce8ca]">
        {icon}
      </div>

      <h3 className="mt-5 text-[15px] font-semibold">
        {title}
      </h3>

      <p className="mt-2 max-w-[240px] text-[11px] leading-5 text-white/30">
        {description}
      </p>
    </article>
  );
}