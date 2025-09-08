"use server";

import { db } from "@/config/prisma";
import { Permissions } from "@/db";

export async function removePermission(params: {
  userId: string;
  permissionId: Permissions;
}) {
  const { userId, permissionId } = params;

  if (!userId || !permissionId) {
    throw new Error("Missing userId or permissionId");
  }

  try {
    const result = await db.user_permission.delete({
      where: {
        user_id_permission_id: {
          user_id: userId,
          permission_id: permissionId,
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
