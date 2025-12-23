"use server";

import { db } from "@/config/prisma";
import type { SeniorityLevel } from "@/db";

export async function updateEmployeeSkillLevel(
  employeeId: string,
  skillId: string,
  newLevel: SeniorityLevel
) {
  // newLevel is already a valid SeniorityLevel type
  const dbLevel: SeniorityLevel = newLevel;

  return db.user_skill.update({
    where: {
      user_id_skill_id: {
        user_id: employeeId,
        skill_id: skillId,
      },
    },
    data: {
      seniorityLevel: dbLevel,
    },
  });
}
