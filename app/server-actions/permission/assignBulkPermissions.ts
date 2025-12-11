"use server";

import { db } from "@/config/prisma";
import type { Permissions } from "@/db";

export async function assignBulkPermissions(params: {
  user_id: string;
  permission_ids: Permissions[];
}) {
  const { user_id, permission_ids } = params;

  if (!user_id || !permission_ids || permission_ids.length === 0) {
    throw new Error("Missing user_id or permission_ids");
  }

  try {
    const results = await Promise.all(
      permission_ids.map((permission_id) =>
        db.user_permission.upsert({
          where: {
            user_id_permission_id: {
              user_id: user_id,
              permission_id: permission_id,
            },
          },
          create: {
            user_id: user_id,
            permission_id: permission_id,
          },
          update: {},
          select: { user_id: true, permission_id: true },
        })
      )
    );

    return results;
  } catch (error) {
    console.error("assignBulkPermissions error", error);
    throw error;
  }
}

export type AssignBulkPermissionsResult = Awaited<
  ReturnType<typeof assignBulkPermissions>
>;
