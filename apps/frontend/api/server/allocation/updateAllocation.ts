"use server";

import { db } from "@/config/prisma";
import { allocation } from "@bitrock/db";

export async function fetchUpdateAllocation({
  allocation,
}: {
  allocation: Omit<allocation, "created_at">;
}) {
  console.log({ allocation });

  return db.allocation.update({
    where: {
      user_id_project_id: {
        user_id: allocation.user_id,
        project_id: allocation.project_id,
      },
    },
    data: {
      user_id: allocation.user_id,
      project_id: allocation.project_id,
      start_date: allocation.start_date,
      end_date: allocation.end_date,
      percentage: allocation.percentage,
    },
  });
}

export type UserAllocated = Awaited<ReturnType<typeof fetchUpdateAllocation>>;
