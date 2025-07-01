"use server";
import { db } from "@/config/prisma";
import { goal } from "@bitrock/db";

export async function updateGoal(goal: goal) {
  return db.goal.update({
    where: {
      id: goal.id,
    },
    data: {
      title: goal.title,
      description: goal.description,
    },
  });
}
