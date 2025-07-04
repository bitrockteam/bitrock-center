"use server";
import { Role } from "@/db";
import { getUserInfoFromCookie } from "@/utils/supabase/server";

export async function allowRoles(roles: Role[]) {
  const user = await getUserInfoFromCookie();
  if (!user) return false;
  return roles.includes(user.role);
}
