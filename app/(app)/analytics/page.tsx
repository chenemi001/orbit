import {
  AlertTriangle,
  CheckCircle2,
  FolderKanban,
  ListTodo,
} from "lucide-react";

import { requireUser } from "@/lib/auth";
import { getWorkspaceAnalytics } from "@/lib/services/analytics.service";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { BarChart } from "@/components/analytics/BarChart";
import { ActivityChart } from "@/components/analytics/ActivityChart";

export default async function AnalyticsPage() {
  const user = await requireUser();
  const analytics = await getWorkspaceAnalytics(user.id);

  if (analytics.totalProjects === 0) {
    return (
      <div className="mx-auto max-w-[1200px]">
        <PageHeader
          title="Analytics"
          description="Insights across your projects and tasks."
        />

        <EmptyState
          icon={<FolderKanban size={20} strokeWidth={1.8} />}
          title="Nothing to analyze yet"
          description="Create a project and add some tasks to see analytics here."
        />
      </div>
    );
  }

  const priorityData = ["low", "medium", "high", "urgent"].map((key) => ({
    label: key,
    value: analytics.priorityDistribution[key] ?? 0,
  }));

  const statusData = ["todo", "in_progress", "in_review", "completed"].map(
    (key) => ({
      label: key,
      value: analytics.statusDistribution[key] ?? 0,
    }),
  );

  return (
    <div className="mx-auto max-w-[1200px]">
      <PageHeader
        title="Analytics"
        description="Insights across your projects and tasks."
      />

      <section className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          icon={FolderKanban}
          label="Active projects"
          value={analytics.activeProjects}
          sublabel={`${analytics.totalProjects} total`}
        />
        <StatTile
          icon={ListTodo}
          label="Total tasks"
          value={analytics.totalTasks}
          sublabel={`${analytics.completedTasks} completed`}
        />
        <StatTile
          icon={CheckCircle2}
          label="Completion rate"
          value={`${analytics.completionRate}%`}
          sublabel="across all tasks"
        />
        <StatTile
          icon={AlertTriangle}
          label="Overdue tasks"
          value={analytics.overdueTasks}
          sublabel="need attention"
          danger={analytics.overdueTasks > 0}
        />
      </section>

      <section className="mb-5">
        <ActivityChart data={analytics.activityByDay} />
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <BarChart
          title="Tasks by priority"
          description="How your open work is prioritized"
          data={priorityData}
        />

        <BarChart
          title="Tasks by status"
          description="Where tasks currently stand"
          data={statusData}
        />
      </section>

      <section className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <h2 className="text-sm font-semibold">Project progress</h2>

        <div className="mt-5 space-y-4">
          {analytics.projectProgress.map((project) => (
            <div key={project.id}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="font-medium">{project.name}</span>
                <span className="text-xs font-semibold text-[var(--muted)]">
                  {project.progress}%
                </span>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-[var(--accent)]">
                <div
                  className="h-full rounded-full bg-[var(--primary)] transition-all duration-500"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  sublabel,
  danger,
}: {
  icon: typeof FolderKanban;
  label: string;
  value: string | number;
  sublabel: string;
  danger?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-[var(--muted)]">{label}</p>
        <Icon
          size={16}
          className={danger ? "text-[var(--danger)]" : "text-[var(--muted)]"}
        />
      </div>

      <p
        className={`mt-3 text-2xl font-semibold tracking-tight ${
          danger ? "text-[var(--danger)]" : ""
        }`}
      >
        {value}
      </p>

      <p className="mt-1 text-xs text-[var(--muted)]">{sublabel}</p>
    </div>
  );
}
