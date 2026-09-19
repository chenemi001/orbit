import {
  CheckCircle2,
  Clock3,
  FolderKanban,
  ListTodo,
} from "lucide-react";

import { StatCard } from "./StatCard";
import type { DashboardData } from "@/lib/services/dashboard.service";

interface StatsGridProps {
  stats: DashboardData["stats"];
}

export function StatsGrid({ stats }: StatsGridProps) {
  const items = [
    {
      label: "Active projects",
      value: stats.activeProjects,
      description: "currently in progress",
      icon: FolderKanban,
    },
    {
      label: "Open tasks",
      value: stats.openTasks,
      description: "assigned to you",
      icon: ListTodo,
    },
    {
      label: "Completed",
      value: stats.completedTasks,
      description: "tasks you've finished",
      icon: CheckCircle2,
    },
    {
      label: "Overdue",
      value: stats.overdueTasks,
      description: "past their due date",
      icon: Clock3,
    },
  ];

  return (
    <section
      aria-label="Workspace statistics"
      className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {items.map((item) => (
        <StatCard key={item.label} {...item} />
      ))}
    </section>
  );
}
