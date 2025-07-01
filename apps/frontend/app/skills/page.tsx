import EmployeesSkillsList from "@/components/skills/employees-skills-list";
import SkillsAdminSection from "@/components/skills/skills-admin-section";
import SkillsHeader from "@/components/skills/skills-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Skills | Bitrock Hours",
  description: "Gestione delle competenze aziendali",
};

export default function SkillsPage() {
  return (
    <div className="space-y-6">
      <SkillsHeader />

      <Tabs defaultValue="employees" className="space-y-6">
        <TabsList className="grid min-w-md grid-cols-2">
          <TabsTrigger value="employees">Skills Dipendenti</TabsTrigger>
          <TabsTrigger value="admin">Gestisci</TabsTrigger>
        </TabsList>
        <TabsContent value="employees" className="space-y-6">
          <EmployeesSkillsList />
        </TabsContent>
        <TabsContent value="admin" className="space-y-6">
          <SkillsAdminSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
