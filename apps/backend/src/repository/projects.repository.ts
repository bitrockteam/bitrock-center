import { IProject, IProjectUpsert } from "@bitrock/types";
import { sql } from "../config/postgres";

export async function getProjects(params?: string): Promise<IProject[]> {
  const baseQuery = sql`
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

  const searchFilter = params
    ? sql`AND (p.name ILIKE '%' || ${params} || '%' OR p.client ILIKE '%' || ${params} || '%')`
    : sql``;

  const res = await sql`${baseQuery} ${searchFilter}`;

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

export async function getProjectById(id: string): Promise<IProject | null> {
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
    WHERE p.id = ${id}
      AND s.name IS DISTINCT FROM p.name
    LIMIT 1
  `;

  if (res.length === 0) return null;

  const row = res[0];

  return {
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
  };
}

export const createProject = async (
  input: IProjectUpsert,
): Promise<IProject> => {
  const { name, client, status_id, description, start_date, end_date } = input;

  const res = await sql`
    INSERT INTO public."PROJECTS" (
      name, client, status_id, description, start_date, end_date, created_at
    ) VALUES (
      ${name}, ${client}, ${status_id}, ${description}, ${start_date}, ${end_date || null}, NOW()
    ) RETURNING id
  `;

  const id = res[0].id;
  if (!id) throw new Error("Failed to create project");

  const [row] = await sql`
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
    WHERE p.id = ${id}
    LIMIT 1
  `;

  return {
    id: row.project_id,
    created_at: new Date(row.project_created_at),
    name: row.project_name,
    client: row.client,
    description: row.description,
    start_date: new Date(row.start_date),
    end_date: row.end_date ? new Date(row.end_date) : undefined,
    status: {
      id: row.status_id,
      name: row.status_name,
    },
  };
};

interface UpdateProjectInput {
  id: string;
  name: string;
  client: string;
  status_id: string;
  description: string;
  start_date: string;
  end_date?: string;
}

export const updateProject = async (
  input: UpdateProjectInput,
): Promise<IProject | null> => {
  const { id, name, client, status_id, description, start_date, end_date } =
    input;

  await sql`
    UPDATE public."PROJECTS"
    SET name = ${name},
        client = ${client},
        status_id = ${status_id},
        description = ${description},
        start_date = ${start_date},
        end_date = ${end_date || null}
    WHERE id = ${id}
  `;

  const [row] = await sql`
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
    WHERE p.id = ${id}
    LIMIT 1
  `;

  if (!row) return null;

  return {
    id: row.project_id,
    created_at: new Date(row.project_created_at),
    name: row.project_name,
    client: row.client,
    description: row.description,
    start_date: new Date(row.start_date),
    end_date: row.end_date ? new Date(row.end_date) : undefined,
    status: {
      id: row.status_id,
      name: row.status_name,
    },
  };
};

export const deleteProject = async (id: string): Promise<boolean> => {
  const result = await sql`
    DELETE FROM public."PROJECTS" WHERE id = ${id}
  `;

  return result.count > 0;
};
