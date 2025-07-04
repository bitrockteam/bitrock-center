"use server";
import { db } from "@/config/prisma";

export async function createNewDevelopmentPlan(userId: string) {
  const newPlan = await db.development_plan.create({
    data: {
      user_id: userId,
      created_date: new Date(),
    },
  });

  // Create a default goal for the new plan
  await db.goal.create({
    data: {
      development_plan_id: newPlan.id,
      title: "Default Goal",
      description: "This is a default goal for the new development plan.",
    },
  });

  return newPlan;
}
