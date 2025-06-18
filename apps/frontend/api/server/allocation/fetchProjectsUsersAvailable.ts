"use server";

import { db } from "@/config/prisma";

export async function fetchProjectsUsersAvailable({
  project_id,
}: {
  project_id: string;
}) {
  const allocationProjects = await db.allocation.findMany({
    where: { project_id },
    select: { user_id: true },
  });
  return db.user.findMany({
    where: {
      id: {
        notIn: allocationProjects.map((allocation) => allocation.user_id),
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar_url: true,
      created_at: true,
      referent_id: true,
    },
  });
}

export type Project = Awaited<
  ReturnType<typeof fetchProjectsUsersAvailable>
>[number];
