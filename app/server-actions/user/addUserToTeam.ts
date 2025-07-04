"use server";

import { db } from "@/config/prisma";
import { getUserInfoFromCookie } from "@/utils/supabase/server";

export async function addUserToTeam(userId: string) {
  const user = await getUserInfoFromCookie();
  return db.user.update({
    where: {
      id: userId,
    },
    data: {
      referent_id: user.id,
    },
  });
}
