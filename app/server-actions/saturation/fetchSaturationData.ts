"use server";

import { db } from "@/config/prisma";
import { SeniorityLevel } from "@/db";
import { getUserInfoFromCookie } from "@/utils/supabase/server";

export type SaturationAllocation = {
  work_item_id: string;
  work_item_title: string;
  percentage: number;
  start_date: Date;
  end_date: Date | null;
};

export type SaturationEmployee = {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  team: { id: string; name: string } | null;
  seniority: SeniorityLevel | null;
  totalAllocation: number;
  allocations: SaturationAllocation[];
  latestEndDate: Date | null;
};

export async function fetchSaturationData(): Promise<SaturationEmployee[]> {
  await getUserInfoFromCookie();

  const now = new Date();

  const users = await db.user.findMany({
    include: {
      allocation: {
        include: {
          work_items: {
            select: {
              id: true,
              title: true,
              end_date: true,
            },
          },
        },
        orderBy: {
          start_date: "desc",
        },
      },
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      user_skill: {
        select: {
          seniorityLevel: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  const employees: SaturationEmployee[] = users.map((user) => {
    // Get active allocations
    const activeAllocations = user.allocation.filter(
      (alloc) => alloc.start_date <= now && (alloc.end_date === null || alloc.end_date >= now)
    );

    // Calculate total allocation percentage (sum of active allocations)
    const totalAllocation = activeAllocations.reduce((sum, alloc) => sum + alloc.percentage, 0);

    // Get latest end date from active allocations
    const latestEndDate =
      activeAllocations.length > 0
        ? activeAllocations
            .map((alloc) => alloc.end_date ?? alloc.work_items.end_date)
            .filter((date): date is Date => date !== null)
            .sort((a, b) => b.getTime() - a.getTime())[0] || null
        : null;

    // Get team info (manager)
    const team = user.user
      ? {
          id: user.user.id,
          name: user.user.name,
        }
      : null;

    // Get highest seniority level from all skills
    const seniorityLevels = user.user_skill.map((us) => us.seniorityLevel);
    let seniority: SeniorityLevel | null = null;
    if (seniorityLevels.includes(SeniorityLevel.senior)) {
      seniority = SeniorityLevel.senior;
    } else if (seniorityLevels.includes(SeniorityLevel.middle)) {
      seniority = SeniorityLevel.middle;
    } else if (seniorityLevels.includes(SeniorityLevel.junior)) {
      seniority = SeniorityLevel.junior;
    }

    // Format allocations
    const allocations: SaturationAllocation[] = activeAllocations.map((alloc) => ({
      work_item_id: alloc.work_items.id,
      work_item_title: alloc.work_items.title,
      percentage: alloc.percentage,
      start_date: alloc.start_date,
      end_date: alloc.end_date ?? alloc.work_items.end_date,
    }));

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar_url: user.avatar_url,
      team,
      seniority,
      totalAllocation,
      allocations,
      latestEndDate,
    };
  });

  return employees;
}
