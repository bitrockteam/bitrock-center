import { allocation } from "@bitrock/db";
import { db } from "../config/prisma";

export async function createAllocation(
  allocation: Omit<allocation, "id" | "created_at">,
) {
  return db.allocation.create({
    data: {
      user_id: allocation.user_id,
      project_id: allocation.project_id,
      start_date: allocation.start_date ?? null,
      end_date: allocation.end_date ?? null,
      percentage: allocation.percentage ?? 100,
    },
  });
}

export async function getAllocationsForProject(project_id: string) {
  return db.allocation.findMany({
    where: { project_id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar_url: true,
        },
      },
    },
  });
}

export async function updateAllocationForUser(
  project_id: string,
  user_id: string,
  allocation: Omit<allocation, "id" | "created_at" | "project_id" | "user_id">,
) {
  return db.allocation.update({
    where: {
      user_id_project_id: {
        user_id,
        project_id,
      },
    },
    data: {
      start_date: allocation.start_date ?? null,
      end_date: allocation.end_date ?? null,
      percentage: allocation.percentage ?? 100,
    },
  });
}

export async function deleteAllocationForUser(
  project_id: string,
  user_id: string,
) {
  return db.allocation.delete({
    where: {
      user_id_project_id: {
        user_id,
        project_id,
      },
    },
  });
}
