"use server";
import { db } from "@/config/prisma";
import { skill } from "../../../db";

export async function createNewSkill(
  skill: Omit<skill, "id" | "created_at" | "updated_at">,
) {
  return db.skill.create({
    data: {
      name: skill.name,
      description: skill.description,
      category: skill.category,
      icon: skill.icon,
      active: skill.active,
    },
  });
}
