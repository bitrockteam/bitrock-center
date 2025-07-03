"use server";

import { db } from "@/config/prisma";
import { getUserInfoFromCookie } from "@/utils/supabase/server";
import { PermitStatus } from "../../../db";

export async function updatePermitStatus(id: string, status: PermitStatus) {
  const userInfo = await getUserInfoFromCookie();

  return db.permit.update({
    where: { id },
    data: {
      status,
      reviewer_id: userInfo.referent_id || userInfo.id,
    },
  });
}
