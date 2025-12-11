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
  computedDaysOffLeft: number;
  computedDaysOffPlanned: number;
  hasCustomValues: boolean;
  activeAllocations: number;
  totalAllocations: number;
  latestAllocationEndDate: Date | null;
};

export async function fetchUserAllocations(
  userId: string
): Promise<UserAllocationRecap> {
  const now = new Date();

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      custom_days_off_left: true,
      custom_days_off_planned: true,
    },
  });

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

  const computedDaysOffPlanned = permits
    .filter(
      (permit) =>
        (permit.status === PermitStatus.APPROVED ||
          permit.status === PermitStatus.PENDING) &&
        new Date(permit.date) >= now
    )
    .reduce((sum, permit) => sum + permit.duration, 0);

  const computedDaysOffLeft = totalVacationDays - vacationDaysUsed;

  // Use custom values if set, otherwise use computed values
  const daysOffLeft = user?.custom_days_off_left ?? computedDaysOffLeft;
  const daysOffPlanned =
    user?.custom_days_off_planned ?? computedDaysOffPlanned;
  const hasCustomValues =
    user?.custom_days_off_left !== null ||
    user?.custom_days_off_planned !== null;

  const allocationDetails: UserAllocationDetail[] = allocations.map(
    (alloc) => ({
      projectId: alloc.project.id,
      projectName: alloc.project.name,
      projectStatus: alloc.project.status,
      clientName: alloc.project.client.name,
      startDate: alloc.start_date,
      endDate: alloc.end_date ?? alloc.project.end_date,
      percentage: alloc.percentage,
      isActive:
        alloc.start_date <= now &&
        (alloc.end_date === null || alloc.end_date >= now),
    })
  );

  const activeAllocationsList = allocations.filter(
    (alloc) =>
      alloc.start_date <= now &&
      (alloc.end_date === null || alloc.end_date >= now)
  );

  // Find the latest end date from all active allocations
  // Use allocation.end_date if set, otherwise fall back to project.end_date
  const latestAllocationEndDate =
    activeAllocationsList.length > 0
      ? activeAllocationsList
          .map((alloc) => alloc.end_date ?? alloc.project.end_date)
          .filter((date): date is Date => date !== null)
          .sort((a, b) => b.getTime() - a.getTime())[0] || null
      : null;

  return {
    allocations: allocationDetails,
    daysOffLeft,
    daysOffPlanned,
    computedDaysOffLeft,
    computedDaysOffPlanned,
    hasCustomValues,
    activeAllocations: activeAllocationsList.length,
    totalAllocations: allocationDetails.length,
    latestAllocationEndDate,
  };
}
