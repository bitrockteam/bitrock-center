import { getEmployeeWithSkillsById } from "@/api/server/skills/getEmployeeWithSkillsById";
import EmployeeSkillDetail from "@/components/skills/employee-skill-detail";
import type { Metadata } from "next";

// export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Competenze Dipendente | Bitrock Hours",
  description: "Gestione delle competenze del dipendente",
};

export default async function EmployeeSkillDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const employee = await getEmployeeWithSkillsById(id);
  return (
    <div className="space-y-6">
      <EmployeeSkillDetail employee={employee} />
    </div>
  );
}
