"use server";

import type { Permissions, Role } from "@/db";
import { createClient } from "@/utils/supabase/server";

export interface UserInfo {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  created_at: Date;
  referent_id: string | null;
  role: Role;
  permissions: Permissions[];
}

export async function getUserInfo(email?: string) {
  const supabase = await createClient();
  try {
    const { data: res } = await supabase.from("user").select("*").eq("email", email).single();

    const { data: permissions } = await supabase
      .from("user_permission")
      .select("permission_id")
      .eq("user_id", res?.id);

    if (res.error) {
      throw new Error(`Error fetching user info: ${res.error.message}`);
    }

    return {
      id: res?.id,
      email: res?.email,
      name: res?.name,
      avatar_url: res?.avatar_url ?? null,
      created_at: res?.created_at,
      referent_id: res?.referent_id ?? null,
      role: res?.role,
      permissions: permissions?.map((permission) => permission.permission_id) || [],
    } as UserInfo;
  } catch (error) {
    console.error("Error in getUserInfo:", error);
    throw error;
  }
}
