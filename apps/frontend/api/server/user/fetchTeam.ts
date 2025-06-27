import { db } from "@/config/prisma";
import { getUserInfoFromCookie } from "@/utils/supabase/server";

export async function fetchMyTeam() {
  const userInfo = await getUserInfoFromCookie();

  if (!userInfo.referent_id) return { referent: null, members: [] };

  const referent = await db.user.findUnique({
    where: {
      id: userInfo.referent_id,
    },
  });

  const members = await db.user.findMany({
    where: {
      referent_id: userInfo.referent_id,
    },
  });

  return { referent, members };
}

export type FetchMyTeam = Awaited<ReturnType<typeof fetchMyTeam>>;
