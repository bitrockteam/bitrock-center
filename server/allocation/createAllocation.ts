"use server";

import { db } from "@/config/prisma";
import { allocation } from "@/db";

export async function createAllocation({
  allocation,
}: {
  allocation: Omit<allocation, "created_at" | "id">;
}) {
  return db.allocation.create({
    data: {
      user_id: allocation.user_id,
      project_id: allocation.project_id,
      start_date: allocation.start_date,
      end_date: allocation.end_date,
      percentage: allocation.percentage,
    },
  });
}
