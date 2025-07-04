"use server";

import { db } from "@/config/prisma";
import { SeniorityLevel } from "@/db";

export async function updateEmployeeSkillLevel(
  employeeId: string,
  skillId: string,
  newLevel: SeniorityLevel,
) {
  return db.user_skill.update({
    where: {
      user_id_skill_id: {
        user_id: employeeId,
        skill_id: skillId,
      },
    },
    data: {
      seniorityLevel: newLevel,
    },
  });
}
