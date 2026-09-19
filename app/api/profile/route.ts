import { requireUser } from "@/lib/auth";
import { errorResponse, success } from "@/lib/api/response";
import { parseJsonBody } from "@/lib/api/validate";
import { updateProfileSchema } from "@/lib/validation/user";
import { getUserById, updateUser } from "@/lib/services/user.service";
import { notFound } from "@/lib/api/errors";

function toSafeUser(user: {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function GET() {
  try {
    const user = await requireUser();
    const record = await getUserById(user.id);

    if (!record) {
      throw notFound("User not found");
    }

    return success(toSafeUser(record));
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await requireUser();
    const data = await parseJsonBody(request, updateProfileSchema);

    const updated = await updateUser(user.id, data);

    if (!updated) {
      throw notFound("User not found");
    }

    return success(toSafeUser(updated));
  } catch (error) {
    return errorResponse(error);
  }
}
