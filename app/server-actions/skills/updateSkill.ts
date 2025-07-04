"use server";
import { db } from "@/config/prisma";
import { skill } from "@/db";

export async function updateSkill(
  skill: Omit<skill, "created_at" | "updated_at">,
) {
  return db.skill.update({
    where: { id: skill.id },
    data: {
      name: skill.name,
      description: skill.description,
      category: skill.category,
      icon: skill.icon,
      active: skill.active,
    },
  });
}
