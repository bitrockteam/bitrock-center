"use server";
import { db } from "@/config/prisma";
import { checkSession } from "@/utils/supabase/server";

export async function deleteProject(projectId: string) {
  await checkSession();
  return db.project.delete({
    where: { id: projectId },
  });
}
