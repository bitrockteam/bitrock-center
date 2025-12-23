"use client";

import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { SkillsStats } from "@/app/server-actions/skills/getSkillsStats";
import { getSeniorityLevelLabel } from "./utils";
import { getSkillColor, defaultCategoryColors } from "./color-palette";

// Standard color palette for charts - vibrant colors that work in both light and dark modes
const seniorityColors = {
  junior: "oklch(0.7 0.15 150)", // Green
  middle: "oklch(0.65 0.2 250)", // Blue
  senior: "oklch(0.6 0.2 30)", // Orange/Red
};

const categoryColors = {
  hard: defaultCategoryColors.hard,
  soft: defaultCategoryColors.soft,
};

type ChartProps = {
  stats: SkillsStats;
};

export const EmployeeSeniorityChart = ({ stats }: ChartProps) => {
  const chartConfig = {
    junior: {
      label: "Junior",
      color: seniorityColors.junior,
    },
    middle: {
      label: "Middle",
      color: seniorityColors.middle,
    },
    senior: {
      label: "Senior",
      color: seniorityColors.senior,
    },
  } satisfies ChartConfig;

  const data = stats.employeeCountBySeniority.map((item) => ({
    seniority: getSeniorityLevelLabel(item.seniority),
    count: item.count,
    fill: `var(--color-${item.seniority})`,
  }));

  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="seniority" tickLine={false} tickMargin={10} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="count" radius={4}>
          {data.map((entry, index) => (
            <Cell key={`cell-${entry.seniority}-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
};

export const TopSkillsChart = ({ stats }: ChartProps) => {
  // Get top 10 skills
  const topSkills = [...stats.skillsDistribution].sort((a, b) => b.count - a.count).slice(0, 10);

  const chartConfig = topSkills.reduce((acc, skill) => {
    const skillColor = getSkillColor(skill.color, skill.category);
    acc[skill.skillId] = {
      label: skill.skillName,
      color: skillColor,
    };
    return acc;
  }, {} as ChartConfig);

  const data = topSkills.map((skill) => {
    return {
      skill: skill.skillName,
      count: skill.count,
      fill: `var(--color-${skill.skillId})`,
    };
  });

  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <BarChart accessibilityLayer data={data} layout="vertical" margin={{ left: 20 }}>
        <CartesianGrid horizontal={false} />
        <XAxis type="number" tickLine={false} axisLine={false} />
        <YAxis dataKey="skill" type="category" tickLine={false} axisLine={false} width={150} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="count" radius={4}>
          {data.map((entry, index) => (
            <Cell key={`cell-${entry.skill}-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
};

export const SkillsByCategoryChart = ({ stats }: ChartProps) => {
  const chartConfig = {
    hard: {
      label: "Hard Skills",
      color: categoryColors.hard,
    },
    soft: {
      label: "Soft Skills",
      color: categoryColors.soft,
    },
  } satisfies ChartConfig;

  const data = [
    {
      category: "Hard Skills",
      count: stats.skillsByCategory.hard,
      fill: "var(--color-hard)",
    },
    {
      category: "Soft Skills",
      count: stats.skillsByCategory.soft,
      fill: "var(--color-soft)",
    },
  ];

  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent />} />
        <Pie
          data={data}
          dataKey="count"
          nameKey="category"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${entry.category}-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <ChartLegend content={<ChartLegendContent />} />
      </PieChart>
    </ChartContainer>
  );
};

export const AverageSkillsChart = ({ stats }: ChartProps) => {
  const chartConfig = {
    average: {
      label: "Average Skills per Employee",
      color: "oklch(0.65 0.2 250)", // Blue
    },
  } satisfies ChartConfig;

  const data = [
    {
      metric: "Average",
      value: Number(stats.averageSkillsPerEmployee.toFixed(2)),
      fill: "var(--color-average)",
    },
  ];

  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="metric" tickLine={false} tickMargin={10} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="value" fill="var(--color-average)" radius={4}>
          {data.map((entry, index) => (
            <Cell key={`cell-${entry.metric}-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
};

export const SeniorityPerSkillChart = ({ stats }: ChartProps) => {
  // Get top 10 skills by total count
  const topSkills = [...stats.seniorityDistributionPerSkill]
    .sort((a, b) => b.junior + b.middle + b.senior - (a.junior + a.middle + a.senior))
    .slice(0, 10);

  const chartConfig = {
    junior: {
      label: "Junior",
      color: seniorityColors.junior,
    },
    middle: {
      label: "Middle",
      color: seniorityColors.middle,
    },
    senior: {
      label: "Senior",
      color: seniorityColors.senior,
    },
  } satisfies ChartConfig;

  const data = topSkills.map((skill) => ({
    skill: skill.skillName,
    junior: skill.junior,
    middle: skill.middle,
    senior: skill.senior,
  }));

  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="skill"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          angle={-45}
          textAnchor="end"
          height={100}
        />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="junior" stackId="a" fill="var(--color-junior)" />
        <Bar dataKey="middle" stackId="a" fill="var(--color-middle)" />
        <Bar dataKey="senior" stackId="a" fill="var(--color-senior)" />
      </BarChart>
    </ChartContainer>
  );
};
