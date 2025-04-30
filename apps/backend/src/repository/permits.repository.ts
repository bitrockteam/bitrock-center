import { sql } from "../config/postgres";
import { IPermit, IPermitUpsert } from "@bitrock/types";

export async function getPermitsByUser(userId: string): Promise<IPermit[]> {
  const res = await sql`
    SELECT 
      p.id,
      p.created_at,
      p.user_id,
      p.duration,
      p.description,
      p.type,
      p.date,
      p.status,
      p.reviewer_id
    FROM public."permits" p
    WHERE p.user_id = ${userId}
  `;

  return res.map((row) => ({
    id: row.id,
    createdAt: new Date(row.created_at),
    userId: row.user_id,
    duration: parseFloat(row.duration),
    description: row.description,
    type: row.type,
    date: new Date(row.date),
    status: row.status,
    reviewerId: row.reviewer_id,
  }));
}

export async function getPermitsByReviewer(
  reviewerId: string,
): Promise<IPermit[]> {
  const rows = await sql`
    SELECT 
      id, created_at, user_id, duration, description, type, date, status, reviewer_id
    FROM public."PERMITS"
    WHERE reviewer_id = ${reviewerId}
  `;

  return rows.map((row) => ({
    id: row.id,
    createdAt: new Date(row.created_at),
    userId: row.user_id,
    duration: parseFloat(row.duration),
    description: row.description,
    type: row.type,
    date: new Date(row.date),
    status: row.status,
    reviewerId: row.reviewer_id,
  }));
}

export async function getPermitById(id: string): Promise<IPermit | null> {
  const res = await sql`
    SELECT 
      id,
      created_at,
      user_id,
      duration,
      description,
      type,
      date,
      status,
      reviewer_id
    FROM public."permits"
    WHERE id = ${id}
    LIMIT 1
  `;

  if (res.length === 0) return null;

  const row = res[0];
  return {
    id: row.id,
    createdAt: new Date(row.created_at),
    userId: row.user_id,
    duration: parseFloat(row.duration),
    description: row.description,
    type: row.type,
    date: new Date(row.date),
    status: row.status,
    reviewerId: row.reviewer_id,
  };
}

export async function createPermit(input: IPermitUpsert): Promise<IPermit> {
  const { userId, duration, description, type, date, status, reviewerId } =
    input;

  const res = await sql`
    INSERT INTO public."permits" (
      user_id, duration, description, type, date, status, reviewer_id, created_at
    ) VALUES (
      ${userId}, ${duration}, ${description}, ${type}, ${date}, ${status}, ${reviewerId}, NOW()
    ) RETURNING id
  `;

  const id = res[0]?.id;
  if (!id) throw new Error("Failed to create permit");

  return (await getPermitById(id)) as IPermit;
}

export const updatePermit = async (
  input: IPermitUpsert & { id: string },
): Promise<IPermit | null> => {
  const { id, userId, description, duration, type, date, reviewerId } = input;

  const existing = await sql`
    SELECT status FROM public."PERMITS" WHERE id = ${id}
  `;

  if (existing.length === 0) return null;

  const currentStatus = existing[0].status;

  if (currentStatus === "approved") {
    throw new Error("Approved permits cannot be edited");
  }

  const newStatus = currentStatus === "rejected" ? "pending" : currentStatus;

  await sql`
    UPDATE public."PERMITS"
    SET
      user_id = ${userId},
      description = ${description},
      duration = ${duration},
      type = ${type},
      date = ${date},
      reviewer_id = ${reviewerId},
      status = ${newStatus}
    WHERE id = ${id}
  `;

  const [row] = await sql`
    SELECT * FROM public."PERMITS" WHERE id = ${id}
  `;

  return {
    id: row.id,
    userId: row.user_id,
    description: row.description,
    duration: row.duration,
    type: row.type,
    date: row.date,
    createdAt: row.created_at,
    status: row.status,
    reviewerId: row.reviewer_id,
  };
};

export async function deletePermit(id: string): Promise<boolean> {
  const result = await sql`
    DELETE FROM public."permits" WHERE id = ${id}
  `;
  return result.count > 0;
}

// New method to update status
export async function updatePermitStatus(
  id: string,
  status: string,
): Promise<boolean> {
  // Fetch current status
  const existing = await sql`
    SELECT status FROM public."permits" WHERE id = ${id}
  `;

  if (existing.length === 0) return false;

  const currentStatus = existing[0].status;

  // Prevent changes if already approved
  if (currentStatus === "approved") {
    throw new Error("Cannot change status of an approved permit");
  }

  const result = await sql`
    UPDATE public."permits"
    SET status = ${status}
    WHERE id = ${id}
  `;

  return result.count > 0;
}
