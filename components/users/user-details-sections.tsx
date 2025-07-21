import { getContractByEmployeeId } from "@/app/server-actions/contract/getContractByEmployeeId";
import { GetLatestEmployeeDevelopmentPlan } from "@/app/server-actions/development-plan/getLatestEmployeeDevelopmentPlan";
import { FindUserById } from "@/app/server-actions/user/findUserById";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApi } from "@/hooks/useApi";
import { useEffect, useRef } from "react";
import ContractDetail from "./contract-detail";
import UserDetailsActivity from "./user-details-sections/user-details-activity";
import UserDetailsDevelopment from "./user-details-sections/user-details-development";
import UserDetailsOverview from "./user-details-sections/user-details-overview";
import UserDetailsSkills from "./user-details-sections/user-details-skills";

type ContractResponse = Awaited<ReturnType<typeof getContractByEmployeeId>>;

export default function UserDetailsSections({ user }: { user: FindUserById }) {
  const { data: activePlan, callApi: fetchDevelopmentPlan } =
    useApi<GetLatestEmployeeDevelopmentPlan>();
  const { data: contract, callApi: fetchContract } = useApi<ContractResponse>();

  const userIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (user?.id && userIdRef.current !== user.id) {
      userIdRef.current = user.id;
      fetchDevelopmentPlan(
        `/api/user/development-plan/latest?userId=${user.id}`,
      );
      fetchContract(`/api/user/contract?employeeId=${user.id}`);
    }
  }, [user?.id, fetchDevelopmentPlan, fetchContract]);

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
        <ContractDetail
          contract={contract}
          canEdit
          canView
          employeeId={user.id}
        />
      </TabsContent>
    </Tabs>
  );
}
