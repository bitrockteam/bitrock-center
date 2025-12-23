import type { SkillCategory } from "@/db";

// Cool colors for Hard Skills (blue, green, gray, cyan, teal, etc.)
export const coolColors = [
  "oklch(0.7 0.15 220)", // Light Blue
  "oklch(0.65 0.2 250)", // Blue
  "oklch(0.6 0.2 260)", // Deep Blue
  "oklch(0.7 0.15 180)", // Cyan
  "oklch(0.65 0.18 200)", // Teal
  "oklch(0.7 0.15 150)", // Green
  "oklch(0.65 0.2 160)", // Emerald
  "oklch(0.6 0.18 170)", // Dark Green
  "oklch(0.65 0.15 240)", // Sky Blue
  "oklch(0.7 0.12 210)", // Light Cyan
  "oklch(0.6 0.2 230)", // Navy Blue
  "oklch(0.65 0.15 190)", // Aqua
  "oklch(0.7 0.1 200)", // Pale Blue
  "oklch(0.6 0.18 250)", // Royal Blue
  "oklch(0.65 0.2 220)", // Steel Blue
];

// Warm colors for Soft Skills (red, orange, yellow, pink, etc.)
export const warmColors = [
  "oklch(0.7 0.2 30)", // Orange
  "oklch(0.65 0.2 40)", // Deep Orange
  "oklch(0.6 0.2 20)", // Red-Orange
  "oklch(0.7 0.18 60)", // Yellow
  "oklch(0.65 0.2 50)", // Amber
  "oklch(0.6 0.2 0)", // Red
  "oklch(0.65 0.2 10)", // Crimson
  "oklch(0.7 0.18 15)", // Coral
  "oklch(0.65 0.2 25)", // Tangerine
  "oklch(0.6 0.18 5)", // Dark Red
  "oklch(0.7 0.15 35)", // Peach
  "oklch(0.65 0.2 45)", // Gold
  "oklch(0.6 0.18 55)", // Dark Yellow
  "oklch(0.7 0.2 20)", // Light Red
  "oklch(0.65 0.18 30)", // Salmon
];

// Default fallback colors
export const defaultCategoryColors: Record<SkillCategory, string> = {
  hard: "oklch(0.7 0.15 220)", // Light Blue
  soft: "oklch(0.7 0.2 30)", // Orange
};

/**
 * Get color for a skill, using the skill's color if available,
 * otherwise falling back to category default
 */
export const getSkillColor = (
  skillColor: string | null | undefined,
  category: SkillCategory
): string => {
  if (skillColor) {
    return skillColor;
  }
  return defaultCategoryColors[category];
};

/**
 * Get available colors for a category
 */
export const getAvailableColors = (category: SkillCategory): string[] => {
  return category === "hard" ? coolColors : warmColors;
};
