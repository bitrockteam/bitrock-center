"use server";
import { db } from "@/config/prisma";
import { PermitStatus, PermitType } from "@/db";
import { getUserInfoFromCookie } from "@/utils/supabase/server";

export type UserStats = {
  hoursWorked: number;
  vacationDaysLeft: number;
  vacationDaysTotal: number;
  activeProjects: number;
  totalProjects: number;
  pendingRequests: number;
};
export async function fetchUserStats(): Promise<UserStats> {
  const { id: userId } = await getUserInfoFromCookie();

  const activeProjectsCount = await db.allocation.count({
    where: {
      user_id: userId,
      start_date: {
        lte: new Date(),
      },
      end_date: {
        gte: new Date(),
      },
    },
  });

  const totalProjectsCount = await db.allocation.count({
    where: {
      user_id: userId,
    },
  });

  const totalHoursWorked = await db.timesheet.aggregate({
    _sum: {
      hours: true,
    },
    where: {
      user_id: userId,
      date: {
        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // Start of current month
      },
    },
  });

  const permissionHours = await db.permit.aggregate({
    _sum: {
      duration: true,
    },
    where: {
      user_id: userId,
      type: PermitType.VACATION,
      date: {
        // Start of current year
        gte: new Date(new Date().getFullYear(), 0, 1),
      },
    },
  });

  const totalVacationDays = 25; // Placeholder, replace with actual logic to fetch from user settings or config
  const vacationDaysUsed = Number(permissionHours._sum?.duration) || 0;

  const pendingRequests = await db.permit.count({
    where: {
      user_id: userId,
      status: PermitStatus.PENDING,
    },
  });
  return {
    vacationDaysLeft: totalVacationDays - vacationDaysUsed,
    vacationDaysTotal: totalVacationDays,
    pendingRequests,
    hoursWorked: totalHoursWorked._sum.hours || 0,
    activeProjects: activeProjectsCount,
    totalProjects: totalProjectsCount,
  };
}
