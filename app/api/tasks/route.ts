import { and, eq, ilike } from "drizzle-orm";

import { requireUser } from "@/lib/auth";
import { created, errorResponse, success } from "@/lib/api/response";
import { parseJsonBody } from "@/lib/api/validate";
import { badRequest } from "@/lib/api/errors";
import { db } from "@/lib/db";
import { tasks } from "@/lib/db/schema";
import { createTaskSchema } from "@/lib/validation/task";
import { requireProjectPermission } from "@/lib/permissions/guards";
import { createTask } from "@/lib/services/task.service";
import { createActivity } from "@/lib/services/activity.service";
import { createNotification } from "@/lib/services/notification.service";
import { recalculateProjectProgress } from "@/lib/services/project.service";
import { getUserProjectRole } from "@/lib/services/project-member.service";

export async function GET(request: Request) {
  try {
    const user = await requireUser();
    const { searchParams } = new URL(request.url);

    const projectId = searchParams.get("projectId") ?? undefined;
    const status = searchParams.get("status") ?? undefined;
    const priority = searchParams.get("priority") ?? undefined;
    const search = searchParams.get("search") ?? undefined;

    const filters = [];

    if (projectId) {
      await requireProjectPermission(projectId, user.id, "task:read");
      filters.push(eq(tasks.projectId, projectId));
    } else {
      // No project specified: scope to tasks assigned to the current user.
      filters.push(eq(tasks.assigneeId, user.id));
    }

    if (status) {
      filters.push(
        eq(
          tasks.status,
          status as (typeof tasks.status.enumValues)[number],
        ),
      );
    }

    if (priority) {
      filters.push(
        eq(
          tasks.priority,
          priority as (typeof tasks.priority.enumValues)[number],
        ),
      );
    }

    if (search) {
      filters.push(ilike(tasks.title, `%${search}%`));
    }

    const results = await db.query.tasks.findMany({
      where: filters.length > 0 ? and(...filters) : undefined,
      orderBy: (task, { desc }) => [desc(task.createdAt)],
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

    return success(results);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const data = await parseJsonBody(request, createTaskSchema);

    await requireProjectPermission(data.projectId, user.id, "task:create");

    if (data.assigneeId) {
      const assigneeRole = await getUserProjectRole(
        data.projectId,
        data.assigneeId,
      );

      if (!assigneeRole) {
        throw badRequest(
          "Assignee must be a member of this project",
        );
      }
    }

    const task = await createTask({
      projectId: data.projectId,
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      assigneeId: data.assigneeId,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    });

    await createActivity({
      userId: user.id,
      projectId: data.projectId,
      taskId: task.id,
      action: "task_created",
      description: `${user.name} created "${task.title}"`,
    });

    if (data.assigneeId && data.assigneeId !== user.id) {
      await createNotification({
        userId: data.assigneeId,
        type: "task_assigned",
        title: "New task assigned",
        message: `${user.name} assigned you "${task.title}"`,
      });

      await createActivity({
        userId: user.id,
        projectId: data.projectId,
        taskId: task.id,
        action: "task_assigned",
        description: `${user.name} assigned "${task.title}"`,
      });
    }

    await recalculateProjectProgress(data.projectId);

    return created(task);
  } catch (error) {
    return errorResponse(error);
  }
}
