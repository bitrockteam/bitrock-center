import { project } from "@bitrock/db";
import { sql } from "../config/postgres";
import { db } from "../config/prisma";

export async function getProjects(params?: string) {
  return db.project.findMany({
    orderBy: {
      created_at: "desc",
    },
    where: {
      OR: [
        { name: { contains: params, mode: "insensitive" } },
        { client: { contains: params, mode: "insensitive" } },
      ],
    },
  });
}

export async function getProjectById(id: string) {
  return db.project.findUnique({
    where: { id },
  });
}

export const createProject = async (
  input: Omit<project, "id" | "created_at">,
) => {
  const { name, client, status, description, start_date, end_date } = input;

  const res = await sql`
    INSERT INTO public."project" (
      name, client, status, description, start_date, end_date, created_at
    ) VALUES (
      ${name}, ${client}, ${status}, ${description}, ${start_date}, ${end_date || null}, NOW()
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
    FROM public."project" p
    JOIN public."status" s ON p.status_id = s.id
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

export const updateProject = async (input: Omit<project, "created_at">) => {
  return db.project.update({
    where: { id: input.id },
    data: {
      name: input.name,
      client: input.client,
      status: input.status,
      description: input.description,
      start_date: input.start_date,
      end_date: input.end_date ? new Date(input.end_date) : null,
    },
  });
};

export const deleteProject = async (id: string) => {
  return db.project.delete({
    where: { id },
  });
};

export const getAvailableUsersForProject = async (id: string) => {
  const allocationProjects = await db.allocation.findMany({
    where: { project_id: id },
    select: { user_id: true },
  });
  return db.user.findMany({
    where: {
      id: {
        notIn: allocationProjects.map((allocation) => allocation.user_id),
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar_url: true,
    },
  });
};

export async function getUserProjects(userId: string) {
  return db.project.findMany({
    where: {
      allocation: {
        some: {
          user_id: userId,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });
}
