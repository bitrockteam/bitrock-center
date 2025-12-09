"use server";
import { db } from "@/config/prisma";
import { getUserInfoFromCookie } from "@/utils/supabase/server";

export async function fetchUserReviewers() {
  const userInfo = await getUserInfoFromCookie();

  const projectIds = await db.allocation.findMany({
    where: {
      user_id: userInfo.id,
    },
  });

  const userKeyClient = await db.user.findMany({
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

  if (userInfo.referent_id) {
    const userManagers = await db.user.findUnique({
      where: {
        id: userInfo.referent_id,
      },
    });

    return [...userKeyClient, userManagers];
  }

  return userKeyClient;
}

export type FetchUserReviewersResponse = Awaited<ReturnType<typeof fetchUserReviewers>>[number];
