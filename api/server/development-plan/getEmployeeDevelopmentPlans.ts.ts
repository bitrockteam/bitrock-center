"use server";
import { db } from "@/config/prisma";

export async function getEmployeeDevelopmentPlans(userId: string) {
  return db.development_plan.findMany({
    where: {
      user_id: userId,
    },
    include: {
      //   include goals
      goal: {
        include: {
          //   include todos
          todo_item: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
    },
    orderBy: {
      created_date: "desc",
    },
  });
}

export type GetEmployeeDevelopmentPlan = NonNullable<
  Awaited<ReturnType<typeof getEmployeeDevelopmentPlans>>[number]
>;
