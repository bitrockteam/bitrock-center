import { db } from "../config/prisma";

export async function getRoles() {
  return db.role.findMany({
    orderBy: {
      label: "asc",
    },
  });
}
