import EmployeeSkillDetail from "@/components/skills/employee-skill-detail";
import type { Metadata } from "next";

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
  return (
    <div className="space-y-6">
      <EmployeeSkillDetail id={id} />
    </div>
  );
}
