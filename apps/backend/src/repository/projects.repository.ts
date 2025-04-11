import { sql } from "../config/postgres";
import { IProject } from "@bitrock/types";

export async function getProjects(): Promise<IProject[]> {
  const res = await sql`
    SELECT 
      p.id AS project_id,
      p.created_at AS project_created_at,
      p.name AS project_name,
      p.client,
      p.description,
      p.start_date,
      p.end_date,
      s.id AS status_id,
      s.name AS status_name
    FROM public."PROJECTS" p
    JOIN public."STATUSES" s ON p.status_id = s.id
    WHERE s.name IS DISTINCT FROM p.name
  `;

  return res.map((row) => ({
    id: row.project_id,
    created_at: new Date(row.project_created_at),
    name: row.project_name,
    client: row.client,
    description: row.description,
    start_date: new Date(row.start_date),
    end_date: new Date(row.end_date),
    status: {
      id: row.status_id,
      name: row.status_name,
    },
  }));
}
