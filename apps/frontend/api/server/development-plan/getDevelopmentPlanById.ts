"use server";
import { db } from "@/config/prisma";

export async function getDevelopmentPlanById(planId: string) {
  const plan = await db.development_plan.findUnique({
    where: {
      id: planId,
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
  });

  const latestPlan = await db.development_plan.findFirst({
    orderBy: {
      created_date: "desc",
    },
  });

  const isLatestPlan = plan?.id === latestPlan?.id;
  return { plan, isLatestPlan };
}

export type GetDevelopmentPlan = NonNullable<
  Awaited<ReturnType<typeof getDevelopmentPlanById>>["plan"]
>;
