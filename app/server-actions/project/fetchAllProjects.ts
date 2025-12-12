"use server";

import { db } from "@/config/prisma";
import { getUserInfoFromCookie } from "@/utils/supabase/server";

export async function fetchAllProjects(params?: string | null) {
  const user = await getUserInfoFromCookie();

  if (user.role !== "Admin" && user.role !== "Super Admin") {
    return db.project.findMany({
      where: {
        work_items: {
          some: {
            allocation: {
              some: {
                user_id: user.id,
              },
            },
          },
        },
        ...(params
          ? {
              name: {
                contains: params || "",
                mode: "insensitive",
              },
            }
          : {}),
      },
      include: {
        client: true,
      },
    });
  }

  if (!params)
    return db.project.findMany({
      include: {
        client: true,
      },
    });

  console.info("Fetching projects with params:", params);
  return db.project.findMany({
    where: {
      name: {
        contains: params,
        mode: "insensitive",
      },
    },
    include: {
      client: true,
    },
  });
}

export type Project = Awaited<ReturnType<typeof fetchAllProjects>>[number];
