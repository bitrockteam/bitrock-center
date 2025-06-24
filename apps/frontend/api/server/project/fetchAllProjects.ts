"use server";

import { db } from "@/config/prisma";
import { getUserInfoFromCookie } from "@/utils/supabase/server";

export async function fetchAllProjects(params?: string | null) {
  const user = await getUserInfoFromCookie();

  if (user.role !== "Admin" && user.role !== "Super_Admin") {
    return db.project.findMany({
      where: {
        allocation: {
          some: {
            user_id: user.id,
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
    });
  }

  if (!params) return db.project.findMany();

  console.info("Fetching projects with params:", params);
  return db.project.findMany({
    where: {
      name: {
        contains: params,
        mode: "insensitive",
      },
    },
  });
}

export type Project = Awaited<ReturnType<typeof fetchAllProjects>>[number];
