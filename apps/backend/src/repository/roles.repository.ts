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

  // TODO: convert into prisma query
  const res =
    await sql`UPDATE public."user" SET role_id = ${roleId} WHERE id = ${userId} RETURNING *`;
  console.log({ userId, roleId, res });

  return res[0] as IUser;
}
