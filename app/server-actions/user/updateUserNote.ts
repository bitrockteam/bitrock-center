"use server";

import { db } from "@/config/prisma";
import { Permissions } from "@/db";
import { getUserInfoFromCookie } from "@/utils/supabase/server";

type UpdateUserNoteInput = {
  userId: string;
  note: string | null;
};

export async function updateUserNote({ userId, note }: UpdateUserNoteInput) {
  const currentUser = await getUserInfoFromCookie();

  const canEditNote =
    currentUser.id === userId ||
    currentUser.role === "Admin" ||
    currentUser.role === "Manager" ||
    currentUser.permissions.includes(Permissions.CAN_DEAL_PERMISSIONS);

  if (!canEditNote) {
    throw new Error("Non autorizzato: non puoi modificare le note di questo utente");
  }

  const normalizedNote = note?.trim() ? note.trim() : null;

  return db.user.update({
    where: { id: userId },
    data: { note: normalizedNote },
  });
}


