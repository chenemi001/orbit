"use client";

import type { Task, TaskStatus } from "@/types/task";
import { TaskColumn } from "./TaskColumn";
import { EmptyState } from "@/components/ui/EmptyState";

interface TaskBoardProps {
  tasks: Task[];
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onTaskClick: (task: Task) => void;
  onAddTask: () => void;
}

const columns: { id: TaskStatus; title: string }[] = [
  { id: "todo", title: "To do" },
  { id: "in_progress", title: "In progress" },
  { id: "in_review", title: "In review" },
  { id: "completed", title: "Completed" },
];

export function TaskBoard({
  tasks,
  onStatusChange,
  onTaskClick,
  onAddTask,
}: TaskBoardProps) {
  if (tasks.length === 0) {
    return (
      <EmptyState
        title="No tasks found"
        description="Create your first task or adjust your filters."
      />
    );
  }

  return (
    <div className="flex min-h-[600px] gap-4 overflow-x-auto pb-4">
      {columns.map((column) => {
        const columnTasks = tasks.filter(
          (task) => task.status === column.id,
        );

        return (
          <TaskColumn
            key={column.id}
            title={column.title}
            status={column.id}
            tasks={columnTasks}
            onMoveTask={onStatusChange}
            onAddTask={onAddTask}
            onTaskClick={onTaskClick}
          />
        );
      })}
    </div>
  );
}
