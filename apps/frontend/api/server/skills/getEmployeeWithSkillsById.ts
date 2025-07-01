"use server";

import { db } from "@/config/prisma";

export async function getEmployeeWithSkillsById(id: string) {
  return db.user.findUnique({
    where: {
      id: id,
    },
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

export type EmployeeSkill = Awaited<
  ReturnType<typeof getEmployeeWithSkillsById>
>;
