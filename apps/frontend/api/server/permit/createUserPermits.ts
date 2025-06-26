"use server";

import { db } from "@/config/prisma";
import { getUserInfoFromCookie } from "@/utils/supabase/server";
import { permit, PermitStatus } from "@bitrock/db";

export async function createUserPermits(
  permitDTO: Omit<
    permit,
    "user_id" | "id" | "created_at" | "updated_at" | "status"
  >,
) {
  const userInfo = await getUserInfoFromCookie();

  if (userInfo.referent_id) {
    return db.permit.create({
      data: {
        ...permitDTO,
        user_id: userInfo.id,
        reviewer_id: userInfo.referent_id!,
        status: PermitStatus.PENDING,
      },
    });
  }

  return db.permit.create({
    data: {
      ...permitDTO,
      user_id: userInfo.id,
      reviewer_id: permitDTO.reviewer_id,
      status: PermitStatus.PENDING,
    },
  });
}
