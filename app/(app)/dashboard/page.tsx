import { requireUser } from "@/lib/auth";
import { getDashboardData } from "@/lib/services/dashboard.service";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { MyTasks } from "@/components/dashboard/MyTasks";
import { ProjectHealth } from "@/components/dashboard/ProjectHealth";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { ProjectCTA } from "@/components/dashboard/ProjectCTA";

export default async function DashboardPage() {
  const user = await requireUser();
  const data = await getDashboardData(user.id);

  return (
    <div className="mx-auto max-w-[1280px] text-[#101b19]">
      <DashboardHeader userName={user.name} />

      <StatsGrid stats={data.stats} />

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(330px,0.85fr)]">
        <MyTasks tasks={data.myTasks} openCount={data.stats.openTasks} />
        <ProjectHealth projects={data.projects} health={data.health} />
      </section>

      <section className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1fr_0.9fr]">
        <ActivityFeed activity={data.activity} />
        <QuickActions />
        <ProjectCTA />
      </section>
    </div>
  );
}
