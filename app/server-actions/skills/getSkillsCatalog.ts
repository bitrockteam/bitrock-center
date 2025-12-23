"use server";
import { db } from "@/config/prisma";

export async function getSkillsCatalog() {
  return db.skill.findMany({
    where: {
      active: true,
    },
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
      description: true,
      category: true,
      icon: true,
      color: true,
      active: true,
      created_at: true,
      updated_at: true,
    },
  });
}
