import EmployeeSkillDetail from "@/components/skills/employee-skill-detail";
import SkillDetail from "@/components/skills/skill-detail";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Skills | Bitrock Hours",
  description: "Dettagli skill o competenze dipendente",
};

export default async function SkillDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Use environment variable or fallback to localhost
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // First, try to fetch as a skill
  try {
    const skillRes = await fetch(`${baseUrl}/api/skills/${id}`, {
      cache: "no-store",
    });

    if (skillRes.ok) {
      const skillJson = await skillRes.json();
      const skill = skillJson.success ? skillJson.data : null;

      if (skill) {
        return (
          <div className="space-y-6">
            <SkillDetail skill={skill} />
          </div>
        );
      }
    }
  } catch (error) {
    // If skill fetch fails, continue to try employee fetch
    console.log("Skill fetch failed, trying employee fetch:", error);
  }

  // If skill fetch failed, try to fetch as an employee (backward compatibility)
  try {
    const employeeRes = await fetch(`${baseUrl}/api/skills/employee/${id}`, {
      cache: "no-store",
    });

    if (employeeRes.ok) {
      const employeeJson = await employeeRes.json();
      const employee = employeeJson.success ? employeeJson.data : null;

      if (employee) {
        return (
          <div className="space-y-6">
            <EmployeeSkillDetail employee={employee} />
          </div>
        );
      }
    }
  } catch (error) {
    console.error("Error fetching employee:", error);
  }

  // If both fail, show not found
  notFound();
}
