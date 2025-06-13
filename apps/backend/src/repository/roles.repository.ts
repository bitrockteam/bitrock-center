import { IUser } from "@bitrock/types";
import { sql } from "../config/postgres";
import { db } from "../config/prisma";

export async function getRoles() {
  return db.role.findMany({
    orderBy: {
      label: "asc",
    },
  });
}

export async function updateRoleForUser(userId: string, roleId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: { role: true },
  });

  if (!user) throw new Error("User not found");

  return db.user.update({
    where: { id: userId },
    data: {
      role: {
        connect: { id: roleId },
      },
    },
    include: { role: true },
  });
}
