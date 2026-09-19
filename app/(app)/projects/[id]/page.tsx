"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { ProjectOverview } from "@/components/projects/ProjectOverview";
import { ProjectMembers } from "@/components/projects/ProjectMembers";
import { ProjectActivity } from "@/components/projects/ProjectActivity";
import { TaskBoard } from "@/components/tasks/TaskBoard";
import { TaskModal, type TaskFormValues } from "@/components/tasks/TaskModal";
import { TaskDetails } from "@/components/tasks/TaskDetails";
import type { ProjectStatus } from "@/types/project";
import type { Task, TaskStatus } from "@/types/task";
import { formatStatus } from "@/utils/formatters";

interface ProjectDetail {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  progress: number;
  ownerId: string;
  createdAt: string;
  members: {
    userId: string;
    role: "owner" | "admin" | "member" | "viewer";
    user: { id: string; name: string; email: string; avatarUrl: string | null };
  }[];
  stats: { total: number; completed: number };
}

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "tasks", label: "Tasks" },
  { id: "members", label: "Members" },
  { id: "activity", label: "Activity" },
  { id: "settings", label: "Settings" },
];

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = params.id;

  const activeTab = searchParams.get("tab") ?? "overview";

  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activity, setActivity] = useState<
    import("@/components/projects/ProjectActivity").ProjectActivityEntry[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [submitting, setSubmitting] = useState(false);

  const loadProject = useCallback(async () => {
    setLoading(true);
    setError(false);
    setNotFound(false);

    try {
      const [projectRes, sessionRes] = await Promise.all([
        fetch(`/api/projects/${projectId}`),
        fetch("/api/auth/session"),
      ]);

      if (projectRes.status === 404) {
        setNotFound(true);
        return;
      }

      if (!projectRes.ok) throw new Error("Failed to load project");

      const projectBody = await projectRes.json();
      const sessionBody = await sessionRes.json();

      setProject(projectBody.data);
      setCurrentUserId(sessionBody.user?.id ?? null);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const loadTasks = useCallback(async () => {
    const response = await fetch(`/api/tasks?projectId=${projectId}`);
    if (response.ok) {
      const body = await response.json();
      setTasks(body.data ?? []);
    }
  }, [projectId]);

  const loadActivity = useCallback(async () => {
    const response = await fetch(`/api/projects/${projectId}/activity`);
    if (response.ok) {
      const body = await response.json();
      setActivity(body.data ?? []);
    }
  }, [projectId]);

  useEffect(() => {
    Promise.resolve().then(loadProject);
  }, [loadProject]);

  useEffect(() => {
    if (activeTab === "tasks") Promise.resolve().then(loadTasks);
    if (activeTab === "activity" || activeTab === "overview")
      Promise.resolve().then(loadActivity);
  }, [activeTab, loadTasks, loadActivity]);

  useEffect(() => {
    const taskId = searchParams.get("taskId");
    if (!taskId || tasks.length === 0) return;

    const found = tasks.find((task) => task.id === taskId);
    if (!found) return;

    Promise.resolve().then(() => setSelectedTask(found));
  }, [searchParams, tasks]);

  const myRole = useMemo(
    () => project?.members.find((member) => member.userId === currentUserId)?.role,
    [project, currentUserId],
  );

  const canManage = myRole === "owner" || myRole === "admin";
  const canDelete = myRole === "owner";

  function setTab(tab: string) {
    router.push(`/projects/${projectId}?tab=${tab}`);
  }

  async function handleCreateOrUpdateTask(values: TaskFormValues) {
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
            body: JSON.stringify({ ...payload, projectId }),
          });

      if (response.ok) {
        setTaskModalOpen(false);
        setEditingTask(undefined);
        await Promise.all([loadTasks(), loadProject()]);
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStatusChange(taskId: string, status: TaskStatus) {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId ? { ...task, status } : task,
      ),
    );

    await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    await Promise.all([loadTasks(), loadProject()]);
  }

  async function handleDeleteTask(taskId: string) {
    if (!confirm("Delete this task? This cannot be undone.")) return;

    setSubmitting(true);

    try {
      await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
      setSelectedTask(undefined);
      await Promise.all([loadTasks(), loadProject()]);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCompleteTask(taskId: string) {
    setSubmitting(true);

    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });
      setSelectedTask(undefined);
      await Promise.all([loadTasks(), loadProject()]);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteProject() {
    if (
      !confirm(
        "Delete this project and all of its tasks? This cannot be undone.",
      )
    )
      return;

    const response = await fetch(`/api/projects/${projectId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      router.push("/projects");
    }
  }

  if (loading) {
    return <LoadingState message="Loading project..." fullScreen={false} />;
  }

  if (notFound) {
    return (
      <ErrorState
        title="Project not found"
        message="This project doesn't exist, or you don't have access to it."
      />
    );
  }

  if (error || !project) {
    return (
      <ErrorState onRetry={loadProject} message="Unable to load this project." />
    );
  }

  return (
    <div className="mx-auto max-w-[1200px]">
      <Link
        href="/projects"
        className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-[var(--muted)] hover:text-[var(--foreground)]"
      >
        <ArrowLeft size={14} />
        All projects
      </Link>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {project.name}
          </h1>

          {project.description && (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
              {project.description}
            </p>
          )}
        </div>

        {canManage && (
          <Button
            onClick={() => {
              setEditingTask(undefined);
              setTaskModalOpen(true);
            }}
          >
            <Plus size={16} />
            New task
          </Button>
        )}
      </div>

      <div className="mb-6 flex gap-1 overflow-x-auto border-b border-[var(--border)]">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setTab(tab.id)}
            className={`whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "border-[var(--foreground)] text-[var(--foreground)]"
                : "border-transparent text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
          <ProjectOverview
            status={project.status}
            progress={project.progress}
            totalTasks={project.stats.total}
            completedTasks={project.stats.completed}
            memberCount={project.members.length}
            createdAt={project.createdAt}
          />
          <ProjectActivity activities={activity.slice(0, 6)} />
        </div>
      )}

      {activeTab === "tasks" && (
        <TaskBoard
          tasks={tasks}
          onStatusChange={handleStatusChange}
          onTaskClick={setSelectedTask}
          onAddTask={() => {
            setEditingTask(undefined);
            setTaskModalOpen(true);
          }}
        />
      )}

      {activeTab === "members" && (
        <ProjectMembers
          projectId={projectId}
          ownerId={project.ownerId}
          members={project.members}
          canManage={canManage}
          onChanged={loadProject}
        />
      )}

      {activeTab === "activity" && <ProjectActivity activities={activity} />}

      {activeTab === "settings" && (
        <ProjectSettingsPanel
          project={project}
          canManage={canManage}
          canDelete={canDelete}
          onSaved={loadProject}
          onDelete={handleDeleteProject}
        />
      )}

      {taskModalOpen && (
        <TaskModal
          key={editingTask?.id ?? "new"}
          open={taskModalOpen}
          onClose={() => {
            setTaskModalOpen(false);
            setEditingTask(undefined);
          }}
          onSubmit={handleCreateOrUpdateTask}
          projects={[{ id: project.id, name: project.name }]}
          defaultProjectId={project.id}
          task={editingTask}
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
              setTaskModalOpen(true);
            }}
            onDelete={() => handleDeleteTask(selectedTask.id)}
            onComplete={() => handleCompleteTask(selectedTask.id)}
          />
        )}
      </Modal>
    </div>
  );
}

