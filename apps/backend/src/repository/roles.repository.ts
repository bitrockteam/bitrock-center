import { IRole } from "@bitrock/types";
import { db } from "../config/prisma";

export async function getRoles() {
  const res = await db.role.findMany();
  return res as IRole[];
}
