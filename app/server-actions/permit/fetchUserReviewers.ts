"use server";
import { db } from "@/config/prisma";
import { getUserInfoFromCookie } from "@/utils/supabase/server";

export async function fetchUserReviewers() {
  const userInfo = await getUserInfoFromCookie();

  // const projectIds = await db.allocation.findMany({
  //   where: {
  //     user_id: userInfo.id,
  //   },
  // });

  // const projectIdsArray = projectIds.map((allocation) => allocation.project_id);

  // const userKeyClient =
  //   projectIdsArray.length > 0
  //     ? await db.user.findMany({
  //         where: {
  //           role: $Enums.Role.Key_Client,
  //           allocation: {
  //             some: {
  //               project_id: {
  //                 in: projectIdsArray,
  //               },
  //             },
  //           },
  //         },
  //         select: {
  //           id: true,
  //           name: true,
  //           email: true,
  //           avatar_url: true,
  //           role: true,
  //           allocation: {
  //             where: {
  //               project_id: {
  //                 in: projectIdsArray,
  //               },
  //             },
  //           },
  //         },
  //       })
  //     : [];

  if (userInfo.referent_id) {
    const userManagers = await db.user.findUnique({
      where: {
        id: userInfo.referent_id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar_url: true,
        role: true,
      },
    });

    if (userManagers) {
      return [userManagers];
    }
  }

  return [];
}

export type FetchUserReviewersResponse = Awaited<ReturnType<typeof fetchUserReviewers>>[number];
