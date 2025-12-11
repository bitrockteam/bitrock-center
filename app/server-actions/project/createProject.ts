"use server";
import { db } from "@/config/prisma";
import type { project } from "@/db";
import { checkSession } from "@/utils/supabase/server";

export async function createProject(project: Omit<project, "id" | "created_at">) {
  await checkSession();
  return db.project.create({
    data: project,
  });
}
