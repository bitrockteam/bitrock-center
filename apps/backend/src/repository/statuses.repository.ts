import { IStatus } from "@bitrock/types";
import { sql } from "../config/postgres";

export async function getStatuses() {
  const res = await sql`SELECT * FROM public."STATUSES"`;

  return [...res] as IStatus[];
}
