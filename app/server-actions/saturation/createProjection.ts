"use server";

import { db } from "@/config/prisma";
import { getUserInfoFromCookie } from "@/utils/supabase/server";

export async function createProjection(name: string, description?: string) {
  const userInfo = await getUserInfoFromCookie();

  const projection = await db.projection.create({
    data: {
      name,
      description: description ?? null,
      created_by: userInfo.id,
    },
  });

  return projection;
}

