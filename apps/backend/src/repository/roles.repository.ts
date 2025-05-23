import { IRole } from "@bitrock/types";
import { sql } from "../config/postgres";
import prisma from "../prisma";

export async function getRoles() {
  const res = await sql`SELECT * FROM public."ROLES"`;

  return [...res] as IRole[];
}
