"use server";

import { db } from "@/config/prisma";

export async function getPermitsByReviewer({
  reviewerId,
}: {
  reviewerId: string;
}) {
  return db.permit.findMany({
    where: { reviewer_id: reviewerId },
    orderBy: { created_at: "desc" },
  });
}
