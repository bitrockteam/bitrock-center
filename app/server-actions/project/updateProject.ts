"use server";
import { db } from "@/config/prisma";
import type { project } from "@/db";
import { checkSession } from "@/utils/supabase/server";

export async function updateProject(project: Omit<project, "created_at">) {
  await checkSession();
  return db.project.update({
    where: { id: project.id! },
    data: project,
  });
}
