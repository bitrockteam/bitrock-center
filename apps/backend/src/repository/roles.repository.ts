import { IRole } from "@bitrock/types";
import { sql } from "../config/postgres";

export async function getRoles() {
  const res = await sql`SELECT * FROM public."ROLES"`;

  return [...res] as IRole[];
}
