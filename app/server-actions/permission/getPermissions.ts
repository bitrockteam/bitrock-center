"use server";

import { db } from "@/config/prisma";

export async function getPermissions() {
  return db.permission.findMany({ select: { id: true } });
}

export type Permissions = Awaited<ReturnType<typeof getPermissions>>;
