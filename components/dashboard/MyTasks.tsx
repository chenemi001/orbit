"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Circle } from "lucide-react";

import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/utils/formatters";
import type { DashboardTask } from "@/lib/services/dashboard.service";

interface MyTasksProps {
  tasks: DashboardTask[];
  openCount: number;
}

const priorityStyles: Record<string, string> = {
  urgent: "bg-red-50 text-red-600",
  high: "bg-red-50 text-red-600",
  medium: "bg-orange-50 text-orange-600",
  low: "bg-blue-50 text-blue-600",
};

export function MyTasks({ tasks, openCount }: MyTasksProps) {
  const [items, setItems] = useState(tasks);
  const [completingId, setCompletingId] = useState<string | null>(null);

  async function completeTask(id: string) {
    setCompletingId(id);

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });

      if (response.ok) {
        setItems((current) => current.filter((task) => task.id !== id));
      }
    } finally {
      setCompletingId(null);
    }
  }

  return (
    <div className="rounded-[20px] border border-[#dfe9e5] bg-white shadow-[0_8px_30px_rgba(19,50,44,0.035)]">
      <div className="flex items-center justify-between border-b border-[#e8eeeb] px-5 py-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e4f5f0] text-[#168b70]">
              <Check size={17} />
            </div>

            <h2 className="text-[19px] font-semibold text-[#101c19]">
              My Tasks
            </h2>
          </div>

          <p className="mt-2 text-xs text-[#73847f]">
            {openCount} open {openCount === 1 ? "task" : "tasks"} assigned to
            you
          </p>
        </div>

        <Link
          href="/tasks"
          className="hidden items-center gap-1 text-sm font-medium text-[#1a2925] sm:flex"
        >
          View all
          <ArrowRight size={16} />
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="px-5 py-10">
          <EmptyState
            title="You're all caught up"
            description="No open tasks assigned to you right now."
          />
        </div>
      ) : (
        <div className="px-5">
          {items.map((task, index) => (
            <div
              key={task.id}
              className={`grid grid-cols-[28px_minmax(0,1fr)_90px_72px] items-center gap-3 py-4 ${
                index !== items.length - 1
                  ? "border-b border-[#edf1ef]"
                  : ""
              }`}
            >
              <button
                type="button"
                onClick={() => completeTask(task.id)}
                disabled={completingId === task.id}
                aria-label={`Mark "${task.title}" complete`}
                className="flex h-5 w-5 items-center justify-center text-[#78908a] transition hover:text-[#168b70] disabled:opacity-50"
              >
                <Circle size={17} strokeWidth={1.8} />
              </button>

              <Link
                href={`/projects/${task.projectId}?tab=tasks&taskId=${task.id}`}
                className="min-w-0"
              >
                <p className="truncate text-sm font-semibold text-[#1b2724]">
                  {task.title}
                </p>

                <p className="mt-1 truncate text-xs text-[#73847f]">
                  {task.projectName}
                </p>
              </Link>

              <span className="text-xs text-[#58706a]">
                {task.dueDate ? formatDate(task.dueDate) : "No due date"}
              </span>

              <span
                className={`justify-self-end rounded-full px-3 py-1 text-[11px] font-semibold ${
                  priorityStyles[task.priority] ?? priorityStyles.medium
                }`}
              >
                {task.priority}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
