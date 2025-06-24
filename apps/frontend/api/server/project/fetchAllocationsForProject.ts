"use server";

import { db } from "@/config/prisma";

export async function fetchAllocationsForProject({
  projectId,
}: {
  projectId: string;
}) {
  return db.allocation.findMany({
    where: { project_id: projectId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
}

export type UserAllocated = Awaited<
  ReturnType<typeof fetchAllocationsForProject>
>[number];
