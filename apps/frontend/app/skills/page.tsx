import EmployeesSkillsList from "@/components/skills/employees-skills-list";
import SkillsHeader from "@/components/skills/skills-header";
import SkillsOverview from "@/components/skills/skills-overview";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Skills | Bitrock Hours",
  description: "Gestione delle competenze aziendali",
};

export default function SkillsPage() {
  return (
    <div className="space-y-6">
      <SkillsHeader />
      <SkillsOverview />
      <EmployeesSkillsList />
    </div>
  );
}
