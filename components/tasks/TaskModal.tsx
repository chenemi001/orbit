"use client";

import { FormEvent, useEffect, useState } from "react";
import { X } from "lucide-react";
import type { Task, TaskPriority, TaskStatus } from "@/types/task";

export interface TaskFormValues {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string;
  assigneeId: string;
  dueDate: string;
}

interface ProjectOption {
  id: string;
  name: string;
}

interface MemberOption {
  userId: string;
  user: { id: string; name: string };
}

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: TaskFormValues) => Promise<void> | void;
  projects: ProjectOption[];
  defaultProjectId?: string;
  task?: Task;
  submitting?: boolean;
}

function toDateInputValue(value: Date | string | null | undefined) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

export function TaskModal({
  open,
  onClose,
  onSubmit,
  projects,
  defaultProjectId,
  task,
  submitting = false,
}: TaskModalProps) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? "todo");
  const [priority, setPriority] = useState<TaskPriority>(
    task?.priority ?? "medium",
  );
  const [projectId, setProjectId] = useState(
    task?.projectId ?? defaultProjectId ?? projects[0]?.id ?? "",
  );
  const [assigneeId, setAssigneeId] = useState(task?.assigneeId ?? "");
  const [dueDate, setDueDate] = useState(toDateInputValue(task?.dueDate));
  const [members, setMembers] = useState<MemberOption[]>([]);

  // The parent conditionally mounts this component with a `key` derived
  // from the task being edited, so a fresh mount (and fresh useState
  // initializers above) is all that's needed to reset the form — no
  // sync-on-open effect required.

  useEffect(() => {
    if (!projectId) return;

    let cancelled = false;

    fetch(`/api/projects/${projectId}/members`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!cancelled && data?.data) {
          setMembers(data.data as MemberOption[]);
        }
      })
      .catch(() => {
        if (!cancelled) setMembers([]);
      });

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  if (!open) return null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim() || !projectId) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      projectId,
      assigneeId,
      dueDate,
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold">
              {task ? "Edit task" : "Create new task"}
            </h2>

            <p className="mt-1 text-xs text-[var(--muted)]">
              {task
                ? "Update this task's details."
                : "Add a task to your workspace."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--accent)] hover:text-[var(--foreground)]"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <div>
            <label
              htmlFor="task-title"
              className="mb-1.5 block text-xs font-medium"
            >
              Task title
            </label>

            <input
              id="task-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Build authentication flow"
              autoFocus
              required
              className="h-10 w-full rounded-lg border border-[var(--border)] bg-transparent px-3 text-sm outline-none placeholder:text-[var(--muted)] focus:border-[var(--foreground)]/20 focus:ring-2 focus:ring-[var(--foreground)]/5"
            />
          </div>

          <div>
            <label
              htmlFor="task-description"
              className="mb-1.5 block text-xs font-medium"
            >
              Description
            </label>

            <textarea
              id="task-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              placeholder="Describe what needs to be done..."
              className="w-full resize-none rounded-lg border border-[var(--border)] bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-[var(--muted)] focus:border-[var(--foreground)]/20 focus:ring-2 focus:ring-[var(--foreground)]/5"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="task-status"
                className="mb-1.5 block text-xs font-medium"
              >
                Status
              </label>

              <select
                id="task-status"
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as TaskStatus)
                }
                className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 text-xs outline-none"
              >
                <option value="todo">To do</option>
                <option value="in_progress">In progress</option>
                <option value="in_review">In review</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="task-priority"
                className="mb-1.5 block text-xs font-medium"
              >
                Priority
              </label>

              <select
                id="task-priority"
                value={priority}
                onChange={(event) =>
                  setPriority(event.target.value as TaskPriority)
                }
                className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 text-xs outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="task-project"
                className="mb-1.5 block text-xs font-medium"
              >
                Project
              </label>

              <select
                id="task-project"
                value={projectId}
                onChange={(event) => {
                  setProjectId(event.target.value);
                  setAssigneeId("");
                }}
                required
                disabled={Boolean(task)}
                className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 text-xs outline-none disabled:opacity-60"
              >
                {projects.length === 0 && (
                  <option value="">No projects yet</option>
                )}
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="task-due"
                className="mb-1.5 block text-xs font-medium"
              >
                Due date
              </label>

              <input
                id="task-due"
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                className="h-10 w-full rounded-lg border border-[var(--border)] bg-transparent px-3 text-xs outline-none focus:border-[var(--foreground)]/20"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="task-assignee"
              className="mb-1.5 block text-xs font-medium"
            >
              Assignee
            </label>

            <select
              id="task-assignee"
              value={assigneeId}
              onChange={(event) => setAssigneeId(event.target.value)}
              disabled={!projectId}
              className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 text-xs outline-none disabled:opacity-60"
            >
              <option value="">Unassigned</option>
              {members.map((member) => (
                <option key={member.userId} value={member.userId}>
                  {member.user.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 border-t border-[var(--border)] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="h-9 rounded-lg border border-[var(--border)] px-4 text-xs font-medium transition-colors hover:bg-[var(--accent)]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!title.trim() || !projectId || submitting}
              className="h-9 rounded-lg bg-[var(--foreground)] px-4 text-xs font-medium text-[var(--background)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submitting
                ? "Saving..."
                : task
                  ? "Save changes"
                  : "Create task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
