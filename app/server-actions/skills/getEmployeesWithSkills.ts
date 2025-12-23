"use server";

import { db } from "@/config/prisma";

export async function getEmployeesWithSkills() {
  return db.user.findMany({
    include: {
      user_skill: {
        include: {
          skill: {
            select: {
              id: true,
              name: true,
              category: true,
              description: true,
              icon: true,
              color: true,
              active: true,
              created_at: true,
              updated_at: true,
            },
          },
        },
      },
    },
  });
}
