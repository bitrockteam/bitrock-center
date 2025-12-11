"use server";
import { db } from "@/config/prisma";

export async function removeSkillFromEmployee(employeeId: string, skillId: string) {
  return db.user_skill.delete({
    where: {
      user_id_skill_id: {
        user_id: employeeId,
        skill_id: skillId,
      },
    },
  });
}
