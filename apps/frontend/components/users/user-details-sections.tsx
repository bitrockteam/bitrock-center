import { getContractByEmployeeId } from "@/api/server/contract/getContractByEmployeeId";
import { getLatestEmployeeDevelopmentPlan } from "@/api/server/development-plan/getLatestEmployeeDevelopmentPlan";
import { FindUserById } from "@/api/server/user/findUserById";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useServerAction } from "@/hooks/useServerAction";
import { useEffect } from "react";
import ContractDetail from "./contract-detail";
import UserDetailsActivity from "./user-details-sections/user-details-activity";
import UserDetailsDevelopment from "./user-details-sections/user-details-development";
import UserDetailsOverview from "./user-details-sections/user-details-overview";
import UserDetailsSkills from "./user-details-sections/user-details-skills";

export default function UserDetailsSections({ user }: { user: FindUserById }) {
  const [activePlan, getDevelopmentPlan] = useServerAction(
    getLatestEmployeeDevelopmentPlan,
  );

  const [contract, getContract] = useServerAction(getContractByEmployeeId);

  useEffect(() => {
    if (user?.id) getDevelopmentPlan(user.id);
  }, [getDevelopmentPlan, user?.id]);

  useEffect(() => {
    if (user?.id) getContract(user.id);
  }, [getContract, user?.id]);

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Nessun utente trovato</p>
      </div>
    );
  }

  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="overview">Panoramica</TabsTrigger>
        <TabsTrigger value="skills">Competenze</TabsTrigger>
        <TabsTrigger value="development">Sviluppo</TabsTrigger>
        <TabsTrigger value="activity">Attività</TabsTrigger>
        <TabsTrigger value="contract">Contratto</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <UserDetailsOverview user={user} plan={activePlan} />
      </TabsContent>
      <TabsContent value="skills" className="space-y-6">
        <UserDetailsSkills user={user} />
      </TabsContent>
      <TabsContent value="development" className="space-y-6">
        <UserDetailsDevelopment plan={activePlan} />
      </TabsContent>
      <TabsContent value="activity" className="space-y-6">
        <UserDetailsActivity />
      </TabsContent>
      <TabsContent value="contract">
        <ContractDetail contract={contract} canEdit canView />
      </TabsContent>
    </Tabs>
  );
}
