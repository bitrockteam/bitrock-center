"use server";

import { db } from "@/config/prisma";

export async function fetchProjectById({ projectId }: { projectId: string }) {
  return db.project.findUnique({
    where: { id: projectId },
  });
}

export type ProjectById = Awaited<ReturnType<typeof fetchProjectById>>;
