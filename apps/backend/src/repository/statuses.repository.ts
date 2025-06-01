import { db } from "../config/prisma";

export async function getStatuses() {
  return db.status.findMany({
    orderBy: {
      name: "asc",
    },
  });
}
