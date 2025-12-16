"use server";

import { db } from "@/config/prisma";
import { getUserInfoFromCookie } from "@/utils/supabase/server";

export async function updateAllocation({
  user_id,
  work_item_id,
  start_date,
  end_date,
  percentage,
}: {
  user_id: string;
  work_item_id: string;
  start_date: Date;
  end_date: Date | null;
  percentage: number;
}) {
  await getUserInfoFromCookie();

  // Validate percentage range
  if (percentage < 0 || percentage > 100) {
    throw new Error("Percentage must be between 0 and 100");
  }

  // Validate date range
  if (end_date && start_date > end_date) {
    throw new Error("Start date must be before or equal to end date");
  }

  return db.allocation.update({
    where: {
      user_id_work_item_id: {
        user_id,
        work_item_id,
      },
    },
    data: {
      start_date,
      end_date,
      percentage: Math.round(percentage),
    },
  });
}
