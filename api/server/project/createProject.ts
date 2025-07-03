"use server";
import { db } from "@/config/prisma";
import { checkSession } from "@/utils/supabase/server";
import { project } from "../../../db";

export async function createProject(
  project: Omit<project, "id" | "created_at">,
) {
  await checkSession();
  return db.project.create({
    data: project,
  });
}
