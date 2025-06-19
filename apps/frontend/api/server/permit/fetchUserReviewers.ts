"use server";
import { db } from "@/config/prisma";
import { getUserInfoFromCookie } from "@/utils/supabase/server";

export async function fetchUserReviewers() {
  const userInfo = await getUserInfoFromCookie();

  const projectIds = await db.allocation.findMany({
    where: {
      user_id: userInfo.id,
    },
    select: {
      project_id: true,
    },
  });

  return await db.user.findMany({
    where: {
      role: "Key_Client",
      allocation: {
        some: {
          project_id: {
            in: projectIds.map((allocation) => allocation.project_id),
          },
        },
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      avatar_url: true,
      role: true,
      allocation: {
        where: {
          project_id: {
            in: projectIds.map((allocation) => allocation.project_id),
          },
        },
      },
    },
  });
}

export type FetchUserReviewersResponse = Awaited<
  ReturnType<typeof fetchUserReviewers>
>[number];
