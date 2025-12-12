"use server";

import { db } from "@/config/prisma";
import { getUserInfoFromCookie } from "@/utils/supabase/server";

export async function findUserById(userId: string) {
  await getUserInfoFromCookie();
  return db.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      allocation: {
        select: {
          work_items: {
            include: {
              project: {
                select: {
                  id: true,
                  name: true,
                  status: true,
                },
              },
            },
          },
          start_date: true,
          end_date: true,
        },
      },
      user_permission: {
        select: {
          permission_id: true,
        },
      },
      user_skill: {
        select: {
          skill: {
            select: {
              id: true,
              name: true,
              description: true,
              icon: true,
              category: true,
            },
          },
          seniorityLevel: true,
        },
      },
      contract_contract_employee_idTouser: {
        take: 1,
        orderBy: {
          start_date: "desc",
        },
      },
    },
  });
}

export type FindUserById = Awaited<ReturnType<typeof findUserById>>;
