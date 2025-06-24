import { permit, PermitStatus } from "@bitrock/db";
import { db } from "../config/prisma";

export async function getPermitsByUser(userId: string) {
  return db.permit.findMany({
    where: {
      user_id: userId,
    },
  });
}

export async function getPermitsByReviewer(reviewerId: string) {
  return db.permit.findMany({
    where: {
      reviewer_id: reviewerId,
      status: PermitStatus.PENDING,
    },
  });
}

export async function getPermitById(id: string) {
  return db.permit.findUnique({
    where: {
      id: id,
    },
  });
}

export async function createPermit(input: Omit<permit, "id" | "created_at">) {
  return db.permit.create({
    data: {
      user_id: input.user_id,
      reviewer_id: input.reviewer_id,
      description: input.description,
      duration: input.duration,
      type: input.type,
      date: input.date,
      status: PermitStatus.PENDING, // Default status
    },
  });
}

export async function updatePermit(input: permit) {
  // TODO: Validate input data if necessary
  return db.permit.update({
    where: {
      id: input.id,
    },
    data: {
      user_id: input.user_id,
      reviewer_id: input.reviewer_id,
      description: input.description,
      duration: input.duration,
      type: input.type,
      date: input.date,
      status: input.status, // Update status if provided
    },
  });
}

export async function deletePermit(id: string) {
  return db.permit.delete({
    where: {
      id: id,
    },
  });
}

// New method to update status
export async function updatePermitStatus(id: string, status: string) {
  return db.permit.update({
    where: {
      id: id,
    },
    data: {
      status: status as PermitStatus, // Ensure status is of type PermitStatus
    },
  });
}
