"use server";

import { db } from "@/config/prisma";
import type { SeniorityLevel, SkillCategory } from "@/db";

export type SkillsStats = {
  employeeCountBySeniority: Array<{
    seniority: SeniorityLevel;
    count: number;
  }>;
  skillsDistribution: Array<{
    skillId: string;
    skillName: string;
    count: number;
    category: SkillCategory;
    color: string | null;
  }>;
  skillsByCategory: {
    hard: number;
    soft: number;
  };
  averageSkillsPerEmployee: number;
  seniorityDistributionPerSkill: Array<{
    skillId: string;
    skillName: string;
    junior: number;
    middle: number;
    senior: number;
  }>;
  totalEmployees: number;
  totalSkills: number;
};

export async function getSkillsStats(): Promise<SkillsStats> {
  // Fetch all employees with their skills
  const employees = await db.user.findMany({
    include: {
      user_skill: {
        include: {
          skill: {
            select: {
              id: true,
              name: true,
              category: true,
              color: true,
              active: true,
            },
          },
        },
      },
    },
  });

  // Filter only active skills
  const employeesWithActiveSkills = employees.map((emp) => ({
    ...emp,
    user_skill: emp.user_skill.filter((us) => us.skill.active),
  }));

  // Calculate employee count by seniority level
  const seniorityCounts = new Map<SeniorityLevel, number>();
  employeesWithActiveSkills.forEach((emp) => {
    if (emp.user_skill.length === 0) return;

    // Calculate average seniority for employee
    const seniorityValues: Record<SeniorityLevel, number> = {
      junior: 1,
      middle: 2,
      senior: 3,
    };

    const avgSeniority =
      emp.user_skill.reduce((sum, us) => sum + seniorityValues[us.seniorityLevel], 0) /
      emp.user_skill.length;

    // Categorize based on average
    let category: SeniorityLevel;
    if (avgSeniority < 1.5) {
      category = "junior";
    } else if (avgSeniority < 2.5) {
      category = "middle";
    } else {
      category = "senior";
    }

    seniorityCounts.set(category, (seniorityCounts.get(category) || 0) + 1);
  });

  const employeeCountBySeniority: Array<{
    seniority: SeniorityLevel;
    count: number;
  }> = [
    { seniority: "junior", count: seniorityCounts.get("junior") || 0 },
    { seniority: "middle", count: seniorityCounts.get("middle") || 0 },
    { seniority: "senior", count: seniorityCounts.get("senior") || 0 },
  ];

  // Calculate skills distribution
  const skillCounts = new Map<
    string,
    { name: string; count: number; category: SkillCategory; color: string | null }
  >();

  employeesWithActiveSkills.forEach((emp) => {
    emp.user_skill.forEach((us) => {
      const skillId = us.skill.id;
      const existing = skillCounts.get(skillId);
      if (existing) {
        existing.count += 1;
      } else {
        skillCounts.set(skillId, {
          name: us.skill.name,
          count: 1,
          category: us.skill.category,
          color: us.skill.color,
        });
      }
    });
  });

  const skillsDistribution = Array.from(skillCounts.entries()).map(([skillId, data]) => ({
    skillId,
    skillName: data.name,
    count: data.count,
    category: data.category,
    color: data.color,
  }));

  // Calculate skills by category
  const skillsByCategory = {
    hard: skillsDistribution.filter((s) => s.category === "hard").length,
    soft: skillsDistribution.filter((s) => s.category === "soft").length,
  };

  // Calculate average skills per employee
  const totalSkills = employeesWithActiveSkills.reduce(
    (sum, emp) => sum + emp.user_skill.length,
    0
  );
  const averageSkillsPerEmployee =
    employeesWithActiveSkills.length > 0 ? totalSkills / employeesWithActiveSkills.length : 0;

  // Calculate seniority distribution per skill
  const skillSeniorityMap = new Map<
    string,
    {
      name: string;
      junior: number;
      middle: number;
      senior: number;
    }
  >();

  employeesWithActiveSkills.forEach((emp) => {
    emp.user_skill.forEach((us) => {
      const skillId = us.skill.id;
      const existing = skillSeniorityMap.get(skillId);
      if (existing) {
        existing[us.seniorityLevel] += 1;
      } else {
        skillSeniorityMap.set(skillId, {
          name: us.skill.name,
          junior: us.seniorityLevel === "junior" ? 1 : 0,
          middle: us.seniorityLevel === "middle" ? 1 : 0,
          senior: us.seniorityLevel === "senior" ? 1 : 0,
        });
      }
    });
  });

  const seniorityDistributionPerSkill = Array.from(skillSeniorityMap.entries()).map(
    ([skillId, data]) => ({
      skillId,
      skillName: data.name,
      junior: data.junior,
      middle: data.middle,
      senior: data.senior,
    })
  );

  return {
    employeeCountBySeniority,
    skillsDistribution,
    skillsByCategory,
    averageSkillsPerEmployee,
    seniorityDistributionPerSkill,
    totalEmployees: employeesWithActiveSkills.length,
    totalSkills: skillsDistribution.length,
  };
}
