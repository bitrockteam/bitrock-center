"use server";
import { getUserInfoFromCookie } from "@/utils/supabase/server";
import { Role } from "@bitrock/db";

export async function allowRoles(roles: Role[]) {
  const user = await getUserInfoFromCookie();
  console.log("User in allowRoles:", user);
  if (!user) return false;
  return roles.includes(user.role);
}
