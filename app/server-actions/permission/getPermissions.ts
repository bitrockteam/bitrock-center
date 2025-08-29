"use server";

import { Permissions as PermissionsEnum } from "@/db";

export async function getPermissions() {
  const values = Object.values(PermissionsEnum) as string[];
  return values.map((id) => ({ id }));
}

export type Permissions = Awaited<ReturnType<typeof getPermissions>>;
