"use server";
import { db } from "@/config/prisma";
import type { skill } from "@/db";

export async function updateSkill(skill: Omit<skill, "created_at" | "updated_at">) {
  try {
    return await db.skill.update({
      where: { id: skill.id },
      data: {
        name: skill.name,
        description: skill.description,
        category: skill.category,
        icon: skill.icon,
        color: skill.color ?? null,
        active: skill.active,
      },
    });
  } catch (error) {
    // Provide more helpful error message if column doesn't exist
    if (
      error instanceof Error &&
      error.message.includes("column") &&
      error.message.includes("color")
    ) {
      throw new Error(
        "Database migration not applied. Please run: supabase migration up or supabase db reset"
      );
    }
    throw error;
  }
}
