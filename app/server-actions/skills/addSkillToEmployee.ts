"use server";

import { db } from "@/config/prisma";
import type { SeniorityLevel } from "@/db";

export async function addSkillToEmployee(
  employeeId: string,
  skillId: string,
  level: SeniorityLevel
) {
  return db.user_skill.create({
    data: {
      user_id: employeeId,
      skill_id: skillId,
      seniorityLevel: level,
    },
  });
}
