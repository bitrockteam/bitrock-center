import { fetchMyTeam } from "@/api/server/user/fetchMyTeam";
import { fetchTeam } from "@/api/server/user/fetchTeam";
import { TeamMemberContainer } from "@/components/team/team-member-container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Consuntivazione | Bitrock Hours",
  description: "Gestione delle ore lavorate",
};

export default async function Team() {
  const myTeam = await fetchMyTeam();
  const team = await fetchTeam();
  return (
    <TeamMemberContainer
      myTeam={myTeam}
      team={team}
      isOwner={myTeam.length > 0}
    />
  );
}
