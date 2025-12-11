import { fetchOwnerTeamAllocationsRecap } from "@/app/server-actions/team/fetchOwnerTeamAllocationsRecap";
import { fetchTeamAllocationsRecap } from "@/app/server-actions/team/fetchTeamAllocationsRecap";
import { fetchTeam } from "@/app/server-actions/user/fetchMyTeam";
import { fetchMyTeam } from "@/app/server-actions/user/fetchTeam";
import { TeamMemberContainer } from "@/components/team/team-member-container";
import { getUserInfoFromCookie } from "@/utils/supabase/server";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Team | Bitrock Center",
  description: "Gestione del team e dei membri",
};

export default async function TeamPage() {
  try {
    const user = await getUserInfoFromCookie();
    const teamMembers = await fetchTeam();
    const myTeamData = await fetchMyTeam();
    const allocationsRecap = await fetchTeamAllocationsRecap();
    const ownerTeamAllocationsRecap = await fetchOwnerTeamAllocationsRecap();

    return (
      <TeamMemberContainer
        myTeam={myTeamData}
        team={teamMembers}
        isOwner={teamMembers.length > 0}
        user={user}
        allocationsRecap={allocationsRecap}
        ownerTeamAllocationsRecap={ownerTeamAllocationsRecap}
      />
    );
  } catch (error) {
    console.error("Error loading team data:", error);
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <h1 className="text-2xl font-semibold text-destructive">
          Errore nel caricamento del team
        </h1>
        <p className="text-muted-foreground">
          Si è verificato un errore durante il caricamento dei dati del team.
        </p>
      </div>
    );
  }
}
