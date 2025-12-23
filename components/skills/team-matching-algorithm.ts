import type { SeniorityLevel } from "@/db";
import type { EmployeeWithAvailability } from "@/app/server-actions/skills/getTeamBuilderData";

export type TeamRequirement = {
  skillId: string;
  seniorityLevel: SeniorityLevel;
};

export type TeamBuilderCriteria = {
  requirements: TeamRequirement[];
  minResources: number;
  maxResources: number;
  minOverallSeniority: SeniorityLevel;
};

export type MatchedEmployee = EmployeeWithAvailability & {
  matchScore: number;
  perfectMatches: number;
  skillMatches: number;
  seniorityBonus: number;
};

const seniorityValues: Record<SeniorityLevel, number> = {
  junior: 1,
  middle: 2,
  senior: 3,
};

function getSeniorityValue(level: SeniorityLevel): number {
  return seniorityValues[level];
}

function meetsMinSeniority(
  employee: EmployeeWithAvailability,
  minSeniority: SeniorityLevel
): boolean {
  return employee.averageSeniority >= getSeniorityValue(minSeniority);
}

function calculateMatchScore(
  employee: EmployeeWithAvailability,
  requirements: TeamRequirement[],
  minOverallSeniority: SeniorityLevel
): {
  matchScore: number;
  perfectMatches: number;
  skillMatches: number;
  seniorityBonus: number;
} {
  let perfectMatches = 0;
  let skillMatches = 0;
  let seniorityBonus = 0;

  // Check each requirement
  for (const requirement of requirements) {
    const employeeSkill = employee.user_skill.find((us) => us.skill.id === requirement.skillId);

    if (employeeSkill) {
      // Perfect match: skill + exact seniority
      if (employeeSkill.seniorityLevel === requirement.seniorityLevel) {
        perfectMatches += 1;
      } else {
        // Skill match: has skill but different seniority
        skillMatches += 1;
      }
    }
  }

  // Calculate seniority bonus
  if (meetsMinSeniority(employee, minOverallSeniority)) {
    const minSeniorityValue = getSeniorityValue(minOverallSeniority);
    const bonus = (employee.averageSeniority - minSeniorityValue) * 10;
    seniorityBonus = Math.max(0, bonus);
  }

  // Calculate total score
  // Perfect match: 100 points per match
  // Skill match: 50 points per match
  // Seniority bonus: up to 30 points
  const matchScore = perfectMatches * 100 + skillMatches * 50 + Math.min(30, seniorityBonus);

  return {
    matchScore,
    perfectMatches,
    skillMatches,
    seniorityBonus: Math.min(30, seniorityBonus),
  };
}

export function matchEmployeesToTeam(
  employees: EmployeeWithAvailability[],
  criteria: TeamBuilderCriteria
): MatchedEmployee[] {
  const { requirements, minOverallSeniority } = criteria;

  // Filter eligible employees
  const eligibleEmployees = employees.filter((emp) => {
    // Must meet minimum overall seniority
    if (!meetsMinSeniority(emp, minOverallSeniority)) {
      return false;
    }

    // Must have at least one required skill
    const hasRequiredSkill = requirements.some((req) =>
      emp.user_skill.some((us) => us.skill.id === req.skillId)
    );

    return hasRequiredSkill;
  });

  // Calculate match scores for each employee
  const matchedEmployees: MatchedEmployee[] = eligibleEmployees.map((emp) => {
    const scoreData = calculateMatchScore(emp, requirements, minOverallSeniority);

    return {
      ...emp,
      ...scoreData,
    };
  });

  // Sort by match score (descending), then by perfect matches, then by skill matches
  matchedEmployees.sort((a, b) => {
    if (b.matchScore !== a.matchScore) {
      return b.matchScore - a.matchScore;
    }
    if (b.perfectMatches !== a.perfectMatches) {
      return b.perfectMatches - a.perfectMatches;
    }
    return b.skillMatches - a.skillMatches;
  });

  return matchedEmployees;
}

export function getSeniorityLabel(level: SeniorityLevel): string {
  switch (level) {
    case "junior":
      return "Junior";
    case "middle":
      return "Middle";
    case "senior":
      return "Senior";
    default:
      return level;
  }
}

export function getAvailabilityLabel(status: "available" | "available_soon" | "occupied"): string {
  switch (status) {
    case "available":
      return "Available";
    case "available_soon":
      return "Available Soon";
    case "occupied":
      return "Occupied";
    default:
      return status;
  }
}

export function getAvailabilityColor(status: "available" | "available_soon" | "occupied"): string {
  switch (status) {
    case "available":
      return "bg-green-500";
    case "available_soon":
      return "bg-yellow-500";
    case "occupied":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
}
