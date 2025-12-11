"use server";

import { db } from "@/config/prisma";
import { PermitStatus, PermitType } from "@/db";

export type UserAllocationDetail = {
  projectId: string;
  projectName: string;
  projectStatus: string;
  clientName: string;
  startDate: Date;
  endDate: Date | null;
  percentage: number;
  isActive: boolean;
};

export type UserAllocationRecap = {
  allocations: UserAllocationDetail[];
  daysOffLeft: number;
  daysOffPlanned: number;
  activeAllocations: number;
  totalAllocations: number;
};

export async function fetchUserAllocations(
  userId: string
): Promise<UserAllocationRecap> {
  const now = new Date();

  const allocations = await db.allocation.findMany({
    where: {
      user_id: userId,
    },
    include: {
      project: {
        include: {
          client: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      start_date: "desc",
    },
  });

  const permits = await db.permit.findMany({
    where: {
      user_id: userId,
      type: PermitType.VACATION,
    },
  });

  const totalVacationDays = 25; // Placeholder, same as in fetchUserStats

  const vacationDaysUsed = permits
    .filter(
      (permit) =>
        permit.status === PermitStatus.APPROVED &&
        new Date(permit.date).getFullYear() === now.getFullYear()
    )
    .reduce((sum, permit) => sum + permit.duration, 0);

  const daysOffPlanned = permits
    .filter(
      (permit) =>
        (permit.status === PermitStatus.APPROVED ||
          permit.status === PermitStatus.PENDING) &&
        new Date(permit.date) >= now
    )
    .reduce((sum, permit) => sum + permit.duration, 0);

  const daysOffLeft = totalVacationDays - vacationDaysUsed;

  const allocationDetails: UserAllocationDetail[] = allocations.map(
    (alloc) => ({
      projectId: alloc.project.id,
      projectName: alloc.project.name,
      projectStatus: alloc.project.status,
      clientName: alloc.project.client.name,
      startDate: alloc.start_date,
      endDate: alloc.end_date,
      percentage: alloc.percentage,
      isActive:
        alloc.start_date <= now &&
        (alloc.end_date === null || alloc.end_date >= now),
    })
  );

  return {
    allocations: allocationDetails,
    daysOffLeft,
    daysOffPlanned,
    activeAllocations: allocationDetails.filter((alloc) => alloc.isActive)
      .length,
    totalAllocations: allocationDetails.length,
  };
}
