"use server";

import { db } from "@/config/prisma";
import { getUserInfoFromCookie } from "@/utils/supabase/server";

export async function getPermitsByReviewer() {
  const user = await getUserInfoFromCookie();
  return db.permit.findMany({
    include: {
      user_permit_user_idTouser: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    where: { reviewer_id: user.id },
    orderBy: { created_at: "desc" },
  });
}

export type PermitByReviewer = Awaited<
  ReturnType<typeof getPermitsByReviewer>
>[number];
