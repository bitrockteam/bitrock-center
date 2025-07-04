"use server";

import { db } from "@/config/prisma";

export async function toggleSkillActive(skillId: string, active: boolean) {
  return db.skill.update({
    where: { id: skillId },
    data: {
      active: active,
    },
  });
}
