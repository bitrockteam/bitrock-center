"use server";

import { db } from "@/config/prisma";
import { getUserInfoFromCookie } from "@/utils/supabase/server";

export async function deleteProjection(projectionId: string) {
  await getUserInfoFromCookie();

  // Soft delete by setting is_active to false
  await db.projection.update({
    where: {
      id: projectionId,
    },
    data: {
      is_active: false,
    },
  });

  return { success: true };
}
