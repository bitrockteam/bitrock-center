import { TeamMember } from "@/components/team/types";
import { useCallback, useState } from "react";

export const useOptimisticTeam = (initialTeamMembers: TeamMember[]) => {
  const [optimisticTeamMembers, setOptimisticTeamMembers] =
    useState<TeamMember[]>(initialTeamMembers);

  const addMemberOptimistically = useCallback((member: TeamMember) => {
    setOptimisticTeamMembers((prev) => [...prev, member]);
  }, []);

  const removeMemberOptimistically = useCallback((memberId: string) => {
    setOptimisticTeamMembers((prev) =>
      prev.filter((member) => member.id !== memberId),
    );
  }, []);

  const syncWithServerData = useCallback((serverData: TeamMember[]) => {
    setOptimisticTeamMembers(serverData);
  }, []);

  return {
    optimisticTeamMembers,
    addMemberOptimistically,
    removeMemberOptimistically,
    syncWithServerData,
  };
};
