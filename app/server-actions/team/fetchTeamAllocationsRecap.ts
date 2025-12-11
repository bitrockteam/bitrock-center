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
    id: string;
    name: string;
    endDate: Date | null;
    percentage: number;
  } | null;
  daysOffLeft: number;
  daysOffPlanned: number;
  totalAllocations: number;
  activeAllocations: number;
};

export async function fetchTeamAllocationsRecap(): Promise<
  TeamMemberAllocationRecap[]
> {
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
          project: true,
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
        (alloc) =>
          alloc.start_date <= now &&
          (alloc.end_date === null || alloc.end_date >= now)
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

      const daysOffPlanned = vacationPermits
        .filter(
          (permit) =>
            (permit.status === PermitStatus.APPROVED ||
              permit.status === PermitStatus.PENDING) &&
            new Date(permit.date) >= now
        )
        .reduce((sum, permit) => sum + permit.duration, 0);

      const daysOffLeft = totalVacationDays - vacationDaysUsed;

      return {
        userId: member.id,
        userName: member.name,
        userEmail: member.email,
        userAvatarUrl: member.avatar_url,
        userRole: member.role,
        currentProject: activeAllocation
          ? {
              id: activeAllocation.project.id,
              name: activeAllocation.project.name,
              endDate: activeAllocation.end_date,
              percentage: activeAllocation.percentage,
            }
          : null,
        daysOffLeft,
        daysOffPlanned,
        totalAllocations: member.allocation.length,
        activeAllocations: member.allocation.filter(
          (alloc) =>
            alloc.start_date <= now &&
            (alloc.end_date === null || alloc.end_date >= now)
        ).length,
      };
    })
  );

  return recap;
}
