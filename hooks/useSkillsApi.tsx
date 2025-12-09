"use client";

import type { SeniorityLevel } from "@/db";
import { useApi } from "./useApi";

// Types for API responses
export interface Skill {
  id: string;
  name: string;
  description: string | null;
  category: "hard" | "soft";
  icon: string;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface EmployeeSkill {
  id: string;
  name: string;
  role: string;
  avatar_url: string | null;
  user_skill: Array<{
    skill_id: string;
    seniorityLevel: SeniorityLevel;
    skill: Skill;
  }>;
}

export interface EmployeeWithSkills {
  id: string;
  name: string;
  role: string;
  avatar_url: string | null;
  user_skill: Array<{
    skill_id: string;
    seniorityLevel: SeniorityLevel;
    skill: {
      id: string;
      name: string;
      category: "hard" | "soft";
      description: string | null;
      icon: string;
      active: boolean;
      created_at: Date;
      updated_at: Date;
    };
  }>;
}

// Hook for fetching employees with skills
export const useEmployeesWithSkills = () => {
  return useApi<EmployeeWithSkills[]>();
};

// Hook for fetching skills catalog
export const useSkillsCatalog = () => {
  return useApi<Skill[]>();
};

// Hook for fetching employee by ID with skills
export const useEmployeeWithSkillsById = () => {
  return useApi<EmployeeWithSkills>();
};

// Hook for creating a new skill
export const useCreateSkill = () => {
  return useApi<Skill>();
};

// Hook for updating a skill
export const useUpdateSkill = () => {
  return useApi<Skill>();
};

// Hook for deleting a skill
export const useDeleteSkill = () => {
  return useApi<void>();
};

// Hook for toggling skill active status
export const useToggleSkillActive = () => {
  return useApi<void>();
};

// Hook for adding skill to employee
export const useAddSkillToEmployee = () => {
  return useApi<void>();
};

// Hook for removing skill from employee
export const useRemoveSkillFromEmployee = () => {
  return useApi<void>();
};

// Hook for updating employee skill level
export const useUpdateEmployeeSkillLevel = () => {
  return useApi<void>();
};

// API functions
export const skillsApi = {
  // Fetch employees with skills
  fetchEmployeesWithSkills: async (api: ReturnType<typeof useApi>) => {
    return api.callApi("/api/skills/employees");
  },

  // Fetch skills catalog
  fetchSkillsCatalog: async (api: ReturnType<typeof useApi>) => {
    return api.callApi("/api/skills/catalog");
  },

  // Fetch employee by ID with skills
  fetchEmployeeWithSkillsById: async (api: ReturnType<typeof useApi>, id: string) => {
    return api.callApi(`/api/skills/employee/${id}`);
  },

  // Create new skill
  createSkill: async (
    api: ReturnType<typeof useApi>,
    data: {
      name: string;
      category: "hard" | "soft";
      description?: string;
      icon: string;
      active: boolean;
    }
  ) => {
    return api.callApi("/api/skills/create", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Update skill
  updateSkill: async (
    api: ReturnType<typeof useApi>,
    data: {
      id: string;
      name: string;
      category: "hard" | "soft";
      description?: string;
      icon: string;
      active: boolean;
    }
  ) => {
    return api.callApi("/api/skills/update", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // Delete skill
  deleteSkill: async (api: ReturnType<typeof useApi>, id: string) => {
    return api.callApi("/api/skills/delete", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
  },

  // Toggle skill active status
  toggleSkillActive: async (api: ReturnType<typeof useApi>, id: string, active: boolean) => {
    return api.callApi("/api/skills/toggle-active", {
      method: "PATCH",
      body: JSON.stringify({ id, active }),
    });
  },

  // Add skill to employee
  addSkillToEmployee: async (
    api: ReturnType<typeof useApi>,
    data: {
      employeeId: string;
      skillId: string;
      seniorityLevel: SeniorityLevel;
    }
  ) => {
    return api.callApi("/api/skills/employee/add", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Remove skill from employee
  removeSkillFromEmployee: async (
    api: ReturnType<typeof useApi>,
    data: {
      employeeId: string;
      skillId: string;
    }
  ) => {
    return api.callApi("/api/skills/employee/remove", {
      method: "DELETE",
      body: JSON.stringify(data),
    });
  },

  // Update employee skill level
  updateEmployeeSkillLevel: async (
    api: ReturnType<typeof useApi>,
    data: {
      employeeId: string;
      skillId: string;
      seniorityLevel: SeniorityLevel;
    }
  ) => {
    return api.callApi("/api/skills/employee/update-level", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
};
