"use server";

import { db } from "@/config/prisma";
import { PermitStatus, PermitType } from "@/db";
import { getUserInfoFromCookie } from "@/utils/supabase/server";

export type TeamMemberAllocationRecap = {
  userId: string;
  userName: string;
  userEmail: string;
  userAvatarUrl: string | null;
  userRole: string;
  currentProject: {
    id?: string;
    name?: string;
    endDate?: Date | null;
    percentage: number;
  } | null;
  latestAllocationEndDate: Date | null;
  daysOffLeft: number;
  daysOffPlanned: number;
  totalAllocations: number;
  activeAllocations: number;
};

export async function fetchTeamAllocationsRecap(): Promise<TeamMemberAllocationRecap[]> {
  const userInfo = await getUserInfoFromCookie();

  if (!userInfo.referent_id) {
    return [];
  }

  const teamMembers = await db.user.findMany({
    where: {
      referent_id: userInfo.referent_id,
    },
    include: {
      allocation: {
        include: {
          work_items: {
            include: {
              project: true,
            },
          },
        },
        orderBy: {
          start_date: "desc",
        },
      },
      permit_permit_user_idTouser: {
        where: {
          type: PermitType.VACATION,
        },
      },
    },
  });

  const totalVacationDays = 25; // Placeholder, same as in fetchUserStats

  const recap = await Promise.all(
    teamMembers.map(async (member) => {
      const now = new Date();

      const activeAllocation = member.allocation.find(
        (alloc) => alloc.start_date <= now && (alloc.end_date === null || alloc.end_date >= now)
      );

      const vacationPermits = member.permit_permit_user_idTouser.filter(
        (permit) => permit.type === PermitType.VACATION
      );

      const vacationDaysUsed = vacationPermits
        .filter(
          (permit) =>
            permit.status === PermitStatus.APPROVED &&
            new Date(permit.date).getFullYear() === now.getFullYear()
        )
        .reduce((sum, permit) => sum + permit.duration, 0);

      const computedDaysOffPlanned = vacationPermits
        .filter(
          (permit) =>
            (permit.status === PermitStatus.APPROVED || permit.status === PermitStatus.PENDING) &&
            new Date(permit.date) >= now
        )
        .reduce((sum, permit) => sum + permit.duration, 0);

      const computedDaysOffLeft = totalVacationDays - vacationDaysUsed;

      // Use custom values if set, otherwise use computed values
      const daysOffLeft = member.custom_days_off_left ?? computedDaysOffLeft;
      const daysOffPlanned = member.custom_days_off_planned ?? computedDaysOffPlanned;

      // Find all active allocations
      const activeAllocations = member.allocation.filter(
        (alloc) => alloc.start_date <= now && (alloc.end_date === null || alloc.end_date >= now)
      );

      // Find the latest end date from all active allocations
      // Use allocation.end_date if set, otherwise fall back to project.end_date
      const latestEndDate =
        activeAllocations.length > 0
          ? activeAllocations
              .map((alloc) => alloc.end_date ?? alloc.work_items.project?.end_date)
              .filter((date): date is Date => date !== null)
              .sort((a, b) => b.getTime() - a.getTime())[0] || null
          : null;

      return {
        userId: member.id,
        userName: member.name,
        userEmail: member.email,
        userAvatarUrl: member.avatar_url,
        userRole: member.role,
        currentProject: activeAllocation
          ? {
              id: activeAllocation.work_items.project?.id,
              name: activeAllocation.work_items.project?.name,
              endDate: activeAllocation.end_date,
              percentage: activeAllocation.percentage,
            }
          : null,
        latestAllocationEndDate: latestEndDate,
        daysOffLeft,
        daysOffPlanned,
        totalAllocations: member.allocation.length,
        activeAllocations: activeAllocations.length,
      };
    })
  );

  return recap;
}
