import type { Task } from "@/types/task";
import { EmptyState } from "@/components/ui/EmptyState";
import { TaskRow } from "./TaskRow";

interface TaskTableProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

export function TaskTable({ tasks, onTaskClick }: TaskTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--card)]">
      <div className="min-w-[700px]">
        <div className="grid grid-cols-[minmax(220px,1.8fr)_130px_110px_130px_100px] items-center gap-4 border-b border-[var(--border)] bg-[var(--accent)]/40 px-4 py-3">
          <span className="text-[9px] font-semibold uppercase tracking-wider text-[var(--muted)]">
            Task
          </span>

          <span className="text-[9px] font-semibold uppercase tracking-wider text-[var(--muted)]">
            Status
          </span>

          <span className="text-[9px] font-semibold uppercase tracking-wider text-[var(--muted)]">
            Priority
          </span>

          <span className="text-[9px] font-semibold uppercase tracking-wider text-[var(--muted)]">
            Assignee
          </span>

          <span className="text-[9px] font-semibold uppercase tracking-wider text-[var(--muted)]">
            Due
          </span>
        </div>

        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onClick={() => onTaskClick?.(task)}
            />
          ))
        ) : (
          <div className="p-6">
            <EmptyState
              title="No tasks found"
              description="Try changing your search or filters."
            />
          </div>
        )}
      </div>
    </div>
  );
}
