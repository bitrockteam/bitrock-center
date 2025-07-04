"use server";
import { db } from "@/config/prisma";

export async function getLatestEmployeeDevelopmentPlan(userId: string) {
  return db.development_plan.findFirst({
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

export type GetLatestEmployeeDevelopmentPlan = Awaited<
  ReturnType<typeof getLatestEmployeeDevelopmentPlan>
>;
