"use server";
import { db } from "@/config/prisma";
import { goal } from "@bitrock/db";

export async function addGoal(
  planId: string,
  newGoal: Omit<goal, "id" | "todo_item">,
) {
  const createdGoal = await db.goal.create({
    data: {
      development_plan_id: planId,
      title: newGoal.title,
      description: newGoal.description,
    },
  });

  return createdGoal;
}
