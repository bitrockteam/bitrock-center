"use server";

import { db } from "@/config/prisma";
import { getUserInfoFromCookie } from "@/utils/supabase/server";
import { permit, PermitStatus } from "../../../db";

export type CreateBulkPermitDTO = Omit<
  permit,
  "user_id" | "id" | "created_at" | "updated_at" | "status"
>[];

export async function createBulkPermits(permitDTO: CreateBulkPermitDTO) {
  const userInfo = await getUserInfoFromCookie();

  if (userInfo.referent_id) {
    const permitsWithUserId = permitDTO.map((p) => ({
      ...p,
      user_id: userInfo.id,
      reviewer_id: userInfo.referent_id!,
      status: PermitStatus.PENDING,
    }));
    return db.permit.createMany({
      data: permitsWithUserId,
    });
  }

  const permitsWithUserId = permitDTO.map((p) => ({
    ...p,
    user_id: userInfo.id,
    reviewer_id: p.reviewer_id,
    status: PermitStatus.PENDING,
  }));
  return db.permit.createMany({
    data: permitsWithUserId,
  });
}
