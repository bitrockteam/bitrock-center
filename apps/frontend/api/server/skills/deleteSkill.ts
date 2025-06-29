"use server";
import { db } from "@/config/prisma";

export async function deleteSkill(skillId: string) {
  return db.skill.delete({
    where: { id: skillId },
  });
}