function ProjectSettingsPanel({
  project,
  canManage,
  canDelete,
  onSaved,
  onDelete,
}: {
  project: ProjectDetail;
  canManage: boolean;
  canDelete: boolean;
  onSaved: () => void;
  onDelete: () => void;
}) {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description ?? "");
  const [status, setStatus] = useState<ProjectStatus>(project.status);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    setSaved(false);

    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, status }),
      });

      if (response.ok) {
        setSaved(true);
        onSaved();
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <h2 className="text-sm font-semibold">Project details</h2>

        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium">Name</label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={!canManage}
              className="h-10 w-full rounded-lg border border-[var(--border)] bg-transparent px-3 text-sm outline-none disabled:opacity-60"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium">
              Description
            </label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              disabled={!canManage}
              rows={3}
              className="w-full resize-none rounded-lg border border-[var(--border)] bg-transparent px-3 py-2.5 text-sm outline-none disabled:opacity-60"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium">Status</label>
            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as ProjectStatus)
              }
              disabled={!canManage}
              className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 text-sm outline-none disabled:opacity-60"
            >
              {(
                [
                  "planning",
                  "active",
                  "on_hold",
                  "completed",
                  "archived",
                ] as ProjectStatus[]
              ).map((option) => (
                <option key={option} value={option}>
                  {formatStatus(option)}
                </option>
              ))}
            </select>
          </div>

          {canManage && (
            <div className="flex items-center gap-3">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save changes"}
              </Button>
              {saved && (
                <span className="text-xs text-[var(--success)]">Saved</span>
              )}
            </div>
          )}
        </div>
      </section>

      {canDelete && (
        <section className="rounded-2xl border border-[var(--danger)]/30 bg-[var(--card)] p-5">
          <h2 className="text-sm font-semibold text-[var(--danger)]">
            Danger zone
          </h2>

          <p className="mt-1 text-xs text-[var(--muted)]">
            Deleting a project permanently removes it and all of its tasks.
          </p>

          <button
            type="button"
            onClick={onDelete}
            className="mt-4 flex h-9 items-center gap-2 rounded-lg border border-[var(--danger)]/30 px-3 text-xs font-medium text-[var(--danger)] transition-colors hover:bg-[var(--danger)]/10"
          >
            <Trash2 size={14} />
            Delete project
          </button>
        </section>
      )}
    </div>
  );
}
