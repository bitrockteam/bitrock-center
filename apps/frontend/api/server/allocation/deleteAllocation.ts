import { db } from "@/config/prisma";

export async function deleteAllocation({
  project_id,
  user_id,
}: {
  project_id: string;
  user_id: string;
}) {
  return db.allocation.delete({
    where: {
      user_id_project_id: {
        project_id,
        user_id,
      },
    },
  });
}
