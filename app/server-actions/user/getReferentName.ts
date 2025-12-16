"use server";

import { db } from "@/config/prisma";

export async function getReferentName(referentId: string) {
  const referent = await db.user.findUnique({
    where: {
      id: referentId,
    },
    select: {
      name: true,
    },
  });

  return referent?.name ?? null;
}
