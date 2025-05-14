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
      p.start_date,
      p.end_date,
      p.status,
      p.reviewer_id
    FROM public."PERMITS" p
    WHERE p.user_id = ${userId}
  `;

  return res.map((row) => ({
    id: row.id,
    createdAt: new Date(row.created_at),
    userId: row.user_id,
    duration: parseFloat(row.duration),
    description: row.description,
    type: row.type,
    startDate: new Date(row.start_date),
    endDate: row.end_date ? new Date(row.end_date) : undefined,
    status: row.status,
    reviewerId: row.reviewer_id,
  }));
}

export async function getPermitsByReviewer(
  reviewerId: string,
): Promise<IPermit[]> {
  const rows = await sql`
    SELECT 
      id, created_at, user_id, duration, description, type, start_date, end_date, status, reviewer_id
    FROM public."PERMITS"
    WHERE reviewer_id = ${reviewerId} AND status = 'pending'
  `;

  return rows.map((row) => ({
    id: row.id,
    createdAt: new Date(row.created_at),
    userId: row.user_id,
    duration: parseFloat(row.duration),
    description: row.description,
    type: row.type,
    startDate: new Date(row.start_date),
    endDate: row.end_date ? new Date(row.end_date) : undefined,
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
      start_date,
      end_date,
      status,
      reviewer_id
    FROM public."PERMITS"
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
    startDate: new Date(row.start_date),
    endDate: row.end_date ? new Date(row.end_date) : undefined,
    status: row.status,
    reviewerId: row.reviewer_id,
  };
}

export async function createPermit(input: IPermitUpsert): Promise<IPermit> {
  const {
    userId,
    startDate,
    endDate,
    duration,
    description,
    type,
    reviewerId,
    status,
  } = input;

  // Basic validations
  if (type === "permit") {
    if (endDate) {
      throw new Error("Permits cannot have an end date.");
    }

    const result = await sql`
      SELECT COALESCE(SUM(duration), 0) AS total
      FROM public."PERMITS"
      WHERE user_id = ${userId} AND start_date = ${startDate}
    `;
    const totalDuration = parseFloat(result[0].total) || 0;

    if (totalDuration + duration > 8) {
      throw new Error("Total duration for this date exceeds 8 hours.");
    }
  } else {
    if (duration !== 8) {
      throw new Error(`${type} must have a fixed duration of 8 hours.`);
    }

    // Check if there's any overlapping request in the given date range
    const conflict = await sql`
      SELECT 1
      FROM public."PERMITS"
      WHERE user_id = ${userId}
        AND (
          start_date BETWEEN ${startDate} AND ${endDate || null}
          OR end_date BETWEEN ${startDate} AND ${endDate || null}
          OR (${startDate} BETWEEN start_date AND COALESCE(end_date, start_date))
        )
      LIMIT 1;
    `;
    if (conflict.length > 0) {
      throw new Error(`You already have a request in this time range.`);
    }
  }

  const res = await sql`
    INSERT INTO public."PERMITS" (
      user_id, duration, description, type, start_date, status, reviewer_id, end_date
    ) VALUES (
      ${userId}, ${duration}, ${description}, ${type}, ${startDate}, ${status}, ${reviewerId}, ${endDate || null}
    ) RETURNING id
  `;

  const id = res[0]?.id;
  if (!id) throw new Error("Failed to create permit");

  return (await getPermitById(id)) as IPermit;
}

export async function updatePermit(
  input: IPermitUpsert & { id: string },
): Promise<IPermit | null> {
  const { id, userId, description, duration, type, startDate, endDate } = input;

  const endDateString = endDate ? `AND end_date = ${endDate || null}` : "";
  const endDateStringEdit = endDate ? `end_date = ${endDate || null},` : "";

  // Get existing permit data
  const [existing] = await sql`
    SELECT status, duration
    FROM public."PERMITS"
    WHERE id = ${id}
  `;

  if (!existing) return null;

  if (existing.status === "approved") {
    throw new Error("Cannot edit an approved permit.");
  }

  // Check total duration of other permits on the same date
  const result = await sql`
    SELECT COALESCE(SUM(duration), 0) AS total
    FROM public."PERMITS"
    WHERE user_id = ${userId} AND start_date = ${startDate} AND id != ${id} ${endDateString}
  `;

  const otherDuration = parseFloat(result[0].total) || 0;

  if (otherDuration + duration > 8) {
    throw new Error("Total daily duration exceeds 8 hours.");
  }

  // If the status was rejected, reset it to pending
  const newStatus =
    existing.status === "rejected" ? "pending" : existing.status;

  // Update the permit
  await sql`
    UPDATE public."PERMITS"
    SET description = ${description},
        duration = ${duration},
        type = ${type},
        start_date = ${startDate},
        ${endDateStringEdit}
        status = ${newStatus}
    WHERE id = ${id}
  `;

  // Return the updated permit
  const [updated] = await sql`
    SELECT *
    FROM public."PERMITS"
    WHERE id = ${id}
  `;

  return {
    id: updated.id,
    userId: updated.user_id,
    reviewerId: updated.reviewer_id,
    description: updated.description,
    duration: parseFloat(updated.duration),
    type: updated.type,
    startDate: updated.start_date,
    endDate: updated.end_date,
    status: updated.status,
    createdAt: updated.created_at,
  };
}

export async function deletePermit(id: string): Promise<boolean> {
  const result = await sql`
    DELETE FROM public."PERMITS" WHERE id = ${id}
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
    SELECT status FROM public."PERMITS" WHERE id = ${id}
  `;

  if (existing.length === 0) return false;

  const currentStatus = existing[0].status;

  // Prevent changes if already approved
  if (currentStatus === "approved") {
    throw new Error("Cannot change status of an approved permit");
  }

  const result = await sql`
    UPDATE public."PERMITS"
    SET status = ${status}
    WHERE id = ${id}
  `;

  return result.count > 0;
}
