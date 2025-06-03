import {
  IAllocation,
  ICreateAllocation,
  IUpdateAllocation,
} from "@bitrock/types";
import { sql } from "../config/postgres";

export async function createAllocation(allocation: ICreateAllocation) {
  const res =
    await sql`INSERT INTO public."allocation" (user_id, project_id, start_date, end_date, percentage) VALUES (${allocation.user_id}, ${allocation.project_id}, ${allocation.start_date ?? null}, ${allocation.end_date ?? null}, ${allocation?.percentage ?? null}) RETURNING *`;

  return res[0] as ICreateAllocation;
}

export async function getAllocationsForProject(
  project_id: string,
): Promise<IAllocation[]> {
  const res =
    await sql`SELECT * FROM public."allocation" a INNER JOIN public."user" u ON a.user_id = u.id LEFT OUTER JOIN public."role" r on u.role_id = r.id WHERE project_id = ${project_id}`;
  return res.map(
    (row) =>
      ({
        user_id: row.user_id,
        project_id: row.project_id,
        start_date: row.start_date,
        end_date: row.end_date,
        percentage: row.percentage,
        user_name: row.name,
        user_avatar_url: row.avatar_url,
        user_role: {
          id: row.role_id,
          label: row.label,
        },
      }) as IAllocation,
  );
}

export async function updateAllocationForUser(
  project_id: string,
  user_id: string,
  allocation: IUpdateAllocation,
) {
  const res =
    await sql`UPDATE public."allocation" SET start_date = ${allocation.start_date ?? null}, end_date = ${allocation.end_date ?? null}, percentage = ${allocation.percentage ?? 100} WHERE user_id = ${user_id} AND project_id = ${project_id} RETURNING *`;
  return res[0] as ICreateAllocation;
}

export async function deleteAllocationForUser(
  project_id: string,
  user_id: string,
) {
  const res =
    await sql`DELETE FROM public."allocation" WHERE user_id = ${user_id} AND project_id = ${project_id}`;
  return res[0] as ICreateAllocation;
}
