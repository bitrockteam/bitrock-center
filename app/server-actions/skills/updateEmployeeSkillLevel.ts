"use server";

import { db } from "@/config/prisma";
import type { SeniorityLevel } from "@/db";

export async function updateEmployeeSkillLevel(
  employeeId: string,
  skillId: string,
  newLevel: SeniorityLevel
) {
  // Convert API values to database enum values
  // API uses "mid" and "lead", but database enum uses "middle" and doesn't have "lead"
  let dbLevel: SeniorityLevel = newLevel;
  if (newLevel === "mid") {
    dbLevel = "middle" as SeniorityLevel;
  } else if (newLevel === "lead") {
    // If "lead" is not in the enum, default to "senior"
    dbLevel = "senior" as SeniorityLevel;
  }

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
