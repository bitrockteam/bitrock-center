"use server";

import { db } from "@/config/prisma";
import type { SeniorityLevel } from "@/db";

export async function addSkillToEmployee(
  employeeId: string,
  skillId: string,
  level: SeniorityLevel
) {
  // Level is already a valid SeniorityLevel type
  const dbLevel: SeniorityLevel = level;

  return db.user_skill.create({
    data: {
      user_id: employeeId,
      skill_id: skillId,
      seniorityLevel: dbLevel,
    },
  });
}
