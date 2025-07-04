import { db } from "@/config/prisma";
import { getUserInfoFromCookie } from "@/utils/supabase/server";

export async function fetchTeam() {
  const userInfo = await getUserInfoFromCookie();

  return await db.user.findMany({
    where: {
      referent_id: userInfo.id,
    },
  });
}

export type FetchTeam = Awaited<ReturnType<typeof fetchTeam>>[number];
