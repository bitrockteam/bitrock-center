"use server";

import { db } from "@/config/prisma";
import type { SeniorityLevel } from "@/db";

export async function addSkillToEmployee(
  employeeId: string,
  skillId: string,
  level: SeniorityLevel
) {
  // Convert API values to database enum values
  // API uses "mid" and "lead", but database enum uses "middle" and doesn't have "lead"
  let dbLevel: SeniorityLevel = level;
  if (level === "mid") {
    dbLevel = "middle" as SeniorityLevel;
  } else if (level === "lead") {
    // If "lead" is not in the enum, default to "senior"
    dbLevel = "senior" as SeniorityLevel;
  }

  return db.user_skill.create({
    data: {
      user_id: employeeId,
      skill_id: skillId,
      seniorityLevel: dbLevel,
    },
  });
}
