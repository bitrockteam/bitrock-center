import EmployeesSkillsList from "@/components/skills/employees-skills-list";
import SkillsAdminSection from "@/components/skills/skills-admin-section";
import SkillsHeader from "@/components/skills/skills-header";
import StatsTab from "@/components/skills/stats-tab";
import TeamBuilderTab from "@/components/skills/team-builder-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserInfoFromCookie } from "@/utils/supabase/server";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Skills | Bitrock Hours",
  description: "Gestione delle competenze aziendali",
};

export default async function SkillsPage() {
  const currentUser = await getUserInfoFromCookie();
  const canManageSkills = currentUser.role === "Admin" || currentUser.role === "Manager";

  return (
    <div className="space-y-6">
      <SkillsHeader />

      <Tabs defaultValue="employees" className="space-y-6">
        <TabsList className="grid min-w-md grid-cols-4">
          <TabsTrigger value="employees" className="transition-all duration-300">
            Skills Dipendenti
          </TabsTrigger>
          <TabsTrigger value="stats" className="transition-all duration-300">
            Stats
          </TabsTrigger>
          <TabsTrigger value="team-builder" className="transition-all duration-300">
            Team Builder
          </TabsTrigger>
          <TabsTrigger value="admin" className="transition-all duration-300">
            Gestisci
          </TabsTrigger>
        </TabsList>
        <TabsContent value="employees" className="space-y-6 mt-6">
          <EmployeesSkillsList canManageSkills={canManageSkills} />
        </TabsContent>
        <TabsContent value="stats" className="space-y-6 mt-6">
          <StatsTab />
        </TabsContent>
        <TabsContent value="team-builder" className="space-y-6 mt-6">
          <TeamBuilderTab />
        </TabsContent>
        <TabsContent value="admin" className="space-y-6 mt-6">
          <SkillsAdminSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
