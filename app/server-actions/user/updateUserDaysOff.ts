"use server";

import { db } from "@/config/prisma";
import { getUserInfoFromCookie } from "@/utils/supabase/server";

export async function updateUserDaysOff({
  userId,
  daysOffLeft,
  daysOffPlanned,
}: {
  userId: string;
  daysOffLeft?: number | null;
  daysOffPlanned?: number | null;
}) {
  const currentUser = await getUserInfoFromCookie();

  // Only allow users to update their own days off
  if (currentUser.id !== userId) {
    throw new Error(
      "Non autorizzato: puoi modificare solo i tuoi giorni di ferie"
    );
  }

  return db.user.update({
    where: {
      id: userId,
    },
    data: {
      custom_days_off_left: daysOffLeft ?? null,
      custom_days_off_planned: daysOffPlanned ?? null,
    },
  });
}
