import { IRole } from "@bitrock/types";
import { sql } from "../config/postgres";

export async function getRoles() {
  const res = await sql`SELECT * FROM public."ROLES"`;
  console.log({ res });

  return [...res] as IRole[];
}
