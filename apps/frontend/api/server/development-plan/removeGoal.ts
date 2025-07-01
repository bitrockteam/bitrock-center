"use server";

import { db } from "@/config/prisma";

export async function removeGoal(goalId: string) {
  return db.goal.delete({
    where: {
      id: goalId,
    },
  });
}
