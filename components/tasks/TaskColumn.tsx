"use client";

import { DragEvent } from "react";
import { Plus } from "lucide-react";
import type { Task, TaskStatus } from "@/types/task";
import { TaskCard } from "./TaskCard";

interface TaskColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onMoveTask: (taskId: string, status: TaskStatus) => void;
  onAddTask: () => void;
  onTaskClick: (task: Task) => void;
}

export function TaskColumn({
  title,
  status,
  tasks,
  onMoveTask,
  onAddTask,
  onTaskClick,
}: TaskColumnProps) {
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const taskId = event.dataTransfer.getData("taskId");

    if (taskId) {
      onMoveTask(taskId, status);
    }
  };

  return (
    <div
      className="flex w-[290px] min-w-[290px] flex-col rounded-2xl bg-[var(--accent)]/40 p-2"
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between px-2 py-2">
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-semibold">{title}</h2>

          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--card)] px-1.5 text-[9px] font-semibold text-[var(--muted)]">
            {tasks.length}
          </span>
        </div>

        <button
          type="button"
          onClick={onAddTask}
          className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--muted)] transition-colors hover:bg-[var(--card)] hover:text-[var(--foreground)]"
          aria-label={`Add task to ${title}`}
        >
          <Plus size={15} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={() => onTaskClick(task)}
          />
        ))}

        {tasks.length === 0 && (
          <div className="flex min-h-[130px] items-center justify-center rounded-xl border border-dashed border-[var(--border)]">
            <p className="text-[10px] text-[var(--muted)]">
              Drop tasks here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
