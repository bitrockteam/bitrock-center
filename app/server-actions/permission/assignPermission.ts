"use server";

import { db } from "@/config/prisma";
import { Permissions } from "@/db";

export async function assignPermission(params: {
  userId: string;
  permissionId: Permissions;
}) {
  const { userId, permissionId } = params;

  if (!userId || !permissionId) {
    throw new Error("Missing userId or permissionId");
  }

  try {
    const result = await db.user_permission.upsert({
      where: {
        user_id_permission_id: {
          user_id: userId,
          permission_id: permissionId,
        },
      },
      create: {
        user_id: userId,
        permission_id: permissionId,
      },
      update: {},
      select: { user_id: true, permission_id: true },
    });

    return result;
  } catch (error) {
    console.error("assignPermission error", error);
    throw error;
  }
}

export type AssignPermissionResult = Awaited<
  ReturnType<typeof assignPermission>
>;
