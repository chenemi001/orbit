"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { LayoutGrid, List, Plus } from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { TaskBoard } from "@/components/tasks/TaskBoard";
import { TaskTable } from "@/components/tasks/TaskTable";
import { TaskFilters } from "@/components/tasks/TaskFilters";
import { TaskSearch } from "@/components/tasks/TaskSearch";
import { TaskModal, type TaskFormValues } from "@/components/tasks/TaskModal";
import { TaskDetails } from "@/components/tasks/TaskDetails";
import { useTaskStore } from "@/stores/task-store";
import type { Task, TaskStatus } from "@/types/task";

interface ProjectOption {
  id: string;
  name: string;
}

export default function TasksPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { view, setView, search, setSearch, status, setStatus, priority, setPriority } =
    useTaskStore();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [projectFilter, setProjectFilter] = useState<string>("mine");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [submitting, setSubmitting] = useState(false);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const query =
        projectFilter !== "mine" ? `?projectId=${projectFilter}` : "";
      const [tasksRes, projectsRes] = await Promise.all([
        fetch(`/api/tasks${query}`),
        fetch("/api/projects"),
      ]);

      if (!tasksRes.ok || !projectsRes.ok) {
        throw new Error("Failed to load tasks");
      }

      const tasksBody = await tasksRes.json();
      const projectsBody = await projectsRes.json();

      setTasks(tasksBody.data ?? []);
      setProjects(
        (projectsBody.data ?? []).map((project: ProjectOption) => ({
          id: project.id,
          name: project.name,
        })),
      );
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [projectFilter]);

  useEffect(() => {
    Promise.resolve().then(loadTasks);
  }, [loadTasks]);

  useEffect(() => {
    if (searchParams.get("new") !== "true") return;

    Promise.resolve().then(() => {
      setEditingTask(undefined);
      setModalOpen(true);
      router.replace("/tasks");
    });
  }, [searchParams, router]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (status !== "all" && task.status !== status) return false;
      if (priority !== "all" && task.priority !== priority) return false;
      if (
        search.trim() &&
        !task.title.toLowerCase().includes(search.trim().toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [tasks, status, priority, search]);

  async function handleCreateOrUpdate(values: TaskFormValues) {
    setSubmitting(true);

    try {
      const payload = {
        title: values.title,
        description: values.description || undefined,
        status: values.status,
        priority: values.priority,
        assigneeId: values.assigneeId || null,
        dueDate: values.dueDate
          ? new Date(values.dueDate).toISOString()
          : null,
      };

      const response = editingTask
        ? await fetch(`/api/tasks/${editingTask.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...payload, projectId: values.projectId }),
          });

      if (response.ok) {
        setModalOpen(false);
        setEditingTask(undefined);
        await loadTasks();
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStatusChange(taskId: string, nextStatus: TaskStatus) {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId ? { ...task, status: nextStatus } : task,
      ),
    );

    await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });

    loadTasks();
  }

  async function handleDelete(taskId: string) {
    if (!confirm("Delete this task? This cannot be undone.")) return;

    setSubmitting(true);

    try {
      await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
      setSelectedTask(undefined);
      await loadTasks();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleComplete(taskId: string) {
    setSubmitting(true);

    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });
      setSelectedTask(undefined);
      await loadTasks();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        title="Tasks"
        description="Everything assigned to you, organized your way."
        actions={
          <button
            type="button"
            onClick={() => {
              setEditingTask(undefined);
              setModalOpen(true);
            }}
            className="flex h-10 items-center gap-2 rounded-lg bg-[var(--foreground)] px-4 text-sm font-medium text-[var(--background)] transition-opacity hover:opacity-90"
          >
            <Plus size={16} />
            New task
          </button>
        }
      />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <TaskSearch value={search} onChange={setSearch} />

          <TaskFilters
            status={status}
            priority={priority}
            onStatusChange={setStatus}
            onPriorityChange={setPriority}
          />

          <select
            value={projectFilter}
            onChange={(event) => setProjectFilter(event.target.value)}
            className="h-9 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 text-xs font-medium outline-none"
          >
            <option value="mine">Assigned to me</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--card)] p-1">
          <button
            type="button"
            onClick={() => setView("board")}
            aria-label="Board view"
            className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
              view === "board"
                ? "bg-[var(--accent)] text-[var(--foreground)]"
                : "text-[var(--muted)]"
            }`}
          >
            <LayoutGrid size={15} />
          </button>

          <button
            type="button"
            onClick={() => setView("table")}
            aria-label="Table view"
            className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
              view === "table"
                ? "bg-[var(--accent)] text-[var(--foreground)]"
                : "text-[var(--muted)]"
            }`}
          >
            <List size={15} />
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingState message="Loading tasks..." />
      ) : error ? (
        <ErrorState onRetry={loadTasks} message="Unable to load your tasks." />
      ) : projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Create a project first, then add tasks to it."
        />
      ) : view === "board" ? (
        <TaskBoard
          tasks={filteredTasks}
          onStatusChange={handleStatusChange}
          onTaskClick={setSelectedTask}
          onAddTask={() => {
            setEditingTask(undefined);
            setModalOpen(true);
          }}
        />
      ) : (
        <TaskTable tasks={filteredTasks} onTaskClick={setSelectedTask} />
      )}

      {modalOpen && (
        <TaskModal
          key={editingTask?.id ?? "new"}
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditingTask(undefined);
          }}
          onSubmit={handleCreateOrUpdate}
          projects={projects}
          task={editingTask}
          defaultProjectId={
            projectFilter !== "mine" ? projectFilter : undefined
          }
          submitting={submitting}
        />
      )}

      <Modal
        open={Boolean(selectedTask)}
        onClose={() => setSelectedTask(undefined)}
        className="max-w-2xl"
      >
        {selectedTask && (
          <TaskDetails
            task={selectedTask}
            busy={submitting}
            onEdit={() => {
              setEditingTask(selectedTask);
              setSelectedTask(undefined);
              setModalOpen(true);
            }}
            onDelete={() => handleDelete(selectedTask.id)}
            onComplete={() => handleComplete(selectedTask.id)}
          />
        )}
      </Modal>
    </div>
  );
}
