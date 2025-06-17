"use server";

import { db } from "@/config/prisma";
import { getUserInfoFromCookie } from "@/utils/supabase/server";

export async function fetchAllProjects({ params }: { params: string | null }) {
  const user = getUserInfoFromCookie();

  if ((await user).role !== "Admin" && (await user).role !== "Super_Admin") {
    return db.project.findMany({
      where: {
        allocation: {
          some: {
            user_id: (await user).id,
          },
        },
      },
      ...(params ? { where: { name: { contains: params } } } : {}),
    });
  }

  return db.project.findMany({
    ...(params ? { where: { name: { contains: params } } } : {}),
  });
}

export type Project = Awaited<ReturnType<typeof fetchAllProjects>>[number];
