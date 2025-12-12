import { db } from "@/config/prisma";

export async function deleteAllocation({
  work_item_id,
  user_id,
}: {
  work_item_id: string;
  user_id: string;
}) {
  return db.allocation.delete({
    where: {
      user_id_work_item_id: {
        work_item_id,
        user_id,
      },
    },
  });
}
