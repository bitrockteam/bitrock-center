import { db } from "@/config/prisma";
import { getUserInfoFromCookie } from "@/utils/supabase/server";

export async function fetchReferent() {
  const userInfo = await getUserInfoFromCookie();

  return await db.user.findMany({
    where: {
      referent_id: userInfo.id,
    },
  });
}

export type FetchReferentResponse = Awaited<
  ReturnType<typeof fetchReferent>
>[number];
