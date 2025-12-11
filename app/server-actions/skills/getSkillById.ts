"use server";

import { db } from "@/config/prisma";

export async function getSkillById(id: string) {
  return db.skill.findUnique({
    where: {
      id: id,
    },
    include: {
      user_skill: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar_url: true,
            },
          },
        },
      },
    },
  });
}

export type SkillWithUsers = Awaited<ReturnType<typeof getSkillById>>;
