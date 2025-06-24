import { Role } from "@bitrock/db";
import { db } from "../config/prisma";

export async function updateRoleForUser(userId: string, roleId: Role) {
  const user = await db.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new Error("User not found");

  return db.user.update({
    where: { id: userId },
    data: {
      role: roleId,
    },
  });
}
