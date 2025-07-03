"use server";
import { getUserInfoFromCookie } from "@/utils/supabase/server";
import { Role } from "../../db";

export async function allowRoles(roles: Role[]) {
  const user = await getUserInfoFromCookie();
  if (!user) return false;
  return roles.includes(user.role);
}
