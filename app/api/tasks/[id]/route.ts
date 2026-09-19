import { requireUser } from "@/lib/auth";
import { errorResponse, noContent, success } from "@/lib/api/response";
import { parseJsonBody } from "@/lib/api/validate";
import { badRequest, notFound } from "@/lib/api/errors";
import { db } from "@/lib/db";
import { updateTaskSchema } from "@/lib/validation/task";
import { requireProjectPermission } from "@/lib/permissions/guards";
import {
  deleteTask,
  getTaskById,
  updateTask,
} from "@/lib/services/task.service";
import { createActivity } from "@/lib/services/activity.service";
import { createNotification } from "@/lib/services/notification.service";
import { recalculateProjectProgress } from "@/lib/services/project.service";
import { getUserProjectRole } from "@/lib/services/project-member.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

async function loadTaskOrThrow(id: string) {
  const task = await getTaskById(id);

  if (!task) {
    throw notFound("Task not found");
  }

  return task;
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await requireUser();
    const task = await loadTaskOrThrow(id);

    await requireProjectPermission(task.projectId, user.id, "task:read");

    const detailed = await db.query.tasks.findFirst({
      where: (t, { eq }) => eq(t.id, task.id),
      with: {
        project: { columns: { id: true, name: true } },
        assignee: {
          columns: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    return success(detailed);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await requireUser();
    const existing = await loadTaskOrThrow(id);

    await requireProjectPermission(
      existing.projectId,
      user.id,
      "task:update",
    );

    const data = await parseJsonBody(request, updateTaskSchema);

    if (data.assigneeId) {
      const assigneeRole = await getUserProjectRole(
        existing.projectId,
        data.assigneeId,
      );

      if (!assigneeRole) {
        throw badRequest("Assignee must be a member of this project");
      }
    }

    const updated = await updateTask(id, {
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      assigneeId:
        data.assigneeId === null ? null : data.assigneeId,
      dueDate:
        data.dueDate === null
          ? null
          : data.dueDate
            ? new Date(data.dueDate)
            : undefined,
    });

    if (!updated) {
      throw notFound("Task not found");
    }

    if (data.status && data.status !== existing.status) {
      await createActivity({
        userId: user.id,
        projectId: existing.projectId,
        taskId: updated.id,
        action:
          data.status === "completed" ? "task_completed" : "task_status_changed",
        description:
          data.status === "completed"
            ? `${user.name} completed "${updated.title}"`
            : `${user.name} moved "${updated.title}" to ${data.status.replace("_", " ")}`,
      });

      if (
        data.status === "completed" &&
        updated.assigneeId &&
        updated.assigneeId !== user.id
      ) {
        await createNotification({
          userId: updated.assigneeId,
          type: "task_completed",
          title: "Task completed",
          message: `${user.name} marked "${updated.title}" as completed`,
        });
      }

      await recalculateProjectProgress(existing.projectId);
    }

    if (
      data.priority &&
      data.priority !== existing.priority
    ) {
      await createActivity({
        userId: user.id,
        projectId: existing.projectId,
        taskId: updated.id,
        action: "task_priority_changed",
        description: `${user.name} set "${updated.title}" priority to ${data.priority}`,
      });
    }

    if (
      data.assigneeId !== undefined &&
      data.assigneeId !== existing.assigneeId
    ) {
      await createActivity({
        userId: user.id,
        projectId: existing.projectId,
        taskId: updated.id,
        action: "task_assigned",
        description: data.assigneeId
          ? `${user.name} reassigned "${updated.title}"`
          : `${user.name} unassigned "${updated.title}"`,
      });

      if (data.assigneeId && data.assigneeId !== user.id) {
        await createNotification({
          userId: data.assigneeId,
          type: "task_assigned",
          title: "New task assigned",
          message: `${user.name} assigned you "${updated.title}"`,
        });
      }
    }

    return success(updated);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await requireUser();
    const existing = await loadTaskOrThrow(id);

    await requireProjectPermission(
      existing.projectId,
      user.id,
      "task:delete",
    );

    await deleteTask(id);

    await createActivity({
      userId: user.id,
      projectId: existing.projectId,
      taskId: null,
      action: "task_deleted",
      description: `${user.name} deleted "${existing.title}"`,
    });

    await recalculateProjectProgress(existing.projectId);

    return noContent();
  } catch (error) {
    return errorResponse(error);
  }
}
