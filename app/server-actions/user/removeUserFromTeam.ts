"use server";

import { db } from "@/config/prisma";
import { getUserInfoFromCookie } from "@/utils/supabase/server";

export async function removeUserFromTeam(userId: string) {
  const currentUser = await getUserInfoFromCookie();

  // Verify that the current user is the team owner
  const teamMember = await db.user.findFirst({
    where: {
      id: userId,
      referent_id: currentUser.id,
    },
  });

  if (!teamMember) {
    throw new Error("Utente non trovato nel team o non autorizzato");
  }

  return db.user.update({
    where: {
      id: userId,
    },
    data: {
      referent_id: null,
    },
  });
}
