"use server";
import { Permissions, Role } from "@/db";
import { getUserInfoFromCookie } from "@/utils/supabase/server";

export async function allowRoles(roles: Role[]) {
  const user = await getUserInfoFromCookie();
  if (!user) return false;
  return roles.includes(user.role);
}

export async function hasPermission(permission: Permissions) {
  try {
    const user = await getUserInfoFromCookie();
    return user.permissions.includes(permission);
  } catch (error) {
    console.error("Error checking permission:", error);
    return false;
  }
}
