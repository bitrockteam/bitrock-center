"use server";

import { db } from "@/config/prisma";

export async function fetchProjectById({ projectId }: { projectId: string }) {
  return db.project.findUnique({
    where: { id: projectId },
    include: {
      client: true,
      work_items: {
        include: {
          allocation: true,
        },
      },
    },
  });
}

export type ProjectById = Awaited<ReturnType<typeof fetchProjectById>>;
