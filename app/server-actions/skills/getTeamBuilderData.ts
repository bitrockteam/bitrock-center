"use server";

import { db } from "@/config/prisma";
import type { EmployeeWithSkills } from "@/hooks/useSkillsApi";

export type AvailabilityStatus = "available" | "available_soon" | "occupied";

export type EmployeeWithAvailability = EmployeeWithSkills & {
  availability: AvailabilityStatus;
  allocations: Array<{
    workItemId: string;
    workItemName: string;
    endDate: Date | null;
  }>;
  averageSeniority: number;
};

export async function getTeamBuilderData(): Promise<EmployeeWithAvailability[]> {
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  // Fetch all employees with skills
  const employees = await db.user.findMany({
    include: {
      user_skill: {
        include: {
          skill: {
            select: {
              id: true,
              name: true,
              category: true,
              description: true,
              icon: true,
              color: true,
              active: true,
              created_at: true,
              updated_at: true,
            },
          },
        },
      },
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
      },
    },
  });

  // Calculate seniority values
  const seniorityValues: Record<string, number> = {
    junior: 1,
    middle: 2,
    senior: 3,
  };

  // Process each employee
  const employeesWithAvailability: EmployeeWithAvailability[] = employees.map((emp) => {
    // Filter only active skills
    const activeSkills = emp.user_skill.filter((us) => us.skill.active);

    // Calculate average seniority
    const averageSeniority =
      activeSkills.length > 0
        ? activeSkills.reduce((sum, us) => sum + seniorityValues[us.seniorityLevel], 0) /
          activeSkills.length
        : 0;

    // Get active allocations
    const activeAllocations = emp.allocation.filter((alloc) => {
      const startDate = alloc.start_date;
      const endDate = alloc.end_date ?? alloc.work_items.end_date ?? null;
      return startDate <= now && (endDate === null || endDate >= now);
    });

    // Determine availability status
    let availability: AvailabilityStatus = "available";

    if (activeAllocations.length > 0) {
      // Check if any allocation ends within 30 days
      const hasAllocationEndingSoon = activeAllocations.some((alloc) => {
        const endDate = alloc.end_date ?? alloc.work_items.end_date ?? null;
        if (endDate === null) return false;
        return endDate <= thirtyDaysFromNow && endDate >= now;
      });

      if (hasAllocationEndingSoon) {
        availability = "available_soon";
      } else {
        availability = "occupied";
      }
    }

    // Format allocations
    const allocations = activeAllocations.map((alloc) => ({
      workItemId: alloc.work_items.id,
      workItemName: alloc.work_items.title,
      endDate: alloc.end_date ?? alloc.work_items.end_date ?? null,
    }));

    return {
      id: emp.id,
      name: emp.name,
      role: emp.role,
      avatar_url: emp.avatar_url,
      user_skill: activeSkills.map((us) => ({
        skill_id: us.skill.id,
        seniorityLevel: us.seniorityLevel,
        skill: {
          id: us.skill.id,
          name: us.skill.name,
          category: us.skill.category,
          description: us.skill.description,
          icon: us.skill.icon,
          color: us.skill.color,
          active: us.skill.active,
          created_at: us.skill.created_at,
          updated_at: us.skill.updated_at,
        },
      })),
      availability,
      allocations,
      averageSeniority,
    };
  });

  return employeesWithAvailability;
}
