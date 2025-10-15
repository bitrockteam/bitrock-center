"use server";

import { db } from "@/config/prisma";
import { Permissions } from "@/db";

export async function removePermission(params: {
  user_id: string;
  permission_id: Permissions;
}) {
  const { user_id, permission_id } = params;

  if (!user_id || !permission_id) {
    throw new Error("Missing user_id or permission_id");
  }

  try {
    const result = await db.user_permission.delete({
      where: {
        user_id_permission_id: {
          user_id: user_id,
          permission_id: permission_id,
        },
      },
      select: { user_id: true, permission_id: true },
    });

    return result;
  } catch (error) {
    console.error("removePermission error", error);
    throw error;
  }
}

export type RemovePermissionResult = Awaited<
  ReturnType<typeof removePermission>
>;
