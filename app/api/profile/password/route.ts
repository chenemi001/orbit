import { requireUser } from "@/lib/auth";
import { errorResponse, success } from "@/lib/api/response";
import { parseJsonBody } from "@/lib/api/validate";
import { changePasswordSchema } from "@/lib/validation/user";
import { badRequest, notFound } from "@/lib/api/errors";
import { getUserById, updateUser } from "@/lib/services/user.service";
import {
  createPasswordHash,
  verifyPassword,
} from "@/lib/services/auth.service";

export async function PATCH(request: Request) {
  try {
    const user = await requireUser();
    const data = await parseJsonBody(request, changePasswordSchema);

    const record = await getUserById(user.id);

    if (!record) {
      throw notFound("User not found");
    }

    const validCurrentPassword = await verifyPassword(
      data.currentPassword,
      record.passwordHash,
    );

    if (!validCurrentPassword) {
      throw badRequest("Your current password is incorrect");
    }

    const passwordHash = await createPasswordHash(data.newPassword);

    await updateUser(user.id, { passwordHash });

    return success({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
